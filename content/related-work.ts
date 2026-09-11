import { essayMeta } from "@/content/essays/meta";
import { architectureMeta } from "@/content/architecture/meta";
import type { RelatedWorkItem } from "@/components/DocumentFooter";

type DocumentType = "essay" | "architecture";

type RelatedReference = {
  type: DocumentType;
  slug: string;
};

const relatedSelections: Record<string, RelatedReference[]> = {
  "essay:future-isnt-lost-its-underbuilt": [
    { type: "essay", slug: "gaming-culture" },
    { type: "architecture", slug: "post-launch-architecture" },
  ],
  "essay:gaming-culture": [
    { type: "architecture", slug: "discord-server-era" },
    { type: "architecture", slug: "cultural-infrastructure-architecture" },
  ],
  "architecture:discord-server-era": [
    { type: "essay", slug: "gaming-culture" },
    { type: "architecture", slug: "cultural-infrastructure-architecture" },
  ],
  "essay:gaming-profits": [
    { type: "architecture", slug: "advertising-mode-problem-architecture" },
    { type: "architecture", slug: "post-launch-architecture" },
  ],
  "architecture:advertising-mode-problem-architecture": [
    { type: "essay", slug: "gaming-profits" },
    { type: "architecture", slug: "post-launch-architecture" },
  ],
  "architecture:post-launch-architecture": [
    { type: "essay", slug: "future-isnt-lost-its-underbuilt" },
    { type: "essay", slug: "gaming-profits" },
  ],
};

export function getRelatedWork(type: DocumentType, slug: string): RelatedWorkItem[] {
  const references = relatedSelections[`${type}:${slug}`] ?? [];

  return references.flatMap((reference) => {
    const source = reference.type === "essay" ? essayMeta : architectureMeta;
    const item = source.find((entry) => entry.slug === reference.slug);

    if (!item) return [];

    return [{
      type: reference.type === "essay" ? "Essay" : "Architecture",
      title: item.title,
      href: reference.type === "essay"
        ? `/essays/${item.slug}`
        : `/architecture/${item.slug}`,
    } satisfies RelatedWorkItem];
  });
}