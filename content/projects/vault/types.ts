export type VaultDocument = {
  slug: string;
  title: string;
  abstract: string;
  category: string;
  thumbnail?: string;
  mdx: string;
  pdf?: string | null;
  ndaNote?: string;
  description?: string; 
};
