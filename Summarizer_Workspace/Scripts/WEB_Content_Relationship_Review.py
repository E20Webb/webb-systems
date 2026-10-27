from __future__ import annotations

from pathlib import Path
import re
from collections import Counter

ROOT = Path(r"C:\webb-systems")
OUTPUT = (
    ROOT
    / "Summarizer_Workspace"
    / "Results"
    / "WEB_Content_Relationship_Review"
    / "WEB_CONTENT_RELATIONSHIP_REVIEW.txt"
)

CONTENT_DIRS = [
    ROOT / "content" / "architecture",
    ROOT / "content" / "essays",
]

TEXT_EXTENSIONS = {".md", ".mdx"}

MAX_PREVIEW_LINES = 120

STOPWORDS = {
    "the", "and", "that", "this", "with", "from", "into", "they", "their",
    "there", "what", "when", "where", "which", "while", "about", "because",
    "would", "could", "should", "have", "has", "had", "been", "being", "are",
    "was", "were", "will", "for", "you", "your", "but", "not", "can", "its",
    "our", "out", "all", "more", "than", "then", "them", "these", "those",
    "how", "why", "who", "also", "just", "over", "under", "through", "between",
    "within", "without", "each", "other", "some", "many", "most", "much",
    "very", "only", "still", "even", "like", "such", "one", "two", "three",
    "use", "used", "using", "make", "makes", "made", "way", "ways", "new",
}

HEADING_RE = re.compile(r"^\s{0,3}(#{1,6})\s+(.+?)\s*$")
HTML_H1_RE = re.compile(r"<h1[^>]*>(.*?)</h1>", re.IGNORECASE | re.DOTALL)
TITLE_TAG_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.IGNORECASE | re.DOTALL)

MARKDOWN_LINK_RE = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
HTML_LINK_RE = re.compile(r'href=["\']([^"\']+)["\']', re.IGNORECASE)

WORD_RE = re.compile(r"[A-Za-z][A-Za-z0-9'’-]{2,}")


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def strip_tags(text: str) -> str:
    return re.sub(r"<[^>]+>", "", text)


def extract_title(text: str, fallback: str) -> str:
    match = HTML_H1_RE.search(text)
    if match:
        title = strip_tags(match.group(1)).strip()
        if title:
            return " ".join(title.split())

    for line in text.splitlines():
        heading = HEADING_RE.match(line)
        if heading and len(heading.group(1)) == 1:
            return heading.group(2).strip()

    match = TITLE_TAG_RE.search(text)
    if match:
        title = strip_tags(match.group(1)).strip()
        if title:
            return " ".join(title.split())

    return fallback


def extract_headings(text: str) -> list[str]:
    headings = []

    for line in text.splitlines():
        match = HEADING_RE.match(line)
        if match:
            level = len(match.group(1))
            title = match.group(2).strip()
            headings.append(f"H{level}: {title}")

    html_heading_re = re.compile(
        r"<h([1-6])[^>]*>(.*?)</h\1>",
        re.IGNORECASE | re.DOTALL,
    )

    for match in html_heading_re.finditer(text):
        level = match.group(1)
        title = strip_tags(match.group(2))
        title = " ".join(title.split())
        if title:
            entry = f"H{level}: {title}"
            if entry not in headings:
                headings.append(entry)

    return headings


def extract_links(text: str) -> list[str]:
    links = []

    for match in MARKDOWN_LINK_RE.findall(text):
        value = match.strip()
        if value and value not in links:
            links.append(value)

    for match in HTML_LINK_RE.findall(text):
        value = match.strip()
        if value and value not in links:
            links.append(value)

    return links


def extract_key_terms(text: str, limit: int = 20) -> list[tuple[str, int]]:
    cleaned = re.sub(r"```.*?```", " ", text, flags=re.DOTALL)
    cleaned = re.sub(r"<[^>]+>", " ", cleaned)
    cleaned = re.sub(r"\[[^\]]+\]\([^)]+\)", " ", cleaned)

    words = []

    for match in WORD_RE.findall(cleaned.lower()):
        word = match.strip("'’-")
        if len(word) < 4:
            continue
        if word in STOPWORDS:
            continue
        words.append(word)

    counts = Counter(words)
    return counts.most_common(limit)


def word_count(text: str) -> int:
    return len(WORD_RE.findall(strip_tags(text)))


def document_files() -> list[tuple[str, Path]]:
    docs = []

    for folder in CONTENT_DIRS:
        if not folder.exists():
            continue

        family = folder.name

        for path in sorted(folder.iterdir(), key=lambda p: p.name.lower()):
            if not path.is_file():
                continue

            if path.suffix.lower() not in TEXT_EXTENSIONS:
                continue

            docs.append((family, path))

    return docs


def line_preview(text: str) -> str:
    lines = text.splitlines()
    selected = lines[:MAX_PREVIEW_LINES]

    numbered = [
        f"{index + 1:04d}: {line}"
        for index, line in enumerate(selected)
    ]

    return "\n".join(numbered)


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    docs = document_files()

    out = []

    out.append("=" * 88)
    out.append("WEBB.SYSTEMS CONTENT RELATIONSHIP REVIEW")
    out.append("=" * 88)
    out.append("")
    out.append(f"Root: {ROOT}")
    out.append(f"Documents reviewed: {len(docs)}")
    out.append("")
    out.append(
        "Purpose: provide a compact, source-grounded review of Architecture and Essays "
        "for relationship mapping across Essays, Architecture, Research, and Projects."
    )
    out.append("")
    out.append("=" * 88)
    out.append("DOCUMENT INDEX")
    out.append("=" * 88)
    out.append("")

    for family, path in docs:
        rel = path.relative_to(ROOT).as_posix()
        out.append(f"[{family.upper()}] {rel}")

    out.append("")

    for family, path in docs:
        text = read_text(path)

        rel = path.relative_to(ROOT).as_posix()
        slug = path.stem
        title = extract_title(text, slug)
        headings = extract_headings(text)
        links = extract_links(text)
        terms = extract_key_terms(text)
        count = word_count(text)

        out.append("=" * 88)
        out.append(f"{family.upper()} DOCUMENT")
        out.append("=" * 88)
        out.append("")
        out.append(f"FILE: {rel}")
        out.append(f"SLUG: {slug}")
        out.append(f"TITLE: {title}")
        out.append(f"WORD COUNT: {count}")
        out.append("")

        out.append("HEADINGS")
        out.append("-" * 88)

        if headings:
            for heading in headings:
                out.append(heading)
        else:
            out.append("(none detected)")

        out.append("")
        out.append("OUTBOUND LINKS")
        out.append("-" * 88)

        if links:
            for link in links:
                out.append(link)
        else:
            out.append("(none detected)")

        out.append("")
        out.append("FREQUENT KEY TERMS")
        out.append("-" * 88)

        if terms:
            for term, frequency in terms:
                out.append(f"{term}: {frequency}")
        else:
            out.append("(none detected)")

        out.append("")
        out.append(f"FIRST {MAX_PREVIEW_LINES} LINES")
        out.append("-" * 88)
        out.append(line_preview(text))
        out.append("")
        out.append("")

    OUTPUT.write_text("\n".join(out), encoding="utf-8")

    print("Webb.systems Content Relationship Review")
    print(f"Documents reviewed: {len(docs)}")
    print(f"Output: {OUTPUT}")
    print("Mode: READ_ONLY")


if __name__ == "__main__":
    main()