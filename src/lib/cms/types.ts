export type VerificationStatus = "facebook-caption" | "needs-verification";

export type FamilyArchiveReference = {
  label: string;
  url: string;
  note?: string;
};

export type FamilyArchiveItem = {
  id: string;
  title: string;
  caption: string;
  imageSrc: string;
  alt: string;
  provenance: "Family Archive";
  sourceLabel: string;
  sourceUrl?: string;
  dateLabel?: string;
  verificationStatus: VerificationStatus;
  /** Balanced historical / controversy context from independent press or reference works. */
  contextNote?: string;
  /** Linked public-record sources for contextNote (not Facebook provenance). */
  references?: FamilyArchiveReference[];
};

export type FamilyArchivesFile = {
  note: string;
  items: FamilyArchiveItem[];
};

export type FeaturedInterview = {
  id: string;
  title: string;
  copy: string;
  videoSrc: string;
  posterSrc: string;
  /** Optional 4:5 Facebook cover thumbnail; UI falls back to posterSrc. */
  coverSrc?: string;
  alt: string;
  sourceUrl: string;
  provenance: string;
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
  featuredOnHome: boolean;
};

export type FeaturedInterviewsFile = {
  items: FeaturedInterview[];
};

export type PeopleFrame = {
  id: string;
  title: string;
  src: string;
  alt: string;
};

export type PeopleFramesFile = {
  frames: PeopleFrame[];
};

export type CuratorProfile = {
  name: string;
  eyebrow: string;
  headline: string;
  introduction: string[];
  guidingPrinciple: string;
  conviction: string;
  closingLine: string;
  education: { title: string; body: string[] };
  publicService: { title: string; body: string[] };
  churchService: { title: string; intro: string; roles: string[] };
  historyMission: { title: string; body: string[] };
  themes: { title: string; copy: string }[];
  digitalWork: { title: string; body: string[] };
  legacy: { title: string; body: string };
};

export type CuratorProfileFile = {
  source: string;
  profile: CuratorProfile;
};

/** Homepage CMS — same shape as legacy HomepageContent in src/content/homepage.ts */
export type PurposeCard = {
  title: string;
  copy: string;
};

export type TimelineEntry = {
  year: string;
  title: string;
  copy: string;
  source: string;
};

export type HomepageContent = {
  site_title: string;
  strapline: string;
  guiding_principle: string;
  hero: {
    eyebrow: string;
    title: string;
    intro: string;
    purpose: string;
    portrait: string;
  };
  purpose_cards: PurposeCard[];
  connection: string[];
  timeline: TimelineEntry[];
  contribution_fields: string[];
  page_context: {
    contribute_eyebrow: string;
    contribute_heading: string;
    contribute_copy: string;
    contribute_button: string;
    guiding_note: string;
    archive_intro: string;
    interviews_intro: string;
    people_intro: string;
    contribute_intro: string;
  };
};

/** Stored file shape equals HomepageContent (no wrapper). */
export type HomepageFile = HomepageContent;

/** Photo rights status for cathedral records */
export type PhotoStatus = "permission_needed" | "open_license" | string;

export type CathedralRecord = {
  id: string;
  diocese: string;
  cathedral: string;
  city: string;
  address: string;
  verification: string;
  verification_urls: string[];
  photo_status: PhotoStatus;
  photo_source_page: string;
  photo_remote_url: string;
  photo_author: string;
  photo_license: string;
  local_file: string;
  fallback_file?: string;
  notes: string;
  map_query: string;
  maps_search_url: string;
};

export type CathedralsFile = {
  note: string;
  items: CathedralRecord[];
};
