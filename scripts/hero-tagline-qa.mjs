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
let baseline50 = null;

for (const w of widths) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await dismiss(page);

  const r = await page.evaluate(() => {
    const tag = document.querySelector(".home-hero-brand-tagline");
    const copy = document.querySelector(".home-hero-copy");
    const tr = tag?.getBoundingClientRect();
    const cr = copy?.getBoundingClientRect();
    const text = tag?.textContent?.replace(/\s+/g, " ").trim();
    const overflowTag =
      tr && cr && (tr.right > cr.right + 2 || tr.left < cr.left - 2);
    const color = tag ? getComputedStyle(tag).color : "";
    const okWhite =
      color === "rgb(255, 255, 255)" || color === "#ffffff";
    return {
      text,
      color,
      okWhite,
      okText: text?.includes("DUBAI, SINGAPORE") && !text?.includes("INDIA & DUBAI"),
      cw: document.documentElement.clientWidth,
      sw: document.documentElement.scrollWidth,
      docOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
      overflowTag,
      tagW: tr?.width,
      copyW: cr?.width,
    };
  });

  if (!r.okText) issues.push(`${w}: wrong tagline`);
  if (!r.okWhite) issues.push(`${w}: tagline not white`);
  if (r.docOverflow && w > 50) issues.push(`${w}: doc overflow`);
  if (r.overflowTag) issues.push(`${w}: tagline outside hero column`);

  if (w === 50) baseline50 = { cw: r.cw, sw: r.sw, docOverflow: r.docOverflow };

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
