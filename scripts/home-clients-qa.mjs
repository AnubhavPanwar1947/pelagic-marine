import { chromium } from "playwright";

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

const REMOVED =
  "Owners, managers and operators who rely on Pelagic for surveys";
const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const browser = await chromium.launch({ headless: true });
const issues = [];

for (const w of widths) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await dismiss(page);

  const r = await page.evaluate((snippet) => {
    const section = document.querySelector(".home-section-clients");
    const text = section?.innerText ?? "";
    const h2 = section?.querySelector("h2");
    const marquee = section?.querySelector(".home-client-marquee-strip");
    const hr = h2?.getBoundingClientRect();
    const mr = marquee?.getBoundingClientRect();
    const sr = section?.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const marqueeBelowHeading = hr && mr && mr.top >= hr.bottom - 2;
    const sectionOverflow = sr && (sr.right > vw + 2 || sr.left < -2);
    return {
      sentenceGone: !text.includes(snippet),
      hasClients: text.includes("Clients"),
      hasHeading: text.includes("Trusted across") && text.includes("the fleet"),
      hasMarquee: !!marquee,
      marqueeBelowHeading,
      cw: document.documentElement.clientWidth,
      sw: document.documentElement.scrollWidth,
      docOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
      sectionOverflow,
    };
  }, REMOVED);

  if (!r.sentenceGone) issues.push(`${w}: sentence still present`);
  if (!r.hasClients) issues.push(`${w}: Clients eyebrow missing`);
  if (!r.hasHeading) issues.push(`${w}: heading missing`);
  if (!r.hasMarquee) issues.push(`${w}: marquee missing`);
  if (!r.marqueeBelowHeading) issues.push(`${w}: marquee not under heading`);
  if (r.sectionOverflow) issues.push(`${w}: clients section overflows`);
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
