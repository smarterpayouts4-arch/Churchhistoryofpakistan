# Site Audit Report — History: Church of Pakistan

- Generated: 2026-10-25T12:51:53.926Z
- Base URL: http://127.0.0.1:4001
- Routes probed: 9
- HTTP 200: 9/9
- Required files missing: 0

## Route results

| Route | Status | Bytes | ms | Notes |
|---|---:|---:|---:|---|
| `/` | 200 | 94403 | 220 | ok |
| `/about` | 200 | 46401 | 52 | ok |
| `/archive` | 200 | 152951 | 83 | ok |
| `/interviews` | 200 | 30118 | 36 | ok |
| `/churches` | 200 | 60622 | 39 | ok |
| `/people` | 200 | 26785 | 27 | ok |
| `/contribute` | 200 | 18318 | 23 | ok |
| `/sources` | 200 | 28982 | 26 | ok |
| `/blog` | 200 | 17752 | 23 | ok |

## App Router pages found

- `src\app\about\page.tsx`
- `src\app\admin\inspect\page.tsx`
- `src\app\admin\login\page.tsx`
- `src\app\admin\page.tsx`
- `src\app\archive\page.tsx`
- `src\app\blog\page.tsx`
- `src\app\blog\[slug]\page.tsx`
- `src\app\churches\page.tsx`
- `src\app\contribute\page.tsx`
- `src\app\interviews\page.tsx`
- `src\app\page.tsx`
- `src\app\people\page.tsx`
- `src\app\sources\page.tsx`

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

- Interviews: existing youth programs; additional oral-history interviews remain forthcoming. People biographies remain forthcoming.
- Archive: CMS-backed family records with source and verification notes.
- Contribute: no fake success when `CONTRIBUTE_WEBHOOK_URL` unset.
- Curator public name: **Javed Qadir Bakhsh**, confirmed in the content register.
- Cathedral photos: Faisalabad / Hyderabad / Raiwind remain permission-needed SVGs.
- Timeline & cathedral facts sourced from `src/content/*` only.

## Summary

All probed routes returned HTTP 200 and required scaffold files are present.
