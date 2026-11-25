import { createHash } from "crypto";
import { z } from "zod";
import { readDoc, writeDoc } from "@/lib/cms/store";
import type {
  CathedralRecord,
  CathedralsFile,
  FamilyArchiveItem,
  FamilyArchivesFile,
  FeaturedInterview,
  FeaturedInterviewsFile,
  HomepageFile,
  PeopleFrame,
  PeopleFramesFile,
} from "@/lib/cms/types";
import { CURATOR_PHOTO_STATUS } from "@/lib/cms/photo-status";
import { deleteUnusedUploads, getMediaIndex } from "@/lib/media/library";
import { isImageUrl, isVideoUrl, STORAGE_BUDGET_BYTES } from "@/lib/media/rules";
import {
  SECTIONS,
  limitProblem,
  sectionConfig,
  type SectionDraft,
  type SectionId,
  type SectionItem,
  type SectionsSnapshot,
} from "./config";

/**
 * Draft → publish for the owner's "Photos & videos" page.
 *
 * Each section is a view over one live content document:
 *   hero       → homepage.json  hero.band_images
 *   gallery    → family-archives.json  items
 *   people     → people-frames.json  frames
 *   churches   → cathedrals.json  items[].local_file (one fixed photo per church)
 *   portrait   → homepage.json  hero.portrait (one fixed photo)
 *   interviews → featured-interviews.json  items (shown to the owner as "Videos")
 *
 * Edits are saved as a draft (private doc section-drafts.json). Nothing on
 * the website changes until Publish, which writes the live documents through
 * writeDoc() (so every publish is in History and can be restored). Public
 * pages read the live documents on every request, so a publish shows up
 * immediately, with no redeploy.
 */

type DraftsFile = { drafts: Partial<Record<SectionId, SectionDraft>> };

const DRAFTS = "section-drafts.json" as const;
/** Poster used when a new video's poster frame could not be made. */
const FALLBACK_POSTER = "/media/og/og-interviews.png";

/* ------------------------------ validation ------------------------------ */

const mediaPath = z
  .string()
  .min(1)
  .max(1000)
  .refine((v) => (v.startsWith("/media/") && !v.includes("..")) || /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(v), {
    message: "Unknown file location.",
  });

export const sectionItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9-]{0,119}$/i, "Bad item id."),
  src: mediaPath,
  alt: z.string().max(1000).transform((v) => v.trim()),
  title: z
    .string()
    .max(300)
    .optional()
    .transform((v) => v?.trim() || undefined),
  position: z
    .string()
    .regex(/^\d{1,3}(\.\d+)?% \d{1,3}(\.\d+)?%$/)
    .optional(),
  posterSrc: mediaPath.optional(),
  width: z.number().int().positive().max(20000).optional(),
  height: z.number().int().positive().max(20000).optional(),
  durationSeconds: z.number().positive().max(86400).optional(),
  /** Fixed places: shown to the owner only; publish never reads it. */
  label: z.string().max(300).optional(),
});

export const saveDraftSchema = z.object({
  items: z.array(sectionItemSchema).max(200),
  /** The draft revision the browser started from (0 = no draft yet). */
  rev: z.number().int().nonnegative(),
});

/** Kind check: photo sections take photos, the video section takes videos. */
export function kindProblem(id: SectionId, items: SectionItem[]): string | null {
  const cfg = sectionConfig(id)!;
  const ok = cfg.kind === "video" ? isVideoUrl : isImageUrl;
  if (items.some((i) => i.posterSrc && !isImageUrl(i.posterSrc))) return "Please choose a photo for the cover picture.";
  const bad = items.find((i) => !ok(i.src));
  if (!bad) return null;
  return cfg.kind === "video" ? "This section only takes videos." : "This section only takes photos.";
}

/* ------------------------------ live views ------------------------------ */

function heroId(src: string, index: number, seen: Set<string>) {
  let id = "hero-" + createHash("sha1").update(src).digest("hex").slice(0, 10);
  if (seen.has(id)) id = `${id}-${index}`;
  seen.add(id);
  return id;
}

type LiveDocs = {
  homepage: HomepageFile;
  archives: FamilyArchivesFile;
  people: PeopleFramesFile;
  interviews: FeaturedInterviewsFile;
  cathedrals: CathedralsFile;
};

async function readLiveDocs(): Promise<LiveDocs> {
  const [homepage, archives, people, interviews, cathedrals] = await Promise.all([
    readDoc<HomepageFile>("homepage.json"),
    readDoc<FamilyArchivesFile>("family-archives.json"),
    readDoc<PeopleFramesFile>("people-frames.json"),
    readDoc<FeaturedInterviewsFile>("featured-interviews.json"),
    readDoc<CathedralsFile>("cathedrals.json"),
  ]);
  return { homepage, archives, people, interviews, cathedrals };
}

/** "St. John's Cathedral, Gojra" — how a church is named to the owner. */
const churchName = (c: CathedralRecord) => `${c.cathedral}, ${c.city.split(",")[0]!.trim()}`;



function clean<T extends object>(o: T): T {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;
}

function liveItems(id: SectionId, docs: LiveDocs): SectionItem[] {
  switch (id) {
    case "hero": {
      const seen = new Set<string>();
      return (docs.homepage.hero.band_images ?? []).map((b, i) =>
        clean({ id: heroId(b.src, i, seen), src: b.src, alt: b.alt, position: b.position }),
      );
    }
    case "gallery":
      return docs.archives.items.map((a) =>
        clean({ id: a.id, src: a.imageSrc, alt: a.alt, title: a.title, position: a.imagePosition }),
      );
    case "people":
      return docs.people.frames.map((f) => clean({ id: f.id, src: f.src, alt: f.alt, title: f.title, position: f.position }));
    case "churches":
      return docs.cathedrals.items.map((c) =>
        clean({ id: c.id, src: c.local_file, alt: "", position: c.photo_position, label: churchName(c) }),
      );
    case "portrait":
      return [{ id: "curator-photo", src: docs.homepage.hero.portrait, alt: "", label: "Javed Qadir Bakhsh" }];
    case "interviews":
      return docs.interviews.items.map((v) =>
        clean({
          id: v.id,
          src: v.videoSrc,
          alt: v.alt,
          title: v.title,
          posterSrc: v.coverSrc || v.posterSrc,
          width: v.width,
          height: v.height,
          durationSeconds: v.durationSeconds,
        }),
      );
  }
}

async function readDrafts(): Promise<DraftsFile> {
  const file = await readDoc<DraftsFile>(DRAFTS);
  return { drafts: file?.drafts ?? {} };
}

async function writeDrafts(file: DraftsFile) {
  await writeDoc(DRAFTS, file);
}

export async function loadSectionsState(): Promise<SectionsSnapshot> {
  const [docs, drafts, media] = await Promise.all([readLiveDocs(), readDrafts(), getMediaIndex()]);
  return {
    sections: SECTIONS.map((cfg) => ({
      id: cfg.id,
      live: liveItems(cfg.id, docs),
      draft: drafts.drafts[cfg.id] ?? null,
    })),
    storage: {
      usedBytes: media.reduce((n, m) => n + (m.bytes || 0), 0),
      budgetBytes: STORAGE_BUDGET_BYTES,
      blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    },
  };
}

/** What the owner currently sees in a section (draft if any, else live). */
export async function currentSectionCount(id: SectionId): Promise<number> {
  const drafts = await readDrafts();
  const draft = drafts.drafts[id];
  if (draft) return draft.items.length;
  return liveItems(id, await readLiveDocs()).length;
}

export class SectionError extends Error {
  constructor(
    message: string,
    public status = 400,
    public extra: Record<string, unknown> = {},
  ) {
    super(message);
  }
}

/** Save (or clear) the draft for one section. */
export async function saveDraft(
  id: SectionId,
  items: SectionItem[],
  rev: number,
  user: string,
): Promise<SectionDraft | null> {
  const cfg = sectionConfig(id)!;
  const [docs, drafts] = await Promise.all([readLiveDocs(), readDrafts()]);
  const live = liveItems(id, docs);
  const existing = drafts.drafts[id];
  if ((existing?.rev ?? 0) !== rev) {
    throw new SectionError("Someone else changed this section a moment ago. Reload the page to see their changes.", 409, {
      conflict: true,
    });
  }
  const kind = kindProblem(id, items);
  if (kind) throw new SectionError(kind, 415);
  if (cfg.fixed) {
    // One photo per place: same places, same order (only the photo changes).
    const same = items.length === live.length && items.every((it, i) => it.id === live[i]!.id);
    if (!same) throw new SectionError("Reload the page and try again.", 409, { conflict: true });
    // The name comes from the website, never from the browser.
    items = items.map((it, i) => clean({ ...it, label: live[i]!.label, alt: "", title: undefined }));
  }
  const ids = items.map((i) => i.id);
  if (new Set(ids).size !== ids.length) throw new SectionError("The same photo is listed twice.");
  const baseIds = existing?.baseIds ?? live.map((i) => i.id);
  const limit = limitProblem(cfg, items, baseIds);
  if (limit) throw new SectionError(limit, 409, { full: true });

  const previous = existing?.items ?? live;
  let draft: SectionDraft | null = null;
  if (JSON.stringify(items) === JSON.stringify(live)) {
    // Back to exactly what's live: no unpublished changes.
    delete drafts.drafts[id];
  } else {
    draft = { items, baseIds, rev: rev + 1, updatedAt: new Date().toISOString(), updatedBy: user };
    drafts.drafts[id] = draft;
  }
  await writeDrafts(drafts);
  await freeDraftOnlyUploads(previous, items, live);
  return draft;
}

function srcsOf(items: SectionItem[]) {
  return items.flatMap((i) => (i.posterSrc ? [i.src, i.posterSrc] : [i.src]));
}

/**
 * A file uploaded into a draft and then deleted or replaced before it was
 * ever published is removed from storage straight away.
 */
async function freeDraftOnlyUploads(before: SectionItem[], after: SectionItem[], live: SectionItem[]) {
  const keep = new Set([...srcsOf(after), ...srcsOf(live)]);
  const gone = srcsOf(before).filter((src) => !keep.has(src));
  if (gone.length) await deleteUnusedUploads(gone);
}

export async function discardDrafts(id?: SectionId) {
  const [drafts, docs] = await Promise.all([readDrafts(), readLiveDocs()]);
  const ids = id ? [id] : SECTIONS.map((s) => s.id);
  const dropped: [SectionDraft, SectionItem[]][] = [];
  for (const sid of ids) {
    const d = drafts.drafts[sid];
    if (d) dropped.push([d, liveItems(sid, docs)]);
    delete drafts.drafts[sid];
  }
  await writeDrafts(drafts);
  for (const [d, live] of dropped) await freeDraftOnlyUploads(d.items, live, live);
}

/* -------------------------------- publish ------------------------------- */

/**
 * Order the draft over the current live list. Items someone added on the
 * live site after the draft was started are kept (first); items that were
 * removed from the live site meanwhile stay removed.
 */
function merge<T>(draft: SectionDraft, live: T[], idOf: (t: T) => string) {
  const liveById = new Map(live.map((t) => [idOf(t), t]));
  const draftIds = new Set(draft.items.map((i) => i.id));
  const addedLive = live.filter((t) => !draft.baseIds.includes(idOf(t)) && !draftIds.has(idOf(t)));
  const kept = draft.items.filter((i) => !(draft.baseIds.includes(i.id) && !liveById.has(i.id)));
  return { addedLive, kept, liveById };
}

const fallbackTitle = (i: SectionItem, n: string) => i.title || i.alt.slice(0, 120) || n;

function applyGallery(file: FamilyArchivesFile, draft: SectionDraft): FamilyArchivesFile {
  const { addedLive, kept, liveById } = merge(draft, file.items, (a) => a.id);
  const items = kept.map((i): FamilyArchiveItem => {
    const prev = liveById.get(i.id);
    const title = fallbackTitle(i, "Archive photograph");
    if (prev) {
      const replaced = prev.imageSrc !== i.src;
      return clean({
        ...prev,
        imageSrc: i.src,
        title,
        alt: i.alt || prev.alt,
        imagePosition: i.position,
        imageFit: replaced ? undefined : prev.imageFit,
      });
    }
    return clean({
      id: i.id,
      title,
      caption: i.alt || title,
      imageSrc: i.src,
      alt: i.alt || title,
      provenance: "Family Archive" as const,
      sourceLabel: "Added by the curator",
      verificationStatus: "needs-verification" as const,
      imagePosition: i.position,
    });
  });
  return { ...file, items: [...addedLive, ...items] };
}

function applyPeople(file: PeopleFramesFile, draft: SectionDraft): PeopleFramesFile {
  const { addedLive, kept, liveById } = merge(draft, file.frames, (f) => f.id);
  const frames = kept.map((i): PeopleFrame => {
    const prev = liveById.get(i.id);
    const title = fallbackTitle(i, "Photograph");
    if (prev) {
      const replaced = prev.src !== i.src;
      return clean({ ...prev, src: i.src, title, alt: i.alt || prev.alt, position: i.position, fit: replaced ? undefined : prev.fit });
    }
    return clean({ id: i.id, title, src: i.src, alt: i.alt || title, position: i.position });
  });
  return { ...file, frames: [...addedLive, ...frames] };
}

function applyInterviews(file: FeaturedInterviewsFile, draft: SectionDraft): FeaturedInterviewsFile {
  const { addedLive, kept, liveById } = merge(draft, file.items, (v) => v.id);
  const items = kept.map((i): FeaturedInterview => {
    const prev = liveById.get(i.id);
    const title = fallbackTitle(i, "Video");
    const width = i.width ?? prev?.width ?? 1280;
    const height = i.height ?? prev?.height ?? 720;
    const sized = { width, height, orientation: height > width ? ("portrait" as const) : ("landscape" as const) };
    if (prev && prev.videoSrc === i.src) {
      // Same video. A new cover picture (set by the owner) replaces the old cover.
      const newCover = i.posterSrc && i.posterSrc !== (prev.coverSrc || prev.posterSrc);
      return clean({
        ...prev,
        title,
        alt: i.alt || prev.alt,
        ...(newCover ? { posterSrc: i.posterSrc!, coverSrc: undefined, coverPosition: undefined } : {}),
      });
    }
    if (prev) {
      // A different video file: the old poster, captions and transcript belonged to the old one.
      return clean({
        ...prev,
        ...sized,
        videoSrc: i.src,
        posterSrc: i.posterSrc || FALLBACK_POSTER,
        title,
        alt: i.alt || prev.alt,
        durationSeconds: i.durationSeconds,
        coverSrc: undefined,
        coverPosition: undefined,
        captionsSrc: undefined,
        transcript: undefined,
      });
    }
    return clean({
      id: i.id,
      title,
      copy: i.alt || title,
      videoSrc: i.src,
      posterSrc: i.posterSrc || FALLBACK_POSTER,
      alt: i.alt || title,
      provenance: "History: Church of Pakistan",
      ...sized,
      featuredOnHome: true,
      durationSeconds: i.durationSeconds,
    });
  });
  return { ...file, items: [...addedLive, ...items] };
}

/** Churches: only the photo (and its focal point) changes; everything else stays. */
function applyChurches(file: CathedralsFile, draft: SectionDraft): CathedralsFile {
  const byId = new Map(draft.items.map((i) => [i.id, i]));
  return {
    ...file,
    items: file.items.map((c) => {
      const i = byId.get(c.id);
      if (!i) return c;
      if (i.src === c.local_file) return clean({ ...c, photo_position: i.position });
      // A new photo from the owner: the old photo's credit and licence no longer apply.
      return clean({
        ...c,
        local_file: i.src,
        photo_position: i.position,
        photo_status: CURATOR_PHOTO_STATUS,
        photo_source_page: "",
        photo_remote_url: "",
        photo_author: "",
        photo_license: "",
        fallback_file: undefined,
      });
    }),
  };
}

function applyPortrait(file: HomepageFile, draft: SectionDraft): HomepageFile {
  const photo = draft.items[0];
  if (!photo) return file;
  return { ...file, hero: { ...file.hero, portrait: photo.src } };
}

function applyHero(file: HomepageFile, draft: SectionDraft): HomepageFile {
  return {
    ...file,
    hero: {
      ...file.hero,
      band_images: draft.items.map((i) => ({ src: i.src, alt: i.alt, position: i.position ?? "50% 50%" })),
    },
  };
}

function changeSummary(label: string, before: SectionItem[], after: SectionItem[]) {
  const b = new Map(before.map((i) => [i.id, i]));
  const a = new Set(after.map((i) => i.id));
  const added = after.filter((i) => !b.has(i.id)).length;
  const removed = before.filter((i) => !a.has(i.id)).length;
  const replaced = after.filter((i) => b.has(i.id) && b.get(i.id)!.src !== i.src).length;
  const parts = [
    added && `${added} added`,
    removed && `${removed} removed`,
    replaced && `${replaced} replaced`,
  ].filter(Boolean);
  return `Published ${label}${parts.length ? ` (${parts.join(", ")})` : " (order or descriptions)"}`;
}

export type PublishResult = { published: SectionId[]; freedFiles: number };

/** Put every section's draft on the live website. */
export async function publishDrafts(): Promise<PublishResult> {
  const drafts = await readDrafts();
  const ids = SECTIONS.map((s) => s.id).filter((id) => drafts.drafts[id]);
  if (!ids.length) return { published: [], freedFiles: 0 };

  const docs = await readLiveDocs();
  const beforeSrcs = new Set<string>();
  const next: Partial<LiveDocs> = {};
  const summaries: Partial<Record<keyof LiveDocs, string>> = {};

  for (const id of ids) {
    const draft = drafts.drafts[id]!;
    const cfg = sectionConfig(id)!;
    const before = liveItems(id, docs);
    before.forEach((i) => {
      beforeSrcs.add(i.src);
      if (i.posterSrc) beforeSrcs.add(i.posterSrc);
    });
    const kind = kindProblem(id, draft.items);
    if (kind) throw new SectionError(`${cfg.label}: ${kind}`, 415);
    let key: keyof LiveDocs;
    // Two sections can change the same document (slideshow + curator photo): build on each other.
    switch (id) {
      case "hero":
        key = "homepage";
        next.homepage = applyHero(next.homepage ?? docs.homepage, draft);
        break;
      case "portrait":
        key = "homepage";
        next.homepage = applyPortrait(next.homepage ?? docs.homepage, draft);
        break;
      case "churches":
        key = "cathedrals";
        next.cathedrals = applyChurches(docs.cathedrals, draft);
        break;
      case "gallery":
        key = "archives";
        next.archives = applyGallery(docs.archives, draft);
        break;
      case "people":
        key = "people";
        next.people = applyPeople(docs.people, draft);
        break;
      case "interviews":
        key = "interviews";
        next.interviews = applyInterviews(docs.interviews, draft);
        break;
    }
    const after = liveItems(id, { ...docs, ...next } as LiveDocs);
    const limit = limitProblem(cfg, after, before.map((i) => i.id));
    if (limit) throw new SectionError(limit, 409, { full: true, section: id });
    const summary = changeSummary(cfg.label, before, after);
    summaries[key] = summaries[key] ? `${summaries[key]}; ${summary}` : summary;
  }

  if (next.homepage) await writeDoc("homepage.json", next.homepage, { summary: summaries.homepage });
  if (next.archives) await writeDoc("family-archives.json", next.archives, { summary: summaries.archives });
  if (next.people) await writeDoc("people-frames.json", next.people, { summary: summaries.people });
  if (next.interviews) await writeDoc("featured-interviews.json", next.interviews, { summary: summaries.interviews });
  if (next.cathedrals) await writeDoc("cathedrals.json", next.cathedrals, { summary: summaries.cathedrals });

  for (const id of ids) delete drafts.drafts[id];
  await writeDrafts(drafts);

  // Free storage: uploads taken off the site that nothing else uses.
  const freedFiles = await deleteUnusedUploads([...beforeSrcs]);
  return { published: ids, freedFiles };
}
