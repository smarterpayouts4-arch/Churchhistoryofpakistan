# Curator Admin — History: Church of Pakistan

Single-curator admin for **Javed Qadir Bakhsh** to manage Homepage copy, Churches/dioceses, Family Archives, Featured Interview metadata, media uploads, and the About-page curator profile.

## One-click local Sign in (preview)

For local development only — when the site is **not** launched publicly yet:

1. In `.env.local` set:

```bash
ADMIN_OPEN_PREVIEW=true
```

2. Start the site: `pnpm dev` → http://127.0.0.1:4000
3. Open `/admin/login`
4. Click **Enter as curator (local preview)** — no username/password required
5. You land on `/admin` with the same HttpOnly session cookie as a normal login

**How it works:** `POST /api/admin/login/preview` creates a session only when **both** are true:

- `ADMIN_OPEN_PREVIEW=true`
- `NODE_ENV !== 'production'`

Otherwise it returns **403**. Username/password Sign in remains available (collapsed under the preview button when preview mode is on).

### Before any public deploy

```bash
ADMIN_OPEN_PREVIEW=false
```

Never enable preview login in production. Even if the flag is mistakenly set, production builds refuse the endpoint.

## Password Sign in (development)

1. Ensure `.env.local` exists (copy from `.env.example` if needed).
2. Start the site: `pnpm dev` → http://127.0.0.1:4000
3. Open **Curator login** in the site footer, or go to `/admin/login`.
4. Sign in with the **dev** credentials (local only):

| Field | Dev value |
|---|---|
| Username | `javed` |
| Password | `CuratorDev2026!` |

These values live in **`.env.local`** (gitignored) and are documented **only here**. Never reuse them in production.

After a successful login you land on `/admin`. Unauthenticated visits to `/admin` redirect to `/admin/login`.

## Changing the password

Passwords are **not** changed in the UI. Update environment variables and restart the app.

### Plain password (fine for local / trusted hosts)

```bash
ADMIN_USERNAME=javed
ADMIN_PASSWORD='your-new-password'
ADMIN_SESSION_SECRET='a-long-random-string-at-least-32-characters'
```

### Preferred for production: bcrypt hash

Generate a hash (from the project root):

```bash
pnpm exec tsx -e "import bcrypt from 'bcryptjs'; console.log(bcrypt.hashSync('your-strong-password', 12))"
```

Then set:

```bash
ADMIN_USERNAME=javed
ADMIN_PASSWORD_HASH='$2a$12$...'   # overrides ADMIN_PASSWORD when set
ADMIN_SESSION_SECRET='...'        # >= 32 chars, unique per deploy
```

Rotate `ADMIN_SESSION_SECRET` to invalidate all existing sessions.

## Security notes

- Session cookie: **HttpOnly**, **SameSite=Lax**, **Secure** in production (`NODE_ENV=production`).
- Auth is checked in **Server Components** and **Route Handlers** via `requireAdmin()` / `requireAdminPage()` — do not rely on middleware alone (defense in depth / CVE-2025-29927 class risk).
- Login is lightly rate-limited (about 8 attempts / 15 minutes per client IP, in-memory).
- Preview login is **local-only** and disabled when `NODE_ENV=production`.
- Secrets belong only in env / host secrets — never in the repo.

## What you can manage

| Section | Storage | Public pages |
|---|---|---|
| Homepage (hero, purpose, connection, timeline, contribution labels) | `data/cms/homepage.json` | `/`, `/about`, `/contribute` |
| Churches / dioceses (8 cathedral records) | `data/cms/cathedrals.json` | `/`, `/churches`, `/sources` |
| Family Archives CRUD | `data/cms/family-archives.json` | `/`, `/archive` |
| Featured Interviews (title, copy, featuredOnHome) | `data/cms/featured-interviews.json` | `/`, `/interviews` |
| Curator profile JSON | `data/cms/curator-profile.json` | `/about#profile` |
| Image upload (+ optional crop) | `public/media/uploads/` or `public/media/archive/facebook/` | via FA `imageSrc` / hero portrait |
| Inspect media (read-only) | CMS JSON + native files under `public/` | `/admin/inspect` |

Do **not** invent historical facts. Migrate and edit only caption-backed or biography-sourced material.

## Homepage CMS

1. Sign in → open the **Home** tab (first tab).
2. Edit site title, strapline, guiding principle, hero, purpose cards, connection paragraphs, timeline, and contribution field labels.
3. Optional: use the portrait crop/upload widget to set `hero.portrait`.
4. Click **Save homepage** → `PUT /api/admin/homepage` → public `/` and `/about` refresh on next load (`noStore` on CMS reads).

## Churches CMS

1. Sign in → open the **Churches** tab (after Home).
2. Select a diocese from the list (id badge, cathedral name, `open_license` / `permission_needed` chip).
3. Edit fields: diocese, cathedral, city, address, verification text/URLs, photo rights fields, `local_file` / `fallback_file`, notes, map query / Maps URL.
4. Optional: crop/upload into `public/media/cathedrals/` to set `local_file` (do not invent licenses — only upload rights-cleared photos).
5. Click **Save all churches** → `PUT /api/admin/cathedrals` → `/`, `/churches`, and `/sources` revalidate.

**Do not invent historical facts or licenses.** Keep captions and rights accurate. Seed data came from the verified cathedral register; placeholders for Faisalabad, Hyderabad, and Raiwind must stay until diocesan-approved images arrive.

## Inspect media board

Open **Inspect media** from the dashboard or visit `/admin/inspect`. The route is protected by the same admin session as `/admin` and is read-only.

The board inventories every Family Archive image, cathedral `local_file` and `fallback_file`, interview video and poster, People-page thematic still, and the homepage hero portrait. It shows the local public path, source class, readable native dimensions, native/card aspect comparison, fit recommendation, and crop-risk level. Native image dimensions come from the lightweight `image-size` package; interview video dimensions and orientation come from `data/cms/featured-interviews.json`.

Recommendation rule: **contain** when the native/card aspect difference is greater than `0.25`, or when portrait/landscape orientation mismatches. Make edits only in the existing Churches, Family Archives, Featured Interviews, or Media tabs.

Protected JSON endpoint: `GET /api/admin/media-inspect`.

## Uploads

- Allowed types: JPEG, PNG, WebP, GIF
- Max size: **8 MB**
- Filenames are sanitized; a timestamp suffix is added
- Destinations:
  - `uploads` → `/media/uploads/…`
  - `facebook` → `/media/archive/facebook/…`
  - `cathedrals` → `/media/cathedrals/…`
- After upload, paste the returned path into a Family Archive **Image path** field (the Media tab can hand the path into the FA form automatically), or use the Churches tab crop widget to set `local_file`.

## Crop how-to

1. Open **Media library** on the dashboard.
2. Choose aspect **free**, **4:3**, or **3:4**.
3. Select an image; drag on the preview to set the crop rectangle.
4. Click **Upload crop** (or **Upload without crop** to skip).
5. Use the returned path on a Family Archive item.

## Logout

Use **Log out** on the dashboard. That clears the session cookie via `POST /api/admin/logout`.

## Manual QA checklist

- [ ] With `ADMIN_OPEN_PREVIEW=true`, `/admin/login` shows **Enter as curator (local preview)** → lands on `/admin`
- [ ] With preview off (or production), preview endpoint returns 403
- [ ] Unauthenticated `GET /admin` → redirect to `/admin/login`
- [ ] Bad password → 401 / error message; no session
- [ ] Good password → dashboard
- [ ] Home tab save → `data/cms/homepage.json` updates; `/` reflects new hero title
- [ ] Churches tab save → `data/cms/cathedrals.json` updates; `/churches` reflects edits
- [ ] Create / edit / delete a Family Archive item → persists in JSON; `/archive` reflects it
- [ ] Image upload → HTTP 200 and a public path under `/media/…`
- [ ] Logout → cookie cleared; `/admin` redirects to login again
- [ ] Footer shows discreet **Curator login** link (not in primary nav)
- [ ] **Inspect media** opens `/admin/inspect`; unauthenticated access redirects to login
- [ ] `GET /api/admin/media-inspect` requires an admin session and lists all published paths

## API surface (all require an admin session except login / preview)

- `POST /api/admin/login`
- `POST /api/admin/login/preview` (local preview only)
- `POST /api/admin/logout`
- `GET|PUT /api/admin/homepage`
- `GET|PUT /api/admin/cathedrals`
- `GET|POST /api/admin/family-archives`
- `PUT|DELETE /api/admin/family-archives/[id]`
- `GET /api/admin/featured-interviews`
- `PUT /api/admin/featured-interviews/[id]`
- `GET|PUT /api/admin/curator-profile`
- `POST /api/admin/upload` (multipart: `file`, optional `destination`)
- `GET /api/admin/media-inspect` (read-only native dimensions and crop-risk assessment)
