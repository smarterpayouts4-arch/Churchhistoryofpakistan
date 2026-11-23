import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy (Next 16's replacement for middleware) — runs before every page:
 * 1. Per-request nonce Content-Security-Policy (strict-dynamic). Next.js
 *    reads the nonce from the request CSP header and applies it to its own
 *    scripts; our JSON-LD script reads it via headers().
 * 2. Issues the readable CSRF token cookie on /admin pages (double-submit).
 * API routes, static files and images are excluded by the matcher.
 */
const CSRF_COOKIE = "hcop_csrf";

function buildCsp(nonce: string) {
  const isDev = process.env.NODE_ENV === "development";
  const blob = "https://*.public.blob.vercel-storage.com";
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // React style={{}} attributes and CSS modules need inline styles.
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${blob}`,
    "font-src 'self' data:",
    `connect-src 'self' https://vercel.com/api/blob https://*.blob.vercel-storage.com${isDev ? " ws: wss:" : ""}`,
    `media-src 'self' blob: ${blob}`,
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);

  if (request.nextUrl.pathname.startsWith("/admin") && !request.cookies.get(CSRF_COOKIE)) {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    const token = Buffer.from(bytes).toString("base64url");
    response.cookies.set(CSRF_COOKIE, token, {
      httpOnly: false,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|media|favicon|robots.txt|sitemap.xml|opengraph-image|icon|apple-icon|apple-touch-icon|manifest.webmanifest).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
