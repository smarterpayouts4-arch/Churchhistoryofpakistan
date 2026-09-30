# CHURCHES MEDIA GAPS — History: Church of Pakistan

**Audit date:** 2026-09-19 (America/New_York, EDT)  
**Rule:** Do **not** invent historical captions, alternate cathedral names, or unverified photo credits. Identities below follow `src/content/cathedrals.ts` only.

---

## Status matrix

| Diocese | Cathedral (verified identity) | City / seat note | Live asset | Gap |
|---------|-------------------------------|------------------|------------|-----|
| **Faisalabad** | St. John's Cathedral | Gojra, Punjab (Mission Road) | SVG placeholder | **Need exterior photo + written permission** |
| **Hyderabad** | St. Thomas Cathedral | Hyderabad, Sindh (27 Liaqat Road, Civil Lines) | SVG placeholder | **Need exterior photo + written permission / open license** |
| Karachi | Holy Trinity Cathedral | Karachi, Sindh | `karachi-holy-trinity.jpg` (open license) | Soft/small — optional sharper re-export |
| Lahore | Cathedral Church of the Resurrection | Lahore, Punjab (The Mall) | `lahore-resurrection.jpg` | OK |
| Multan | Cathedral of St. Mary the Virgin | Multan Cantt | `multan-st-mary.jpg` | OK |
| Peshawar | St. John's Cathedral | Peshawar Cantonment | `peshawar-st-john.jpg` | OK (source has caption frame) |
| **Raiwind** | Central Cathedral of Praying Hands | Lahore (Waris/Warris Road) | SVG placeholder | **Need exterior photo + written permission** |
| Sialkot | Holy Trinity Cathedral Church | Sialkot Cantonment | `sialkot-holy-trinity.jpg` | OK |

**Missing real photos (priority):** Faisalabad · Hyderabad · Raiwind.

---

## Per-church needed photo + suggested open-license search queries

Queries are **search starting points only**. Confirm exact building identity against diocesan/NCCP sources before publishing. Prefer diocese-supplied rights-cleared exteriors when Wikimedia has no exact match.

### 1. Faisalabad — St. John's Cathedral, Gojra

| Field | Value |
|-------|-------|
| Needed | Clear exterior (daylight), facing facade if possible; ≥1200px wide |
| Rights path | Written permission from Diocese of Faisalabad / photographer **or** verified open license of **this** building |
| Do not use | Unrelated Gojra churches; invent captions |
| Suggested Wikimedia / Commons queries | `St John's Cathedral Gojra`; `St. John's Cathedral Gojra Church of Pakistan`; `Gojra cathedral Pakistan` |
| Suggested web (permission) queries | site:dofcop.org cathedral photo; “St John's Cathedral Gojra” exterior |
| Verification anchors | https://dofcop.org/ · https://dofcop.org/contact.html |

### 2. Hyderabad — St. Thomas Cathedral

| Field | Value |
|-------|-------|
| Needed | Clear exterior of St. Thomas Cathedral, Civil Lines / Liaqat Road |
| Rights path | Diocese of Hyderabad / photographer permission **or** open license; **do not** use Getty/editorial without license |
| Do not use | Stock “Hyderabad church” without identity match |
| Suggested Wikimedia / Commons queries | `St Thomas Cathedral Hyderabad Pakistan`; `St. Thomas Cathedral Hyderabad Sindh`; `Church of Pakistan Hyderabad cathedral` |
| Suggested web (permission) queries | site:dohcop.org; “St Thomas Cathedral” “Liaqat Road” Hyderabad |
| Verification anchors | https://nccpakistan.org.pk/member-churches/ · https://dohcop.org/ |

### 3. Raiwind — Central Cathedral of Praying Hands

| Field | Value |
|-------|-------|
| Needed | Exterior of Central Cathedral of Praying Hands, Waris/Warris Road, Lahore |
| Rights path | Request high-res exterior from Diocese of Raiwind with written reuse permission |
| Do not use | Interior-only shots mislabeled as exterior; invent dedication captions beyond verified sources |
| Suggested Wikimedia / Commons queries | `Central Cathedral of Praying Hands`; `Praying Hands Cathedral Lahore`; `Diocese of Raiwind cathedral` |
| Suggested web (permission) queries | “Central Cathedral of Praying Hands” Warris Road; Diocese of Raiwind newsletter imagery (permission required) |
| Verification anchors | Raiwind newsletter PDF (Cloudfront link in `cathedrals.ts`); Church of Scotland World Mission post tagged Diocese of Raiwind; NCCP member list |

---

## Already satisfied (no acquisition needed for identity)

Open-license locals already published:

- Karachi — Wikimedia `Trinity_Cathedral_Karachi.jpg` (PD-self) → `karachi-holy-trinity.jpg`
- Lahore — Wikimedia Resurrection facade (CC BY-SA 4.0) → `lahore-resurrection.jpg`
- Multan — Wikimedia St. Mary (CC BY-SA 4.0) → `multan-st-mary.jpg`
- Peshawar — Wikimedia St. John's (CC BY-SA 4.0) → `peshawar-st-john.jpg`
- Sialkot — Wikimedia WLMP (CC BY-SA 3.0) → `sialkot-holy-trinity.jpg`

Full-res / alternate filenames under `public/media/cathedrals/` and `reference/cathedrals/downloaded/` are inventory twins — not additional dioceses.

---

## Acquisition checklist (when photos arrive)

1. Confirm building matches `cathedrals.ts` name + city/address.  
2. Record author, license URL, source page in `cathedrals.ts`.  
3. Place publishable file at `public/media/cathedrals/{id}-….jpg` (kebab-case).  
4. Keep SVG as `fallback_file` only.  
5. Preserve attribution / ShareAlike where required (`IMAGE_RIGHTS_AND_CREDITS.md`).  
6. **Do not invent captions** beyond rights metadata and verified diocesan facts.

---

## Research pass — 2026-09-21 (America/New_York, EDT)

Re-checked Wikimedia Commons API, Openverse (CC filters), Flickr CC-oriented search, Tavily web/extract, and diocesan sites. **No change:** Faisalabad, Hyderabad, and Raiwind remain SVG placeholders.

| Diocese | Finding |
|---------|---------|
| Faisalabad / Gojra | Commons + Openverse: **0** files for St. John's Cathedral, Gojra. dofcop.org has event/school imagery without a stated open license — not publishable. |
| Hyderabad / Sindh | Commons has **St Francis Xavier** (Catholic) Hyderabad photos — **wrong building**. Exact St. Thomas exteriors appear on Getty/iStock and dohcop.org (`St.-Thomas-Cathedral-Photos-12…`) and EFT Sindh heritage page (**All Rights Reserved**) — not open license. |
| Raiwind / Praying Hands | No Commons/Openverse exact match. Church of Scotland WMC WordPress has dedication photos (e.g. `lahore-cathedral-of-the-praying-hands_11.jpg`) without a CC grant — keep placeholder. |

**Rejected lookalikes:** Faisalabad-city churches; St Thomas Mumbai / Secunderabad / India; St Francis Xavier Cathedral Hyderabad; Dürer “Praying Hands” art.
