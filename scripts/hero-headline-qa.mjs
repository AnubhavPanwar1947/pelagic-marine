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
    const h1 = document.querySelector(".home-hero-line--3.type-hero-title");
    const copy = document.querySelector(".home-hero-copy");
    const spans = h1?.querySelectorAll("span") ?? [];
    const first = spans[0];
    const second = spans[1];
    const hr = h1?.getBoundingClientRect();
    const cr = copy?.getBoundingClientRect();
    const overflowH1 =
      hr && cr && (hr.right > cr.right + 2 || hr.left < cr.left - 2);
    const blue = (el) =>
      el && getComputedStyle(el).color === "rgb(47, 168, 238)";
    const white = (el) =>
      el && getComputedStyle(el).color === "rgb(255, 255, 255)";
    return {
      firstText: first?.textContent?.trim(),
      secondText: second?.textContent?.trim(),
      okBlue: blue(first),
      okWhite: white(second),
      cw: document.documentElement.clientWidth,
      sw: document.documentElement.scrollWidth,
      docOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
      overflowH1,
    };
  });

  if (!r.okBlue) issues.push(`${w}: first phrase not blue`);
  if (!r.okWhite) issues.push(`${w}: second phrase not white`);
  if (r.overflowH1) issues.push(`${w}: h1 outside hero column`);
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
