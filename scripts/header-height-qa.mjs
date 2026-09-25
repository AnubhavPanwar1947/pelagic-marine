import { chromium } from "playwright";

const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const navBp = 960;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const out = [];

for (const spec of [
  { path: "/", scroll: false, name: "home-overlay" },
  { path: "/", scroll: true, name: "home-solid" },
  { path: "/contact/", scroll: false, name: "contact" },
]) {
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(`http://localhost:3000${spec.path}`, {
      waitUntil: "networkidle",
    });
    if (spec.scroll) {
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(250);
    }

    let mobileMenu = null;
    if (w < navBp && spec.path === "/" && !spec.scroll) {
      await page.evaluate(() => {
        document.querySelector(".site-header-menu-toggle")?.click();
      });
      await page.waitForSelector("#site-mobile-nav", { state: "visible" });
      mobileMenu = await page.evaluate(() => {
        const header = document.querySelector("header.site-header");
        const panel = document.getElementById("site-mobile-nav");
        const hr = header?.getBoundingClientRect();
        const pr = panel?.getBoundingClientRect();
        return {
          panelTop: pr?.top,
          headerBottom: hr?.bottom,
          panelBelowHeader: pr && hr && pr.top >= hr.bottom - 2,
        };
      });
      await page.evaluate(() => {
        const b = document.querySelector(".site-header-menu-toggle");
        if (b?.getAttribute("aria-expanded") === "true") b.click();
      });
    }

    const data = await page.evaluate((isHomeOverlay) => {
      const vw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      const header = document.querySelector("header.site-header");
      const hr = header?.getBoundingClientRect();
      const s = header ? getComputedStyle(header) : null;
      const accent = document.querySelector(".site-header-accent");
      const overlay = header?.getAttribute("data-overlay") === "true";
      const inside = (el) => {
        const r = el?.getBoundingClientRect();
        return (
          r &&
          hr &&
          r.top >= hr.top - 1 &&
          r.bottom <= hr.bottom + 1 &&
          r.left >= hr.left - 1 &&
          r.right <= hr.right + 1
        );
      };
      const logo = document.querySelector(".brand-logo-home-link");
      const menuBtn = document.querySelector(".site-header-menu-toggle");
      const cta = document.querySelector(".site-header-contact-cta");
      const heightOk = hr && Math.abs(hr.height - 75) < 0.6;
      const overlayLine =
        overlay &&
        parseFloat(s?.borderBottomWidth || "0") === 1 &&
        s?.borderBottomColor?.includes("255");
      const sandSolid =
        !overlay &&
        (s?.borderBottomColor?.includes("238") ||
          s?.borderBottomColor?.includes("242, 246"));
      return {
        vw,
        sw,
        overflowX: sw > vw + 0.5,
        headerHeight: hr?.height,
        heightOk,
        overlay,
        accentGone: !accent,
        overlayLineOnly: isHomeOverlay ? overlay && overlayLine && !accent : true,
        solidSand: !isHomeOverlay || !overlay ? sandSolid || overlay : true,
        logoInside: inside(logo),
        menuInside: menuBtn ? inside(menuBtn) : null,
        ctaInside: cta && cta.offsetParent !== null ? inside(cta) : null,
      };
    }, spec.name === "home-overlay");

    out.push({
      scenario: spec.name,
      path: spec.path,
      targetWidth: w,
      ...data,
      mobileMenu,
    });
  }
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

await browser.close();
console.log(JSON.stringify(out, null, 2));
