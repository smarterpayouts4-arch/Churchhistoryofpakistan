# Architecture

Developer orientation. Content rules are in [AGENTS.md](../AGENTS.md); the visual system is in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) and `src/styles/tokens.css`. Decisions are recorded in [DECISIONS.md](DECISIONS.md).

## Stack

- **Next.js 16.4** with the App Router and Turbopack. `src/proxy.ts` is Next 16's replacement for middleware.
- **React 19.3.** Server Components by default; client components only where interaction needs them.
- **TypeScript (strict)**, CSS Modules and design tokens. No CSS framework.
- **Content:** JSON documents (`data/cms/*.json`) validated with zod (`src/lib/cms/schemas.ts`).
- **Hosted storage:** Vercel KV / Upstash Redis for documents, and Vercel Blob for media and contribution files.

## Public site

`src/app/*/page.tsx` render content from typed loaders in `src/content/`. Those loaders read the CMS store through `readCmsPublic`, which is cached for each request. The homepage renders its sections in the order and visibility stored in `home-layout.json` (`src/content/home-layout.ts`).

Interaction is deliberately small and calm:

- **ScrollReveal** (`components/ui/ScrollReveal.tsx`): sections fade and rise 12 px as they enter the screen. Anything already on screen is shown immediately. It is a progressive enhancement, so the content is fully visible without JavaScript.
- **Route transitions:** `<ViewTransition name="site-main">` in the root layout fades the new page content in. The header and footer don't move.
- **Lightbox** (`components/ui/Lightbox.tsx`): archive and people photos open in a native `<dialog>`. ← and → (or a swipe) move between photos, and Esc closes the dialog and returns focus to where it was. Cards stay server components; they mark their opener with `data-lightbox-open="group:index"`.
- **Timeline:** entries reveal one after another, the marker reacts to hover and focus, and a line draws across the timeline using CSS scroll-driven animation (only where the browser supports it).
- `prefers-reduced-motion: reduce` turns all of the above off (see `globals.css`).

SEO pieces:

- per-page `metadata`, plus Open Graph and Twitter defaults in `app/layout.tsx`;
- a generated share image (`app/opengraph-image.tsx`);
- `app/robots.ts` (disallows `/admin` and `/api/`) and `app/sitemap.ts`;
- JSON-LD (`WebSite` and `ArchiveOrganization`) in the root layout.

## Content store — `src/lib/cms/store.ts`

| Mode | When | Where documents live |
|---|---|---|
| Local files | No KV variables | Content docs: `data/cms/*.json` (committed). Private docs: `data/local-store/*.json` (gitignored) |
| Vercel KV | `KV_REST_API_URL` and `KV_REST_API_TOKEN` | Key `cms:<doc>`. Empty keys are seeded from the bundled `data/cms` file on first read |
| Vercel without KV | `VERCEL` set, no KV | Reads come from the bundled files; **writes are refused** (`StorageNotConfiguredError`, shown as a banner in the admin) |

- **Content documents:** homepage, home-layout, site, family-archives, featured-interviews, people-frames, cathedrals, curator-profile, blog.
- **Private documents:** users, media, contributions. These are never committed and never served publicly.

**Revisions.** Every `writeDoc` records a revision (summary, author, time, version, and the full document). Up to 40 are kept per document: in `data/local-store/revisions/<doc>/` locally, or in KV lists `cmsrev:<doc>` and `cmsrevdata:<id>`. The first admin save also stores the "original" version, so the starting content can always be restored. Restoring writes the old content as a new revision, which means restores can be undone too.

**Optimistic concurrency.** A document's version is the first 16 hex characters of the sha256 of its JSON.

- The admin page hands each editor its document versions. `adminFetch` sends `x-cms-base: <doc>=<version>` on every save, and the store refuses the write with **409** if the document has changed since.
- The client then shows the conflict dialog. Choosing "Keep mine" resends with `x-cms-force: 1`.
- Responses carry `x-cms-version` so the next save uses the new base.
- The check and the write are two steps, not one atomic operation. That is fine for a handful of family editors. A Lua/WATCH script would be needed for strict guarantees.

**Request context** (`src/lib/cms/context.ts`): `adminRoute()` runs each admin handler inside an AsyncLocalStorage holding the signed-in user and the version headers, so `writeDoc` can attribute and check every save without threading arguments through.

## Auth — `src/lib/auth/`

- **Accounts** (`users.ts`) are stored in the private `users.json`: id, email, name, role (`admin` | `editor`), bcrypt hash (cost 12), active flag, and `tokenVersion`.
- **Bootstrap:** while no active admin exists, signing in with `ADMIN_EMAIL` (or `ADMIN_USERNAME`) and the password behind `ADMIN_PASSWORD_HASH` creates the first admin. After that the env login is ignored, unless `ADMIN_RECOVERY_LOGIN=true` turns it back on.
- **No plaintext passwords:** a plaintext `ADMIN_PASSWORD` is ignored, with a warning shown to admins.
- **Sessions** (`session.ts`): an HS256 JWT `{sub, role, tv}` in an HttpOnly, SameSite=Strict cookie (Secure in production). It is checked against the store on every request, so switching an account off or changing its password ends that person's sessions at once.
  - Production requires `ADMIN_SESSION_SECRET` of at least 32 characters.
  - In development, a random secret is generated into `data/local-store/.session-secret`.
- **CSRF** (`csrf.ts`): every non-GET admin request must pass a same-origin `Origin`/`Referer` check and a double-submit token (the `x-csrf-token` header must match the `hcop_csrf` cookie, which the proxy issues on `/admin` pages).
- **Rate limits** (`rate-limit.ts`) use KV `INCR`/`EXPIRE`, or memory when there is no KV:
  - login: 10 per 15 min per IP, and 6 per 15 min per account;
  - contribute: 5 per hour per IP;
  - preview login: 20 per 15 min.
- **Roles:** editors can change content and media. Only admins manage accounts and delete contributions.
- **Preview login** (`ADMIN_OPEN_PREVIEW=true`) only works in local development, never when `NODE_ENV=production` or on Vercel.

## Security headers

- `src/proxy.ts` sets a per-request **nonce CSP**: `script-src 'self' 'nonce-…' 'strict-dynamic'`, no inline scripts, `frame-ancestors 'none'`, `object-src 'none'`, and media and images limited to self plus the Blob host. The root layout calls `headers()`, so every page is rendered per request and receives the nonce.
- `next.config.ts` adds HSTS, `X-Frame-Options: DENY`, nosniff, Referrer-Policy, Permissions-Policy and COOP, and turns off `X-Powered-By`.

## Media — `src/lib/media/`, `src/app/api/admin/media/`

- **Library** = the uploaded items index (`media.json`) plus a scan of the existing site media under `public/media`. `mediaUsage()` scans every content document, so the library can show "in use" and refuse to delete files that are used.
- **Local uploads:** the browser streams the raw file to `POST /api/admin/media/upload` (XHR, with progress). The server checks magic bytes against the declared type, reads the dimensions with `image-size`, and writes `public/media/uploads/<year>/<kebab-name>-<suffix>.<ext>`.
- **Vercel uploads:** the browser uploads straight to Blob using `@vercel/blob/client` `upload()`, with a token from `/api/admin/media/blob`. The token is limited by content type and size and requires a signed-in admin or editor with CSRF. The browser then registers the item with `POST /api/admin/media`. This avoids the 4.5 MB function body limit entirely.
- Limits: photos 30 MB, videos 1 GB. HEIC is rejected with instructions.
- Every image field uses `ImageField` → `MediaPicker` → `MediaLibrary`. Nobody types URLs. Optional focal points are stored as CSS `object-position`, and cropping saves a new file.

## Gallery & video presentation

- Every gallery tile has a fixed shape (archive 4:5, churches and people 4:3) set with CSS `aspect-ratio`. `src/components/ui/GalleryImage.tsx` fills it with `object-fit: cover` around the item's focal point (`imagePosition` / `position`). When cover would hide more than ~30% of a photo (panoramas, tall scans) or the admin ticked "Show the whole photo" (`imageFit`/`fit: "contain"`), the whole photo is shown centred over a blurred copy of itself. The lightbox always shows the full, uncropped photo.
- `next/image`: AVIF then WebP, `quality` 80 (`images.qualities` in `next.config.ts`), `sizes` matched to each grid, blur placeholders from `src/lib/media/media-meta.json` (bundled media) or the media index (uploads) via `src/lib/media/meta.ts`.
- Videos: one 16:9 frame (`InterviewPlayCard`); portrait clips are contained and centred over the poster's blur. Nothing downloads before "play"; then `preload="metadata"`, `playsInline`, native controls. Bundled videos are H.264 High / AAC-LC MP4 with `+faststart` (`npm run media:normalize -- --videos`).
- Admin uploads (`src/components/admin/normalizeMedia.ts`): photos are EXIF-rotated and capped at 3200 px on the long edge before upload, with a blur preview; videos get width/height/duration and a captured poster frame (stored as a library photo, `posterUrl`). Videos are not re-encoded in the browser.

## Share previews & icons

- **Share images:** static 1200×630 PNGs in `public/media/og/` (`og-default.png` plus one per key page, each under 200 KB). Title and emblem sit inside the centre 560 px so WhatsApp/iMessage square and small-thumbnail crops stay legible. `src/lib/seo.ts` (`socialMetadata`) adds absolute `og:image` / `twitter:image` URLs (from `NEXT_PUBLIC_SITE_URL`, else the Vercel production domain, else `https://churchhistoryofpakistan.vercel.app`) with width, height and alt, and `summary_large_image`.
- **Icons:** `public/favicon.ico` (16/32/48), `public/icon.svg`, `public/apple-touch-icon.png` (180), `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-512.png`; `src/app/manifest.ts` serves `/manifest.webmanifest` (theme `#6d2227`, background `#f3e7cf`).
- Messaging apps cache previews for days. After changing an image, use a new file name (or add `?v=2`) to force a refresh.

## Share Your Story (visitor stories) — `src/app/share-your-story/` (`/contribute` 308-redirects here), `src/lib/contributions/intake.ts`

- The form shows when there is somewhere to keep submissions: the local store, KV, or `CONTRIBUTE_WEBHOOK_URL`.
- **Attachments:** up to 4 files and 4 MB total, JPEG/PNG/WebP/PDF. Photos are scaled to 2000 px JPEG in the browser first.
- **Storage:** attachments are stored privately, in `data/local-store/contributions/` locally or as a private Blob (`CONTRIBUTIONS_BLOB_TOKEN`, a separate private store) on Vercel. The curator downloads them through an authenticated route.
- **Spam and abuse:** a honeypot field, a rate limit, and required consent checkboxes.
- The webhook (optional) receives the text fields and attachment metadata.

## Checks

```bash
npm run typecheck && npm run lint:eslint && npm run build
```

An end-to-end API check was run against `next dev` during the 2026-11 overhaul. It covered login with CSRF and rate limits, upload with content sniffing, saving, the conflict response, history and restore, and accounts.
