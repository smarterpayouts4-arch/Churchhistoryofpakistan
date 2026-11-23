# Admin guide — for family and curators

This is how to look after the website without touching any code. If something here doesn't match what you see, ask Oscar.

## Signing in

1. Go to the website and click **Curator login** at the very bottom of any page. You can also add `/admin/login` to the site address.
2. Type your **email** and **password**, then press **Sign in**. The eye button shows the password while you type it.
3. You'll land on the **Dashboard**.

If you type the password wrong too many times, the login rests for 15 minutes. Wait, then try again.

To sign out, press **Log out** at the top right. You're also signed out automatically after a while.

**Your password:** an administrator creates your account and gives you a first password. Change it straight away under **My account**. Use at least 10 characters; a short sentence works well, for example `grandfather planted the mango tree`. Never send passwords in WhatsApp, Facebook or email.

## Finding your way around

The menu on the left is grouped:

| Menu item | What you can change |
|---|---|
| **Dashboard** | Shortcuts and the most recent changes |
| **Photos & videos** | The media library: every picture and video the site can use |
| **Text & photos** | Homepage title, introduction, founder portrait, rotating photos, timeline text |
| **Sections & order** | Move homepage sections up or down, or hide one |
| **Family Archive** | The archive records: photo, title, caption, date, source |
| **Churches** | The cathedral cards and their photos |
| **Interviews** | Interview videos, posters and captions |
| **People photos** | The pictures on the People page |
| **Blog** | Blog posts (drafts stay hidden until published) |
| **Curator profile** | The About page text for Javed Qadir Bakhsh |
| **Site text & menus** | Menu labels, footer text, page introductions |
| **Contributions** | What visitors sent through the Contribute form |
| **Accounts** | Administrators only: add, change or remove people |
| **My account** | Your name and password |

Every page in the admin shows **Last saved** and has a **History** button (see "Undoing a change" below).

## Adding photos (the important part)

### Upload them to the library

1. Open **Photos & videos**.
2. Drag photos from your computer onto the dotted box, or click the box and choose them. On a phone, tapping the box lets you pick from the camera roll.
3. A progress bar shows each file. Several files can upload at once.
4. When the upload finishes, the photo shows up first in the grid.

The site keeps the original quality and makes smaller copies for visitors automatically, so you don't need to resize anything.

- **Photos:** JPEG, PNG, WebP, GIF or AVIF, up to 30 MB each.
- **Videos:** MP4, WebM or MOV, up to 1 GB each.
- **iPhone photos (HEIC):** these won't upload. On the iPhone, go to Settings → Camera → Formats and choose **Most Compatible**, or share the photo by email, which converts it to JPEG.

### Describe each photo

Click a photo in the library to open its details:

- **Description (alt text):** say what the photo shows, for someone who can't see it. For example: "Bishop Young and Bishop J. S. Qadir Bakhsh standing outside the cathedral." Only write what you actually know. Don't guess names or dates.
- **Crop a copy:** drag to frame the photo, then save. The original stays untouched.
- **Delete:** this only works for photos that aren't used anywhere. The details show where each photo is used.

### Put a photo on the page

Every photo field in the admin (portrait, rotating photos, archive records, churches, people, blog covers) has the same buttons:

- **Choose photo** / **Replace photo** opens the library. Pick a photo and press **Use this photo**. You can also upload a new one straight from that window.
- **Remove** empties the field.
- **Focus point:** on some fields, click the most important spot in the preview, usually a face. That keeps it in view when the photo is cropped on phones.

Then press the **Save** button for that section.

## Editing text

Type into the boxes, then press **Save**. A small message at the bottom right confirms it saved. Changes show on the live site straight away.

Please keep to facts that have a source. If you're not sure about a name, date or title, leave it out and tell the curator.

## Homepage sections

Open **Sections & order**. Drag a section, or use the ↑ ↓ arrows, to move it. Use the switch to hide a section without deleting anything. Press **Save**.

## Undoing a change

Every save is kept. On any admin page, press **History**:

- **View** shows what that version contained.
- **Restore** brings that version back. The version you're replacing stays in History too, so a restore can always be undone.

The last 40 saves are kept for each section.

## "Someone else just saved this"

If two people edit the same section at the same time, the second person to save sees this message instead of silently overwriting the first person's work:

- **Load their version** reloads the page with their changes. Your unsaved typing is lost, so copy it somewhere first if you need it.
- **Keep mine** saves your version anyway. Theirs is still in History.
- **Cancel** does nothing, so you can look first.

## Contributions from visitors

The Contribute page lets visitors send a story along with up to 4 photos or PDFs. Photos are made smaller automatically in their browser. Open **Contributions** to read them:

- Open a contribution to read it and look at its files.
- **Add to library** copies an attached photo into **Photos & videos**. Only do this after the rights and sources are confirmed.
- Mark it **Reviewed** or **Archived** when you're done. Administrators can also delete one.

Contact details from visitors are private. They never appear on the public site.

## Accounts (administrators)

- **Accounts → Add a family member:** enter their name and email, choose a role, and set a first password. The **Suggest** button creates a strong one. Give it to them in person or by phone.
  - **Administrator:** everything, including accounts and deleting contributions.
  - **Editor:** all content and photos, but not accounts.
- You can change someone's role, reset their password, or **Switch off** an account. Switching an account off signs that person out everywhere.
- The last administrator can't be removed, so you can't lock everyone out.

## If something goes wrong

- **A yellow or red banner at the top of the admin** means the site's storage isn't connected. Saving is switched off so nothing gets lost. Tell Oscar; [DEPLOYMENT.md](DEPLOYMENT.md) explains the fix.
- **"Your sign-in has expired"** means you need to sign in again. Your changes are still on screen, so copy anything important before you reload.
- **An upload failed:** check the file type and size limits above, then try once more.
- **Everyone is locked out:** Oscar can turn on recovery login. See [DEPLOYMENT.md](DEPLOYMENT.md#locked-out).

## For whoever runs the site on their own computer

- Start it with `npm run dev`, then open http://localhost:5000/admin/login.
- Local edits are saved into `data/cms/*.json`, and uploads go into `public/media/uploads/`. Commit those folders to publish the changes.
- Accounts, history and contributions live in `data/local-store/`. That folder is never committed.
- For a one-click local sign-in without a password, set `ADMIN_OPEN_PREVIEW=true` in `.env.local`. This only works on a local development machine; it is always refused in production and on Vercel. Never set it on a public host.
