export const essays = {
  "future-isnt-lost-its-underbuilt": () =>
    import("./future-isnt-lost-its-underbuilt.mdx"),

  "genre-bottleneck": () =>
    import("./genre-bottleneck.mdx"),

  "lost-community": () =>
    import("./lost-community.mdx"),

  "unexploited-identity": () =>
    import("./unexploited-identity.mdx"),

  "game-ip-mythos-vs-continuity": () =>
    import("./game-ip-mythos-vs-continuity.mdx"),

  "game-development-starts-at-zero": () =>
    import("./game-development-starts-at-zero.mdx"),

  "death-of-play": () =>
    import("./death-of-play.mdx"),
};

export type EssaySlug = keyof typeof essays;
