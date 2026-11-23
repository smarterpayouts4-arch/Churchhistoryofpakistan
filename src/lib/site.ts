/** Defaults. The public header, footer, and page title read homepage CMS `site_title` and `strapline`. */
export const SITE_NAME = "History: Church of Pakistan";
export const SITE_DESCRIPTION =
  "Photographs, documents, interviews and family memories preserving the history and people of the Church of Pakistan for future generations.";
/** Public address used when nothing else is configured (also the share-preview fallback). */
export const DEFAULT_SITE_URL = "https://churchhistoryofpakistan.vercel.app";

export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  // A localhost value copied from .env.local must never leak into a deployed
  // site's links or share previews.
  const isLocal = configured ? /\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(configured) : false;
  if (configured && !(isLocal && process.env.VERCEL)) return configured;
  // On Vercel, use the automatic production domain so sitemap/RSS/canonical
  // URLs are correct even before NEXT_PUBLIC_SITE_URL is set.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return DEFAULT_SITE_URL;
}

/** Absolute URL for a site path, e.g. absoluteUrl("/media/og/og-default.png"). */
export function absoluteUrl(path: string): string {
  return `${siteUrl().replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
