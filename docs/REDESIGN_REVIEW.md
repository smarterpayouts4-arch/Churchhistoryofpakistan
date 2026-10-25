# Redesign review — 2026-10-24

Implemented a complete public-site visual redesign in the existing Next.js project. This is local preview work only; no hosting, backend, authentication, CMS records, or contribution-delivery configuration was changed.

## Design

- Paper surfaces, retained burgundy identity, larger editorial serif typography, generous spacing, and simpler navigation.
- CMS-driven collection hero and direct links to archive records.
- Family collection, numbered purpose section, church gallery, burgundy timeline, interview players, curator story, contribution section, and restrained footer.
- Shared card treatments and page typography across all eight public routes.
- Existing facts, captions, media, source references, verification notes, and rights placeholders preserved.

## Verification

- TypeScript check: passed.
- ESLint: passed.
- Production build: passed (font downloads required network access).
- Route audit: 8/8 public routes returned successfully.
- All eight public pages inspected at 320px. A source-credit code path overflow was fixed and rechecked.
- Homepage overflow checks passed at 375, 768, and 1440px.
- Desktop homepage, collection, timeline, mobile homepage, and church gallery visually inspected.
- Mobile menu opens, closes after navigation, and closes with Escape while returning focus to its toggle.
- Interview button mounts the native video player, source loads with controls and no media error.
- Browser console: no errors in final review.

## Existing limitation

Next.js still warns that the existing admin upload route uses dynamic filesystem access that traces the whole project. This did not fail the build. Existing production-launch blockers in the onboarding briefing remain outside this visual redesign.

## Review images

- `redesign-preview/desktop.png`
- `redesign-preview/mobile.png`
- `redesign-preview/full-homepage.png`

Run `npm run dev` from the project folder for the local preview at http://localhost:4000.
