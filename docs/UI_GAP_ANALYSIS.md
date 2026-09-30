# UI_GAP_ANALYSIS — History: Church of Pakistan (Phase 1)

**Repo:** `/workspace/heritage-forge/history-church-of-pakistan/`  
**Design #1 reference:** `/workspace/heritage-forge/reference/design/design-01-archival-heritage-reference.jpg`  
**Also:** package `assets/design-reference/design-01-archival-heritage-reference.jpg` + `docs/DESIGN_SYSTEM.md`  
**Audit date:** 2026-09-17 (America/New_York)  
**Scope:** Why the live homepage feels “blah” vs Design #1 — **analysis only; no redesign in this phase.**

**Hard constraint:** Design #1 mock interview names and church labels that conflict with package data are **mood only**. Do not treat them as historical facts. Live content must follow `src/content/*` / package `data/*`.

---

## 1. Why it looks blah (executive summary)

The live site already has the **right bones**: parchment/burgundy tokens, Cormorant + Source Sans, section order matching the package homepage map, honest placeholders, and real cathedral photos for five dioceses. It still reads as a **competent typed layout** rather than an **archival album / museum piece** because Design #1’s sensory density is missing:

1. **No paper grain / material texture** — flat fills vs stained parchment.
2. **Placeholder sections dominate the fold rhythm** — interviews + family archives are empty states with CSS faux-art, so the page alternates “real photo → empty → real photo → empty.”
3. **Icons are typographic stubs**, not illustrated archival motifs.
4. **Hero lacks soft cutout + botanical flourish**; portrait sits in a hard frame with mild CSS filter.
5. **Hierarchy is flatter** — many similar card borders, similar section padding, less editorial contrast between “document” and “gallery.”
6. **Eight church cards in a 4-column grid** (correct per package) look busier and more “dashboard” than the mock’s four heroic frames.
7. **Heavy unoptimized photos + one soft Karachi image** undermine the documentary polish the mock implies.

Palette and fonts are largely on-brief; the gap is **texture, iconography, imagery density, and empty-state craft** — not a wrong color system.

---

## 2. Global gaps vs Design #1 / DESIGN_SYSTEM

| Dimension | Design #1 / package system | Live Next app | Gap severity |
|-----------|----------------------------|---------------|--------------|
| Background material | Parchment + visible grain | Flat `--color-parchment` | **High** |
| Ornament | Corner flourishes, double rules sparingly | Hero CSS rings only | Medium |
| Display type | Large editorial serif H1 | Cormorant present; good scale | Low |
| Body type | Clean readable; mock leans serif-heavy | Source Sans 3 (package-safe) | Low (intentional) |
| Accent gold | Fine rules / icons | Used sparingly (strap dots, borders) | Medium — underused on icons |
| Imagery mix | Cutout portrait + color architecture + sepia archives | Portrait + architecture; archive/interview empty | **High** |
| Iconography | Hand-drawn archival icons | Unicode glyphs | **High** |
| Spacing | Generous editorial beige-space | `--space-9` sections — decent | Low–medium |
| Motion | Restrained | Reduced-motion OK; little hover craft | Low |
| Search / social | Mock chrome | Correctly omitted | None (honesty win) |

---

## 3. Empty / thin sections (honesty vs beauty)

These are **correctly empty of invented facts** but visually hollow:

| Section | Live | Why it feels empty | Repair direction (later) |
|---------|------|--------------------|--------------------------|
| Featured Interviews | 3 identical “coming soon” cards + gradient + ▶ | No faces, no titles variety, long meta copy | Stronger empty-state illustration; keep “coming soon”; **never** use mock names |
| From the Family Archives | 4 CSS gradient tiles | Reads as “UI pattern,” not photographs | Better archival empty art **or** wait for rights-cleared stills; no stock fake families |
| Churches (3 of 8) | SVG line-art placeholders | Interrupts photo rhythm | Diocese-permitted photos when available |
| People / Archive routes | Forthcoming copy | Off-home but linked from nav | Content when real |

**Do not fill emptiness with Design #1’s fake interviewees or mislabeled churches.**

---

## 4. Hierarchy gaps

| Issue | Detail |
|-------|--------|
| Section sameness | Most blocks share `section` + 1px border bottom + similar H2 ink color — Design #1 alternates paper/parchment/timeline wash more theatrically (timeline wash exists; grain does not). |
| Card chrome | Purpose / interview / place / archive cards all use similar paper + border language — few “hero objects.” |
| Rights badges | Necessary for honesty; large dark badges on every church card compete with cathedral identity (craft, don’t remove). |
| Forthcoming banners | Dashed boxes under interviews/archives are honest but visually apologetic; Design #1 hides emptiness behind fake content — we must stay honest with better empty craft. |
| Guiding Principle | Strong italic display (good); sits after CTA — fine order; could use more ornament later. |
| Connection list | Plain paragraphs vs mock’s checkmark list — weaker scannability (content must stay verbatim from package). |

---

## 5. Imagery / texture / icon / spacing gaps

### Imagery

- Hero: hard rectangular frame + `saturate/sepia` filter vs mock soft bottom fade / cutout.
- Churches: five real photos good; Karachi soft; three SVGs; eight-up grid denser than mock four-up.
- Interviews / archives: **no real images** (correct).
- No sepia documentary strip for family archives.

### Texture

- Starter site: fixed full-page noise overlay (`body:before` SVG turbulence).
- Live: **absent** → biggest single “museum vs wireframe” difference.

### Icons

- Purpose: Unicode in gold-ring circles.
- Need: four line icons (photograph, book/quill, album, commemorative figure) on textured squares per mock / DESIGN_SYSTEM “tiny cross/book icon motifs.”

### Spacing

- Desktop section padding ~96px (`space-9`) — close to system (88–120px).
- Card gaps ~1–1.35rem — slightly tighter than mock’s airy gallery.
- Hero min-height 720px — ambitious; mobile collapses well.
- Shell max 72rem (~1152px) vs system note 1180–1240px — minor.

---

## 6. Section-by-section vs Design #1

### Header

| Design #1 | Live | Gap |
|-----------|------|-----|
| Title left, links, search icon | Brand mark + title + sticky nav; mobile Menu | No search (**keep omitted**); mark is good; less “journal masthead” weight |

### Hero

| Design #1 | Live | Gap |
|-----------|------|-----|
| Soft parchment, botanical corners, cutout portrait, dual CTAs, script/hand quote | Two-column grid, framed portrait, Explore / Watch CTAs, italic quote with gold rule | Missing grain + flourish + fade; portrait label uses “Project Curator” (correct); quote uses Cormorant italic not script font |

**Fact note:** Mock may imply a personal name on the portrait; live correctly uses curator placeholder pending `OPEN_QUESTIONS.md`.

### Our Purpose

| Design #1 | Live | Gap |
|-----------|------|-----|
| Four icon cards with drawn icons on textured squares | Four cards, Unicode icons, inner gold hairline | Icon + texture gap; copy matches package intent |

### Featured Interviews

| Design #1 | Live | Gap |
|-----------|------|-----|
| Three named stories with portraits + play | Three “Interview story coming soon” + gradients | **Largest emptiness gap**; mock names are **NOT** to be copied |

### Churches & Places

| Design #1 | Live | Gap |
|-----------|------|-----|
| Four mislabeled sample churches | **Eight** package cathedrals (correct) | Density + 3 SVG placeholders + Karachi quality; mock church names **must not** replace package identities |

### A Journey Through Time

| Design #1 | Live | Gap |
|-----------|------|-----|
| Horizontal line; years 1818…2000+ | Horizontal (desktop) / vertical (mobile); **1852, 1887, 1970, 1980, 2011** + source links | Visual pattern OK; mock years are **wrong** — keep package timeline |

### From the Family Archives

| Design #1 | Live | Gap |
|-----------|------|-----|
| Four sepia photographs | Four CSS faux tiles + provenance chips | High visual gap; content honesty correct |

### My Connection

| Design #1 | Live | Gap |
|-----------|------|-----|
| Portrait + checklist + quote | Portrait + verbatim paragraphs | Missing checkmarks / pull-quote treatment; caption honesty good |

### Share Your Memories (CTA)

| Design #1 | Live | Gap |
|-----------|------|-----|
| Full-width deep maroon band + cream button | Deep burgundy band + cream button (“Submit a Memory”) | Closest match — relatively strong |

### Guiding Principle

| Design #1 | (often folded into hero quote) | Live dedicated section | Extra vs mock — fine; slightly sparse without ornament |

### Footer

| Design #1 | Live | Gap |
|-----------|------|-----|
| Links + social + © | Deep band, nav, curator note, policy reminder | No social (good until real); less link density vs package “Archive policy · Sources · …” map |

---

## 7. What is already working (do not “fix” away)

- Design #1 palette tokens implemented (`tokens.css`).
- Section order matches package `HOMEPAGE_CONTENT.md`.
- No invented interviewees or people bios.
- Cathedral facts and photo rights surfaced (badges + sources page).
- Timeline cited to package years only.
- Responsive breakpoints for hero / grids / timeline.
- Accessibility basics: skip link, focus-visible, reduced motion, alt text discipline.

---

## 8. Priority gap list for later UI phases (not Phase 1 implementation)

1. **Add restrained paper grain** (port starter overlay).
2. **Replace purpose Unicode with four archival SVGs** on textured pads.
3. **Craft richer interview + archive empty states** without fake people/photos-as-holdings.
4. **Hero portrait treatment** (softer edge / editorial crop) without renaming the curator.
5. **Optimize cathedral delivery** + improve Karachi if a better licensed master appears.
6. **Tune church grid density / rhythm** while still showing all eight package dioceses.
7. **Light gold ornament / double rules** at section breaks — sparingly.
8. Keep refusing Design #1’s conflicting names, churches, and timeline years as content.

---

## 9. Mockup conflict register (do not copy as facts)

| Mock element | Conflict | Authority |
|--------------|----------|-----------|
| Rev. Dr. Samuel Khan; Mrs. Ruth Emmanuel; Mr. Joseph Mathias | Invented interview cast | Package: no interviews; UI: “coming soon” |
| St. John's Cathedral, Karachi | Wrong cathedral for Karachi in package | Package: **Holy Trinity Cathedral**, Karachi |
| All Saints Church, Lahore | Not package Lahore cathedral | Package: **Cathedral Church of the Resurrection** |
| Christ Church, Rawalpindi | Not in eight diocesan cathedral list | Package cathedrals.json |
| St. Paul's Church, Peshawar | Wrong label | Package: **St. John's Cathedral**, Peshawar |
| Timeline 1818 / 1849 / 1947 / 2000+ | Unsourced mock years | Package: 1852 / 1887 / 1970 / 1980 / 2011 |
| Any mock personal name on founder portrait | Display name unconfirmed | `CURATOR_DISPLAY_NAME = "Project Curator"` |

---

## 10. Related Phase 1 docs

- `docs/REPAIR_AUDIT.md` — stack, structure, Next cleanliness, path verification  
- `docs/ASSET_AUDIT.md` — media inventory, missing/broken/low-quality, generate/clean  
