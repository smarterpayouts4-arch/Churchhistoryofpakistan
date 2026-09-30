# CURSOR_ONBOARDING_FINISH.md — History: Church of Pakistan

**Date:** 2026-09-29 (America/New_York, ET)  
**Audience:** Cursor / coding agents finishing this site cold — no prior chat context  
**Repo (box):** `/workspace/heritage-forge/history-church-of-pakistan`  
**Repo (user PC):** `C:\Users\ofran\hcop-site\history-church-of-pakistan`  
**machineId (PC sync):** `23bed386-aaba-4242-b717-d79dee604af5`  
**Local preview:** `http://127.0.0.1:4000/`  

This is the **master finish-the-project briefing**. It consolidates system architecture, Design #1 / provenance rules, and the ordered finish checklist. Audits through **2026-09-23** remain the status baseline; this document dates the handoff for agents starting **2026-09-29**.

**No secrets.** Never paste passwords, bcrypt hashes, session secrets, or webhook keys into this file, commits, or chat. Env names only — see `.env.example` and `docs/ADMIN.md`.

---

## 1. Start here

### What this project is

**History: Church of Pakistan** is a living digital heritage archive: family photographs, diocesan churches, sourced milestones, youth-program interviews, and curator connection — presented as an archival album / museum label, not a corporate church template.

| Field | Value |
|-------|--------|
| **Curator / founder** | **Javed Qadir Bakhsh** (confirmed public display name) |
| **Mission (one sentence)** | Preserve the heritage and living memories of the Church of Pakistan for coming generations — source-backed, rights-cleared, Design #1 Archival Heritage. |
| **Strapline** | Preserving History • Honouring Our Forefathers • Inspiring Future Generations |
| **Guiding principle** | “Preserve History for the Coming Generation.” |
| **Stack** | Next.js 16.3.5 App Router · React 19 · TypeScript strict · pnpm 9.15.9 · Node ≥20 · CSS Modules + design tokens |

### Not abandoning

The site is **substantially built** (~82/100 Design #1 closeness; public routes and CMS live; security code hardening shipped). Remaining work is **finish and launch readiness**: three church photo rights, legal/privacy + contribute webhook, production env hardening, QA re-gate, and a few craft/P2 polish items. Local curator preview is a **conditional GO**; public production remains **NO-GO** until Phases 3–6 clear and Phase 7 is green.

### How to use this document

1. Read **§2 Hard rules** and **§9 Do-not / traps** before touching content or media.  
2. Skim **§3 North Star** and **§4 System map** so you know where truth lives and how to run.  
3. Check **§6 Current status**, then execute **§7 Finish plan** in phase order.  
4. Prove each phase with **§8 Verification**.  
5. Before any public host: **§11 Handoff to production**.  

Sibling detail (if needed): `docs/_onboard_parts/01_ARCHITECTURE.md`, `02_DESIGN_AND_CONTENT.md`, `03_FINISH_CHECKLIST.md`. Prefer this master doc for end-to-end work.

Also read at session start: `AGENTS.md`, `README.md`, `docs/OPEN_QUESTIONS.md`, `docs/ADMIN.md`.

> **Note:** `docs/AI_CONTEXT.md` still describes a pre-scaffold tree in places. Prefer this file, `AGENTS.md`, and `docs/_onboard_parts/01_ARCHITECTURE.md` for live stack/routes. Live typed content is under `src/content/`; root `content/` drafts are stale — do not wire new code there.

---

## 2. Hard rules

Every change must obey these. Violations are release blockers.

1. **Never invent history** — no invented names, dates, biographies, offices, quotations, interviewees, cathedral photo identities, licenses, or “sample” archive items presented as real.  
2. **Family Archive `caption` = Facebook inventory verbatim** (`reference/facebook-page/INVENTORY.md`). Do not paraphrase orthography or honorifics. Editorial / press context belongs only in `contextNote` / `references` (Public Record), never by rewriting `caption`.  
3. **Church photos = rights-cleared only.** Five open-license Wikimedia exteriors may publish. Faisalabad, Hyderabad, Raiwind stay labeled SVG placeholders until written permission or verified open license is recorded. No Getty/editorial scrapes; no wrong-city substitutes.  
4. **Design #1 only** — Archival Heritage palette/type/section order. Mock names, fake churches, and mood-only timeline years are **forbidden as content**.  
5. **CSS Modules + `src/styles/tokens.css` only** — no Tailwind, shadcn, MUI, Lucide, Heroicons, or other SaaS UI kits.  
6. **No secrets in repo / docs / chat** — never commit `.env.local`; prefer env vars documented in `.env.example`.  
7. **Do not modify `reference/` originals.** Do not wire new code to stale root `content/` drafts.  
8. **Do not auto-publish contributed uploads** without moderation.  
9. **Do not enable `ADMIN_OPEN_PREVIEW=true` on any public host.**  
10. **Controversies = sourced allegations only** — never invent bishop scandals; never treat newspaper allegations as court findings (`docs/BISHOP_CONTROVERSY_NOTES.md`).

---

## 3. Inspiration / North Star

### Design #1 — Archival Heritage

| Item | Path / value |
|------|----------------|
| Primary illustration | `reference/design-reference/design-01-archival-heritage-fullpage.png` (+ `.jpg`, `five-concept-board.png`) |
| Feeling (five words) | archival · dignified · warm · documentary · trustworthy |
| Working tokens | `docs/DESIGN_SYSTEM.md`, `reference/design/DESIGN_SYSTEM.md`, `src/styles/tokens.css` |
| Master prompt | `reference/source-docs/GROKBOT_MASTER_PROMPT.md` |
| Facebook page | https://www.facebook.com/p/History-Church-of-Pakistan-61557748274698/ |
| Closeness | **~82 / 100** (`docs/TRIPLE_CHECK_DESIGN_ICONS_2026-09-23.md`) |

### Palette (locked — package tokens)

| Token | Hex | Use |
|-------|-----|-----|
| Parchment | `#F3E7CF` | Page background |
| Paper | `#FBF5E9` | Cards, elevated surfaces |
| Burgundy | `#6D2227` | Primary CTA, accents |
| Deep burgundy | `#4F171B` | Footer, hover, strong bands |
| Ink | `#292522` | Body text |
| Muted brown | `#6E6255` | Secondary / meta text |
| Antique gold | `#AF8B58` | Fine accent (rules, icons) |
| Border | `#CDBB9C` | Rules, frames |

Chat-brief hexes (`#7a2229`, `#fbf7ef`) are **superseded** unless the curator explicitly confirms otherwise (ADR-002 / `OPEN_QUESTIONS.md`). Do not invent a third palette.

### Typography

- **Display / headings:** Cormorant Garamond (`next/font` → `--font-cormorant` / display)  
- **Body / UI:** Source Sans 3 (`next/font` → `--font-source-sans` / body)  
- Self-hosted via `next/font` — no runtime `fonts.googleapis.com`

### Homepage section order (locked)

1. Slim masthead + navigation  
2. **Hero** — curator portrait, title, strapline, dual CTAs, guiding pull-quote  
3. **Our Purpose** — four archival cards  
4. **Featured Interviews**  
5. **Churches & Places** — all **eight** diocesan cathedrals/centres  
6. **A Journey Through Time** — sourced milestones only (package years: **1852 / 1887 / 1970 / 1980 / 2011**)  
7. **From the Family Archives**  
8. **My Connection to the Church**  
9. **Share Your Memories** CTA (full-width deep burgundy band)  
10. Guiding principle  
11. Source / photograph credit area (as applicable)  
12. Footer (deep burgundy)

### What already matches Design #1 (~82/100)

- Palette, type, section order, Purpose language  
- Purpose pictorial icons on parchment pads + connection medallion (not ✓ emoji chrome)  
- Featured Interviews **click-to-play** with uniform Facebook **4:5** covers (not mock 9:16)  
- Contribute burgundy band; sticky `scroll-margin-top`; Public Record readability pass  

### Remaining visual gaps (assets / craft — not inventable)

- Three church **permission_needed** placeholders (Faisalabad, Hyderabad, Raiwind)  
- Hero botanical flourish / softer portrait cutout density  
- Optional Family Archives sepia-strip mood via curator ordering of real FB holdings  
- `/people` empty-state craft while forthcoming  

### Mock vs live — mood only, never facts

| Mock element | Live rule |
|--------------|-----------|
| Fake interviewees | Use real youth Reels or “coming soon” |
| Wrong cathedral names/cities | Eight package dioceses from `data/cms/cathedrals.json` |
| Timeline 1818 / 1849 / 1947 / 2000+ | Keep **1852 / 1887 / 1970 / 1980 / 2011** |
| Search / social chrome | Omit until real accounts exist |

### Content model (locked)

| Collection | Rule |
|------------|------|
| **Family Archives** | FB harvest stills; verbatim captions; provenance badge **Family Archive** |
| **Featured Interviews** | Youth / motivational Reels only; click-to-play 4:5; never Design #1 mock cast |
| **Churches** | Rights-cleared photos only; 5 Wikimedia + 3 labeled placeholders |
| **Timeline** | Sourced milestones only |
| **People** | Forthcoming until real records — honest empty density |

### Open-license cathedral photos (publishable)

| Diocese | Cathedral | License |
|---------|-----------|---------|
| Karachi | Holy Trinity Cathedral | PD-self (Calan) |
| Lahore | Cathedral Church of the Resurrection | CC BY-SA 4.0 |
| Multan | Cathedral of St. Mary the Virgin | CC BY-SA 4.0 |
| Peshawar | St. John's Cathedral | CC BY-SA 4.0 |
| Sialkot | Holy Trinity Cathedral Church | CC BY-SA 3.0 |

### Placeholders until cleared

- **Faisalabad** — St. John's Cathedral, Gojra  
- **Hyderabad** — St. Thomas Cathedral  
- **Raiwind** — Central Cathedral of Praying Hands  

### Curator identity

| Field | Value |
|-------|--------|
| Display name | **Javed Qadir Bakhsh** |
| Role | Project curator / founder of the archive and Facebook page |
| Father (connection copy) | **Rt. Rev. Bishop Johnston Safdar Qadir Bakhsh** — Bishop and Moderator of the Church of Pakistan |
| Portrait | `public/media/founder/…` only; source screenshot stays reference-only |

Connection bullets are **curator-provided** project voice (CMS), not uncited institutional citations. Profile materials: `reference/curator/javed-qadir-bakhsh-profile.*`. Do not invent additional offices or dates.

---

## 4. System map

### Stack (as on disk)

| Layer | Value |
|-------|--------|
| Package | `history-church-of-pakistan` `0.1.0` private |
| Framework | Next.js **16.3.5** App Router (`src/app/`) |
| React | ^19.0.0 |
| TypeScript | ^5.7.0, `strict: true` |
| Node / pnpm | `>=20` / **pnpm 9.15.9** |
| Runtime deps | `zod`, `jose` (JWT), `bcryptjs`, `image-size` |
| Styles | `src/styles/globals.css`, `tokens.css`, CSS Modules under app/components |
| Path alias | `@/*` → `./src/*` |

### Run locally

```bash
cd /workspace/heritage-forge/history-church-of-pakistan   # or PC mirror path
pnpm install
# Copy .env.example → .env.local; set local admin per docs/ADMIN.md (never commit)
# Trusted local only: ADMIN_OPEN_PREVIEW=true
pnpm dev          # http://127.0.0.1:4000
pnpm typecheck && pnpm lint:eslint
pnpm audit:site   # all public routes HTTP 200
pnpm build && pnpm start
```

Prefer **pnpm** (lockfile-pinned). Port is always **4000**.

### Public routes

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/app/page.tsx` | Homepage sections (Hero → GuidingPrinciple) |
| `/about` | `src/app/about/page.tsx` | Project about + curator profile (`#profile`) |
| `/archive` | `src/app/archive/page.tsx` | Full Family Archive grid + provenance |
| `/interviews` | `src/app/interviews/page.tsx` | Featured youth videos + oral-history forthcoming |
| `/churches` | `src/app/churches/page.tsx` | Eight diocesan cathedral records |
| `/people` | `src/app/people/page.tsx` | Thematic stills; bios forthcoming |
| `/contribute` | `src/app/contribute/page.tsx` | Intake form; honest “not configured” if webhook unset |
| `/sources` | `src/app/sources/page.tsx` | Institutional sources + photo credits |

**Primary nav:** Home, About, Archive, Interviews, Churches, People, Contribute (`src/content/nav.ts`).  
**Footer** adds **Sources**. Timeline is homepage-only, not a top-level route.

### Admin routes

| Route | Purpose |
|-------|---------|
| `/admin/login` | Curator Sign in; optional local preview CTA |
| `/admin` | Protected dashboard (`requireAdminPage`); `force-dynamic` |
| `/admin/inspect` | Read-only media inspect board |

### Admin API (summary)

| Methods | Route | Role |
|---------|-------|------|
| POST | `/api/admin/login` | Username/password → HttpOnly session |
| POST | `/api/admin/login/preview` | Local one-click preview (double-guarded) |
| POST | `/api/admin/logout` | Clear cookie (idempotent) |
| GET/PUT | `/api/admin/homepage` | `homepage.json` |
| GET/PUT | `/api/admin/cathedrals` | `cathedrals.json` |
| GET/POST | `/api/admin/family-archives` | List / create FA |
| PUT/DELETE | `/api/admin/family-archives/[id]` | Update / delete |
| GET | `/api/admin/featured-interviews` | List |
| PUT | `/api/admin/featured-interviews/[id]` | Patch metadata |
| GET/PUT | `/api/admin/curator-profile` | Profile JSON |
| POST | `/api/admin/upload` | Multipart image (≤8 MB; JPEG/PNG/WebP/GIF) |
| GET | `/api/admin/media-inspect` | Inventory + crop risk |

**No `middleware.ts`.** Auth is enforced in Server Components / Route Handlers (`requireAdmin` / `requireAdminPage` / `requireAdminApi`). Do not move auth solely to middleware (CVE-2025-29927 class risk).

### CMS files (`data/cms/`)

| File | Live counts (inventory) |
|------|-------------------------|
| `homepage.json` | 1 document |
| `cathedrals.json` | **8** dioceses |
| `family-archives.json` | **24** items |
| `featured-interviews.json` | **4** youth programs |
| `curator-profile.json` | 1 profile |

- Types: `src/lib/cms/types.ts` · Zod: `src/lib/cms/schemas.ts` · Store: `src/lib/cms/store.ts` (atomic write + `unstable_noStore`)  
- Public loaders: `src/content/{homepage,cathedrals,family-archives,featured-interviews,curator-profile,nav,sources,interviews}.ts`  
- **Factual authority:** `reference/source-data/` · **Live editable:** `data/cms/`  
- After saves, handlers `revalidatePath` the affected public routes  

Admin tabs (`AdminDashboard`): `home` | `churches` | `archives` | `interviews` | `media` | `profile`.

### Upload destinations

| `destination` | Dir | URL prefix |
|---------------|-----|------------|
| `uploads` (default) | `public/media/uploads` | `/media/uploads/…` |
| `facebook` | `public/media/archive/facebook` | `/media/archive/facebook/…` |
| `cathedrals` | `public/media/cathedrals` | `/media/cathedrals/…` |

### Media tree (`public/media/`)

| Directory | Role |
|-----------|------|
| `brand/` | Brand mark, favicon SVG |
| `founder/` | Approved curator portrait composites |
| `cathedrals/` | Publishable JPGs + `placeholders/` SVGs |
| `textures/` | Paper grain, parchment wash, rule ornament |
| `icons/` | Purpose / connection pictorial SVGs |
| `interviews/` | Non-archive interview stills |
| `archive/facebook/` | Family Archive harvest stills |
| `archive/interviews/youth/` | Youth program mp4 + posters/covers |
| `uploads/` | Admin upload target |

Immutable originals stay under `reference/`. Never publish design-reference assets as site media.

### Auth (no secrets)

| Topic | Behavior |
|-------|----------|
| Cookie | `hcop_admin_session` · JWT HS256 via `jose` · role `curator` · TTL 12h · HttpOnly · SameSite=Lax · Secure in production |
| Password | Prefer `ADMIN_PASSWORD_HASH` (bcrypt); else timing-safe `ADMIN_PASSWORD` |
| Preview | Allowed only when `NODE_ENV !== "production"` **and** `ADMIN_OPEN_PREVIEW === "true"` (exact string) |
| Rate limits | Login 8/15min; Preview 20/15min; fail closed → 429 |
| Headers | X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, CSP (see `docs/SECURITY_HARDENING_2026-09-23.md`) |

Env **names** (from `.env.example` only): `NEXT_PUBLIC_SITE_URL`, `CONTRIBUTE_WEBHOOK_URL`, `CONTRIBUTE_API_KEY`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, `ADMIN_OPEN_PREVIEW`.

### Source control note

This box tree historically has **no `.git`**. Collaboration has been **box ↔ user PC sync**. Do not assume GitHub / Origin MCP until a repo is created (Phase 8.1).

---

## 5. What the website does

### Public pages

| Route | Behavior |
|-------|----------|
| **`/`** | Composes Hero, Purpose, Interviews (home featured), ChurchesPreview, Timeline, FamilyArchives (preview), MyConnection, ContributeCta, GuidingPrinciple from CMS + content loaders. |
| **`/about`** | Project about + curator profile (`#profile`) from homepage CMS + `curator-profile.json`. Connection claims framed as curator-provided. |
| **`/archive`** | Full Family Archive grid. `ArchivePublicRecord` shows `contextNote` / `references` only when present — never invents copy. Captions are FB-verbatim. |
| **`/interviews`** | Featured youth-program videos (click-to-play 4:5) + honest “oral-history forthcoming” notice. No mock interviewee names. |
| **`/churches`** | Eight diocesan records: addresses, verification status, photo rights. Five JPGs + three labeled SVG placeholders. |
| **`/people`** | Thematic stills; biographies explicitly forthcoming. |
| **`/contribute`** | Contribution intake. If `CONTRIBUTE_WEBHOOK_URL` unset → clear “not configured”; nothing stored. Never fake success. Server action: `src/app/contribute/actions.ts`. |
| **`/sources`** | Institutional sources register + open-license photo credits (`src/content/sources.ts`, not CMS JSON today). |

### Home section components (`src/components/home/`)

| Component | Data |
|-----------|------|
| `Hero` | `loadHomepage()` + curator name; portrait via `MediaImage` |
| `Purpose` | homepage `purpose_cards` + pictorial icons |
| `Interviews` | `loadHomeFeaturedInterviews()` + `InterviewPlayCard` |
| `ChurchesPreview` | subset of `loadCathedralItems()` |
| `Timeline` | homepage `timeline` |
| `FamilyArchives` | home preview (first N) + note |
| `MyConnection` | homepage `connection` |
| `ContributeCta` | CTA → `/contribute` |
| `GuidingPrinciple` | homepage guiding principle |

Shared: `InterviewPlayCard` (client, 4:5 cover → video on activate), `MediaImage`, `ArchivePublicRecord`, `Forthcoming`.

### Admin behavior

| Surface | Behavior |
|---------|----------|
| Login | Password form; optional “Enter as curator (local preview)” when server allows preview |
| Dashboard | Tabs edit CMS JSON; saves validate with Zod and `revalidatePath` |
| Media upload | Crop widget optional; destinations uploads / facebook / cathedrals |
| Inspect | Read-only board of CMS-referenced media + crop risk |
| Logout | Clears session cookie |

Operator walkthrough: `docs/ADMIN.md`.

---

## 6. Current status

**Authority date for audits:** 2026-09-23 · **This briefing:** 2026-09-29  

**Verdict:** Local curator preview = **conditional GO**. Public production = **NO-GO** until Phases 3–6 blockers and Phase 7 QA clear.

### Done (do not regress)

- Public routes `/`, `/about`, `/archive`, `/interviews`, `/churches`, `/people`, `/contribute`, `/sources` → HTTP 200  
- Admin gate: unauthenticated `/admin` → login; mutating APIs → 401  
- CMS media paths: **0 missing** referenced files (2026-09-23)  
- Family Archive captions restored verbatim (triple-check content)  
- Homepage connection framed as curator-provided; Sources curator name = **Javed Qadir Bakhsh**  
- Bashir Jewan press framing = sourced allegations only  
- Purpose icons + connection medallion; Interviews click-to-play 4:5; sticky scroll-margin; Public Record type scale  
- Five open-license cathedral JPGs live; three honest SVG placeholders  
- Security **code** hardening: preview double-guard, rate limits, headers, CSP, Secure cookies in production (`docs/SECURITY_HARDENING_2026-09-23.md`)  
- Churches CMS + curator profile JSON editors shipped  

### Remaining (actionable)

| Area | Status |
|------|--------|
| Strapline glyph / “generation(s)” micro-consistency | **TODO** (P2) |
| FA curation product decisions (Jewan home, orphans, per-photo URLs) | **Blocked on curator** |
| Hero botanical / softer cutout | **TODO** (craft) |
| Church card `contain` vs `cover` framing | **Partial** / product call |
| Paper grain / residual ✓ DOM cleanup | **Partial** |
| `/people` empty-state density | **TODO** (no invented bios) |
| Palette ADR-002 confirmation | **Blocked on curator** |
| Three church photo rights acquisition | **Blocked on curator** |
| Lahore diocese URL (`copldc.org` unreachable) | **Blocked on curator** |
| Re-check institutional links before launch | **Partial** |
| Optional: Dawn/press on `/sources`; Sources CMS; nav discoverability | **TODO** (P2) |
| Legal + privacy pages | **TODO** |
| `CONTRIBUTE_WEBHOOK_URL` configure + test | **TODO** |
| Production env: preview off, hash, session secret, HTTPS, NODE_ENV | **Deploy TODO** |
| Full QA matrix re-run | **Partial** — re-gate before launch |
| Git remote; Draft/Live CMS; People bios; admin polish; quarantine unused media | **Phase 8** optional / blocked |

### Phase roll-up

| Phase | Theme | Overall |
|------:|-------|---------|
| 0 | Orient & run local | **Partial** (re-run per machine) |
| 1 | Provenance / captions | **Mostly Done** (P2 + curator curation left) |
| 2 | Design #1 parity | **Partial** (~82%; hero/churches/people gaps) |
| 3 | Church photo rights | **Blocked on curator** |
| 4 | Sources / Lahore URL | **Blocked on curator** (+ P2) |
| 5 | Legal + webhook | **TODO** |
| 6 | Production security | **Code Done / deploy TODO** |
| 7 | QA matrix | **Partial** (re-gate before launch) |
| 8 | Optional CMS/git/people | **TODO / Blocked** |

---

## 7. Finish plan (phases 0–8)

Execute in order unless an item is optional or blocked on curator. Status vocabulary: **Done** | **Partial** | **Blocked on curator** | **TODO**.

### Phase 0 — Orient & run local

#### 0.1 Read agent rules and open questions — **TODO** every new session

- **Files:** `AGENTS.md`, `README.md`, `docs/OPEN_QUESTIONS.md`, `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`, `docs/ADMIN.md`  
- **Verify:** Restate curator **Javed Qadir Bakhsh**; eight dioceses; three permission-needed placeholders; no invented bios; package palette tokens.  
- **Do-not:** Invent a third palette; treat Design #1 mock copy as facts.

#### 0.2 Install and start local preview — **Partial**

```bash
pnpm install
# .env.example → .env.local (gitignored); local admin per docs/ADMIN.md
pnpm dev          # http://127.0.0.1:4000
pnpm typecheck && pnpm lint:eslint
pnpm audit:site
```

- **Do-not:** Commit `.env.local`; enable preview on public hosts; paste passwords into docs.

#### 0.3 Confirm public routes + admin gate — **Done** (re-run after changes)

- `pnpm audit:site`; unauthenticated `/admin` → login; unauthenticated mutating `/api/admin/*` → 401.  
- **Do-not:** Weaken `requireAdmin*` to “fix” redirects.

#### 0.4 Confirm CMS media paths resolve — **Done**

- Sign in → `/admin/inspect`; or cross-check CMS paths vs `public/`.  
- **Do-not:** Substitute wrong-city cathedral photos.

---

### Phase 1 — Provenance / content fidelity

#### 1.1 Verbatim Family Archive captions — **Done** (2026-09-23)

- IDs restored: `fb-bashir-jewan-hyderabad-1980`, `fb-mrs-samuel-pervaiz`, `fb-bishops-couple`, `fb-sewak-bm-augustine`  
- **Verify:** Diff captions vs `reference/facebook-page/INVENTORY.md`; spot-check `/archive` caption vs Public Record separation.  
- **Do-not:** Paraphrase again; put Dawn language into `caption`.

#### 1.2 Soften / attribute homepage connection — **Done**

- Curator-provided framing on Home “My Connection” and About.  
- **Do-not:** Invent independent citations; delete PDF-sourced biography.

#### 1.3 Curator display name on Sources — **Done**

- Grep: no “pending confirmation”; `/sources`, `/about`, footer show **Javed Qadir Bakhsh**.

#### 1.4 Bashir Jewan press framing — **Done** (re-verify after FA edits)

- Only Jewan items carry controversy `contextNote`; Dawn + Wikipedia refs; allegation language.  
- **Do-not:** Add controversy blocks to other bishops.

#### 1.5 Strapline / guiding-principle micro-consistency — **TODO** (P2)

- Align `·` vs `•` and “generation” vs “generations” across `data/cms/homepage.json`, `src/lib/site.ts`, Footer, layout, curator-profile.  
- **Do-not:** Treat glyph mismatch as mojibake and rewrite unrelated UTF-8.

#### 1.6 Optional FA curation — **Blocked on curator**

- Jewan homepage vs archive-only; orphan FB stills; per-photo `sourceUrl`. Record decisions in `DECISIONS.md` / `OPEN_QUESTIONS.md`.  
- **Do-not:** Add harvest orphans without inventory captions.

---

### Phase 2 — Design parity vs Design #1

#### 2.1 Purpose icons + connection medallion — **Done**

- SVGs under `public/media/icons/`; CSS medallion replaces ✓ chrome.  
- **Do-not:** Add Lucide/Heroicons/Tailwind kits.

#### 2.2 Featured Interviews click-to-play + 4:5 — **Done**

- Equal-height cards; no `max-height: 520px` fight; play disc = parchment + gold stroke + burgundy triangle.  
- **Do-not:** Mock interviewee names; regress to locked 9:16 letterboxing.

#### 2.3 Sticky header scroll-margin + Public Record readability — **Done**

- `scroll-margin-top` on section/h2 anchors; Public Record type scale usable on parchment.  
- **Do-not:** Remove provenance chips for density.

#### 2.4 Hero botanical flourish / softer portrait cutout — **TODO**

- Compare to Design #1 fullpage; soft-fade portrait into parchment (`AGENTS.md`).  
- **Files:** `src/components/home/`, `public/media/founder/*`, textures, `Home.module.css`  
- **Do-not:** Publish `reference/founder/founder-source-screenshot.jpeg`; rename curator from portrait; invent botanical “historical symbolism” copy.

#### 2.5 Church card framing (`contain` letterboxing) — **Partial**

- Decide with curator: keep honest **contain** vs curated **cover** crops for open-license JPGs only. Placeholders stay labeled.  
- **Do-not:** Stock-replace permission-needed seats; crop BY-SA without noting adaptation + attribution.

#### 2.6 Paper grain / section air / optional DOM cleanup — **Partial**

- Textures present; optional replace residual ✓ text nodes with empty spans if CSS paints medallion.  
- **Do-not:** Heavy SaaS gradients/glassmorphism; ignore `prefers-reduced-motion`.

#### 2.7 `/people` visual density while forthcoming — **TODO**

- Layout/illustration polish only; page still says forthcoming.  
- **Do-not:** Invent people records (see 8.3).

#### 2.8 Palette confirmation (ADR-002) — **Blocked on curator**

- Keep package tokens until confirmed. If switching: update OPEN_QUESTIONS + ADR + tokens + DESIGN_SYSTEM together.  
- **Do-not:** Invent a third palette.

---

### Phase 3 — Churches rights acquisition

**Gap seats:** Faisalabad — St. John’s, Gojra · Hyderabad — St. Thomas · Raiwind — Central Cathedral of Praying Hands.

#### 3.1 Keep three SVG placeholders — **Done** (replace = **Blocked on curator**)

- `public/media/cathedrals/placeholders/{faisalabad-st-john,hyderabad-st-thomas,raiwind-praying-hands}.svg`  
- CMS `photo_status: permission_needed`  
- **Do-not:** Getty/iStock; St Francis Xavier (Catholic) Hyderabad; India St Thomas lookalikes; Dürer “Praying Hands”; diocese-site scrapes without written reuse grant.

#### 3.2 Draft / send permission requests — **Blocked on curator**

- Agent may **draft**; curator sends (irreversible email needs explicit user approval of recipients + body).  
- Ask for: high-res **exterior**, identity (name + address), written reuse on this site, crop/resize for web, photographer credit.  
- Contact anchors: Faisalabad `dofcop.org`; Hyderabad `dohcop.org` + NCCP; Raiwind diocese / newsletter / Church of Scotland WMC tag (permission still required).  
- Save written grant offline — not secrets in repo.  
- **Do-not:** Scrape diocese sites into `public/media/`.

#### 3.3 Ingest rights-cleared photos when evidence exists — **TODO** when files arrive

1. Original under `reference/cathedrals/licensed/` (or downloaded twin)  
2. Publish kebab JPG at `public/media/cathedrals/{id}-….jpg`  
3. Update `data/cms/cathedrals.json` (`local_file`, `photo_status`, author, license URL, source page); keep SVG as `fallback_file`  
4. Update `IMAGE_RIGHTS_AND_CREDITS.md`, `ASSET_REGISTRY.md`, `CHURCHES_MEDIA_GAPS.md`, `MEDIA_CHECKSUMS.txt`  
5. Verify building matches name + city; credit visible; `/churches` shows JPG  

---

### Phase 4 — Sources / links

#### 4.1 Lahore diocese URL — **Blocked on curator**

- `https://copldc.org/about-us/` DNS-unreachable (2026-09-23). Keep honest unreachable label until curator confirms a live URL.  
- **Do-not:** Invent a replacement; silently drop the 1887 claim.

#### 4.2 Re-check other institutional links — **Partial**

- Before launch: HTTP 200 (or documented archive) for cop.org.pk, NCCP, dofcop, peshawardiocese, Sialkot places, Raiwind PDF, cofswmc tag, etc.  
- **Do-not:** Auto-replace failed links with unrelated pages.

#### 4.3 Optional: Dawn / FA press on `/sources` — **TODO** (P2)

- Clear “Press / public record” group; do not elevate allegations to site fact.  
- **Do-not:** Use Wikipedia as sole authority for contested claims.

#### 4.4 Optional: CMS for Sources register — **TODO** (P2)

- Only if product wants curator edit without deploy (`CMS_RESEARCH_2026-09-20.md`). Prefer JSON CMS over Payload/Directus unless limits are real.

#### 4.5 Nav discoverability for `/sources` — **TODO** (P2)

- Optional primary-nav entry without crowding mobile.  
- **Do-not:** Fake Search or social icons.

---

### Phase 5 — Legal / privacy + contribute webhook

#### 5.1 Legal + privacy pages — **TODO**

- New routes e.g. `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` (or single legal page); wire Footer.  
- Copy covers: admin cookies/session, contribution personal data, media rights, takedown contact — **curator/legal must approve text**.  
- Remove incomplete-warning only after pages ship.  
- **Do-not:** Invent jurisdictional legal advice; claim GDPR/CCPA without review; fake attorney names.

#### 5.2 Configure and test `CONTRIBUTE_WEBHOOK_URL` — **TODO**

- Host secrets: `CONTRIBUTE_WEBHOOK_URL`, optional `CONTRIBUTE_API_KEY`.  
- Unset → honest “not configured”. Set → test POST succeeds; failures honest (no false success). Rights + publication consent required.  
- **Do-not:** Fake success; log full PII into public docs; commit webhook URLs/keys.

#### 5.3 Contribution UX honesty — **Partial**

- Launch copy should state review/rights process.  
- **Do-not:** Auto-publish form uploads to `public/media/`.

---

### Phase 6 — Production security deploy checklist

Code hardening shipped 2026-09-23. **Host config is human TODO.**

#### 6.1 Disable preview login in production — **Partial** (code Done; prod env TODO)

- Production: `ADMIN_OPEN_PREVIEW` unset or `false`.  
- Verify: `curl -X POST https://<host>/api/admin/login/preview` → **403** even if flag mistakenly true (`NODE_ENV=production`). Login UI must not show preview button.  
- **Do-not:** Ship preview-enabled builds to a public URL.

#### 6.2 Password hash + session secret rotation — **TODO** per production env

- `ADMIN_PASSWORD_HASH` set; `ADMIN_PASSWORD` unset; `ADMIN_SESSION_SECRET` ≥32 chars, unique per env.  
- Generate hash: see `docs/ADMIN.md` (`pnpm exec tsx` + bcryptjs).  
- **Do-not:** Commit or paste hashes/passwords/secrets into this doc.

#### 6.3 HTTPS, Secure cookies, security headers — **Partial**

- Headers already in `next.config.ts`. Host must terminate HTTPS.  
- Verify: `curl -sI https://<host>/` shows security headers; cookie Secure+HttpOnly+SameSite=Lax on login.  
- **Do-not:** Widen CSP to random CDNs without deliberate allowlist.

#### 6.4 Confirm `NODE_ENV=production` and no secrets in artifact — **TODO**

- Deploy bundle has no `.env.local` or out-of-repo credential notes.

#### 6.5 Spot-check admin API auth after deploy — **TODO**

- Unauthenticated mutating calls → 401; login rate-limit → 429 when exceeded.  
- **Do-not:** Move auth solely to middleware.

---

### Phase 7 — QA matrix

#### 7.1 Route matrix — **Partial** (re-run before launch)

```bash
pnpm build && pnpm start
pnpm audit:site
```

Expect **200** for all public routes + new legal routes. `/admin` unauthenticated → login redirect.

#### 7.2 Viewport matrix — **Partial**

- Check **320 / 375 / 480 / 768 / 980 / 1280 / 1440**. No material horizontal overflow; interview 4:5 equal heights; sticky nav usable; church grid readable.  
- Prior evidence: `/workspace/hcop-parts/handoff-audit-2026-09-23/`, `triple-check-2026-09-23/`.

#### 7.3 Accessibility (WCAG 2.2 AA-oriented) — **Partial**

- Skip link; focus-visible; keyboard nav/forms/admin; honest alt; burgundy/parchment contrast; `prefers-reduced-motion`.  
- **Do-not:** Remove focus outlines; use color alone for rights status.

#### 7.4 No invented facts gate — **TODO** every release

- Diff FA captions vs inventory; timeline years package-true; eight diocese identities; People/Interviews forthcoming unless real; no Design #1 mock names.

#### 7.5 Admin manual QA — **Partial**

- Walk `docs/ADMIN.md` Manual QA: preview only local; password login; Home/Churches/FA/Interviews/Media/Profile save + revalidate; upload limits; logout.  
- **Do-not:** Invent licenses when uploading cathedral photos.

#### 7.6 Typecheck / lint / build — **TODO** before each handoff

```bash
pnpm typecheck && pnpm lint:eslint && pnpm build
```

- **Do-not:** Disable TypeScript strict to land a UI tweak.

---

### Phase 8 — Optional follow-ons

| ID | Item | Status | Notes |
|----|------|--------|-------|
| 8.1 | Git remote / version control | **TODO** | Tree may lack `.git`; agree remote with user; never commit secrets |
| 8.2 | Draft vs Live CMS | **TODO** | Research done; not built — draft invisible on public |
| 8.3 | People page when bios exist | **Blocked on curator** | Cite sources; rights-cleared portraits; no mock names |
| 8.4 | Admin shell polish (Ghost-like) | **TODO** | Optional UX only; do not SaaS-ify public site |
| 8.5 | Quarantine unused / deprecated media | **TODO** (P2) | Keep rights docs / checksums |
| 8.6 | Churches / profile CMS | **Done** | Optional fielded profile form still PDF-sourced only |

### Suggested execution order

1. **Phase 0** — install, run, audit:site  
2. **Phase 1** — re-verify caption Done items; fix strapline P2 if touching copy  
3. **Phase 2** — remaining craft (hero ornament, church framing decision, people empty-state)  
4. **Phase 4.1** — wait for curator Lahore URL; keep unreachable label  
5. **Phase 3** — draft permission emails for curator; keep placeholders  
6. **Phase 5** — legal/privacy + webhook (curator-approved copy + host secrets)  
7. **Phase 6** — production env hardening; verify preview 403  
8. **Phase 7** — full QA matrix; go/no-go  
9. **Phase 8** — only as product requests  

---

## 8. Verification

| Phase | Proof |
|------:|-------|
| **0** | `pnpm typecheck`, `lint:eslint`, `audit:site` all green; `/admin` redirects when logged out |
| **1** | FA captions match inventory; no “pending confirmation”; Jewan-only controversy notes; strapline glyph unified if 1.5 done |
| **2** | Visual compare Design #1; Purpose icons + 4:5 interviews hold at 480px and 1280px; placeholders still labeled for three seats |
| **3** | `/churches` still honest placeholders **or** JPG + credits + updated CMS/rights docs when cleared |
| **4** | Lahore URL either live 200 + wording updated, or still honestly labeled unreachable; other institutional links re-checked |
| **5** | Privacy/terms 200 + footer links; webhook unset = honest refuse; webhook set = successful test POST without false success |
| **6** | Preview POST → 403 on prod; hash-only auth; HTTPS + Secure cookie; headers present; no `.env.local` in artifact |
| **7** | Route matrix 200; viewport pass; a11y basics; invented-facts gate clean; admin manual QA; build green |
| **8** | Only if shipped: git remote clean of secrets; draft not public; people bios sourced |

---

## 9. Do-not / traps

| Trap | Correct behavior |
|------|------------------|
| Wrong-city / lookalike church photos | Keep SVG placeholders; wait for identity-confirmed exterior |
| Paraphrasing FB captions | Restore from `INVENTORY.md`; press stays in Public Record fields |
| Enabling `ADMIN_OPEN_PREVIEW` in prod | Unset/`false`; code still 403s in production — still never ship the flag on |
| Inventing People / Interview bios | Forthcoming until real records |
| Copying Design #1 mock names / timeline years | Package data only |
| Scraping diocese / Getty / uncleared web images | Rights-cleared path only; document in rights docs |
| Wiring new code to root `content/` | Use `src/content/` + `data/cms/` |
| Modifying `reference/` originals | Copy out if editing |
| Tailwind / icon kits / alternate palette | CSS Modules + package tokens |
| Fake contribute success without webhook | Honest “not configured” |
| Middleware-only auth | Keep Server Component + Route Handler gates |
| Inventing bishop scandals | Sourced press only; Jewan items already framed |
| Committing `.env.local` or secrets | Host secret store only |
| Auto-publishing form uploads | Moderation first |
| “Resolving” OPEN_QUESTIONS by invention | Flag; wait for curator |

---

## 10. Key file index

| Path | Role |
|------|------|
| `AGENTS.md` | Agent hard rules |
| `README.md` | Run locally / stack |
| `docs/CURSOR_ONBOARDING_FINISH.md` | **This master finish briefing** |
| `docs/_onboard_parts/01_ARCHITECTURE.md` | Full system inventory |
| `docs/_onboard_parts/02_DESIGN_AND_CONTENT.md` | Design #1 + provenance |
| `docs/_onboard_parts/03_FINISH_CHECKLIST.md` | Detailed phase checklist |
| `docs/ADMIN.md` | Curator admin operator guide |
| `docs/SECURITY_HARDENING_2026-09-23.md` | Auth, headers, prod checklist |
| `docs/SITE_AUDIT_HANDOFF_2026-09-23.md` | Audit go/no-go + open items |
| `docs/TRIPLE_CHECK_CONTENT_2026-09-23.md` | Caption / name fidelity |
| `docs/TRIPLE_CHECK_DESIGN_ICONS_2026-09-23.md` | ~82/100 closeness |
| `docs/CHURCHES_MEDIA_GAPS.md` | Three permission gaps |
| `docs/SOURCES_AND_RIGHTS.md` | Rights posture |
| `docs/IMAGE_RIGHTS_AND_CREDITS.md` | Photo credits |
| `docs/DESIGN_SYSTEM.md` | Tokens / patterns |
| `docs/DECISIONS.md` | ADRs |
| `docs/OPEN_QUESTIONS.md` | Unresolved curator items |
| `docs/BISHOP_CONTROVERSY_NOTES.md` | Press framing policy |
| `docs/CMS_RESEARCH_2026-09-20.md` | Draft/Live research |
| `data/cms/*.json` | Live editable CMS |
| `src/content/*` | Typed public loaders |
| `src/lib/cms/*` | Store, types, schemas |
| `src/lib/auth/*` | Session, preview, rate-limit, require-admin |
| `src/app/**` | Routes + admin APIs |
| `src/components/home/*` | Homepage sections |
| `src/components/admin/*` | Admin editors |
| `src/styles/tokens.css` | Design tokens |
| `public/media/**` | Publishable media |
| `reference/` | Immutable package (do not rewrite) |
| `reference/facebook-page/INVENTORY.md` | Verbatim FA caption authority |
| `reference/design-reference/` | Design #1 boards (never publish) |
| `reference/source-data/` | Factual JSON authority |
| `scripts/audit-site.mjs` | Route HTTP audit |
| `.env.example` | Env **names** only |

---

## 11. Handoff to production

### Local curator preview — conditional GO

Usable for review/training when:

- `pnpm dev` on trusted machine  
- Preview login only with `ADMIN_OPEN_PREVIEW=true` and non-production  
- Captions / media / admin gates verified  

### Public production — NO-GO until all of the following

| # | Criterion |
|---|-----------|
| 1 | Three church seats either rights-cleared JPGs + credits **or** still honest placeholders (never wrong-city fills) — and curator has a plan for clearance |
| 2 | Legal + privacy pages live; footer warning removed only after ship |
| 3 | `CONTRIBUTE_WEBHOOK_URL` configured and tested **or** contribute CTA does not invite public submissions that cannot be received |
| 4 | Production env: `NODE_ENV=production`, `ADMIN_OPEN_PREVIEW` off, bcrypt hash only, unique session secret, HTTPS |
| 5 | Preview login endpoint returns **403** on the public host |
| 6 | Phase 7 QA green: routes, viewports, a11y basics, invented-facts gate, admin manual QA, `typecheck` + `lint:eslint` + `build` |
| 7 | Lahore / institutional links either live or honestly labeled; no silent dead “About” links presented as working |
| 8 | No secrets in deploy artifact; `.env.local` not shipped |

### Go / no-go summary

| Environment | Verdict (as of 2026-09-29 briefing) |
|-------------|--------------------------------------|
| Local curator preview | **Conditional GO** |
| Public production | **NO-GO** until Phases 3–6 blockers clear and Phase 7 is green |

When criteria pass, record the launch decision in `docs/DECISIONS.md` (or a dated launch note) and keep this briefing’s hard rules in force for all post-launch edits.

---

*Document only — no secrets. Local passwords/hashes belong in `.env.local` and host secret stores; see `docs/ADMIN.md` and `.env.example`. Consolidated from `docs/_onboard_parts/{01,02,03}_*.md` plus audit/security/admin consistency skim on 2026-09-29.*
