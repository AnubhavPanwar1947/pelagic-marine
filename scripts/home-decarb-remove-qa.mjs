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
    const aboutIdx = text.indexOf("Who we are");
    const clientsIdx = text.indexOf("Trusted across");
    const decarbIdx = text.indexOf("Decarbonization");
    return {
      decarbGone:
        !text.includes("Decarbonization") &&
        !text.includes("Supporting the voyage to cleaner seas") &&
        !text.includes("LNG bunkering & compatibility"),
      hasAbout: text.includes("Who we are"),
      hasClients: text.includes("Trusted across"),
      clientsAfterAbout:
        aboutIdx >= 0 && clientsIdx > aboutIdx && decarbIdx === -1,
      cw: document.documentElement.clientWidth,
      sw: document.documentElement.scrollWidth,
      docOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    };
  });

  if (!r.decarbGone) issues.push(`${w}: decarb copy still present`);
  if (!r.hasAbout) issues.push(`${w}: about missing`);
  if (!r.hasClients) issues.push(`${w}: clients missing`);
  if (!r.clientsAfterAbout) issues.push(`${w}: section order wrong`);
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
