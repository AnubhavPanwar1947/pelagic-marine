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
    const hero = document.querySelector(".home-hero-section");
    const services = document.querySelector(".home-theme-services");
    const about = document.querySelector(".home-theme-why");
    const clients = document.querySelector(".home-section-clients");
    const cta = document.querySelector(".home-section-cta");
    const tile = document.querySelector(".home-service-tile");
    const hr = hero?.getBoundingClientRect();
    const sr = services?.getBoundingClientRect();
    const ar = about?.getBoundingClientRect();
    const cr = clients?.getBoundingClientRect();
    const tr = cta?.getBoundingClientRect();
    const vh = window.innerHeight;
    const heroFillsViewport = hr && hr.height >= vh * 0.95;
    const noOverlap =
      sr &&
      ar &&
      cr &&
      tr &&
      ar.top >= sr.bottom - 2 &&
      cr.top >= ar.bottom - 2 &&
      tr.top >= cr.bottom - 2;
    const tileMinH = tile ? getComputedStyle(tile).minHeight : "";
    const clientsPy = clients
      ? getComputedStyle(clients).paddingTop
      : "";
    const ctaPy = cta ? getComputedStyle(cta).paddingTop : "";
    const marqueeMt = clients?.querySelector(".mt-8");
    const vw = document.documentElement.clientWidth;
    return {
      heroFillsViewport,
      noOverlap,
      tileMinH,
      clientsHasPyMd: clients?.classList.contains("section-py-md"),
      ctaHasPy: cta?.classList.contains("section-py"),
      ctaNoPyLg: !cta?.classList.contains("section-py-lg"),
      clientsPy,
      ctaPy,
      hasMarqueeMt8: !!marqueeMt,
      cw: document.documentElement.clientWidth,
      sw: document.documentElement.scrollWidth,
      docOverflow: document.documentElement.scrollWidth > vw + 2,
    };
  });

  if (!r.heroFillsViewport) issues.push(`${w}: hero not full viewport`);
  if (!r.noOverlap) issues.push(`${w}: sections overlap`);
  if (!r.clientsHasPyMd) issues.push(`${w}: clients not section-py-md`);
  if (!r.ctaHasPy || !r.ctaNoPyLg) issues.push(`${w}: cta padding class wrong`);
  if (!r.hasMarqueeMt8) issues.push(`${w}: marquee not mt-8`);
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
