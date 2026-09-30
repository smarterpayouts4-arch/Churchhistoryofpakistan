# Design system — Archival Heritage (Design #1)

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
