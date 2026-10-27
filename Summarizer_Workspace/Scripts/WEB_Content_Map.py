from __future__ import annotations

import hashlib
import json
import os
import re
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any


# ============================================================================
# WEBB.SYSTEMS CONTENT MAP
# ============================================================================

REVISION = "gpt56-web-content-map-v1"
MODE = "READ_ONLY"

SCRIPT_PATH = Path(__file__).resolve()
REPO_ROOT = SCRIPT_PATH.parents[2]
WORKSPACE_ROOT = REPO_ROOT / "Summarizer_Workspace"
RESULTS_ROOT = WORKSPACE_ROOT / "Results" / "WEB_Content_Map"

CONTENT_ROOT = REPO_ROOT / "content"
APP_ROOT = REPO_ROOT / "app"
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

CONTENT_EXTENSIONS = {
    ".md",
    ".mdx",
}

CODE_EXTENSIONS = {
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
}

FRONTMATTER_RE = re.compile(
    r"\A---\s*\r?\n(.*?)\r?\n---\s*(?:\r?\n|$)",
    re.DOTALL,
)

HEADING_RE = re.compile(
    r"^(#{1,6})\s+(.+?)\s*$",
    re.MULTILINE,
)

MARKDOWN_LINK_RE = re.compile(
    r"\[([^\]]+)\]\(([^)]+)\)"
)

HREF_RE = re.compile(
    r"""href\s*=\s*["']([^"']+)["']""",
    re.IGNORECASE,
)

IMPORT_RE = re.compile(
    r"""(?:import\s+.*?\s+from\s+|import\s*\()\s*["']([^"']+)["']""",
    re.MULTILINE,
)

EXPORT_FROM_RE = re.compile(
    r"""export\s+.*?\s+from\s+["']([^"']+)["']""",
    re.MULTILINE,
)

COMMON_METADATA_KEYS = {
    "title",
    "description",
    "summary",
    "date",
    "published",
    "updated",
    "last_updated",
    "slug",
    "type",
    "category",
    "categories",
    "tags",
    "status",
    "featured",
    "project",
    "projects",
    "related",
    "related_projects",
    "related_research",
    "image",
    "thumbnail",
    "hero",
    "draft",
}


# ============================================================================
# HELPERS
# ============================================================================

def local_timestamp() -> str:
    return datetime.now().astimezone().strftime("%Y%m%dT%H%M%S%z")


def rel(path: Path) -> str:
    return path.relative_to(REPO_ROOT).as_posix()


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()

    with path.open("rb") as f:
        while True:
            chunk = f.read(1024 * 1024)

            if not chunk:
                break

            h.update(chunk)

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


def read_utf8(path: Path) -> str:
    return path.read_text(
        encoding="utf-8",
    )


def strip_quotes(value: str) -> str:
    value = value.strip()

    if (
        len(value) >= 2
        and value[0] == value[-1]
        and value[0] in {'"', "'"}
    ):
        return value[1:-1]

    return value


def parse_scalar(value: str) -> Any:
    value = value.strip()

    if not value:
        return ""

    lower = value.lower()

    if lower == "true":
        return True

    if lower == "false":
        return False

    if lower in {"null", "none", "~"}:
        return None

    if value.startswith("[") and value.endswith("]"):
        inner = value[1:-1].strip()

        if not inner:
            return []

        return [
            strip_quotes(item.strip())
            for item in inner.split(",")
            if item.strip()
        ]

    return strip_quotes(value)


def parse_frontmatter(text: str) -> dict[str, Any]:
    match = FRONTMATTER_RE.match(text)

    if not match:
        return {}

    block = match.group(1)
    result: dict[str, Any] = {}

    current_list_key: str | None = None

    for raw_line in block.splitlines():
        line = raw_line.rstrip()

        if not line.strip():
            continue

        stripped = line.strip()

        if stripped.startswith("#"):
            continue

        if stripped.startswith("- ") and current_list_key:
            existing = result.setdefault(
                current_list_key,
                [],
            )

            if isinstance(existing, list):
                existing.append(
                    strip_quotes(
                        stripped[2:].strip()
                    )
                )

            continue

        match_key = re.match(
            r"^([A-Za-z0-9_-]+)\s*:\s*(.*)$",
            stripped,
        )

        if not match_key:
            current_list_key = None
            continue

        key = match_key.group(1)
        value = match_key.group(2)

        if value == "":
            result[key] = []
            current_list_key = key
        else:
            result[key] = parse_scalar(value)
            current_list_key = None

    return result


def detect_title(
    text: str,
    metadata: dict[str, Any],
    fallback: str,
) -> str:
    title = metadata.get("title")

    if isinstance(title, str) and title.strip():
        return title.strip()

    heading = re.search(
        r"^#\s+(.+?)\s*$",
        text,
        re.MULTILINE,
    )

    if heading:
        return heading.group(1).strip()

    return fallback


def content_family(path: Path) -> str:
    try:
        relative = path.relative_to(CONTENT_ROOT)
    except ValueError:
        return "OUTSIDE_CONTENT"

    parts = relative.parts

    if len(parts) <= 1:
        return "[content root]"

    return parts[0]


def logical_slug(
    path: Path,
    metadata: dict[str, Any],
) -> str:
    slug = metadata.get("slug")

    if isinstance(slug, str) and slug.strip():
        return slug.strip().strip("/")

    return path.stem


def word_count(text: str) -> int:
    body = FRONTMATTER_RE.sub(
        "",
        text,
        count=1,
    )

    body = re.sub(
        r"```.*?```",
        " ",
        body,
        flags=re.DOTALL,
    )

    body = re.sub(
        r"`[^`]*`",
        " ",
        body,
    )

    words = re.findall(
        r"\b[\w'-]+\b",
        body,
        flags=re.UNICODE,
    )

    return len(words)


def extract_links(text: str) -> list[str]:
    links: list[str] = []

    for match in MARKDOWN_LINK_RE.finditer(text):
        links.append(match.group(2).strip())

    for match in HREF_RE.finditer(text):
        links.append(match.group(1).strip())

    return sorted(
        set(link for link in links if link)
    )


def extract_headings(text: str) -> list[dict[str, Any]]:
    headings: list[dict[str, Any]] = []

    for match in HEADING_RE.finditer(text):
        headings.append(
            {
                "level": len(match.group(1)),
                "text": match.group(2).strip(),
            }
        )

    return headings


def detect_route_from_page(path: Path) -> str | None:
    if not APP_ROOT.exists():
        return None

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


def scan_route_pages() -> list[dict[str, Any]]:
    routes: list[dict[str, Any]] = []

    if not APP_ROOT.exists():
        return routes

    for path in APP_ROOT.rglob("*"):
        if not path.is_file():
            continue

        route = detect_route_from_page(path)

        if route is None:
            continue

        routes.append(
            {
                "route": route,
                "source": rel(path),
            }
        )

    return sorted(
        routes,
        key=lambda x: (
            x["route"].lower(),
            x["source"].lower(),
        ),
    )


def discover_support_files() -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []

    if not CONTENT_ROOT.exists():
        return items

    interesting_names = {
        "manifest.ts",
        "manifest.js",
        "manifest.json",
        "meta.ts",
        "meta.js",
        "index.ts",
        "index.js",
    }

    for path in CONTENT_ROOT.rglob("*"):
        if not path.is_file():
            continue

        if path.name not in interesting_names:
            continue

        text = ""

        try:
            text = read_utf8(path)
        except UnicodeDecodeError:
            pass

        imports = sorted(
            set(
                IMPORT_RE.findall(text)
                + EXPORT_FROM_RE.findall(text)
            )
        )

        items.append(
            {
                "path": rel(path),
                "family": content_family(path),
                "bytes": path.stat().st_size,
                "imports_or_exports": imports,
            }
        )

    return sorted(
        items,
        key=lambda x: x["path"].lower(),
    )


# ============================================================================
# MAIN
# ============================================================================

def main() -> None:
    print("Webb.systems Content Map")
    print(f"Revision: {REVISION}")
    print(f"Mode: {MODE}")
    print(f"Root: {REPO_ROOT}")
    print()

    if not CONTENT_ROOT.exists():
        raise RuntimeError(
            f"Content root not found: {CONTENT_ROOT}"
        )

    source_before = discover_repo_files()
    source_hash_before = corpus_hash(source_before)

    content_files = sorted(
        [
            path
            for path in CONTENT_ROOT.rglob("*")
            if path.is_file()
            and path.suffix.lower()
            in CONTENT_EXTENSIONS
        ],
        key=lambda p: rel(p).lower(),
    )

    entries: list[dict[str, Any]] = []

    family_counts: Counter[str] = Counter()
    metadata_key_counts: Counter[str] = Counter()
    status_counts: Counter[str] = Counter()
    type_counts: Counter[str] = Counter()
    tag_counts: Counter[str] = Counter()

    duplicate_slug_map: dict[
        str,
        list[str],
    ] = defaultdict(list)

    title_map: dict[
        str,
        list[str],
    ] = defaultdict(list)

    files_without_frontmatter: list[str] = []
    files_without_title: list[str] = []
    files_without_description: list[str] = []

    total_words = 0
    total_headings = 0
    total_links = 0

    for path in content_files:
        text = read_utf8(path)
        metadata = parse_frontmatter(text)

        family = content_family(path)
        slug = logical_slug(path, metadata)
        title = detect_title(
            text,
            metadata,
            path.stem,
        )

        headings = extract_headings(text)
        links = extract_links(text)
        words = word_count(text)

        total_words += words
        total_headings += len(headings)
        total_links += len(links)

        family_counts[family] += 1
        duplicate_slug_map[slug.lower()].append(
            rel(path)
        )

        title_map[title.lower()].append(
            rel(path)
        )

        if not metadata:
            files_without_frontmatter.append(
                rel(path)
            )

        raw_title = metadata.get("title")

        if not (
            isinstance(raw_title, str)
            and raw_title.strip()
        ):
            files_without_title.append(
                rel(path)
            )

        description = (
            metadata.get("description")
            or metadata.get("summary")
        )

        if not (
            isinstance(description, str)
            and description.strip()
        ):
            files_without_description.append(
                rel(path)
            )

        for key in metadata:
            metadata_key_counts[key] += 1

        status = metadata.get("status")

        if status is not None:
            status_counts[str(status)] += 1

        item_type = metadata.get("type")

        if item_type is not None:
            type_counts[str(item_type)] += 1

        tags = metadata.get("tags", [])

        if isinstance(tags, str):
            tags = [tags]

        if isinstance(tags, list):
            for tag in tags:
                tag_counts[str(tag)] += 1

        entries.append(
            {
                "path": rel(path),
                "family": family,
                "filename": path.name,
                "slug": slug,
                "title": title,
                "extension": path.suffix.lower(),
                "bytes": path.stat().st_size,
                "words": words,
                "heading_count": len(headings),
                "headings": headings,
                "links": links,
                "metadata": metadata,
                "sha256": sha256_file(path),
            }
        )

    duplicate_slugs = {
        slug: paths
        for slug, paths
        in sorted(duplicate_slug_map.items())
        if len(paths) > 1
    }

    duplicate_titles = {
        title: paths
        for title, paths
        in sorted(title_map.items())
        if len(paths) > 1
    }

    route_pages = scan_route_pages()
    support_files = discover_support_files()

    # ------------------------------------------------------------------------
    # PUBLIC ASSET SUMMARY
    # ------------------------------------------------------------------------

    public_asset_count = 0
    public_asset_bytes = 0
    public_extensions: Counter[str] = Counter()

    if PUBLIC_ROOT.exists():
        for path in PUBLIC_ROOT.rglob("*"):
            if not path.is_file():
                continue

            public_asset_count += 1
            public_asset_bytes += path.stat().st_size
            public_extensions[
                path.suffix.lower()
                or "[no extension]"
            ] += 1

    # ------------------------------------------------------------------------
    # OUTPUT
    # ------------------------------------------------------------------------

    run_stamp = local_timestamp()
    run_dir = RESULTS_ROOT / run_stamp
    run_dir.mkdir(
        parents=True,
        exist_ok=False,
    )

    json_path = (
        run_dir
        / "WEB_CONTENT_MAP.json"
    )

    md_path = (
        run_dir
        / "WEB_CONTENT_MAP.md"
    )

    report = {
        "tool": "Webb.systems Content Map",
        "revision": REVISION,
        "mode": MODE,
        "generated_at": (
            datetime.now()
            .astimezone()
            .isoformat()
        ),
        "repository_root": str(REPO_ROOT),
        "corpus_manifest_sha256": (
            source_hash_before
        ),
        "summary": {
            "content_documents": len(
                content_files
            ),
            "content_families": len(
                family_counts
            ),
            "total_words": total_words,
            "total_headings": (
                total_headings
            ),
            "total_links": total_links,
            "route_pages": len(
                route_pages
            ),
            "content_support_files": len(
                support_files
            ),
            "public_assets": (
                public_asset_count
            ),
            "public_asset_bytes": (
                public_asset_bytes
            ),
            "files_without_frontmatter": len(
                files_without_frontmatter
            ),
            "files_without_title_metadata": len(
                files_without_title
            ),
            "files_without_description_or_summary": len(
                files_without_description
            ),
            "duplicate_slugs": len(
                duplicate_slugs
            ),
            "duplicate_titles": len(
                duplicate_titles
            ),
        },
        "family_counts": dict(
            sorted(
                family_counts.items()
            )
        ),
        "metadata_key_counts": dict(
            sorted(
                metadata_key_counts.items(),
                key=lambda kv: (
                    -kv[1],
                    kv[0],
                ),
            )
        ),
        "status_counts": dict(
            sorted(
                status_counts.items()
            )
        ),
        "type_counts": dict(
            sorted(
                type_counts.items()
            )
        ),
        "tag_counts": dict(
            sorted(
                tag_counts.items(),
                key=lambda kv: (
                    -kv[1],
                    kv[0],
                ),
            )
        ),
        "duplicates": {
            "slugs": duplicate_slugs,
            "titles": duplicate_titles,
        },
        "metadata_gaps": {
            "without_frontmatter": (
                files_without_frontmatter
            ),
            "without_title": (
                files_without_title
            ),
            "without_description_or_summary": (
                files_without_description
            ),
        },
        "route_pages": route_pages,
        "content_support_files": (
            support_files
        ),
        "public_asset_summary": {
            "count": public_asset_count,
            "bytes": public_asset_bytes,
            "extension_counts": dict(
                sorted(
                    public_extensions.items(),
                    key=lambda kv: (
                        -kv[1],
                        kv[0],
                    ),
                )
            ),
        },
        "content_documents": entries,
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
    # MARKDOWN REPORT
    # ------------------------------------------------------------------------

    md: list[str] = []

    md.append(
        "# Webb.systems Content Map"
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
        f"`{source_hash_before}`"
    )
    md.append("")

    md.append("## Summary")
    md.append("")
    md.append(
        f"- Content documents: "
        f"**{len(content_files)}**"
    )
    md.append(
        f"- Content families: "
        f"**{len(family_counts)}**"
    )
    md.append(
        f"- Total words: "
        f"**{total_words}**"
    )
    md.append(
        f"- Total headings: "
        f"**{total_headings}**"
    )
    md.append(
        f"- Links found: "
        f"**{total_links}**"
    )
    md.append(
        f"- Route pages: "
        f"**{len(route_pages)}**"
    )
    md.append(
        f"- Content support files: "
        f"**{len(support_files)}**"
    )
    md.append(
        f"- Public assets: "
        f"**{public_asset_count}**"
    )
    md.append("")

    md.append("## Content Families")
    md.append("")
    md.append(
        "| Family | Documents |"
    )
    md.append("|---|---:|")

    for family, count in sorted(
        family_counts.items()
    ):
        md.append(
            f"| `{family}` | {count} |"
        )

    md.append("")

    md.append("## Content Documents")
    md.append("")
    md.append(
        "| Family | Title | Slug | "
        "Words | File |"
    )
    md.append(
        "|---|---|---|---:|---|"
    )

    for item in entries:
        safe_title = (
            item["title"]
            .replace("|", r"\|")
        )

        md.append(
            f"| `{item['family']}` | "
            f"{safe_title} | "
            f"`{item['slug']}` | "
            f"{item['words']} | "
            f"`{item['path']}` |"
        )

    md.append("")

    md.append("## Route Pages")
    md.append("")

    if route_pages:
        md.append(
            "| Route | Source |"
        )
        md.append(
            "|---|---|"
        )

        for route in route_pages:
            md.append(
                f"| `{route['route']}` | "
                f"`{route['source']}` |"
            )
    else:
        md.append(
            "_No App Router page routes found._"
        )

    md.append("")

    md.append(
        "## Content Support Files"
    )
    md.append("")

    if support_files:
        md.append(
            "| Family | File | "
            "Imports / Exports |"
        )
        md.append(
            "|---|---|---|"
        )

        for item in support_files:
            refs = ", ".join(
                f"`{x}`"
                for x in (
                    item[
                        "imports_or_exports"
                    ]
                )
            )

            md.append(
                f"| `{item['family']}` | "
                f"`{item['path']}` | "
                f"{refs} |"
            )
    else:
        md.append(
            "_No manifest/meta/index support "
            "files detected._"
        )

    md.append("")

    md.append("## Metadata Usage")
    md.append("")

    if metadata_key_counts:
        md.append(
            "| Key | Documents |"
        )
        md.append(
            "|---|---:|"
        )

        for key, count in sorted(
            metadata_key_counts.items(),
            key=lambda kv: (
                -kv[1],
                kv[0],
            ),
        ):
            marker = (
                " common"
                if key
                in COMMON_METADATA_KEYS
                else ""
            )

            md.append(
                f"| `{key}` | "
                f"{count}{marker} |"
            )
    else:
        md.append(
            "_No frontmatter metadata "
            "detected._"
        )

    md.append("")

    md.append("## Metadata Gaps")
    md.append("")
    md.append(
        f"- Without frontmatter: "
        f"**{len(files_without_frontmatter)}**"
    )
    md.append(
        f"- Without title metadata: "
        f"**{len(files_without_title)}**"
    )
    md.append(
        "- Without description/summary: "
        f"**{len(files_without_description)}**"
    )
    md.append("")

    if files_without_frontmatter:
        md.append(
            "### Files Without Frontmatter"
        )
        md.append("")

        for path in files_without_frontmatter:
            md.append(f"- `{path}`")

        md.append("")

    md.append("## Duplicate Slugs")
    md.append("")

    if duplicate_slugs:
        for slug, paths in (
            duplicate_slugs.items()
        ):
            md.append(
                f"### `{slug}`"
            )
            md.append("")

            for path in paths:
                md.append(
                    f"- `{path}`"
                )

            md.append("")
    else:
        md.append(
            "_No duplicate content slugs "
            "detected._"
        )
        md.append("")

    md.append("## Duplicate Titles")
    md.append("")

    if duplicate_titles:
        for title, paths in (
            duplicate_titles.items()
        ):
            md.append(
                f"### {title}"
            )
            md.append("")

            for path in paths:
                md.append(
                    f"- `{path}`"
                )

            md.append("")
    else:
        md.append(
            "_No duplicate content titles "
            "detected._"
        )
        md.append("")

    md.append("## Public Asset Summary")
    md.append("")
    md.append(
        f"- Assets: "
        f"**{public_asset_count}**"
    )
    md.append(
        f"- Bytes: "
        f"**{public_asset_bytes}**"
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

    source_after = discover_repo_files()
    source_hash_after = corpus_hash(
        source_after
    )

    if (
        len(source_after)
        != len(source_before)
    ):
        raise RuntimeError(
            "READ-ONLY VERIFICATION FAILED: "
            "source file count changed."
        )

    if (
        source_hash_after
        != source_hash_before
    ):
        raise RuntimeError(
            "READ-ONLY VERIFICATION FAILED: "
            "source corpus hash changed."
        )

    # ------------------------------------------------------------------------
    # CONSOLE
    # ------------------------------------------------------------------------

    print(
        f"Content documents: "
        f"{len(content_files)}"
    )
    print(
        f"Content families: "
        f"{len(family_counts)}"
    )

    for family, count in sorted(
        family_counts.items()
    ):
        print(
            f"  {family}: {count}"
        )

    print()
    print(
        f"Total words: {total_words}"
    )
    print(
        f"Total headings: "
        f"{total_headings}"
    )
    print(
        f"Links found: {total_links}"
    )
    print(
        f"Route pages: "
        f"{len(route_pages)}"
    )
    print(
        f"Content support files: "
        f"{len(support_files)}"
    )
    print(
        f"Public assets: "
        f"{public_asset_count}"
    )
    print()
    print(
        "Metadata gaps:"
    )
    print(
        f"  Without frontmatter: "
        f"{len(files_without_frontmatter)}"
    )
    print(
        f"  Without title metadata: "
        f"{len(files_without_title)}"
    )
    print(
        "  Without description/summary: "
        f"{len(files_without_description)}"
    )
    print()
    print(
        f"Duplicate slugs: "
        f"{len(duplicate_slugs)}"
    )
    print(
        f"Duplicate titles: "
        f"{len(duplicate_titles)}"
    )
    print()
    print(
        f"Corpus manifest SHA-256: "
        f"{source_hash_before}"
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