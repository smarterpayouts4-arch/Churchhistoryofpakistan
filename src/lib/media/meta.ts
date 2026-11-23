import { cache } from "react";
import staticMeta from "./media-meta.json";
import { getMediaIndex } from "./library";
import type { ImageFit } from "@/lib/cms/types";

/**
 * Pixel size + blur placeholder for every image the site shows.
 * Bundled media: src/lib/media/media-meta.json (npm run media:normalize).
 * Admin uploads: width/height/blur recorded in the media index at upload.
 */
export type MediaMeta = { w?: number; h?: number; blur?: string; poster?: string };

const STATIC = staticMeta as Record<string, MediaMeta>;

export const loadMediaMeta = cache(async (): Promise<Map<string, MediaMeta>> => {
  const map = new Map<string, MediaMeta>(Object.entries(STATIC));
  try {
    for (const item of await getMediaIndex()) {
      map.set(item.url, {
        w: item.width,
        h: item.height,
        blur: item.blurDataURL,
        poster: item.posterUrl,
      });
    }
  } catch {
    /* media index unavailable: static metadata still applies */
  }
  return map;
});

export async function mediaMeta(url: string | undefined): Promise<MediaMeta> {
  if (!url) return {};
  return (await loadMediaMeta()).get(url) ?? {};
}

/**
 * How a photo fills a fixed-ratio gallery tile. An explicit choice from the
 * admin wins; otherwise crop (cover) unless that would cut away more than
 * ~30% of the picture (panoramas, very tall scans), in which case show it
 * whole (contain) over a blurred copy of itself so the tile still looks full.
 */
export function tileFit(meta: MediaMeta, tileRatio: number, explicit?: ImageFit): ImageFit {
  if (explicit) return explicit;
  if (!meta.w || !meta.h) return "cover";
  const r = meta.w / meta.h;
  const kept = Math.min(r, tileRatio) / Math.max(r, tileRatio);
  return kept < 0.7 ? "contain" : "cover";
}
