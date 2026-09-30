# REPAIR_AUDIT — History: Church of Pakistan (Phase 1)

**Repo:** `/workspace/heritage-forge/history-church-of-pakistan/`  
**Package:** `/workspace/history-church-of-pakistan-package/history-church-of-pakistan-website/`  
**Design reference:** `/workspace/heritage-forge/reference/design/design-01-archival-heritage-reference.jpg` (+ package `assets/design-reference/`)  
**Audit date:** 2026-09-17 (America/New_York)  
**Scope:** Phase 1 repair audit only — **do not redesign homepage yet**.

---

## 1. Tech stack

| Layer | Actual (repo) | Notes |
|-------|---------------|-------|
| Framework | **Next.js 16.3.5** App Router | `package.json`; routes under `src/app/` |
| React | **19.x** (`react` / `react-dom` ^19) | Server Components by default |
| Language | **TypeScript** strict | `tsconfig.json` |
| Package manager | **pnpm@9.15.9** | lockfile present |
| Node | `engines.node >=20`; `.nvmrc` present | AGENTS.md still says “Node 24” as intent |
| Styles | **CSS Modules** + `src/styles/tokens.css` + `globals.css` | No Tailwind / shadcn / MUI |
| Fonts | Cormorant Garamond + Source Sans 3 via `next/font/google` | `src/lib/fonts.ts` |
| Images | `next/image` via `MediaImage` wrapper; SVGs fall back to `<img>` | `src/components/ui/MediaImage.tsx` |
| Lint | ESLint 9 + `eslint-config-next` 16.3.5 | `pnpm lint` |
| Scripts | `dev` (port **4000**), `build`, `start`, `lint`, `typecheck`, `audit:site` | `scripts/audit-site.mjs` → `docs/AUDIT_REPORT.md` |

**Honesty note:** `AGENTS.md` and `docs/AI_CONTEXT.md` still describe a “prepared package only / no Next scaffold.” That is **stale**. The App Router app **exists** and `docs/AUDIT_REPORT.md` shows 8/8 routes HTTP 200 (generated 2026-09-17T21:00:33Z).

---

## 2. Repository structure

```
history-church-of-pakistan/
├── content/                 # STALE draft copies (package-relative paths) — NOT used by @/
├── docs/                    # Working docs + this Phase 1 audit set
├── public/media/            # Publishable rights-cleared media (kebab-case)
├── reference/               # IMMUTABLE package mirror (do not rewrite)
├── scripts/audit-site.mjs
├── src/
│   ├── app/                 # Routes: /, about, archive, interviews, churches,
│   │                        #         people, contribute, sources
│   ├── components/
│   │   ├── home/            # Homepage sections (Hero…GuidingPrinciple)
│   │   ├── layout/          # Header, Footer
│   │   └── ui/              # MediaImage, Forthcoming
│   ├── content/             # CANONICAL typed content (@/content/*)
│   ├── lib/                 # fonts.ts, site.ts
│   └── styles/              # tokens.css, globals.css
├── package.json, next.config.ts, tsconfig.json, …
└── .next/                   # build cache (present)
```

### Authority map (repair must respect)

| Location | Role |
|----------|------|
| `reference/` | Immutable originals |
| `reference/source-data/` | Factual JSON authority |
| `src/content/` | Typed content for the live app |
| `public/media/` | Publishable media only |
| Package `data/*.json` + `docs/*` | Source of truth for facts / design intent |
| Design #1 JPG | Visual direction — **not** factual source |

### Dual `content/` problem (critical cleanliness)

| Path | Status |
|------|--------|
| `src/content/*.ts` | **Live** — imported via `@/content/*`; paths like `/media/...` |
| Root `content/*.ts` | **Stale draft** — still uses package paths (`assets/...`, `../assets/cathedrals/...`) |

`tsconfig.json` includes `**/*.ts`, so root `content/` is typechecked even though the app never imports it. Repair should either delete root `content/` or exclude it and document a single canonical location (`src/content/`). `docs/AI_CONTEXT.md` still points agents at root `content/` — update in a later docs pass (not homepage redesign).

---

## 3. Next.js cleanliness

### What is clean

- App Router layout with skip link, Header, `<main id="main">`, Footer.
- Metadata + favicon wired (`layout.tsx` → `/media/brand/favicon.svg`).
- Path alias `@/*` → `./src/*`.
- Homepage composed from section components; facts from `src/content/*`.
- Interviews / people / archive slots are honest “forthcoming” placeholders (no invented interviewee names in code).
- Curator label is **`Project Curator`** until confirmed (`src/content/nav.ts`).
- Contribute form avoids fake success when webhook unset (per `AUDIT_REPORT.md` + form design).
- `prefers-reduced-motion` honored in `globals.css`.
- `:focus-visible` ring in tokens.
- Route audit: **8/8 HTTP 200** (`docs/AUDIT_REPORT.md`).

### Cleanliness debts

1. **Stale agent docs** (`AGENTS.md`, `AI_CONTEXT.md`) claim no scaffold — misleads repair agents.
2. **Root `content/`** duplicates with broken public paths (see §2).
3. **`fallback_file` unused** — declared on open-license cathedrals in `src/content/cathedrals.ts` but never read by `Churches.tsx` / churches page / `MediaImage`.
4. **Cathedral JPGs not optimized for web** — Sialkot ~3.6 MB (4608×3456), Peshawar ~3.4 MB (4342×2812) served as full originals under `public/media/`; package has `scripts/optimize_images.py` unused by the Next build.
5. **Karachi JPG is low-res** (480×640) relative to other dioceses — looks soft in a 4:3 card crop.
6. **Places grid shows all 8 dioceses in `repeat(4, 1fr)`** — denser than Design #1’s four-card mock; not wrong vs package (`HOMEPAGE_CONTENT.md`: show all eight), but visually heavier than the reference still.
7. **No global paper-grain overlay** — package starter (`reference/design/starter-site/styles.css`) has `body:before` SVG noise; Next `globals.css` / `tokens.css` do not.
8. **Purpose icons are Unicode glyphs** (`▧◇▤✣`), not illustrated archival icons from Design #1.
9. **Family Archives “art” is CSS gradients only** — no photographs (correct per honesty rules; looks empty vs reference).
10. **Hero portrait treatment** — framed rectangle + filter, not the soft-fade cutout mood of Design #1 (visual debt for later phases; do not invent identity).
11. **Nav vs package map** — live nav adds **People**; package homepage nav lists **Timeline** as a top item (Timeline is `#timeline` section only — intentional per `nav.ts` comment). Design mock also shows a search affordance — **correctly omitted** (no dead search).

### Import graph (content)

All live imports resolve to `@/content/*` under `src/content/`. No component imports root `content/`.

Key image consumers:

| File | Mechanism | Source |
|------|-----------|--------|
| `Header.tsx` | `next/image` | `/media/brand/archive-cross-mark.svg` |
| `layout.tsx` | metadata icons | `/media/brand/favicon.svg` |
| `Hero.tsx` | `MediaImage` | `homepage.hero.portrait` → `/media/founder/founder-portrait-hero.webp` |
| `MyConnection.tsx`, `about/page.tsx` | `MediaImage` | `/media/founder/founder-portrait-square.webp` |
| `Churches.tsx`, `churches/page.tsx` | `MediaImage` | `c.local_file` from `cathedrals.ts` |

---

## 4. Asset organization

| Bucket | Location | Rule |
|--------|----------|------|
| Brand | `public/media/brand/` | Publish |
| Founder crops | `public/media/founder/*.webp` | Publish; display name pending |
| Cathedral photos | `public/media/cathedrals/*.jpg` | Five open-license |
| Cathedral placeholders | `public/media/cathedrals/placeholders/*.svg` | Three primary + five fallbacks |
| Design refs | `reference/design-reference/`, package `assets/design-reference/` | **do_not_publish** |
| Package originals | `reference/cathedrals/downloaded/`, package `assets/…` | reference_only |

Organization is generally sound (kebab-case under `public/media/`). Gaps:

- No `public/media/` folders for textures, purpose icons, interview thumbs, or family-archive stills (because content does not exist yet — UI therefore substitutes CSS).
- Package JPG founder alts exist under `assets/founder/` but only WebP is published (fine).
- `reference/cathedrals/licensed/` noted empty in registry (reserved).

Full inventory: `docs/ASSET_AUDIT.md`, `docs/ASSET_REGISTRY.md`.

---

## 5. Placeholders (content honesty)

| Area | Live behavior | Correct? |
|------|---------------|----------|
| Featured Interviews | Three “Interview story coming soon” cards + forthcoming note | Yes — do **not** copy Design #1 mock names |
| People route | Forthcoming | Yes |
| Family Archives | Thematic CSS slots only | Yes — do not invent holdings |
| Cathedral Faisalabad / Hyderabad / Raiwind | SVG placeholders + “Photo permission pending” | Yes |
| Curator name | “Project Curator” | Yes until confirmed |

### Design-mock conflicts — **NOT facts**

Design #1 still invents / mislabels for mood only. **Never copy into content or UI as history:**

| Mockup shows | Package / live authority |
|--------------|--------------------------|
| Interview names: “Rev. Dr. Samuel Khan”, “Mrs. Ruth Emmanuel”, “Mr. Joseph Mathias” | No interviews in package data — keep “coming soon” |
| Churches: “St. John's Cathedral, Karachi”; “All Saints Church, Lahore”; “Christ Church, Rawalpindi”; “St. Paul's Church, Peshawar” | Package `cathedrals.json`: Holy Trinity (Karachi), Cathedral of the Resurrection (Lahore), St. John's (Peshawar), etc. — **different identities** |
| Timeline years 1818 / 1849 / 1947 / 1970 / 2000+ | Package timeline: **1852, 1887, 1970, 1980, 2011** with citations |
| Founder labeled in some briefs as a specific personal name | Live site uses **Project Curator** until `OPEN_QUESTIONS.md` resolved |

---

## 6. Image path verification (src → public)

**Method:** Grepped `src/` for `next/image`, `MediaImage`, `src=`, and `/media/*.(jpg|jpeg|png|webp|svg)`; resolved each path under `public/`.

### Result: **0 broken references** in live `src/`

| Ref used in `src/` | On disk under `public/` |
|--------------------|-------------------------|
| `/media/brand/archive-cross-mark.svg` | ✅ |
| `/media/brand/favicon.svg` | ✅ |
| `/media/founder/founder-portrait-hero.webp` | ✅ |
| `/media/founder/founder-portrait-square.webp` | ✅ |
| `/media/cathedrals/karachi-holy-trinity.jpg` | ✅ |
| `/media/cathedrals/lahore-resurrection.jpg` | ✅ |
| `/media/cathedrals/multan-st-mary.jpg` | ✅ |
| `/media/cathedrals/peshawar-st-john.jpg` | ✅ |
| `/media/cathedrals/sialkot-holy-trinity.jpg` | ✅ |
| `/media/cathedrals/placeholders/{faisalabad,hyderabad,karachi,lahore,multan,peshawar,raiwind,sialkot}-*.svg` | ✅ (8) |

### Broken / misleading paths **outside** live src (do not serve)

| Path string | Where | Issue |
|-------------|-------|-------|
| `assets/founder/founder-portrait-hero.webp` | Root `content/homepage.ts` | Not a public URL; stale draft |
| `../assets/cathedrals/downloaded/*.jpg` | Root `content/cathedrals.ts` | Package-relative; would 404 if wired |
| `../assets/cathedrals/placeholders/*.svg` | Root `content/cathedrals.ts` | Same |

**Broken refs for live app: none.** Stale root content paths: **all package-relative strings** (listed above).

---

## 7. Repair priorities (Phase 1 → later; no homepage redesign yet)

1. Document + optionally quarantine/remove root `content/` so agents cannot wire broken paths.
2. Refresh `AGENTS.md` / `AI_CONTEXT.md` tree state.
3. Asset work tracked in `ASSET_AUDIT.md` (optimize heavy JPGs; Karachi quality; pending diocese photos).
4. UI mood gaps tracked in `UI_GAP_ANALYSIS.md` (grain, icons, empty sections) — **implement in later phases**.

---

## 8. Constraints reminder

- Do **not** invent historical facts, interview names, or church identities.
- Do **not** scrape unlicensed photos for Faisalabad / Hyderabad / Raiwind.
- Design #1 is mood direction; package JSON/docs win on facts.
