# Starter Site

This is a dependency-free HTML/CSS/JS implementation of Design 01.

## Preview

From the package root:

```bash
python -m http.server 8080
```

Then open:

`http://localhost:8080/starter-site/`

## Before previewing cathedral photos

Run:

```bash
python scripts/fetch_cathedral_photos.py
python scripts/optimize_images.py
```

The HTML currently points to `assets/cathedrals/downloaded/` for the five verified open-license photos and automatically falls back to local SVG placeholders when a file is absent.

Three cathedrals intentionally remain placeholders pending photo permission.

## Production

A developer/Grokbot may port this structure into Next.js, Astro, WordPress, Webflow, or another CMS. Preserve:
- source transparency
- image credits/licenses
- alt text
- provenance labels
- responsive behavior
- the archival design direction
