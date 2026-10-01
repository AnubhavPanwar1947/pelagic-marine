# Pelagic Marine — DreamHost hosting notes

Configured like Beluga Educorp:

1. Static HTML/CSS/JS (`npm run build` → `out/`)
2. Contact mail via DreamHost PHP (`public/send-mail.php`)

No Vercel / Supabase / Resend / Formspree required for go-live.

## Email requirement

Create DreamHost mailbox: `info@pelagic-marine.com`  
PHP sends From that address (DreamHost sender policy).

## Security in send-mail.php

- POST only
- Honeypot field (`company_website`)
- Minimum form fill time
- Per-IP rate limit
- Header injection cleanup
- Length limits
- Admin mail + visitor auto-reply with enquiry reference

## Soft redirects (`.htaccess`)

Legacy URLs (optional — add if old links or bookmarks still exist):

- `/sectors` → `/about/`
- `/careers` → `/contact/`
- `/login` → `/contact/`
- `/decarbonization` → `/services/mooring-compatibility/`
- `/capabilities` → `/services/`
- `/capabilities/clean-fuel` → `/services/mooring-compatibility/`
- `/capabilities/software` → `/services/engineering/`
