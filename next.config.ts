import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  experimental: {
    inlineCss: true,
    cachedNavigations: true,
    viewTransition: true,
  },
};

export default withMDX(nextConfig);