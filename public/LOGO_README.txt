HOW TO ADD OR REPLACE YOUR LOGO
================================

Your logo file goes here:
  C:\Users\Admin\Projects\pelagic-marine\public\

OPTION A — SVG (best quality, sharp at any size)
  1. Export your refined logo as logo.svg
  2. Replace the existing file: public/logo.svg
  3. Refresh the browser (Ctrl+Shift+R)

OPTION B — PNG (easier from Canva / Photoshop)
  1. Export as PNG, square, at least 512×512 pixels
  2. Save as: public/logo.png
  3. Tell your developer to switch BrandLogo.tsx from logo.svg to logo.png
     OR rename your PNG to logo.svg is NOT recommended — use PNG path update

TIPS FOR A SHARP "ARMOUR" LOOK
  - Use a square canvas with transparent background
  - Keep important detail in the centre (logo sits in a circle in the navbar)
  - Gold / navy colours match the site theme
  - Avoid tiny text inside the logo — "PELAGIC" is already shown beside it

AFTER REPLACING
  1. Run: npm run dev
  2. Open http://localhost:3000
  3. Check navbar + splash screen

No code change needed if you keep the filename logo.svg
