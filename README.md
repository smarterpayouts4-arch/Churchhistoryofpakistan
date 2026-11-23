# History: Church of Pakistan

A digital heritage archive of photographs, documents, interviews, church buildings and family memories, curated by **Javed Qadir Bakhsh**. Built with Next.js 16 (App Router), React 19 and TypeScript. There is no database server: content lives in JSON files, or in Vercel KV and Blob once the site is hosted.

| Guide | For |
|---|---|
| [docs/ADMIN.md](docs/ADMIN.md) | Family and curators: signing in, adding photos, editing, undoing changes |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Developers: how the code, content, storage and security fit together |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Putting the site on Vercel: storage, environment variables, first login |
| [AGENTS.md](AGENTS.md) | Rules for coding agents (no invented history, `reference/` is read-only) |

## Run it on your computer

You need Node.js 20 or newer. pnpm is the package manager (the lockfile is `pnpm-lock.yaml`); if pnpm is not installed, `npx` fetches it for you.

```bash
npx -y pnpm@9.15.9 install     # or: corepack enable && pnpm install
cp .env.example .env.local      # Windows: copy .env.example .env.local
npm run admin:hash-password     # makes the ADMIN_PASSWORD_HASH line for .env.local
npm run dev                     # http://localhost:5000
```

Open http://localhost:5000, and http://localhost:5000/admin/login for the admin. The first sign-in with the `ADMIN_EMAIL` and the password you hashed creates the first administrator account.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server on port 5000 |
| `npm run build` / `npm run start` | Production build / serve it on port 5000 |
| `npm run typecheck` | TypeScript check |
| `npm run lint:eslint` | ESLint |
| `npm run admin:hash-password` | Make a bcrypt hash for `ADMIN_PASSWORD_HASH` |
| `npm run storage:check` | Show which storage the current environment uses (names only) |
| `npm run storage:seed` | Copy `data/cms/*.json` into Vercel KV (fills empty keys; `-- --force` overwrites) |
| `npm run cms:export` | Download content edited online (KV) back into `data/cms/` so it can be committed |
| `npm run audit:site` | Link and content presence audit (needs a running server) |

## Where things are

```
src/app/            pages, admin, API routes
src/components/     public components (home/, ui/, layout/) and admin/
src/content/        typed loaders for public content
src/lib/cms/        content store (files or KV), revisions, schemas
src/lib/auth/       accounts, sessions, CSRF, rate limiting
src/lib/media/      media library and upload rules
data/cms/           live, editable content (committed)
data/local-store/   local accounts, media index, contributions, history (never committed)
public/media/       publishable, rights-cleared media; admin uploads land in public/media/uploads/
reference/          IMMUTABLE source package; never edit
```

## Content rules

Do not invent historical facts, names, dates, biographies or photo identities. Every published date, fact and image must stay citation- and rights-backed (see [docs/SOURCES_AND_RIGHTS.md](docs/SOURCES_AND_RIGHTS.md)). Interviews and people records stay "forthcoming" placeholders until real records exist. Unresolved questions belong in [docs/OPEN_QUESTIONS.md](docs/OPEN_QUESTIONS.md).
