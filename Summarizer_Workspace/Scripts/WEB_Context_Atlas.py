from __future__ import annotations

import hashlib
import json
import os
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any


# ============================================================================
# WEBB.SYSTEMS CONTEXT ATLAS
# ============================================================================

REVISION = "gpt56-web-context-atlas-v1"
MODE = "READ_ONLY"

SCRIPT_PATH = Path(__file__).resolve()
REPO_ROOT = SCRIPT_PATH.parents[2]
WORKSPACE_ROOT = REPO_ROOT / "Summarizer_Workspace"
RESULTS_ROOT = WORKSPACE_ROOT / "Results" / "WEB_Context_Atlas"

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

EXCLUDED_FILENAMES = {
    ".DS_Store",
    "Thumbs.db",
}

TEXT_EXTENSIONS = {
    ".md",
    ".mdx",
    ".txt",
    ".json",
    ".jsonc",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".ts",
    ".tsx",
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
    ".ini",
    ".env",
    ".gitignore",
    ".npmrc",
    ".prettierrc",
    ".eslintrc",
    ".svg",
    ".py",
    ".ps1",
    ".sh",
}

CONFIG_FILENAMES = {
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "jsconfig.json",
    "next.config.js",
    "next.config.mjs",
    "next.config.ts",
    "tailwind.config.js",
    "tailwind.config.ts",
    "postcss.config.js",
    "postcss.config.mjs",
    "eslint.config.js",
    "eslint.config.mjs",
    "vercel.json",
    "middleware.ts",
    "middleware.js",
    "instrumentation.ts",
    "instrumentation.js",
}


# ============================================================================
# HELPERS
# ============================================================================

def local_timestamp() -> str:
    now = datetime.now().astimezone()
    return now.strftime("%Y%m%dT%H%M%S%z")


def normalized_rel(path: Path) -> str:
    return path.relative_to(REPO_ROOT).as_posix()


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()

    with path.open("rb") as f:
        while True:
            block = f.read(1024 * 1024)
            if not block:
                break
            h.update(block)

    return h.hexdigest()


def is_text_file(path: Path) -> bool:
    if path.name in CONFIG_FILENAMES:
        return True

    suffix = path.suffix.lower()

    if suffix in TEXT_EXTENSIONS:
        return True

    if path.name.startswith(".env"):
        return True

    return False


def classify_file(path: Path) -> str:
    rel = normalized_rel(path)
    parts = Path(rel).parts
    name = path.name.lower()

    if path.name in CONFIG_FILENAMES:
        return "CONFIG"

    if name.startswith(".env"):
        return "CONFIG"

    if parts and parts[0] == "content":
        return "CONTENT"

    if parts and parts[0] == "public":
        return "PUBLIC_ASSET"

    if "components" in parts:
        return "COMPONENT"

    if "app" in parts or "pages" in parts:
        return "ROUTE_OR_APP"

    if "lib" in parts or "utils" in parts or "utilities" in parts:
        return "LIBRARY"

    if "styles" in parts:
        return "STYLE"

    if path.suffix.lower() in {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"}:
        return "SOURCE_CODE"

    if path.suffix.lower() in {".md", ".mdx"}:
        return "MARKDOWN"

    if is_text_file(path):
        return "TEXT_OTHER"

    return "BINARY_OR_ASSET"


def discover_files() -> list[Path]:
    files: list[Path] = []

    for current_root, dirs, filenames in os.walk(REPO_ROOT):
        current = Path(current_root)

        try:
            rel_current = current.relative_to(REPO_ROOT)
        except ValueError:
            continue

        if rel_current == Path("."):
            dirs[:] = [
                d for d in dirs
                if d not in EXCLUDED_TOP_LEVEL
            ]
        else:
            dirs[:] = [
                d for d in dirs
                if d not in {
                    ".git",
                    ".next",
                    ".vercel",
                    ".turbo",
                    ".cache",
                    "node_modules",
                    "coverage",
                    "__pycache__",
                }
            ]

        for filename in filenames:
            if filename in EXCLUDED_FILENAMES:
                continue

            path = current / filename

            if path.is_symlink():
                continue

            if not path.is_file():
                continue

            # Defensive exclusion in case traversal rules change.
            rel_parts = path.relative_to(REPO_ROOT).parts

            if rel_parts and rel_parts[0] in EXCLUDED_TOP_LEVEL:
                continue

            files.append(path)

    return sorted(files, key=lambda p: normalized_rel(p).lower())


def count_text_lines(path: Path) -> tuple[int, bool]:
    try:
        raw = path.read_bytes()

        if not raw:
            return 0, True

        text = raw.decode("utf-8")

        return len(text.splitlines()), True

    except UnicodeDecodeError:
        return 0, False

    except OSError:
        return 0, False


def detect_app_route(path: Path) -> dict[str, Any] | None:
    rel = path.relative_to(REPO_ROOT)
    parts = list(rel.parts)

    app_index = None

    for candidate in ("app",):
        if candidate in parts:
            app_index = parts.index(candidate)
            break

    if app_index is None:
        return None

    filename = path.name

    if filename not in {
        "page.ts",
        "page.tsx",
        "page.js",
        "page.jsx",
        "route.ts",
        "route.js",
    }:
        return None

    route_parts = parts[app_index + 1:-1]

    visible_parts = []

    for part in route_parts:
        # Route groups do not appear in the public URL.
        if part.startswith("(") and part.endswith(")"):
            continue

        # Parallel route folders are not URL segments.
        if part.startswith("@"):
            continue

        visible_parts.append(part)

    route = "/" + "/".join(visible_parts)

    if route != "/" and route.endswith("/"):
        route = route.rstrip("/")

    kind = "PAGE" if filename.startswith("page.") else "ROUTE_HANDLER"

    return {
        "route": route,
        "kind": kind,
        "source": normalized_rel(path),
    }


def build_manifest(files: list[Path]) -> tuple[list[dict[str, Any]], str]:
    entries: list[dict[str, Any]] = []

    corpus_hasher = hashlib.sha256()

    for path in files:
        stat = path.stat()
        rel = normalized_rel(path)
        file_hash = sha256_file(path)

        entry = {
            "path": rel,
            "bytes": stat.st_size,
            "sha256": file_hash,
            "extension": path.suffix.lower(),
            "category": classify_file(path),
        }

        entries.append(entry)

        corpus_hasher.update(rel.encode("utf-8"))
        corpus_hasher.update(b"\0")
        corpus_hasher.update(str(stat.st_size).encode("ascii"))
        corpus_hasher.update(b"\0")
        corpus_hasher.update(file_hash.encode("ascii"))
        corpus_hasher.update(b"\n")

    return entries, corpus_hasher.hexdigest()


# ============================================================================
# MAIN
# ============================================================================

def main() -> None:
    print("Webb.systems Context Atlas")
    print(f"Revision: {REVISION}")
    print(f"Mode: {MODE}")
    print(f"Root: {REPO_ROOT}")
    print()

    if not REPO_ROOT.exists():
        raise RuntimeError(f"Repository root does not exist: {REPO_ROOT}")

    source_files_before = discover_files()

    manifest_entries, corpus_hash_before = build_manifest(source_files_before)

    extension_counts: Counter[str] = Counter()
    category_counts: Counter[str] = Counter()
    directory_counts: Counter[str] = Counter()

    text_files = 0
    binary_files = 0
    empty_files = 0
    total_bytes = 0
    total_text_lines = 0
    utf8_text_files = 0
    text_decode_failures = 0

    markdown_files = 0
    mdx_files = 0
    source_code_files = 0

    routes: list[dict[str, Any]] = []
    largest_files: list[dict[str, Any]] = []

    top_level: dict[str, dict[str, int]] = defaultdict(
        lambda: {"files": 0, "bytes": 0}
    )

    for path in source_files_before:
        rel = normalized_rel(path)
        stat = path.stat()
        size = stat.st_size
        suffix = path.suffix.lower()
        category = classify_file(path)

        total_bytes += size
        extension_counts[suffix or "[no extension]"] += 1
        category_counts[category] += 1

        rel_parts = Path(rel).parts

        if rel_parts:
            top = rel_parts[0]
            top_level[top]["files"] += 1
            top_level[top]["bytes"] += size

        parent = Path(rel).parent.as_posix()

        if parent == ".":
            parent = "[repo root]"

        directory_counts[parent] += 1

        if size == 0:
            empty_files += 1

        if suffix == ".md":
            markdown_files += 1

        if suffix == ".mdx":
            mdx_files += 1

        if suffix in {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"}:
            source_code_files += 1

        if is_text_file(path):
            text_files += 1
            lines, decoded = count_text_lines(path)

            if decoded:
                utf8_text_files += 1
                total_text_lines += lines
            else:
                text_decode_failures += 1
        else:
            binary_files += 1

        route = detect_app_route(path)

        if route:
            routes.append(route)

        largest_files.append(
            {
                "path": rel,
                "bytes": size,
                "category": category,
            }
        )

    routes.sort(
        key=lambda r: (
            r["route"].lower(),
            r["kind"],
            r["source"].lower(),
        )
    )

    largest_files.sort(
        key=lambda x: x["bytes"],
        reverse=True,
    )

    run_stamp = local_timestamp()
    run_dir = RESULTS_ROOT / run_stamp
    run_dir.mkdir(parents=True, exist_ok=False)

    json_path = run_dir / "WEB_CONTEXT_ATLAS.json"
    md_path = run_dir / "WEB_CONTEXT_ATLAS.md"

    report = {
        "tool": "Webb.systems Context Atlas",
        "revision": REVISION,
        "mode": MODE,
        "generated_at": datetime.now().astimezone().isoformat(),
        "repository_root": str(REPO_ROOT),
        "exclusions": sorted(EXCLUDED_TOP_LEVEL),
        "summary": {
            "source_files": len(source_files_before),
            "text_files": text_files,
            "binary_or_asset_files": binary_files,
            "markdown_files": markdown_files,
            "mdx_files": mdx_files,
            "source_code_files": source_code_files,
            "empty_files": empty_files,
            "directories_represented": len(directory_counts),
            "total_bytes": total_bytes,
            "total_text_lines": total_text_lines,
            "utf8_text_files": utf8_text_files,
            "text_decode_failures": text_decode_failures,
            "routes_detected": len(routes),
        },
        "extension_counts": dict(
            sorted(
                extension_counts.items(),
                key=lambda kv: (-kv[1], kv[0])
            )
        ),
        "category_counts": dict(
            sorted(
                category_counts.items(),
                key=lambda kv: (-kv[1], kv[0])
            )
        ),
        "top_level_inventory": dict(
            sorted(top_level.items())
        ),
        "directories": dict(
            sorted(directory_counts.items())
        ),
        "routes": routes,
        "largest_files": largest_files[:50],
        "corpus_manifest_sha256": corpus_hash_before,
        "manifest": manifest_entries,
    }

    with json_path.open("w", encoding="utf-8", newline="\n") as f:
        json.dump(
            report,
            f,
            indent=2,
            ensure_ascii=False,
        )
        f.write("\n")

    md_lines: list[str] = []

    md_lines.append("# Webb.systems Context Atlas")
    md_lines.append("")
    md_lines.append(f"- Revision: `{REVISION}`")
    md_lines.append(f"- Mode: `{MODE}`")
    md_lines.append(f"- Root: `{REPO_ROOT}`")
    md_lines.append(
        f"- Corpus manifest SHA-256: `{corpus_hash_before}`"
    )
    md_lines.append("")

    md_lines.append("## Summary")
    md_lines.append("")
    md_lines.append(
        f"- Source files: **{len(source_files_before)}**"
    )
    md_lines.append(
        f"- Text files: **{text_files}**"
    )
    md_lines.append(
        f"- Binary / asset files: **{binary_files}**"
    )
    md_lines.append(
        f"- Markdown files: **{markdown_files}**"
    )
    md_lines.append(
        f"- MDX files: **{mdx_files}**"
    )
    md_lines.append(
        f"- JS / TS source files: **{source_code_files}**"
    )
    md_lines.append(
        f"- Empty files: **{empty_files}**"
    )
    md_lines.append(
        f"- Directories represented: **{len(directory_counts)}**"
    )
    md_lines.append(
        f"- Total bytes: **{total_bytes}**"
    )
    md_lines.append(
        f"- Total text lines: **{total_text_lines}**"
    )
    md_lines.append(
        f"- UTF-8 text files: **{utf8_text_files}**"
    )
    md_lines.append(
        f"- Text decode failures: **{text_decode_failures}**"
    )
    md_lines.append(
        f"- App routes detected: **{len(routes)}**"
    )
    md_lines.append("")

    md_lines.append("## File Categories")
    md_lines.append("")

    for category, count in sorted(
        category_counts.items(),
        key=lambda kv: (-kv[1], kv[0])
    ):
        md_lines.append(f"- `{category}`: {count}")

    md_lines.append("")

    md_lines.append("## Top-Level Inventory")
    md_lines.append("")
    md_lines.append("| Path | Files | Bytes |")
    md_lines.append("|---|---:|---:|")

    for name, values in sorted(top_level.items()):
        md_lines.append(
            f"| `{name}` | {values['files']} | {values['bytes']} |"
        )

    md_lines.append("")

    md_lines.append("## Detected App Routes")
    md_lines.append("")

    if routes:
        md_lines.append("| Route | Kind | Source |")
        md_lines.append("|---|---|---|")

        for route in routes:
            md_lines.append(
                f"| `{route['route']}` | "
                f"{route['kind']} | "
                f"`{route['source']}` |"
            )
    else:
        md_lines.append("_No App Router routes detected._")

    md_lines.append("")

    md_lines.append("## Largest Files")
    md_lines.append("")
    md_lines.append("| File | Bytes | Category |")
    md_lines.append("|---|---:|---|")

    for item in largest_files[:30]:
        md_lines.append(
            f"| `{item['path']}` | "
            f"{item['bytes']} | "
            f"{item['category']} |"
        )

    md_lines.append("")

    md_lines.append("## Extension Counts")
    md_lines.append("")

    for ext, count in sorted(
        extension_counts.items(),
        key=lambda kv: (-kv[1], kv[0])
    ):
        md_lines.append(f"- `{ext}`: {count}")

    md_lines.append("")

    md_path.write_text(
        "\n".join(md_lines) + "\n",
        encoding="utf-8",
        newline="\n",
    )

    # ------------------------------------------------------------------------
    # READ-ONLY VERIFICATION
    # ------------------------------------------------------------------------

    source_files_after = discover_files()
    _, corpus_hash_after = build_manifest(source_files_after)

    if len(source_files_after) != len(source_files_before):
        raise RuntimeError(
            "READ-ONLY VERIFICATION FAILED: source file count changed."
        )

    if corpus_hash_after != corpus_hash_before:
        raise RuntimeError(
            "READ-ONLY VERIFICATION FAILED: source corpus hash changed."
        )

    print(f"Source files: {len(source_files_before)}")
    print(f"Text files: {text_files}")
    print(f"Binary / asset files: {binary_files}")
    print(f"Markdown files: {markdown_files}")
    print(f"MDX files: {mdx_files}")
    print(f"JS / TS source files: {source_code_files}")
    print(f"Empty files: {empty_files}")
    print(f"Directories represented: {len(directory_counts)}")
    print(f"Total bytes: {total_bytes}")
    print(f"Total text lines: {total_text_lines}")
    print(f"Text decode failures: {text_decode_failures}")
    print(f"App routes detected: {len(routes)}")
    print()
    print(f"Corpus manifest SHA-256: {corpus_hash_before}")
    print()
    print(f"JSON: {json_path}")
    print(f"Markdown: {md_path}")
    print()
    print("Site source corpus unmodified: PASS")


if __name__ == "__main__":
    main()