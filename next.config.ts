import type { NextConfig } from 'next';

// GitHub Pages serves a user site (MohitGujarati.github.io) from the domain root,
// and a project site from /<repo>. The deploy workflow passes the right prefix in.
const basePath = process.env.PAGES_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
