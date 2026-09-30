# Sources and Rights — History: Church of Pakistan (Heritage Forge working tree)

Repo root: `/workspace/heritage-forge/history-church-of-pakistan/`  
Authority for remote cathedral photos: `reference/cathedrals/REMOTE_ASSET_MANIFEST.json`  
Also see: `docs/IMAGE_RIGHTS_AND_CREDITS.md`, `docs/CATHEDRAL_PHOTO_STATUS.md`, `docs/ASSET_REGISTRY.md`

**This document is operational guidance for Rights & Media / Heritage Forge, not legal advice.**

---

## Rights posture (summary)

1. **No unlicensed web scraping.** Photographs that appear online are not automatically reusable. Only assets with documented reuse terms enter `public/media/`.
2. **Verified open-license cathedral photos (5)** were downloaded from Wikimedia Commons using the exact `download_url` values in the remote manifest (`status: open_license`). Originals live under `reference/cathedrals/downloaded/`; kebab-case publish copies live under `public/media/cathedrals/` matching each `target_filename`.
3. **Permission-needed cathedrals (3)** — Faisalabad, Hyderabad, Raiwind — keep **SVG placeholders only**. No Getty/editorial or other uncleared photos were fetched or republished.
4. **Founder/curator portrait** is **user-supplied**. Publishable WebP crops may appear in `public/media/founder/` for site use, with rights noted as **user-supplied; confirm display name before launch**. The source screenshot stays reference/source-only and is **not** in `public/media/`. **Do not identify people from photographs**; credit as “founder/curator portrait (user-supplied)” until display name is confirmed.
5. **Design references** remain in `reference/design-reference/` only — never copied to `public/media/`.
6. **Brand SVGs** are package-generated marks and may be published under `public/media/brand/`.
7. **Cathedral placeholders** (package-generated SVG) may be published under `public/media/cathedrals/placeholders/` until cleared photos replace them (or as fallbacks for the five already-cleared cards).

---

## Open-license cathedral photos (fetched)

| ID | Cathedral | License | Author | Publish file | Source page |
|----|-----------|---------|--------|--------------|-------------|
| karachi | Holy Trinity Cathedral | Public domain (PD-self) | Calan | `public/media/cathedrals/karachi-holy-trinity.jpg` | https://commons.wikimedia.org/wiki/File:Trinity_Cathedral_Karachi.jpg |
| lahore | Cathedral Church of the Resurrection | CC BY-SA 4.0 | Ali lahoti | `public/media/cathedrals/lahore-resurrection.jpg` | https://commons.wikimedia.org/wiki/File:Cathedral_Church_of_the_Resurrection,_from_front_gate.jpg |
| multan | Cathedral of St. Mary the Virgin | CC BY-SA 4.0 | Tahsin Shah | `public/media/cathedrals/multan-st-mary.jpg` | https://commons.wikimedia.org/wiki/File:CATHEDRAL_OF_St._MARY_THE_VIRGIN_CHURCH_MULTAN.jpg |
| peshawar | St. John's Cathedral | CC BY-SA 4.0 | WaqasM.Khan1983 | `public/media/cathedrals/peshawar-st-john.jpg` | https://commons.wikimedia.org/wiki/File:St._John%27s_Cathedral_Peshawar.jpg |
| sialkot | Holy Trinity Cathedral Church | CC BY-SA 3.0 | PakGuru99 | `public/media/cathedrals/sialkot-holy-trinity.jpg` | https://commons.wikimedia.org/wiki/File:Sialkot_Cathedral,_Pakistan_WLMP_fifty_five.jpg |

Download method: explicit `curl` of each manifest `download_url` (not a bulk scrape; `fetch_cathedral_photos.py` was not used).

---

## ShareAlike notes

- **CC BY-SA 4.0** (Lahore, Multan, Peshawar) and **CC BY-SA 3.0** (Sialkot): attribution required; **ShareAlike** applies to adaptations of the image (crop/resize/derivative works of the photo).
- Keep attribution and license visible in captions/credits; do not strip licensing from the asset registry or manifest.
- If the site crops or otherwise adapts a BY-SA photo, note that (e.g. “cropped”) and ensure the adapted image is shared under a compatible ShareAlike license.
- **Public domain (PD-self)** Karachi photo: no ShareAlike obligation; attribution retained as good archival practice.

Recommended visible credit format:

```text
Photo: [Creator] / Wikimedia Commons / [License]
```

Link the Commons file page and the license deed where practical.

Example:

```text
Photo: Ali lahoti / Wikimedia Commons / CC BY-SA 4.0
```

---

## Permission-needed list (placeholders only)

| ID | Cathedral | Why | Publish visual |
|----|-----------|-----|----------------|
| faisalabad | St. John's Cathedral, Gojra | No clearly reusable/open-licensed exact exterior verified | `public/media/cathedrals/placeholders/faisalabad-st-john.svg` |
| hyderabad | St. Thomas Cathedral | Getty/editorial-class images found; not reusable without a license | `public/media/cathedrals/placeholders/hyderabad-st-thomas.svg` |
| raiwind | Central Cathedral of Praying Hands | Online photos exist; reusable license not verified | `public/media/cathedrals/placeholders/raiwind-praying-hands.svg` |

**Next step for each:** contact the relevant diocese (or photographer) for a high-resolution exterior with **written permission** to publish on History: Church of Pakistan, including crop/resize for web. Record photographer name and requested credit line. Place licensed originals under `reference/cathedrals/licensed/` and kebab-case publish copies under `public/media/cathedrals/` only after clearance is documented.

---

## Founder / curator

- Source screenshot: `reference/founder/founder-source-screenshot.jpeg` — **source only; not published**.
- Publishable: `public/media/founder/founder-portrait-hero.webp`, `public/media/founder/founder-portrait-square.webp`.
- Rights string for registry/UI: **user-supplied; confirm display name before launch**.
- Credit until name confirmed: **founder/curator portrait (user-supplied)**.
- Do not guess or invent a personal name from the image.

---

## What must never enter public/media

- Uncleared cathedral photographs (including permission_needed dioceses).
- Design-reference boards/JPGs.
- Founder source screenshot.
- Any scrape of non-manifest URLs.

---

## Checksums

SHA-256 hashes of every file under `public/media/` are recorded in `docs/MEDIA_CHECKSUMS.txt`.
