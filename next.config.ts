import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** This app's folder. Do not let Turbopack walk up to the user home directory. */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/**
 * CSP tradeoffs (see docs/SECURITY_HARDENING_2026-09-23.md):
 * - script-src includes 'unsafe-inline' because Next.js App Router injects
 *   inline bootstrap scripts; a nonce-based CSP would need middleware.
 * - Development also includes 'unsafe-eval'. React uses eval() only while
 *   `next dev` is running, to reconstruct server call stacks in the browser.
 *   Production must not allow it.
 * - style-src includes 'unsafe-inline' for CSS modules / style attributes.
 * - next/font self-hosts Google fonts at build time → no fonts.googleapis.com.
 * - img/media allow data: and blob: for admin crop/upload previews.
 */
const isDev = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'self' blob: https://*.public.blob.vercel-storage.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
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
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    formats: ["image/webp", "image/avif"],
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
