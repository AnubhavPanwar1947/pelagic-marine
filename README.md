# Pelagic Marine Solutions — Website

Professional marketing website for **Pelagic Marine Solutions**, built for **DreamHost shared hosting** (same approach as Beluga Educorp).

## Stack

- Next.js → **static export** (`out/`)
- TypeScript + Tailwind CSS
- Contact form → DreamHost **`send-mail.php`** (no Vercel / Supabase / Resend)

## What's included

- **Home** — hero, services overview, offices, CTA
- **About** — company story, leadership
- **Services** — full service catalogue
- **Contact** — offices, map, enquiry form (PHP mail on live)
- Legal pages — privacy, cookies, terms

## Local preview (design)

```powershell
cd D:\Projects\pelagic-marine
npm.cmd install
npm.cmd run dev
```

Open http://localhost:3000  
(Contact email send works after DreamHost upload — PHP is not available in `next dev`.)

## Build for DreamHost

```powershell
npm.cmd run build
```

Upload **everything inside `out/`** to the Pelagic web root. See **`DREAMHOST-DEPLOY.md`**.

## Project structure

```
src/
  app/           # Pages
  components/    # Header, Footer, Contact, UI
  lib/           # Company content and helpers
public/          # Logo, images, send-mail.php, .htaccess
```

## Scripts

- `npm run dev` — local design server
- `npm run build` / `npm run export` — production static build → `out/`
- `npm run lint` — ESLint check
