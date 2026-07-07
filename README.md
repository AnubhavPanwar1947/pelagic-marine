# Pelagic Marine Solutions — Website

Professional marketing website for **Pelagic Marine Solutions**, built with **Next.js**, **TypeScript**, and **Tailwind CSS**.

## What's included

- **Home** — hero, stats, services overview, offices, CTA
- **About** — company story, vision, leadership
- **Services** — full service catalogue
- **Contact** — offices, phone, enquiry form (UI only for now)
- **Login** — placeholder for future Maritime Advisory Platform

## Getting started

1. Install [Node.js LTS](https://nodejs.org/) if needed
2. Open this folder in Cursor
3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Replace the logo

Save your company logo image as one of these files:

- `public/logo.png` (recommended)
- or keep using `public/logo.svg`

If you use `logo.png`, update `src/components/layout/Header.tsx` and `src/app/login/page.tsx` to use `/logo.png`.

## Project structure

```
src/
  app/           # Pages (Home, About, Services, Contact, Login)
  components/    # Header, Footer, UI blocks
  lib/           # Company content and site data
public/          # Logo and static assets
```

## Next phases

1. Connect contact form to Supabase or email
2. Add real client login (Supabase Auth)
3. Build Maritime Advisory Platform screens (claims, deadlines, CP review)
4. Deploy to replace pelagic-marine.com

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production build locally
- `npm run lint` — ESLint check
