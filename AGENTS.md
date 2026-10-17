# AGENTS.md — History: Church of Pakistan

## Project one-liner

Digital heritage archive for **History: Church of Pakistan** — a living documentary collection of photographs, church buildings, interviews, family records, biographies, dates, documents, and personal memories, presented in Design #1 Archival Heritage.

Strapline (package): *Preserving History • Honouring Our Forefathers • Inspiring Future Generations*

## Stack (live)

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 16.3.5** App Router (`src/app/`) |
| Runtime | **Node ≥20** (developed on Node 24) |
| Package manager | **pnpm 9.15.9** preferred; `npm run dev` uses the same scripts |
| Language | **TypeScript** (strict) |
| Rendering | **Server Components by default** |
| Styles | CSS Modules + `src/styles/tokens.css` (no Tailwind, shadcn, MUI, Lucide, Heroicons) |
| Fonts | Fraunces + Inter via `next/font` (Emerald & Gilt design, ADR-006) |
| Local preview | `http://127.0.0.1:4000` |

The app **is scaffolded**. Live editable content is `data/cms/`. Typed public loaders are `src/content/`. Root `content/` drafts are stale — do not wire new code there. `reference/` stays immutable.

## Install / dev / build / test

```bash
npm install
npm run dev          # http://127.0.0.1:4000
npm run typecheck
npm run lint:eslint
npm run audit:site   # requires the dev or start server
npm run build
npm run start
```

`pnpm` is the lockfile-pinned package manager when it is installed. On this machine, `npm run <script>` is the working command. Do not commit `.env.local`. Never set `ADMIN_OPEN_PREVIEW=true` on a public host.

## Authority locations (canonical map)

| Location | Role |
|----------|------|
| `reference/` | **IMMUTABLE.** Never rewrite originals. Copy out if you need editable derivatives. |
| `reference/source-docs/` | Package documentation authority (design, content model, build checklist, research, SEO/a11y, homepage map, master prompt). |
| `reference/source-data/` | Factual JSON authority (`homepage.json`, `cathedrals.json`, `sources.json`). |
| `src/content/` | Typed public loaders. **No invented facts.** |
| `data/cms/` | Live editable CMS JSON. |
| Components / UI | Present content from `src/content/` and `data/cms/` (and rights-cleared media). **They do not invent history.** |
| `docs/DESIGN_SYSTEM.md` + `src/styles/tokens.css` | Working Design #1 Archival Heritage for this build. |
| `docs/OPEN_QUESTIONS.md` | Unresolved conflicts. **Flag — do not invent resolutions.** |
| `docs/AI_CONTEXT.md` | 5-minute orientation for humans and coding agents. |
| `docs/DECISIONS.md` | Architecture Decision Records (ADRs). |
| Media originals | Stay under `reference/`. |
| Publishable media | Rights-cleared copies under `public/media/` with **kebab-case** filenames. |

Also see: `reference/INVENTORY.md`, `docs/SOURCES_AND_RIGHTS.md`, `docs/ASSET_REGISTRY.md`.

## Hard rules

1. **NEVER invent** historical facts, names, dates, biographies, offices, quotations, or photo identities.
2. **Never scrape or republish** unlicensed web photos (Google, Getty, Tripadvisor, Facebook, news, diocesan sites without verified reusable license / permission).
3. **No fake forms**, dead search, invented interviewees, or fictional sample biographies.
4. Interview / people slots stay **“coming soon”** placeholders until real records exist (`docs/OPEN_QUESTIONS.md`).
5. Curator public display name is confirmed: **Javed Qadir Bakhsh**. Do not rename the curator or invent additional offices or dates.
6. For open questions: update or cite `docs/OPEN_QUESTIONS.md`; do not silently pick an answer.
7. Every historical date/fact and every image must remain citation- and rights-backed.

## Routes planned

| Route | Purpose |
|-------|---------|
| `/` (home) | Archival homepage per package homepage order |
| `/about` | Project purpose / connection |
| `/archive` | Browse archival records |
| `/interviews` | Interviews (placeholders until real content) |
| `/churches` | Eight diocesan cathedrals / places |
| `/people` | People records (forthcoming — no invented bios) |
| `/contribute` | Contribution / share memories CTA |
| `/sources` | Source register / credits / policy |

Package homepage nav also lists **Timeline** as a section/nav item; treat timeline milestones as sourced content from `content/homepage.ts`, not free-form invention.

## Quality gates (Archive QA owns)

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- Playwright smoke (when added)
- **WCAG 2.2 AA** (contrast, focus-visible, keyboard, alt text, reduced motion)
- Responsive breakpoints (package checklist: 320 / 375 / 768 / 1440)
- **No invented content** checks against `reference/source-data/` + `docs/OPEN_QUESTIONS.md`
- Image rights / credit visibility for published media

## Point agents here first

1. **`docs/CURSOR_ONBOARDING_FINISH.md`** — master finish briefing (architecture, routes, phases, production go/no-go). Dated 2026-09-29; re-verified locally 2026-09-30.  
2. **`docs/AI_CONTEXT.md`** — short orientation  
3. **`docs/DECISIONS.md`** — architecture choices  
4. **`docs/OPEN_QUESTIONS.md`** — unresolved items (do not invent answers)  
5. **`docs/ADMIN.md`** — curator admin. Env **names** only in chat; never paste secrets.  
6. **`docs/DESIGN_SYSTEM.md`** + **`src/styles/tokens.css`** — Design #1 tokens  

Public production remains **NO-GO** until the briefing’s Phase 3–6 blockers and Phase 7 QA are clear. Local curator preview is a **conditional GO** when `npm run dev` is healthy. Owner lane: Archive QA. Do not modify `reference/` or invent content facts.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
