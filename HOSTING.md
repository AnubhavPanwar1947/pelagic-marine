# Pelagic Marine — DreamHost hosting notes

Configured like Beluga Educorp:

1. Static HTML/CSS/JS (`npm run build` → `out/`)
2. Contact enquiries open the visitor’s email app with a prepared message to `info@pelagic-marine.com` (no server-side mail handler)

No Vercel / Supabase / Resend / Formspree required for go-live.

## Contact form

Submitting the form opens the user’s default mail client with subject and body filled in. The visitor must tap **Send** in that app for the message to reach Pelagic.

## Soft redirects (`.htaccess`)

Legacy URLs (optional — add if old links or bookmarks still exist):

- `/sectors` → `/about/`
- `/careers` → `/contact/`
- `/login` → `/contact/`
- `/decarbonization` → `/services/mooring-compatibility/`
- `/capabilities` → `/services/`
- `/capabilities/clean-fuel` → `/services/mooring-compatibility/`
- `/capabilities/software` → `/services/engineering/`
