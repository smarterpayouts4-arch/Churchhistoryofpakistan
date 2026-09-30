# Facebook harvest wire log

**Date:** 2026-09-19 (America/New_York)  
**Repo:** `history-church-of-pakistan` (local box workspace)  
**Plan:** `PUBLISH_PLAN.md` Wave 1 ready_to_publish

## Published (wired into `family-archives.ts` + public JPG)

| ID | Source for public JPG | verificationStatus | Notes |
|----|----------------------|--------------------|-------|
| `fb-bashir-jewan-portrait` | Cropped from `screenshots/` (FB chrome removed) | facebook-caption | Caption from screenshot UI |
| `fb-mrs-samuel-pervaiz` | Cropped from `screenshots/` | facebook-caption | Caption from screenshot UI |
| `fb-sewak-bm-augustine` | Cropped from `screenshots/` | facebook-caption | Caption from screenshot UI |
| `fb-bishop-young-js-qadir` | Clean composite from `images/fb-sialkot-bishops-cover.png` (same dual portrait; screenshot had FB chrome only) | facebook-caption | Caption from screenshot UI; image overlay names Moderator dates |
| `fb-official-board-cathedral-construction` | `images/` → JPG (may have already existed) | needs-verification | Overlay heading only; no board-member names invented |
| `fb-district-superintendent-lahore-1-9` | `images/` → JPG | needs-verification | Image heading; post had no caption; list names not promoted |
| `fb-umc-pakistan-overseas-education-list` | `images/` → JPG | needs-verification | Image heading + author comment noted; list names not promoted |
| `fb-sialkot-bishops-cover` | `images/` → JPG (refreshed) | facebook-caption | Paired with young/js-qadir related-post caption |
| `fb-board-honour-pastors-10-16` | `images/` → JPG (may have already existed) | facebook-caption | Companion to Board of Honour; list names not promoted |
| `fb-founder-methodist-church-july-16` | `images/` → JPG | facebook-caption | Verbatim FB caption only; portrait identity not invented |

**Count:** 10 IDs wired (8 prior + 10 new = 18 total Family Archive items).

## Skipped (and why)

| ID / set | Reason |
|----------|--------|
| `fb-fredrick-bagtaney-1984` | **Filename vs caption mismatch.** Screenshot UI caption concerns Bishop Bashir Jewan consecration (Apr 10, 1981) by Bishop Johnston Safdar Qadir Bakhsh; filename suggests “Fredrick Bagtaney”. Hold until re-harvest reconciles caption/filename. Do not invent. |
| Captionless orphans (`fb-church-exterior-july-17`, `fb-church-interior-july-17`, `fb-stained-glass-altar-july-17`, `fb-historic-preacher-july-8`) | Hold — no FB caption; leave unwired even if orphan public JPGs exist. |
| Nila Gumbad / related set | Deferred to Other Heritage pass (not Family Archive). |
| `harvest_needed` inventory gaps (rudvin, armstunz, bishops-couple, CDN-403 items) | No usable clean image yet. |

## Crops / media notes

- Screenshot-only portraits used lightbox crops excluding sidebar, nav arrows, and login banner.
- `fb-bishop-young-js-qadir` public JPG intentionally sourced from the clean `images/fb-sialkot-bishops-cover.png` twin rather than a chrome-heavy screenshot crop (same composite visual).
- No failed crops; all 10 target public JPGs present under `public/media/archive/facebook/`.

## Checks

- `pnpm typecheck` — **pass** (`tsc --noEmit`)
- curl `:4000/` and `:4000/archive` — **200 OK** (dev briefly started for check; new IDs present in archive HTML)

## Wave 2026-09-19 evening — new harvest wire (fa26)

**Date:** 2026-09-19 ~21:25 (America/New_York)  
**Source:** `images/*.png` from logged-in viewer harvest (INVENTORY.md “File harvest — 2026-09-20” rows)

### Newly wired (8)

| ID | Public JPG | verificationStatus | Notes |
|----|------------|--------------------|-------|
| `fb-rudvin-1998` | cropped bottom FB strip → JPG | facebook-caption | Verbatim Samson/Sampson spelling retained |
| `fb-armstunz` | side/bottom chrome trim → JPG | facebook-caption | Caption spelling Armstunz kept; claims may need cross-check |
| `fb-bishops-couple` | clean photo → JPG | facebook-caption | Constitutional claims transcribed; claims may need cross-check |
| `fb-bashir-jewan-hyderabad-1980` | collage as harvested → JPG | facebook-caption | Hyderabad Diocese 1980 caption; subsequent bishops named in FB caption only |
| `fb-bashir-jewan-moderator-1981` | side/bottom trim → JPG | facebook-caption | Verbatim “severed” retained |
| `fb-bashir-jewan-rare` | side chrome trim → JPG | facebook-caption | Consecration Apr 10, 1981 claim from FB caption |
| `fb-bishop-wg-young` | side chrome trim → JPG | facebook-caption | Short caption: 1st Bishop of Sialkot |
| `fb-bishop-william-g-young` | clean → JPG | facebook-caption | Caption only (author comment on Scotch Mission / 1970–1976 not elevated) |

### Refreshed public JPGs (already wired)

| ID | Notes |
|----|-------|
| `fb-mrs-samuel-pervaiz` | Re-exported from new `images/` harvest; sourceUrl set to photo fbid |
| `fb-sewak-bm-augustine` | Letterbox cropped from new harvest; sourceUrl set to photo fbid |

**Count:** 8 new + 18 prior = **26** Family Archive items.

### Checks

- `pnpm typecheck` — **pass**
- Sync pack: `/workspace/heritage-forge/hcop-fa26.tar.gz` (+ 400k chunks `hcop-fa26-aa`…)

## Dedup audit — 2026-09-19 ~21:32 EDT

**Report:** `reference/facebook-page/DEDUPE_REPORT.md`

### Removals from `family-archives.ts` (2)

| Removed | Kept | Reason |
|---------|------|--------|
| `fb-sialkot-bishops-cover` | `fb-bishop-young-js-qadir` | Byte-identical JPG; weaker “related post” caption |
| `fb-bashir-jewan-portrait` | `fb-bashir-jewan-moderator-1981` | Same outdoor portrait / overlapping moderator-1981 caption; weaker inventory-summary caption |

**Family Archive count:** 26 → **24**.

### Related series kept (not removed)

- Bashir Jewan: `moderator-1981` + `hyderabad-1980` + `rare`
- Bishop Young: `fb-bishop-wg-young` + `fb-bishop-william-g-young`
- Board of Honour: primary + `pastors-10-16`

### Misregistrations flagged (not auto-rewired to video)

- `Interviews.tsx` + `interviews/page.tsx` reuse Family Archive stills as interview cards (content model requires youth motivational **videos**). Flagged only; no invented video.

### Other

- Retargeted `people/page.tsx` diocesan frame to kept young-js-qadir JPG.
- Orphans listed in DEDUPE_REPORT (5 FB JPGs); none deleted.
- `pnpm typecheck` after TS change.
