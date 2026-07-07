# Pelagic Marine — Full Project Roadmap

## Overview

| Phase | Timeline | Deliverable |
|-------|----------|-------------|
| **1** | Weeks 2–4 (now) | Professional marketing website |
| **2** | Weeks 4–5 | Polish + boss approval + deploy live |
| **3** | Weeks 6–8 | Contact form backend (Supabase) |
| **4** | Weeks 9–12 | Client login / logout (Supabase Auth) |
| **5** | Months 4–6 | Maritime Advisory Platform (portal wireframes) |

---

## Phase 1 — Marketing website ✅ IN PROGRESS

**Goal:** Replace broken pelagic-marine.com with a professional B2B site.

### Pages
- [x] Home — hero, services, case studies, process, offices, CTA
- [x] About — company story, leadership, approach
- [x] Services — full service catalogue
- [x] Contact — offices, enquiry form (UI)
- [x] Login — placeholder for future portal

### Design
- [x] Pelagic navy brand colours
- [x] Premium typography (Playfair Display + DM Sans)
- [x] Maritime hero imagery
- [x] Service icons, trust badges, case studies
- [ ] Replace `public/logo.svg` with official PNG logo
- [ ] Add real team photos (optional)
- [ ] Boss content review & copy edits

### Your tasks this week
1. Run `npm run dev` and review all pages
2. Save official logo as `public/logo.png` and tell developer to switch
3. Show boss for feedback
4. Install Git: https://git-scm.com/download/win

---

## Phase 2 — Host the website live 🚀

**When:** After boss approves design (target: **Week 4–5**)

### Hosting stack (recommended — free to start)

| Service | Purpose | Cost |
|---------|---------|------|
| **Vercel** | Host Next.js website | Free tier |
| **Domain** | pelagic-marine.com | ~₹800–1500/year (if you own it) |
| **GitHub** | Store code | Free |

### Deployment steps
1. Create GitHub account → push code to repository
2. Sign up at [vercel.com](https://vercel.com)
3. Import GitHub repo → deploy (automatic)
4. Point `pelagic-marine.com` DNS to Vercel (A/CNAME records)
5. SSL certificate — automatic on Vercel

### Before going live checklist
- [ ] Official logo added
- [ ] Boss approved all text
- [ ] Phone numbers & emails verified
- [ ] Mobile tested on phone
- [ ] Contact form shows clear message (or connected to email)

**Live URL options:**
- `pelagic-marine.com` — main marketing site
- `app.pelagic-marine.com` — portal later (subdomain)

---

## Phase 3 — Contact form backend

**When:** Weeks 6–8 (after site is live)

### Stack
- **Supabase** — store enquiries in database
- Optional: email notification to info@pelagic-marine.com

### Tasks
- [ ] Create Supabase project
- [ ] Create `enquiries` table
- [ ] Connect contact form to API
- [ ] Admin view enquiries in Supabase dashboard

---

## Phase 4 — Client login / logout

**When:** Weeks 9–12

### Tasks
- [ ] Supabase Auth setup
- [ ] Login page (Screen 01 from wireframes)
- [ ] Logout functionality
- [ ] Protected `/dashboard` route
- [ ] Manual account creation for pilot clients (no public signup)
- [ ] Roles: operator / claims / admin

---

## Phase 5 — Maritime Advisory Platform

**When:** Months 4–6 (per boss roadmap)

### Module A — Claims & Laytime
- Dashboard (Screen 02)
- Deadlines & alerts (Screen 03)
- Claims list (Screen 04)
- Claim detail (Screen 05)
- New claim (Screen 06)
- Laytime calculator (Screen 07)

### Module B — CP Review
- Upload charter party (Screen 08)
- Review & exposure (Screen 09)
- Contract analysis report

### AI / RAG (needs architecture decision)
- Document parsing (PDF/DOCX)
- Citation-based analysis
- Legal guardrails & disclaimers
- Python FastAPI service (likely)

---

## Tools to install

| Tool | Status | When needed |
|------|--------|-------------|
| Node.js | ✅ Installed | Now |
| Git | ❌ Install soon | Before deploy |
| GitHub account | ❌ Create | Before deploy |
| Supabase account | ❌ Later | Phase 3 |
| Vercel account | ❌ Later | Phase 2 deploy |

---

## Learning path (while building)

| Week | Learn | Build |
|------|-------|-------|
| 2–3 | Next.js pages, Tailwind, components | Website pages |
| 4 | Git basics, deploy to Vercel | Go live |
| 5–6 | Supabase, SQL basics | Contact form |
| 7–9 | Auth, protected routes | Login/logout |
| 10+ | Business logic, deadlines | Portal Module A |

---

## Success milestones

| Milestone | Target date | Done? |
|-----------|-------------|-------|
| Website v1 demo to boss | Week 3 | ⬜ |
| Boss approves design | Week 4 | ⬜ |
| Website live on pelagic-marine.com | Week 5 | ⬜ |
| Contact form saves enquiries | Week 8 | ⬜ |
| Client login works | Week 12 | ⬜ |
| Portal Module A demo | Month 4 | ⬜ |
| Full integrated prototype | Month 6 | ⬜ |

---

## What to tell your boss today

> "Marketing website v1 is ready for review — professional design with Home, About, Services, Contact, and Login placeholder. Next: your feedback, official logo, then we deploy to replace the current site. Portal login and advisory platform follow in Phases 3–5."
