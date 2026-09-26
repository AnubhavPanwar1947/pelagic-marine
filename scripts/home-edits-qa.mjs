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
    const main = document.querySelector("#main-content");
    const text = main?.innerText ?? "";
    const sub = document.querySelector(".home-hero-line--4");
    const copy = document.querySelector(".home-hero-copy");
    const sr = sub?.getBoundingClientRect();
    const cr = copy?.getBoundingClientRect();
    const overflowSub =
      sr && cr && (sr.right > cr.right + 2 || sr.left < cr.left - 2);
    return {
      hasStrength: text.includes("strength"),
      hasStructuresInHero: (sub?.textContent ?? "").includes("structures"),
      ctaGone:
        !text.includes("Next step") &&
        !text.includes("Let's move your project forward") &&
        !text.includes("Get in touch") &&
        !text.includes("Call +91 7895039068"),
      hasClients: text.includes("Trusted across"),
      cw: document.documentElement.clientWidth,
      sw: document.documentElement.scrollWidth,
      docOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
      overflowSub,
    };
  });

  if (!r.hasStrength) issues.push(`${w}: missing strength in hero`);
  if (r.hasStructuresInHero) issues.push(`${w}: structures still in hero subline`);
  if (!r.ctaGone) issues.push(`${w}: bottom CTA copy still present`);
  if (!r.hasClients) issues.push(`${w}: clients section missing`);
  if (r.overflowSub) issues.push(`${w}: subline outside hero column`);
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
