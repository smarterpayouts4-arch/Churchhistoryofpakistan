# Admin guide — for family and curators

This is how to look after the website without touching any code. If something here doesn't match what you see, ask Oscar.

## The short version

1. Sign in. **Photos & videos** opens.
2. Pick a section.
3. Add, change, move or delete photos and videos. Each change saves itself.
4. Press **Publish to website**. Your changes are live straight away.

Until you press Publish, visitors keep seeing the old version, so you can take your time.

## Signing in

1. Go to the website and click **Curator login** at the very bottom of any page. You can also add `/admin/login` to the site address.
2. Type your **email** and **password**, then press **Sign in**. The eye button shows the password while you type it.
3. You'll land on **Photos & videos**.

If you type the password wrong too many times, the login rests for 15 minutes. Wait, then try again.

To sign out, press **Log out** at the top right. You're also signed out automatically after a while.

**Your password:** an administrator creates your account and gives you a first password. Change it straight away under **My account**. Use at least 10 characters; a short sentence works well, for example `grandfather planted the mango tree`. Never send passwords in WhatsApp, Facebook or email.

## Photos & videos (the main page)

The four buttons along the top are the parts of the website that show photos or videos. Each one says how many it holds, for example **4 of 20 photos**.

| Section | Where it shows on the website | Limit |
|---|---|---|
| **Homepage slideshow** | The large rotating photo at the top of the homepage | 20 photos |
| **Family Archive gallery** | The Archive page (the first four also show on the homepage) | 30 photos |
| **People photos** | The People page | 20 photos |
| **Interview videos** | The Interviews page and the homepage | 5 videos |

### Add a photo or video

1. Pick a section.
2. Press **+ Add photos** (or **+ Add videos**). On a phone or iPad you can pick from your photos or take a new one. On a computer you can also drag files onto the dotted box.
3. A bar shows the upload. New ones go to the **front** and are marked **New**.

- Photos up to 20 MB, videos up to 100 MB.
- **iPhone and iPad photos (HEIC)** are changed to JPEG automatically. Nothing to set up.
- If something goes wrong, a message appears in the section saying what to do, with **Try again**.

### Change, move or delete

- **Title** shows under the photo on the website. **Description** says what or who is shown. Only write what you know.
- **Earlier / Later** moves a photo. The order here is the order on the website.
- **Replace** swaps the picture but keeps its place and words.
- **Delete** asks first. The photo only leaves the website when you press Publish.
- Spelling mistakes are underlined in red. Tap the word to pick the right spelling.

### Publish

Your changes save by themselves, but visitors don't see them until you press **Publish to website**.

- **Everything is published** (green): the website matches what you see.
- **You have unpublished changes** (gold): saved, but not on the website yet.
- **Not saved — check your internet**: the connection dropped. Keep the page open; it saves by itself when the connection is back.

Changed your mind before publishing? Press **Throw away my changes**, or **Undo changes to this section** under the photos.

### When a section is full

The add button is replaced by a message such as **"People photos is full (20 of 20 photos). Delete a photo to add another."**

## Advanced settings (for Oscar)

At the very bottom of the admin is a button **Advanced settings (for Oscar)**. The owner doesn't need it. It opens the text pages, churches, blog, history and accounts. These pages save straight to the website when you press **Save** (no Publish step), and each one has a **History** button to bring back an earlier version. Setup notes (test mode, missing settings) are listed there too, not at the top of the page.

| Item | What you can change |
|---|---|
| **Homepage text** | Homepage title, introduction, founder portrait, timeline text |
| **Homepage section order** | Move homepage sections up or down, or hide one |
| **Archive captions & sources** | The long caption, date and source of each archive photo |
| **Churches** | The cathedral cards and their photos |
| **Interview details** | A video's speaker, transcript, captions file and description |
| **People photo details** | Framing options for People photos |
| **Blog** | Blog posts (drafts stay hidden until published) |
| **Curator profile** | The About page text for Javed Qadir Bakhsh |
| **Site text & menus** | Menu labels, footer text, page introductions |
| **All uploaded files** | Every uploaded file: describe, crop a copy, or delete unused files |
| **Accounts** | Administrators only: add, change or remove people |

## Editing text

Type into the boxes, then press **Save**. A small message at the bottom right confirms it saved. Changes show on the live site straight away.

Please keep to facts that have a source. If you're not sure about a name, date or title, leave it out and tell the curator.

## Homepage sections

Open **Advanced settings (for Oscar) → Homepage section order**. Drag a section, or use the ↑ ↓ arrows, to move it. Use the switch to hide a section without deleting anything. Press **Save**.

## Undoing a change

Every save and every publish is kept. Under **Advanced settings (for Oscar)**, open the matching page and press **History** (for example **People photo details** for People photos):

- **View** shows what that version contained.
- **Restore** brings that version back. The version you're replacing stays in History too, so a restore can always be undone.

The last 40 saves are kept for each section.

## "Someone else just saved this"

If two people edit the same section at the same time, the second person to save sees this message instead of silently overwriting the first person's work:

- **Load their version** reloads the page with their changes. Your unsaved typing is lost, so copy it somewhere first if you need it.
- **Keep mine** saves your version anyway. Theirs is still in History.
- **Cancel** does nothing, so you can look first.

## Stories from visitors

The Share Your Story page (`/share-your-story`; the old `/contribute` address forwards there) lets visitors send a story along with up to 4 photos or PDFs. Photos are made smaller automatically in their browser. Open **Stories** to read them:

- Open a story to read it and look at its files.
- **Add to library** copies an attached photo into **All uploaded files**. Only do this after the rights and sources are confirmed.
- Mark it **Reviewed** or **Archived** when you're done. Administrators can also delete one.

Contact details from visitors are private. They never appear on the public site.

## Accounts (administrators)

- **Accounts → Add a family member:** enter their name and email, choose a role, and set a first password. The **Suggest** button creates a strong one. Give it to them in person or by phone.
  - **Administrator:** everything, including accounts and deleting submitted stories.
  - **Editor:** all content and photos, but not accounts.
- You can change someone's role, reset their password, or **Switch off** an account. Switching an account off signs that person out everywhere.
- The last administrator can't be removed, so you can't lock everyone out.

## If something goes wrong

- **A yellow or red banner at the top of the admin** means the site's storage isn't connected. Saving is switched off so nothing gets lost. Tell Oscar; [DEPLOYMENT.md](DEPLOYMENT.md) explains the fix.
- **"Your sign-in has expired"** means you need to sign in again. Your changes are still on screen, so copy anything important before you reload.
- **An upload failed:** the message in the section says why (for example, the file is too big). Press **Try again**, or pick a smaller file.
- **"Not saved — check your internet"**: keep the page open. It saves by itself when the connection is back. The page warns you if you try to close it before then.
- **Everyone is locked out:** Oscar can turn on recovery login. See [DEPLOYMENT.md](DEPLOYMENT.md#locked-out).

## For whoever runs the site on their own computer

- Start it with `npm run dev`, then open http://localhost:5000/admin/login.
- Local edits are saved into `data/cms/*.json`, and uploads go into `public/media/uploads/`. Commit those folders to publish the changes.
- Accounts, history, contributions and unpublished photo & video drafts (`section-drafts.json`) live in `data/local-store/`. That folder is never committed. On the live site they live in Vercel KV.
- The limits are constants: `MAX_IMAGES_PER_SECTION` and `MAX_VIDEOS` in `src/lib/sections/config.ts`, and the upload size caps `MAX_IMAGE_BYTES` / `MAX_VIDEO_BYTES` in `src/lib/media/rules.ts`.
- For a one-click local sign-in without a password, set `ADMIN_OPEN_PREVIEW=true` in `.env.local`. This only works on a local development machine; it is always refused in production and on Vercel. Never set it on a public host.
