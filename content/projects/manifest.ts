import { vaultMeta } from "@/content/projects/vault/meta";

export const projects = {
  "nc-foundation": () => import("./vault/nc-foundation.mdx"),
  "forge": () => import("./vault/forge.mdx"),
  "xbox-forever": () => import("./vault/xbox-forever.mdx"),
};

export type ProjectSlug = keyof typeof projects;

