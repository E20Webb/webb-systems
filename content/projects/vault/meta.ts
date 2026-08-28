export type VaultMeta = {
  slug: string;
  title: string;
  abstract: string;
  category: string;
  thumbnail: string;
  thumbnailMotion: string;
};

export const vaultMeta: VaultMeta[] = [
  {
    slug: "nc-foundation",
    title: "NC Foundation",
    abstract: "The foundational layer of the Neural Computer.",
    category: "Architecture",
    thumbnail: "/thumbnails/nc-foundation.jpg",
    thumbnailMotion: "/thumbnails/nc-foundation-motion.mp4"
  },
  {
    slug: "forge",
    title: "Forge",
    abstract: "A platform-level model for the future of game creation.",
    category: "Architecture",
    thumbnail: "/thumbnails/forge.jpg",
    thumbnailMotion: "/thumbnails/forge-motion.mp4"
  },
  {
    slug: "xbox-forever",
    title: "Xbox Forever",
    abstract: "A unified vision for the next era of Xbox.",
    category: "Architecture",
    thumbnail: "/thumbnails/xbox-forever.jpg",
    thumbnailMotion: "/thumbnails/xbox-forever-motion.mp4"
  }
];
