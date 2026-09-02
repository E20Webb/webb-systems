import createMDX from '@next/mdx';
import { type CodeHikeConfig } from 'codehike/mdx';

const codeHikeConfig: CodeHikeConfig = {
  components: {
    code: 'MyCode',
    inlineCode: 'MyInlineCode',
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/, // ⭐ REQUIRED
  options: {
    remarkPlugins: [['remark-codehike', codeHikeConfig] as any],
    recmaPlugins: [['recma-codehike', codeHikeConfig] as any],
  },
});

const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'], // ⭐ MDX included
  experimental: {
    inlineCss: true,
    cachedNavigations: true,
    viewTransition: true,
  },
};

export default withMDX(nextConfig);
