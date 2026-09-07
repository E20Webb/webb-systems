export const architecture = {

  "post-launch-architecture": () =>
    import("./post-launch-architecture.mdx"),

  "discord-server-era": () =>
    import("./discord-server-era.mdx"),

  "ip-expansion-architecture": () =>
    import("./ip-expansion-architecture.mdx"),

  "aesthetic-identity": () =>
    import("./aesthetic-identity.mdx"),

  "publisher-identity-architecture": () =>
    import("./publisher-identity-architecture.mdx"),

  "genre-taxonomy-architecture": () =>
    import("./genre-taxonomy-architecture.mdx"),

  "catalog-architecture": () =>
    import("./catalog-architecture.mdx"),

  "taste-graph-problem-architecture": () =>
    import("./taste-graph-problem-architecture.mdx"),

  "studio-identity-architecture": () =>
    import("./studio-identity-architecture.mdx"),

  "cultural-infrastructure-architecture": () =>
    import("./cultural-infrastructure-architecture.mdx"),

  "release-cadence-architecture": () =>
    import("./release-cadence-architecture.mdx"),

};

export type ArchitectureSlug = keyof typeof architecture;