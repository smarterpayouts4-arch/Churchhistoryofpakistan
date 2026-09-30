# Dedup / no-redundancy audit — Family Archive

**Date:** 2026-09-19 ~21:32 EDT (America/New_York)  
**Repo:** `history-church-of-pakistan`  
**Scope:** `src/content/family-archives.ts`, `public/media/archive/facebook/`, Interviews UI vs Family Archive stills, inventory aliases  
**Rule:** Safe removals only when clearly the same post/photo; no invented captions; no harvest deletes; no youth videos wired.

## Summary counts

| Metric | Count |
|--------|------:|
| Family Archive items before | 26 |
| **Duplicates removed** from `family-archives.ts` | **2** |
| Family Archive items after | 24 |
| **Related series kept** (distinct posts) | **3 series** (see table) |
| **Misregistrations found** | **4** (3 Interview still slots + content-model gap) |
| Exact duplicate IDs in TS | 0 |
| Exact caption-text collisions | 0 |
| `imageSrc` path collisions (two IDs → same path) | 0 (byte-identical twin used two paths — fixed) |
| Orphan public FB JPGs (not in family-archives **or** Interviews UI) | 5 listed; none deleted |

---

## removed

True same-post / same-file duplicates removed from `family-archives.ts` only. Public JPGs and `reference/` harvest files retained on disk.

| Removed ID | Kept ID | Evidence | Why weaker |
|------------|---------|----------|------------|
| `fb-sialkot-bishops-cover` | `fb-bishop-young-js-qadir` | **SHA-256 identical** public JPGs (`fe1ef664…`); same 1400×787 dual portrait. WIRE_LOG notes young-js-qadir was sourced from `images/fb-sialkot-bishops-cover.png`. | Cover entry reused “related post” caption; kept entry has the direct FB caption transcription. |
| `fb-bashir-jewan-portrait` | `fb-bashir-jewan-moderator-1981` | Same outdoor purple-waistcoat portrait (different crop sizes 480×510 vs 438×598); overlapping Sep 10 / comments Sep 10–11 window; captions both assert 1st Bishop of Hyderabad + 8th Moderator 1981. | Portrait caption was inventory **summary**; moderator entry is **verbatim** (“Faithfully severed…”) with photo `fbid`. |

**Follow-on safe retarget (not a harvest delete):** `src/app/people/page.tsx` “Diocesan memory” frame now points at `/media/archive/facebook/fb-bishop-young-js-qadir.jpg` (byte-identical twin) so the removed cover path is not preferred in UI.

---

## kept_related_series

Distinct posts / distinct images — **not** redundancy. Keep all listed IDs.

| Series | Kept IDs | Why distinct |
|--------|----------|--------------|
| Bashir Jewan | `fb-bashir-jewan-moderator-1981`, `fb-bashir-jewan-hyderabad-1980`, `fb-bashir-jewan-rare` | Moderator = outdoor portrait + 1981 moderator caption; Hyderabad-1980 = four-panel collage + diocese-establishment caption; Rare = indoor magenta-shirt portrait + consecration Apr 10, 1981 caption. |
| Bishop W.G. / William G. Young | `fb-bishop-wg-young`, `fb-bishop-william-g-young` | Different studio portraits (different pose/hairline/crop); different FB captions (“Bishop W.G. Young…” vs “Bishop Dr. William G. Young…”); different `fbid`s. Same person, two posts. |
| Johnston Safdar Qadir Bakhsh | `fb-bishop-johnston-qadir-bakhsh-35th-death-anniversary`, `fb-bishops-couple`, `fb-bishop-young-js-qadir` (paired composite) | Memorial B&W portrait; colour couple portrait; Young + J.S. Qadir dual composite — three different visuals/captions. |
| Board of Honour | `fb-board-of-honour-central-church`, `fb-board-honour-pastors-10-16` | Primary roll graphic vs companion entries 10–16 — intentional pair, not dup. |

---

## misregistration

Content model: **Featured Interviews = youth motivational videos only**; **Family Archives = historical photos + captions**. Do not invent video until harvest provides it.

| Location | Issue | Status |
|----------|-------|--------|
| `src/components/home/Interviews.tsx` | Three forthcoming cards use Family Archive **stills** (`fb-bishop-johnston-qadir-bakhsh-35th-death-anniversary`, `fb-gujranwala-seminary-memorial-tablet`, `fb-historic-preacher-july-8`) as interview card imagery | **MISREGISTRATION** — flagged; left in place until youth videos land. `src/content/interviews.ts` already has thematic `/media/interviews/*` slots unused by this component. |
| `src/app/interviews/page.tsx` | Same three Family Archive stills | **MISREGISTRATION** — same as home. |
| Content-model gap | Interviews UI presents still-photo “Interview archive” cards; Featured Interviews must be videos | **MISREGISTRATION** of medium (photo ≠ video). No video wired (correct: harvest not providing youth videos yet). |
| Folder check | FB historical under `public/media/interviews/` or `public/media/brand/` | **None found.** All FB publish JPGs remain under `public/media/archive/facebook/`. |

---

## orphans

Public JPGs under `public/media/archive/facebook/` **not** referenced by `family-archives.ts` **or** Interviews UI (`Interviews.tsx` / `interviews/page.tsx`). **Not deleted** (captionless / post-dedupe leftovers listed first).

| Public path | Notes |
|-------------|-------|
| `/media/archive/facebook/fb-church-exterior-july-17.jpg` | Captionless hold (INVENTORY / WIRE_LOG). |
| `/media/archive/facebook/fb-church-interior-july-17.jpg` | Captionless hold; still used by `people/page.tsx` thematic frame only (not Family Archive / Interviews registries). |
| `/media/archive/facebook/fb-stained-glass-altar-july-17.jpg` | Captionless hold. |
| `/media/archive/facebook/fb-bashir-jewan-portrait.jpg` | Left after removing weaker TS entry; harvest/reference retained. |
| `/media/archive/facebook/fb-sialkot-bishops-cover.jpg` | Byte-identical twin of kept `fb-bishop-young-js-qadir.jpg`; file kept on disk. |

**Not orphans (referenced by Interviews UI):** `fb-historic-preacher-july-8.jpg`, `fb-bishop-johnston-qadir-bakhsh-35th-death-anniversary.jpg`, `fb-gujranwala-seminary-memorial-tablet.jpg` — but their Interview use is misregistration (above).

**Also note:** `fb-historic-preacher-july-8` remains intentionally **unwired** in Family Archive (no FB caption) while used as Interview thematic still — double concern (orphan-from-archive + interview misregistration).

---

## inventory vs site (alias check)

Inventory early-table aliases vs wired IDs — **not** double-published under both names on the site.

| Inventory alias | Wired site ID | Double-published? |
|-----------------|---------------|-------------------|
| `fb-wcc-1983` | `fb-1983-wcc-vancouver` | No — only wired ID on site |
| `fb-coggan-1974` | `fb-1974-coggan-lahore` | No |
| `fb-pastors-roll` | `fb-board-of-honour-central-church` | No |
| `fb-historic-sermon-july-8` | (none; related `fb-historic-preacher-july-8` unwired in Family Archive) | No |

Removed IDs (`fb-bashir-jewan-portrait`, `fb-sialkot-bishops-cover`) remain in INVENTORY harvest history; they are no longer live Family Archive registrations.

---

## Checks performed

- Duplicate `id` values in `family-archives.ts`: none  
- Exact identical `caption` strings across IDs: none  
- Two IDs → same `imageSrc` string: none (byte-identical files used distinct paths; fixed by removing cover entry)  
- SHA-256 scan of `public/media/archive/facebook/*.jpg`: one identical pair (cover / young-js-qadir)  
- FB-named files under `public/media/interviews/` or `brand/`: none  

## Actions applied

1. Removed `fb-bashir-jewan-portrait` and `fb-sialkot-bishops-cover` from `src/content/family-archives.ts`.  
2. Retargeted `people/page.tsx` cover twin → `fb-bishop-young-js-qadir.jpg`.  
3. Wrote this report; appended `WIRE_LOG.md`.  
4. Did **not** delete reference harvest files or orphan JPGs; did **not** wire youth videos.
