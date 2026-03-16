import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type FC,
  type ReactNode,
  type RefObject,
} from "react";

// ── Types & Interfaces ──────────────────────────────────────────────

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
}

interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  notifications: boolean;
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    fontSize: number;
  };
}

type AsyncStatus = "idle" | "loading" | "success" | "error";

interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
  timestamp: number | null;
}

type AsyncAction<T> =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: T }
  | { type: "FETCH_ERROR"; error: string }
  | { type: "RESET" };

// ── Constants ───────────────────────────────────────────────────────

const API_BASE = "https://api.example.com/v2" as const;
const MAX_RETRY_COUNT = 3;
const DEBOUNCE_MS = 300;
const STALE_THRESHOLD_MS = 5 * 60 * 1000;

const ROLE_LABELS: Record<User["role"], string> = {
  admin: "Administrator",
  editor: "Content Editor",
  viewer: "Read Only",
};

// ── Generic Reducer Factory ─────────────────────────────────────────

function createAsyncReducer<T>() {
  return function asyncReducer(
    state: AsyncState<T>,
    action: AsyncAction<T>
  ): AsyncState<T> {
    switch (action.type) {
      case "FETCH_START":
        return { ...state, status: "loading", error: null };
      case "FETCH_SUCCESS":
        return {
          data: action.payload,
          status: "success",
          error: null,
          timestamp: Date.now(),
        };
      case "FETCH_ERROR":
        return { ...state, status: "error", error: action.error };
      case "RESET":
        return { data: null, status: "idle", error: null, timestamp: null };
      default: {
        const _exhaustive: never = action;
        return state;
      }
    }
  };
}

// ── Custom Hooks ────────────────────────────────────────────────────

function useAsync<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = []
): AsyncState<T> & { refetch: () => void } {
  const reducer = useMemo(() => createAsyncReducer<T>(), []);
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    status: "idle",
    error: null,
    timestamp: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    dispatch({ type: "FETCH_START" });
    try {
      const data = await fetcher();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      dispatch({
        type: "FETCH_ERROR",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }, deps);

  useEffect(() => {
    refetch();
    return () => abortRef.current?.abort();
  }, [refetch]);

  return { ...state, refetch };
}

function useDebounce<T>(value: T, delay: number = DEBOUNCE_MS): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function useIntersectionObserver(
  ref: RefObject<HTMLElement | null>,
  options?: IntersectionObserverInit
): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options]);

  return isVisible;
}

// ── Context ─────────────────────────────────────────────────────────

interface ThemeContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
  colors: Record<string, string>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const colors = useMemo(
    () =>
      theme === "dark"
        ? { bg: "#1a1a1a", fg: "#cccccc", accent: "#d06f50", muted: "#666" }
        : { bg: "#fdfaf6", fg: "#242424", accent: "#ab3d1e", muted: "#999" },
    [theme]
  );

  const toggleTheme = useCallback(
    () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
    []
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ── Utility Components ──────────────────────────────────────────────

interface BadgeProps {
  variant: "success" | "warning" | "error" | "info";
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Badge: FC<BadgeProps> = memo(({ variant, children, size = "md", className }) => {
  const { colors } = useTheme();

  const variantStyles: Record<BadgeProps["variant"], React.CSSProperties> = {
    success: { backgroundColor: "#72b490", color: "#fff" },
    warning: { backgroundColor: "#d09a58", color: "#1a1a1a" },
    error: { backgroundColor: "#bf6b66", color: "#fff" },
    info: { backgroundColor: "#72a8c8", color: "#1a1a1a" },
  };

  const sizeMap = { sm: "0.75rem", md: "0.875rem", lg: "1rem" } as const;

  return (
    <span
      className={className}
      style={{
        ...variantStyles[variant],
        fontSize: sizeMap[size],
        padding: "2px 8px",
        borderRadius: "4px",
        fontWeight: 600,
        border: `1px solid ${colors.muted}`,
      }}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

// ── Main User Card Component ────────────────────────────────────────

interface UserCardProps {
  userId: string;
  onEdit?: (user: User) => void;
  onDelete?: (id: string) => Promise<void>;
  showDetails?: boolean;
}

const UserCard: FC<UserCardProps> = memo(
  ({ userId, onEdit, onDelete, showDetails = true }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(cardRef);
    const { theme, colors } = useTheme();
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedQuery = useDebounce(searchQuery);

    const {
      data: user,
      status,
      error,
      refetch,
    } = useAsync<User>(
      () =>
        fetch(`${API_BASE}/users/${userId}`).then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          return res.json() as Promise<User>;
        }),
      [userId]
    );

    const handleDelete = useCallback(async () => {
      if (!user || !onDelete) return;
      const confirmed = window.confirm(`Delete ${user.name}?`);
      if (!confirmed) return;

      setIsDeleting(true);
      try {
        await onDelete(user.id);
      } catch (err) {
        console.error("Delete failed:", err);
      } finally {
        setIsDeleting(false);
      }
    }, [user, onDelete]);

    const filteredPrefs = useMemo(() => {
      if (!user || !debouncedQuery) return null;
      const query = debouncedQuery.toLowerCase();
      return Object.entries(user.preferences).filter(([key]) =>
        key.toLowerCase().includes(query)
      );
    }, [user, debouncedQuery]);

    const timeAgo = useMemo(() => {
      if (!user) return null;
      const diff = Date.now() - new Date(user.createdAt).getTime();
      const days = Math.floor(diff / 86_400_000);
      if (days === 0) return "today";
      if (days === 1) return "yesterday";
      if (days < 30) return `${days} days ago`;
      return `${Math.floor(days / 30)} months ago`;
    }, [user]);

    if (status === "loading") {
      return (
        <div ref={cardRef} style={{ padding: 16, color: colors.muted }}>
          Loading user...
        </div>
      );
    }

    if (status === "error") {
      return (
        <div ref={cardRef} style={{ padding: 16, color: "#bf6b66" }}>
          <p>Error: {error}</p>
          <button onClick={refetch} type="button">
            Retry
          </button>
        </div>
      );
    }

    if (!user) return null;

    return (
      <div
        ref={cardRef}
        style={{
          background: colors.bg,
          border: `1px solid ${colors.muted}`,
          borderRadius: 8,
          padding: 20,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user.avatar && (
            <img
              src={user.avatar}
              alt={`${user.name}'s avatar`}
              width={48}
              height={48}
              style={{ borderRadius: "50%" }}
            />
          )}
          <div>
            <h3 style={{ color: colors.fg, margin: 0 }}>{user.name}</h3>
            <p style={{ color: colors.muted, margin: 0, fontSize: "0.85rem" }}>
              {user.email} &middot; Joined {timeAgo}
            </p>
          </div>
          <Badge variant={user.role === "admin" ? "error" : "info"}>
            {ROLE_LABELS[user.role]}
          </Badge>
        </header>

        {showDetails && (
          <section style={{ marginTop: 16 }}>
            <input
              type="search"
              placeholder="Filter preferences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: theme === "dark" ? "#2a2a2a" : "#f0f0f0",
                color: colors.fg,
                border: `1px solid ${colors.muted}`,
                borderRadius: 4,
              }}
            />
            {filteredPrefs && (
              <ul style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
                {filteredPrefs.map(([key, val]) => (
                  <li key={key} style={{ color: colors.fg, padding: "4px 0" }}>
                    <strong>{key}:</strong> {JSON.stringify(val)}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <footer style={{ marginTop: 16, display: "flex", gap: 8 }}>
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(user)}
              style={{ background: colors.accent, color: "#fff", border: "none", borderRadius: 4, padding: "6px 16px" }}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              style={{ background: "#bf6b66", color: "#fff", border: "none", borderRadius: 4, padding: "6px 16px", opacity: isDeleting ? 0.5 : 1 }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </footer>
      </div>
    );
  }
);

UserCard.displayName = "UserCard";

// ── App Component ───────────────────────────────────────────────────

const App: FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleEdit = useCallback((user: User) => {
    console.log("Editing:", user.id);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });
  }, []);

  return (
    <ThemeProvider>
      <main style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
        <h1>User Management</h1>
        {selectedId ? (
          <UserCard
            userId={selectedId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <p>Select a user to view details.</p>
        )}
      </main>
    </ThemeProvider>
  );
};

export default App;
