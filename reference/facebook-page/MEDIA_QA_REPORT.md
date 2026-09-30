# MEDIA QA REPORT — Facebook harvest → site media

**Repo:** `history-church-of-pakistan`  
**Audit date:** 2026-09-19 (America/New_York / ET)  
**Auditor:** executor QA pass (dimensions, folders, captions, brand/presentation)  
**Paths of truth:** `reference/facebook-page/` · `public/media/archive/facebook/` · `src/content/family-archives.ts`

## Summary counts

| Metric | Count |
|--------|------:|
| Inventory ID stems (deduped, alias-resolved) | 45 |
| Harvest `images/` stems | 43 |
| Harvest `screenshots/` stems | 48 |
| Public `archive/facebook/` JPGs | 30 |
| Wired in `family-archives.ts` | 26 |
| Public orphans (not wired) | 4 |
| Wired missing public | 0 |
| Caption key-phrase mismatches (spot-check) | 0 |
| Wrong-folder `fb-*` outside archive/facebook | 0 |
| Safe crops applied this pass | 4 |

## 1. Inventory completeness

| ID | images/ | screenshots/ | public JPG | family-archives | Status |
|----|:-------:|:------------:|:----------:|:---------------:|--------|
| `fb-1974-coggan-lahore` | — | Y | Y | Y | OK wired |
| `fb-1983-wcc-vancouver` | — | Y | Y | Y | OK wired |
| `fb-armstunz` | Y | Y | Y | Y | OK wired |
| `fb-bashir-jewan-hyderabad-1980` | Y | Y | Y | Y | OK wired |
| `fb-bashir-jewan-moderator-1981` | Y | Y | Y | Y | OK wired |
| `fb-bashir-jewan-portrait` | — | Y | Y | Y | OK wired |
| `fb-bashir-jewan-rare` | Y | Y | Y | Y | OK wired |
| `fb-bishop-johnston-qadir-bakhsh-35th-death-anniversary` | Y | Y | Y | Y | OK wired |
| `fb-bishop-wg-young` | Y | Y | Y | Y | OK wired |
| `fb-bishop-william-g-young` | Y | Y | Y | Y | OK wired |
| `fb-bishop-young-js-qadir` | — | Y | Y | Y | OK wired |
| `fb-bishops-couple` | Y | Y | Y | Y | OK wired |
| `fb-bishops-sialkot-diocese` | Y | Y | Y | Y | OK wired |
| `fb-board-honour-pastors-10-16` | Y | Y | Y | Y | OK wired |
| `fb-board-of-honour-central-church` | — | Y | Y | Y | OK wired |
| `fb-central-cathedral-75th-1975` | Y | Y | Y | Y | OK wired |
| `fb-church-exterior-july-17` | Y | Y | Y | — | hold_needs_caption (orphan public OK) |
| `fb-church-history-list-july-7` | — | Y | — | — | hold_needs_caption |
| `fb-church-interior-july-17` | Y | Y | Y | — | hold_needs_caption (orphan public OK) |
| `fb-church-july-11-youngson-comment` | — | Y | — | — | hold_needs_caption |
| `fb-district-superintendent-lahore-1-9` | Y | Y | Y | Y | OK wired |
| `fb-founder-methodist-church-july-16` | Y | Y | Y | Y | OK wired |
| `fb-fredrick-bagtaney-1984` | — | Y | — | — | SKIP filename/caption mismatch |
| `fb-gujranwala-seminary-memorial-tablet` | Y | Y | Y | Y | OK wired |
| `fb-gujranwala-seminary-professor-portrait` | Y | Y | — | — | hold_needs_caption |
| `fb-historic-church-tower-july-17` | Y | Y | — | — | hold_needs_caption |
| `fb-historic-preacher-july-8` | Y | Y | Y | — | hold_needs_caption (orphan public OK) |
| `fb-historic-sermon-july-8` | — | Y | — | — | hold_needs_caption |
| `fb-historical-gravestone-unknown` | Y | Y | — | — | hold_needs_caption |
| `fb-mrs-samuel-pervaiz` | Y | Y | Y | Y | OK wired |
| `fb-neela-gumbad-masjid-infographic` | Y | Y | — | — | hold_non_cop (Nila/related) — do not Family Archive |
| `fb-nila-gumbad-aerial` | Y | Y | — | — | hold_non_cop (Nila/related) — do not Family Archive |
| `fb-nila-gumbad-mosque-preservation` | Y | Y | — | — | hold_non_cop (Nila/related) — do not Family Archive |
| `fb-nila-gumbad-mosque-site-2` | Y | Y | — | — | hold_non_cop (Nila/related) — do not Family Archive |
| `fb-official-board-cathedral-construction` | Y | Y | Y | Y | OK wired |
| `fb-rudvin-1998` | Y | Y | Y | Y | OK wired |
| `fb-sewak-bm-augustine` | Y | Y | Y | Y | OK wired |
| `fb-sheikh-abdul-razzaq-mausoleum-infographic` | Y | Y | — | — | hold_non_cop (Nila/related) — do not Family Archive |
| `fb-sialkot-bishops-cover` | Y | — | Y | Y | OK wired |
| `fb-stained-glass-altar-july-17` | Y | Y | Y | — | hold_needs_caption (orphan public OK) |
| `fb-suhrawardi-lineage-infographic` | Y | Y | — | — | hold_non_cop (Nila/related) — do not Family Archive |
| `fb-turbaned-clergy-portrait-july-2` | Y | Y | — | — | hold_needs_caption |
| `fb-umc-pakistan-overseas-education-list` | Y | Y | Y | Y | OK wired |
| `fb-unidentified-historical-portrait-july-2` | Y | Y | — | — | hold_needs_caption |
| `fb-urdu-church-honour-plaque` | Y | Y | Y | Y | OK wired |

### Aliases

| Inventory ID | Canonical file/wire ID |
|--------------|------------------------|
| `fb-coggan-1974` | `fb-1974-coggan-lahore` |
| `fb-wcc-1983` | `fb-1983-wcc-vancouver` |
| `fb-pastors-roll` | `fb-board-of-honour-central-church` |
| `fb-church-july-11-youngson` | `fb-church-july-11-youngson-comment` |

### Disk stems not yet in inventory table

- `fb-church-service-aug10` — present under harvest; caption hunt / do not invent names from filename
- `fb-church-service-aug10-2` — present under harvest; caption hunt / do not invent names from filename
- `fb-cross-queen-gisela` — present under harvest; caption hunt / do not invent names from filename

## 2. Folder correctness

- All published `fb-*.jpg` live under `public/media/archive/facebook/`.
- **Wrong-folder check:** no `fb-*` under `interviews/`, `brand/`, `founder/`, or loose `public/`.
- `Interviews.tsx` correctly references Family Archive paths under `/media/archive/facebook/` (not interviews folder) for thematic forthcoming frames:
  - `/media/archive/facebook/fb-bishop-johnston-qadir-bakhsh-35th-death-anniversary.jpg`
  - `/media/archive/facebook/fb-gujranwala-seminary-memorial-tablet.jpg`
  - `/media/archive/facebook/fb-historic-preacher-july-8.jpg`
- Placeholder interview art remains under `public/media/archive/interviews/` and `public/media/interviews/` (non-fb).

## 3. Orphans

### Public JPGs not in family-archives.ts

| Stem | Class |
|------|-------|
| `fb-church-exterior-july-17` | hold_needs_caption (intentional unwired) |
| `fb-church-interior-july-17` | hold_needs_caption (intentional unwired) |
| `fb-historic-preacher-july-8` | hold_needs_caption (intentional unwired) |
| `fb-stained-glass-altar-july-17` | hold_needs_caption (intentional unwired) |

### family-archives entries whose imageSrc would 404

_None — every wired `imageSrc` resolves to a public JPG._

### Captioned+approved harvest not copied to public

_None for currently wired IDs. Sept 2026 captioned harvest (rudvin, armstunz, bishops-couple, bashir-jewan-*, bishop-wg-young, bishop-william-g-young) already has public JPGs and is wired._

## 4. Dimensions

### `public/media/archive/facebook/`

| File | W×H | Short side | Flags |
|------|----:|----------:|-------|
| `fb-1974-coggan-lahore.jpg` | 525×514 | 514 | ok |
| `fb-1983-wcc-vancouver.jpg` | 280×450 | 280 | TINY, small_but_ok |
| `fb-armstunz.jpg` | 608×598 | 598 | ok |
| `fb-bashir-jewan-hyderabad-1980.jpg` | 602×600 | 600 | ok |
| `fb-bashir-jewan-moderator-1981.jpg` | 438×598 | 438 | small_but_ok |
| `fb-bashir-jewan-portrait.jpg` | 480×510 | 480 | ok |
| `fb-bashir-jewan-rare.jpg` | 498×600 | 498 | ok |
| `fb-bishop-johnston-qadir-bakhsh-35th-death-anniversary.jpg` | 985×1400 | 985 | ok |
| `fb-bishop-wg-young.jpg` | 602×600 | 600 | ok |
| `fb-bishop-william-g-young.jpg` | 470×600 | 470 | ok |
| `fb-bishop-young-js-qadir.jpg` | 1400×787 | 787 | ok |
| `fb-bishops-couple.jpg` | 458×600 | 458 | ok |
| `fb-bishops-sialkot-diocese.jpg` | 1400×608 | 608 | ok |
| `fb-board-honour-pastors-10-16.jpg` | 1080×1080 | 1080 | ok |
| `fb-board-of-honour-central-church.jpg` | 642×482 | 482 | ok |
| `fb-central-cathedral-75th-1975.jpg` | 1400×1074 | 1074 | ok |
| `fb-church-exterior-july-17.jpg` | 1400×758 | 758 | ok |
| `fb-church-interior-july-17.jpg` | 796×1400 | 796 | ok |
| `fb-district-superintendent-lahore-1-9.jpg` | 1080×1281 | 1080 | ok |
| `fb-founder-methodist-church-july-16.jpg` | 1061×1400 | 1061 | ok |
| `fb-gujranwala-seminary-memorial-tablet.jpg` | 948×415 | 415 | small_but_ok |
| `fb-historic-preacher-july-8.jpg` | 1400×1114 | 1114 | ok |
| `fb-mrs-samuel-pervaiz.jpg` | 469×600 | 469 | ok |
| `fb-official-board-cathedral-construction.jpg` | 1080×902 | 902 | ok |
| `fb-rudvin-1998.jpg` | 734×568 | 568 | ok |
| `fb-sewak-bm-augustine.jpg` | 412×546 | 412 | small_but_ok |
| `fb-sialkot-bishops-cover.jpg` | 1400×787 | 787 | ok |
| `fb-stained-glass-altar-july-17.jpg` | 975×1400 | 975 | ok |
| `fb-umc-pakistan-overseas-education-list.jpg` | 1069×1400 | 1069 | ok |
| `fb-urdu-church-honour-plaque.jpg` | 886×1400 | 886 | ok |

### `reference/facebook-page/images/` (notable flags only)

| File | W×H | Flags |
|------|----:|-------|
| `fb-historical-gravestone-unknown.png` | 1047×2048 | TALL_POSSIBLE_CHROME |
| `fb-page-cover-photo.png` | 920×272 | TINY, EXTREME_AR |

**Screenshots folder:** all `fb-*.png` viewport captures are **1280×656** (FB lightbox + chrome). These are caption evidence, not site media. Do not publish screenshots as-is.

### Tiny / extreme

- **No public JPG** has short side &lt; 400.
- Closest small portraits: `fb-sewak-bm-augustine` (412), `fb-gujranwala-seminary-memorial-tablet` (415), `fb-bashir-jewan-moderator-1981` (438) — acceptable viewer-element crops.
- Harvest `fb-historical-gravestone-unknown.png` is tall (1047×2048) — possible full-height photo, not published.
- `fb-bishops-sialkot-diocese` / tablet graphics are wide (AR ~2.3) — expected for wall displays, not chrome.

## 5. Caption fidelity

Spot-check of wired IDs against inventory verbatim / summary key phrases: **0 mismatches**.

Notable fidelity preservations:
- Samson/Sampson dual spelling retained for `fb-rudvin-1998`.
- “severed” retained for `fb-bashir-jewan-moderator-1981`.
- Armstunz spelling retained; Matthew 25:23 kept.
- Founder graphic: caption only “Founder of Methodist Church”; portrait identity not invented.
- Heading-only posts use `needs-verification` and do not promote OCR’d name lists as site facts.

Minor editorial notes (not mismatches): site captions add framing phrases such as “(Transcribed from Facebook caption.)” — acceptable provenance tags, not invented history.

## 6. Safe fixes applied this pass

| ID | Before | After | Change |
|----|--------|-------|--------|
| `fb-board-of-honour-central-church` | 672×532 | 642×482 | Removed left nav arrow + bottom FB login bar |
| `fb-1974-coggan-lahore` | 664×514 | 525×514 | Removed left black gutter |
| `fb-1983-wcc-vancouver` | 672×493 | 280×450 | Cropped to portrait only (black bars, arrow, login removed) |
| `fb-rudvin-1998` | 804×598 | 734×568 | Refreshed from `images/` with top/right trim to reduce viewer zoom icons |

**Not done (by policy):**
- No new invented captions.
- Nila Gumbad set not wired into Family Archive.
- `fb-fredrick-bagtaney-1984` not published (filename/caption mismatch).
- Captionless architecture/portrait orphans left unwired.
- Homepage preview order not changed (recommendation only — see Brand section).

**Residual notes after crop:**
- `fb-board-of-honour-central-church` still truncates end-years on the right (source FB viewer crop limitation; companion `fb-board-honour-pastors-10-16` covers entries 10–16).
- Page watermark “History: Church of Pakistan” remains on many harvests — that is page branding on the photo, not FB UI chrome.
- `fb-rudvin-1998` may retain a faint top-right viewer artifact; re-harvest clean CDN image if available.

## 7. Status tables (checklist categories)

### OK (wired + public present)

- `fb-central-cathedral-75th-1975`
- `fb-1974-coggan-lahore`
- `fb-1983-wcc-vancouver`
- `fb-bishops-sialkot-diocese`
- `fb-gujranwala-seminary-memorial-tablet`
- `fb-urdu-church-honour-plaque`
- `fb-board-of-honour-central-church`
- `fb-bishop-johnston-qadir-bakhsh-35th-death-anniversary`
- `fb-bashir-jewan-portrait`
- `fb-mrs-samuel-pervaiz`
- `fb-sewak-bm-augustine`
- `fb-bishop-young-js-qadir`
- `fb-official-board-cathedral-construction`
- `fb-district-superintendent-lahore-1-9`
- `fb-umc-pakistan-overseas-education-list`
- `fb-sialkot-bishops-cover`
- `fb-board-honour-pastors-10-16`
- `fb-founder-methodist-church-july-16`
- `fb-rudvin-1998`
- `fb-armstunz`
- `fb-bishops-couple`
- `fb-bashir-jewan-hyderabad-1980`
- `fb-bashir-jewan-moderator-1981`
- `fb-bashir-jewan-rare`
- `fb-bishop-wg-young`
- `fb-bishop-william-g-young`

### needs_crop

| ID | Note |
|----|------|
| `fb-board-of-honour-central-church` | **Fixed** this pass (login/arrow). End-year truncation remains source-limited. |
| `fb-1974-coggan-lahore` | **Fixed** this pass (left gutter). |
| `fb-1983-wcc-vancouver` | **Fixed** this pass (portrait-only). Short side 280 — small; prefer re-harvest CDN for quality. |
| `fb-rudvin-1998` | **Improved** this pass; optional further re-harvest for zero UI. |
| `fb-historical-gravestone-unknown` (harvest only) | Tall harvest image; not published. |

### missing_public

_None for wired IDs._

### missing_wire

| Stem | Note |
|------|------|
| `fb-church-exterior-july-17` | captionless hold |
| `fb-church-interior-july-17` | captionless hold |
| `fb-historic-preacher-july-8` | captionless hold |
| `fb-stained-glass-altar-july-17` | captionless hold |

### caption_mismatch

_None found in spot-check._

### wrong_folder

_None — all site `fb-*` under `public/media/archive/facebook/`._

### tiny_dims

_None under 400px short side in public facebook archive._

## 8. BRAND_AND_PRESENTATION

### Archive mark / favicon / header logo

| Asset | Path | Present? | Notes |
|-------|------|:--------:|-------|
| Archive cross-mark | `public/media/brand/archive-cross-mark.svg` | Y | Used in Header, Footer, Contribute CTA, apple-touch |
| Brand favicon copy | `public/media/brand/favicon.svg` | Y | Same SVG family as cross-mark |
| Site favicon.svg | `public/favicon.svg` | Y | Root |
| Site favicon.ico | `public/favicon.ico` | Y | Declared in `layout.tsx` |
| Header logo | Header → `/media/brand/archive-cross-mark.svg` | Y | Consistent |

**Consistency:** Header / footer / apple icon all point at `archive-cross-mark.svg`. Favicon.ico is the browser tab icon. Visual identity is a parchment square with wine-colored cross over an open-book stroke — coherent across chrome.

**Locked asset decision:** Do **not** overwrite `archive-cross-mark.svg` with Facebook page profile/cover art without an explicit curator decision. FB page insignia (if harvested) should be reviewed as an alternate brand candidate, not auto-promoted.

### Facebook page cover / profile / insignia harvest

| Candidate | Disk | Recommendation |
|-----------|------|----------------|
| `screenshots/facebook-page-header.webp` | Y (1280×800) | Reference only for page identity; if a clean logo crop is desired later → `public/media/brand/` (not `archive/facebook/`). |
| `screenshots/facebook-reels-grid.webp` | Y | Reference only; not site brand. |
| `fb-page-profile` / `fb-page-cover` / `fb-logo-*` | **Not present** under `images/` | No action. If harvested later: brand folder for marks; facebook archive only for documentary photos of marks on plaques. |
| `fb-cross-queen-gisela` | harvest images+ss | **Not brand.** Ornate crucifix photo; filename must not invent “Queen Gisela” without caption. Hold until caption. |
| `fb-sialkot-bishops-cover` | public+wired | Documentary cover composite → correctly in `archive/facebook/`, not brand. |

### Family Archive card crop quality

| Check | Result |
|-------|--------|
| FB chrome on wired cards | Mostly clean after this pass; WCC/Coggan/Board fixed |
| Logos/insignia clipped awkwardly | Board of Honour end-years still clipped (source); pectoral crosses intact on portraits |
| Page watermark on photos | Present on many (page’s own overlay) — acceptable as provenance; not UI chrome |

### Homepage Family Archives preview (campaign-ready?)

`familyArchiveHomePreview = familyArchiveItems.slice(0, 4)` currently surfaces:

1. `fb-central-cathedral-75th-1975` — strong historic handshake (1975) — **campaign-ready**
2. `fb-1974-coggan-lahore` — Coggan handshake — **campaign-ready** (chrome fixed)
3. `fb-1983-wcc-vancouver` — Bishop portrait — **campaign-ready** but low-res after crop (280px wide)
4. `fb-bishops-sialkot-diocese` — wall display graphic — documentary, weaker as lead hero

**Marketing recommendation (do not auto-reorder without curator OK):**
Prefer a preview mix of strong captioned **portraits / people** first, e.g.:
1. `fb-bishop-johnston-qadir-bakhsh-35th-death-anniversary`
2. `fb-bashir-jewan-portrait` or `fb-bishops-couple`
3. `fb-central-cathedral-75th-1975` or `fb-1974-coggan-lahore`
4. `fb-rudvin-1998` or `fb-sewak-bm-augustine`

Keep display graphics (boards, plaques, lists) for the full `/archive` grid rather than homepage first row.

### Interviews forthcoming frames

Uses Family Archive stills (correct folder). Thematic, not claiming interviewee identity — OK. `fb-historic-preacher-july-8` is captionless orphan used only as thematic frame (not in family-archives) — acceptable for forthcoming slot art; do not treat as identified person.

## 9. Written history digest

See `reference/facebook-page/HISTORY_TEXT_DIGEST.md` — verbatim / inventory captions only.

## 10. Open curator decisions

1. Reorder homepage Family Archive preview toward portrait-first (recommended above).
2. Re-harvest CDN originals for low-res crops (`fb-1983-wcc-vancouver`, screenshot-only legacy items).
3. Whether Nila Gumbad set becomes **Other Heritage** gallery (not Family Archive).
4. Whether to replace or companion `archive-cross-mark.svg` with any future FB page logo harvest — **decision required before overwrite**.
5. Resolve `fb-fredrick-bagtaney-1984` filename vs Bashir Jewan consecration caption before any wire.
