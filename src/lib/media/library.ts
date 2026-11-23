import { promises as fs } from "fs";
import path from "path";
import { CONTENT_DOCS, DOC_LABELS, readDoc, writeDoc } from "@/lib/cms/store";
import type { MediaFile, MediaItem } from "@/lib/cms/types";
import { isImageUrl, isVideoUrl } from "./rules";

export const UPLOAD_PUBLIC_PREFIX = "/media/uploads";
export const BLOB_HOST_RE = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i;

export async function getMediaIndex(): Promise<MediaItem[]> {
  return (await readDoc<MediaFile>("media.json")).items ?? [];
}

export async function saveMediaIndex(items: MediaItem[]) {
  await writeDoc("media.json", { items } satisfies MediaFile);
}

export async function addMediaItem(item: MediaItem) {
  const items = await getMediaIndex();
  await saveMediaIndex([item, ...items.filter((i) => i.url !== item.url)]);
}

function collectStrings(value: unknown, out: string[]) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === "object") {
    Object.values(value).forEach((v) => collectStrings(v, out));
  }
}

/** Map of media URL → list of sections that use it. */
export async function mediaUsage(): Promise<Map<string, string[]>> {
  const usage = new Map<string, string[]>();
  await Promise.all(
    CONTENT_DOCS.map(async (doc) => {
      const data = await readDoc(doc).catch(() => null);
      const strings: string[] = [];
      collectStrings(data, strings);
      for (const s of strings) {
        if (!(s.startsWith("/media/") || BLOB_HOST_RE.test(s))) continue;
        const list = usage.get(s) ?? [];
        if (!list.includes(DOC_LABELS[doc])) list.push(DOC_LABELS[doc]);
        usage.set(s, list);
      }
    }),
  );
  return usage;
}

/** Images and videos already shipped in public/media (when the folder is readable). */
async function scanPublicMedia(): Promise<string[]> {
  const root = path.join(process.cwd(), "public", "media");
  const out: string[] = [];
  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === "icons" || e.name === "textures") continue;
        await walk(full);
      } else if (isImageUrl(e.name) || isVideoUrl(e.name)) {
        out.push("/" + path.relative(path.join(process.cwd(), "public"), full).split(path.sep).join("/"));
      }
    }
  }
  await walk(root);
  return out;
}

export type LibraryEntry = {
  url: string;
  kind: "image" | "video";
  filename: string;
  alt: string;
  /** Present for items uploaded through the library. */
  item?: MediaItem;
  usedIn: string[];
  group: "uploaded" | "site";
};

export async function listLibrary(): Promise<LibraryEntry[]> {
  const [index, usage, shipped] = await Promise.all([
    getMediaIndex(),
    mediaUsage(),
    scanPublicMedia(),
  ]);
  const seen = new Set<string>();
  const entries: LibraryEntry[] = [];
  for (const item of index) {
    seen.add(item.url);
    entries.push({
      url: item.url,
      kind: item.kind,
      filename: item.filename,
      alt: item.alt,
      item,
      usedIn: usage.get(item.url) ?? [],
      group: "uploaded",
    });
  }
  const siteUrls = [...new Set([...usage.keys(), ...shipped])].filter(
    (u) => !seen.has(u) && (isImageUrl(u) || isVideoUrl(u)),
  );
  for (const url of siteUrls.sort()) {
    entries.push({
      url,
      kind: isVideoUrl(url) ? "video" : "image",
      filename: url.split("/").pop() ?? url,
      alt: "",
      usedIn: usage.get(url) ?? [],
      group: "site",
    });
  }
  return entries;
}
