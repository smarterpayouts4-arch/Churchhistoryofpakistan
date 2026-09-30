# ASSET_AUDIT — History: Church of Pakistan (Phase 1)

**Repo:** `/workspace/heritage-forge/history-church-of-pakistan/`  
**Package:** `/workspace/history-church-of-pakistan-package/history-church-of-pakistan-website/`  
**Audit date:** 2026-09-17 (America/New_York)  
**Companion:** `docs/ASSET_REGISTRY.md`, `docs/MEDIA_CHECKSUMS.txt`, `docs/IMAGE_RIGHTS_AND_CREDITS.md`

---

## 1. Summary counts

| Category | In `public/media/` | Notes |
|----------|-------------------|-------|
| Brand SVG | 2 | mark + favicon (identical bytes) |
| Founder WebP | 2 | hero + square |
| Cathedral JPG (open license) | 5 | Karachi, Lahore, Multan, Peshawar, Sialkot |
| Cathedral SVG placeholders | 8 | 3 primary pending + 5 fallbacks |
| Paper grain / texture files | **0** | Starter uses inline SVG data-URI; Next app has none |
| Purpose / archival icons | **0** | Unicode in CSS/JS only |
| Interview portraits / thumbs | **0** | Placeholder gradients |
| Family-archive photographs | **0** | CSS “art” only (correct until rights-cleared holdings) |
| Design reference in public | **0** | Correct — refs stay in `reference/` / package |

---

## 2. Existing publishable assets (`public/media/`)

### Brand

| File | Bytes | Status | Action |
|------|------:|--------|--------|
| `brand/archive-cross-mark.svg` | 476 | OK for header | Keep |
| `brand/favicon.svg` | 476 | OK | Keep (same art as mark) |

### Founder / curator (user-supplied)

| File | Dims | Bytes | Status | Action |
|------|------|------:|--------|--------|
| `founder/founder-portrait-hero.webp` | 706×965 | 62 830 | Publishable | Keep; caption stays generic until display name confirmed |
| `founder/founder-portrait-square.webp` | 900×900 | 68 484 | Publishable | Keep |

Package also has JPG alts + source screenshot under `assets/founder/` — **do not publish** the source screenshot (`founder-source-screenshot.jpeg`).

### Cathedral photographs (open_license)

| File | Dims | Bytes | Quality note | Rights (registry) |
|------|------|------:|--------------|-------------------|
| `cathedrals/karachi-holy-trinity.jpg` | **480×640** | 117 403 | **Low-res / soft** for card + lightbox | PD-self — Calan / Commons |
| `cathedrals/lahore-resurrection.jpg` | 3264×1836 | 1 566 102 | Strong but heavy | CC BY-SA 4.0 — Ali lahoti |
| `cathedrals/multan-st-mary.jpg` | 1280×853 | 281 910 | Adequate web size | CC BY-SA 4.0 — Tahsin Shah |
| `cathedrals/peshawar-st-john.jpg` | 4342×2812 | **3 387 586** | Oversized; registry notes possible embedded caption/frame | CC BY-SA 4.0 — WaqasM.Khan1983 |
| `cathedrals/sialkot-holy-trinity.jpg` | 4608×3456 | **3 643 304** | Oversized for cards | CC BY-SA 3.0 — PakGuru99 |

### Cathedral SVG placeholders

All eight under `cathedrals/placeholders/*.svg` (~1.6–1.7 KB each). Decent archival line-art with grain filter and “PHOTOGRAPHY NEEDED” label. Acceptable interim UI; **visually thin** next to real photos in the same 8-card grid.

**Primary placeholders (permission_needed):**

- `faisalabad-st-john.svg`
- `hyderabad-st-thomas.svg`
- `raiwind-praying-hands.svg`

**Fallbacks (superseded by JPG as primary):** remaining five SVGs — present on disk; `fallback_file` fields exist in content but **are not used by UI**.

---

## 3. Broken paths

### Live `src/` → `public/`

**Broken count: 0.** Every `/media/...` string referenced from `src/` resolves to a file under `public/`. See `docs/REPAIR_AUDIT.md` §6 for the full table.

### Stale / unused path strings (not broken in production, but hazardous)

| String | Location | Would resolve? |
|--------|----------|----------------|
| `assets/founder/founder-portrait-hero.webp` | Root `content/homepage.ts` | No (not under `public/`) |
| `../assets/cathedrals/downloaded/*.jpg` | Root `content/cathedrals.ts` | No |
| `../assets/cathedrals/placeholders/*.svg` | Root `content/cathedrals.ts` | No |

If an agent re-points imports to root `content/`, the site would ship broken images. Treat as **latent broken refs**.

### Unused but valid paths

| Path | Issue |
|------|-------|
| `fallback_file` SVGs for five open-license dioceses | On disk & in `src/content/cathedrals.ts`; never read by components |

---

## 4. Missing assets (vs Design #1 + package design system)

| Need | Design #1 / DESIGN_SYSTEM | Current substitute | Package candidate? |
|------|---------------------------|--------------------|--------------------|
| Paper grain / parchment texture | Explicit: “restrained paper grain”; starter `body:before` noise | Flat parchment fill | **Reuse starter technique** (SVG data-URI) — no binary asset required; or generate subtle texture |
| Hero corner botanical / flourish | Mock shows sepia branch illustrations | CSS concentric circles only | **Needs generate** (decorative SVG) — not historical fact |
| Purpose card icons (photo, book/quill, album, statue) | Hand-drawn archival icons on textured squares | Unicode `▧◇▤✣` in circles | **Needs generate** (4 SVG icons matching brand) |
| Interview card portraits | Three photo thumbs + play overlay | Brown gradient + ▶ | **Missing content** — wait for real interviews; do **not** invent faces/names |
| Family archive stills | Four sepia group photos | CSS gradients (`photoStack`, `letters`, …) | **Missing holdings** — correctly empty; do not use stock “old photos” |
| Search icon in header | Mock shows search | Omitted | **Do not add** dead search |
| Social icons in footer | Mock Facebook/Twitter/Instagram | None | Only if real accounts exist — do not invent |
| Higher-res Karachi exterior | Documentary church card | 480×640 JPG | Package/Commons source is that file; **needs better licensed source or upscale-with-caution** |
| Faisalabad / Hyderabad / Raiwind photos | Full gallery | SVG only | **Needs diocese permission** — package scripts/docs already say so |
| Web-optimized derivatives of large JPGs | Photography section: consistent card crops | Full originals | Package `scripts/optimize_images.py` — **run / wire** |

---

## 5. Low-quality / needs-clean

| Asset | Issue | Recommended repair (later phase) |
|-------|-------|----------------------------------|
| `karachi-holy-trinity.jpg` | Soft, noisy, only 480×640 | Seek higher-res PD/CC original or accept as “best available” with honest sizing |
| `peshawar-st-john.jpg` | ~3.4 MB; possible caption/frame in source | Crop/clean if frame present; emit ~1600px WebP/AVIF derivative |
| `sialkot-holy-trinity.jpg` | ~3.6 MB | Same — optimize for cards; keep full master in `reference/` |
| `lahore-resurrection.jpg` | ~1.6 MB | Optimize for delivery |
| Placeholder SVGs in photo grid | Look “empty” beside photos | Keep until rights clear; improve icon density slightly if needed |
| Founder WebPs | OK quality | Confirm public display name before launch captions change |

**Do not** “enhance” historical photos into fictional clarity that invents detail; prefer documentary truth (`DESIGN_SYSTEM.md` photography rules).

---

## 6. Package candidates (copy / reuse map)

Already mirrored into `public/media/` or `reference/`:

| Package path | Repo publish path |
|--------------|-------------------|
| `assets/brand/*` | `public/media/brand/*` |
| `assets/founder/founder-portrait-*.webp` | `public/media/founder/*` |
| `assets/cathedrals/downloaded/*.jpg` | `public/media/cathedrals/*.jpg` (kebab names) |
| `assets/cathedrals/placeholders/*.svg` | `public/media/cathedrals/placeholders/*` |
| `assets/design-reference/*` | `reference/design-reference/` only — **not public** |
| `starter-site/styles.css` grain | Pattern to port into `globals.css` |
| `scripts/optimize_images.py` | Candidate for a `pnpm` media pipeline |
| `scripts/fetch_cathedral_photos.py` | Already used for the five open-license fetches |

Still only in package / reference (not needed in public yet):

- `assets/founder/founder-source-screenshot.jpeg` — source_only
- `assets/founder/*.jpg` alts — optional
- `data/*.json` — factual authority (already typed into `src/content/`)

---

## 7. Needs generate / clean (checklist for later phases)

### Generate (decorative / UI — not historical claims)

1. Optional paper-grain overlay (CSS/SVG).
2. Four purpose icons (SVG, oxblood/gold, archival line style).
3. Optional hero corner flourish (abstract botanical SVG — not a real church photo).
4. Optional interview “empty state” illustration stronger than gradient (still not a fake person).

### Clean / optimize (existing media)

1. Run optimize pipeline on Lahore / Peshawar / Sialkot (and optionally Multan).
2. Inspect Peshawar for embedded frame/caption; crop if present.
3. Decide Karachi strategy (better source vs accept).

### Obtain with permission (blocking real photos)

1. Faisalabad — St. John's, Gojra  
2. Hyderabad — St. Thomas  
3. Raiwind — Central Cathedral of Praying Hands  

### Do **not** generate as facts

- Fake interview portraits or names (mock: Samuel Khan, Ruth Emmanuel, Joseph Mathias).
- Fake family-archive photographs presented as holdings.
- Mock church labels (All Saints Lahore, Christ Church Rawalpindi, etc.).

---

## 8. Image path verification appendix

### `next/image` import sites

- `src/components/ui/MediaImage.tsx` — wrapper
- `src/components/layout/Header.tsx` — brand SVG (`unoptimized`)

### Direct / resolved `src` values used at runtime

All OK against `public/`:

1. `/media/brand/archive-cross-mark.svg` — Header  
2. `/media/brand/favicon.svg` — layout metadata  
3. `/media/founder/founder-portrait-hero.webp` — Hero (`homepage.hero.portrait`)  
4. `/media/founder/founder-portrait-square.webp` — MyConnection, About  
5. `/media/cathedrals/karachi-holy-trinity.jpg` — Churches  
6. `/media/cathedrals/lahore-resurrection.jpg` — Churches  
7. `/media/cathedrals/multan-st-mary.jpg` — Churches  
8. `/media/cathedrals/peshawar-st-john.jpg` — Churches  
9. `/media/cathedrals/sialkot-holy-trinity.jpg` — Churches  
10. `/media/cathedrals/placeholders/faisalabad-st-john.svg` — Churches  
11. `/media/cathedrals/placeholders/hyderabad-st-thomas.svg` — Churches  
12. `/media/cathedrals/placeholders/raiwind-praying-hands.svg` — Churches  
13. Fallback SVGs for five JPGs — **on disk, unused by UI**

**Broken live refs: none.**
