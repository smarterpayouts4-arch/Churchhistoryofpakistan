# Design system: Emerald & Gilt (redesign, 2026-10)

The visual language replaces Design #1 Archival Heritage (parchment/burgundy). It was adopted by the owner on 2026-10-17 (see `docs/DECISIONS.md` ADR-006). The CSS lives in `src/styles/tokens.css` (tokens, base elements, buttons) and `src/styles/globals.css` (layout primitives).

**Palette rationale.** Deep emerald draws on liturgical green (Ordinary Time), and gilt draws on the gold of church plate and illuminated manuscripts. Ivory keeps the archive's paper feel without the old parchment textures. These values were chosen for the site. They are **not** taken from any Church of Pakistan website or brand guideline.

**Layout references (Mobbin, for structure only):** Unify (large serif headline on ivory), NYT (editorial serif rhythm), Replit "Brew NYC" (serif hero, pill CTA), and Meetup (split hero with a portrait).

## Palette

| Token | Hex | Use |
|---|---|---|
| `--emerald-950` | `#062E25` | Dark bands: hero, timeline, footer, mobile menu |
| `--emerald-900` | `#0A4D3C` | Contribute panel, glow behind gilt text |
| `--emerald-800` | `#0B5C47` | Primary: headings, links, primary buttons |
| `--emerald-700` | `#12735A` | Hover / mid emerald |
| `--emerald-100` | `#DDEDE6` | Tinted chips, icon pads |
| `--ivory` | `#F4F3EC` | Page background |
| `--paper` | `#FFFEF9` | Cards and raised surfaces |
| `--stone` / `--stone-deep` | `#EAE8DE` / `#DFDCCF` | Alternate sections, page headers / media wells |
| `--ink` | `#14201B` | Body text |
| `--slate` | `#4C5A53` | Secondary text |
| `--gilt` | `#D8B65E` | Accent on dark, gilt buttons, rules |
| `--gilt-hover` | `#E3C47A` | Gilt button hover |
| `--gilt-ink` | `#86601A` | Accent text on light (eyebrows, numerals) |
| `--oxblood` | `#7A2B2E` | Heritage accent: "permission pending" badge, form errors |
| `--line` / `--line-strong` | `#D8D4C6` / `#C3BEAC` | Hairlines / input borders |
| `--mist` | `#BFD8CD` | Secondary text on dark |

For translucency, use the RGB channel tokens (`--emerald-950-rgb`, `--emerald-900-rgb`, `--emerald-800-rgb`, `--gilt-rgb`, `--mist-rgb`, `--ivory-rgb`, `--paper-rgb`, `--oxblood-rgb`), for example `rgb(var(--gilt-rgb) / 0.4)`. The legacy `--color-*` names still exist as aliases, so older modules and the admin keep working.

## Contrast (WCAG 2.2, measured)

| Pair | Ratio |
|---|---|
| ink on ivory / paper / stone | 15.08 / 16.61 / 13.65 |
| slate on ivory / paper / stone | 6.52 / 7.18 / 5.91 |
| emerald-800 on ivory / paper / stone / emerald-100 | 7.16 / 7.89 / 6.49 / 6.57 |
| gilt-ink on ivory / paper / stone | 5.10 / 5.62 / 4.62 |
| oxblood on ivory / paper | 8.53 / 9.40 |
| ivory on emerald-800 / 900 / 950 | 7.16 / 8.82 / 13.25 |
| gilt on emerald-950 / 900 | 7.56 / 5.03 |
| mist on emerald-950 / 900 | 9.77 / 6.51 |
| emerald-950 on gilt / gilt-hover | 7.56 / 8.73 |

**Never** set gilt text on emerald-800 (4.09:1, fails AA). Use emerald-900 or a darker green behind gilt.

## Typography

| Role | Family | Loading |
|---|---|---|
| Display / headings | Fraunces (variable: opsz, SOFT; roman + italic) | `next/font/google` → `--font-fraunces` → `--font-display` |
| Body / UI | Inter | `next/font/google` → `--font-inter` → `--font-body` |

The scale uses `--text-hero`, `--text-display`, `--text-h1`–`--text-h3`, `--text-lead`, `--text-body` (17px), `--text-small` and `--text-label` (12px). **No text is set below 12px** (0.75rem). The only exception is the decorative ✦ separator, which is `aria-hidden`.

## Components and primitives

- Buttons: `.btn-primary` (emerald pill), `.btn-secondary` (outline pill), `.btn-gilt` (gilt on dark), `.btn-ghost-light` (outline on dark). Minimum height is 48px.
- `.eyebrow` (+ `.eyebrowLight` on dark), `.section`, `.sectionWash`, `.sectionPaper`, `.sectionHeading(Split|Centered)`, `.sectionLink`, `.forthcoming`, `.linkRow`.
- `PageHeader` (`src/components/ui/PageHeader.tsx`) renders the shared stone band (eyebrow, h1, intro) on every secondary route and on the 404 page.
- Header: a sticky translucent bar. At ≤960px it becomes a full-screen emerald sheet with numbered serif links and a gilt Contribute CTA. The sheet has a focus trap, closes on Escape (focus returns to the menu button), and locks page scroll.

## Rules

- CSS Modules + tokens only: no Tailwind, shadcn, MUI or icon kits.
- Use tokens instead of raw hex in components.
- Tap targets are ≥44px. `:focus-visible` uses a 2px `--gilt-ink` ring (gilt on dark bands).
- `prefers-reduced-motion` disables transitions and entrance animations.
- Interview covers are 4:5 with `object-fit: cover`. The playing video always uses `object-fit: contain` on the letterbox colour.
