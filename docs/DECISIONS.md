# DECISIONS — Architecture Decision Records

Initial ADRs for History: Church of Pakistan. Status values: **Proposed** | **Accepted** | **Accepted-pending-confirm** | **Superseded**.

Grounded in package `reference/source-docs/DESIGN_SYSTEM.md`, working `docs/DESIGN_SYSTEM.md`, `src/styles/tokens.css`, and `docs/OPEN_QUESTIONS.md`.

---

## ADR-001 — Next.js App Router pinned to 16.3.5 (Node 24)

| Field | Value |
|-------|--------|
| **Status** | Accepted — app is live under `src/app/` |
| **Date** | 2026-09-17 |

### Context

The repo is a prepared heritage tree without an application scaffold. Heritage Forge / Archive QA need a fixed production target so agents do not drift across major versions.

### Decision

- Use **Next.js 16.3.5** with the **App Router**.  
- Default to **React Server Components**.  
- Run on **Node 24**.  
- Use **TypeScript strict**.

### Consequences

- Scaffolding must pin these versions in `package.json` / engines when the app is created.  
- No Pages Router as the primary architecture.  
- Until scaffold exists, commands in `AGENTS.md` remain placeholders.

---

## ADR-002 — Package DESIGN_SYSTEM palette / tokens.css over chat-mentioned hexes

| Field | Value |
|-------|--------|
| **Status** | **Accepted-pending-confirm** |
| **Date** | 2026-09-17 |

### Context

`docs/OPEN_QUESTIONS.md` records a palette conflict:

| Source | Burgundy / related |
|--------|-------------------|
| Chat brief (Heritage Forge) | `#7a2229` (also cream `#fbf7ef` in tokens comment) |
| Package `DESIGN_SYSTEM` / tokens | Burgundy `#6D2227`, Parchment `#F3E7CF`, Paper `#FBF5E9`, Deep Burgundy `#4F171B`, etc. |

Working decision in OPEN_QUESTIONS: follow the **package** system unless the user confirms otherwise. Working `docs/DESIGN_SYSTEM.md` and `src/styles/tokens.css` already implement package hexes and document the chat conflict in comments.

### Decision

- **Canonical palette** for build work: package Design #1 values as in `docs/DESIGN_SYSTEM.md` and `src/styles/tokens.css`.  
- Do **not** adopt chat hexes (`#7a2229`, `#fbf7ef`) in components.  
- **Do not treat this as final user confirmation** — status remains pending confirm per OPEN_QUESTIONS.

### Consequences

- UI work uses token variables (`--color-burgundy`, `--oxblood`, etc.), not ad-hoc chat hexes.  
- If the user confirms chat hexes instead, update OPEN_QUESTIONS, this ADR, `docs/DESIGN_SYSTEM.md`, and `tokens.css` together.  
- Agents must not “resolve” the conflict by inventing a third palette.

---

## ADR-003 — Typography: Cormorant Garamond + Source Sans 3 via next/font

| Field | Value |
|-------|--------|
| **Status** | Accepted — wired in `src/lib/fonts.ts` |
| **Date** | 2026-09-17 |

### Context

Package `DESIGN_SYSTEM.md` recommends an editorial serif + clear sans, with Georgia / system-sans as safe fallbacks. Working `docs/DESIGN_SYSTEM.md` and `tokens.css` specify production fonts for the Next build: Cormorant Garamond (display) and Source Sans 3 (body), loaded via `next/font` CSS variables (`--font-cormorant`, `--font-source-sans` → `--font-display`, `--font-body`).

### Decision

- **Display / headings:** Cormorant Garamond via `next/font`  
- **Body / UI:** Source Sans 3 via `next/font`  
- Fallbacks remain in `tokens.css` (Georgia / system-ui) until fonts are wired on `<html>`.

### Consequences

- No novelty fonts for body copy.  
- Prefer self-hosted / `next/font` loading (see package SEO/a11y notes).  
- Starter-site Georgia/system choices remain reference only; production follows this ADR.

---

## ADR-004 — Package manager: pnpm

| Field | Value |
|-------|--------|
| **Status** | Accepted — `pnpm` preferred; `npm run` uses the same scripts |
| **Date** | 2026-09-17 |

### Context

Archive QA and Heritage Forge standardize on a single install tool for reproducible installs and CI.

### Decision

Use **pnpm** exclusively (`pnpm install`, `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`).

### Consequences

- Do not introduce npm/yarn lockfiles as primary.  
- Document scripts in `AGENTS.md` once `package.json` exists.

---

## ADR-005 — No UI kit — CSS Modules + design tokens only

| Field | Value |
|-------|--------|
| **Status** | Accepted |
| **Date** | 2026-09-17 |

### Context

Design #1 Archival Heritage is a custom parchment/burgundy archival language. Package and working design docs forbid modern SaaS visuals (heavy gradients, glassmorphism, generic kit chrome). Working `docs/DESIGN_SYSTEM.md` states: CSS Modules only — no SaaS UI kits, no Tailwind/shadcn/MUI.

### Decision

- **CSS Modules** + **`src/styles/tokens.css`** only.  
- **No** shadcn/ui, MUI, Chakra, Ant Design, or similar component kits.  
- **No** Tailwind as the styling system for this project.

### Consequences

- Components consume design tokens and local module classes.  
- Import `tokens.css` once from the root layout when the app exists.  
- Visual QA is against Design #1 reference + tokens, not kit defaults.

---

## ADR-006 — Redesign: Emerald & Gilt palette, Fraunces + Inter

| Field | Value |
|-------|--------|
| **Status** | Accepted (owner, 2026-10-17) |
| **Date** | 2026-10-17 |
| **Supersedes** | ADR-002 palette (Design #1 parchment/burgundy) |

### Context

The owner asked for a modern redesign, with the layout informed by Mobbin references. From four researched palettes he chose **Emerald & Gilt**. Content, routes and functionality stay the same.

### Decision

- Palette: emerald `#0B5C47` (primary), emerald-950 `#062E25` (dark bands), gilt `#D8B65E` / gilt-ink `#86601A`, ivory `#F4F3EC`, ink `#14201B`, with oxblood `#7A2B2E` kept as a heritage accent. The full table and contrast ratios are in `docs/DESIGN_SYSTEM.md`.
- The emerald draws on liturgical green (Ordinary Time). It is not claimed to be any official Church of Pakistan colour.
- Type: Fraunces (display) + Inter (body) via `next/font`.
- ADR-005 still applies: CSS Modules + tokens only.

### Consequences

- The legacy `--color-*` variables are now aliases to the new tokens.
- The parchment textures and rule ornaments are retired from the UI. The assets stay in `public/` and `reference/` stays untouched.

---

## ADR-007 — Site-wide settings CMS (`data/cms/site.json`) + production persistence limit

| Field | Value |
|-------|--------|
| **Status** | Accepted (owner mandate, 2026-10-18) |
| **Date** | 2026-10-18 |

### Context

The curator admin already covered Homepage, Churches, Family Archives,
Featured Interviews, People frames, Curator profile and media uploads, but
global marketing/UI wording (navigation labels, footer text, SEO, hero
buttons, section headings, inner-page headers/notices, 404) was still
hard-coded in components.

### Decision

- Add `data/cms/site.json` in the established file-CMS pattern (typed
  loader `src/content/site.ts`, zod schema `siteSettingsSchema`,
  `GET|PUT /api/admin/site` behind `requireAdminApi`, atomic writes via
  `src/lib/cms/store.ts`, new **Site & Pages** admin tab).
- All covered public strings now read from CMS; no hard-coded duplicates
  remain for those areas. Confirmed-identity strings (curator name/role,
  motto) and citation registers stay code-/citation-locked on purpose.
- **Persistence:** file CMS persists on writable hosts. On Vercel the
  runtime filesystem is ephemeral, so production content changes must be
  committed to git (JSON + media) and redeployed. No external/paid store
  is introduced without a further ADR. See `docs/ADMIN.md`.

### Consequences

- Admin can reword the entire public site's marketing/UI copy without code.
- Production editors must follow the commit-and-deploy workflow above
  until/unless a persistent store is adopted.

---

## Related open questions (do not invent resolutions)

- **Palette** — resolved by ADR-006 (Emerald & Gilt, owner-approved 2026-10-17).  
- **Curator public display name** — required before launch captions; use Project Curator until confirmed.  
- **Interviews / people** — forthcoming; no fictional records.  
- **Three cathedrals** (Faisalabad, Hyderabad, Raiwind) — `permission_needed` placeholders until rights-cleared photos exist.
