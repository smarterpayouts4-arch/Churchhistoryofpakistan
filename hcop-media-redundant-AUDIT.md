# HCOP Media Redundant Audit

**Date:** 2026-09-23 (ET)  
**Box canonical:** `/workspace/heritage-forge/history-church-of-pakistan`  
**User PC:** `C:\\Users\\ofran\\hcop-site\\history-church-of-pakistan` (machineId `23bed386-aaba-4242-b717-d79dee604af5`)  
**Preview:** box `http://127.0.0.1:4000/` → 200; user PC `:4000` → 200

Hard rules observed: no invented historical facts/captions/church photos; Family Archives = Facebook photos + verbatim captions only; Featured Interviews = youth motivational videos in uniform frames; prefer unwire over delete for curator-approved media.

Supporting dumps: `/workspace/hcop-parts/screen-audit-2026-09-23/MEDIA_SHA_INVENTORY.json`, `GRADE_PROBE.json`.

---

## 1. SHA / duplicate inventory

Scanned **91** image/video files under `public/media/**`. **9** identical-SHA groups.

### Identical SHA-256 pairs — keep vs unwire

#### `d0b934adf4f52124…`
- `/media/archive/interviews/forthcoming-faith-in-classroom.jpg`
- `/media/interviews/faith-in-the-classroom.jpg`
- **Decision:** KEEP archive/forthcoming bytes on disk. UNWIRE `/media/interviews/*` (done: emptied `src/content/interviews.ts`). Prefer unwire over delete.

#### `f6536dd93b3ad5a3…`
- `/media/archive/interviews/forthcoming-faith-in-classroom.svg`
- `/media/interviews/faith-in-the-classroom.svg`
- **Decision:** KEEP archive/forthcoming bytes on disk. UNWIRE `/media/interviews/*` (done: emptied `src/content/interviews.ts`). Prefer unwire over delete.

#### `541fdd7a6ecb733d…`
- `/media/archive/interviews/forthcoming-life-of-service.jpg`
- `/media/interviews/a-life-of-service.jpg`
- **Decision:** KEEP archive/forthcoming bytes on disk. UNWIRE `/media/interviews/*` (done: emptied `src/content/interviews.ts`). Prefer unwire over delete.

#### `800ab24e5f68a9b6…`
- `/media/archive/interviews/forthcoming-life-of-service.svg`
- `/media/interviews/a-life-of-service.svg`
- **Decision:** KEEP archive/forthcoming bytes on disk. UNWIRE `/media/interviews/*` (done: emptied `src/content/interviews.ts`). Prefer unwire over delete.

#### `19e1136d93eda2ed…`
- `/media/archive/interviews/forthcoming-witness-in-community.jpg`
- `/media/interviews/witness-in-community.jpg`
- **Decision:** KEEP archive/forthcoming bytes on disk. UNWIRE `/media/interviews/*` (done: emptied `src/content/interviews.ts`). Prefer unwire over delete.

#### `cef2e3b7ada31519…`
- `/media/archive/interviews/forthcoming-witness-in-community.svg`
- `/media/interviews/witness-in-community.svg`
- **Decision:** KEEP archive/forthcoming bytes on disk. UNWIRE `/media/interviews/*` (done: emptied `src/content/interviews.ts`). Prefer unwire over delete.

#### `36f1003b75761fec…`
- `/media/brand/archive-cross-mark.svg`
- `/media/brand/favicon.svg`
- **Decision:** KEEP BOTH — intentional brand mark (header + favicon).

#### `4b89c1b68bcba537…`
- `/media/founder/javed-qadir-bakhsh-portrait-2026.jpg`
- `/media/founder/javed-qadir-bakhsh-portrait-final.jpg`
- **Decision:** KEEP `…-portrait-final.*` (wired in homepage CMS). Leave `…-2026.*` as orphan duplicate (identical bytes); do not delete without curator OK.

#### `c92eaa514085196c…`
- `/media/founder/javed-qadir-bakhsh-portrait-2026.webp`
- `/media/founder/javed-qadir-bakhsh-portrait-final.webp`
- **Decision:** KEEP `…-portrait-final.*` (wired in homepage CMS). Leave `…-2026.*` as orphan duplicate (identical bytes); do not delete without curator OK.

### Family Archive near-duplicates (same photo, different IDs)

- No same-byte pairs among CMS Family Archive `imageSrc` values (24 items; each path unique).
- **Cross-section near-dup wiring (keep both):**
  - `/media/archive/facebook/fb-historic-preacher-july-8.jpg` — People thematic frame (not in Family Archives CMS)
  - `/media/archive/facebook/fb-bishop-young-js-qadir.jpg` — People thematic frame **and** Family Archive id `fb-bishop-young-js-qadir`
  - `/media/archive/facebook/fb-church-interior-july-17.jpg` — People thematic frame (not in Family Archives CMS)
  - **Decision:** KEEP both People thematic wirings. They are not second biography claims; do not invent replacement photos. Only `fb-bishop-young-js-qadir` is also a Family Archive entry.

### Disk orphans (present, not referenced by CMS/TS)

- `/media/archive/facebook/fb-bashir-jewan-portrait.jpg`
- `/media/archive/facebook/fb-church-exterior-july-17.jpg`
- `/media/archive/facebook/fb-stained-glass-altar-july-17.jpg`
- `/media/archive/forthcoming-frame.jpg`
- `/media/archive/interviews/forthcoming-faith-in-classroom.jpg`
- `/media/archive/interviews/forthcoming-faith-in-classroom.png`
- `/media/archive/interviews/forthcoming-faith-in-classroom.svg`
- `/media/archive/interviews/forthcoming-life-of-service.jpg`
- `/media/archive/interviews/forthcoming-life-of-service.png`
- `/media/archive/interviews/forthcoming-life-of-service.svg`
- `/media/archive/interviews/forthcoming-witness-in-community.jpg`
- `/media/archive/interviews/forthcoming-witness-in-community.png`
- `/media/archive/interviews/forthcoming-witness-in-community.svg`
- `/media/brand/facebook-page-profile.png`
- `/media/brand/favicon.svg`
- `/media/cathedrals/CATHEDRAL_OF_St._MARY_THE_VIRGIN_CHURCH_MULTAN_1280px.jpg`
- `/media/cathedrals/Cathedral_Church_of_the_Resurrection_from_front_gate.jpg`
- `/media/cathedrals/Sialkot_Cathedral_Pakistan_WLMP_fifty_five.jpg`
- `/media/cathedrals/St_Johns_Cathedral_Peshawar.jpg`
- `/media/cathedrals/Trinity_Cathedral_Karachi.jpg`
- `/media/founder/founder-portrait-card.jpg`
- `/media/founder/founder-portrait-cutout.png`
- `/media/founder/founder-portrait-hero-clean.jpg`
- `/media/founder/founder-portrait-hero.webp`
- `/media/founder/founder-portrait-square.jpg`
- `/media/founder/founder-portrait-square.webp`
- `/media/founder/javed-qadir-bakhsh-portrait-2026.jpg`
- `/media/founder/javed-qadir-bakhsh-portrait-2026.webp`
- `/media/founder/javed-qadir-bakhsh-portrait-final.webp`
- `/media/interviews/a-life-of-service.jpg`
- `/media/interviews/a-life-of-service.svg`
- `/media/interviews/faith-in-the-classroom.jpg`
- `/media/interviews/faith-in-the-classroom.svg`
- `/media/interviews/witness-in-community.jpg`
- `/media/interviews/witness-in-community.svg`

**Decision on orphans:** leave on disk; do **not** invent into CMS. Forthcoming placeholders and `portrait-2026` are superseded duplicates of wired assets.

---

## 2. Featured Interview videos — dimensions + locked aspect

| ID | Path | W×H | Duration | Native | featuredOnHome |
|---|---|---:|---:|---|---|
| `rab-ki-khidmat-4` | `/media/archive/interviews/youth/rab-ki-khidmat-4.mp4` | 720×1280 | 321.6s | **9:16** | True |
| `youth-empowerment` | `/media/archive/interviews/youth/youth-empowerment.mp4` | 960×720 | 463.4s | **4:3** | True |
| `prince-oneil-2` | `/media/archive/interviews/youth/prince-oneil-2.mp4` | 720×900 | 448.0s | **4:5** | True |
| `nahum-1-7` | `/media/archive/interviews/youth/nahum-1-7.mp4` | 1280×720 | 266.9s | **16:9** | False |

All four CMS `sourceUrl` values are Facebook `/reel/` links.

### Letterbox fill (`object-fit: contain`) if frame locked to 9:16 vs 4:5

| ID | Native | Fill @ 9:16 | Fill @ 4:5 |
|---|---|---:|---:|
| `rab-ki-khidmat-4` | 720×1280 | 100.0% | 70.3% |
| `youth-empowerment` | 960×720 | 42.2% | 60.0% |
| `prince-oneil-2` | 720×900 | 70.3% | 100.0% |
| `nahum-1-7` | 1280×720 | 31.6% | 45.0% |
| **Average** | — | **61.0%** | **68.8%** |

### Chosen locked aspect: **9:16 Reels** (kept + tightened)

**Why not switch to 4:5:** Files do **not** clearly match 4:5 better. Only **1/4** is native 4:5 (`prince-oneil-2`). Switching would **degrade** the primary true Reel (`rab-ki-khidmat-4`, 720×1280) from **100% fill → ~70%** with side bars. Landscapes stay dirty in either frame. Product rule + Meta Reel URLs already specify 9:16.

**Why letterboxing looked dirty:** mixed natives (9:16 / 4:5 / 4:3 / 16:9) inside tall 9:16, plus a double warm fill (container + video both `#1c1814`) and an inset white hairline that muddied the letterbox edge. `object-fit` was already `contain` (no public `cover` on interviews).

**CSS tighten implemented on box:**

- Locked frame remains `aspect-ratio: 9 / 16`
- Single letterbox field `#1c1814` on `.interviewMedia` only; video background transparent
- Removed inset white hairline on the dark frame
- Width `min(100%, 264px)` / `max-height: min(72vh, 528px)` for denser cards
- Portrait/landscape class hooks kept identical (no divergent crop)

Live measure after fix (`/interviews` @ 1280×900): cards **264×469**, CSS `9 / 16`, `object-fit: contain`, bg `rgb(28,24,20)`.

**Optional curator follow-up (not done):** re-export landscape talks as true 9:16, or set `featuredOnHome: false` on `youth-empowerment` to keep homepage portrait-cleaner without deleting content.

---

## 3. Grade / presentation issues

### Public `object-fit`

| Surface | Frame | object-fit |
|---|---|---|
| Featured Interviews (home + `/interviews`) | 9:16 | **contain** + warm letterbox |
| Family Archives / churches / People | 4:3 | **contain** on parchment |
| Hero portrait | ~3:4 | **contain** |
| Admin thumbs only | fixed | `cover` (admin chrome only) |

### Grade probe flags (gray mean / std heuristics)

Textures (`paper-grain`, `parchment-wash`) correctly flag as washed — intentional UI. Content flags (no caption/history edits made):

- `/media/archive/facebook/fb-bishop-johnston-qadir-bakhsh-35th-death-anniversary.jpg` — washed/high-key (mean=0.7961, std=0.165) — **KEEP as-is** (Facebook/source look; contain presentation)
- `/media/archive/facebook/fb-board-honour-pastors-10-16.jpg` — low-contrast/flat (mean=0.6222, std=0.0955) — **KEEP as-is** (Facebook/source look; contain presentation)
- `/media/archive/facebook/fb-gujranwala-seminary-memorial-tablet.jpg` — greyed-out (mean=0.5457, std=0.1219) — **KEEP as-is** (Facebook/source look; contain presentation)
- `/media/archive/facebook/fb-umc-pakistan-overseas-education-list.jpg` — washed/high-key (mean=0.8223, std=0.1789) — **KEEP as-is** (Facebook/source look; contain presentation)
- `/media/archive/interviews/forthcoming-faith-in-classroom.jpg` — greyed-out (mean=0.5324, std=0.1465) — **KEEP as-is** (Facebook/source look; contain presentation)
- `/media/archive/interviews/forthcoming-life-of-service.jpg` — washed/high-key (mean=0.8006, std=0.1589) — **KEEP as-is** (Facebook/source look; contain presentation)
- `/media/interviews/a-life-of-service.jpg` — washed/high-key (mean=0.8006, std=0.1589) — **KEEP as-is** (Facebook/source look; contain presentation)
- `/media/interviews/faith-in-the-classroom.jpg` — greyed-out (mean=0.5324, std=0.1465) — **KEEP as-is** (Facebook/source look; contain presentation)

Highest presentation pain remains landscape interviews letterboxed into 9:16 (see §2) — framing issue, not a grade rewrite.

---

## 4. Screenshots (1280×900)

Directory: `/workspace/hcop-parts/screen-audit-2026-09-23/`

- `home-1280x900.png`
- `home-interviews-1280x900.png`
- `archive-1280x900.png`
- `interviews-1280x900.png`


## 5. Files changed

| File | Change |
|---|---|
| `src/components/home/Home.module.css` | Tighten locked 9:16 interview frame; single warm letterbox; cleaner edge |
| `src/components/home/Interviews.tsx` | Comment documents 9:16 lock + mixed natives |
| `src/content/interviews.ts` | Unwired dead `interviewSlots` (empty) — SHA dupes of forthcoming placeholders |
| `/workspace/heritage-forge/hcop-media-redundant-AUDIT.md` | This report |
| `/workspace/hcop-parts/screen-audit-2026-09-23/*` | Inventory + screenshots |

No curator media bytes deleted. `pnpm typecheck` — clean.

---

## 6. User PC sync

**Synced:** yes (2026-09-23) via CopyFromBox to
`C:\Users\ofran\hcop-site\history-church-of-pakistan\`

| Box path | User PC path |
|---|---|
| `src/components/home/Home.module.css` | same relative |
| `src/components/home/Interviews.tsx` | same relative |
| `src/content/interviews.ts` | same relative |

Audit markdown remains on box at `/workspace/heritage-forge/hcop-media-redundant-AUDIT.md` (also copied beside site if present).


## Keep / drop cheat-sheet

| Item | Action |
|---|---|
| `rab-ki-khidmat-4` 9:16 Reel | **KEEP** featured |
| `prince-oneil-2` 4:5 | **KEEP** (letterboxed in 9:16) |
| `youth-empowerment` 4:3 / `nahum-1-7` 16:9 | **KEEP** on `/interviews`; optional later unfeature from home |
| `/media/interviews/*` placeholders | **UNWIRED** (empty `interviewSlots`); files retained |
| `javed-qadir-bakhsh-portrait-2026.*` | **ORPHAN** identical to `…-final.*`; keep final wired |
| Brand favicon = archive-cross-mark | **KEEP both** |
| FA × People `fb-bishop-young-js-qadir` | **KEEP both wirings** |
| Unwired FB stills on disk | **KEEP on disk**; do not invent into CMS |
