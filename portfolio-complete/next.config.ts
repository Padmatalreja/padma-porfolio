import type { NextConfig } from "next";
import path from "path";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js requires 'unsafe-inline' for its runtime style injection.
      // 'unsafe-eval' is required by some Next.js internals in development;
      // it is kept here for compatibility but should be removed once a nonce-
      // based CSP is implemented in a future hardening pass.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      // img-src: self + data URIs + blob + Cloudinary CDN + res.cloudinary.com
      // Add your specific CDN hostname(s) here instead of the wildcard https:.
      "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com",
      "connect-src 'self' https: wss:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
  { key: "X-Content-Type-Options",     value: "nosniff" },
  { key: "X-Frame-Options",            value: "DENY" },
  { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",         value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security",  value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Restrict to specific trusted hostnames instead of the wildcard "**".
    // Add additional hostnames here as needed (e.g. your Cloudinary cloud name).
    remotePatterns: [
      // Cloudinary CDN
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Unsplash (common placeholder source)
      { protocol: "https", hostname: "images.unsplash.com" },
      // Allow locally-served uploads (handled by Next.js static file serving)
      // These start with /uploads/ and don't need a remotePattern.
    ],
    minimumCacheTTL: 86400,
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      // Long-lived caching for locally uploaded static files.
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Security headers on everything else
      { source: "/(.*)", headers: securityHeaders },
    ];
  },
};

export default nextConfig;
