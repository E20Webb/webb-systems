export const essays = {
  "gears-of-war-second-business-model": () =>
    import("./gears-of-war-second-business-model.mdx"),

  "friendslop-market-signal": () =>
    import("./friendslop-market-signal.mdx"),

  "the-game-isnt-the-session": () =>
    import("./the-game-isnt-the-session.mdx"),

  "xbox-can-evolve-home-without-rebuilding-it": () =>
    import("./xbox-can-evolve-home-without-rebuilding-it.mdx"),


  "future-isnt-lost-its-underbuilt": () =>
    import("./future-isnt-lost-its-underbuilt.mdx"),

   "steam-is-not-a-store": () =>
    import("./steam-is-not-a-store.mdx"),

  "gaming-culture": () =>
    import("./gaming-culture.mdx"),

  "gaming-profits": () =>
    import("./gaming-profits.mdx"),

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