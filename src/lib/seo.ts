import type { Metadata } from "next";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

/**
 * Share previews (WhatsApp, iMessage, Facebook, X, Slack…).
 * Static 1200x630 PNGs in public/media/og/ (each under 200 KB), designed with
 * the title and brand mark inside the centre square so the square / small
 * thumbnail crops used by messaging apps stay legible.
 * Regenerate with the brand tool described in docs/ARCHITECTURE.md.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const;

export type ShareImageKey =
  | "default"
  | "about"
  | "archive"
  | "videos"
  | "churches"
  | "people"
  | "share-your-story"
  | "sources"
  | "blog";

const ALT: Record<ShareImageKey, string> = {
  default: "History: Church of Pakistan — a living archive of faith and memory. Gold Church of Pakistan emblem on parchment.",
  about: "About the Project — History: Church of Pakistan",
  archive: "The Family Archive — History: Church of Pakistan",
  videos: "Videos — History: Church of Pakistan",
  churches: "Churches — History: Church of Pakistan",
  people: "People — History: Church of Pakistan",
  "share-your-story": "Share Your Story — History: Church of Pakistan",
  sources: "Sources — History: Church of Pakistan",
  blog: "Blog — History: Church of Pakistan",
};

export function shareImage(key: ShareImageKey = "default") {
  return {
    url: absoluteUrl(`/media/og/og-${key}.png`),
    width: OG_SIZE.width,
    height: OG_SIZE.height,
    alt: ALT[key],
    type: "image/png",
  };
}

/**
 * Open Graph + Twitter metadata for a page. Next.js replaces (not merges) the
 * layout's openGraph object, so each page gets the full set.
 */
export function socialMetadata({
  title,
  description,
  path,
  image = "default",
  type = "website",
}: {
  title?: string;
  description: string;
  path: string;
  image?: ShareImageKey | { url: string; alt: string; width?: number; height?: number };
  type?: "website" | "article";
}): Pick<Metadata, "openGraph" | "twitter"> {
  const img = typeof image === "string" ? shareImage(image) : { ...image, url: image.url.startsWith("http") ? image.url : absoluteUrl(image.url) };
  const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  return {
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      type,
      locale: "en",
      images: [img],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [{ url: img.url, alt: img.alt }],
    },
  };
}
