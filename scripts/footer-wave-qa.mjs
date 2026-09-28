import { chromium } from "playwright";

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

const FOOTER_BLURB =
  "Naval architecture and marine engineering consultancy — stability, structures";
const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const browser = await chromium.launch({ headless: true });
const issues = [];

for (const w of widths) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await dismiss(page);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  const r = await page.evaluate((snippet) => {
    const footer = document.querySelector("footer");
    const text = footer?.innerText ?? "";
    const fr = footer?.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    return {
      blurbGone: !text.includes(snippet),
      hasLinks: text.includes("Links"),
      hasLegal: text.includes("Legal"),
      hasOffices: text.includes("Our offices"),
      hasContact: text.includes("Contact"),
      hasCopyright: /All rights reserved/i.test(text),
      waveGone:
        !document.querySelector(".footer-wave") &&
        !document.querySelector(".footer-wave-svg"),
      footerOverflow: fr && (fr.right > vw + 2 || fr.left < -2),
      cw: document.documentElement.clientWidth,
      sw: document.documentElement.scrollWidth,
      docOverflow: document.documentElement.scrollWidth > vw + 2,
    };
  }, FOOTER_BLURB);

  if (!r.blurbGone) issues.push(`${w}: footer blurb still present`);
  if (!r.waveGone) issues.push(`${w}: footer wave still in DOM`);
  if (!r.hasLinks || !r.hasCopyright) issues.push(`${w}: footer content missing`);
  if (r.footerOverflow) issues.push(`${w}: footer overflows viewport`);
  if (r.docOverflow && w > 50) issues.push(`${w}: doc overflow`);

  console.log(`${w}px`, r);
  await page.close();
}

for (const path of ["/", "/team/"]) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 50, height: 900 });
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
  await dismiss(page);
  const m = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  console.log(`50px ${path}`, m);
  await page.close();
}

await browser.close();
if (issues.length) {
  console.error("ISSUES:", issues);
  process.exit(1);
}
