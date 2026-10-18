import { z } from "zod";

export const verificationStatusSchema = z.enum([
  "facebook-caption",
  "needs-verification",
]);

const optionalUrl = z
  .string()
  .max(1000)
  .optional()
  .transform((v) => {
    const t = (v ?? "").trim();
    return t.length ? t : undefined;
  })
  .refine((v) => v === undefined || /^https?:\/\//i.test(v), {
    message: "sourceUrl must be an http(s) URL",
  });

export const familyArchiveReferenceSchema = z.object({
  label: z.string().min(1).max(300),
  url: z
    .string()
    .min(1)
    .max(1000)
    .refine((v) => /^https?:\/\//i.test(v), {
      message: "reference url must be an http(s) URL",
    }),
  note: z.string().max(2000).optional(),
});

export const familyArchiveItemSchema = z.object({
  id: z.string().min(1).max(120),
  title: z.string().min(1).max(300),
  caption: z.string().min(1).max(8000),
  imageSrc: z.string().min(1).max(500),
  alt: z.string().min(1).max(1000),
  provenance: z.literal("Family Archive"),
  sourceLabel: z.string().min(1).max(300),
  sourceUrl: z.string().max(1000).optional(),
  dateLabel: z.string().max(80).optional(),
  verificationStatus: verificationStatusSchema,
  contextNote: z.string().max(8000).optional(),
  references: z.array(familyArchiveReferenceSchema).max(20).optional(),
});

export const familyArchiveUpsertSchema = familyArchiveItemSchema.extend({
  sourceUrl: optionalUrl,
  dateLabel: z
    .string()
    .max(80)
    .optional()
    .transform((v) => {
      const t = (v ?? "").trim();
      return t.length ? t : undefined;
    }),
  contextNote: z
    .string()
    .max(8000)
    .optional()
    .transform((v) => {
      const t = (v ?? "").trim();
      return t.length ? t : undefined;
    }),
});

export const featuredInterviewSchema = z.object({
  id: z.string().min(1).max(120),
  title: z.string().min(1).max(300),
  copy: z.string().min(1).max(4000),
  videoSrc: z.string().min(1).max(500),
  posterSrc: z.string().min(1).max(500),
  coverSrc: z.string().min(1).max(500).optional(),
  alt: z.string().min(1).max(1000),
  sourceUrl: z.string().min(1).max(1000),
  provenance: z.string().min(1).max(300),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  orientation: z.enum(["portrait", "landscape"]),
  featuredOnHome: z.boolean(),
});

const publicMediaPath = z
  .string()
  .min(1)
  .max(1000)
  .refine((v) => v.startsWith("/media/") || /^https:\/\//i.test(v), {
    message: "Path must start with /media/ or be an https URL (Vercel Blob)",
  });

export const featuredInterviewPatchSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(300).optional(),
  copy: z.string().min(1).max(4000).optional(),
  featuredOnHome: z.boolean().optional(),
  alt: z.string().min(1).max(1000).optional(),
  videoSrc: publicMediaPath.optional(),
  posterSrc: publicMediaPath.optional(),
  coverSrc: z.union([z.literal(""), publicMediaPath]).optional(),
});

export const curatorProfileSchema = z.object({
  name: z.string().min(1).max(200),
  eyebrow: z.string().min(1).max(200),
  headline: z.string().min(1).max(500),
  introduction: z.array(z.string().min(1)).min(1),
  guidingPrinciple: z.string().min(1).max(500),
  conviction: z.string().min(1).max(500),
  closingLine: z.string().min(1).max(300),
  education: z.object({
    title: z.string().min(1),
    body: z.array(z.string().min(1)).min(1),
  }),
  publicService: z.object({
    title: z.string().min(1),
    body: z.array(z.string().min(1)).min(1),
  }),
  churchService: z.object({
    title: z.string().min(1),
    intro: z.string().min(1),
    roles: z.array(z.string().min(1)).min(1),
  }),
  historyMission: z.object({
    title: z.string().min(1),
    body: z.array(z.string().min(1)).min(1),
  }),
  themes: z
    .array(
      z.object({
        title: z.string().min(1),
        copy: z.string().min(1),
      }),
    )
    .min(1),
  digitalWork: z.object({
    title: z.string().min(1),
    body: z.array(z.string().min(1)).min(1),
  }),
  legacy: z.object({
    title: z.string().min(1),
    body: z.string().min(1),
  }),
});

export const curatorProfileFileSchema = z.object({
  source: z.string().min(1),
  profile: curatorProfileSchema,
});

export const loginSchema = z.object({
  username: z.string().min(1).max(80),
  password: z.string().min(1).max(200),
});

export const purposeCardSchema = z.object({
  title: z.string().min(1).max(300),
  copy: z.string().min(1).max(4000),
});

export const timelineEntrySchema = z.object({
  year: z.string().min(1).max(40),
  title: z.string().min(1).max(300),
  copy: z.string().min(1).max(4000),
  source: z.string().min(1).max(1000),
});

export const homepageContentSchema = z.object({
  site_title: z.string().min(1).max(300),
  strapline: z.string().min(1).max(500),
  guiding_principle: z.string().min(1).max(500),
  hero: z.object({
    eyebrow: z.string().min(1).max(200),
    title: z.string().min(1).max(300),
    intro: z.string().min(1).max(8000),
    purpose: z.string().min(1).max(4000),
    portrait: z.string().min(1).max(500),
  }),
  purpose_cards: z.array(purposeCardSchema).min(1),
  connection: z.array(z.string().min(1)).min(1),
  timeline: z.array(timelineEntrySchema).min(1),
  contribution_fields: z.array(z.string().min(1)).min(1),
  page_context: z.object({
    contribute_eyebrow: z.string().min(1).max(300),
    contribute_heading: z.string().min(1).max(300),
    contribute_copy: z.string().min(1).max(2000),
    contribute_button: z.string().min(1).max(120),
    guiding_note: z.string().min(1).max(2000),
    archive_intro: z.string().min(1).max(2000),
    interviews_intro: z.string().min(1).max(2000),
    people_intro: z.string().min(1).max(2000),
    contribute_intro: z.string().min(1).max(2000),
  }),
});

export const peopleFrameSchema = z.object({
  id: z.string().min(1).max(80),
  title: z.string().min(1).max(200),
  src: publicMediaPath,
  alt: z.string().min(1).max(1000),
});

export const peopleFramesFileSchema = z.object({
  frames: z.array(peopleFrameSchema).min(1).max(6),
});

export const familyArchiveNoteSchema = z.object({
  note: z.string().min(1).max(8000),
});

export const homepageFileSchema = homepageContentSchema;

export const photoStatusSchema = z.union([
  z.literal("permission_needed"),
  z.literal("open_license"),
  z.string().min(1).max(80),
]);

export const cathedralRecordSchema = z.object({
  id: z.string().min(1).max(120),
  diocese: z.string().min(1).max(300),
  cathedral: z.string().min(1).max(300),
  city: z.string().min(1).max(300),
  address: z.string().min(1).max(500),
  verification: z.string().min(1).max(4000),
  verification_urls: z.array(z.string().max(1000)).max(20),
  photo_status: photoStatusSchema,
  photo_source_page: z.string().max(1000),
  photo_remote_url: z.string().max(1000),
  photo_author: z.string().max(300),
  photo_license: z.string().max(300),
  local_file: z.string().min(1).max(500),
  fallback_file: z.string().max(500).optional(),
  notes: z.string().max(8000),
  map_query: z.string().min(1).max(500),
  maps_search_url: z.string().min(1).max(1000),
});

export const cathedralsFileSchema = z.object({
  note: z.string().min(1).max(4000),
  items: z.array(cathedralRecordSchema).min(1).max(20),
});

const siteText = (max: number) => z.string().min(1).max(max);
const siteNavItemSchema = z.object({
  href: z.string().min(1).max(300),
  label: siteText(120),
});

export const siteSettingsSchema = z.object({
  seo: z.object({ description: siteText(2000), title_suffix: siteText(200) }),
  nav: z.object({
    primary: z.array(siteNavItemSchema).min(1).max(12),
    footer: z.array(siteNavItemSchema).min(1).max(12),
  }),
  footer: z.object({
    explore_title: siteText(200),
    about_title: siteText(200),
    about_copy: siteText(2000),
    curator_link_label: siteText(120),
  }),
  hero_ctas: z.object({
    primary_label: siteText(120),
    primary_href: siteText(300),
    secondary_label: siteText(120),
    secondary_href: siteText(300),
  }),
  home_sections: z.object({
    purpose: z.object({ eyebrow: siteText(300), heading: siteText(300) }),
    interviews: z.object({
      eyebrow: siteText(300),
      heading: siteText(300),
      view_all_label: siteText(120),
      note_heading: siteText(300),
      note_body: siteText(4000),
    }),
    churches: z.object({
      eyebrow: siteText(300),
      heading: siteText(300),
      note: siteText(2000),
      view_label: siteText(120),
      rights_note: siteText(4000),
      rights_note_strong: siteText(200),
    }),
    timeline: z.object({ eyebrow: siteText(300), heading: siteText(300) }),
    archives: z.object({
      eyebrow: siteText(300),
      heading: siteText(300),
      view_label: siteText(120),
      note_strong: siteText(300),
      note_link_label: siteText(200),
    }),
    connection: z.object({ eyebrow: siteText(300), heading: siteText(300) }),
    guiding: z.object({ eyebrow: siteText(300) }),
  }),
  pages: z.object({
    archive: z.object({ eyebrow: siteText(300), provenance_strong: siteText(300) }),
    churches: z.object({
      eyebrow: siteText(300),
      title: siteText(300),
      intro: siteText(4000),
      rights_note_strong: siteText(200),
      rights_note: siteText(4000),
      rights_note_link_label: siteText(120),
      rights_note_tail: siteText(500),
    }),
    sources: z.object({
      eyebrow: siteText(300),
      title: siteText(300),
      intro_strong: siteText(1000),
      intro_tail: siteText(1000),
      institutional_heading: siteText(300),
    }),
    about: z.object({ eyebrow: siteText(300), title: siteText(300) }),
    people: z.object({
      eyebrow: siteText(300),
      forthcoming_title: siteText(300),
      forthcoming_body: siteText(2000),
      card_eyebrow: siteText(200),
      card_note: siteText(2000),
      status_label: siteText(120),
    }),
    interviews_page: z.object({
      forthcoming_title: siteText(300),
      forthcoming_body: siteText(4000),
    }),
    contribute_notice: z.object({ strong: siteText(300), body: siteText(4000) }),
    not_found: z.object({
      eyebrow: siteText(200),
      title: siteText(300),
      intro: siteText(2000),
      home_label: siteText(120),
      archive_label: siteText(120),
      sources_label: siteText(120),
    }),
  }),
});

export const blogPostSchema = z.object({
  id: z.string().min(1).max(120),
  title: z.string().min(1).max(300),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase words joined by hyphens"),
  excerpt: z.string().min(1).max(1000),
  coverSrc: z.string().max(1000),
  coverAlt: z.string().max(1000),
  body: z.string().min(1).max(100000),
  author: z.string().min(1).max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  tags: z.array(z.string().min(1).max(60)).max(12),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
});

export const blogFileSchema = z.object({
  posts: z.array(blogPostSchema).max(500),
});
