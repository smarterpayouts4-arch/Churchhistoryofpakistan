/**
 * Family Archive holdings — loaded from data/cms/family-archives.json.
 * Captions are transcribed from the Facebook page (and author comments where noted).
 * Claims may need independent cross-check before elevation to Published Source.
 */

import { readCmsPublic } from "@/lib/cms/store";
import { uniqueByPhoto, withoutPhotos } from "@/lib/media/dedupe";
import type { FamilyArchiveItem, FamilyArchivesFile } from "@/lib/cms/types";

export type { FamilyArchiveItem, FamilyArchiveReference, VerificationStatus } from "@/lib/cms/types";

async function loadFamilyArchivesFile(): Promise<FamilyArchivesFile> {
  return (await readCmsPublic("family-archives.json")) as FamilyArchivesFile;
}

export async function loadFamilyArchiveNote(): Promise<string> {
  const data = await loadFamilyArchivesFile();
  return data.note;
}

/** Public gallery items; the same photo posted twice is shown once (first wins). */
export async function loadFamilyArchiveItems(): Promise<FamilyArchiveItem[]> {
  const data = await loadFamilyArchivesFile();
  return uniqueByPhoto(data.items, (item) => item.imageSrc);
}

/**
 * Homepage preview: the first `count` gallery photos that are not already in
 * the homepage slideshow (`exclude`), so the two never show the same picture.
 */
export async function loadFamilyArchiveHomePreview(
  count = 4,
  exclude: Iterable<string | undefined> = [],
): Promise<FamilyArchiveItem[]> {
  const items = await loadFamilyArchiveItems();
  return withoutPhotos(items, (item) => item.imageSrc, exclude).slice(0, count);
}

/** @deprecated Prefer loadFamilyArchiveNote() for runtime CMS data. */
export const FAMILY_ARCHIVE_NOTE =
  "Captions are transcribed from the Facebook page History: Church of Pakistan. Names, dates, and offices below follow those captions (or visible image headings / author comments where noted) and may need independent cross-check.";
