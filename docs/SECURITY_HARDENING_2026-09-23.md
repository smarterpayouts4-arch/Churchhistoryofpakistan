# Security hardening — 2026-09-23

Scope: History: Church of Pakistan curator admin (`/admin`, `/api/admin/*`).

This document contains **no secrets**, passwords, hashes, or session values.

## What was hardened

### Preview login (local only)

- Shared helper: `src/lib/auth/preview.ts` → `isAdminPreviewAllowed()`.
- Double-guard on `POST /api/admin/login/preview`:
  1. If `NODE_ENV === "production"` → **403**
  2. If `ADMIN_OPEN_PREVIEW` is not exactly `"true"` → **403**
  3. Shared helper must also agree → **403**
- Login UI (`LoginForm`) only shows “Enter as curator (local preview)” when the **server** passes `previewOpen={isAdminPreviewAllowed()}` — not a client guess.
- Preview endpoint is rate-limited (fail closed → 429).

### Password / session (local box)

- Prefer `ADMIN_PASSWORD_HASH` (bcrypt). When hash is set, plaintext `ADMIN_PASSWORD` is unused.
- Local `.env.local` rotated: new hash + new `ADMIN_SESSION_SECRET` (≥32 chars). Values live only in `.env.local` and an out-of-repo note under `/workspace/hcop-parts/` (not synced into the public site tree).
- `.env.example` defaults `ADMIN_OPEN_PREVIEW=false` and documents a production checklist without real secrets.

### Session cookies

- `HttpOnly: true`
- `Secure: true` when `NODE_ENV === "production"`
- `SameSite: Lax`
- `path: "/"` (required so the cookie is sent to both `/admin` and `/api/admin/*`)

### Security headers (`next.config.ts`)

Applied to `/:path*`:

| Header | Value |
|--------|--------|
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | camera=(), microphone=(), geolocation=(), payment=() |
| Content-Security-Policy | see tradeoffs below |
| X-DNS-Prefetch-Control | off |

### Admin API auth (spot-check)

All mutating / sensitive admin routes call `requireAdminApi()` (or clear cookie on logout):

- `/api/admin/upload`
- `/api/admin/homepage`
- `/api/admin/cathedrals`
- `/api/admin/curator-profile`
- `/api/admin/family-archives` (+ `[id]`)
- `/api/admin/featured-interviews` (+ `[id]`)
- `/api/admin/media-inspect`
- `/api/admin/logout` (idempotent cookie clear)

Login remains public but rate-limited; preview is double-guarded + rate-limited.

### Rate limits

- Login: 8 attempts / 15 minutes / client key (fail closed → 429)
- Preview: 20 attempts / 15 minutes / client key (fail closed → 429)
- In-memory per process — fine for single-curator deploy; not a WAF substitute.

## CSP tradeoffs

- **`script-src 'self' 'unsafe-inline'`** — Next.js App Router injects inline bootstrap/hydration scripts. A stricter nonce/hash CSP would require middleware that issues nonces per request; not added in this pass.
- **`'unsafe-eval'` in development only** — React uses `eval()` during `next dev` to reconstruct server call stacks. `next.config.ts` adds it when `NODE_ENV === "development"` and omits it in production.
- **`style-src 'self' 'unsafe-inline'`** — needed for CSS modules / inline style attributes used in admin UI.
- **No `fonts.googleapis.com`** — `next/font` self-hosts Cormorant Garamond + Source Sans 3 at build time.
- **`img-src` / `media-src` allow `data:` and `blob:`** — admin image crop/upload previews.
- **`frame-ancestors 'none'`** complements `X-Frame-Options: DENY`.
- **`upgrade-insecure-requests`** — harmless on localhost HTTP; strengthens HTTPS deploys.

If a future deploy needs analytics or a third-party media CDN, CSP allowlists must be updated deliberately.

## Production checklist (human deploy config)

Still required on the hosting platform — **not** automated by this repo change:

1. Confirm **`NODE_ENV=production`** on the running process.
2. Ensure **`ADMIN_OPEN_PREVIEW` is unset or `false`** (never `"true"`) in production env.
3. Set **`ADMIN_PASSWORD_HASH`** only; leave **`ADMIN_PASSWORD` unset**.
4. Set a unique **`ADMIN_SESSION_SECRET`** (≥32 random characters) per environment; do not reuse the local secret.
5. Terminate **HTTPS** so `Secure` cookies apply.
6. Do **not** ship `.env.local`, credential notes, or real secrets in the deploy artifact / public tree.
7. Prefer platform rate limiting / WAF in front of `/api/admin/login*`.
8. After deploy, verify: `curl -X POST https://<host>/api/admin/login/preview` → **403**.

## How to verify locally

```bash
# From project root, with .env.local loaded by Next:

# 1) Local non-prod + ADMIN_OPEN_PREVIEW=true → preview allowed (200 + Set-Cookie)
curl -i -X POST http://127.0.0.1:4000/api/admin/login/preview

# 2) Simulate production (preview must be impossible):
NODE_ENV=production ADMIN_OPEN_PREVIEW=true node -e "
  // Unit-level: helper must return false even if flag is true
  process.env.NODE_ENV='production';
  process.env.ADMIN_OPEN_PREVIEW='true';
" 
# Or start with production build:
#   pnpm build && NODE_ENV=production ADMIN_OPEN_PREVIEW=true pnpm start
#   curl -i -X POST http://127.0.0.1:4000/api/admin/login/preview
# Expect: HTTP 403

# 3) Headers present on any page:
curl -sI http://127.0.0.1:4000/ | grep -iE 'x-frame-options|x-content-type|referrer-policy|permissions-policy|content-security-policy'
```

## Remaining risks

- In-memory rate limits reset on process restart and do not share across multiple instances.
- CSP still allows `'unsafe-inline'` scripts/styles (Next constraint without nonces).
- Single shared curator account (by design); no MFA / SSO yet.
- File upload path relies on `requireAdminApi` + app validation — keep content-type/size limits reviewed on deploy.
- Production secret management is **human/platform** responsibility (see checklist).

## Files touched (code / docs / example)

- `src/lib/auth/preview.ts` (new)
- `src/lib/auth/rate-limit.ts`
- `src/lib/auth/session.ts` (cookie docs)
- `src/app/api/admin/login/preview/route.ts`
- `src/app/admin/login/page.tsx`
- `next.config.ts`
- `.env.example`
- `docs/SECURITY_HARDENING_2026-09-23.md` (this file)

Not committed / not synced into public site tree: local `.env.local`, out-of-repo credential note under `hcop-parts/`.
