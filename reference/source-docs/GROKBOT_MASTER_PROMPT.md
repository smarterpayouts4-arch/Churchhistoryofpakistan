# MASTER PROMPT FOR GROKBOT

You are building the public website **History: Church of Pakistan**. Use the supplied project folder as the source of truth.

## Goal

Create a polished, responsive, accessible heritage website based on **Design 01 — Archival Heritage**, found at:

`assets/design-reference/design-01-archival-heritage-reference.jpg`

The site is a living digital archive for photographs, documents, family memories, interviews, biographies, church buildings, and factual history relating to the Church of Pakistan.

Do not turn this into a generic evangelical/church-service website. The mood is **historical, human, archival, documentary, dignified, warm, trustworthy**.

## Core title and copy

**History: Church of Pakistan**

**Preserving History • Honouring Our Forefathers • Inspiring Future Generations**

Intro:
> History: Church of Pakistan is a platform dedicated to informing the present and coming generations about the contributions, sacrifices, and service of our forefathers who helped shape the life and witness of the Church and its people in Pakistan. Our purpose is to preserve historical memories and make them accessible through photographs, published documents, family records, and personal memories.

### Our Purpose

**Pictorial History & Facts**  
Share historical photographs and factual information drawn from published books, documents, church records, and other reliable sources.

**Untold Stories**  
Bring to light lesser-known stories and events, based on documented historical evidence.

**Preserving Family Memories**  
Recover and preserve the memories, photographs, and personal stories of deceased church leaders through their families and those who knew them.

**Honouring Those Who Served**  
Pay tribute to both clergy and laypeople, living and deceased, who contributed to the Church and served their communities.

### My Connection to the Church

Use this copy exactly unless the owner edits it:

> I am a Christian and a born member of the Church of Pakistan.  
> I served as a Member of the Executive Committee of the Church of Pakistan from 1991 to 2017.  
> My father, Rt. Rev. Bishop Johnston Safdar Qadir Bakhsh, served as a Bishop and Moderator of the Church of Pakistan and devoted his life to the service of the Church.  
> This page is therefore not only a historical project but also a personal commitment to preserve the heritage and living memories of the Church of Pakistan for generations to come.

### Guiding principle

> “Preserve History for the Coming Generation.”

Supporting copy:
> We believe that history belongs to everyone. Our aim is to preserve it faithfully, respectfully, and responsibly—so that future generations can learn from the people, events, sacrifices, and achievements that shaped the Church of Pakistan.

## Required homepage order

1. Slim masthead + navigation
2. Hero with the supplied curator portrait
3. Our Purpose — 4 archival cards
4. Featured Interviews
5. Churches & Places — all 8 Church of Pakistan diocesan cathedrals/centres
6. A Journey Through Time — sourced milestones only
7. From the Family Archives
8. My Connection to the Church
9. Share Your Memories / Contribute to the Archive CTA
10. Guiding principle
11. Source/photograph credit area
12. Footer

## Hero

Desktop:
- Left: `assets/founder/founder-portrait-hero.webp`
- Right: title, strapline, intro, two buttons
- Primary button: **Explore the Archive**
- Secondary: **Watch Interviews**
- Add a handwritten-feel pull quote, but use a normal accessible font fallback if no script font is available:
  **“Preserve History for the Coming Generation.”**

Mobile:
- Stack portrait above copy.
- Avoid text over the face.
- Keep hero image crop stable with `object-position`.

Do not infer or invent the curator's public display name. Use **Project Curator** until the owner confirms the exact public name/spelling.

## Visual language

Read `docs/DESIGN_SYSTEM.md` and follow it closely.

Essential palette:
- parchment `#F3E7CF`
- paper `#FBF5E9`
- burgundy `#6D2227`
- deep burgundy `#4F171B`
- ink `#292522`
- muted brown `#6E6255`
- antique gold `#AF8B58`
- border `#CDBB9C`

Typography:
- Editorial serif headings: Georgia or a self-hosted equivalent
- Clear sans UI/body support: system sans
- Use italics sparingly for quotes
- No novelty fonts for body copy

Texture:
- subtle paper grain only
- thin rules, archival stamps, card borders
- no heavy gradients, neon, glassmorphism, or modern SaaS visuals

## Cathedral content

Read:
`data/cathedrals.json`

There are eight dioceses. Build a responsive 4x2 desktop / 2-column tablet / 1-column mobile gallery.

For each card show:
- cathedral name
- diocese
- city
- a short “View history” link
- source/rights status in CMS metadata, not necessarily visually dominant

Five exact cathedral photos have verified reusable licensing and are listed in:
`assets/cathedrals/REMOTE_ASSET_MANIFEST.json`

First run:
`python scripts/fetch_cathedral_photos.py`

Do not replace the three “permission needed” placeholders with arbitrary images from internet search. Those are:
- St. John's Cathedral, Gojra — Diocese of Faisalabad
- St. Thomas Cathedral, Hyderabad — Diocese of Hyderabad
- Central Cathedral of Praying Hands, Lahore — Diocese of Raiwind

When a rights-cleared photo is later supplied, replace only the matching placeholder and update the credit manifest.

## Research integrity

Do not invent dates, biographies, quotations, offices, denominational facts, or interviewees.

Every historical item should support:
- source title
- source URL/book citation
- date accessed
- confidence/status
- image rights/credit where relevant

Suggested provenance badges:
- **Church Record**
- **Published Source**
- **Family Archive**
- **Oral History**
- **Photograph**
- **Needs Verification**

An oral-history memory must not be presented as documented fact unless independently corroborated.

## Timeline

Use only milestones supported in `docs/RESEARCH_AND_SOURCES.md`. Good homepage milestones include:
- 1852 — foundation stone of Holy Trinity Cathedral Church, Sialkot
- 1887 — Cathedral Church of the Resurrection, Lahore completed/consecrated
- 1970 — Church of Pakistan formed through union of Anglican, Methodist, Lutheran, and Scottish Presbyterian traditions
- 1980 — four additional dioceses created: Hyderabad, Raiwind, Faisalabad, Peshawar
- 2011 — Diocese of Raiwind dedicated the Central Cathedral of Praying Hands on Warris Road, Lahore

Keep the timeline a teaser; the full timeline should become a separate archive page.

## Interviews

Do not invent featured people. Build three reusable cards with fields:
- portrait/thumbnail
- person's name
- role/vocation
- story title
- 1-sentence excerpt
- video/audio/article type
- date
- provenance/source
- “Watch / Read interview”

Until real content is supplied, label these cards **Interview story coming soon**.

## Archive model

Prepare content types for:
- People
- Interviews
- Churches / Places
- Historical Events
- Photographs
- Documents
- Family Collections
- Tributes

See `docs/CONTENT_MODEL.md`.

## Search / filters

Archive page should eventually support:
- person
- diocese
- city
- decade/year
- category
- media type
- source type
- clergy / layperson
- living / deceased only if ethically appropriate and explicitly documented

## Accessibility

- semantic HTML
- keyboard-visible focus
- skip link
- WCAG AA color contrast
- meaningful alt text, never “image of”
- transcripts for every interview video/audio
- no auto-playing media
- respect reduced motion
- heading order must be logical
- all form fields labelled
- decorative paper textures hidden from assistive technology

## SEO / sharing

Homepage:
- title: `History: Church of Pakistan | Preserving Our Heritage`
- description: `Photographs, documents, interviews and family memories preserving the history and people of the Church of Pakistan for future generations.`
- Open Graph image should be a purpose-made 1200x630 composite, not the raw screenshot.
- add Organization / CollectionPage / Article structured data only where accurate
- use canonical URLs
- build human-readable slugs

## Contribution form

CTA title:
**Share Your Memories**

Ask contributors for:
- contributor name
- email/contact
- person/place/event represented
- approximate date
- story or description
- source/context
- upload photographs/documents
- rights confirmation checkbox
- consent for publication checkbox
- optional request for credit wording

Never publish an uploaded family photo automatically. It must enter a moderation/review queue.

## Privacy / safeguarding

Do not expose private addresses, phone numbers, personal email addresses, or sensitive family information submitted through the archive. Public institutional addresses may be displayed if already published by the institution and genuinely useful.

## Deliverable quality bar

The finished page should look like a custom historical publication, not a template:
- strong vertical rhythm
- crisp editorial typography
- consistent image ratios
- generous margins
- subtle archival ornament
- fast image loading
- thoughtful mobile adaptation
- clear credits
- credible sourcing

Use `starter-site/` as a working reference, but improve code quality as needed. Preserve the design intent.
