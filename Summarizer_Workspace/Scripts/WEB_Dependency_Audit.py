from __future__ import annotations

import hashlib
import json
import os
import re
from collections import Counter, defaultdict, deque
from datetime import datetime
from pathlib import Path
from typing import Any


# ============================================================================
# WEBB.SYSTEMS DEPENDENCY AUDIT
# ============================================================================

REVISION = "gpt56-web-dependency-audit-v1"
MODE = "READ_ONLY"

SCRIPT_PATH = Path(__file__).resolve()
REPO_ROOT = SCRIPT_PATH.parents[2]
WORKSPACE_ROOT = REPO_ROOT / "Summarizer_Workspace"
RESULTS_ROOT = WORKSPACE_ROOT / "Results" / "WEB_Dependency_Audit"

APP_ROOT = REPO_ROOT / "app"
CONTENT_ROOT = REPO_ROOT / "content"
PUBLIC_ROOT = REPO_ROOT / "public"

EXCLUDED_TOP_LEVEL = {
    ".git",
    ".next",
    ".vercel",
    ".turbo",
    ".cache",
    "node_modules",
    "dist",
    "out",
    "build",
    "coverage",
    "Summarizer_Workspace",
}

EXCLUDED_ANYWHERE = {
    ".git",
    ".next",
    ".vercel",
    ".turbo",
    ".cache",
    "node_modules",
    "coverage",
    "__pycache__",
}

TEXT_EXTENSIONS = {
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".json",
    ".jsonc",
    ".md",
    ".mdx",
    ".css",
    ".scss",
    ".sass",
    ".less",
    ".html",
    ".htm",
    ".xml",
    ".yml",
    ".yaml",
    ".toml",
    ".txt",
    ".py",
    ".ps1",
    ".sh",
}

CODE_EXTENSIONS = {
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
}

CONTENT_EXTENSIONS = {
    ".md",
    ".mdx",
}

MODULE_EXTENSIONS = [
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".json",
    ".md",
    ".mdx",
    ".css",
]

ROOT_CONFIG_NAMES = {
    "package.json",
    "package-lock.json",
    "next.config.js",
    "next.config.mjs",
    "next.config.ts",
    "tsconfig.json",
    "jsconfig.json",
    "postcss.config.js",
    "postcss.config.mjs",
    "postcss.config.ts",
    "tailwind.config.js",
    "tailwind.config.ts",
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
    "next-env.d.ts",
    ".gitignore",
    ".npmrc",
}

NEXT_ENTRY_NAMES = {
    "page.ts",
    "page.tsx",
    "page.js",
    "page.jsx",
    "layout.ts",
    "layout.tsx",
    "layout.js",
    "layout.jsx",
    "route.ts",
    "route.tsx",
    "route.js",
    "route.jsx",
    "template.ts",
    "template.tsx",
    "template.js",
    "template.jsx",
    "loading.ts",
    "loading.tsx",
    "loading.js",
    "loading.jsx",
    "error.ts",
    "error.tsx",
    "error.js",
    "error.jsx",
    "not-found.ts",
    "not-found.tsx",
    "not-found.js",
    "not-found.jsx",
    "default.ts",
    "default.tsx",
    "default.js",
    "default.jsx",
}

NEXT_CONVENTION_NAMES = {
    "icon.png",
    "icon.jpg",
    "icon.jpeg",
    "icon.svg",
    "favicon.ico",
    "apple-icon.png",
    "opengraph-image.png",
    "twitter-image.png",
    "sitemap.ts",
    "sitemap.js",
    "robots.ts",
    "robots.js",
    "manifest.ts",
    "manifest.js",
}

# --------------------------------------------------------------------------
# Reference patterns
# --------------------------------------------------------------------------

IMPORT_FROM_RE = re.compile(
    r"""
    \bimport
    \s+
    (?:type\s+)?
    (?:
        [^;\n]*?
        \s+from\s+
    )?
    ["']([^"']+)["']
    """,
    re.VERBOSE,
)

DYNAMIC_IMPORT_RE = re.compile(
    r"""\bimport\s*\(\s*["']([^"']+)["']\s*\)"""
)

EXPORT_FROM_RE = re.compile(
    r"""\bexport\s+[^;\n]*?\s+from\s+["']([^"']+)["']"""
)

REQUIRE_RE = re.compile(
    r"""\brequire\s*\(\s*["']([^"']+)["']\s*\)"""
)

CSS_URL_RE = re.compile(
    r"""url\(\s*["']?([^"')]+)["']?\s*\)"""
)

STRING_RE = re.compile(
    r"""(?P<quote>["'])(?P<value>(?:\\.|(?!\1).)*?)(?P=quote)"""
)

BACKTICK_ROUTE_RE = re.compile(
    r"""`(/[^`]+)`"""
)

HREF_LITERAL_RE = re.compile(
    r"""href\s*=\s*["']([^"']+)["']""",
    re.IGNORECASE,
)

SRC_LITERAL_RE = re.compile(
    r"""src\s*=\s*["']([^"']+)["']""",
    re.IGNORECASE,
)

ROUTER_PUSH_RE = re.compile(
    r"""\b(?:router\.)?(?:push|replace)\s*\(\s*["']([^"']+)["']\s*\)"""
)

# External schemes that are never local dependencies.
EXTERNAL_PREFIXES = (
    "http://",
    "https://",
    "mailto:",
    "tel:",
    "data:",
    "blob:",
    "ca://",
)


# ============================================================================
# HELPERS
# ============================================================================

def local_timestamp() -> str:
    return datetime.now().astimezone().strftime("%Y%m%dT%H%M%S%z")


def rel(path: Path) -> str:
    return path.relative_to(REPO_ROOT).as_posix()


def path_key(path: Path) -> str:
    return rel(path).lower()


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()

    with path.open("rb") as f:
        while True:
            block = f.read(1024 * 1024)

            if not block:
                break

            h.update(block)

    return h.hexdigest()


def discover_repo_files() -> list[Path]:
    files: list[Path] = []

    for current_root, dirs, filenames in os.walk(REPO_ROOT):
        current = Path(current_root)

        try:
            relative = current.relative_to(REPO_ROOT)
        except ValueError:
            continue

        if relative == Path("."):
            dirs[:] = [
                d
                for d in dirs
                if d not in EXCLUDED_TOP_LEVEL
            ]
        else:
            dirs[:] = [
                d
                for d in dirs
                if d not in EXCLUDED_ANYWHERE
            ]

        for filename in filenames:
            path = current / filename

            if not path.is_file():
                continue

            if path.is_symlink():
                continue

            parts = path.relative_to(REPO_ROOT).parts

            if parts and parts[0] in EXCLUDED_TOP_LEVEL:
                continue

            files.append(path)

    return sorted(
        files,
        key=lambda p: rel(p).lower(),
    )


def corpus_hash(files: list[Path]) -> str:
    h = hashlib.sha256()

    for path in files:
        relative = rel(path)
        file_hash = sha256_file(path)
        size = path.stat().st_size

        h.update(relative.encode("utf-8"))
        h.update(b"\0")
        h.update(str(size).encode("ascii"))
        h.update(b"\0")
        h.update(file_hash.encode("ascii"))
        h.update(b"\n")

    return h.hexdigest()


def is_text_file(path: Path) -> bool:
    if path.name in ROOT_CONFIG_NAMES:
        return True

    if path.name.startswith(".env"):
        return True

    return path.suffix.lower() in TEXT_EXTENSIONS


def read_utf8(path: Path) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return None
    except OSError:
        return None


def strip_query_fragment(value: str) -> str:
    value = value.split("?", 1)[0]
    value = value.split("#", 1)[0]
    return value.strip()


def is_external_reference(value: str) -> bool:
    lower = value.lower()

    return lower.startswith(EXTERNAL_PREFIXES)


def has_asset_extension(value: str) -> bool:
    clean = strip_query_fragment(value)

    suffix = Path(clean).suffix.lower()

    return suffix in {
        ".png",
        ".jpg",
        ".jpeg",
        ".webp",
        ".gif",
        ".svg",
        ".ico",
        ".mp4",
        ".webm",
        ".mov",
        ".pdf",
        ".woff",
        ".woff2",
        ".ttf",
        ".otf",
        ".json",
        ".xml",
        ".txt",
    }


def classify_file(path: Path) -> str:
    relative = rel(path)
    parts = Path(relative).parts
    suffix = path.suffix.lower()

    if path.name in ROOT_CONFIG_NAMES:
        return "CONFIG"

    if parts and parts[0] == "app":
        if path.name in NEXT_ENTRY_NAMES:
            return "APP_ENTRYPOINT"

        if path.name in NEXT_CONVENTION_NAMES:
            return "NEXT_CONVENTION"

        if suffix in CODE_EXTENSIONS:
            return "APP_CODE"

        return "APP_ASSET"

    if parts and parts[0] == "public":
        return "PUBLIC_ASSET"

    if parts and parts[0] == "content":
        if suffix in CONTENT_EXTENSIONS:
            return "CONTENT_DOCUMENT"

        if path.name in {
            "manifest.ts",
            "manifest.js",
            "meta.ts",
            "meta.js",
            "index.ts",
            "index.js",
        }:
            return "CONTENT_SUPPORT"

        if suffix in CODE_EXTENSIONS:
            return "CONTENT_CODE"

        return "CONTENT_OTHER"

    if parts and parts[0] == "components":
        return "COMPONENT"

    if parts and parts[0] in {
        "lib",
        "utils",
        "utilities",
    }:
        return "LIBRARY"

    if parts and parts[0] == "styles":
        return "STYLE"

    if suffix in CODE_EXTENSIONS:
        return "SOURCE_CODE"

    if is_text_file(path):
        return "TEXT_OTHER"

    return "BINARY_OTHER"


def is_entry_root(path: Path) -> bool:
    relative = Path(rel(path))
    parts = relative.parts

    if len(parts) == 1 and path.name in ROOT_CONFIG_NAMES:
        return True

    if parts and parts[0] == "app":
        if path.name in NEXT_ENTRY_NAMES:
            return True

        if path.name in NEXT_CONVENTION_NAMES:
            return True

        if path.name == "NavBar.tsx":
            # Not a framework entrypoint, but normally reached by layout.
            # Do not force root status here.
            return False

    return False


def module_candidates(base: Path) -> list[Path]:
    candidates: list[Path] = []

    # Exact path first.
    candidates.append(base)

    if base.suffix == "":
        for ext in MODULE_EXTENSIONS:
            candidates.append(
                Path(str(base) + ext)
            )

        for ext in MODULE_EXTENSIONS:
            candidates.append(
                base / ("index" + ext)
            )

    return candidates


def resolve_module_reference(
    source: Path,
    specifier: str,
) -> Path | None:
    value = strip_query_fragment(specifier)

    if not value:
        return None

    if is_external_reference(value):
        return None

    # TypeScript path aliases established in tsconfig:
    # @/* -> ./*
    # #/* -> ./*
    if value.startswith("@/") or value.startswith("#/"):
        base = REPO_ROOT / value[2:]

    elif value.startswith("./") or value.startswith("../"):
        base = source.parent / value

    elif value.startswith("/content/"):
        base = REPO_ROOT / value.lstrip("/")

    else:
        return None

    for candidate in module_candidates(base):
        if candidate.is_file():
            return candidate.resolve()

    return None


def resolve_public_reference(value: str) -> Path | None:
    clean = strip_query_fragment(value)

    if not clean.startswith("/"):
        return None

    if clean.startswith("/content/"):
        return None

    candidate = PUBLIC_ROOT / clean.lstrip("/")

    if candidate.is_file():
        return candidate.resolve()

    return None


def resolve_content_absolute(value: str) -> Path | None:
    clean = strip_query_fragment(value)

    if not clean.startswith("/content/"):
        return None

    candidate = REPO_ROOT / clean.lstrip("/")

    if candidate.is_file():
        return candidate.resolve()

    return None


def package_name(specifier: str) -> str:
    value = specifier.strip()

    if value.startswith("@"):
        parts = value.split("/")

        if len(parts) >= 2:
            return "/".join(parts[:2])

        return value

    return value.split("/", 1)[0]


def is_external_module_specifier(value: str) -> bool:
    if not value:
        return False

    if value.startswith(("./", "../", "@/", "#/", "/")):
        return False

    if is_external_reference(value):
        return False

    return True


# ============================================================================
# ROUTE DISCOVERY
# ============================================================================

def route_from_page(path: Path) -> str | None:
    try:
        relative = path.relative_to(APP_ROOT)
    except ValueError:
        return None

    if path.name not in {
        "page.ts",
        "page.tsx",
        "page.js",
        "page.jsx",
    }:
        return None

    parts = list(relative.parts[:-1])
    visible: list[str] = []

    for part in parts:
        if part.startswith("(") and part.endswith(")"):
            continue

        if part.startswith("@"):
            continue

        visible.append(part)

    if not visible:
        return "/"

    return "/" + "/".join(visible)


def discover_routes(files: list[Path]) -> list[str]:
    routes: set[str] = set()

    for path in files:
        route = route_from_page(path)

        if route is not None:
            routes.add(route)

    return sorted(routes)


def route_to_regex(route: str) -> re.Pattern[str]:
    if route == "/":
        return re.compile(r"^/$")

    pieces = route.strip("/").split("/")
    pattern: list[str] = []

    for piece in pieces:
        if piece.startswith("[[...") and piece.endswith("]]"):
            pattern.append(r"(?:.+)?")
        elif piece.startswith("[...") and piece.endswith("]"):
            pattern.append(r".+")
        elif piece.startswith("[") and piece.endswith("]"):
            pattern.append(r"[^/]+")
        else:
            pattern.append(re.escape(piece))

    return re.compile(
        r"^/" + "/".join(pattern) + r"/?$"
    )


def route_exists(
    value: str,
    route_patterns: list[tuple[str, re.Pattern[str]]],
) -> bool:
    clean = strip_query_fragment(value)

    if not clean.startswith("/"):
        return False

    for _, pattern in route_patterns:
        if pattern.match(clean):
            return True

    return False


# ============================================================================
# REFERENCE COLLECTION
# ============================================================================

def collect_code_references(
    source: Path,
    text: str,
) -> list[dict[str, Any]]:
    refs: list[dict[str, Any]] = []

    patterns = [
        ("IMPORT", IMPORT_FROM_RE),
        ("DYNAMIC_IMPORT", DYNAMIC_IMPORT_RE),
        ("EXPORT_FROM", EXPORT_FROM_RE),
        ("REQUIRE", REQUIRE_RE),
    ]

    for kind, pattern in patterns:
        for match in pattern.finditer(text):
            refs.append(
                {
                    "kind": kind,
                    "raw": match.group(1).strip(),
                }
            )

    for match in CSS_URL_RE.finditer(text):
        refs.append(
            {
                "kind": "CSS_URL",
                "raw": match.group(1).strip(),
            }
        )

    for match in HREF_LITERAL_RE.finditer(text):
        refs.append(
            {
                "kind": "HREF",
                "raw": match.group(1).strip(),
            }
        )

    for match in SRC_LITERAL_RE.finditer(text):
        refs.append(
            {
                "kind": "SRC",
                "raw": match.group(1).strip(),
            }
        )

    for match in ROUTER_PUSH_RE.finditer(text):
        refs.append(
            {
                "kind": "ROUTE_NAVIGATION",
                "raw": match.group(1).strip(),
            }
        )

    # Catch metadata strings such as:
    # mdx: "/content/..."
    # pdf: "/projects/..."
    # thumbnail: "/thumbnails/..."
    #
    # We only retain path-like strings to avoid treating normal prose
    # as dependencies.
    for match in STRING_RE.finditer(text):
        value = match.group("value").strip()

        if not value:
            continue

        if (
            value.startswith("/content/")
            or (
                value.startswith("/")
                and has_asset_extension(value)
            )
        ):
            refs.append(
                {
                    "kind": "PATH_LITERAL",
                    "raw": value,
                }
            )

    # Backtick route literals such as `/essays/${slug}`.
    for match in BACKTICK_ROUTE_RE.finditer(text):
        value = match.group(1).strip()

        refs.append(
            {
                "kind": "ROUTE_TEMPLATE",
                "raw": value,
            }
        )

    # De-duplicate within one source file.
    unique: dict[tuple[str, str], dict[str, Any]] = {}

    for item in refs:
        key = (
            item["kind"],
            item["raw"],
        )
        unique[key] = item

    return list(unique.values())


def classify_reference(
    source: Path,
    item: dict[str, Any],
    route_patterns: list[tuple[str, re.Pattern[str]]],
) -> dict[str, Any]:
    kind = item["kind"]
    raw = item["raw"]

    result: dict[str, Any] = {
        "source": rel(source),
        "kind": kind,
        "raw": raw,
        "classification": "UNKNOWN",
        "resolved": False,
        "target": None,
    }

    if not raw:
        result["classification"] = "EMPTY"
        return result

    if is_external_reference(raw):
        result["classification"] = "EXTERNAL_URI"
        return result

    # Imports / exports / require.
    if kind in {
        "IMPORT",
        "DYNAMIC_IMPORT",
        "EXPORT_FROM",
        "REQUIRE",
    }:
        resolved = resolve_module_reference(
            source,
            raw,
        )

        if resolved is not None:
            result["classification"] = "LOCAL_MODULE"
            result["resolved"] = True
            result["target"] = rel(resolved)
            return result

        if is_external_module_specifier(raw):
            result["classification"] = "EXTERNAL_PACKAGE"
            result["package"] = package_name(raw)
            return result

        result["classification"] = "UNRESOLVED_LOCAL_MODULE"
        return result

    # Explicit /content/... metadata paths.
    if raw.startswith("/content/"):
        resolved = resolve_content_absolute(raw)

        if resolved is not None:
            result["classification"] = "CONTENT_PATH"
            result["resolved"] = True
            result["target"] = rel(resolved)
        else:
            result["classification"] = "UNRESOLVED_CONTENT_PATH"

        return result

    # Public file reference.
    if raw.startswith("/"):
        public_resolved = resolve_public_reference(raw)

        if public_resolved is not None:
            result["classification"] = "PUBLIC_ASSET"
            result["resolved"] = True
            result["target"] = rel(public_resolved)
            return result

        # Dynamic route templates cannot be conclusively resolved here.
        if "${" in raw:
            result["classification"] = "DYNAMIC_ROUTE"
            return result

        if route_exists(raw, route_patterns):
            result["classification"] = "ROUTE"
            result["resolved"] = True
            result["target"] = raw
            return result

        if has_asset_extension(raw):
            result["classification"] = "UNRESOLVED_PUBLIC_ASSET"
            return result

        result["classification"] = "UNRESOLVED_ROUTE"
        return result

    if kind == "CSS_URL":
        # Relative CSS url references.
        base = source.parent / strip_query_fragment(raw)

        if base.is_file():
            result["classification"] = "LOCAL_FILE"
            result["resolved"] = True
            result["target"] = rel(base.resolve())
        else:
            result["classification"] = "UNRESOLVED_LOCAL_FILE"

        return result

    result["classification"] = "NON_LOCAL_STRING"
    return result


# ============================================================================
# PACKAGE.JSON
# ============================================================================

def load_declared_packages() -> set[str]:
    package_path = REPO_ROOT / "package.json"

    if not package_path.is_file():
        return set()

    try:
        data = json.loads(
            package_path.read_text(
                encoding="utf-8"
            )
        )
    except Exception:
        return set()

    declared: set[str] = set()

    for key in (
        "dependencies",
        "devDependencies",
        "peerDependencies",
        "optionalDependencies",
    ):
        values = data.get(key, {})

        if isinstance(values, dict):
            declared.update(values.keys())

    return declared


# ============================================================================
# REACHABILITY
# ============================================================================

def build_reachability(
    files: list[Path],
    graph: dict[str, set[str]],
) -> tuple[set[str], set[str]]:
    roots: set[str] = {
        rel(path)
        for path in files
        if is_entry_root(path)
    }

    reachable: set[str] = set(roots)
    queue: deque[str] = deque(sorted(roots))

    while queue:
        current = queue.popleft()

        for target in graph.get(current, set()):
            if target in reachable:
                continue

            reachable.add(target)
            queue.append(target)

    return roots, reachable


# ============================================================================
# CONTENT REGISTRATION
# ============================================================================

def is_public_content_document(path: Path) -> bool:
    relative = rel(path)

    return (
        relative.startswith("content/essays/")
        or relative.startswith("content/architecture/")
    ) and path.suffix.lower() in CONTENT_EXTENSIONS


def is_vault_document(path: Path) -> bool:
    relative = rel(path)

    return (
        relative.startswith(
            "content/projects/vault/"
        )
        and "/documents/" in relative
        and path.suffix.lower()
        in CONTENT_EXTENSIONS
    )


def classify_unreachable(
    path: Path,
    incoming: int,
) -> str | None:
    category = classify_file(path)
    relative = rel(path)

    if is_entry_root(path):
        return None

    if category == "PUBLIC_ASSET":
        return "UNREFERENCED_PUBLIC_ASSET"

    if is_public_content_document(path):
        return "UNREGISTERED_PUBLIC_CONTENT"

    if is_vault_document(path):
        return "UNREGISTERED_VAULT_DOCUMENT"

    if category == "CONTENT_SUPPORT":
        return "ORPHAN_CONTENT_SUPPORT_CANDIDATE"

    if category in {
        "CONTENT_CODE",
        "COMPONENT",
        "LIBRARY",
        "SOURCE_CODE",
        "APP_CODE",
    }:
        return "ORPHAN_CODE_CANDIDATE"

    if category == "STYLE":
        return "UNREFERENCED_STYLE_CANDIDATE"

    if category == "NEXT_CONVENTION":
        return None

    if category == "CONFIG":
        return None

    if relative == "content/mdx-components.tsx":
        # Next/MDX convention can involve framework discovery.
        return "FRAMEWORK_CONVENTION_REVIEW"

    if incoming == 0:
        return "UNREFERENCED_FILE_REVIEW"

    return "UNREACHABLE_GRAPH_COMPONENT_REVIEW"


# ============================================================================
# MAIN
# ============================================================================

def main() -> None:
    print("Webb.systems Dependency Audit")
    print(f"Revision: {REVISION}")
    print(f"Mode: {MODE}")
    print(f"Root: {REPO_ROOT}")
    print()

    files_before = discover_repo_files()
    hash_before = corpus_hash(files_before)

    file_lookup = {
        rel(path): path
        for path in files_before
    }

    routes = discover_routes(files_before)
    route_patterns = [
        (
            route,
            route_to_regex(route),
        )
        for route in routes
    ]

    references: list[dict[str, Any]] = []
    decode_failures: list[str] = []

    graph: dict[str, set[str]] = defaultdict(set)
    incoming: Counter[str] = Counter()
    outgoing: Counter[str] = Counter()

    external_packages: Counter[str] = Counter()

    # ------------------------------------------------------------------------
    # Scan text files
    # ------------------------------------------------------------------------

    for source in files_before:
        if not is_text_file(source):
            continue

        text = read_utf8(source)

        if text is None:
            decode_failures.append(
                rel(source)
            )
            continue

        raw_refs = collect_code_references(
            source,
            text,
        )

        for raw_item in raw_refs:
            item = classify_reference(
                source,
                raw_item,
                route_patterns,
            )

            references.append(item)

            if (
                item["classification"]
                == "EXTERNAL_PACKAGE"
            ):
                package = item.get(
                    "package"
                )

                if package:
                    external_packages[
                        package
                    ] += 1

            target = item.get("target")

            if (
                item.get("resolved")
                and isinstance(target, str)
                and target in file_lookup
            ):
                source_rel = rel(source)

                graph[source_rel].add(
                    target
                )

                outgoing[source_rel] += 1
                incoming[target] += 1

    # ------------------------------------------------------------------------
    # Reachability
    # ------------------------------------------------------------------------

    roots, reachable = build_reachability(
        files_before,
        graph,
    )

    unreachable = sorted(
        set(file_lookup)
        - reachable
    )

    candidate_groups: dict[
        str,
        list[dict[str, Any]],
    ] = defaultdict(list)

    for relative in unreachable:
        path = file_lookup[relative]

        candidate = classify_unreachable(
            path,
            incoming[relative],
        )

        if candidate is None:
            continue

        candidate_groups[candidate].append(
            {
                "path": relative,
                "category": classify_file(path),
                "bytes": path.stat().st_size,
                "incoming_references": incoming[
                    relative
                ],
                "outgoing_references": outgoing[
                    relative
                ],
            }
        )

    for key in candidate_groups:
        candidate_groups[key].sort(
            key=lambda x: x["path"].lower()
        )

    # ------------------------------------------------------------------------
    # Reference classifications
    # ------------------------------------------------------------------------

    classification_counts: Counter[str] = Counter(
        item["classification"]
        for item in references
    )

    unresolved_refs = [
        item
        for item in references
        if item["classification"].startswith(
            "UNRESOLVED_"
        )
    ]

    resolved_local_refs = [
        item
        for item in references
        if item["resolved"]
        and item["classification"]
        in {
            "LOCAL_MODULE",
            "LOCAL_FILE",
            "CONTENT_PATH",
            "PUBLIC_ASSET",
        }
    ]

    route_refs = [
        item
        for item in references
        if item["classification"]
        in {
            "ROUTE",
            "DYNAMIC_ROUTE",
            "UNRESOLVED_ROUTE",
        }
    ]

    # ------------------------------------------------------------------------
    # Package comparison
    # ------------------------------------------------------------------------

    declared_packages = (
        load_declared_packages()
    )

    observed_packages = set(
        external_packages
    )

    imported_but_undeclared = sorted(
        observed_packages
        - declared_packages
    )

    declared_not_observed = sorted(
        declared_packages
        - observed_packages
    )

    # This is informational only. A package can be required by a framework
    # plugin, config, build step, runtime convention, or indirect integration
    # without appearing in source imports.

    # ------------------------------------------------------------------------
    # High-level category counts
    # ------------------------------------------------------------------------

    file_category_counts = Counter(
        classify_file(path)
        for path in files_before
    )

    # ------------------------------------------------------------------------
    # Output paths
    # ------------------------------------------------------------------------

    run_stamp = local_timestamp()
    run_dir = (
        RESULTS_ROOT
        / run_stamp
    )

    run_dir.mkdir(
        parents=True,
        exist_ok=False,
    )

    json_path = (
        run_dir
        / "WEB_DEPENDENCY_AUDIT.json"
    )

    md_path = (
        run_dir
        / "WEB_DEPENDENCY_AUDIT.md"
    )

    # ------------------------------------------------------------------------
    # JSON report
    # ------------------------------------------------------------------------

    report = {
        "tool": "Webb.systems Dependency Audit",
        "revision": REVISION,
        "mode": MODE,
        "generated_at": (
            datetime.now()
            .astimezone()
            .isoformat()
        ),
        "repository_root": str(
            REPO_ROOT
        ),
        "corpus_manifest_sha256": (
            hash_before
        ),
        "summary": {
            "files_audited": len(
                files_before
            ),
            "routes_detected": len(
                routes
            ),
            "entry_roots": len(
                roots
            ),
            "reachable_files": len(
                reachable
            ),
            "unreachable_files": len(
                unreachable
            ),
            "references_scanned": len(
                references
            ),
            "resolved_local_references": len(
                resolved_local_refs
            ),
            "unresolved_references": len(
                unresolved_refs
            ),
            "external_packages_observed": len(
                observed_packages
            ),
            "decode_failures": len(
                decode_failures
            ),
        },
        "file_category_counts": dict(
            sorted(
                file_category_counts.items()
            )
        ),
        "reference_classification_counts": dict(
            sorted(
                classification_counts.items(),
                key=lambda kv: (
                    -kv[1],
                    kv[0],
                ),
            )
        ),
        "routes": routes,
        "entry_roots": sorted(
            roots
        ),
        "unresolved_references": unresolved_refs,
        "route_references": route_refs,
        "external_packages": {
            "observed_import_counts": dict(
                sorted(
                    external_packages.items(),
                    key=lambda kv: (
                        -kv[1],
                        kv[0],
                    ),
                )
            ),
            "imported_but_undeclared": (
                imported_but_undeclared
            ),
            "declared_but_not_observed_in_imports": (
                declared_not_observed
            ),
            "note": (
                "Declared-but-not-observed is informational only "
                "and is not evidence that a package is unused."
            ),
        },
        "candidate_groups": dict(
            sorted(
                candidate_groups.items()
            )
        ),
        "decode_failures": (
            decode_failures
        ),
        "references": references,
        "graph": {
            source: sorted(targets)
            for source, targets
            in sorted(graph.items())
        },
    }

    with json_path.open(
        "w",
        encoding="utf-8",
        newline="\n",
    ) as f:
        json.dump(
            report,
            f,
            indent=2,
            ensure_ascii=False,
        )
        f.write("\n")

    # ------------------------------------------------------------------------
    # Markdown report
    # ------------------------------------------------------------------------

    md: list[str] = []

    md.append(
        "# Webb.systems Dependency Audit"
    )
    md.append("")
    md.append(
        f"- Revision: `{REVISION}`"
    )
    md.append(
        f"- Mode: `{MODE}`"
    )
    md.append(
        f"- Root: `{REPO_ROOT}`"
    )
    md.append(
        "- Corpus manifest SHA-256: "
        f"`{hash_before}`"
    )
    md.append("")

    md.append("## Summary")
    md.append("")
    md.append(
        f"- Files audited: **{len(files_before)}**"
    )
    md.append(
        f"- Routes detected: **{len(routes)}**"
    )
    md.append(
        f"- Entry roots: **{len(roots)}**"
    )
    md.append(
        f"- Reachable files: **{len(reachable)}**"
    )
    md.append(
        f"- Unreachable files: **{len(unreachable)}**"
    )
    md.append(
        f"- References scanned: **{len(references)}**"
    )
    md.append(
        "- Resolved local references: "
        f"**{len(resolved_local_refs)}**"
    )
    md.append(
        "- Unresolved references: "
        f"**{len(unresolved_refs)}**"
    )
    md.append(
        "- External packages observed: "
        f"**{len(observed_packages)}**"
    )
    md.append(
        f"- Decode failures: **{len(decode_failures)}**"
    )
    md.append("")

    md.append(
        "## Reference Classifications"
    )
    md.append("")
    md.append(
        "| Classification | Count |"
    )
    md.append(
        "|---|---:|"
    )

    for classification, count in sorted(
        classification_counts.items(),
        key=lambda kv: (
            -kv[1],
            kv[0],
        ),
    ):
        md.append(
            f"| `{classification}` | {count} |"
        )

    md.append("")

    md.append("## Candidate Groups")
    md.append("")
    md.append(
        "These are review candidates only. "
        "This audit does not authorize deletion."
    )
    md.append("")

    if candidate_groups:
        for group_name, items in sorted(
            candidate_groups.items()
        ):
            md.append(
                f"### {group_name}"
            )
            md.append("")
            md.append(
                "| File | Category | Bytes | Incoming | Outgoing |"
            )
            md.append(
                "|---|---|---:|---:|---:|"
            )

            for item in items:
                md.append(
                    f"| `{item['path']}` | "
                    f"{item['category']} | "
                    f"{item['bytes']} | "
                    f"{item['incoming_references']} | "
                    f"{item['outgoing_references']} |"
                )

            md.append("")
    else:
        md.append(
            "_No unreachable candidate groups detected._"
        )
        md.append("")

    md.append(
        "## Unresolved Local References"
    )
    md.append("")

    if unresolved_refs:
        md.append(
            "| Source | Kind | Reference | Classification |"
        )
        md.append(
            "|---|---|---|---|"
        )

        for item in unresolved_refs:
            raw = (
                str(item["raw"])
                .replace("|", r"\|")
            )

            md.append(
                f"| `{item['source']}` | "
                f"{item['kind']} | "
                f"`{raw}` | "
                f"{item['classification']} |"
            )
    else:
        md.append(
            "_No unresolved local references detected._"
        )

    md.append("")

    md.append("## Route References")
    md.append("")

    if route_refs:
        md.append(
            "| Source | Reference | Status |"
        )
        md.append(
            "|---|---|---|"
        )

        for item in route_refs:
            raw = (
                str(item["raw"])
                .replace("|", r"\|")
            )

            md.append(
                f"| `{item['source']}` | "
                f"`{raw}` | "
                f"{item['classification']} |"
            )
    else:
        md.append(
            "_No route references detected._"
        )

    md.append("")

    md.append("## External Packages")
    md.append("")

    md.append(
        "### Observed Imports"
    )
    md.append("")

    if external_packages:
        md.append(
            "| Package | Import References |"
        )
        md.append(
            "|---|---:|"
        )

        for package, count in sorted(
            external_packages.items(),
            key=lambda kv: (
                -kv[1],
                kv[0],
            ),
        ):
            md.append(
                f"| `{package}` | {count} |"
            )
    else:
        md.append(
            "_No external package imports detected._"
        )

    md.append("")

    md.append(
        "### Imported But Not Declared"
    )
    md.append("")

    if imported_but_undeclared:
        for package in imported_but_undeclared:
            md.append(
                f"- `{package}`"
            )
    else:
        md.append(
            "_None detected._"
        )

    md.append("")

    md.append(
        "### Declared But Not Observed In Imports"
    )
    md.append("")
    md.append(
        "_Informational only. This is not evidence "
        "that a package is safe to remove._"
    )
    md.append("")

    if declared_not_observed:
        for package in declared_not_observed:
            md.append(
                f"- `{package}`"
            )
    else:
        md.append(
            "_None._"
        )

    md.append("")

    md.append("## Entry Roots")
    md.append("")

    for root in sorted(roots):
        md.append(
            f"- `{root}`"
        )

    md.append("")

    if decode_failures:
        md.append("## Decode Failures")
        md.append("")

        for path in decode_failures:
            md.append(
                f"- `{path}`"
            )

        md.append("")

    md_path.write_text(
        "\n".join(md) + "\n",
        encoding="utf-8",
        newline="\n",
    )

    # ------------------------------------------------------------------------
    # READ-ONLY VERIFICATION
    # ------------------------------------------------------------------------

    files_after = discover_repo_files()
    hash_after = corpus_hash(
        files_after
    )

    if len(files_after) != len(files_before):
        raise RuntimeError(
            "READ-ONLY VERIFICATION FAILED: "
            "source file count changed."
        )

    if hash_after != hash_before:
        raise RuntimeError(
            "READ-ONLY VERIFICATION FAILED: "
            "source corpus hash changed."
        )

    # ------------------------------------------------------------------------
    # Console summary
    # ------------------------------------------------------------------------

    print(
        f"Files audited: {len(files_before)}"
    )
    print(
        f"Routes detected: {len(routes)}"
    )
    print(
        f"Entry roots: {len(roots)}"
    )
    print(
        f"Reachable files: {len(reachable)}"
    )
    print(
        f"Unreachable files: {len(unreachable)}"
    )
    print()
    print(
        f"References scanned: {len(references)}"
    )
    print(
        "Resolved local references: "
        f"{len(resolved_local_refs)}"
    )
    print(
        "Unresolved references: "
        f"{len(unresolved_refs)}"
    )
    print(
        "External packages observed: "
        f"{len(observed_packages)}"
    )
    print(
        f"Decode failures: {len(decode_failures)}"
    )
    print()

    print("Candidate groups:")

    if candidate_groups:
        for group_name, items in sorted(
            candidate_groups.items()
        ):
            print(
                f"  {group_name}: {len(items)}"
            )
    else:
        print("  none")

    print()
    print(
        "Corpus manifest SHA-256: "
        f"{hash_before}"
    )
    print()
    print(
        f"JSON: {json_path}"
    )
    print(
        f"Markdown: {md_path}"
    )
    print()
    print(
        "Site source corpus unmodified: PASS"
    )


if __name__ == "__main__":
    main()