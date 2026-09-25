import { chromium } from "playwright";

const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const out = [];

function dominantSlide() {
  let slide1 = false;
  let slide2 = false;
  for (const layer of document.querySelectorAll(
    ".home-hero-section .transition-opacity",
  )) {
    const op = parseFloat(getComputedStyle(layer).opacity);
    if (op < 0.5) continue;
    const img = layer.querySelector("img");
    const src = img?.getAttribute("src") || "";
    if (src.includes("home-page-hero")) slide1 = true;
    if (src.includes("hero-2")) slide2 = true;
  }
  return { slide1, slide2 };
}

for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const atLoad = await page.evaluate(() => {
    const header = document.querySelector("header.site-header");
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const hero = document.querySelector(".home-hero-section");
    return {
      vw,
      sw,
      overflowX: sw > vw + 0.5,
      overlay: header?.getAttribute("data-overlay") === "true",
      heroH: hero?.getBoundingClientRect().height,
    };
  });
  const loadSlide = await page.evaluate(dominantSlide);
  await page.waitForTimeout(5500);
  const at5s = await page.evaluate(dominantSlide);
  await page.waitForTimeout(5500);
  const at10s = await page.evaluate(dominantSlide);
  out.push({
    width: w,
    ...atLoad,
    loadSlide1: loadSlide.slide1,
    at5sSlide2: at5s.slide2,
    at10sSlide1: at10s.slide1,
  });
}

for (const path of ["/", "/team/"]) {
  await page.setViewportSize({ width: 50, height: 900 });
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
  const scroll = await page.evaluate(() => ({
    vw: document.documentElement.clientWidth,
    sw: document.documentElement.scrollWidth,
  }));
  out.push({ scrollReport: path, ...scroll });
}

await page.emulateMedia({ reducedMotion: "reduce" });
await page.setViewportSize({ width: 1024, height: 900 });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(11000);
const reduced = await page.evaluate(dominantSlide);

await browser.close();
console.log(JSON.stringify({ rows: out, reducedMotion: reduced }, null, 2));
