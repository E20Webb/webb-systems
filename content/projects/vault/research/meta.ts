export type ResearchMeta = {
  slug: string;
  title: string;
  abstract: string;
  category: string;
  mdx: string;
};

export const researchMeta: ResearchMeta[] = [
  {
    slug: "the-monetary-value-of-being-the-board",
    title: "The Monetary Value of Being the Board",
    abstract:
      "Why the shared environment may be the most valuable position in an entertainment ecosystem.",
    category: "Platform Economics",
    mdx: "/content/projects/vault/research/documents/the-monetary-value-of-being-the-board.mdx",
  },

  {
    slug: "you-dont-need-to-own-the-stack",
    title: "You Do Not Need to Own the Stack",
    abstract:
      "Why platform value can come from enabling independent participants rather than vertically integrating them.",
    category: "Platform Strategy",
    mdx: "/content/projects/vault/research/documents/you-dont-need-to-own-the-stack.mdx",
  },

  {
    slug: "return-of-the-destination",
    title: "The Return of the Destination",
    abstract:
      "How digital platforms can recreate the value of a shared destination without owning everything inside it.",
    category: "Culture & Infrastructure",
    mdx: "/content/projects/vault/research/documents/return-of-the-destination.mdx",
  },

  {
    slug: "the-trust-layer",
    title: "The Trust Layer",
    abstract:
      "Why shared digital systems need trust, accountability, and governance as infrastructure rather than afterthoughts.",
    category: "Trust & Governance",
    mdx: "/content/projects/vault/research/documents/the-trust-layer.mdx",
  },

  {
    slug: "forge-economics",
    title: "Forge Economics",
    abstract:
      "The economics of reducing iteration cost, production friction, schedule risk, and repeated systemic work in game development.",
    category: "Production Economics",
    mdx: "/content/projects/vault/research/documents/forge-economics.mdx",
  },

  {
    slug: "discord-server-era",
    title: "The Discord Server Era",
    abstract:
      "How gaming communities moved outside the platforms that created them, and what that fragmentation reveals about digital gathering places.",
    category: "Culture & Infrastructure",
    mdx: "/content/projects/vault/research/documents/discord-server-era.mdx",
  },
];