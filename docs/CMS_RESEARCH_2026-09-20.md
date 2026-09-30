# CMS & heritage research brief — 2026-09-20

Sources: Tavily search/extract/map/research, Context7 (Next.js), Mobbin flows/screens.  
Scope: make History: Church of Pakistan fully curator-editable without inventing history.

## A. Next.js CMS patterns (industry)

Must-haves for App Router CMS integrations (Acquia, Naturaily, Focus Reactive surveys 2026):

1. **On-demand revalidation** after every write (`revalidatePath` / `revalidateTag`) — not rebuild-only.
2. **Preview / Draft Mode** so editors see changes before public publish (parity with production components).
3. **Structured content models** (typed fields, relationships) over free-form HTML dumps.
4. Same public components for preview and live (no “admin-only look”).

**Our site status:** JSON CMS under `data/cms/` already calls `revalidatePath` on homepage, family archives, interviews, and curator profile saves. One-click local preview auth exists (`ADMIN_OPEN_PREVIEW`). Full Draft Mode (draft vs published) is not built yet.

## B. Heritage / authenticity (DOAWG Three Pillars)

Provenance tools ranked by museum digitization guidance:

| Tool | Strength | Weakness |
|---|---|---|
| Source **links** | Visible context | Fragile / can point wrong |
| **Captions** adjacent to media | Rich, accessible to AT | Unstructured unless we enforce schema |
| Embedded **metadata** | Portable | Easily stripped |
| Watermarks | Persistent mark | Visual intrusion |

Policy takeaway: provenance extends trust in the *institution*; captions + source URL + verification status on every archive card are non-negotiable. Do not invent names/dates.

**Our site status:** Family Archive items require caption, provenance `"Family Archive"`, sourceLabel, verificationStatus (`facebook-caption` | `needs-verification`). Keep that discipline when expanding CMS.

## C. Official Church of Pakistan facts (for CMS seed fidelity)

From [cop.org.pk/About-Us](https://cop.org.pk/About-Us) and WCC member page (aligned):

- Union **1970**: Anglican, Methodist, Lutheran, Presbyterian (Scottish). United Presbyterian did **not** join.
- Initial dioceses: Karachi, Multan, Lahore, Sialkot.
- **1980**: Hyderabad, Raiwind, Faisalabad, Peshawar added → **eight** dioceses + Gulf ministries bishop.
- Moderator = presiding bishop (term noted as three years on WCC page).

Homepage timeline already encodes 1970 / 1980 correctly. Churches CMS should keep eight dioceses; missing photos remain Faisalabad / Hyderabad / Raiwind (placeholders on purpose until rights-cleared).

## D. Curator admin UX (Mobbin)

Reference patterns to copy (not clone branding):

- **Ghost** dashboard: sidebar sections (Dashboard / View site / Posts / Pages) + clear Drafts / Published — https://mobbin.com/flows/1f089b55-c2bf-4a89-b1fa-128f0750443f
- **Framer / Wix / Webflow CMS tables**: Title · Status badge · Thumbnail · Dates · row actions — collection list UX
- Empty states with one primary “+ Add” CTA
- “View site” link always visible from admin
- Status chips: Draft / Live / Needs verification

## E. Recommended build order (HCOP)

Already done: Home CMS, FA CRUD, interviews metadata, media crop, profile JSON, one-click local login, revalidatePath.

Next (priority):

1. **Churches / dioceses CMS** — editable titles, blurbs, photo paths, rights notes (eight dioceses).
2. **Profile form editor** — replace raw JSON with fields (still sourced from curator PDF only).
3. **Draft vs Live** — optional publish flag per FA / homepage section + admin “View site”.
4. **Admin shell polish** — Ghost-like sidebar + status badges on FA list (Mobbin).
5. Later: Payload/Directus only if single-curator JSON store becomes too limited.

## F. Tooling used this pass

- Tavily: search ×3, extract ×2, map ×1, research (pro timed out; mini timed out)
- Context7: Next.js revalidatePath / revalidateTag / draftMode
- Mobbin: flows (Ghost, Framer, Whop, Circle, Ferndesk) + screens (Framer, Wix, Webflow, Jasper, Salesforce, …)
