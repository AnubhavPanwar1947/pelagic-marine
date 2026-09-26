import { chromium } from "playwright";

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

const SUBLINE =
  "Naval architecture, stability, structures and clean-fuel advisory for owners, operators and charterers worldwide.";

const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const browser = await chromium.launch({ headless: true });
const issues = [];

for (const w of widths) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await dismiss(page);

  const r = await page.evaluate((subline) => {
    const bodyText = document.body.innerText;
    const h1 = document.querySelector(".home-hero-line--3.type-hero-title");
    const copy = document.querySelector(".home-hero-copy");
    const btn = document.querySelector(".home-hero-line--5 a, .home-hero-line--5 button");
    const spans = h1?.querySelectorAll("span") ?? [];
    const first = spans[0];
    const second = spans[1];
    const hr = h1?.getBoundingClientRect();
    const br = btn?.getBoundingClientRect();
    const cr = copy?.getBoundingClientRect();
    const overflowHero =
      (hr && cr && (hr.right > cr.right + 2 || hr.left < cr.left - 2)) ||
      (br && cr && (br.right > cr.right + 2 || br.left < cr.left - 2));
    return {
      sublineGone: !bodyText.includes(subline),
      okBlue:
        first && getComputedStyle(first).color === "rgb(47, 168, 238)",
      okWhite:
        second && getComputedStyle(second).color === "rgb(255, 255, 255)",
      hasCta: !!btn && /consultation/i.test(btn.textContent || ""),
      cw: document.documentElement.clientWidth,
      sw: document.documentElement.scrollWidth,
      docOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
      overflowHero,
    };
  }, SUBLINE);

  if (!r.sublineGone) issues.push(`${w}: subline still visible`);
  if (!r.okBlue) issues.push(`${w}: headline first phrase not blue`);
  if (!r.okWhite) issues.push(`${w}: headline second phrase not white`);
  if (!r.hasCta) issues.push(`${w}: CTA missing`);
  if (r.overflowHero) issues.push(`${w}: hero content outside column`);
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
