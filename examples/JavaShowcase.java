package com.terracotta.showcase;

import java.util.*;
import java.util.concurrent.*;
import java.util.function.*;
import java.util.stream.*;
import java.io.Serializable;
import java.lang.annotation.*;

/**
 * A comprehensive Java showcase to test VS Code theme rendering.
 * Covers classes, interfaces, enums, generics, annotations, lambdas, and more.
 *
 * @author Terracotta Theme
 * @version 1.0
 * @since 2024
 */
@SuppressWarnings({"unchecked", "rawtypes"})
public class JavaShowcase<T extends Comparable<T> & Serializable> implements Iterable<T> {

    // ── Constants and static fields ──────────────────────────────────────

    public static final int MAX_CAPACITY = 1024;
    public static final String DEFAULT_NAME = "Terracotta";
    private static final double PI_APPROX = 3.14159265;
    private static volatile boolean isRunning = false;
    protected static int instanceCount = 0;

    // ── Instance fields ──────────────────────────────────────────────────

    private final List<T> elements;
    private final Map<String, Function<T, Boolean>> validators;
    private transient int modificationCount;
    private String name;

    // ── Custom annotation ────────────────────────────────────────────────

    @Retention(RetentionPolicy.RUNTIME)
    @Target({ElementType.METHOD, ElementType.FIELD})
    public @interface Validate {
        String value() default "";
        boolean nullable() default false;
        int maxLength() default Integer.MAX_VALUE;
    }

    // ── Enum with fields and methods ─────────────────────────────────────

    public enum Priority {
        LOW(1, "Low priority"),
        MEDIUM(5, "Medium priority"),
        HIGH(10, "High priority"),
        CRITICAL(100, "Critical — immediate action required");

        private final int level;
        private final String description;

        Priority(int level, String description) {
            this.level = level;
            this.description = description;
        }

        public int getLevel() { return level; }
        public String getDescription() { return description; }

        public static Priority fromLevel(int level) {
            for (Priority p : values()) {
                if (p.level >= level) return p;
            }
            return CRITICAL;
        }
    }

    // ── Interface with default and static methods ────────────────────────

    public interface Transformer<I, O> {
        O transform(I input) throws IllegalArgumentException;

        default O transformOrDefault(I input, O defaultValue) {
            try {
                O result = transform(input);
                return result != null ? result : defaultValue;
            } catch (Exception e) {
                return defaultValue;
            }
        }

        static <X> Transformer<X, String> toStringTransformer() {
            return input -> input != null ? input.toString() : "null";
        }
    }

    // ── Sealed interface (Java 17+) ──────────────────────────────────────

    public sealed interface Shape permits Circle, Rectangle {
        double area();
        double perimeter();
        String describe();
    }

    // ── Record (Java 16+) ────────────────────────────────────────────────

    public record Circle(double radius) implements Shape {
        public Circle {
            if (radius < 0) throw new IllegalArgumentException("Radius must be non-negative");
        }

        @Override
        public double area() { return Math.PI * radius * radius; }

        @Override
        public double perimeter() { return 2 * Math.PI * radius; }

        @Override
        public String describe() {
            return "Circle[r=%.2f, area=%.2f]".formatted(radius, area());
        }
    }

    public record Rectangle(double width, double height) implements Shape {
        @Override
        public double area() { return width * height; }

        @Override
        public double perimeter() { return 2 * (width + height); }

        @Override
        public String describe() {
            return "Rectangle[%sx%s, area=%.2f]".formatted(width, height, area());
        }
    }

    // ── Abstract inner class ─────────────────────────────────────────────

    protected abstract static class AbstractProcessor<E> {
        private final String processorId;
        protected int processedCount = 0;

        protected AbstractProcessor(String processorId) {
            this.processorId = processorId;
        }

        abstract E process(E input);

        final void logProcessing(E item) {
            System.out.printf("[%s] Processing item #%d: %s%n",
                processorId, ++processedCount, item);
        }
    }

    // ── Concrete inner class with generics ───────────────────────────────

    private static class FilteringProcessor<E> extends AbstractProcessor<E> {
        private final Predicate<E> filter;
        private final List<E> rejected = new ArrayList<>();

        FilteringProcessor(String id, Predicate<E> filter) {
            super(id);
            this.filter = Objects.requireNonNull(filter, "Filter must not be null");
        }

        @Override
        E process(E input) {
            logProcessing(input);
            if (filter.test(input)) {
                return input;
            }
            rejected.add(input);
            return null;
        }

        List<E> getRejected() {
            return Collections.unmodifiableList(rejected);
        }
    }

    // ── Constructor ──────────────────────────────────────────────────────

    public JavaShowcase(String name) {
        this.name = Objects.requireNonNull(name);
        this.elements = new CopyOnWriteArrayList<>();
        this.validators = new ConcurrentHashMap<>();
        this.modificationCount = 0;
        instanceCount++;
    }

    // ── Static factory method ────────────────────────────────────────────

    public static <T extends Comparable<T> & Serializable> JavaShowcase<T> create(String name) {
        return new JavaShowcase<>(name);
    }

    // ── Methods with various features ────────────────────────────────────

    @Validate(value = "element", nullable = false)
    public synchronized boolean addElement(T element) {
        if (elements.size() >= MAX_CAPACITY) {
            throw new IllegalStateException("Capacity exceeded: " + MAX_CAPACITY);
        }

        for (var entry : validators.entrySet()) {
            if (!entry.getValue().apply(element)) {
                System.err.println("Validation failed: " + entry.getKey());
                return false;
            }
        }

        modificationCount++;
        return elements.add(element);
    }

    public void addValidator(String name, Function<T, Boolean> validator) {
        validators.put(name, validator);
    }

    // ── Stream processing and lambdas ────────────────────────────────────

    public List<T> getFiltered(Predicate<T> predicate) {
        return elements.stream()
            .filter(predicate)
            .sorted()
            .collect(Collectors.toUnmodifiableList());
    }

    public <R> List<R> mapElements(Function<? super T, ? extends R> mapper) {
        return elements.stream()
            .map(mapper)
            .toList();
    }

    public Optional<T> findFirst(Predicate<T> condition) {
        return elements.stream()
            .filter(condition)
            .findFirst();
    }

    public Map<Boolean, List<T>> partition(Predicate<T> predicate) {
        return elements.stream()
            .collect(Collectors.partitioningBy(predicate));
    }

    // ── Switch expressions (Java 14+) ────────────────────────────────────

    public String describePriority(Priority priority) {
        return switch (priority) {
            case LOW -> "No rush";
            case MEDIUM -> "Normal processing";
            case HIGH -> "Expedited handling";
            case CRITICAL -> {
                notifyAdmin("Critical item detected!");
                yield "IMMEDIATE ACTION REQUIRED";
            }
        };
    }

    // ── Pattern matching instanceof (Java 16+) ───────────────────────────

    public String describeShape(Object obj) {
        if (obj instanceof Circle c && c.radius() > 0) {
            return "Positive circle: " + c.describe();
        } else if (obj instanceof Rectangle r) {
            return "Rectangle: " + r.describe();
        } else if (obj instanceof String s) {
            return "String shape name: " + s.toUpperCase();
        } else {
            return "Unknown: " + Objects.toString(obj, "<null>");
        }
    }

    // ── Try-with-resources and exception handling ─────────────────────────

    public CompletableFuture<List<T>> processAsync(ExecutorService executor) {
        return CompletableFuture.supplyAsync(() -> {
            isRunning = true;
            try {
                Thread.sleep(100L);
                var processor = new FilteringProcessor<T>(
                    name, e -> e.compareTo(elements.get(0)) > 0
                );
                return elements.stream()
                    .map(processor::process)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new CompletionException("Processing interrupted", e);
            } catch (IndexOutOfBoundsException e) {
                return Collections.emptyList();
            } finally {
                isRunning = false;
            }
        }, executor);
    }

    // ── Varargs and array operations ─────────────────────────────────────

    @SafeVarargs
    public final void addAll(T... items) {
        for (T item : items) {
            addElement(item);
        }
    }

    // ── Ternary, casting, and bitwise operations ─────────────────────────

    public int computeHash() {
        int hash = 17;
        hash = 31 * hash + (name != null ? name.hashCode() : 0);
        hash = 31 * hash + elements.size();
        hash = (hash << 5) | (hash >>> 27);  // rotate bits
        hash ^= 0xDEADBEEF;
        return hash & 0x7FFFFFFF;
    }

    // ── Multi-catch and nested try ───────────────────────────────────────

    @SuppressWarnings("deprecation")
    public T parseAndAdd(String input, Transformer<String, T> parser) {
        T result = null;
        try {
            result = parser.transform(input);
            if (result != null) {
                addElement(result);
            }
        } catch (NumberFormatException | ClassCastException e) {
            System.err.printf("Parse error for '%s': %s%n", input, e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error parsing: " + input, e);
        }
        return result;
    }

    // ── Iterator implementation ──────────────────────────────────────────

    @Override
    public Iterator<T> iterator() {
        return new Iterator<>() {
            private int cursor = 0;

            @Override
            public boolean hasNext() {
                return cursor < elements.size();
            }

            @Override
            public T next() {
                if (!hasNext()) throw new NoSuchElementException();
                return elements.get(cursor++);
            }

            @Override
            public void remove() {
                throw new UnsupportedOperationException("Immutable iterator");
            }
        };
    }

    // ── toString, equals, hashCode ───────────────────────────────────────

    @Override
    public String toString() {
        return "JavaShowcase{name='%s', size=%d, mods=%d}"
            .formatted(name, elements.size(), modificationCount);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof JavaShowcase<?> that)) return false;
        return Objects.equals(name, that.name)
            && Objects.equals(elements, that.elements);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, elements);
    }

    // ── Private helper ───────────────────────────────────────────────────

    private void notifyAdmin(String message) {
        System.out.println("ADMIN ALERT: " + message);
    }

    // ── Main method ──────────────────────────────────────────────────────

    public static void main(String[] args) {
        var showcase = JavaShowcase.<String>create("demo");

        showcase.addValidator("non-empty", s -> !s.isEmpty());
        showcase.addValidator("max-length", s -> s.length() <= 50);

        showcase.addAll("alpha", "beta", "gamma", "delta", "epsilon");

        // Stream operations
        List<String> filtered = showcase.getFiltered(s -> s.length() > 4);
        System.out.println("Filtered: " + filtered);

        List<String> upper = showcase.mapElements(String::toUpperCase);
        System.out.println("Uppercased: " + upper);

        Optional<String> found = showcase.findFirst(s -> s.startsWith("g"));
        found.ifPresentOrElse(
            s -> System.out.println("Found: " + s),
            () -> System.out.println("Not found")
        );

        // Pattern matching
        Shape circle = new Circle(5.0);
        Shape rect = new Rectangle(3.0, 4.0);
        System.out.println(showcase.describeShape(circle));
        System.out.println(showcase.describeShape(rect));

        // Switch expression
        for (Priority p : Priority.values()) {
            System.out.printf("%-10s -> %s%n", p, showcase.describePriority(p));
        }

        // Async processing
        ExecutorService exec = Executors.newFixedThreadPool(2);
        try {
            showcase.processAsync(exec)
                .thenAccept(results -> System.out.println("Async results: " + results))
                .exceptionally(ex -> {
                    System.err.println("Error: " + ex.getMessage());
                    return null;
                })
                .join();
        } finally {
            exec.shutdown();
        }

        System.out.println("Hash: 0x" + Integer.toHexString(showcase.computeHash()));
        System.out.println(showcase);
    }
}
