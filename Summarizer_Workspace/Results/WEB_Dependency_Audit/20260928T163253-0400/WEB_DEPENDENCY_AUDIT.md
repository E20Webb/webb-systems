# Webb.systems Dependency Audit

- Revision: `gpt56-web-dependency-audit-v1`
- Mode: `READ_ONLY`
- Root: `C:\webb-systems`
- Corpus manifest SHA-256: `4d50da5d86577b06ab29b591f89fef5dcb8014e25af3090420979120269fd436`

## Summary

- Files audited: **212**
- Routes detected: **23**
- Entry roots: **32**
- Reachable files: **162**
- Unreachable files: **50**
- References scanned: **305**
- Resolved local references: **198**
- Unresolved references: **11**
- External packages observed: **5**
- Decode failures: **0**

## Reference Classifications

| Classification | Count |
|---|---:|
| `PUBLIC_ASSET` | 120 |
| `EXTERNAL_PACKAGE` | 63 |
| `LOCAL_MODULE` | 63 |
| `ROUTE` | 18 |
| `CONTENT_PATH` | 15 |
| `DYNAMIC_ROUTE` | 11 |
| `UNRESOLVED_CONTENT_PATH` | 5 |
| `EXTERNAL_URI` | 4 |
| `UNRESOLVED_LOCAL_MODULE` | 3 |
| `UNRESOLVED_PUBLIC_ASSET` | 3 |

## Candidate Groups

These are review candidates only. This audit does not authorize deletion.

### ORPHAN_CODE_CANDIDATE

| File | Category | Bytes | Incoming | Outgoing |
|---|---|---:|---:|---:|
| `content/projects/vault/forge/page.tsx` | CONTENT_CODE | 2383 | 0 | 1 |
| `content/projects/vault/nc-foundation/page.tsx` | CONTENT_CODE | 0 | 0 | 0 |
| `mdx-components.tsx` | SOURCE_CODE | 800 | 0 | 0 |
| `mdx.d.ts` | SOURCE_CODE | 25 | 0 | 0 |
| `postcss.config.cjs` | SOURCE_CODE | 63 | 0 | 0 |
| `prettier.config.js` | SOURCE_CODE | 309 | 0 | 0 |

### ORPHAN_CONTENT_SUPPORT_CANDIDATE

| File | Category | Bytes | Incoming | Outgoing |
|---|---|---:|---:|---:|
| `content/architecture/manifest.ts` | CONTENT_SUPPORT | 1126 | 0 | 11 |
| `content/projects/manifest.ts` | CONTENT_SUPPORT | 318 | 0 | 1 |
| `content/projects/vault/meta.ts` | CONTENT_SUPPORT | 1685 | 1 | 10 |

### UNREFERENCED_FILE_REVIEW

| File | Category | Bytes | Incoming | Outgoing |
|---|---|---:|---:|---:|
| `.env.local` | TEXT_OTHER | 59 | 0 | 0 |
| `.prettierignore` | BINARY_OTHER | 23 | 0 | 0 |
| `.vscode/extensions.json` | TEXT_OTHER | 489 | 0 | 0 |
| `.vscode/settings.json` | TEXT_OTHER | 146 | 0 | 0 |
| `license.md` | TEXT_OTHER | 1100 | 0 | 0 |
| `readme.md` | TEXT_OTHER | 471 | 0 | 0 |
| `tsconfig.tsbuildinfo` | BINARY_OTHER | 339413 | 0 | 0 |
| `web systems img/Elliott 7 yo.png` | BINARY_OTHER | 3281638 | 0 | 0 |

### UNREFERENCED_PUBLIC_ASSET

| File | Category | Bytes | Incoming | Outgoing |
|---|---|---:|---:|---:|
| `public/projects/vault/nc-foundation/NC - One Pager.pdf` | PUBLIC_ASSET | 70602 | 0 | 0 |
| `public/projects/vault/xbox-forever/Xbox Forever - One Pager.pdf` | PUBLIC_ASSET | 82015 | 0 | 0 |
| `public/thumbnails/discord-server-era-motion.mp4` | PUBLIC_ASSET | 1559185 | 0 | 0 |
| `public/thumbnails/discord-server-era.jpg` | PUBLIC_ASSET | 153258 | 0 | 0 |
| `public/thumbnails/label-tree-motion.mp4` | PUBLIC_ASSET | 1088804 | 0 | 0 |
| `public/thumbnails/label-tree.jpg` | PUBLIC_ASSET | 405553 | 0 | 0 |
| `public/thumbnails/taste-graph-motion.mp4` | PUBLIC_ASSET | 461388 | 0 | 0 |
| `public/thumbnails/taste-graph.jpg` | PUBLIC_ASSET | 167450 | 0 | 0 |
| `public/visuals/cacheable-routes-client-cache.png` | PUBLIC_ASSET | 78891 | 0 | 0 |
| `public/visuals/cacheable-routes-prerendering.png` | PUBLIC_ASSET | 135310 | 0 | 0 |
| `public/visuals/cacheable-routes-server-cache.png` | PUBLIC_ASSET | 106414 | 0 | 0 |

### UNREGISTERED_PUBLIC_CONTENT

| File | Category | Bytes | Incoming | Outgoing |
|---|---|---:|---:|---:|
| `content/architecture/advertising-mode-problem-architecture.mdx` | CONTENT_DOCUMENT | 14418 | 1 | 0 |
| `content/architecture/aesthetic-identity.mdx` | CONTENT_DOCUMENT | 12106 | 1 | 0 |
| `content/architecture/catalog-architecture.mdx` | CONTENT_DOCUMENT | 5197 | 1 | 0 |
| `content/architecture/cultural-infrastructure-architecture.mdx` | CONTENT_DOCUMENT | 4984 | 1 | 0 |
| `content/architecture/discord-server-era.mdx` | CONTENT_DOCUMENT | 12155 | 0 | 0 |
| `content/architecture/genre-taxonomy-architecture.mdx` | CONTENT_DOCUMENT | 5002 | 1 | 0 |
| `content/architecture/ip-expansion-architecture.mdx` | CONTENT_DOCUMENT | 14121 | 1 | 0 |
| `content/architecture/post-launch-architecture.mdx` | CONTENT_DOCUMENT | 15153 | 1 | 0 |
| `content/architecture/publisher-identity-architecture.mdx` | CONTENT_DOCUMENT | 12642 | 1 | 0 |
| `content/architecture/release-cadence-architecture.mdx` | CONTENT_DOCUMENT | 10459 | 1 | 0 |
| `content/architecture/studio-identity-architecture.mdx` | CONTENT_DOCUMENT | 4665 | 1 | 0 |
| `content/architecture/taste-graph-problem-architecture.mdx` | CONTENT_DOCUMENT | 5252 | 1 | 0 |
| `content/essays/forge-economics.mdx` | CONTENT_DOCUMENT | 44101 | 0 | 0 |
| `content/essays/return-of-the-destination.mdx` | CONTENT_DOCUMENT | 21141 | 0 | 0 |
| `content/essays/the-monetary-value-of-being-the-board.mdx` | CONTENT_DOCUMENT | 32114 | 0 | 0 |
| `content/essays/the-trust-layer.mdx` | CONTENT_DOCUMENT | 24099 | 0 | 0 |
| `content/essays/you-dont-need-to-own-the-stack.mdx` | CONTENT_DOCUMENT | 32278 | 0 | 0 |

### UNREGISTERED_VAULT_DOCUMENT

| File | Category | Bytes | Incoming | Outgoing |
|---|---|---:|---:|---:|
| `content/projects/vault/xbox-dashboard-launcher-kit/documents/dashboard_launcher_kit_one_pager.mdx` | CONTENT_DOCUMENT | 3066 | 0 | 0 |
| `content/projects/vault/xbox-forever/documents/xbox_forever_life_inside_a_persistent_platform.mdx` | CONTENT_DOCUMENT | 8193 | 0 | 0 |
| `content/projects/vault/xbox-forever/documents/xbox_forever_one_pager.mdx` | CONTENT_DOCUMENT | 2774 | 0 | 0 |
| `content/projects/vault/xbox-forever/documents/xbox_forever_structural_inversion_and_the_cultural_gap.mdx` | CONTENT_DOCUMENT | 7959 | 0 | 0 |
| `content/projects/vault/xbox-forever/documents/xbox_forever_why_persistence_Is_the_missing_layer.mdx` | CONTENT_DOCUMENT | 9416 | 0 | 0 |

## Unresolved Local References

| Source | Kind | Reference | Classification |
|---|---|---|---|
| `content/projects/manifest.ts` | DYNAMIC_IMPORT | `./vault/nc-foundation.mdx` | UNRESOLVED_LOCAL_MODULE |
| `content/projects/manifest.ts` | DYNAMIC_IMPORT | `./vault/forge.mdx` | UNRESOLVED_LOCAL_MODULE |
| `content/projects/manifest.ts` | DYNAMIC_IMPORT | `./vault/xbox-forever.mdx` | UNRESOLVED_LOCAL_MODULE |
| `content/projects/vault/forge/meta.ts` | PATH_LITERAL | `/thumbnails/vault/forge/architecture.jpg` | UNRESOLVED_PUBLIC_ASSET |
| `content/projects/vault/forge/meta.ts` | PATH_LITERAL | `/thumbnails/vault/forge/one-pager.jpg` | UNRESOLVED_PUBLIC_ASSET |
| `content/projects/vault/forge/meta.ts` | PATH_LITERAL | `/thumbnails/vault/forge/executive-summary.jpg` | UNRESOLVED_PUBLIC_ASSET |
| `content/projects/vault/xbox-dashboard-launcher-kit/meta.ts` | PATH_LITERAL | `/content/projects/vault/xbox-dashboard-launcher-kit/dashboard_launcher_kit_one_pager.mdx` | UNRESOLVED_CONTENT_PATH |
| `content/projects/vault/xbox-forever/meta.ts` | PATH_LITERAL | `/content/projects/vault/xbox-forever/xbox_forever_one_pager.mdx` | UNRESOLVED_CONTENT_PATH |
| `content/projects/vault/xbox-forever/meta.ts` | PATH_LITERAL | `/content/projects/vault/xbox-forever/xbox_forever_why_persistence_Is_the_missing_layer.mdx` | UNRESOLVED_CONTENT_PATH |
| `content/projects/vault/xbox-forever/meta.ts` | PATH_LITERAL | `/content/projects/vault/xbox-forever/xbox_forever_life_inside_a_persistent_platform.mdx` | UNRESOLVED_CONTENT_PATH |
| `content/projects/vault/xbox-forever/meta.ts` | PATH_LITERAL | `/content/projects/vault/xbox-forever/xbox_forever_structural_inversion_and_the_cultural_gap.mdx` | UNRESOLVED_CONTENT_PATH |

## Route References

| Source | Reference | Status |
|---|---|---|
| `app/architecture/page.tsx` | `/architecture/${item.slug}` | DYNAMIC_ROUTE |
| `app/essays/page.tsx` | `/essays/${essay.slug}` | DYNAMIC_ROUTE |
| `app/NavBar.tsx` | `/` | ROUTE |
| `app/NavBar.tsx` | `/essays` | ROUTE |
| `app/NavBar.tsx` | `/architecture` | ROUTE |
| `app/NavBar.tsx` | `/projects/vault` | ROUTE |
| `app/NavBar.tsx` | `/about` | ROUTE |
| `app/page.tsx` | `/essays` | ROUTE |
| `app/page.tsx` | `/architecture` | ROUTE |
| `app/page.tsx` | `/projects/vault` | ROUTE |
| `app/page.tsx` | `/about` | ROUTE |
| `app/page.tsx` | `/essays/${selection.slug}` | DYNAMIC_ROUTE |
| `app/page.tsx` | `/architecture/${selection.slug}` | DYNAMIC_ROUTE |
| `app/projects/vault/forge/index/page.tsx` | `/projects/vault/forge/${doc.slug}` | DYNAMIC_ROUTE |
| `app/projects/vault/index/page.tsx` | `/projects/vault/xbox-forever` | ROUTE |
| `app/projects/vault/index/page.tsx` | `/projects/vault/xbox-forever-ads` | ROUTE |
| `app/projects/vault/index/page.tsx` | `/projects/vault/xbox-dashboard-launcher-kit` | ROUTE |
| `app/projects/vault/index/page.tsx` | `/projects/vault/forge` | ROUTE |
| `app/projects/vault/index/page.tsx` | `/projects/vault/nc-foundation` | ROUTE |
| `app/projects/vault/page.tsx` | `/projects/vault/index` | ROUTE |
| `app/projects/vault/xbox-dashboard-launcher-kit/index/page.tsx` | `/projects/vault/xbox-dashboard-launcher-kit/${doc.slug}` | DYNAMIC_ROUTE |
| `app/projects/vault/xbox-forever-ads/index/page.tsx` | `/projects/vault/xbox-forever-ads/${doc.slug}` | DYNAMIC_ROUTE |
| `app/projects/vault/xbox-forever/index/page.tsx` | `/projects/vault/xbox-forever/${doc.slug}` | DYNAMIC_ROUTE |
| `components/DocumentFooter.tsx` | `/about` | ROUTE |
| `content/projects/vault/forge/page.tsx` | `/projects/vault/forge/${doc.slug}` | DYNAMIC_ROUTE |
| `content/projects/vault/nc-foundation/meta.ts` | `/projects/vault/nc-foundation/NC Foundation — One-Pager.pdf` | ROUTE |
| `content/projects/vault/xbox-forever/meta.ts` | `/projects/vault/xbox-forever/Xbox Forever — One Pager.pdf` | ROUTE |
| `content/related-work.ts` | `/essays/${item.slug}` | DYNAMIC_ROUTE |
| `content/related-work.ts` | `/architecture/${item.slug}` | DYNAMIC_ROUTE |

## External Packages

### Observed Imports

| Package | Import References |
|---|---:|
| `next` | 54 |
| `react` | 6 |
| `@next/mdx` | 1 |
| `mdx` | 1 |
| `tailwindcss` | 1 |

### Imported But Not Declared

- `mdx`

### Declared But Not Observed In Imports

_Informational only. This is not evidence that a package is safe to remove._

- `@heroicons/react`
- `@mdx-js/loader`
- `@mdx-js/react`
- `@tailwindcss/forms`
- `@tailwindcss/postcss`
- `@tailwindcss/typography`
- `@types/mdx`
- `@types/ms`
- `@types/node`
- `@types/react`
- `@types/react-dom`
- `clsx`
- `codehike`
- `date-fns`
- `dinero.js`
- `ms`
- `postcss`
- `prettier`
- `prettier-plugin-tailwindcss`
- `react-dom`
- `recma-codehike`
- `remark-codehike`
- `server-only`
- `styled-components`
- `typescript`
- `use-count-up`
- `zod`

## Entry Roots

- `.gitignore`
- `.npmrc`
- `app/about/page.tsx`
- `app/architecture/[slug]/page.tsx`
- `app/architecture/page.tsx`
- `app/essays/[slug]/page.tsx`
- `app/essays/page.tsx`
- `app/icon.png`
- `app/layout.tsx`
- `app/page.tsx`
- `app/projects/vault/forge/[slug]/page.tsx`
- `app/projects/vault/forge/index/page.tsx`
- `app/projects/vault/forge/page.tsx`
- `app/projects/vault/index/page.tsx`
- `app/projects/vault/nc-foundation/[slug]/page.tsx`
- `app/projects/vault/nc-foundation/index/page.tsx`
- `app/projects/vault/nc-foundation/page.tsx`
- `app/projects/vault/page.tsx`
- `app/projects/vault/xbox-dashboard-launcher-kit/[slug]/page.tsx`
- `app/projects/vault/xbox-dashboard-launcher-kit/index/page.tsx`
- `app/projects/vault/xbox-dashboard-launcher-kit/page.tsx`
- `app/projects/vault/xbox-forever-ads/[slug]/page.tsx`
- `app/projects/vault/xbox-forever-ads/index/page.tsx`
- `app/projects/vault/xbox-forever-ads/page.tsx`
- `app/projects/vault/xbox-forever/[slug]/page.tsx`
- `app/projects/vault/xbox-forever/index/page.tsx`
- `app/projects/vault/xbox-forever/page.tsx`
- `next-env.d.ts`
- `next.config.ts`
- `package-lock.json`
- `package.json`
- `tsconfig.json`

