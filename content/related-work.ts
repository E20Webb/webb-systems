import { essayMeta } from "@/content/essays/meta";
import { architectureMeta } from "@/content/architecture/meta";
import { researchMeta } from "@/content/projects/vault/research/meta";
import { vaultMeta } from "@/content/projects/vault/meta";
import type { RelatedWorkItem } from "@/components/DocumentFooter";

export type DocumentType =
  | "essay"
  | "architecture"
  | "research"
  | "project";

type RelatedReference = {
  type: DocumentType;
  slug: string;
};

type SourceConfig = {
  label: RelatedWorkItem["type"];
  items: readonly {
    slug: string;
    title: string;
  }[];
  href: (slug: string) => string;
};

const documentSources = {
  essay: {
    label: "Essay",
    items: essayMeta,
    href: (slug: string) => `/essays/${slug}`,
  },

  architecture: {
    label: "Architecture",
    items: architectureMeta,
    href: (slug: string) => `/architecture/${slug}`,
  },

  research: {
    label: "Research",
    items: researchMeta,
    href: (slug: string) => `/projects/vault/research/${slug}`,
  },

  project: {
    label: "Project",
    items: vaultMeta,
    href: (slug: string) => `/projects/vault/${slug}`,
  },
} satisfies Record<DocumentType, SourceConfig>;


/*
 * Curated relationship graph
 *
 * These relationships are intentionally selective.
 * They represent strong conceptual continuations rather than
 * automatic similarity or exhaustive cross-linking.
 */

const relatedSelections: Record<string, RelatedReference[]> = {

  // =========================================================
  // ESSAYS
  // =========================================================

  "essay:future-isnt-lost-its-underbuilt": [
    { type: "research", slug: "forge-economics" },
    { type: "project", slug: "forge" },
    { type: "architecture", slug: "post-launch-architecture" },
  ],

  "essay:steam-is-not-a-store": [
    { type: "research", slug: "you-dont-need-to-own-the-stack" },
    { type: "research", slug: "the-monetary-value-of-being-the-board" },
    { type: "project", slug: "xbox-forever" },
  ],

  "essay:gaming-culture": [
    { type: "architecture", slug: "cultural-infrastructure-architecture" },
    { type: "research", slug: "discord-server-era" },
    { type: "research", slug: "return-of-the-destination" },
    { type: "project", slug: "xbox-forever" },
  ],

  "essay:gaming-profits": [
    { type: "research", slug: "the-monetary-value-of-being-the-board" },
    { type: "architecture", slug: "advertising-mode-problem-architecture" },
    { type: "project", slug: "xbox-forever-ads" },
    { type: "project", slug: "xbox-forever" },
  ],

  "essay:genre-bottleneck": [
    { type: "architecture", slug: "genre-taxonomy-architecture" },
    { type: "architecture", slug: "catalog-architecture" },
    { type: "project", slug: "xbox-forever" },
  ],

  "essay:lost-community": [
    { type: "architecture", slug: "taste-graph-problem-architecture" },
    { type: "architecture", slug: "catalog-architecture" },
    { type: "research", slug: "return-of-the-destination" },
    { type: "project", slug: "xbox-forever" },
  ],

  "essay:unexploited-identity": [
    { type: "architecture", slug: "cultural-infrastructure-architecture" },
    { type: "research", slug: "discord-server-era" },
    { type: "project", slug: "xbox-forever" },
  ],

  "essay:game-ip-mythos-vs-continuity": [
    { type: "architecture", slug: "aesthetic-identity" },
    { type: "architecture", slug: "ip-expansion-architecture" },
    { type: "architecture", slug: "studio-identity-architecture" },
    { type: "project", slug: "xbox-forever" },
  ],

  "essay:game-development-starts-at-zero": [
    { type: "research", slug: "forge-economics" },
    { type: "project", slug: "forge" },
    { type: "essay", slug: "future-isnt-lost-its-underbuilt" },
  ],

  "essay:death-of-play": [
    { type: "essay", slug: "gaming-culture" },
    { type: "essay", slug: "unexploited-identity" },
    { type: "project", slug: "xbox-forever" },
  ],


  // =========================================================
  // ARCHITECTURE
  // =========================================================

  "architecture:advertising-mode-problem-architecture": [
    { type: "essay", slug: "gaming-profits" },
    { type: "research", slug: "the-trust-layer" },
    { type: "project", slug: "xbox-forever-ads" },
  ],

  "architecture:aesthetic-identity": [
    { type: "essay", slug: "game-ip-mythos-vs-continuity" },
    { type: "architecture", slug: "ip-expansion-architecture" },
    { type: "project", slug: "xbox-forever" },
  ],

  "architecture:catalog-architecture": [
    { type: "essay", slug: "lost-community" },
    { type: "essay", slug: "genre-bottleneck" },
    { type: "architecture", slug: "taste-graph-problem-architecture" },
    { type: "project", slug: "xbox-forever" },
  ],

  "architecture:cultural-infrastructure-architecture": [
    { type: "essay", slug: "gaming-culture" },
    { type: "research", slug: "return-of-the-destination" },
    { type: "research", slug: "discord-server-era" },
    { type: "project", slug: "xbox-forever" },
  ],

  "architecture:genre-taxonomy-architecture": [
    { type: "essay", slug: "genre-bottleneck" },
    { type: "architecture", slug: "catalog-architecture" },
    { type: "architecture", slug: "publisher-identity-architecture" },
    { type: "project", slug: "xbox-forever" },
  ],

  "architecture:ip-expansion-architecture": [
    { type: "essay", slug: "game-ip-mythos-vs-continuity" },
    { type: "architecture", slug: "aesthetic-identity" },
    { type: "architecture", slug: "studio-identity-architecture" },
    { type: "project", slug: "xbox-forever" },
  ],

  "architecture:post-launch-architecture": [
    { type: "essay", slug: "future-isnt-lost-its-underbuilt" },
    { type: "research", slug: "forge-economics" },
    { type: "project", slug: "forge" },
    { type: "project", slug: "xbox-forever" },
  ],

  "architecture:publisher-identity-architecture": [
    { type: "essay", slug: "genre-bottleneck" },
    { type: "architecture", slug: "studio-identity-architecture" },
    { type: "architecture", slug: "release-cadence-architecture" },
    { type: "project", slug: "xbox-forever" },
  ],

  "architecture:release-cadence-architecture": [
    { type: "essay", slug: "gaming-culture" },
    { type: "architecture", slug: "publisher-identity-architecture" },
    { type: "architecture", slug: "cultural-infrastructure-architecture" },
    { type: "project", slug: "xbox-forever" },
  ],

  "architecture:studio-identity-architecture": [
    { type: "essay", slug: "game-ip-mythos-vs-continuity" },
    { type: "architecture", slug: "aesthetic-identity" },
    { type: "architecture", slug: "publisher-identity-architecture" },
    { type: "project", slug: "xbox-forever" },
  ],

  "architecture:taste-graph-problem-architecture": [
    { type: "essay", slug: "lost-community" },
    { type: "architecture", slug: "catalog-architecture" },
    { type: "architecture", slug: "genre-taxonomy-architecture" },
    { type: "project", slug: "xbox-forever" },
  ],


  // =========================================================
  // RESEARCH
  // =========================================================

  "research:the-monetary-value-of-being-the-board": [
    { type: "essay", slug: "gaming-profits" },
    { type: "essay", slug: "steam-is-not-a-store" },
    { type: "research", slug: "you-dont-need-to-own-the-stack" },
    { type: "project", slug: "xbox-forever" },
  ],

  "research:you-dont-need-to-own-the-stack": [
    { type: "essay", slug: "steam-is-not-a-store" },
    { type: "research", slug: "the-monetary-value-of-being-the-board" },
    { type: "research", slug: "discord-server-era" },
    { type: "project", slug: "xbox-forever" },
  ],

  "research:return-of-the-destination": [
    { type: "essay", slug: "lost-community" },
    { type: "essay", slug: "gaming-culture" },
    { type: "architecture", slug: "cultural-infrastructure-architecture" },
    { type: "project", slug: "xbox-forever" },
  ],

  "research:the-trust-layer": [
    { type: "essay", slug: "gaming-profits" },
    { type: "architecture", slug: "advertising-mode-problem-architecture" },
    { type: "project", slug: "xbox-forever-ads" },
    { type: "project", slug: "xbox-forever" },
  ],

  "research:forge-economics": [
    { type: "essay", slug: "game-development-starts-at-zero" },
    { type: "essay", slug: "future-isnt-lost-its-underbuilt" },
    { type: "architecture", slug: "post-launch-architecture" },
    { type: "project", slug: "forge" },
  ],

  "research:discord-server-era": [
    { type: "essay", slug: "gaming-culture" },
    { type: "architecture", slug: "cultural-infrastructure-architecture" },
    { type: "research", slug: "you-dont-need-to-own-the-stack" },
    { type: "project", slug: "xbox-forever" },
  ],


  // =========================================================
  // PROJECTS
  // =========================================================

  "project:xbox-forever": [
    { type: "research", slug: "the-monetary-value-of-being-the-board" },
    { type: "research", slug: "you-dont-need-to-own-the-stack" },
    { type: "research", slug: "return-of-the-destination" },
    { type: "research", slug: "discord-server-era" },
  ],

  "project:xbox-forever-ads": [
    { type: "architecture", slug: "advertising-mode-problem-architecture" },
    { type: "essay", slug: "gaming-profits" },
    { type: "research", slug: "the-trust-layer" },
  ],

  "project:xbox-dashboard-launcher-kit": [
    { type: "project", slug: "xbox-forever" },
  ],

  "project:forge": [
    { type: "research", slug: "forge-economics" },
    { type: "essay", slug: "game-development-starts-at-zero" },
    { type: "essay", slug: "future-isnt-lost-its-underbuilt" },
    { type: "architecture", slug: "post-launch-architecture" },
  ],

  /*
   * NC Foundation intentionally has no forced related-work links yet.
   * A dedicated supporting Research layer should exist before we
   * manufacture relationships simply to populate the footer.
   */
  "project:nc-foundation": [],
};


function resolveReference(
  reference: RelatedReference
): RelatedWorkItem {
  const source = documentSources[reference.type];

  const item = source.items.find(
    (entry) => entry.slug === reference.slug
  );

  if (!item) {
    throw new Error(
      `Related work target not found: ${reference.type}:${reference.slug}`
    );
  }

  return {
    type: source.label,
    title: item.title,
    href: source.href(item.slug),
  };
}


export function getRelatedWork(
  type: DocumentType,
  slug: string
): RelatedWorkItem[] {
  const references =
    relatedSelections[`${type}:${slug}`] ?? [];

  return references.map(resolveReference);
}