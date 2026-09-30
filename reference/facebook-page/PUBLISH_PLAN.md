# Facebook harvest → site publish plan

**Repo:** `history-church-of-pakistan`  
**Prepared:** 2026-09-19 (America/New_York)  
**Scope:** Read-only analysis + plan only. Do **not** invent names, dates, or biographies beyond caption text. Do **not** modify site code until curator confirms this plan.  
**Source inventory:** `reference/facebook-page/INVENTORY.md`  
**Published wiring:** `src/content/family-archives.ts` + `public/media/archive/facebook/`

## Policy reminder (curator “all” + no invented facts)

| Rule | Application |
|------|-------------|
| Strong CAPTIONED COP items | Publish under **Family Archive** provenance; captions only |
| No invented names | Do not OCR-promote face IDs; do not normalize comment-only names into facts without curator OK |
| Captionless / unidentified | **Hold** until curator supplies caption or explicit OK |
| Nila Gumbad / mosque / Suhrawardi set | Not COP Family Archive by default; if “all” includes them → **Other Heritage / Lahore context** label, separate from Family Archive |
| Media already copied to `public/` but not wired | Do not wire captionless orphans into `family-archives.ts` |

---

## Diff summary

### A. Wired on site (`family-archives.ts`) — 8 IDs

| ID | Public JPG | Verification |
|----|------------|--------------|
| `fb-central-cathedral-75th-1975` | yes | facebook-caption |
| `fb-1974-coggan-lahore` | yes | facebook-caption *(inventory alias: `fb-coggan-1974`)* |
| `fb-1983-wcc-vancouver` | yes | facebook-caption *(inventory alias: `fb-wcc-1983`)* |
| `fb-bishops-sialkot-diocese` | yes | needs-verification (image heading) |
| `fb-gujranwala-seminary-memorial-tablet` | yes | needs-verification (author comment for location) |
| `fb-urdu-church-honour-plaque` | yes | needs-verification (no name OCR) |
| `fb-board-of-honour-central-church` | yes | facebook-caption *(inventory row: `fb-pastors-roll`)* |
| `fb-bishop-johnston-qadir-bakhsh-35th-death-anniversary` | yes | facebook-caption |

### B. In `public/media/archive/facebook/` but **not** in `family-archives.ts` (orphans / unwired) — 7 files

| File stem | Suggested class | Note |
|-----------|-----------------|------|
| `fb-official-board-cathedral-construction` | ready_to_publish | Overlay text: “Official board at time Construction of Cathedral” |
| `fb-board-honour-pastors-10-16` | ready_to_publish (companion) | Continuations of pastors roll (names 10–16); wire only as companion graphic to published Board of Honour; do not promote list names as verified facts |
| `fb-sialkot-bishops-cover` | ready_to_publish (with caption from related post) | Cover composite; right panel labels Bishop J.S. Qadir Bakhsh; pair with `fb-bishop-young-js-qadir` caption if curator OK |
| `fb-church-exterior-july-17` | hold_needs_caption | Captionless; should **not** have been wired; leave unwired |
| `fb-church-interior-july-17` | hold_needs_caption | Captionless orphan JPG |
| `fb-stained-glass-altar-july-17` | hold_needs_caption | Captionless orphan JPG |
| `fb-historic-preacher-july-8` | hold_needs_caption | Captionless orphan JPG |

### C. Inventory ID aliases

| Inventory ID | Published / file ID |
|--------------|---------------------|
| `fb-coggan-1974` | `fb-1974-coggan-lahore` |
| `fb-wcc-1983` | `fb-1983-wcc-vancouver` |
| `fb-pastors-roll` | `fb-board-of-honour-central-church` (+ companion `fb-board-honour-pastors-10-16`) |
| `fb-church-july-11-youngson` | screenshot stem `fb-church-july-11-youngson-comment` |

---

## Classification of inventory items

### 1. `already_published` (8)

Canonical IDs present in both `public/media/archive/facebook/` **and** `src/content/family-archives.ts`:

1. `fb-central-cathedral-75th-1975`
2. `fb-1974-coggan-lahore` / `fb-coggan-1974`
3. `fb-1983-wcc-vancouver` / `fb-wcc-1983`
4. `fb-bishops-sialkot-diocese`
5. `fb-gujranwala-seminary-memorial-tablet`
6. `fb-urdu-church-honour-plaque`
7. `fb-board-of-honour-central-church` / `fb-pastors-roll`
8. `fb-bishop-johnston-qadir-bakhsh-35th-death-anniversary`

**Action:** No change required. Optional later: cross-check claims vs `docs` / `RESEARCH_AND_SOURCES.md` before elevating verificationStatus to published-source.

---

### 2. `ready_to_publish` (inventory-backed + harvested-with-caption)

**Criteria:** usable image on disk (images/ and/or screenshots/) + COP/church relevance + non-empty caption (FB caption, or image overlay/heading treated like prior published artifact posts) + **not** already in `family-archives.ts`.

#### 2a. Inventory IDs ready (or ready after light crop)

| ID | Caption basis | Image on disk | Notes |
|----|---------------|---------------|-------|
| `fb-umc-pakistan-overseas-education-list` | Image heading: “Development of Human Resource… United Methodist Church in Pakistan”; author comment exists | `images/` + `screenshots/` | Publish like tablet/bishops display: `needs-verification`; **do not** normalize numbered names from graphic into site biography facts |
| `fb-founder-methodist-church-july-16` | Verbatim: “Founder of Methodist Church” | `images/` + `screenshots/` | Caption-only title; **do not invent** the person’s name from the portrait |
| `fb-official-board-cathedral-construction` | Overlay on image (and already a public JPG) | `images/` + public JPG | Not in main inventory table — add to inventory when wiring; caption = overlay text only; no invented board-member names |

#### 2b. Harvested files with strong FB captions (not yet in inventory table) — add to inventory, then publish

These screenshots exist under `screenshots/` (some also under `images/`) but were **never logged** in the inventory table. Treat as ready once inventoried; crop FB chrome before public JPG.

| ID (filename stem) | Observed FB caption summary (from screenshot UI) | Disk |
|--------------------|--------------------------------------------------|------|
| `fb-bashir-jewan-portrait` | Bishop Bashir Jewan — 1st Bishop of Hyderabad Diocese; 8th Moderator COP; elected/installed 1981 | screenshots only |
| `fb-mrs-samuel-pervaiz` | Mrs. Samuel Pervaiz, wife of Bishop Samuel Pervaiz (3rd Bishop of Sialkot / Moderator); Women’s Fellowship, nursing, youth; photo at Hunter Memorial Church, Sialkot | screenshots only |
| `fb-sewak-bm-augustine` | 46th death anniversary of The Venerable Sewak B. M. Augustine; father of Bishop Patrick Augustine; priest at Christ Church, Rawalpindi | screenshots only |
| `fb-bishop-young-js-qadir` | “1st Bishop of Sialkot. Bishop Young and Bishop J.S Qadir Bakhsh 2nd Bishop of Sialkot.” | screenshots only |
| `fb-sialkot-bishops-cover` | Same post/context as above (composite cover); right panel text names Bishop J.S. Qadir Bakhsh, Moderator 1980–86 | images/ + public JPG |
| `fb-district-superintendent-lahore-1-9` | Graphic header: District Superintendents of Lahore District (Methodist before Union 1970) / Raiwind Diocese COP | images/ + screenshots |
| `fb-board-honour-pastors-10-16` | Companion to Board of Honour / pastors roll (list 10–16) | images/ + public JPG |
| `fb-fredrick-bagtaney-1984` | **Filename vs caption mismatch risk** — screenshot UI caption observed about Bishop Bashir Jewan consecration (Apr 10, 1981) by Bishop Johnston Safdar Qadir Bakhsh; filename suggests “Fredrick Bagtaney”. **Re-harvest caption before publish; do not invent.** | screenshots only |

**Top 10 ready_to_publish IDs (priority order for next wire):**

1. `fb-bashir-jewan-portrait`
2. `fb-mrs-samuel-pervaiz`
3. `fb-sewak-bm-augustine`
4. `fb-bishop-young-js-qadir`
5. `fb-official-board-cathedral-construction`
6. `fb-district-superintendent-lahore-1-9`
7. `fb-umc-pakistan-overseas-education-list`
8. `fb-sialkot-bishops-cover`
9. `fb-board-honour-pastors-10-16`
10. `fb-founder-methodist-church-july-16`

---

### 3. `harvest_needed` (in inventory / known posts — no usable image file)

| ID | Why |
|----|-----|
| `fb-rudvin-1998` | Caption logged (~4d); **no** file under `images/` or `screenshots/` |
| `fb-armstunz` | Caption logged (~4d); **no** file; spelling/name needs check vs Methodist records |
| `fb-bishops-couple` | Caption logged (~5d); **no** file |
| `fb-church-july-11-youngson` | CDN download 403; only comment screenshot (`fb-church-july-11-youngson-comment`); need clean image + curator caption (comment ≠ caption) |
| `fb-historic-sermon-july-8` | CDN 403; screenshot only — prefer clean re-download when logged in |
| `fb-church-history-list-july-7` | CDN 403; screenshot only — prefer clean re-download |

**Action:** Browser harvest while curator session is live; save PNG/JPG under `images/`; update inventory with verbatim captions.

---

### 4. `hold_needs_caption` (no FB caption / unidentified)

Hold unless curator supplies a caption or explicit “publish unlabeled as architecture/portrait artifact” OK. **Do not invent locations or names.**

| ID | Disk | Extra note |
|----|------|------------|
| `fb-historical-gravestone-unknown` | images + screenshots | Inscription not legible in harvest |
| `fb-church-interior-july-17` | images + screenshots + **orphan public JPG** | Location not stated |
| `fb-stained-glass-altar-july-17` | images + screenshots + **orphan public JPG** | Identity/location not stated |
| `fb-historic-church-tower-july-17` | images + screenshots | Location unverified |
| `fb-church-exterior-july-17` | images + screenshots + **orphan public JPG** | Location unverified |
| `fb-historic-preacher-july-8` | images + screenshots + **orphan public JPG** | Person/venue unidentified |
| `fb-historic-sermon-july-8` | screenshots only | Same hold + harvest quality |
| `fb-church-july-11-youngson` | comment screenshot only | Comment suggests Youngson Memorial Church — treat as lead, not caption fact, until curator OK |
| `fb-church-history-list-july-7` | screenshots only | Partial list slide; no caption |
| `fb-unidentified-historical-portrait-july-2` | images + screenshots | No identity |
| `fb-turbaned-clergy-portrait-july-2` | images + screenshots | No identity |
| `fb-gujranwala-seminary-professor-portrait` | images + screenshots | Author comments discuss seminary professor — **comments ≠ caption**; hold or curator OK to use comment as caption |
| `fb-church-service-aug10` | images + screenshots | Not in inventory; no caption visible |
| `fb-church-service-aug10-2` | images + screenshots | Not in inventory; no caption visible |
| `fb-cross-queen-gisela` | images + screenshots | Not in inventory; ornate crucifix; **no caption harvested** — filename must not invent “Queen Gisela” as verified fact without caption text |

---

### 5. `hold_non_cop_context` — Nila Gumbad / mosque / related heritage set

Prior policy: hold. Curator now said **“all”** → prepare as publishable under an **Other Heritage / Lahore context** gallery (or labeled section), **not** COP Family Archive, and still without invented facts.

| ID | Caption? | Disk | Proposed site label |
|----|----------|------|---------------------|
| `fb-nila-gumbad-mosque-preservation` | Yes — “The Punjab Government oversees the preservation of Nila Gumbad Mosque's original state.” | images + screenshots | Other Heritage — Nila Gumbad (caption only) |
| `fb-nila-gumbad-aerial` | Yes — “After encouragement of Nila Gumband” *(spelling preserved)* | images + screenshots | Other Heritage — Nila Gumbad |
| `fb-nila-gumbad-mosque-site-2` | No | images + screenshots | Other Heritage — pair with captioned preservation post; no invented caption |
| `fb-neela-gumbad-masjid-infographic` | No (text-in-image claims) | images + screenshots | Other Heritage — graphic; claims need independent check; do not elevate image text to Published Source |
| `fb-suhrawardi-lineage-infographic` | No | images + screenshots | Other Heritage — not COP |
| `fb-sheikh-abdul-razzaq-mausoleum-infographic` | No | images + screenshots | Other Heritage — legend attribution; check before elevate |

**Curator choice required:**  
(A) Skip entirely (prior default), or  
(B) Publish under **Other Heritage** with explicit non-COP label.

---

## `need_browser_harvest` — newest / incomplete / not in inventory

Inventory Status notes: initial pass 2026-09-17; deeper photo-grid July 2–17; “additional older photos may remain.” Curator has now logged into Facebook — use the live session to:

1. **Capture missing inventory posts:** `fb-rudvin-1998`, `fb-armstunz`, `fb-bishops-couple` (images + verbatim captions).
2. **Re-download CDN-403 items:** `fb-church-july-11-youngson`, `fb-historic-sermon-july-8`, `fb-church-history-list-july-7`.
3. **Inventory the already-downloaded but undocumented stems** (add rows to `INVENTORY.md` with verbatim captions, dates, URLs):

| Stem | Why harvest/inventory |
|------|----------------------|
| `fb-bashir-jewan-portrait` | Strong caption; screenshot only — get full URL + clean image |
| `fb-mrs-samuel-pervaiz` | Strong caption; screenshot only |
| `fb-sewak-bm-augustine` | Strong caption; screenshot only |
| `fb-bishop-young-js-qadir` | Strong caption; screenshot only |
| `fb-fredrick-bagtaney-1984` | **Reconcile filename vs actual caption** before any publish |
| `fb-district-superintendent-lahore-1-9` | Add inventory row; capture any post caption beyond graphic |
| `fb-official-board-cathedral-construction` | Add inventory row + FB URL if available |
| `fb-board-honour-pastors-10-16` | Add as companion to pastors roll |
| `fb-sialkot-bishops-cover` | Link to bishop-young post |
| `fb-church-service-aug10` / `-2` | Caption hunt |
| `fb-cross-queen-gisela` | Caption hunt; do not trust filename as fact |
| `fb-bishop-johnston-qadir-bakhsh-35th-death-anniversary` | Already published — still add full inventory row if missing from archival table |

4. **Scan for posts newer than inventory** (after ~2026-09-17 / relative “~4d” items): any feed items not in the table → new IDs + screenshots + CDN images. Skip non-archival per inventory (“Youth empowerment”, shoutouts, Rab Ki Khidmat graphics, FAKE POST warnings, captionless library chats) unless curator overrides.
5. **Spelling checks while live:** Samson vs Sampson; Armstunz vs Methodist published spelling.

---

## Recommended publish waves (no code yet)

### Wave 0 — Hygiene (no new content)
- Leave captionless orphan JPGs unwired (`church-exterior/interior`, `stained-glass-altar`, `historic-preacher`).
- Optionally remove or quarantine those orphans from `public/media/archive/facebook/` later (out of scope for this plan file).

### Wave 1 — Strong captioned COP (Family Archive)
Wire after inventory rows + cropped JPGs for Top 10 list above (especially Bashir Jewan, Mrs. Samuel Pervaiz, Sewak B.M. Augustine, Bishop Young / J.S. Qadir Bakhsh pair, official board, district superintendents list).

### Wave 2 — Browser harvest completions
Rudvin, Armstunz, bishops-couple + CDN re-downloads → classify again (most should become ready_to_publish if captions hold).

### Wave 3 — Holds with curator captions
July architecture set, unidentified portraits, Youngson (if curator confirms location), seminary professor (if curator OK to use author comment as caption).

### Wave 4 — Other Heritage (optional)
Nila Gumbad set under separate label if curator chooses option B.

---

## Counts (this plan)

| Class | Count | Notes |
|-------|------:|-------|
| `already_published` | **8** | Canonical wired IDs (aliases collapsed) |
| `ready_to_publish` | **10** | Top priority list (mix of inventory + harvested-with-caption) |
| `ready_to_publish` inventory-only (subset) | **3** | `fb-umc-pakistan-overseas-education-list`, `fb-founder-methodist-church-july-16`, `fb-official-board-cathedral-construction` |
| `harvest_needed` | **6** | No usable/clean image for inventory-known posts |
| `hold_needs_caption` | **15** | Includes 3 non-inventory stems (aug10×2, cross-queen-gisela) |
| `hold_non_cop_context` | **6** | Full Nila Gumbad / related set |
| `need_browser_harvest` | **12+** | Undocumented stems + missing files + feed delta |
| Unwired public orphans | **7** | 3 ready-ish / 4 should stay hold |

**Canonical inventory archival rows analyzed:** ~30 unique content IDs (plus aliases and published-only rows).

---

## Explicit non-actions until curator confirms

- Do not invent names for founder-methodist, unidentified portraits, or board members.
- Do not OCR Urdu plaque / marble tablet names into site facts beyond existing needs-verification entries.
- Do not wire captionless July architecture JPGs into `family-archives.ts`.
- Do not mix Nila Gumbad into Family Archive without Other Heritage labeling.
- Do not publish `fb-fredrick-bagtaney-1984` until caption/filename reconciled via browser harvest.

---

## Paths

| Artifact | Path |
|----------|------|
| This plan | `reference/facebook-page/PUBLISH_PLAN.md` |
| Inventory | `reference/facebook-page/INVENTORY.md` |
| Source images | `reference/facebook-page/images/` |
| Screenshots | `reference/facebook-page/screenshots/` |
| Public copies | `public/media/archive/facebook/` |
| Site content | `src/content/family-archives.ts` |
