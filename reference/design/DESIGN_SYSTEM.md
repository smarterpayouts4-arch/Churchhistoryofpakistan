# Design System — Archival Heritage

## 1. Brand feeling

Five words: **archival, dignified, warm, documentary, trustworthy**.

The design should suggest a carefully preserved family album, a museum label, and an old historical journal. It should *not* suggest a modern corporate landing page.

## 2. Color tokens

| Token | Hex | Use |
|---|---|---|
| Parchment | `#F3E7CF` | main page background |
| Paper | `#FBF5E9` | cards and content panels |
| Burgundy | `#6D2227` | primary CTA, section accents |
| Deep Burgundy | `#4F171B` | footer, hover, strong bands |
| Ink | `#292522` | primary text |
| Muted Brown | `#6E6255` | secondary text |
| Antique Gold | `#AF8B58` | fine decorative accents |
| Archival Border | `#CDBB9C` | rules, card borders |
| Soft Sage | `#7A806B` | optional small provenance tags |

Never use pure black for large text areas. Avoid bright saturated red.

## 3. Typography

Use a high-quality editorial serif if the production stack already has one licensed/self-hosted. Safe fallback:

```css
--font-display: Georgia, "Times New Roman", serif;
--font-body: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
```

Recommended scale:
- H1: clamp(2.7rem, 6vw, 5.6rem), tight line-height
- H2: clamp(2rem, 3.8vw, 3.2rem)
- H3: 1.25–1.5rem
- body: 1rem–1.125rem
- metadata: .78–.9rem, slight letter spacing

## 4. Spacing

Use an 8px base system. Section vertical spacing:
- mobile: 56–72px
- desktop: 88–120px

Max content width: 1180–1240px.

Text measure: 62–75 characters for reading passages.

## 5. Photography

- Hero portrait: vertical 3:4-ish crop.
- Church cards: consistent 4:3.
- Archive thumbnails: 4:3 or 1:1 depending record type.
- Historical images may retain their original ratios on detail pages.
- Do not over-sepia already historical images. Preserve documentary truth.
- A light warm toning layer is acceptable only for decorative preview thumbnails and should disappear on full view.

## 6. Borders and ornament

Use:
- 1px archival borders
- double-rule section separators sparingly
- tiny cross/book icon motifs
- subtle corner flourish in hero
- restrained paper grain

Do not use:
- giant drop shadows
- glossy buttons
- ornate gold frames around every element
- faux torn-paper edges everywhere

## 7. Buttons

Primary:
- burgundy background
- cream text
- 44px minimum hit target
- 6–8px radius

Secondary:
- transparent/paper background
- burgundy or ink border
- ink text

## 8. Section patterns

**Hero:** asymmetric two-column editorial composition.  
**Purpose:** four equal archival cards with simple icons.  
**Interviews:** three story cards with strong portraits.  
**Churches:** 8-card documentary gallery.  
**Timeline:** horizontal desktop / vertical mobile.  
**Family archives:** film-strip/grid rhythm.  
**Connection:** portrait + prose on paper panel.  
**CTA:** full-width burgundy band.  
**Footer:** deep burgundy with navigation, credits, source policy.

## 9. Interaction

Keep motion restrained:
- 120–180ms hover transitions
- gentle image scale max 1.02
- underline/link movement, not bouncing
- no parallax
- honor `prefers-reduced-motion`

## 10. Design reference

Primary visual reference:
`assets/design-reference/design-01-archival-heritage-reference.jpg`

The reference is a direction, not a pixel-perfect specification. Improve legibility, responsiveness, accessibility, and source transparency while preserving its mood.
