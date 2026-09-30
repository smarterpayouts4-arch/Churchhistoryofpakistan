# SITE AUDIT REPORT — History: Church of Pakistan

**Repo:** `/workspace/heritage-forge/history-church-of-pakistan`  
**Live base:** `http://127.0.0.1:4000` (box; same port documented for user PC)  
**Audit date:** 2026-09-19 (America/New_York, EDT)  
**Design bar:** Design #1 Archival Heritage (parchment / burgundy / Cormorant)  
**Scope:** Full premium walk of every `src/app` route, media catalog, churches gaps, redundancy, videos, viewport, Facebook consistency.

---

## FIX LIST (actionable, ranked)

### P0 — do now / done this pass

| # | Item | Status |
|---|------|--------|
| P0-1 | **Reel letterboxing broken:** `.interviewVideo { object-fit: cover }` overrode `contain` → landscape youth videos cropped inside 9:16 frames | **FIXED** — `object-fit: contain` restored |
| P0-2 | **`interviewGrid` tablet cliff:** stayed 3-col until 760 then jumped to 1 — crushed reel cards on ~768–980 | **FIXED** — 3 / 2 / 1 at desktop / ≤980 / ≤768; 480 reel tighten |
| P0-3 | **`placesGrid` desktop density:** 4-col on home preview + churches cards felt dashboard-y vs Design #1 | **FIXED** — default 3-col; 2 at tablet; 1 at ≤768 |
| P0-4 | **SHA-identical FA orphan:** `fb-sialkot-bishops-cover.jpg` == wired `fb-bishop-young-js-qadir.jpg` | **REMOVED** orphan file (404 expected; never referenced in `src`) |
| P0-5 | Broken image paths among wired `/media` refs | **None** — all content-referenced paths HTTP 200 |

### P1 — next curator / content pass

| # | Item | Notes |
|---|------|-------|
| P1-1 | **Churches missing real photos:** Faisalabad, Hyderabad, Raiwind | SVG placeholders only — see `CHURCHES_MEDIA_GAPS.md` |
| P1-2 | **Near-duplicate FA stills both wired:** Bishop W.G. Young (`fb-bishop-wg-young` + `fb-bishop-william-g-young`) | Different FB posts/captions; curator decide keep both or retire one |
| P1-3 | **Bashir Jewan cluster:** 3 wired portraits + 1 orphan `fb-bashir-jewan-portrait.jpg` | Orphan unused; consider wire or archive to `reference/` |
| P1-4 | **People page uses 9:16 `interviewMedia` for landscape FA stills** | Thematic only (honest forthcoming); prefer `archiveFrame` / 4:3 to avoid heavy letterbox |
| P1-5 | **Orphan Wikimedia full-res twins** under `public/media/cathedrals/` | Keep publish kebab copies; move originals to `reference/cathedrals/downloaded/` if not already mirrored |
| P1-6 | **Dead content:** `src/content/interviews.ts` (`interviewSlots`) unused by pages | Featured Interviews correctly use `featured-interviews.ts`; retire or repurpose slots |
| P1-7 | **Align remaining `760px` breakpoints** in `globals.css`, `pages.module.css`, `Footer.module.css`, Hero sizes | Home grids now 768/480; satellite CSS still says 760 |

### P2 — polish / housekeeping

| # | Item | Notes |
|---|------|-------|
| P2-1 | SHA twin forthcoming art: `public/media/interviews/*` ≡ `public/media/archive/interviews/forthcoming-*` | Safe to delete one side after confirming no future use |
| P2-2 | Brand twin: `favicon.svg` ≡ `archive-cross-mark.svg` | Intentional; keep |
| P2-3 | Orphan FA stills: exterior/interior July-17, stained glass, bashir portrait | Inventory only; wire only with FB captions |
| P2-4 | Karachi publishable JPG is soft/small (480×640) | Prefer sharper diocese/Wikimedia re-export when available |
| P2-5 | `pages.module.css` `.extraGrid` still 4-col @ desktop | Only if still used; else remove |
| P2-6 | Home churches preview omits Sialkot (has real photo) | Intentional 4-up; consider rotating Sialkot in |

---

## Executive summary

The Next.js site is **honest and on-language** for Design #1: parchment wash, burgundy display type, archive-cross logo in header/footer/CTA, no fake success toasts, no stripe play chrome (`.playMark { display: none }`). All **8 routes return HTTP 200**. All **wired media paths return 200**.

**Churches:** 5/8 dioceses have open-license exterior photos (Karachi, Lahore, Multan, Peshawar, Sialkot). **3 remain SVG placeholders:** Faisalabad, Hyderabad, Raiwind.

**Featured Interviews:** 4 unique youth motivational reels (3 on home); native sizes retained; UI forces **9:16 Reel frames** with **letterboxing** (`object-fit: contain`) after this pass’s CSS fix. No duplicate reel files.

**Family Archives:** 24 caption-backed FB holdings wired; captions only from FB inventory. One SHA-identical orphan cover removed. Near-dup Bishop Young pair still both published (P1 curator call).

**Viewport:** `interviewGrid` / `placesGrid` / `archiveGrid` now **3 → 2 → 1** (desktop / ≤980 / ≤768) with ≤480 reel frame tighten. Verified at 900×1200: 2 tracks; videos `contain`; logo present; no broken images after scroll.

**Premium bar residual:** cathedral photo gaps (Faisalabad/Hyderabad/Raiwind), soft Karachi asset, People page 9:16 misuse of landscape stills, orphan media clutter.

---

## 1. Routes / pages

| Route | Status | Primary media | Notes |
|-------|-------:|---------------|-------|
| `/` Home | 200 | Founder hero, 3 youth videos, 4 cathedral JPGs, 4 FA stills, brand mark, icons, textures | Sections: Hero, Purpose, Interviews, Churches, Timeline, Family Archives, My Connection, Contribute CTA, Guiding Principle |
| `/about` | 200 | Founder square portrait, logo | Curator bio / purpose |
| `/archive` | 200 | All 24 FA FB stills | Full Family Archives grid |
| `/interviews` | 200 | 4 youth mp4 + posters | Forthcoming oral-history banner; no invented names |
| `/churches` | 200 | 5 JPG + 3 SVG placeholders | Full 8 dioceses + rights notes |
| `/people` | 200 | 3 FA thematic stills in 9:16 frames | Biographies forthcoming — honest |
| `/contribute` | 200 | Logo only | Form; no fake thank-you on load |
| `/sources` | 200 | Logo only | Footer-linked rights/sources |

No other `src/app/**/page.tsx` routes.

---

## 2. Media catalog (publishable `public/media`)

### Summary counts

| Bucket | Files (approx) | Wired in `src` | Notes |
|--------|---------------:|---------------:|-------|
| `archive/facebook/` | 29 → **28** after orphan removal | 24 FA + 3 People frames (overlap) | 4+ orphans remain |
| `archive/interviews/youth/` | 8 (4 mp4 + 4 posters) | 8 | Featured Interviews |
| `archive/interviews/` forthcoming | 9 | 0 | SHA twins of `interviews/` |
| `cathedrals/` publish JPG | 5 | 5 | kebab-case |
| `cathedrals/` Wikimedia-named | 5 | 0 | full-res / twin inventory |
| `cathedrals/placeholders/` | 8 SVG | 3 primary + 5 fallbacks | all 200 |
| `founder/` | 6 | 2 primary (hero-clean, square jpg) | webp/cutout orphans OK |
| `brand/` | 3 | logo + favicon twin | logo present sitewide |
| `icons/` | 4 | Purpose cards | |
| `textures/` | 3 | CSS backgrounds | parchment language |
| `interviews/` | 6 | via unused `interviews.ts` only | forthcoming art |

### Videos (Featured Interviews)

| ID | Path | Native | Orientation | Home | Duplicate reel? | Letterbox note |
|----|------|--------|-------------|------|-----------------|----------------|
| rab-ki-khidmat-4 | `…/youth/rab-ki-khidmat-4.mp4` | 720×1280 | portrait | yes | no | fills 9:16 |
| youth-empowerment | `…/youth/youth-empowerment.mp4` | 960×720 | landscape | yes | no | letterboxes in 9:16 (contain) |
| prince-oneil-2 | `…/youth/prince-oneil-2.mp4` | 720×900 | portrait | yes | no | slight pillarbox in 9:16 |
| nahum-1-7 | `…/youth/nahum-1-7.mp4` | 1280×720 | landscape | no (Interviews page) | no | letterboxes in 9:16 |

Posters match each video. **Facebook consistency:** Featured Interviews = youth motivational / Rab Ki Khidmat only. Family Archives = caption stills only. No cross-wiring of interview stills into FA.

### Churches photo status (live cards)

| Diocese | Cathedral | Asset | Real photo? |
|---------|-----------|-------|-------------|
| Faisalabad | St. John's Cathedral (Gojra) | `placeholders/faisalabad-st-john.svg` | **No — placeholder** |
| Hyderabad | St. Thomas Cathedral | `placeholders/hyderabad-st-thomas.svg` | **No — placeholder** |
| Karachi | Holy Trinity Cathedral | `karachi-holy-trinity.jpg` 480×640 | **Yes** (soft) |
| Lahore | Cathedral Church of the Resurrection | `lahore-resurrection.jpg` 1600×900 | **Yes** |
| Multan | Cathedral of St. Mary the Virgin | `multan-st-mary.jpg` 1280×853 | **Yes** |
| Peshawar | St. John's Cathedral | `peshawar-st-john.jpg` 1600×1036 | **Yes** |
| Raiwind | Central Cathedral of Praying Hands | `placeholders/raiwind-praying-hands.svg` | **No — placeholder** |
| Sialkot | Holy Trinity Cathedral Church | `sialkot-holy-trinity.jpg` 1600×1200 | **Yes** |

### Cathedral assets inventory (`public/media/cathedrals` + package/reference)

| Publishable (wired) | Source / twin on disk | License (from content) |
|---------------------|----------------------|------------------------|
| `karachi-holy-trinity.jpg` | `Trinity_Cathedral_Karachi.jpg` (orphan twin; different SHA — not byte-identical) | PD-self (Wikimedia) |
| `lahore-resurrection.jpg` | `Cathedral_Church_of_the_Resurrection_from_front_gate.jpg` (full-res orphan) | CC BY-SA 4.0 |
| `multan-st-mary.jpg` | `CATHEDRAL_OF_St._MARY_THE_VIRGIN_CHURCH_MULTAN_1280px.jpg` | CC BY-SA 4.0 |
| `peshawar-st-john.jpg` | `St_Johns_Cathedral_Peshawar.jpg` (full-res orphan) | CC BY-SA 4.0 |
| `sialkot-holy-trinity.jpg` | `Sialkot_Cathedral_Pakistan_WLMP_fifty_five.jpg` (full-res orphan) | CC BY-SA 3.0 |

Mirrored under `reference/cathedrals/downloaded/` and placeholders under `reference/cathedrals/placeholders/`.

---

## 3. Redundancy

### Identical SHA (after this pass)

| SHA pair | Action |
|----------|--------|
| `fb-bishop-young-js-qadir.jpg` ≡ ~~`fb-sialkot-bishops-cover.jpg`~~ | **Removed cover orphan** |
| `favicon.svg` ≡ `archive-cross-mark.svg` | Keep (brand twin) |
| `interviews/{a-life,faith,witness}.*` ≡ `archive/interviews/forthcoming-*` | P2 cleanup |

### Near-duplicate FB posts already wired

| Pair | Recommendation |
|------|----------------|
| `fb-bishop-wg-young` vs `fb-bishop-william-g-young` | Curator: keep both if distinct posts, else retire one |
| Bashir Jewan ×3 wired (+ orphan portrait) | Curator: thin to strongest captioned stills |

### Orphan public media (not in `src` refs)

- FA: `fb-bashir-jewan-portrait.jpg`, `fb-church-exterior-july-17.jpg`, `fb-church-interior-july-17.jpg` (People uses interior), `fb-stained-glass-altar-july-17.jpg`
- Forthcoming interview art duplicates + PNGs
- Cathedral Wikimedia-named full-res files
- Founder webp/cutout/card variants
- `brand/facebook-page-profile.png`, `archive/forthcoming-frame.jpg`

### Interviews stills misused as FA?

**No.** FA uses only `/media/archive/facebook/*`. Youth videos stay under Interviews. Reverse note: People thematic frames reuse FA stills inside `interviewMedia` 9:16 (P1 layout fix, not content misuse).

---

## 4. Viewport / responsive

| Grid | Before | After (this pass) | Verified |
|------|--------|-------------------|----------|
| `interviewGrid` | 3 → 1 @760 | **3 / 2 @≤980 / 1 @≤768** + 480 reel tighten | 900px → 2 tracks; videos `contain` |
| `placesGrid` | 4 → 2 @980 → 1 @760 | **3 / 2 / 1** | 900px → 2 tracks |
| `archiveGrid` / `archiveGridFull` | 4 → 2 → 1 | **3 / 2 / 1** | 900px → 2 tracks |
| 9:16 reel frames | risk of crop via cover override | **contain** letterbox preserved | confirmed |

`sizes` hints on Churches / FamilyArchives / Archive / People updated toward 768 / 980 / 33vw.

---

## 5. Facebook consistency

| Surface | Rule | Live status |
|---------|------|-------------|
| Family Archives | Captions / stills from FB History: Church of Pakistan only | **Pass** — `family-archives.ts` |
| Featured Interviews | Youth motivational (Rab Ki Khidmat / Youth Empowerment) only | **Pass** — `featured-interviews.ts` |
| No invented historical captions | — | **Pass** |
| No stripe play chrome | — | **Pass** (`.playMark` hidden) |
| Logo present | archive-cross mark | **Pass** header / footer / CTA / favicon |

---

## 6. Premium bar checklist

| Criterion | Result |
|-----------|--------|
| No broken images (wired) | Pass |
| No stripe play chrome | Pass |
| Logo present | Pass |
| Parchment Design #1 language | Pass (tokens + wash textures) |
| Cathedral photo completeness | **Fail soft** — 3 placeholders |
| Reel presentation | Pass after P0-1 |

---

## 7. Changes applied this pass

1. `src/components/home/Home.module.css` — responsive grids 3/2/1; 768/480 breakpoints; `interviewVideo` `object-fit: contain`.
2. `sizes` attributes updated on Churches, FamilyArchives, archive page, people page, churches page.
3. Deleted `public/media/archive/facebook/fb-sialkot-bishops-cover.jpg` (SHA twin orphan).
4. `pnpm typecheck` — clean.

---

## 8. Report-back metrics

| Metric | Value |
|--------|------:|
| **P0 count (items in FIX LIST)** | **5** (4 fixed / verified this pass; 1 confirmed already clean) |
| **Churches missing photos** | **Faisalabad, Hyderabad, Raiwind** (3) |
| **Duplicates removed** | **1** file (`fb-sialkot-bishops-cover.jpg`) |
| **Viewport fixes applied** | **Yes** (interviewGrid, placesGrid, archiveGrid + letterbox) |

See also: `docs/CHURCHES_MEDIA_GAPS.md`.
