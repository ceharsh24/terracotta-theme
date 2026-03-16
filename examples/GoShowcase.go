package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"math"
	"net/http"
	"os"
	"sync"
	"sync/atomic"
	"time"
)

// ── Constants and package-level vars ────────────────────────────────

const (
	MaxRetries     = 3
	DefaultTimeout = 30 * time.Second
	BufferSize     = 1024
	Version        = "2.1.0"
)

var (
	ErrNotFound     = errors.New("resource not found")
	ErrUnauthorized = errors.New("unauthorized access")
	ErrRateLimit    = errors.New("rate limit exceeded")
	logger          = slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelDebug}))
)

// ── Interfaces ──────────────────────────────────────────────────────

type Serializer interface {
	Marshal() ([]byte, error)
	Unmarshal(data []byte) error
}

type Repository[T any] interface {
	FindByID(ctx context.Context, id string) (T, error)
	FindAll(ctx context.Context, opts QueryOptions) ([]T, error)
	Save(ctx context.Context, entity T) error
	Delete(ctx context.Context, id string) error
}

type Middleware func(http.Handler) http.Handler

// ── Custom types ────────────────────────────────────────────────────

type Priority int

const (
	PriorityLow Priority = iota
	PriorityMedium
	PriorityHigh
	PriorityCritical
)

func (p Priority) String() string {
	names := [...]string{"low", "medium", "high", "critical"}
	if int(p) >= len(names) {
		return fmt.Sprintf("Priority(%d)", p)
	}
	return names[p]
}

type Status string

const (
	StatusPending   Status = "pending"
	StatusRunning   Status = "running"
	StatusCompleted Status = "completed"
	StatusFailed    Status = "failed"
)

// ── Structs ─────────────────────────────────────────────────────────

type QueryOptions struct {
	Limit  int               `json:"limit"`
	Offset int               `json:"offset"`
	Sort   string            `json:"sort,omitempty"`
	Filter map[string]string `json:"filter,omitempty"`
}

type User struct {
	ID        string            `json:"id"`
	Name      string            `json:"name"`
	Email     string            `json:"email"`
	Role      string            `json:"role"`
	Tags      []string          `json:"tags,omitempty"`
	Metadata  map[string]any    `json:"metadata,omitempty"`
	CreatedAt time.Time         `json:"created_at"`
	UpdatedAt *time.Time        `json:"updated_at,omitempty"`
}

func (u *User) Marshal() ([]byte, error) {
	return json.Marshal(u)
}

func (u *User) Unmarshal(data []byte) error {
	return json.Unmarshal(data, u)
}

func (u *User) Validate() error {
	if u.Name == "" {
		return fmt.Errorf("name is required")
	}
	if u.Email == "" {
		return fmt.Errorf("email is required")
	}
	if len(u.Name) > 255 {
		return fmt.Errorf("name too long: %d > 255", len(u.Name))
	}
	return nil
}

// ── Generic types ───────────────────────────────────────────────────

type Result[T any] struct {
	Value T
	Err   error
}

func NewResult[T any](value T, err error) Result[T] {
	return Result[T]{Value: value, Err: err}
}

func (r Result[T]) Unwrap() (T, error) {
	return r.Value, r.Err
}

func (r Result[T]) UnwrapOr(fallback T) T {
	if r.Err != nil {
		return fallback
	}
	return r.Value
}

func Map[T any, U any](items []T, fn func(T) U) []U {
	result := make([]U, len(items))
	for i, item := range items {
		result[i] = fn(item)
	}
	return result
}

func Filter[T any](items []T, predicate func(T) bool) []T {
	result := make([]T, 0, len(items)/2)
	for _, item := range items {
		if predicate(item) {
			result = append(result, item)
		}
	}
	return result
}

func Reduce[T any, U any](items []T, initial U, fn func(U, T) U) U {
	acc := initial
	for _, item := range items {
		acc = fn(acc, item)
	}
	return acc
}

// ── Concurrent worker pool ──────────────────────────────────────────

type WorkerPool[T any, R any] struct {
	workers    int
	taskCh     chan T
	resultCh   chan Result[R]
	handler    func(context.Context, T) (R, error)
	processed  atomic.Int64
	wg         sync.WaitGroup
}

func NewWorkerPool[T any, R any](workers int, handler func(context.Context, T) (R, error)) *WorkerPool[T, R] {
	return &WorkerPool[T, R]{
		workers:  workers,
		taskCh:   make(chan T, workers*2),
		resultCh: make(chan Result[R], workers*2),
		handler:  handler,
	}
}

func (wp *WorkerPool[T, R]) Start(ctx context.Context) {
	for i := 0; i < wp.workers; i++ {
		wp.wg.Add(1)
		go func(workerID int) {
			defer wp.wg.Done()
			logger.Info("worker started", "id", workerID)

			for {
				select {
				case <-ctx.Done():
					logger.Info("worker stopping", "id", workerID, "reason", ctx.Err())
					return
				case task, ok := <-wp.taskCh:
					if !ok {
						return
					}
					result, err := wp.handler(ctx, task)
					wp.processed.Add(1)
					wp.resultCh <- NewResult(result, err)
				}
			}
		}(i)
	}
}

func (wp *WorkerPool[T, R]) Submit(task T) {
	wp.taskCh <- task
}

func (wp *WorkerPool[T, R]) Results() <-chan Result[R] {
	return wp.resultCh
}

func (wp *WorkerPool[T, R]) Shutdown() {
	close(wp.taskCh)
	wp.wg.Wait()
	close(wp.resultCh)
}

// ── HTTP middleware chain ───────────────────────────────────────────

func WithLogging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		logger.Info("request started",
			"method", r.Method,
			"path", r.URL.Path,
			"remote", r.RemoteAddr,
		)

		next.ServeHTTP(w, r)

		logger.Info("request completed",
			"method", r.Method,
			"path", r.URL.Path,
			"duration", time.Since(start),
		)
	})
}

func WithRecovery(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				logger.Error("panic recovered", "error", err, "path", r.URL.Path)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func WithTimeout(timeout time.Duration) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx, cancel := context.WithTimeout(r.Context(), timeout)
			defer cancel()
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func Chain(middlewares ...Middleware) Middleware {
	return func(final http.Handler) http.Handler {
		for i := len(middlewares) - 1; i >= 0; i-- {
			final = middlewares[i](final)
		}
		return final
	}
}

// ── HTTP handler with error handling ────────────────────────────────

type APIHandler struct {
	users map[string]*User
	mu    sync.RWMutex
}

func NewAPIHandler() *APIHandler {
	return &APIHandler{users: make(map[string]*User)}
}

func (h *APIHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var err error

	switch {
	case r.Method == http.MethodGet && r.URL.Path == "/api/users":
		err = h.handleListUsers(w, r)
	case r.Method == http.MethodPost && r.URL.Path == "/api/users":
		err = h.handleCreateUser(w, r)
	default:
		http.NotFound(w, r)
		return
	}

	if err != nil {
		status := http.StatusInternalServerError
		switch {
		case errors.Is(err, ErrNotFound):
			status = http.StatusNotFound
		case errors.Is(err, ErrUnauthorized):
			status = http.StatusUnauthorized
		case errors.Is(err, ErrRateLimit):
			status = http.StatusTooManyRequests
		}
		http.Error(w, err.Error(), status)
	}
}

func (h *APIHandler) handleListUsers(w http.ResponseWriter, _ *http.Request) error {
	h.mu.RLock()
	defer h.mu.RUnlock()

	users := make([]*User, 0, len(h.users))
	for _, u := range h.users {
		users = append(users, u)
	}

	w.Header().Set("Content-Type", "application/json")
	return json.NewEncoder(w).Encode(users)
}

func (h *APIHandler) handleCreateUser(w http.ResponseWriter, r *http.Request) error {
	body, err := io.ReadAll(io.LimitReader(r.Body, 1<<20))
	if err != nil {
		return fmt.Errorf("reading body: %w", err)
	}
	defer r.Body.Close()

	var user User
	if err := json.Unmarshal(body, &user); err != nil {
		return fmt.Errorf("invalid JSON: %w", err)
	}

	if err := user.Validate(); err != nil {
		return fmt.Errorf("validation: %w", err)
	}

	h.mu.Lock()
	h.users[user.ID] = &user
	h.mu.Unlock()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	return json.NewEncoder(w).Encode(&user)
}

// ── Math utilities ──────────────────────────────────────────────────

func Clamp[T int | float64](value, min, max T) T {
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
}

func Distance(x1, y1, x2, y2 float64) float64 {
	dx := x2 - x1
	dy := y2 - y1
	return math.Sqrt(dx*dx + dy*dy)
}

// ── Main ────────────────────────────────────────────────────────────

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel()

	pool := NewWorkerPool[string, int](4, func(ctx context.Context, task string) (int, error) {
		select {
		case <-ctx.Done():
			return 0, ctx.Err()
		case <-time.After(10 * time.Millisecond):
			return len(task), nil
		}
	})

	pool.Start(ctx)

	tasks := []string{"hello", "world", "terracotta", "theme", "golang"}
	for _, t := range tasks {
		pool.Submit(t)
	}

	go func() {
		for result := range pool.Results() {
			if val, err := result.Unwrap(); err != nil {
				logger.Error("task failed", "error", err)
			} else {
				logger.Info("task completed", "result", val)
			}
		}
	}()

	names := Map(tasks, func(s string) string { return fmt.Sprintf("[%s]", s) })
	long := Filter(tasks, func(s string) bool { return len(s) > 4 })
	total := Reduce(tasks, 0, func(acc int, s string) int { return acc + len(s) })

	fmt.Printf("Names: %v\nLong: %v\nTotal chars: %d\n", names, long, total)
	fmt.Printf("Distance: %.2f\n", Distance(0, 0, 3, 4))
	fmt.Printf("Clamped: %d\n", Clamp(150, 0, 100))

	handler := NewAPIHandler()
	chain := Chain(WithLogging, WithRecovery, WithTimeout(DefaultTimeout))

	mux := http.NewServeMux()
	mux.Handle("/api/", chain(handler))

	server := &http.Server{
		Addr:         ":8080",
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	logger.Info("server starting", "addr", server.Addr, "version", Version)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		logger.Error("server failed", "error", err)
		os.Exit(1)
	}
}
