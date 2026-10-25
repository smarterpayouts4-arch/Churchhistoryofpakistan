import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import type {
  BlogFile,
  CathedralsFile,
  CuratorProfileFile,
  FamilyArchivesFile,
  FeaturedInterviewsFile,
  HomepageFile,
  PeopleFramesFile,
  SiteSettingsFile,
} from "./types";

const CMS_DIR = path.join(process.cwd(), "data", "cms");

/**
 * Storage adapter (ADR-008):
 * - If KV_REST_API_URL + KV_REST_API_TOKEN exist (Upstash Redis, sold as
 *   Vercel KV via the Vercel Marketplace), CMS documents live in KV as
 *   one JSON document per key `cms:<filename>` — the repo's whole-file
 *   JSON shape maps 1:1, no schema migration needed. On first read a
 *   missing key is seeded from the bundled data/cms/*.json file.
 * - Otherwise the current file-JSON store is used (local/dev).
 */
export function storageBackend(): "vercel-kv" | "file" {
  return process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? "vercel-kv"
    : "file";
}

function kvKey(filename: string) {
  return `cms:${filename}`;
}

async function kvRequest(command: string, filename: string, body?: string) {
  const base = (process.env.KV_REST_API_URL as string).replace(/\/$/, "");
  const token =
    process.env.KV_REST_API_TOKEN || process.env.KV_REST_API_READ_ONLY_TOKEN;
  const res = await fetch(`${base}/${command}/${encodeURIComponent(kvKey(filename))}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`KV ${command} failed (${res.status})`);
  return (await res.json()) as { result: string | null };
}

async function readFileJson<T>(filename: string): Promise<T> {
  const full = path.join(CMS_DIR, filename);
  const raw = await fs.readFile(full, "utf8");
  return JSON.parse(raw) as T;
}

async function readJson<T>(filename: string): Promise<T> {
  noStore();
  if (storageBackend() === "vercel-kv") {
    const { result } = await kvRequest("get", filename);
    if (result !== null && result !== undefined) {
      return JSON.parse(result) as T;
    }
    // First run: seed KV from the bundled file so nothing is lost.
    const seeded = await readFileJson<T>(filename);
    await kvRequest("set", filename, JSON.stringify(seeded));
    return seeded;
  }
  return readFileJson<T>(filename);
}

/**
 * Public pages share one disk read per CMS file per request.
 * Admin and API routes keep calling the uncached getters above this helper.
 */
export const readCmsPublic = cache(async (filename: string): Promise<unknown> => {
  return readJson(filename);
});

async function writeJson(filename: string, data: unknown): Promise<void> {
  if (storageBackend() === "vercel-kv") {
    await kvRequest("set", filename, JSON.stringify(data));
    return;
  }
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

export async function getBlogPosts(): Promise<BlogFile> {
  try {
    return await readJson<BlogFile>("blog.json");
  } catch {
    return { posts: [] };
  }
}

export async function saveBlogPosts(data: BlogFile): Promise<void> {
  await writeJson("blog.json", data);
}
