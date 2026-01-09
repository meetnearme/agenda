import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Pass CONTENT_DIR env var to the build for config-driven content directories
  env: {
    CONTENT_DIR: process.env.CONTENT_DIR || 'content',
  },

  // Static export only for production builds (Netlify)
  // Development mode needs dynamic routing for admin rewrites
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,

  // Required for static export - images need to be unoptimized
  images: {
    unoptimized: true,
  },

  // Trailing slash for cleaner URLs in static hosting
  trailingSlash: true,

  // CSP headers for development (allows external embeds like Meet Near Me)
  // In production, Netlify uses public/_headers
  async headers() {
    return [
      {
        source: '/((?!admin).*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http://localhost:* http://*.localhost:* https://*.devnear.me https://*.meetnear.me",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https: http://localhost:* http://*.localhost:* https://*.devnear.me https://*.meetnear.me",
              "font-src 'self' https://fonts.gstatic.com https: http://localhost:* http://*.localhost:* https://*.devnear.me https://*.meetnear.me",
              "img-src 'self' data: https: http: http://localhost:* http://*.localhost:* https://*.devnear.me https://*.meetnear.me",
              "connect-src 'self' https: http://localhost:* http://*.localhost:* https://*.devnear.me https://*.meetnear.me",
              "frame-src 'self' https: http://localhost:* http://*.localhost:* https://*.devnear.me https://*.meetnear.me",
              "media-src 'self' https: http://localhost:* http://*.localhost:* https://*.devnear.me https://*.meetnear.me",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https:",
              "frame-ancestors 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },

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
