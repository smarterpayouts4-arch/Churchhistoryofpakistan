/**
 * The website's photo & video sections, as the owner sees them in the
 * admin ("Photos & videos"). Shared by the browser and the server, so the
 * limits below are enforced in both places.
 */

/** Most photos any one section can hold. */
export const MAX_IMAGES_PER_SECTION = 20;
/** Most videos on the whole site (they all live in the Interviews section). */
export const MAX_VIDEOS = 5;

export const SECTION_IDS = ["hero", "gallery", "people", "interviews"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export type SectionConfig = {
  id: SectionId;
  /** Name shown to the owner. */
  label: string;
  /** One line: where these appear on the website. */
  where: string;
  /** Public page to check after publishing. */
  href: string;
  kind: "image" | "video";
  max: number;
  /** Whether each photo/video shows a title on the website. */
  titled: boolean;
};

export const SECTIONS: readonly SectionConfig[] = [
  {
    id: "hero",
    label: "Homepage slideshow",
    where: "The large rotating photo at the top of the homepage.",
    href: "/",
    kind: "image",
    max: MAX_IMAGES_PER_SECTION,
    titled: false,
  },
  {
    id: "gallery",
    label: "Family Archive gallery",
    where: "The photo gallery on the Archive page (the first four also show on the homepage).",
    href: "/archive",
    kind: "image",
    max: MAX_IMAGES_PER_SECTION,
    titled: true,
  },
  {
    id: "people",
    label: "People photos",
    where: "The photos on the People page.",
    href: "/people",
    kind: "image",
    max: MAX_IMAGES_PER_SECTION,
    titled: true,
  },
  {
    id: "interviews",
    label: "Interview videos",
    where: "The videos on the Interviews page and the homepage. The first one shows first.",
    href: "/interviews",
    kind: "video",
    max: MAX_VIDEOS,
    titled: true,
  },
];

export function sectionConfig(id: string): SectionConfig | undefined {
  return SECTIONS.find((s) => s.id === id);
}

export function isSectionId(id: string): id is SectionId {
  return (SECTION_IDS as readonly string[]).includes(id);
}

/** One photo or video in a section, in display order. */
export type SectionItem = {
  /** Stable id (kept when the file is replaced). */
  id: string;
  /** The photo or video file. */
  src: string;
  /** Description for people who can't see it (also the hero caption). */
  alt: string;
  /** Shown on the website under the photo/video (titled sections only). */
  title?: string;
  /** Focal point, e.g. "50% 30%" (photos). */
  position?: string;
  /** Videos: poster photo, size and length. */
  posterSrc?: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
};

export type SectionDraft = {
  items: SectionItem[];
  /** Item ids on the live site when this draft was started. */
  baseIds: string[];
  /** Bumped on every save (two people editing the same draft). */
  rev: number;
  updatedAt: string;
  updatedBy: string;
};

export type SectionState = {
  id: SectionId;
  live: SectionItem[];
  draft: SectionDraft | null;
};

/** Everything the "Photos & videos" page needs (from GET /api/admin/sections). */
export type SectionsSnapshot = {
  sections: SectionState[];
  storage: { usedBytes: number; budgetBytes: number; blob: boolean };
};

/** Friendly "section is full" message (same text in the browser and the API). */
export function fullMessage(cfg: SectionConfig, count = cfg.max): string {
  const noun = cfg.kind === "video" ? "videos" : "photos";
  const one = cfg.kind === "video" ? "video" : "photo";
  return `${cfg.label} is full (${count} of ${cfg.max} ${noun}). Delete a ${one} to add another.`;
}

/**
 * Can `items` be saved for this section? Sections that already had more
 * than the limit before limits existed keep everything they had (nothing is
 * ever taken off the site), but can't grow until they're under the limit.
 */
export function limitProblem(
  cfg: SectionConfig,
  items: SectionItem[],
  liveIds: string[],
): string | null {
  if (items.length <= cfg.max) return null;
  const grandfathered =
    items.length <= liveIds.length && items.every((i) => liveIds.includes(i.id));
  return grandfathered ? null : fullMessage(cfg, items.length);
}
