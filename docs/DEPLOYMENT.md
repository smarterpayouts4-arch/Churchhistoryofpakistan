# Deployment (Vercel)

The site runs on Vercel with two Vercel storage products. Without them the public site still works, but the admin can't save anything (it shows a banner saying so).

## 1. Connect storage

In the Vercel dashboard, open the project and go to **Storage**:

1. **KV / Upstash Redis** (Marketplace → Upstash → Redis). Connect it to the project for Production and Preview. That adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
   - This store holds the content, accounts, history, the media index, contributions and rate-limit counters.
2. **Blob, public store.** Connect it to the project. That adds `BLOB_READ_WRITE_TOKEN`. Admin photo and video uploads go here. Visitors load them from `*.public.blob.vercel-storage.com`, which the CSP and `next/image` already allow.
3. **Optional: Blob, private store**, for files attached to the Contribute form. Create a second Blob store with **private** access. Copy its read-write token into a variable named `CONTRIBUTIONS_BLOB_TOKEN`; don't connect it under the default name, because that would replace the public one. Without it, contributions on Vercel are text-only and the form says so.

Redeploy after connecting.

## 2. Environment variables

Set these in **Project → Settings → Environment Variables**. Put only names in chat or tickets, never values.

| Name | Required | Notes |
|---|---|---|
| `ADMIN_EMAIL` | yes | Email for the first administrator (the sign-in name) |
| `ADMIN_NAME` | no | Display name for that administrator |
| `ADMIN_PASSWORD_HASH` | yes | bcrypt hash from `npm run admin:hash-password`. Paste the **raw** hash (the "Vercel" line), with no backslashes |
| `ADMIN_SESSION_SECRET` | yes | At least 32 random characters, different for each environment. Example: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `NEXT_PUBLIC_SITE_URL` | recommended | e.g. `https://your-domain.example`. Used for the sitemap, robots, Open Graph and JSON-LD. Defaults to the Vercel production domain |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | yes | Added by connecting KV |
| `BLOB_READ_WRITE_TOKEN` | yes | Added by connecting the public Blob store |
| `CONTRIBUTIONS_BLOB_TOKEN` | no | Private Blob store token, for contribution attachments |
| `CONTRIBUTE_WEBHOOK_URL`, `CONTRIBUTE_API_KEY` | no | Also POST each contribution (text and file metadata) to a webhook |
| `ADMIN_RECOVERY_LOGIN` | no | `true` only temporarily; see "Locked out" |

Never set:

- `ADMIN_OPEN_PREVIEW=true`. It is refused on Vercel anyway.
- `ADMIN_PASSWORD`. Plaintext passwords are ignored, and admins see a warning if it is set.

## 3. First sign-in

1. Deploy, then open `/admin/login`.
2. Sign in with `ADMIN_EMAIL` and the password you hashed. This creates the first administrator account in KV.
3. From then on, manage people in **Admin → Accounts**. Changing the env variables no longer changes anyone's password.

Content: the first time each document is read, KV is filled from the `data/cms/*.json` files in the deploy. To push the files over what is in KV on purpose, run `npm run storage:seed -- --force` with the KV variables set in your shell.

## 4. Bringing online edits back into git

Edits made on the live site live in KV. To review and commit them:

```bash
# with KV_REST_API_URL / KV_REST_API_TOKEN in your shell (vercel env pull .env.production.local)
npm run cms:export -- --dry-run
npm run cms:export
git diff data/cms
```

Photos uploaded online stay in Blob. Their URLs are stored in the content, so you don't need to commit them.

## Locked out

If nobody can sign in:

1. Set a fresh `ADMIN_PASSWORD_HASH`, and `ADMIN_RECOVERY_LOGIN=true`.
2. Redeploy and sign in with `ADMIN_EMAIL`. That restores the account as an active admin with the new password.
3. **Remove `ADMIN_RECOVERY_LOGIN`** and redeploy.

To sign everyone out at once, change `ADMIN_SESSION_SECRET`.

## Security checklist

- [ ] The repository is public, so no real password or hash is committed. `.env.local` stays gitignored. The old development password that was published in `docs/ADMIN.md` must be treated as compromised and never used.
- [ ] `ADMIN_SESSION_SECRET` is unique and at least 32 characters.
- [ ] `ADMIN_OPEN_PREVIEW` and `ADMIN_PASSWORD` are unset.
- [ ] KV and Blob are connected, so the admin shows no storage banner.
- [ ] After the custom domain is live, HSTS (`max-age` 2 years, `includeSubDomains`) is sent. Only submit the domain to the HSTS preload list if every subdomain serves HTTPS.
- [ ] `npm audit` / `pnpm audit` shows no known vulnerabilities (Next is pinned to 16.4.6, which includes the 16.3.x security fixes).

## Local production check

```bash
npm run build
npm run start      # http://localhost:5000, using local file storage
```
