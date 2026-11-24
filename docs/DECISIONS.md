# DECISIONS — Architecture Decision Records

Initial ADRs for History: Church of Pakistan. Status values: **Proposed** | **Accepted** | **Accepted-pending-confirm** | **Superseded**.

Grounded in package `reference/source-docs/DESIGN_SYSTEM.md`, working `docs/DESIGN_SYSTEM.md`, `src/styles/tokens.css`, and `docs/OPEN_QUESTIONS.md`.

---

## ADR-001 — Next.js App Router pinned to 16.3.5 (Node 24)

| Field | Value |
|-------|--------|
| **Status** | Accepted — app is live under `src/app/` |
| **Date** | 2026-09-17 |

### Context

The repo is a prepared heritage tree without an application scaffold. Heritage Forge / Archive QA need a fixed production target so agents do not drift across major versions.

### Decision

- Use **Next.js 16.3.5** with the **App Router**.  
- Default to **React Server Components**.  
- Run on **Node 24**.  
- Use **TypeScript strict**.

### Consequences

- Scaffolding must pin these versions in `package.json` / engines when the app is created.  
- No Pages Router as the primary architecture.  
- Until scaffold exists, commands in `AGENTS.md` remain placeholders.

---

## ADR-002 — Package DESIGN_SYSTEM palette / tokens.css over chat-mentioned hexes

| Field | Value |
|-------|--------|
| **Status** | **Accepted-pending-confirm** |
| **Date** | 2026-09-17 |

### Context

`docs/OPEN_QUESTIONS.md` records a palette conflict:

| Source | Burgundy / related |
|--------|-------------------|
| Chat brief (Heritage Forge) | `#7a2229` (also cream `#fbf7ef` in tokens comment) |
| Package `DESIGN_SYSTEM` / tokens | Burgundy `#6D2227`, Parchment `#F3E7CF`, Paper `#FBF5E9`, Deep Burgundy `#4F171B`, etc. |

Working decision in OPEN_QUESTIONS: follow the **package** system unless the user confirms otherwise. Working `docs/DESIGN_SYSTEM.md` and `src/styles/tokens.css` already implement package hexes and document the chat conflict in comments.

### Decision

- **Canonical palette** for build work: package Design #1 values as in `docs/DESIGN_SYSTEM.md` and `src/styles/tokens.css`.  
- Do **not** adopt chat hexes (`#7a2229`, `#fbf7ef`) in components.  
- **Do not treat this as final user confirmation** — status remains pending confirm per OPEN_QUESTIONS.

### Consequences

- UI work uses token variables (`--color-burgundy`, `--oxblood`, etc.), not ad-hoc chat hexes.  
- If the user confirms chat hexes instead, update OPEN_QUESTIONS, this ADR, `docs/DESIGN_SYSTEM.md`, and `tokens.css` together.  
- Agents must not “resolve” the conflict by inventing a third palette.

---

## ADR-003 — Typography: Cormorant Garamond + Source Sans 3 via next/font

| Field | Value |
|-------|--------|
| **Status** | Accepted — wired in `src/lib/fonts.ts` |
| **Date** | 2026-09-17 |

### Context

Package `DESIGN_SYSTEM.md` recommends an editorial serif + clear sans, with Georgia / system-sans as safe fallbacks. Working `docs/DESIGN_SYSTEM.md` and `tokens.css` specify production fonts for the Next build: Cormorant Garamond (display) and Source Sans 3 (body), loaded via `next/font` CSS variables (`--font-cormorant`, `--font-source-sans` → `--font-display`, `--font-body`).

### Decision

- **Display / headings:** Cormorant Garamond via `next/font`  
- **Body / UI:** Source Sans 3 via `next/font`  
- Fallbacks remain in `tokens.css` (Georgia / system-ui) until fonts are wired on `<html>`.

### Consequences

- No novelty fonts for body copy.  
- Prefer self-hosted / `next/font` loading (see package SEO/a11y notes).  
- Starter-site Georgia/system choices remain reference only; production follows this ADR.

---

## ADR-004 — Package manager: pnpm

| Field | Value |
|-------|--------|
| **Status** | Accepted — `pnpm` preferred; `npm run` uses the same scripts |
| **Date** | 2026-09-17 |

### Context

Archive QA and Heritage Forge standardize on a single install tool for reproducible installs and CI.

### Decision

Use **pnpm** exclusively (`pnpm install`, `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`).

### Consequences

- Do not introduce npm/yarn lockfiles as primary.  
- Document scripts in `AGENTS.md` once `package.json` exists.

---

## ADR-005 — No UI kit — CSS Modules + design tokens only

| Field | Value |
|-------|--------|
| **Status** | Accepted |
| **Date** | 2026-09-17 |

### Context

Design #1 Archival Heritage is a custom parchment/burgundy archival language. Package and working design docs forbid modern SaaS visuals (heavy gradients, glassmorphism, generic kit chrome). Working `docs/DESIGN_SYSTEM.md` states: CSS Modules only — no SaaS UI kits, no Tailwind/shadcn/MUI.

### Decision

- **CSS Modules** + **`src/styles/tokens.css`** only.  
- **No** shadcn/ui, MUI, Chakra, Ant Design, or similar component kits.  
- **No** Tailwind as the styling system for this project.

### Consequences

- Components consume design tokens and local module classes.  
- Import `tokens.css` once from the root layout when the app exists.  
- Visual QA is against Design #1 reference + tokens, not kit defaults.

---

## ADR-006 — Redesign: Emerald & Gilt palette, Fraunces + Inter

| Field | Value |
|-------|--------|
| **Status** | Accepted (owner, 2026-10-17) |
| **Date** | 2026-10-17 |
| **Supersedes** | ADR-002 palette (Design #1 parchment/burgundy) |

### Context

The owner asked for a modern redesign, with the layout informed by Mobbin references. From four researched palettes he chose **Emerald & Gilt**. Content, routes and functionality stay the same.

### Decision

- Palette: emerald `#0B5C47` (primary), emerald-950 `#062E25` (dark bands), gilt `#D8B65E` / gilt-ink `#86601A`, ivory `#F4F3EC`, ink `#14201B`, with oxblood `#7A2B2E` kept as a heritage accent. The full table and contrast ratios are in `docs/DESIGN_SYSTEM.md`.
- The emerald draws on liturgical green (Ordinary Time). It is not claimed to be any official Church of Pakistan colour.
- Type: Fraunces (display) + Inter (body) via `next/font`.
- ADR-005 still applies: CSS Modules + tokens only.

### Consequences

- The legacy `--color-*` variables are now aliases to the new tokens.
- The parchment textures and rule ornaments are retired from the UI. The assets stay in `public/` and `reference/` stays untouched.

---

## ADR-007 — Site-wide settings CMS (`data/cms/site.json`) + production persistence limit

| Field | Value |
|-------|--------|
| **Status** | Accepted (owner mandate, 2026-10-18) |
| **Date** | 2026-10-18 |

### Context

The curator admin already covered Homepage, Churches, Family Archives,
Featured Interviews, People frames, Curator profile and media uploads, but
global marketing/UI wording (navigation labels, footer text, SEO, hero
buttons, section headings, inner-page headers/notices, 404) was still
hard-coded in components.

### Decision

- Add `data/cms/site.json` in the established file-CMS pattern (typed
  loader `src/content/site.ts`, zod schema `siteSettingsSchema`,
  `GET|PUT /api/admin/site` behind `requireAdminApi`, atomic writes via
  `src/lib/cms/store.ts`, new **Site & Pages** admin tab).
- All covered public strings now read from CMS; no hard-coded duplicates
  remain for those areas. Confirmed-identity strings (curator name/role,
  motto) and citation registers stay code-/citation-locked on purpose.
- **Persistence:** file CMS persists on writable hosts. On Vercel the
  runtime filesystem is ephemeral, so production content changes must be
  committed to git (JSON + media) and redeployed. No external/paid store
  is introduced without a further ADR. See `docs/ADMIN.md`.

### Consequences

- Admin can reword the entire public site's marketing/UI copy without code.
- Production editors must follow the commit-and-deploy workflow above
  until/unless a persistent store is adopted.

---

## ADR-008 — Vercel-native storage: KV (documents) + Blob (media); Blog

| Field | Value |
|-------|--------|
| **Status** | Accepted (owner mandate, 2026-10-18) |
| **Date** | 2026-10-18 |
| **Supersedes** | the production-persistence limitation noted in ADR-007 (once env vars are connected) |

### Context

Owner asked for the easiest durable storage so curator edits persist on
Vercel, plus a blog. The CMS content is whole-file JSON documents; media is
binary uploads. A Blob store (`churchhistory-media`, iad1, public) was
provisioned via the Vercel MCP on 2026-10-18; KV/Blob still need a one-time
"Connect to Project" click in the dashboard to inject env vars (see
`docs/ADMIN.md` for the exact steps — no code can do that click).

### Decision

- Documents → **Vercel KV / Upstash Redis** (`@vercel/kv` is deprecated;
  the adapter speaks the Upstash REST API directly, env
  `KV_REST_API_URL`/`KV_REST_API_TOKEN`), one JSON doc per `cms:<file>` key.
  No ORM/schema migration; the JSON-document shape maps 1:1 (Postgres would
  have needed a table design for identical data). File store remains the
  local/dev fallback; first KV read seeds from `data/cms/*.json`.
- Media → **Vercel Blob** (`@vercel/blob` `put`, env `BLOB_READ_WRITE_TOKEN`)
  when configured; existing `/media/…` paths unchanged.
- Blog posts are a new CMS document (`blog.json`) through the same adapter,
  with a Blog admin tab and Markdown rendering sanitised via
  `marked` + `sanitize-html` (no raw HTML injection).
- Hero simplified (owner steer, same date): typographic hero, one short
  lead, motto verbatim, portrait only in My Connection, purpose paragraph
  moved to the Purpose intro. See `docs/CONTENT_MAP.md`.

### Consequences

- With KV+Blob connected, admin edits/blog/uploads persist across Vercel
  deploys. Without them, behaviour is exactly the previous file mode.
- Tests: file-mode save flows per tab, KV adapter against a local
  Upstash-REST mock (seed, auto-seed, save, blog), Blob upload path is
  code-reviewed only until the store is connected (no token exists yet).

---

## Related open questions (do not invent resolutions)

- **Palette** — reviewed paper/burgundy presentation supersedes ADR-006; see ADR-009.
- **Curator public display name** — confirmed as Javed Qadir Bakhsh.
- **Interviews / people** — forthcoming; no fictional records.  
- **Three cathedrals** (Faisalabad, Hyderabad, Raiwind) — `permission_needed` placeholders until rights-cleared photos exist.

## ADR-009 — Integrate the reviewed archive redesign (2026-10-25)

Owner requested merging the reviewed paper/burgundy redesign into main while retaining newer features. The new presentation supersedes ADR-006 styling; the site-wide CMS, editable hero photos, blog/RSS/sitemap, and ADR-008 KV/Blob storage remain. Cormorant Garamond and Source Sans 3 are the active fonts. Redundant alternate footage is removed from the interview listing; source media remain intact. See `merge-review/README.md` for validation and limits.

## ADR-010 — Security, accounts, media library and history (2026-11-23)

**Context.** The 2026-11 audit found:

- Next 16.3.5 had critical CVEs.
- A development password was published in the public repo.
- There was one shared env login.
- Uploads died above Vercel's 4.5 MB body limit.
- Image fields needed pasted URLs.
- There was no undo or video upload.
- The Contribute form dropped its attachments.

The owner asked to keep the existing design, layout, pages and content, and only fix, polish, and improve the admin and the photo workflow.

**Decision.**

- **Dependencies:** Next and eslint-config-next 16.4.6, React 19.3. pnpm is the only lockfile, and overrides clear the transitive advisories.
- **Accounts:** per-person accounts (admin/editor) live in the CMS store. The first admin is bootstrapped from `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH`. Plaintext passwords are not supported, sessions are checked against the store, and logins get CSRF protection and rate limits.
- **Headers:** a per-request nonce CSP in `src/proxy.ts`, plus HSTS and COOP.
- **Media library:**
  - one picker for every image field;
  - drag-and-drop, focal points and a crop-to-copy tool;
  - photos up to 30 MB and videos up to 1 GB;
  - streamed to `public/media/uploads` locally, or uploaded straight from the browser to Blob on Vercel.
- **History:** every save is recorded as a revision (40 kept, restorable), and saves use optimistic concurrency with a conflict dialog.
- **Homepage:** section order and visibility live in `data/cms/home-layout.json`.
- **Contributions:** stored in a private inbox, with private attachment storage and resizing in the browser.
- **Public site:** only modest motion (scroll reveal, a route fade, a photo lightbox, timeline refinements, all off under reduced motion) and SEO metadata. No layout or style redesign.

**Consequences.** Hosted editing needs KV and Blob, and the admin says so when they are missing. The conflict check is not atomic in KV, which is acceptable for a few family editors. Interviews and people stay placeholders, so the admin edits existing interview slots but does not add new ones (AGENTS.md rule 4). See `docs/ARCHITECTURE.md` and `docs/DEPLOYMENT.md`.

## ADR-011 — Simple owner flow for photos & videos: sections, limits, draft → publish (2026-11-23)

**Context.** The owner wants the simplest possible admin: sign in, open a section, upload, replace, delete or reorder photos and videos, then press one Publish button, with no code and no redeploy. The site runs on the free Vercel plan (1 GB Blob storage). Sanity and Firebase were considered and rejected: the existing KV/Blob store, accounts, CSRF, rate limits and History already cover it.

**Decision.**

- A new default admin page, **Photos & videos**, with four sections (homepage slideshow, Family Archive gallery, People photos, Interview videos). Every other editor moves under **More settings** and keeps saving live as before.
- Limits: 20 photos per section, 5 videos in total (all in Interview videos), 20 MB per photo, 100 MB per video. Enforced in the browser and on the server. The Family Archive gallery already held 24 records; nothing is removed, it simply cannot grow until it is under 20.
- New uploads go first (newest first). Section edits are drafts until Publish; publishing writes the live documents through `writeDoc()` (revisions and History kept) and frees the storage of uploads that are no longer used.
- Videos and photos the curator uploads are his own records (AGENTS.md rules 3–4: nothing is invented). New archive photos are labelled "Added by the curator" and "Needs verification" until the curator adds a source under Archive captions & sources.
- The duplicate hero-photo editor on the homepage text page was removed; the hero slideshow shows a "3 / 20" stepper instead of dots when it has more than six photos, and only loads the current photo and its neighbours.

**Consequences.** One clear owner path with one Publish button. Restoring a very old History version can point at an upload that was deleted after it was taken off the site; the photo would then need re-uploading. See `docs/ADMIN.md` and `docs/ARCHITECTURE.md`.

## ADR-012 — Keep the owner's admin plain (2026-11-24)

**Context.** The owner is about 70 and not technical. A review found setup warnings filling the first phone screen, eleven developer pages one tap away, jargon ("draft", "discard", "alt text"), and a save that could silently fail on a weak connection.

**Decision.** No new features. The admin opens on **Photos & videos**, with **Stories** and **My account** beside it; every other editor sits behind one collapsed **Advanced settings (for Oscar)** button at the bottom, which also lists setup notes (test mode, missing settings) instead of banners at the top. Plain wording ("Saved (not on the website yet)", "Throw away my changes", "Describe the picture"). Success messages stay 10 seconds; upload problems scroll into view. A section save that fails for lack of connection is kept and sent again when the browser is back online (and every 10 seconds); the page warns before closing while a save is pending; Publish refuses while a change is unsaved. The Family Archive gallery limit is 30 (`MAX_ARCHIVE_PHOTOS`), so its 24 existing photos fit.

**Consequences.** Same storage, same routes, same History. Oscar reaches everything as before, one button further down.
