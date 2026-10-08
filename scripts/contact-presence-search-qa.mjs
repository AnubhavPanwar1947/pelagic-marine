import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000/";
const WIDTHS = [
  50, 320, 767, 768, 1023, 1024, 1100, 1200, 1279, 1280, 1440, 1920,
];
const QUERIES = [
  "Woodlands",
  "Yokohama",
  "737715",
  "Associate Office",
  "12 Woodlands Square, #06-74, Woods Square, Singapore 737715",
  "4-54-6 UTSUKUSHIGAOKA, AOBA WARD, YOKOHAMA CITY -225-0002",
];

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document.querySelectorAll('[role="presentation"].fixed').forEach((el) => el.remove());
  });
}

const browser = await chromium.launch({ headless: true });
const issues = [];

for (const q of QUERIES) {
  const url = new URL(`/search/?q=${encodeURIComponent(q)}`, BASE).href;
  for (const width of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url, { waitUntil: "networkidle" });
    await dismiss(page);

    const m = await page.evaluate((vw) => {
      const scrollW = document.documentElement.scrollWidth;
      const hasContact = [...document.querySelectorAll("a.site-search-result-row")].some(
        (a) => a.getAttribute("href")?.includes("/contact"),
      );
      const input = document.querySelector(".site-search-field__input");
      const inputBox = input?.getBoundingClientRect();
      const inputOutside =
        inputBox && (inputBox.left < -1 || inputBox.right > vw + 1);
      return { scrollW, vw: window.innerWidth, hasContact, inputOutside };
    }, width);

    if (m.scrollW > m.vw + 0.5) {
      issues.push(`${q} ${width}px: horizontal overflow ${m.scrollW} > ${m.vw}`);
    }
    if (!m.hasContact) {
      issues.push(`${q} ${width}px: no Contact result link`);
    }
    if (m.inputOutside) {
      issues.push(`${q} ${width}px: search input outside viewport`);
    }
    await page.close();
  }
}

for (const width of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewportSize({ width, height: 900 });
  await page.goto(new URL("/search/?q=Dubai", BASE).href, { waitUntil: "networkidle" });
  await dismiss(page);
  const m = await page.evaluate((vw) => {
    const scrollW = document.documentElement.scrollWidth;
    const icon = document.querySelector(".site-header-search a[aria-label='Open search']");
    const iconBox = icon?.getBoundingClientRect();
    const iconOutside =
      iconBox && iconBox.width > 0 && (iconBox.left < -1 || iconBox.right > vw + 1);
    const input = document.querySelector(".site-search-field__input");
    const inputBox = input?.getBoundingClientRect();
    const inputOutside =
      inputBox && inputBox.width > 0 && (inputBox.left < -1 || inputBox.right > vw + 1);
    return { scrollW, vw: window.innerWidth, iconOutside, inputOutside, hasIcon: !!icon };
  }, width);
  if (!m.hasIcon) issues.push(`search ${width}px: missing header search`);
  if (width >= 320 && m.iconOutside) {
    issues.push(`search ${width}px: header search outside viewport`);
  }
  if (m.inputOutside) issues.push(`search ${width}px: search input outside viewport`);
  if (m.scrollW > m.vw + 0.5) {
    issues.push(`search ${width}px: horizontal overflow ${m.scrollW}`);
  }
  await page.close();
}

const zoom = await browser.newPage();
await zoom.setViewportSize({ width: 640, height: 900 });
await zoom.goto(new URL("/search/?q=Woodlands", BASE).href, { waitUntil: "networkidle" });
await dismiss(zoom);
const z = await zoom.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  vw: window.innerWidth,
  hasContact: [...document.querySelectorAll("a.site-search-result-row")].some((a) =>
    a.getAttribute("href")?.includes("/contact"),
  ),
}));
if (z.scrollW > z.vw + 0.5) issues.push("1280@200% Woodlands: overflow");
if (!z.hasContact) issues.push("1280@200% Woodlands: no Contact result");
await zoom.close();

await browser.close();
console.log(JSON.stringify({ issues, pass: issues.length === 0 }, null, 2));
process.exit(issues.length ? 1 : 0);
