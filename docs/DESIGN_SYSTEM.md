# Design system — Archival Heritage (Design #1)

**Current implementation:** see the Contemporary archive redesign dated 2026-10-24 at the end of this document. The original specification below is retained as historical context.

Source of truth for this build: package `docs/DESIGN_SYSTEM.md` + `GROKBOT_MASTER_PROMPT` essential palette. CSS implementation: `src/styles/tokens.css`.

## Palette

| Token | CSS variable | Hex | Use |
|-------|--------------|-----|-----|
| Parchment | `--color-parchment` / `--parchment` | `#F3E7CF` | Page background |
| Paper | `--color-paper` / `--paper` | `#FBF5E9` | Cards, elevated surfaces |
| Burgundy | `--color-burgundy` / `--oxblood` | `#6D2227` | Primary CTA, headings accent |
| Deep burgundy | `--color-deep-burgundy` / `--oxblood-deep` | `#4F171B` | CTA hover, deep accent |
| Ink | `--color-ink` / `--ink` | `#292522` | Body text |
| Muted brown | `--color-muted-brown` / `--ink-muted` | `#6E6255` | Secondary / meta text |
| Antique gold | `--color-antique-gold` / `--gold` | `#AF8B58` | Accent |
| Border | `--color-border` / `--rule` | `#CDBB9C` | Rules, frames |

Do not invent alternate palettes. Chat-brief hexes (`#7a2229`, `#fbf7ef`) are superseded by the package values above unless the user confirms otherwise.

## Typography

| Role | Family | Loading |
|------|--------|---------|
| Display / headings | Cormorant Garamond | `next/font/google` → `--font-cormorant` |
| Body / UI | Source Sans 3 | `next/font/google` → `--font-source-sans` |

Wire font CSS variables on `<html>` (see Archive Design `lib/fonts.ts`). Consume via `--font-display` and `--font-body` in `tokens.css`.

## Implementation rules

- CSS Modules only — no SaaS UI kits, no Tailwind/shadcn/MUI.
- Import `src/styles/tokens.css` once from the root layout.
- Prefer token variables over hardcoded hex in components.
- Focus: `:focus-visible` uses burgundy ring (`--focus-ring`) for WCAG 2.2 AA.
- Contrast targets (AA body ≥ 4.5:1): ink on parchment ~12.4; burgundy on parchment ~9.0; paper on burgundy ~10.1.

## Owner

Archive Design (reports to Heritage Forge). Design #1 Archival Heritage only.
# Contemporary archive redesign — 2026-10-24

The user's complete visual redesign request supersedes the original Design #1 layout above. The established burgundy, ink, parchment, and paper palette and Cormorant Garamond / Source Sans 3 typefaces remain. The active design uses paper as the primary surface, larger editorial typography, generous whitespace, simple rules, and unfiltered archival media instead of textured panels and ornamental frames.

Homepage sequence: collection-led hero, family archive, purpose, churches, documented timeline, interviews, curator connection, contribution, guiding principle. The hero and previews load existing CMS records; links open their records in the archive. The dark burgundy timeline provides a distinct visual chapter. Shared cards and page typography carry the design through all public routes.

Images remain contained without cropping; published captions, source data, rights notices, public-record caveats, forthcoming biographies, and permission-pending church placeholders are preserved. Administration and contribution delivery logic are unchanged. This work is a local redesign preview, not a production launch.

Responsive layouts: header menu at 1050px, collection grids at 1100px/600px, stacked editorial sections at 760px, vertical timeline below 980px. Mobile navigation closes after selection and Escape restores focus to its toggle. Focus indicators and reduced-motion support remain active.

---

## Integration with newer main (2026-10-25)

The reviewed paper/burgundy redesign takes precedence over the earlier Emerald & Gilt presentation. Site settings, blog, KV/Blob storage, CMS editors, media caching and mobile focus management from main are retained. Compatibility tokens map newer modules to the reviewed palette.
