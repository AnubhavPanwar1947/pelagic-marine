import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000/";
const widths = [
  50, 80, 120, 160, 200, 240, 280, 320, 360, 390, 430, 600, 768, 820, 1024, 1280,
  1440, 1920, 2560, 3258,
];

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

function visibleLogoRect(page) {
  return page.evaluate(() => {
    const headerLink = document.querySelector("header .brand-logo-home-link");
    const footerLink = document.querySelector(".site-footer-brand .brand-logo-footer-link");
    const pick = (link) => {
      if (!link) return null;
      const full = link.querySelector(".brand-logo-full-svg");
      const circle = link.querySelector(
        ".brand-logo-anchor-slot--header-fallback, .brand-logo-anchor-slot--footer-fallback",
      );
      const csF = full ? getComputedStyle(full) : null;
      const csC = circle ? getComputedStyle(circle) : null;
      const target =
        csF?.display !== "none" ? full : csC?.display !== "none" ? circle : link;
      const r = target?.getBoundingClientRect();
      return r && r.width > 0 && r.height > 0 ? r : link.getBoundingClientRect();
    };
    return {
      vw: document.documentElement.clientWidth,
      scrollW: document.documentElement.scrollWidth,
      headerHref: headerLink?.getAttribute("href"),
      headerLabel: headerLink?.getAttribute("aria-label"),
      headerLinkCount: document.querySelectorAll("header .brand-logo-home-link").length,
      footerHref: footerLink?.getAttribute("href"),
      footerLabel: footerLink?.getAttribute("aria-label"),
      footerLinkCount: document.querySelectorAll(
        ".site-footer-brand .brand-logo-footer-link",
      ).length,
      headerRect: pick(headerLink),
      footerRect: pick(footerLink),
    };
  });
}

const browser = await chromium.launch({ headless: true });
const issues = [];

for (const w of widths) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(`${BASE}about`, { waitUntil: "networkidle" });
  await dismiss(page);

  const meta = await visibleLogoRect(page);
  if (meta.headerLinkCount !== 1)
    issues.push(`${w}px: expected 1 header logo link, got ${meta.headerLinkCount}`);
  if (meta.headerHref !== "/") issues.push(`${w}px: header href ${meta.headerHref}`);
  if (meta.headerLabel !== "Pelagic Marine — home")
    issues.push(`${w}px: header aria-label wrong`);
  if (meta.headerRect && meta.headerRect.right > meta.vw + 0.5)
    issues.push(`${w}px: header logo outside viewport`);

  const h = await page.$("header .brand-logo-home-link");
  if (!h) issues.push(`${w}px: no header logo link`);
  else {
    await h.click({ position: { x: 8, y: 8 } });
    await page.waitForURL((url) => url.pathname === "/", { timeout: 5000 });
    const homeOverflow = await page.evaluate(() => ({
      vw: document.documentElement.clientWidth,
      scrollW: document.documentElement.scrollWidth,
    }));
    if (homeOverflow.scrollW > homeOverflow.vw + 0.5)
      issues.push(`${w}px: horizontal overflow on / after header click`);
  }

  await page.goto(`${BASE}about`, { waitUntil: "networkidle" });
  await dismiss(page);
  if (w >= 400) {
    await page.evaluate(() =>
      document.querySelector("footer")?.scrollIntoView({ block: "center" }),
    );
  }
  const fmeta = await visibleLogoRect(page);
  if (fmeta.footerLinkCount !== 1)
    issues.push(`${w}px: expected 1 footer logo link, got ${fmeta.footerLinkCount}`);
  if (fmeta.footerHref !== "/") issues.push(`${w}px: footer href ${fmeta.footerHref}`);
  if (fmeta.footerLabel !== "Pelagic Marine — home")
    issues.push(`${w}px: footer aria-label wrong`);

  const f = await page.$(".site-footer-brand .brand-logo-footer-link");
  if (!f) issues.push(`${w}px: no footer logo link`);
  else {
    await f.click({ position: { x: 8, y: 8 } });
    await page.waitForURL((url) => url.pathname === "/", { timeout: 5000 });
  }

  await page.close();
}

const narrow = await browser.newPage();
await narrow.setViewportSize({ width: 240, height: 450 });
await narrow.goto(`${BASE}about`, { waitUntil: "networkidle" });
await dismiss(narrow);
const nh = await narrow.$("header .brand-logo-home-link");
await nh?.click();
await narrow.waitForURL((url) => url.pathname === "/");
await narrow.close();

await browser.close();
console.log(JSON.stringify({ issues }, null, 2));
if (issues.length) {
  console.error("ISSUES:", issues);
  process.exit(1);
}
