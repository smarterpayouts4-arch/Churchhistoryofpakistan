# Site Audit Report — History: Church of Pakistan

- Generated: 2026-09-17T21:00:33.776Z
- Base URL: http://127.0.0.1:4000
- Routes probed: 8
- HTTP 200: 8/8
- Required files missing: 0

## Route results

| Route | Status | Bytes | ms | Notes |
|---|---:|---:|---:|---|
| `/` | 200 | 82135 | 135 | ok |
| `/about` | 200 | 27579 | 49 | ok |
| `/archive` | 200 | 25961 | 46 | ok |
| `/interviews` | 200 | 25064 | 42 | ok |
| `/churches` | 200 | 67227 | 62 | ok |
| `/people` | 200 | 21744 | 46 | ok |
| `/contribute` | 200 | 24347 | 46 | ok |
| `/sources` | 200 | 33520 | 43 | ok |

## App Router pages found

- `src/app/about/page.tsx`
- `src/app/archive/page.tsx`
- `src/app/churches/page.tsx`
- `src/app/contribute/page.tsx`
- `src/app/interviews/page.tsx`
- `src/app/page.tsx`
- `src/app/people/page.tsx`
- `src/app/sources/page.tsx`

## Required file presence

- ✅ `src/app/layout.tsx`
- ✅ `src/app/page.tsx`
- ✅ `src/components/layout/Header.tsx`
- ✅ `src/components/layout/Footer.tsx`
- ✅ `src/content/homepage.ts`
- ✅ `src/content/cathedrals.ts`
- ✅ `src/content/sources.ts`
- ✅ `src/content/nav.ts`
- ✅ `src/content/family-archives.ts`
- ✅ `src/styles/tokens.css`
- ✅ `src/lib/fonts.ts`
- ✅ `public/media/founder/founder-portrait-hero.webp`
- ✅ `public/media/founder/founder-portrait-square.webp`

## Content / honesty gaps (manual)

- Interviews & people: forthcoming placeholders only (no invented names).
- Archive: thematic family-archive slots only; no fabricated holdings.
- Contribute: no fake success when `CONTRIBUTE_WEBHOOK_URL` unset.
- Curator label: **Project Curator** until public display name confirmed.
- Cathedral photos: Faisalabad / Hyderabad / Raiwind remain permission-needed SVGs.
- Timeline & cathedral facts sourced from `src/content/*` only.

## Summary

All probed routes returned HTTP 200 and required scaffold files are present.
