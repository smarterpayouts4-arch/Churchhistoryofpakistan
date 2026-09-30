# SEO, Accessibility & Publishing Checklist

## SEO
- Unique `<title>` and meta description on every page.
- Canonical URLs.
- Open Graph / social cards.
- Human-readable slugs, e.g. `/churches/holy-trinity-cathedral-sialkot/`.
- Structured data only when the type is accurate.
- XML sitemap and robots.txt.
- Avoid keyword stuffing.
- Write descriptive captions that help humans first.

## Accessibility
- WCAG AA contrast.
- 44px minimum practical tap targets.
- Skip link.
- Logical heading hierarchy.
- Visible keyboard focus.
- Alt text describes documentary content and why it matters.
- Decorative textures get empty alt / CSS-only implementation.
- Captions/transcripts for every recorded interview.
- No autoplaying audio/video.
- Respect `prefers-reduced-motion`.
- Forms have labels, validation messages, and clear consent text.

## Performance
- Resize church images to 1600px max for most page cards.
- Generate AVIF/WebP plus JPG fallback in production.
- Set width/height to prevent layout shift.
- Lazy-load below-the-fold images.
- Do not lazy-load the hero LCP image.
- Minimize third-party scripts.
- Self-host fonts where licensing permits.

## Historical publishing workflow
1. Draft record.
2. Add provenance/source.
3. Verify names/dates.
4. Verify image rights.
5. Family/subject review where appropriate.
6. Editorial approval.
7. Publish.
8. Keep correction history.

## Contribution uploads
- Virus-scan server-side.
- Store originals privately.
- Publish derivatives only after moderation.
- Preserve metadata separately even if EXIF is stripped from public files.
- Never expose contributor email/phone publicly.
