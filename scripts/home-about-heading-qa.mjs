import { chromium } from "playwright";

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const browser = await chromium.launch({ headless: true });
const issues = [];

for (const w of widths) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await dismiss(page);

  const r = await page.evaluate(() => {
    const section = document.querySelector(".home-theme-why");
    const text = section?.innerText ?? "";
    const h2 = section?.querySelector("h2");
    const grid = section?.querySelector(".grid");
    const hr = h2?.getBoundingClientRect();
    const gr = grid?.getBoundingClientRect();
    const overflowH2 =
      hr && gr && (hr.right > gr.right + 4 || hr.left < gr.left - 4);
    const btn = section?.querySelector('a[href="/about/"], a[href="/about"]');
    return {
      hasOurPractice: text.includes("Our practice"),
      noWhoWeAre: !text.includes("Who we are"),
      hasAboutEyebrow: /about us/i.test(text),
      hasAboutBtn: btn?.textContent?.trim() === "About us",
      overflowH2,
      cw: document.documentElement.clientWidth,
      sw: document.documentElement.scrollWidth,
      docOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    };
  });

  if (!r.hasOurPractice) issues.push(`${w}: missing Our practice`);
  if (!r.noWhoWeAre) issues.push(`${w}: Who we are still on homepage`);
  if (!r.hasAboutEyebrow) issues.push(`${w}: About us eyebrow missing`);
  if (!r.hasAboutBtn) issues.push(`${w}: About us button missing`);
  if (r.overflowH2) issues.push(`${w}: heading outside column`);
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
