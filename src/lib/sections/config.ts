/**
 * The website's photo & video sections, as the owner sees them in the
 * admin ("Photos & videos"). Shared by the browser and the server, so the
 * limits below are enforced in both places.
 */

/** Most photos any one section can hold. */
export const MAX_IMAGES_PER_SECTION = 20;
/** The Family Archive gallery already held 24 photos, so it gets more room. */
export const MAX_ARCHIVE_PHOTOS = 30;
/** Most videos on the whole site (they all live in the Videos section). */
export const MAX_VIDEOS = 5;

/**
 * Section ids are stored in saved drafts, so they never change ("interviews"
 * is the Videos section; only its label was renamed).
 */
export const SECTION_IDS = ["hero", "gallery", "people", "churches", "portrait", "interviews"] as const;
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
  /**
   * One photo per fixed place on the website (each church, the curator's
   * photo): the owner can only replace them, never add, delete or reorder.
   */
  fixed?: boolean;
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
    where: "The photo gallery on the Archive page. The first four that are not already in the homepage slideshow also show on the homepage.",
    href: "/archive",
    kind: "image",
    max: MAX_ARCHIVE_PHOTOS,
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
    id: "churches",
    label: "Churches & cathedrals",
    where: "The photo of each church on the Churches page (four of them also show on the homepage). Press “Replace photo” under a church to put in your own photo.",
    href: "/churches",
    kind: "image",
    max: 20,
    titled: false,
    fixed: true,
  },
  {
    id: "portrait",
    label: "Curator photo",
    where: "Your photo (Javed Qadir Bakhsh). It shows in every place your picture appears: the small round photo at the top of the homepage, “My connection” on the homepage, and the About page.",
    href: "/about",
    kind: "image",
    max: 1,
    titled: false,
    fixed: true,
  },
  {
    id: "interviews",
    label: "Videos",
    where: "The videos on the Videos page and the homepage. The first one shows first. Under a video, “Change cover picture” changes the picture people see before they press play.",
    href: "/videos",
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
  /** Fixed places only: the name shown to the owner (e.g. the church). Not editable. */
  label?: string;
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
  if (cfg.fixed) return `${cfg.label} has one photo per place. Press “Replace photo” to change one.`;
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
