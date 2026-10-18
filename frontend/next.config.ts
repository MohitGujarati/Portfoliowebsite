import type { NextConfig } from 'next';

// Vercel runs the full Next.js server, which keeps the /api routes. GitHub Pages only serves static
// files, so its workflow sets GITHUB_PAGES=true for a static export and passes the /<repo> prefix the
// project site is served from.
const staticExport = process.env.GITHUB_PAGES === 'true';
const basePath = process.env.PAGES_BASE_PATH ?? '';

/** Defensive headers for every response. A static host cannot send these, so they apply on Vercel. */
const securityHeaders = [
  // No framing (clickjacking), no plugins, and no <base> or form hijacking. Scripts are left to the page.
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'",
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  // HSTS is already sent by Vercel for its domains.
];

const nextConfig: NextConfig = {
  output: staticExport ? 'export' : undefined,
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC_EXPORT: staticExport ? 'true' : '',
  },
  ...(staticExport ? {} : { headers: async () => [{ source: '/:path*', headers: securityHeaders }] }),
};

export default nextConfig;
