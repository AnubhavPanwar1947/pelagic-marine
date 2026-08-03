# Deploy Pelagic Marine to DreamHost shared hosting

Same pattern as **belugaeducorp.com**: build static files locally, upload `out/` with FileZilla/SFTP. Domain and DNS are already on DreamHost — only replace the website files carefully.

## Before you touch the live site

1. **Backup the current live folder** (download a full copy of `pelagic-marine.com` via FileZilla).
2. Confirm mailbox **`info@pelagic-marine.com`** exists (DreamHost → Mail → Manage Email).
3. Confirm SSL is active for `pelagic-marine.com` and `www`.
4. **Do not change MX records** — email stays as-is.

## Build on your laptop

```powershell
cd D:\Projects\pelagic-marine
npm.cmd install
npm.cmd run build
```

This creates the **`out/`** folder (static HTML/CSS/JS + `send-mail.php` + `.htaccess`).

## Upload

1. Connect with FileZilla / WinSCP using DreamHost SFTP/FTP credentials.
2. Open the Pelagic web directory (usually `pelagic-marine.com` — **not** a nested `public_html` unless the panel says so).
3. Upload **everything inside `out/`** into that folder (overwrite carefully after backup).
4. Confirm these exist in the web root:
   - `index.html`
   - `send-mail.php`
   - `.htaccess`
   - `_next/`

## Test after upload

1. Open https://pelagic-marine.com/ and check Home, About, Services, Contact.
2. Submit a real test enquiry on Contact — you should get admin mail + visitor confirmation.
3. If the form fails: confirm `send-mail.php` is in the web root and `info@pelagic-marine.com` exists.
4. Check mobile layout once on your phone.

## DNS note

DNS is already on DreamHost for this domain. You only need to update **website files**. Leave nameservers and MX alone unless DreamHost support tells you otherwise.

## Local design preview

```powershell
npm.cmd run dev
```

Contact email send works **after** DreamHost upload — PHP is not available in `next dev`.
