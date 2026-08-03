# Pelagic Marine — Project Roadmap

## Hosting decision (boss)

| Item | Choice |
|------|--------|
| Host | **DreamHost shared** (same account as belugaeducorp.com) |
| Domain / DNS | Already on DreamHost — `pelagic-marine.com` |
| Backend APIs | **None** — no Vercel, no Supabase |
| Contact form | DreamHost **PHP `mail()`** via `send-mail.php` |
| Build output | Static `out/` folder uploaded by SFTP/FileZilla |

---

## Overview

| Phase | Timeline | Deliverable |
|-------|----------|-------------|
| **1** | Done | Professional marketing website (static) |
| **2** | Now | DreamHost upload + replace current live site carefully |
| **3** | After go-live | Boss content review & copy fixes |
| **4** | Later | Portal / client login (separate decision — not on shared static hosting) |

---

## Phase 1 — Marketing website ✅

- [x] Home, About, Services, Contact, Team, Projects, etc.
- [x] Brand styling and maritime layout
- [x] Contact form UI
- [x] Converted to **static export** for DreamHost (Beluga pattern)
- [x] PHP contact mailer (no third-party form APIs)
- [ ] Official logo polish if boss requests
- [ ] Real photo replacements if boss provides assets

---

## Phase 2 — Go live on DreamHost 🚀

Follow **`DREAMHOST-DEPLOY.md`**.

Checklist:

- [ ] Backup current live files
- [ ] Confirm `info@pelagic-marine.com` mailbox
- [ ] `npm run build` → upload `out/`
- [ ] Test pages + contact form on live
- [ ] Leave MX / email DNS untouched

---

## Phase 3 — Content polish

- [ ] Boss review of every page
- [ ] Copy edits
- [ ] Optional image upgrades

---

## Phase 4 — Portal (future)

Client login / Maritime Advisory Platform needs a **server or separate app** — not the static DreamHost marketing site. Revisit later with boss; do not mix into this `out/` upload.
