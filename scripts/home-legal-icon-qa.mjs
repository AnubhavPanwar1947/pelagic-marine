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
    const legal = document.querySelector('a[href="/services/legal-consultancy/"]');
    const img = legal?.querySelector("img");
    const iconBox = legal?.querySelector(".home-service-tile-icon");
    const ir = img?.getBoundingClientRect();
    const br = iconBox?.getBoundingClientRect();
    const inside =
      ir &&
      br &&
      ir.width > 0 &&
      ir.height > 0 &&
      ir.right <= br.right + 2 &&
      ir.left >= br.left - 2 &&
      ir.bottom <= br.bottom + 2 &&
      ir.top >= br.top - 2;
    const others = [...document.querySelectorAll(".home-service-tile img")].map(
      (el) => el.getAttribute("src")?.split("/").pop(),
    );
    const vw = document.documentElement.clientWidth;
    return {
      legalHref: legal?.getAttribute("href"),
      legalLabel: legal?.querySelector(".home-service-tile-label")?.textContent?.trim(),
      src: img?.getAttribute("src"),
      natural: img?.naturalWidth > 0,
      inside,
      others,
      cw: document.documentElement.clientWidth,
      sw: document.documentElement.scrollWidth,
      docOverflow: document.documentElement.scrollWidth > vw + 2,
    };
  });

  if (r.legalHref !== "/services/legal-consultancy/")
    issues.push(`${w}: wrong legal href`);
  if (r.legalLabel !== "Legal Consultancy")
    issues.push(`${w}: wrong legal label`);
  if (!r.src?.includes("loadicator.svg")) issues.push(`${w}: wrong legal icon src`);
  if (!r.natural) issues.push(`${w}: legal icon did not load`);
  if (!r.inside) issues.push(`${w}: icon outside box`);
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
