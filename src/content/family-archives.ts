/**
 * Family Archive holdings — loaded from data/cms/family-archives.json.
 * Captions are transcribed from the Facebook page (and author comments where noted).
 * Claims may need independent cross-check before elevation to Published Source.
 */

import { readCmsPublic } from "@/lib/cms/store";
import type { FamilyArchiveItem, FamilyArchivesFile } from "@/lib/cms/types";

export type { FamilyArchiveItem, FamilyArchiveReference, VerificationStatus } from "@/lib/cms/types";

async function loadFamilyArchivesFile(): Promise<FamilyArchivesFile> {
  return (await readCmsPublic("family-archives.json")) as FamilyArchivesFile;
}

export async function loadFamilyArchiveNote(): Promise<string> {
  const data = await loadFamilyArchivesFile();
  return data.note;
}

export async function loadFamilyArchiveItems(): Promise<FamilyArchiveItem[]> {
  const data = await loadFamilyArchivesFile();
  return data.items;
}

export async function loadFamilyArchiveHomePreview(
  count = 4,
): Promise<FamilyArchiveItem[]> {
  const items = await loadFamilyArchiveItems();
  return items.slice(0, count);
}

/** @deprecated Prefer loadFamilyArchiveNote() for runtime CMS data. */
export const FAMILY_ARCHIVE_NOTE =
  "Captions are transcribed from the Facebook page History: Church of Pakistan. Names, dates, and offices below follow those captions (or visible image headings / author comments where noted) and may need independent cross-check.";
