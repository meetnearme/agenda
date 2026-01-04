import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export only for production builds (Netlify)
  // Development mode needs dynamic routing for admin rewrites
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,

  // Required for static export - images need to be unoptimized
  images: {
    unoptimized: true,
  },

  // Trailing slash for cleaner URLs in static hosting
  trailingSlash: true,

  // Rewrite /admin to serve the static DecapCMS HTML file (dev mode only)
  // In production, Netlify handles this via _redirects
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
      },
      {
        source: '/admin/',
        destination: '/admin/index.html',
      },
    ];
  },
};

export default nextConfig;
