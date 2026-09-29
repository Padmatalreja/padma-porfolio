import type { NextConfig } from "next";
import path from "path";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
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
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
    // Cache optimized images for 1 day (86400s).
    // Profile picture updates will still reflect within 1 day,
    // or immediately when uploaded via /api/upload (which uses unoptimized=true).
    minimumCacheTTL: 86400,
    // Allow WebP/AVIF output for automatic format negotiation
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      // Long-lived caching for locally uploaded static files (images, PDFs).
      // 1 year immutable — safe because upload filenames include a unique hex suffix.
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
