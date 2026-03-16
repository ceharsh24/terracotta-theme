"""
Comprehensive Python showcase for VS Code theme testing.
Covers decorators, dataclasses, async, metaclasses, generics, pattern matching.
"""

from __future__ import annotations

import asyncio
import json
import re
from abc import ABC, abstractmethod
from collections.abc import AsyncIterator, Callable, Sequence
from dataclasses import dataclass, field
from enum import Enum, auto
from functools import cached_property, wraps
from pathlib import Path
from typing import (
    Any,
    ClassVar,
    Generic,
    Literal,
    NamedTuple,
    Optional,
    Protocol,
    Self,
    TypeAlias,
    TypeVar,
    overload,
    runtime_checkable,
)

T = TypeVar("T")
K = TypeVar("K")
V = TypeVar("V")
Numeric: TypeAlias = int | float | complex

# ── Constants ─────────────────────────────────────────────────────────

MAX_RETRIES: int = 3
DEFAULT_TIMEOUT: float = 30.0
_PATTERN = re.compile(r"^(?P<key>\w+)\s*=\s*(?P<value>.+)$", re.MULTILINE)
API_BASE_URL = "https://api.example.com/v2"


# ── Decorators ────────────────────────────────────────────────────────

def retry(max_attempts: int = MAX_RETRIES, backoff: float = 1.5):
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> T:
            last_exc: Exception | None = None
            for attempt in range(1, max_attempts + 1):
                try:
                    return await func(*args, **kwargs)
                except (ConnectionError, TimeoutError) as exc:
                    last_exc = exc
                    wait = backoff ** attempt
                    print(f"Attempt {attempt}/{max_attempts} failed, retrying in {wait:.1f}s")
                    await asyncio.sleep(wait)
            raise RuntimeError(f"All {max_attempts} attempts failed") from last_exc
        return wrapper
    return decorator


def validate_types(**type_specs: type):
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            for name, expected in type_specs.items():
                if name in kwargs and not isinstance(kwargs[name], expected):
                    raise TypeError(
                        f"Expected {expected.__name__} for '{name}', "
                        f"got {type(kwargs[name]).__name__}"
                    )
            return func(*args, **kwargs)
        return wrapper
    return decorator


# ── Enums ─────────────────────────────────────────────────────────────

class Priority(Enum):
    LOW = auto()
    MEDIUM = auto()
    HIGH = auto()
    CRITICAL = auto()

    @property
    def is_urgent(self) -> bool:
        return self in (Priority.HIGH, Priority.CRITICAL)

    def __str__(self) -> str:
        return f"Priority.{self.name}"


class Status(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


# ── Protocols ─────────────────────────────────────────────────────────

@runtime_checkable
class Serializable(Protocol):
    def to_dict(self) -> dict[str, Any]: ...
    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Self: ...


class Comparable(Protocol[T]):
    def __lt__(self, other: T) -> bool: ...
    def __eq__(self, other: object) -> bool: ...


# ── Dataclasses ───────────────────────────────────────────────────────

@dataclass(frozen=True, slots=True)
class Config:
    host: str
    port: int = 8080
    debug: bool = False
    tags: frozenset[str] = frozenset()
    metadata: dict[str, Any] = field(default_factory=dict)

    MAX_PORT: ClassVar[int] = 65535

    def __post_init__(self) -> None:
        if not 1 <= self.port <= self.MAX_PORT:
            raise ValueError(f"Port must be 1-{self.MAX_PORT}, got {self.port}")

    @cached_property
    def base_url(self) -> str:
        scheme = "http" if self.debug else "https"
        return f"{scheme}://{self.host}:{self.port}"


class Coordinate(NamedTuple):
    x: float
    y: float
    z: float = 0.0

    @property
    def magnitude(self) -> float:
        return (self.x**2 + self.y**2 + self.z**2) ** 0.5


# ── Abstract base + metaclass ─────────────────────────────────────────

class RegistryMeta(type):
    _registry: ClassVar[dict[str, type]] = {}

    def __new__(mcs, name: str, bases: tuple[type, ...], namespace: dict[str, Any]) -> type:
        cls = super().__new__(mcs, name, bases, namespace)
        if bases:
            mcs._registry[name.lower()] = cls
        return cls

    @classmethod
    def get(mcs, name: str) -> type | None:
        return mcs._registry.get(name.lower())


class BaseProcessor(ABC, metaclass=RegistryMeta):
    def __init__(self, name: str, *, priority: Priority = Priority.MEDIUM) -> None:
        self._name = name
        self._priority = priority
        self._status = Status.PENDING

    @abstractmethod
    async def process(self, data: bytes) -> bytes:
        ...

    @abstractmethod
    def validate(self, data: bytes) -> bool:
        ...

    @property
    def name(self) -> str:
        return self._name

    def __repr__(self) -> str:
        return f"{type(self).__name__}(name={self._name!r}, status={self._status})"


# ── Generic container ─────────────────────────────────────────────────

class LRUCache(Generic[K, V]):
    def __init__(self, capacity: int = 128) -> None:
        self._capacity = capacity
        self._store: dict[K, V] = {}
        self._access_order: list[K] = []

    def get(self, key: K, default: V | None = None) -> V | None:
        if key in self._store:
            self._access_order.remove(key)
            self._access_order.append(key)
            return self._store[key]
        return default

    def put(self, key: K, value: V) -> None:
        if key in self._store:
            self._access_order.remove(key)
        elif len(self._store) >= self._capacity:
            evicted = self._access_order.pop(0)
            del self._store[evicted]
        self._store[key] = value
        self._access_order.append(key)

    @overload
    def __getitem__(self, key: K) -> V: ...
    @overload
    def __getitem__(self, key: slice) -> list[V]: ...

    def __getitem__(self, key: K | slice) -> V | list[V]:
        if isinstance(key, slice):
            keys = self._access_order[key]
            return [self._store[k] for k in keys]
        if key not in self._store:
            raise KeyError(key)
        return self.get(key)  # type: ignore[return-value]

    def __len__(self) -> int:
        return len(self._store)

    def __contains__(self, key: K) -> bool:
        return key in self._store

    def __iter__(self):
        yield from self._access_order


# ── Concrete processor with async ─────────────────────────────────────

class TransformProcessor(BaseProcessor):
    CHUNK_SIZE: ClassVar[int] = 4096

    def __init__(self, name: str, transforms: list[Callable[[bytes], bytes]]) -> None:
        super().__init__(name, priority=Priority.HIGH)
        self._transforms = transforms
        self._cache: LRUCache[int, bytes] = LRUCache(capacity=256)

    def validate(self, data: bytes) -> bool:
        return len(data) > 0 and len(data) <= 10 * 1024 * 1024

    @retry(max_attempts=3, backoff=2.0)
    async def process(self, data: bytes) -> bytes:
        if not self.validate(data):
            raise ValueError(f"Invalid data: {len(data)} bytes")

        cache_key = hash(data)
        if cached := self._cache.get(cache_key):
            return cached

        self._status = Status.RUNNING
        result = data
        for transform in self._transforms:
            result = transform(result)
            await asyncio.sleep(0)

        self._cache.put(cache_key, result)
        self._status = Status.COMPLETED
        return result

    async def process_stream(self, chunks: AsyncIterator[bytes]) -> AsyncIterator[bytes]:
        async for chunk in chunks:
            processed = await self.process(chunk)
            yield processed


# ── Pattern matching (3.10+) ──────────────────────────────────────────

def classify_value(value: Any) -> str:
    match value:
        case None:
            return "null"
        case bool(b):
            return f"boolean: {b}"
        case int(n) if n < 0:
            return f"negative integer: {n}"
        case int(n) | float(n):
            return f"number: {n}"
        case str(s) if len(s) > 100:
            return f"long string ({len(s)} chars)"
        case str(s):
            return f"string: {s!r}"
        case [first, *rest] if len(rest) > 10:
            return f"large list ({len(rest) + 1} items), starts with {first!r}"
        case [*items]:
            return f"list: {items}"
        case {"type": str(t), "data": dict(d)}:
            return f"typed object: {t} with {len(d)} fields"
        case {"error": str(msg), **_rest}:
            return f"error response: {msg}"
        case _:
            return f"unknown: {type(value).__name__}"


# ── List/dict/set comprehensions and generators ───────────────────────

@validate_types(threshold=float)
def analyze_data(
    records: Sequence[dict[str, Any]],
    *,
    threshold: float = 0.5,
    exclude: set[str] | None = None,
) -> dict[str, list[float]]:
    exclude = exclude or set()

    scores: dict[str, list[float]] = {
        record["id"]: [
            round(score * 100, 2)
            for score in record.get("scores", [])
            if score >= threshold
        ]
        for record in records
        if record.get("id") not in exclude and record.get("active", True)
    }

    unique_scores = {
        score
        for score_list in scores.values()
        for score in score_list
        if score > 0
    }

    print(f"Processed {len(scores)} records, {len(unique_scores)} unique scores")
    return scores


# ── Async context manager + generator ─────────────────────────────────

class AsyncResourcePool:
    def __init__(self, size: int = 10) -> None:
        self._semaphore = asyncio.Semaphore(size)
        self._active: int = 0

    async def __aenter__(self) -> Self:
        await self._semaphore.acquire()
        self._active += 1
        return self

    async def __aexit__(self, *exc_info: Any) -> None:
        self._active -= 1
        self._semaphore.release()

    async def execute(self, coro: Any) -> Any:
        async with self:
            return await coro


# ── Main ──────────────────────────────────────────────────────────────

async def main() -> None:
    config = Config(host="localhost", port=3000, debug=True, tags=frozenset({"api", "v2"}))
    print(f"Server: {config.base_url}")

    transforms: list[Callable[[bytes], bytes]] = [
        lambda d: d.upper(),
        lambda d: d.strip(),
        lambda d: d.replace(b"\x00", b""),
    ]

    processor = TransformProcessor("pipeline", transforms)
    result = await processor.process(b"hello world")
    print(f"Result: {result!r}")

    values = [None, 42, -7, 3.14, "hello", [1, 2, 3], {"type": "event", "data": {"x": 1}}]
    for v in values:
        print(f"  {classify_value(v)}")

    cache: LRUCache[str, int] = LRUCache(capacity=4)
    for i, key in enumerate(["a", "b", "c", "d", "e"]):
        cache.put(key, i * 10)

    print(f"Cache size: {len(cache)}, contains 'a': {'a' in cache}")


if __name__ == "__main__":
    asyncio.run(main())
