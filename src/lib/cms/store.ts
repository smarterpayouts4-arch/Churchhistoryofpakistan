import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import type {
  CathedralsFile,
  CuratorProfileFile,
  FamilyArchivesFile,
  FeaturedInterviewsFile,
  HomepageFile,
  PeopleFramesFile,
  SiteSettingsFile,
} from "./types";

const CMS_DIR = path.join(process.cwd(), "data", "cms");

async function readJson<T>(filename: string): Promise<T> {
  noStore();
  const full = path.join(CMS_DIR, filename);
  const raw = await fs.readFile(full, "utf8");
  return JSON.parse(raw) as T;
}

/**
 * Public pages share one disk read per CMS file per request.
 * Admin and API routes keep calling the uncached getters above this helper.
 */
export const readCmsPublic = cache(async (filename: string): Promise<unknown> => {
  return readJson(filename);
});

async function writeJson(filename: string, data: unknown): Promise<void> {
  const full = path.join(CMS_DIR, filename);
  const tmp = `${full}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
  await fs.rename(tmp, full);
}

export async function getFamilyArchives(): Promise<FamilyArchivesFile> {
  return readJson<FamilyArchivesFile>("family-archives.json");
}

export async function saveFamilyArchives(
  data: FamilyArchivesFile,
): Promise<void> {
  await writeJson("family-archives.json", data);
}

export async function getFeaturedInterviews(): Promise<FeaturedInterviewsFile> {
  return readJson<FeaturedInterviewsFile>("featured-interviews.json");
}

export async function saveFeaturedInterviews(
  data: FeaturedInterviewsFile,
): Promise<void> {
  await writeJson("featured-interviews.json", data);
}

export async function getCuratorProfileFile(): Promise<CuratorProfileFile> {
  return readJson<CuratorProfileFile>("curator-profile.json");
}

export async function saveCuratorProfileFile(
  data: CuratorProfileFile,
): Promise<void> {
  await writeJson("curator-profile.json", data);
}

export function cmsDir(): string {
  return CMS_DIR;
}

export async function getHomepage(): Promise<HomepageFile> {
  return readJson<HomepageFile>("homepage.json");
}

export async function saveHomepage(data: HomepageFile): Promise<void> {
  await writeJson("homepage.json", data);
}

export async function getPeopleFrames(): Promise<PeopleFramesFile> {
  return readJson<PeopleFramesFile>("people-frames.json");
}

export async function savePeopleFrames(data: PeopleFramesFile): Promise<void> {
  await writeJson("people-frames.json", data);
}

export async function getCathedrals(): Promise<CathedralsFile> {
  return readJson<CathedralsFile>("cathedrals.json");
}

export async function saveCathedrals(data: CathedralsFile): Promise<void> {
  await writeJson("cathedrals.json", data);
}

export async function getSiteSettings(): Promise<SiteSettingsFile> {
  return readJson<SiteSettingsFile>("site.json");
}

export async function saveSiteSettings(data: SiteSettingsFile): Promise<void> {
  await writeJson("site.json", data);
}
