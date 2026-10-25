# Content Map — every public string/image → CMS field → storage

Generated for the Oct 2026 storage/blog mandate. Verified automatically by
`scripts/content-map-check.mjs` (crawls all routes, asserts CMS values render)
and by per-tab admin save-flow tests (change → public reflects → restore).

**Storage key** = `data/cms/<file>` in file mode, or `cms:<file>` in Vercel KV
(Upstash Redis) when `KV_REST_API_URL` + `KV_REST_API_TOKEN` are set (ADR-008).
Images: `/media/…` paths (repo `public/media/`) or Vercel Blob URLs when
`BLOB_READ_WRITE_TOKEN` is set. Existing `/media/…` paths never change.

## Global chrome (every page)

| Renders | Component | Edited in admin | Stored |
|---|---|---|---|
| Site title, strapline/motto (verbatim) | `src/app/layout.tsx`, Header/Footer | Home tab (`site_title`, `strapline`) | `homepage.json` |
| SEO description, title suffix | `layout.tsx generateMetadata` | Site & Pages → SEO | `site.json` `seo` |
| Header nav labels/links | `Header.tsx` | Site & Pages → Navigation (add/remove) | `site.json` `nav.primary` (includes Blog) |
| Footer nav, column titles, about copy, curator-login label | `Footer.tsx` | Site & Pages → Footer/Navigation | `site.json` `nav.footer`, `footer` |
| Curator name/role line | `src/content/nav.ts` constants | **Not editable by design** (AGENTS.md: never rename curator) | code-locked |
| 404 eyebrow/title/intro/link labels | `src/app/not-found.tsx` | Site & Pages → 404 | `site.json` `pages.not_found` |

## Home `/`

| Section | Renders (component) | Edited | Stored |
|---|---|---|---|
| Hero eyebrow, title, short lead (~40 words), motto | `home/Hero.tsx` | Home tab | `homepage.json` `hero`, `strapline` |
| Hero buttons | `home/Hero.tsx` | Site & Pages → Hero buttons | `site.json` `hero_ctas` |
| Hero photo band (rotating, per-photo focal position) | `home/Hero.tsx` + `home/HeroBand.tsx` | Home tab → Hero photo band (`src`/`alt`/`position`) | `homepage.json` `hero.band_images` (existing published photos only) |
| Hero purpose paragraph → Purpose intro | `home/Purpose.tsx` | Home tab (`hero.purpose`) | `homepage.json` `hero.purpose` |
| Purpose heading/cards | `home/Purpose.tsx` | Site & Pages (heading) + Home tab (cards) | `site.json`, `homepage.json` `purpose_cards` |
| Featured Interviews | `home/Interviews.tsx` | Featured Interviews tab + Site & Pages headings | `featured-interviews.json`, `site.json` |
| Churches preview | `home/Churches.tsx` | Churches tab + Site & Pages | `cathedrals.json`, `site.json` |
| Timeline | `home/Timeline.tsx` | Home tab | `homepage.json` `timeline` |
| Family Archives preview | `home/FamilyArchives.tsx` | Family Archives tab + Site & Pages | `family-archives.json`, `site.json` |
| My Connection (incl. portrait — hero portrait field reused here) | `home/MyConnection.tsx` | Home tab (`hero.portrait`, `connection`) + Curator profile | `homepage.json`, `curator-profile.json` |
| Contribute panel | `home/ContributeCta.tsx` | Home tab `page_context.contribute_*` | `homepage.json` |
| Guiding Principle quote/note | `home/GuidingPrinciple.tsx` | Home tab (`guiding_principle`, `guiding_note`) | `homepage.json` |

## Inner pages

| Route | Main content renders from | Admin tab | Stored |
|---|---|---|---|
| `/about` | homepage intro + curator profile + site about header | Home / Curator profile / Site & Pages | `homepage.json`, `curator-profile.json`, `site.json` |
| `/archive` | family archive items + note, archive intro | Family Archives (+ Site & Pages eyebrow) | `family-archives.json`, `homepage.json`, `site.json` |
| `/interviews` | interview items (incl. per-cover mobile focal `coverPosition`), intros, forthcoming panel | Featured Interviews / Site & Pages | `featured-interviews.json`, `homepage.json`, `site.json` |
| `/churches` | cathedral records (name/address/verification/photos/rights) | Churches (+ Site & Pages header/rights) | `cathedrals.json`, `site.json` |
| `/people` | people stills + forthcoming copy | People / Site & Pages | `people-frames.json`, `site.json` |
| `/contribute` | form labels = `contribution_fields`, intro, intake notice | Home / Site & Pages | `homepage.json`, `site.json` |
| `/sources` | source register (`src/content/sources.ts`) + institutional heading | **Register code-locked** (citation-backed; edit via code review so links stay checkable); heading in Site & Pages | `site.json` (heading only) |
| `/blog` + `/blog/[slug]` | posts (title/slug/excerpt/cover/Markdown body/author/date/tags/status/featured) | **Blog tab** | `blog.json` → KV `cms:blog.json` |
| `/blog/rss.xml`, `/sitemap.xml` | generated from published posts + static routes | automatic | — |

## Gaps found & fixed in this pass

1. **Blog did not exist** → built `/blog`, `/blog/[slug]`, Blog admin tab, RSS, sitemap entries.
2. **Hero rendered two stacked paragraphs + portrait** → clean typographic hero; purpose paragraph moved to Purpose intro; portrait only in My Connection (field retained).
3. **Uploads always wrote to local disk** → Blob when `BLOB_READ_WRITE_TOKEN` exists; media schemas now accept `https://` Blob URLs as well as `/media/…`.
4. **No sitemap** → `src/app/sitemap.ts` added (static routes + published posts).

## Explicitly unmapped (with reason)

- Curator name/role/motto wording — identity-locked per AGENTS.md, never free-text.
- Sources register entries & cathedral verification fields — citation-locked so credits/links remain auditable (edited via their admin tabs where already supported / code for the register).
- Contribute form field *names/types* — fixed form contract; the *labels* are CMS (`contribution_fields`).

## Reviewed redesign integration — 2026-10-25

The hero now uses the reviewed split layout with CMS `hero.purpose`, `hero_ctas`, and editable `band_images`; if no band photos are configured, it falls back to the first family archive record. `hero.intro` appears in Purpose. Site settings still supply navigation, footer, section headings and secondary-page copy. Contribution fields appear only when intake is configured; otherwise the CMS availability notice is shown.
