# Dynamic Content Audit — History: Church of Pakistan

**Live check:** 2026-09-21 4:39 PM EDT  
**Target:** `http://127.0.0.1:4000` on the user PC  
**Result:** PASS for runtime, public routes, preview authentication, CMS reads, and sampled media.

## 1. Login page status

- `GET /admin/login`: **200**.
- Login page contains **“Enter as curator (local preview)”** and explicitly reports local preview mode.
- `POST /api/admin/login/preview`: **200**, response `{"ok":true,"username":"javed","preview":true}`; session cookie accepted.
- Authenticated `GET /admin`: **200**.
- Dashboard tabs found: **Home, Churches, Family Archives, Interviews, Media, Curator profile**.
- Real browser click on **“Enter as curator (local preview)”** navigated to `/admin` successfully with zero console errors.
- Unauthenticated `GET /admin`: **307** to `/admin/login` (verified in a fresh isolated no-cookie browser context).

The initial dev server was serving on port 4000. During the live check, the dev-origin warning was identified as the cause of the inert preview control in the first browser pass. Added `allowedDevOrigins: ["127.0.0.1"]` to `next.config.ts`, restarted `npm run dev`, and re-ran the click successfully.

## 2. Public route table

| Path | Status | Content probe / dynamic source |
|---|---:|---|
| `/` | 200 | `History: Church of Pakistan`, `A Living Digital Archive`, and `Javed Qadir Bakhsh` present. Uses homepage CMS configuration and featured interview content. |
| `/about` | 200 | `Javed Qadir Bakhsh`, `Founder & curator`, and `connection` present. Uses curator-profile and shared homepage content. |
| `/archive` | 200 | `Central Cathedral 75th anniversary, 1975` present. Uses 24 family-archive records. |
| `/interviews` | 200 | `Rab Ki Khidmat` and `Motivational` present. Uses 4 featured-interview records; the oral-history-forthcoming notice is still editorial/static copy. |
| `/churches` | 200 | `Diocese` and `St. John's Cathedral` present. Uses 8 cathedral records. |
| `/contribute` | 200 | Contribution/archive/submit copy present. Shared homepage contribution fields are CMS-backed; form delivery depends on configured webhook/runtime settings. |
| `/sources` | 200 | Sources and citation register render. No CMS admin endpoint was exposed for this register in this audit; treat as static/code-managed until wired. |
| `/people` | 200 | People page renders and explicitly says records are forthcoming; no people data file/record set is present. |
| `/admin/login` | 200 | Preview login control and local-preview copy present. |
| `/admin` without cookie | 307 → `/admin/login` | Protected route behaves correctly. |

## 3. CMS record counts

| Admin API | Status | Count / shape |
|---|---:|---|
| `/api/admin/homepage` | 200 | One homepage configuration. Editable arrays: `purpose_cards` **4**, `connection` **4**, `timeline` **5**, `contribution_fields` **10**; hero object present. |
| `/api/admin/cathedrals` | 200 | **8** cathedral records. |
| `/api/admin/family-archives` | 200 | **24** family-archive records. |
| `/api/admin/featured-interviews` | 200 | **4** featured-interview records. |
| `/api/admin/curator-profile` | 200 | One curator profile: **Javed Qadir Bakhsh**. |

### Media spot-check

All five selected local paths returned **200** with the expected image MIME type:

- Family archive: `/media/archive/facebook/fb-central-cathedral-75th-1975.jpg` — `image/jpeg`
- Family archive: `/media/archive/facebook/fb-1974-coggan-lahore.jpg` — `image/jpeg`
- Family archive: `/media/archive/facebook/fb-1983-wcc-vancouver.jpg` — `image/jpeg`
- Cathedral: `/media/cathedrals/placeholders/faisalabad-st-john.svg` — `image/svg+xml`
- Cathedral: `/media/cathedrals/placeholders/hyderabad-st-thomas.svg` — `image/svg+xml`

## 4. DYNAMIC (editable in admin) vs STATIC (code-only)

### Dynamic / admin-backed

- Homepage title, strapline, guiding principle, hero content, purpose cards, connection items, timeline, and contribution fields.
- Curator profile content for Javed Qadir Bakhsh.
- Family archive records and their captions, metadata, and image paths (24).
- Cathedral/place records, addresses, verification notes, rights/status metadata, and local media paths (8).
- Featured interview records, video/poster paths, captions, and source metadata (4).
- Preview authentication/session state and protected dashboard access.

### Static or not yet backed by a CMS record set

- Shared site shell: navigation, footer, typography/branding, and most editorial labels.
- `/sources` institutional source register and photograph-credit presentation; no corresponding admin API was identified.
- `/people` thematic page and its “records forthcoming” state; there are currently no people records to edit.
- Editorial framing such as “oral-history interviews still forthcoming.”
- Contribution page explanatory/legal copy and delivery behavior outside the homepage contribution-field configuration; actual intake requires a configured webhook/backend.
- Legal/privacy completeness warning in the footer remains a launch-readiness item.

## 5. Gaps / P0–P2 recommendations

- **P0:** None found in this live check. Runtime is serving, all requested public routes are 200, auth works, the protected redirect is 307, CMS reads are 200, and sampled media is reachable.
- **P1:** Add verified people records and an admin-backed people editor before presenting `/people` as complete. Do not add biographies without source verification.
- **P1:** Decide whether the sources/credits register should be editable. If yes, add a CMS-backed source model; otherwise document it as code-managed and add an explicit maintenance check.
- **P1:** Configure and test the contribution webhook/intake path, plus complete legal/privacy pages before public launch.
- **P2:** Add automated smoke checks for route status, protected redirect, CMS endpoint status/counts, and representative media paths so regressions are caught after deploys.
- **P2:** Preserve the existing provenance/rights notes and do not fill placeholder cathedral imagery or historical gaps without confirmed permissions and citations.

No historical claims or new CMS content were invented. The only code change was the runtime dev-origin fix in `next.config.ts`; no CMS or historical content was changed.
