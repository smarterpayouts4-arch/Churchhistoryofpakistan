# Triple-check — Design #1 fidelity + icons/UI chrome
**Site:** History: Church of Pakistan  
**Date:** 2026-09-23 (America/New_York / ET)  
**Lane:** Visual fidelity vs Design #1 North Star + safe icon/CSS polish  
**Preview measured:** box `http://127.0.0.1:4000/` (Next listening; mirrors user PC preview path)  
**Evidence:** `/workspace/hcop-parts/triple-check-2026-09-23/`  
**No historical facts, captions, names, or church photos invented.**

---

## 1. Overall North Star closeness

| Roll-up | Score |
|---------|------:|
| **Weighted home closeness to Design #1 mood/structure** | **82 / 100** |

Palette, type, section order, Purpose card language, interview play chrome, and Contribute band are strong. Remaining gaps are mostly **curator/asset** items (church placeholders, hero botanical flourish density, Design #1’s fake interview cast must stay rejected) — not CSS token failures.

---

## 2. Section-by-section scores + concrete deltas

| Section | Score | Concrete deltas vs Design #1 fullpage |
|---------|------:|----------------------------------------|
| **Header** | **88** | Brand mark + sticky nav match museum language. Mock search icon correctly omitted. Less “journal masthead” weight than mock top bar. |
| **Hero** | **78** | Dual CTAs, Cormorant H1, gold-rule quote present. Still weaker than mock soft cutout / botanical corner flourishes; portrait uses hard frame + credit chip (chip OK). Concentric rings exist; mock has more botanical ornament. |
| **Our Purpose** | **90** *(after icon upgrade)* | Four parchment cards + double rules + ornament match. Icons now gold/burgundy line marks on parchment pads (was thin mono-burgundy on solid gold tiles). Spacing/air still slightly tighter than mock’s gallery air. |
| **Featured Interviews** | **86** | User override: click-to-play + uniform Facebook **4:5** covers (not mock 9:16 skill text). Equal-height cards verified. Play disc = parchment + gold stroke + burgundy triangle (on-brand). Mock used invented names — **correctly not copied**. |
| **Timeline** | **84** | Horizontal/vertical pattern matches. Years stay package-true (1852/1887/1970/1980/2011) — mock years are mood-only and rejected. |
| **Family Archives** | **80** | Real FB stills + provenance chips (honesty win). Mock’s sepia “family album” density higher; framing uses contain letterbox. |
| **Churches & Places** | **72** | Eight diocese cards correct vs mock’s four mislabeled samples. **Placeholders remain** where permission pending — do not stock-replace. Contain + 4:3 parchment pillars still uneven vs mock heroic frames. |
| **My Connection** | **88** | Portrait + list + pull-quote. ✓ emoji replaced with burgundy medallion (star) mark. Mock shield bullets slightly more ornate. |
| **Contribute CTA** | **92** | Closest match — deep burgundy band + cream button. |
| **Footer** | **85** | Deep band + nav + curator note. No social until real accounts (honesty). |

---

## 3. Icon / chrome inventory

| Asset | Path | Verdict |
|-------|------|---------|
| Purpose — pictorial | `public/media/icons/pictorial-history.svg` | **Redrawn** — overlapping frames, gold rear / burgundy front + mounts |
| Purpose — untold | `public/media/icons/untold-stories.svg` | **Redrawn** — open book, gold text lines + quill hint |
| Purpose — family | `public/media/icons/family-memories.svg` | **Redrawn** — stacked photos (was oval family bust; now matches Design #1 album motif) |
| Purpose — honouring | `public/media/icons/honouring-served.svg` | **Redrawn** — classical bust + gold pedestal |
| Connection bullet | `public/media/icons/connection-medallion.svg` | **New** — replaces ✓ emoji in My Connection / About lists |
| Brand mark | `public/media/brand/archive-cross-mark.svg` | On-brand; leave |
| Favicon | `public/favicon.ico` + `public/favicon.svg` / brand favicon | On-brand cross+book |
| Interview play SVG | inline in `InterviewPlayCard.tsx` | On-brand parchment disc / gold stroke / burgundy triangle |
| Rule ornament | `public/media/textures/rule-ornament.svg` | On-brand |
| Paper grain / wash | `public/media/textures/*` | Present (grain overlay OK) |
| Emoji leftovers | ✓ in MyConnection + About | **Superseded visually** via `.check` CSS background → medallion (glyph still in DOM as hidden text; harmless) |
| Lucide/Heroicons/Tailwind | — | **None** (CSS Modules + tokens only) |

### Purpose icons — before vs after judgment
- **Before:** thin mono `#6D2227` strokes on **solid gold** pads → dated “UI glyph on badge,” weak vs Design #1 parchment museum language.  
- **After:** antique gold `#AF8B58` + burgundy `#6D2227` pictorial strokes on **parchment pads** with gold hairline frame. Paths in `Purpose.tsx` unchanged.

---

## 4. Safe CSS polish applied

| Item | Change | Status |
|------|--------|--------|
| Sticky header clip (V-P1-5) | `scroll-margin-top: 5.5rem` on `section[id]`, `h2[id]`, section headings in `globals.css` | **Done** — measured `88px` on `#purpose` |
| Public Record readability (V-P1-6) | Label `0.72rem` (~11.5px), note `0.86rem` (~13.8px), more padding in `.archivePublicRecord*` | **Done** |
| Interview `max-height:520` (V-P1-1) | No leftover 520 clamp on `.interviewMedia`; `@media (max-width:480px)` sets `max-height: none` + keeps `aspect-ratio: 4/5` | **Confirmed clean** |
| Interview equal-height | Flex column cards + stretch grid; measured equal heights at 1280 & 480 | **Holds** |
| Purpose icon pad | Parchment pad (not solid gold fill) so dual-tone SVGs read | **Done** |
| Connection bullets | `.check` → medallion SVG background | **Done** |

### Interview grid metrics (post-fix)

| Width | Media ratio | Card heights | `max-height` |
|------:|------------:|--------------|--------------|
| 1280 | **0.800** (4:5) | 641 / 641 / 641 | — |
| 480 | **0.800** (4:5) | 717 / 717 / 717 | `none` |

Also spot-checked structure at **980** and **760** via full-page + interview crops (equal 4:5 shells visible).

---

## 5. Evidence files

Under `/workspace/hcop-parts/triple-check-2026-09-23/`:

- `home_w{1280,980,760,480}_{full,top,purpose,interviews}.png`
- `home_w1280_{churches,timeline,archives,connection,contribute}.png`
- `archive_w1280_full.png`, `archive_w1280_public_record.png`
- `icons_qa_parchment.png` (+ `icon_*.png` rasters)
- `_capture_log.txt`

---

## 6. Remaining gaps (need curator / assets — not inventable)

1. **Church placeholders** — keep until diocese-permitted photos; do not stock-replace.  
2. **Hero botanical flourish / softer portrait cutout** — ornament craft still below Design #1 density.  
3. **Church card letterboxing** — `object-fit: contain` on 4:3 frames still uneven (photo vs placeholder weight). Product call: curated `cover` crops vs keep contain honesty.  
4. **People page density** — still “forthcoming” / thin (content lane).  
5. **Family Archives sepia strip mood** — real FB holdings already better than empty CSS tiles; optional curator ordering only.  
6. **Design #1 mock names / wrong churches / wrong timeline years** — remain **forbidden** as content.  
7. Optional: replace residual ✓ characters in TSX with empty spans now that CSS paints the medallion (cosmetic DOM cleanup).

---

## 7. Files changed (exact)

```
public/media/icons/pictorial-history.svg
public/media/icons/untold-stories.svg
public/media/icons/family-memories.svg
public/media/icons/honouring-served.svg
public/media/icons/connection-medallion.svg          (new)
src/components/home/Home.module.css
src/styles/globals.css
docs/TRIPLE_CHECK_DESIGN_ICONS_2026-09-23.md         (this file)
```

`Purpose.tsx` paths unchanged. No Tailwind / icon kits added. No church media replaced. Security lane untouched.

---

## 8. Sync

Changed CSS/SVG/docs synced to user PC:

`C:\Users\ofran\hcop-site\history-church-of-pakistan\...`  
machineId `23bed386-aaba-4242-b717-d79dee604af5`

---

**Operator:** Grok Bot executor (triple-check design/icons)  
**Sign-off:** Icons upgraded to Design #1 parchment/gold/burgundy language with evidence; CSS polish for sticky scroll-margin, Public Record type, and interview 4:5 equal-height verified; overall closeness **~82%** with church placeholders and hero ornament as primary remaining gaps.
