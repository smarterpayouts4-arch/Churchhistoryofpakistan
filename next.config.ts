import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** This app's folder. Do not let Turbopack walk up to the user home directory. */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/**
 * Content-Security-Policy is set per request with a nonce in src/proxy.ts
 * (strict-dynamic, no 'unsafe-inline' scripts). Static headers live here.
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "X-DNS-Prefetch-Control",
    value: "off",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: projectRoot,
  },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  poweredByHeader: false,
  experimental: {
    // Contribute form: up to 4 photos (resized in the browser) + text.
    serverActions: { bodySizeLimit: "12mb" },
  },
  images: {
    // AVIF first (smallest at equal quality), WebP fallback.
    formats: ["image/avif", "image/webp"],
    // Allowed quality values: 80 for photos (MediaImage default), 75 for admin thumbnails.
    qualities: [75, 80],
    // Optimised variants are content-hashed by URL; keep them for 31 days.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Archival media files are stable, content-named assets. A week of
        // browser/CDN caching (with background revalidation) removes repeat
        // download cost without risking permanently stale imagery.
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
