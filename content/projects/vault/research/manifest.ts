export const research = {
  "the-monetary-value-of-being-the-board": () =>
    import("./documents/the-monetary-value-of-being-the-board.mdx"),

  "you-dont-need-to-own-the-stack": () =>
    import("./documents/you-dont-need-to-own-the-stack.mdx"),

  "return-of-the-destination": () =>
    import("./documents/return-of-the-destination.mdx"),

  "the-trust-layer": () =>
    import("./documents/the-trust-layer.mdx"),

  "forge-economics": () =>
    import("./documents/forge-economics.mdx"),

  "discord-server-era": () =>
    import("./documents/discord-server-era.mdx"),
} as const;

export type ResearchSlug = keyof typeof research;