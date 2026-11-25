import { promises as fs } from "fs";
import path from "path";
import { createHash, randomUUID } from "crypto";
import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { kv, kvConfigured } from "./kv";
import {
  CmsConflictError,
  StorageNotConfiguredError,
  cmsContext,
} from "./context";
import type {
  BlogFile,
  CathedralsFile,
  CuratorProfileFile,
  FamilyArchivesFile,
  FeaturedInterviewsFile,
  HomeLayoutFile,
  HomepageFile,
  PeopleFramesFile,
  SiteSettingsFile,
} from "./types";

/**
 * CMS storage adapter (ADR-008, extended in ADR-012).
 *
 * Content documents (`data/cms/*.json`, committed to git) are the public
 * archive. Private documents (users, media index, contributions) are never
 * committed: they live in Vercel KV in production and in
 * `data/local-store/` (git-ignored) on a local machine.
 *
 * Backends:
 * - KV_REST_API_URL + KV_REST_API_TOKEN set → Upstash Redis / Vercel KV.
 *   Missing content keys are seeded from the bundled data/cms file.
 * - Otherwise → local files (dev). On Vercel without KV, writes fail with a
 *   clear "storage not configured" error instead of silently vanishing.
 *
 * Every content save records a revision (who, when, what changed) so the
 * admin can restore earlier versions, and compares the editor's base version
 * so two people editing at once get a conflict warning, not a silent
 * overwrite.
 */

const CMS_DIR = path.join(process.cwd(), "data", "cms");
const LOCAL_DIR = path.join(process.cwd(), "data", "local-store");
const MAX_REVISIONS = 40;

/** Documents that are public content (seeded from data/cms). */
export const CONTENT_DOCS = [
  "homepage.json",
  "home-layout.json",
  "site.json",
  "family-archives.json",
  "featured-interviews.json",
  "people-frames.json",
  "cathedrals.json",
  "curator-profile.json",
  "blog.json",
] as const;
export type ContentDoc = (typeof CONTENT_DOCS)[number];

/** Private documents (never committed, never public). */
export type PrivateDoc =
  | "users.json"
  | "media.json"
  | "contributions.json"
  /** Unpublished photo & video changes (admin "Photos & videos"). */
  | "section-drafts.json";
export type DocName = ContentDoc | PrivateDoc;

export const DOC_LABELS: Record<ContentDoc, string> = {
  "homepage.json": "Homepage text & photos",
  "home-layout.json": "Homepage section order",
  "site.json": "Site settings & page text",
  "family-archives.json": "Family Archive records",
  "featured-interviews.json": "Videos",
  "people-frames.json": "People photos",
  "cathedrals.json": "Churches",
  "curator-profile.json": "Curator profile",
  "blog.json": "Blog posts",
};

export function isContentDoc(name: string): name is ContentDoc {
  return (CONTENT_DOCS as readonly string[]).includes(name);
}

export function storageBackend(): "vercel-kv" | "file" {
  return kvConfigured() ? "vercel-kv" : "file";
}

/** True on a hosted deployment where the local filesystem is read-only. */
export function isHostedReadOnlyFs(): boolean {
  return Boolean(process.env.VERCEL) && !kvConfigured();
}

export function storageStatus() {
  const production =
    process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
  return {
    production,
    kv: kvConfigured(),
    blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    backend: storageBackend(),
    hosted: Boolean(process.env.VERCEL),
  };
}

export function docVersion(data: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex")
    .slice(0, 16);
}

/* ------------------------------------------------------------------ */
/* Low-level read/write                                                 */
/* ------------------------------------------------------------------ */

function contentPath(name: ContentDoc) {
  return path.join(CMS_DIR, name);
}
function privatePath(name: string) {
  return path.join(LOCAL_DIR, name);
}

async function readFileJson<T>(full: string): Promise<T> {
  const raw = await fs.readFile(full, "utf8");
  return JSON.parse(raw) as T;
}

async function writeFileJsonAtomic(full: string, data: unknown) {
  await fs.mkdir(path.dirname(full), { recursive: true });
  const tmp = `${full}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
  await fs.rename(tmp, full);
}

const PRIVATE_DEFAULTS: Record<PrivateDoc, unknown> = {
  "users.json": { users: [] },
  "media.json": { items: [] },
  "contributions.json": { items: [] },
  "section-drafts.json": { drafts: {} },
};

async function rawRead<T>(name: DocName): Promise<T> {
  if (storageBackend() === "vercel-kv") {
    const result = await kv<string | null>(["GET", `cms:${name}`]);
    if (result !== null && result !== undefined) return JSON.parse(result) as T;
    const seeded = isContentDoc(name)
      ? await readFileJson<T>(contentPath(name)).catch(() => defaultFor<T>(name))
      : defaultFor<T>(name);
    await kv(["SET", `cms:${name}`, JSON.stringify(seeded), "NX"]);
    return seeded;
  }
  if (isContentDoc(name)) {
    return readFileJson<T>(contentPath(name)).catch(() => defaultFor<T>(name));
  }
  return readFileJson<T>(privatePath(name)).catch(() => defaultFor<T>(name));
}

function defaultFor<T>(name: DocName): T {
  if (name === "blog.json") return { posts: [] } as T;
  if (name === "home-layout.json") return { sections: [] } as T;
  if (name in PRIVATE_DEFAULTS) {
    return structuredClone(PRIVATE_DEFAULTS[name as PrivateDoc]) as T;
  }
  throw new Error(`Missing CMS document ${name}`);
}

async function rawWrite(name: DocName, data: unknown) {
  if (storageBackend() === "vercel-kv") {
    await kv(["SET", `cms:${name}`, JSON.stringify(data)]);
    return;
  }
  if (isHostedReadOnlyFs()) throw new StorageNotConfiguredError();
  await writeFileJsonAtomic(
    isContentDoc(name) ? contentPath(name) : privatePath(name),
    data,
  );
}

/* ------------------------------------------------------------------ */
/* Revisions                                                            */
/* ------------------------------------------------------------------ */

export type RevisionMeta = {
  id: string;
  doc: ContentDoc;
  at: string;
  by: string;
  version: string;
  summary: string;
  restoredFrom?: string;
};

type RevisionIndex = { revisions: RevisionMeta[] };

function revIndexPath(doc: ContentDoc) {
  return path.join(LOCAL_DIR, "revisions", doc.replace(/\.json$/, ""), "index.json");
}
function revDataPath(doc: ContentDoc, id: string) {
  return path.join(LOCAL_DIR, "revisions", doc.replace(/\.json$/, ""), `${id}.json`);
}

export async function listRevisions(doc: ContentDoc): Promise<RevisionMeta[]> {
  if (storageBackend() === "vercel-kv") {
    const list = await kv<string[]>(["LRANGE", `cmsrev:${doc}`, 0, MAX_REVISIONS - 1]);
    return (list ?? []).map((s) => JSON.parse(s) as RevisionMeta);
  }
  const idx = await readFileJson<RevisionIndex>(revIndexPath(doc)).catch(
    () => ({ revisions: [] }) as RevisionIndex,
  );
  return idx.revisions;
}

export async function readRevision<T>(doc: ContentDoc, id: string): Promise<T | null> {
  if (!/^[a-z0-9-]+$/i.test(id)) return null;
  if (storageBackend() === "vercel-kv") {
    const s = await kv<string | null>(["GET", `cmsrevdata:${doc}:${id}`]);
    return s ? (JSON.parse(s) as T) : null;
  }
  return readFileJson<T>(revDataPath(doc, id)).catch(() => null);
}

async function pushRevision(meta: RevisionMeta, data: unknown) {
  if (storageBackend() === "vercel-kv") {
    await kv([
      "SET",
      `cmsrevdata:${meta.doc}:${meta.id}`,
      JSON.stringify(data),
      "EX",
      60 * 60 * 24 * 365,
    ]);
    await kv(["LPUSH", `cmsrev:${meta.doc}`, JSON.stringify(meta)]);
    await kv(["LTRIM", `cmsrev:${meta.doc}`, 0, MAX_REVISIONS - 1]);
    return;
  }
  const idx = await readFileJson<RevisionIndex>(revIndexPath(meta.doc)).catch(
    () => ({ revisions: [] }) as RevisionIndex,
  );
  idx.revisions.unshift(meta);
  const dropped = idx.revisions.splice(MAX_REVISIONS);
  await writeFileJsonAtomic(revDataPath(meta.doc, meta.id), data);
  await writeFileJsonAtomic(revIndexPath(meta.doc), idx);
  await Promise.all(
    dropped.map((d) => fs.unlink(revDataPath(meta.doc, d.id)).catch(() => {})),
  );
}

function newRevisionId() {
  return `${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`;
}

/** Plain-language summary of what changed, for the history list. */
export function summarizeChange(before: unknown, after: unknown): string {
  if (typeof before !== "object" || typeof after !== "object" || !before || !after) {
    return "Updated";
  }
  const b = before as Record<string, unknown>;
  const a = after as Record<string, unknown>;
  const parts: string[] = [];
  for (const key of new Set([...Object.keys(b), ...Object.keys(a)])) {
    const bv = b[key];
    const av = a[key];
    if (JSON.stringify(bv) === JSON.stringify(av)) continue;
    const label = key.replace(/_/g, " ");
    if (Array.isArray(bv) && Array.isArray(av)) {
      if (av.length > bv.length) parts.push(`${label}: ${av.length - bv.length} added`);
      else if (av.length < bv.length) parts.push(`${label}: ${bv.length - av.length} removed`);
      else parts.push(`${label} edited`);
    } else {
      parts.push(`${label} edited`);
    }
  }
  return parts.length ? parts.slice(0, 4).join(" · ") : "No changes";
}

/* ------------------------------------------------------------------ */
/* Public document API                                                  */
/* ------------------------------------------------------------------ */

export async function readDoc<T>(name: DocName): Promise<T> {
  noStore();
  return rawRead<T>(name);
}

export async function readDocWithVersion<T>(
  name: DocName,
): Promise<{ data: T; version: string }> {
  const data = await readDoc<T>(name);
  return { data, version: docVersion(data) };
}

/**
 * Save a document. For content docs, enforces optimistic concurrency using
 * the base version from the request context and records a revision.
 */
export async function writeDoc(
  name: DocName,
  data: unknown,
  opts: { summary?: string; restoredFrom?: string } = {},
): Promise<string> {
  const ctx = cmsContext.getStore();
  if (!isContentDoc(name)) {
    await rawWrite(name, data);
    return docVersion(data);
  }
  const current = await rawRead<unknown>(name);
  const currentVersion = docVersion(current);
  if (ctx?.baseVersion && !ctx.force && ctx.baseVersion !== currentVersion) {
    const [last] = await listRevisions(name).catch(() => []);
    throw new CmsConflictError(name, currentVersion, last?.by, last?.at);
  }
  const nextVersion = docVersion(data);
  if (nextVersion === currentVersion) {
    if (ctx) ctx.written = { doc: name, version: nextVersion };
    return nextVersion;
  }
  const existing = await listRevisions(name).catch(() => []);
  if (existing.length === 0) {
    // Keep the very first state so the original can always be restored.
    await pushRevision(
      {
        id: newRevisionId(),
        doc: name,
        at: new Date().toISOString(),
        by: "original",
        version: currentVersion,
        summary: "Original version (before the first admin edit)",
      },
      current,
    );
  }
  await rawWrite(name, data);
  await pushRevision(
    {
      id: newRevisionId(),
      doc: name,
      at: new Date().toISOString(),
      by: ctx?.user ?? "system",
      version: nextVersion,
      summary: opts.summary ?? summarizeChange(current, data),
      ...(opts.restoredFrom ? { restoredFrom: opts.restoredFrom } : {}),
    },
    data,
  );
  if (ctx) ctx.written = { doc: name, version: nextVersion };
  return nextVersion;
}

export async function lastEdited(doc: ContentDoc) {
  const [last] = await listRevisions(doc).catch(() => []);
  return last ?? null;
}

/**
 * Public pages share one read per CMS file per request.
 */
export const readCmsPublic = cache(async (filename: string): Promise<unknown> => {
  return readDoc(filename as DocName);
});

export function localStoreDir(): string {
  return LOCAL_DIR;
}

/* ------------------------------------------------------------------ */
/* Typed helpers (kept for existing routes)                             */
/* ------------------------------------------------------------------ */

export const getFamilyArchives = () => readDoc<FamilyArchivesFile>("family-archives.json");
export const saveFamilyArchives = (d: FamilyArchivesFile) => writeDoc("family-archives.json", d).then(() => {});
export const getFeaturedInterviews = () => readDoc<FeaturedInterviewsFile>("featured-interviews.json");
export const saveFeaturedInterviews = (d: FeaturedInterviewsFile) => writeDoc("featured-interviews.json", d).then(() => {});
export const getCuratorProfileFile = () => readDoc<CuratorProfileFile>("curator-profile.json");
export const saveCuratorProfileFile = (d: CuratorProfileFile) => writeDoc("curator-profile.json", d).then(() => {});
export const getHomepage = () => readDoc<HomepageFile>("homepage.json");
export const saveHomepage = (d: HomepageFile) => writeDoc("homepage.json", d).then(() => {});
export const getHomeLayout = () => readDoc<HomeLayoutFile>("home-layout.json");
export const saveHomeLayout = (d: HomeLayoutFile) => writeDoc("home-layout.json", d).then(() => {});
export const getPeopleFrames = () => readDoc<PeopleFramesFile>("people-frames.json");
export const savePeopleFrames = (d: PeopleFramesFile) => writeDoc("people-frames.json", d).then(() => {});
export const getCathedrals = () => readDoc<CathedralsFile>("cathedrals.json");
export const saveCathedrals = (d: CathedralsFile) => writeDoc("cathedrals.json", d).then(() => {});
export const getSiteSettings = () => readDoc<SiteSettingsFile>("site.json");
export const saveSiteSettings = (d: SiteSettingsFile) => writeDoc("site.json", d).then(() => {});
export const getBlogPosts = () => readDoc<BlogFile>("blog.json");
export const saveBlogPosts = (d: BlogFile) => writeDoc("blog.json", d).then(() => {});
