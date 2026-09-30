# AI_CONTEXT — History: Church of Pakistan

Five-minute orientation for humans and LLM coding agents.

## What this is

A **digital heritage archive** website for **History: Church of Pakistan**: photographs, documents, family memories, interviews, biographies, church buildings, and cited factual history — Design **#1 Archival Heritage** (sepia-and-burgundy archival album / museum discipline, not a generic church template).

## What this is not

- Not a corporate SaaS landing page or evangelical “services & events” site  
- Not a place to invent history, names, dates, biographies, or photo IDs  
- Not a scrapyard for unlicensed web images  
- Not a place to treat Design #1 mock names, fake churches, or mood-only timeline years as facts  

## Where truth lives (authority map)

| Authority | Path | Rule |
|-----------|------|------|
| Immutable package | `reference/` | Never rewrite; copy out if editing |
| Docs + research | `reference/source-docs/` | Design, model, checklist, research, SEO/a11y |
| Factual JSON | `reference/source-data/` | `homepage.json`, `cathedrals.json`, `sources.json` |
| Typed content | `content/*.ts` | Normalized from source-data only |
| Working design | `docs/DESIGN_SYSTEM.md`, `src/styles/tokens.css` | Design #1 tokens for this repo |
| Open conflicts | `docs/OPEN_QUESTIONS.md` | Flag; do not invent answers |
| ADRs | `docs/DECISIONS.md` | Stack / design decisions |
| Publishable media | `public/media/` (kebab-case) | Rights-cleared only; originals stay in `reference/` |

Inventory of package copies: `reference/INVENTORY.md`.

## Content layer vs components

- **`content/`** holds typed modules (`homepage.ts`, `cathedrals.ts`, `sources.ts`) derived from `reference/source-data/`.  
- **Components / pages** import and present that content. They must not hard-code new historical claims.  
- Content model shapes (Person, Interview, Church, etc.) live in `reference/source-docs/CONTENT_MODEL.md`. Person/Interview **data files are not in the package yet** — keep placeholders; do not invent records.

## Design system pointer

- Palette and tokens: package `DESIGN_SYSTEM` / working `docs/DESIGN_SYSTEM.md` / `src/styles/tokens.css`  
  - Parchment `#F3E7CF`, Paper `#FBF5E9`, Burgundy `#6D2227`, Deep Burgundy `#4F171B`, Ink `#292522`, etc.  
- Typography: **Cormorant Garamond** (display) + **Source Sans 3** (body) via **`next/font`**  
- Implementation: **CSS Modules only** — no Tailwind, shadcn, MUI, Chakra, or other SaaS UI kits  
- WCAG 2.2 AA contrast and visible `:focus-visible` (see tokens)  
- Chat-brief hexes (`#7a2229`, `#fbf7ef`) are **not** the build palette unless the user confirms; see `docs/OPEN_QUESTIONS.md`

## Current tree state (honest)

The Next.js app **is scaffolded** and runs locally on port **4000**.

```
src/app/          # App Router pages, admin, API routes
src/content/      # typed public loaders (use these)
src/components/   # home, layout, admin, ui
src/lib/          # cms, auth, site, fonts
data/cms/         # live editable JSON
public/media/     # rights-cleared publishable media
docs/             # design, rights, open questions, finish briefing
reference/        # immutable package — do not rewrite
```

Root `content/` drafts are stale. Do not wire new code there. Prefer `docs/CURSOR_ONBOARDING_FINISH.md` over any older sentence in this file that still describes a pre-scaffold tree.

## How to add content safely

1. Prefer extending from `reference/source-data/` (or rights-cleared additions documented in sources/rights docs).  
2. Mirror facts into `content/*.ts` with types; keep citations and photo rights fields.  
3. For new historical claims: require source title, URL/citation, access date, confidence — or leave unpublished.  
4. Interviews / people: wait for real records; show “coming soon” only.  
5. Media: keep originals in `reference/`; publish derivatives under `public/media/` kebab-case after rights clearance.  
6. Never replace Faisalabad / Hyderabad / Raiwind placeholders with scraped photos (`permission_needed`).  
7. If something conflicts or is missing, add/update `docs/OPEN_QUESTIONS.md` instead of guessing.

## Open questions workflow

1. Read `docs/OPEN_QUESTIONS.md` before changing palette, curator name, interviews/people, or photo credits.  
2. Do not resolve open items in code by invention.  
3. When the lead confirms, update OPEN_QUESTIONS status and the affected working docs / tokens / content in the same change set.  
4. Current notable items: palette chat vs package (working: package); curator public display name; interviews/people forthcoming; Sialkot credits already complete in package.

## Do NOT invent history

Agents and humans: **no invented** dates, biographies, interviewee names, cathedral photo identities, licenses, or “sample” archive items presented as real. When in doubt, omit or placeholder and flag in OPEN_QUESTIONS.

See also: `AGENTS.md` (repo root), `docs/DECISIONS.md`.
