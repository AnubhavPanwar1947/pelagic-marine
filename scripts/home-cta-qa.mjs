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
    const section = document.querySelector(".home-section-cta");
    const btn = section?.querySelector('a[href="/contact/"], a[href="/contact"]');
    const sr = section?.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const sectionOverflow = sr && (sr.right > vw + 2 || sr.left < -2);
    return {
      hasTalk: text.includes("Let's Talk"),
      hasLine: text.includes("Connect with us for your varied needs!"),
      hasConnectNow: text.includes("Connect now"),
      oldGone:
        !text.includes("Next step") &&
        !text.includes("Let's move your project forward") &&
        !text.includes("Get in touch") &&
        !text.includes("Call +91 7895039068"),
      hasClients: text.includes("Trusted across"),
      btnHref: btn?.getAttribute("href"),
      cw: document.documentElement.clientWidth,
      sw: document.documentElement.scrollWidth,
      docOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
      sectionOverflow,
    };
  });

  if (!r.hasTalk) issues.push(`${w}: missing Let's Talk`);
  if (!r.hasLine) issues.push(`${w}: missing supporting line`);
  if (!r.hasConnectNow) issues.push(`${w}: missing Connect now`);
  if (!r.oldGone) issues.push(`${w}: old CTA copy still present`);
  if (!r.hasClients) issues.push(`${w}: clients missing`);
  if (r.btnHref !== "/contact/" && r.btnHref !== "/contact")
    issues.push(`${w}: wrong contact href ${r.btnHref}`);
  if (r.sectionOverflow) issues.push(`${w}: CTA section overflows viewport`);
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
