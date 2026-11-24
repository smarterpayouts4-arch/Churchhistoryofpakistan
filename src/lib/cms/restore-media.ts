import { getMediaIndex } from "@/lib/media/library";
import { isVideoUrl } from "@/lib/media/rules";

/**
 * History restore safety: publishing deletes uploads the website no longer
 * uses, but older versions in History still point at them. Restoring such a
 * version as-is would put broken photos on the website.
 *
 * Uploaded files live on Vercel Blob and are listed in the media index
 * (media.json) for as long as they exist; deleting one removes it from the
 * index. So an upload URL that is not in the index has been deleted.
 *
 * For the photo & video lists, items whose file was deleted are left out of
 * the restore (the rest is restored). Anywhere else a deleted file is still
 * referenced, the version can't be restored safely and is refused.
 */

const BLOB_URL_RE = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i;

/** The photo/video list in each document that can safely lose items. */
const MEDIA_LISTS: Record<string, (doc: Record<string, unknown>) => { get: () => unknown; set: (v: unknown[]) => void } | null> = {
  "homepage.json": (d) => {
    const hero = d.hero as Record<string, unknown> | undefined;
    return hero ? { get: () => hero.band_images, set: (v) => (hero.band_images = v) } : null;
  },
  "family-archives.json": (d) => ({ get: () => d.items, set: (v) => (d.items = v) }),
  "people-frames.json": (d) => ({ get: () => d.frames, set: (v) => (d.frames = v) }),
  "featured-interviews.json": (d) => ({ get: () => d.items, set: (v) => (d.items = v) }),
};

export type DeletedMediaReport<T> = {
  /** The version with deleted photos/videos left out. */
  data: T;
  /** Items left out because their file was deleted. */
  droppedPhotos: number;
  droppedVideos: number;
  /** Deleted files still referenced outside a photo/video list (restore must be refused). */
  unresolved: number;
};

function deletedRefs(value: unknown, known: Set<string>, out: string[] = []): string[] {
  if (typeof value === "string") {
    if (BLOB_URL_RE.test(value) && !known.has(value)) out.push(value);
  } else if (Array.isArray(value)) {
    for (const v of value) deletedRefs(v, known, out);
  } else if (value && typeof value === "object") {
    for (const v of Object.values(value)) deletedRefs(v, known, out);
  }
  return out;
}

export async function withoutDeletedMedia<T>(doc: string, version: T): Promise<DeletedMediaReport<T>> {
  const known = new Set((await getMediaIndex()).map((m) => m.url));
  const data = structuredClone(version);
  let droppedPhotos = 0;
  let droppedVideos = 0;
  const list = data && typeof data === "object" ? MEDIA_LISTS[doc]?.(data as Record<string, unknown>) : null;
  const items = list?.get();
  if (list && Array.isArray(items)) {
    const kept = items.filter((item) => {
      const gone = deletedRefs(item, known);
      if (!gone.length) return true;
      if (gone.some((u) => isVideoUrl(u))) droppedVideos++;
      else droppedPhotos++;
      return false;
    });
    if (kept.length !== items.length) list.set(kept);
  }
  return { data, droppedPhotos, droppedVideos, unresolved: deletedRefs(data, known).length };
}

/** "2 photos and 1 video in this version were already deleted and can't be brought back." */
export function deletedMediaMessage(photos: number, videos: number): string | null {
  const parts = [
    photos ? `${photos} ${photos === 1 ? "photo" : "photos"}` : "",
    videos ? `${videos} ${videos === 1 ? "video" : "videos"}` : "",
  ].filter(Boolean);
  if (!parts.length) return null;
  const one = photos + videos === 1;
  return `${parts.join(" and ")} in this version ${one ? "was" : "were"} already deleted and can't be brought back.`;
}
