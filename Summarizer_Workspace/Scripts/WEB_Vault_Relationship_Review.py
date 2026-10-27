from __future__ import annotations

from pathlib import Path
import re
from collections import Counter

ROOT = Path(r"C:\webb-systems")

OUTPUT = (
    ROOT
    / "Summarizer_Workspace"
    / "Results"
    / "WEB_Vault_Relationship_Review"
    / "WEB_VAULT_RELATIONSHIP_REVIEW.txt"
)

RESEARCH_DIR = (
    ROOT
    / "content"
    / "projects"
    / "vault"
    / "research"
    / "documents"
)

RESEARCH_META = (
    ROOT
    / "content"
    / "projects"
    / "vault"
    / "research"
    / "meta.ts"
)

PROJECTS = [
    "xbox-forever",
    "xbox-forever-ads",
    "xbox-dashboard-launcher-kit",
    "forge",
    "nc-foundation",
]

PROJECT_PREVIEW_LINES = 80

STOPWORDS = {
    "the", "and", "that", "this", "with", "from", "into", "they", "their",
    "there", "what", "when", "where", "which", "while", "about", "because",
    "would", "could", "should", "have", "has", "had", "been", "being", "are",
    "was", "were", "will", "for", "you", "your", "but", "not", "can", "its",
    "our", "out", "all", "more", "than", "then", "them", "these", "those",
    "how", "why", "who", "also", "just", "over", "under", "through",
    "between", "within", "without", "each", "other", "some", "many", "most",
    "much", "very", "only", "still", "even", "like", "such", "one", "two",
    "three", "use", "used", "using", "make", "makes", "made", "way", "ways",
    "new",
}

HEADING_RE = re.compile(r"^\s{0,3}(#{1,6})\s+(.+?)\s*$")

HTML_HEADING_RE = re.compile(
    r"<h([1-6])[^>]*>(.*?)</h\1>",
    re.IGNORECASE | re.DOTALL,
)

HTML_H1_RE = re.compile(
    r"<h1[^>]*>(.*?)</h1>",
    re.IGNORECASE | re.DOTALL,
)

MARKDOWN_LINK_RE = re.compile(r"\[[^\]]+\]\(([^)]+)\)")

HTML_LINK_RE = re.compile(
    r'href=["\']([^"\']+)["\']',
    re.IGNORECASE,
)

RAW_URL_RE = re.compile(
    r'https?://[^\s<>"\')]+',
    re.IGNORECASE,
)

WORD_RE = re.compile(r"[A-Za-z][A-Za-z0-9'’-]{2,}")

SOURCE_SIGNAL_RE = re.compile(
    r"\b("
    r"according to|study|studies|research|researchers|report|reports|"
    r"survey|surveys|data|dataset|analysis|analysts|estimated|estimates|"
    r"statistics|statistic|percent|percentage|million|billion|"
    r"Discord|Steam|Valve|Xbox|Microsoft|PlayStation|Sony|Twitch|"
    r"YouTube|Reddit|Fortnite|Epic|Roblox|TikTok"
    r")\b",
    re.IGNORECASE,
)

YEAR_RE = re.compile(r"\b(?:19|20)\d{2}\b")
NUMBER_RE = re.compile(r"\b\d+(?:\.\d+)?%?\b")


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def strip_tags(text: str) -> str:
    return re.sub(r"<[^>]+>", "", text)


def extract_title(text: str, fallback: str) -> str:
    match = HTML_H1_RE.search(text)

    if match:
        title = strip_tags(match.group(1)).strip()
        title = " ".join(title.split())

        if title:
            return title

    for line in text.splitlines():
        match = HEADING_RE.match(line)

        if match and len(match.group(1)) == 1:
            return match.group(2).strip()

    return fallback


def extract_headings(text: str) -> list[str]:
    headings = []

    for line in text.splitlines():
        match = HEADING_RE.match(line)

        if match:
            level = len(match.group(1))
            title = match.group(2).strip()
            headings.append(f"H{level}: {title}")

    for match in HTML_HEADING_RE.finditer(text):
        level = match.group(1)
        title = strip_tags(match.group(2))
        title = " ".join(title.split())

        if not title:
            continue

        entry = f"H{level}: {title}"

        if entry not in headings:
            headings.append(entry)

    return headings


def extract_links(text: str) -> list[str]:
    links = []

    candidates = []
    candidates.extend(MARKDOWN_LINK_RE.findall(text))
    candidates.extend(HTML_LINK_RE.findall(text))
    candidates.extend(RAW_URL_RE.findall(text))

    for value in candidates:
        value = value.strip()

        if value and value not in links:
            links.append(value)

    return links


def extract_key_terms(
    text: str,
    limit: int = 25,
) -> list[tuple[str, int]]:

    cleaned = re.sub(
        r"```.*?```",
        " ",
        text,
        flags=re.DOTALL,
    )

    cleaned = re.sub(r"<[^>]+>", " ", cleaned)

    words = []

    for match in WORD_RE.findall(cleaned.lower()):
        word = match.strip("'’-")

        if len(word) < 4:
            continue

        if word in STOPWORDS:
            continue

        words.append(word)

    return Counter(words).most_common(limit)


def word_count(text: str) -> int:
    return len(WORD_RE.findall(strip_tags(text)))


def numbered_text(text: str) -> str:
    return "\n".join(
        f"{index + 1:04d}: {line}"
        for index, line in enumerate(text.splitlines())
    )


def numbered_preview(
    text: str,
    max_lines: int,
) -> str:

    lines = text.splitlines()[:max_lines]

    return "\n".join(
        f"{index + 1:04d}: {line}"
        for index, line in enumerate(lines)
    )


def source_audit_candidates(text: str) -> list[str]:
    candidates = []

    for index, line in enumerate(text.splitlines(), start=1):
        stripped = line.strip()

        if not stripped:
            continue

        has_signal = SOURCE_SIGNAL_RE.search(stripped)
        has_year = YEAR_RE.search(stripped)
        has_number = NUMBER_RE.search(stripped)

        if has_signal or has_year or has_number:
            candidates.append(
                f"{index:04d}: {stripped}"
            )

    return candidates


def append_document_summary(
    out: list[str],
    label: str,
    path: Path,
    *,
    full_text: bool = False,
    preview_lines: int = 80,
    discord_source_audit: bool = False,
) -> None:

    if not path.exists():
        out.append("=" * 96)
        out.append(label)
        out.append("=" * 96)
        out.append("")
        out.append(f"MISSING: {path}")
        out.append("")
        return

    text = read_text(path)

    relative = path.relative_to(ROOT).as_posix()
    slug = path.stem
    title = extract_title(text, slug)
    headings = extract_headings(text)
    links = extract_links(text)
    terms = extract_key_terms(text)
    count = word_count(text)

    out.append("=" * 96)
    out.append(label)
    out.append("=" * 96)
    out.append("")
    out.append(f"FILE: {relative}")
    out.append(f"SLUG: {slug}")
    out.append(f"TITLE: {title}")
    out.append(f"WORD COUNT: {count}")
    out.append("")

    out.append("HEADINGS")
    out.append("-" * 96)

    if headings:
        out.extend(headings)
    else:
        out.append("(none detected)")

    out.append("")
    out.append("OUTBOUND LINKS / URLS")
    out.append("-" * 96)

    if links:
        out.extend(links)
    else:
        out.append("(none detected)")

    out.append("")
    out.append("FREQUENT KEY TERMS")
    out.append("-" * 96)

    if terms:
        for term, frequency in terms:
            out.append(f"{term}: {frequency}")
    else:
        out.append("(none detected)")

    if discord_source_audit:
        out.append("")
        out.append("SOURCE / FACT-CHECK CANDIDATES")
        out.append("-" * 96)

        candidates = source_audit_candidates(text)

        if candidates:
            out.extend(candidates)
        else:
            out.append("(none detected)")

    out.append("")

    if full_text:
        out.append("FULL TEXT")
        out.append("-" * 96)
        out.append(numbered_text(text))
    else:
        out.append(f"FIRST {preview_lines} LINES")
        out.append("-" * 96)
        out.append(numbered_preview(text, preview_lines))

    out.append("")
    out.append("")


def main() -> None:
    OUTPUT.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    out = []

    out.append("=" * 96)
    out.append("WEBB.SYSTEMS VAULT RELATIONSHIP REVIEW")
    out.append("=" * 96)
    out.append("")
    out.append(f"Root: {ROOT}")
    out.append("")
    out.append(
        "Purpose: review the six Research documents and five Vault projects "
        "for cross-linking across Essays, Architecture, Research, and Projects."
    )
    out.append("")
    out.append(
        "Special review: Discord Server Era includes a source/fact-check "
        "candidate section to support a later research-strengthening pass."
    )
    out.append("")

    # Research metadata
    out.append("=" * 96)
    out.append("RESEARCH METADATA")
    out.append("=" * 96)
    out.append("")

    if RESEARCH_META.exists():
        out.append(read_text(RESEARCH_META))
    else:
        out.append(f"MISSING: {RESEARCH_META}")

    out.append("")
    out.append("")

    # Research documents
    research_docs = sorted(
        RESEARCH_DIR.glob("*.mdx"),
        key=lambda path: path.name.lower(),
    )

    out.append("=" * 96)
    out.append("RESEARCH DOCUMENT INDEX")
    out.append("=" * 96)
    out.append("")

    for path in research_docs:
        out.append(
            path.relative_to(ROOT).as_posix()
        )

    out.append("")
    out.append("")

    for path in research_docs:
        is_discord = (
            path.name.lower()
            == "discord-server-era.mdx"
        )

        append_document_summary(
            out,
            "RESEARCH DOCUMENT",
            path,
            full_text=True,
            discord_source_audit=is_discord,
        )

    # Vault projects
    out.append("=" * 96)
    out.append("VAULT PROJECT REVIEW")
    out.append("=" * 96)
    out.append("")

    for project_slug in PROJECTS:

        project_root = (
            ROOT
            / "content"
            / "projects"
            / "vault"
            / project_slug
        )

        route_root = (
            ROOT
            / "app"
            / "projects"
            / "vault"
            / project_slug
        )

        meta_path = project_root / "meta.ts"

        index_path = (
            route_root
            / "index"
            / "page.tsx"
        )

        documents_dir = (
            project_root
            / "documents"
        )

        out.append("#" * 96)
        out.append(f"PROJECT: {project_slug}")
        out.append("#" * 96)
        out.append("")

        out.append("PROJECT OVERVIEW PAGE")
        out.append("-" * 96)

        if index_path.exists():
            index_text = read_text(index_path)

            out.append(
                f"FILE: {index_path.relative_to(ROOT).as_posix()}"
            )
            out.append("")
            out.append(numbered_text(index_text))
        else:
            out.append(f"MISSING: {index_path}")

        out.append("")
        out.append("")

        out.append("PROJECT METADATA")
        out.append("-" * 96)

        if meta_path.exists():
            out.append(
                f"FILE: {meta_path.relative_to(ROOT).as_posix()}"
            )
            out.append("")
            out.append(read_text(meta_path))
        else:
            out.append(f"MISSING: {meta_path}")

        out.append("")
        out.append("")

        if not documents_dir.exists():
            out.append("PROJECT DOCUMENTS: directory missing")
            out.append("")
            continue

        documents = sorted(
            documents_dir.glob("*.mdx"),
            key=lambda path: path.name.lower(),
        )

        out.append(
            f"PROJECT DOCUMENT COUNT: {len(documents)}"
        )
        out.append("")

        for document in documents:
            append_document_summary(
                out,
                "PROJECT DOCUMENT",
                document,
                full_text=False,
                preview_lines=PROJECT_PREVIEW_LINES,
            )

    OUTPUT.write_text(
        "\n".join(out),
        encoding="utf-8",
    )

    print("Webb.systems Vault Relationship Review")
    print(f"Research documents: {len(research_docs)}")
    print(f"Projects: {len(PROJECTS)}")
    print(f"Output: {OUTPUT}")
    print("Mode: READ_ONLY")


if __name__ == "__main__":
    main()