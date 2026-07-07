# Where is the code? — Guide for you

Your project lives here:

```
C:\Users\Admin\Projects\pelagic-marine
```

---

## How to see files in Cursor (the IDE)

1. Open **Cursor**
2. **File → Open Folder**
3. Choose `C:\Users\Admin\Projects\pelagic-marine`
4. Look at the **left sidebar** — that is your file explorer (like VS Code)

If you don't see the sidebar: press **Ctrl + B** to toggle it.

**Yes — all the website code is written in files in this folder.** Cursor is the IDE where you view and edit them. When I make changes, they go into these same files on your computer.

---

## If your boss asks to "show the code"

You can show any of these:

| What they might ask | What to open |
|---------------------|--------------|
| "Show me the project" | Open the folder in Cursor and walk through the sidebar |
| "Where is the home page?" | `src/app/page.tsx` |
| "Where is company info?" | `src/lib/site-data.ts` (phone, email, services text) |
| "Where are colours?" | `src/app/globals.css` |
| "Give us the files" | Zip the whole `pelagic-marine` folder, or push to GitHub (later) |

**Easiest demo:** Run the site locally (`npm run dev`), show the browser at http://localhost:3000, then open `site-data.ts` and `page.tsx` in Cursor to show where content lives.

---

## Main files (what to edit)

| What you want to change | File |
|-------------------------|------|
| Phone, email, services text | `src/lib/site-data.ts` |
| Which images are used | `src/lib/site-images.ts` |
| Home page layout | `src/app/page.tsx` |
| Colours / theme | `src/app/globals.css` |
| Top menu (header) | `src/components/layout/Header.tsx` |
| Footer | `src/components/layout/Footer.tsx` |
| Logo file | `public/logo.svg` |
| Homepage photos | `public/images/` (see below) |

---

## How to add a picture (step by step)

### 1. Download a photo

Use **Unsplash** or **Pexels** (free for commercial use). Good searches:

| File name | Search for | Mood |
|-----------|------------|------|
| `hero.jpg` | "cargo ship ocean sunrise" | Bright, fresh, energetic |
| `expertise.jpg` | "container port aerial" | Professional, global |
| `team.jpg` | "marine engineer ship" | People / expertise |
| `cta-bg.jpg` | "ship harbor sunset" | Dramatic (section above footer) |
| `case-1.jpg` etc. | "offshore vessel", "ship survey" | Real project feel |

### 2. Rename the file

Must match exactly: `hero.jpg`, `expertise.jpg`, `team.jpg`, `cta-bg.jpg`, `case-1.jpg`, `case-2.jpg`, `case-3.jpg`

(JPG or PNG both work — if PNG, update the name in `src/lib/site-images.ts`)

### 3. Copy into the images folder

```
C:\Users\Admin\Projects\pelagic-marine\public\images\
```

Paste the file there. Full list of names is in `public/images/README.txt`.

### 4. Refresh the browser

If `npm run dev` is running, save nothing — just refresh http://localhost:3000

**No code change needed** if you use the exact file names above.

---

## How to change the logo

1. Replace `public/logo.svg` with your file (keep the same name), **or**
2. Add `public/logo.png` and ask to update `src/components/brand/BrandLogo.tsx` to use `.png`

---

## How to run the website locally

Open terminal in Cursor (**Terminal → New Terminal**) or PowerShell:

```powershell
cd C:\Users\Admin\Projects\pelagic-marine
npm run dev
```

Open: **http://localhost:3000**

Stop the server: **Ctrl + C** in the terminal.

---

## How to change text (easy — no layout skills needed)

1. Open `src/lib/site-data.ts`
2. Find the text you want (e.g. phone number, hero headline)
3. Change the text inside the quotes
4. Save (**Ctrl + S**)
5. Browser refreshes automatically

---

## How to change colours

1. Open `src/app/globals.css`
2. Edit the hex values at the top (e.g. `--pelagic-gold: #c9941a`)
3. Save and refresh

---

## Folder structure

```
pelagic-marine/
├── public/
│   ├── logo.svg              ← company logo
│   └── images/               ← YOU add photos here
│       ├── hero.jpg
│       ├── expertise.jpg
│       ├── team.jpg
│       ├── cta-bg.jpg
│       ├── case-1.jpg
│       ├── case-2.jpg
│       └── case-3.jpg
├── src/
│   ├── app/                  ← pages
│   │   ├── page.tsx          ← Home
│   │   ├── about/
│   │   ├── services/
│   │   ├── contact/
│   │   ├── login/
│   │   ├── layout.tsx
│   │   └── globals.css       ← colours
│   ├── components/           ← header, footer, buttons
│   └── lib/
│       ├── site-data.ts      ← all company text
│       └── site-images.ts    ← image file paths
├── CODE_GUIDE.md             ← this file
├── ROADMAP.md
└── README.md
```

---

## Giving files to your company later

**Option A — USB / email:** Zip the whole `pelagic-marine` folder.

**Option B — GitHub (recommended later):** Push to a private repo; they clone it. Install Git first when ready.

**Option C — Live website:** Deploy to Vercel (Phase 2 in ROADMAP.md) — they get a URL, not raw files.

The **full project** is everything in `pelagic-marine` — source code, images, config. They need Node.js installed to run it locally, or Vercel to host it online.

---

## What you can do yourself vs ask for help

| You can do alone | Better to ask / pair |
|------------------|----------------------|
| Add images to `public/images/` | Big layout redesigns |
| Edit text in `site-data.ts` | Login / database / forms backend |
| Change phone/email | Deploy to production domain |
| Replace logo file | Maritime portal (wireframes) |
| Run `npm run dev` to preview | Git setup if stuck |

---

## Why some pictures were missing before

The site was loading photos from **Unsplash on the internet**. If the network blocks those URLs, images don't show. **Local files in `public/images/` fix that** — they load from your computer, no internet needed for images.

Until you add files, sections show a warm cream/gold gradient placeholder.
