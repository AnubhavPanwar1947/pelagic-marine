import { chromium } from "playwright";

const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const navBp = 960;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const out = [];
for (const spec of [
  { path: "/", scroll: false, name: "home-overlay" },
  { path: "/contact/", scroll: false, name: "contact-solid" },
]) {
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(`http://localhost:3000${spec.path}`, {
      waitUntil: "networkidle",
    });
    if (spec.scroll) {
      await page.evaluate(() => window.scrollTo(0, 400));
      await page.waitForTimeout(200);
    }

    let mobileMenu = null;
    if (w < navBp && spec.path === "/") {
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
          panelBelowHeader: pr && hr && pr.top >= hr.bottom - 2,
        };
      });
      await page.evaluate(() => {
        const b = document.querySelector(".site-header-menu-toggle");
        if (b?.getAttribute("aria-expanded") === "true") b.click();
      });
    }

    const data = await page.evaluate((isHome) => {
      const vw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      const header = document.querySelector("header.site-header");
      const s = header ? getComputedStyle(header) : null;
      const accent = document.querySelector(".site-header-accent");
      const logo = document.querySelector(".brand-logo-home-link");
      const menuBtn = document.querySelector(".site-header-menu-toggle");
      const cta = document.querySelector(".site-header-contact-cta");
      const hr = header?.getBoundingClientRect();
      const inside = (el) => {
        const r = el?.getBoundingClientRect();
        return (
          r &&
          hr &&
          r.top >= hr.top - 1 &&
          r.bottom <= hr.bottom + 1
        );
      };
      const bb = s?.borderBottomWidth || "";
      const bc = s?.borderBottomColor || "";
      const overlay = header?.getAttribute("data-overlay") === "true";
      const hairline = overlay && header ? getComputedStyle(header, "::after") : null;
      const hairlineBg = hairline?.backgroundColor || "";
      const hairlineScale = hairline?.transform || "";
      const parseRgb = (c) => {
        const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (!m) return null;
        return {
          r: +m[1],
          g: +m[2],
          b: +m[3],
          a: m[4] !== undefined ? +m[4] : 1,
        };
      };
      const hairRgb = parseRgb(hairlineBg);
      const overlayLineOk =
        overlay &&
        parseFloat(bb) === 1 &&
        (bc.includes("transparent") ||
          bc.includes("0, 0, 0, 0)") ||
          (parseRgb(bc) && parseRgb(bc).a < 0.15)) &&
        hairRgb &&
        hairRgb.r >= 250 &&
        hairRgb.g >= 250 &&
        hairRgb.b >= 250 &&
        Math.abs(hairRgb.a - 0.35) < 0.08 &&
        hairlineScale.includes("0.5");
      const sandOk =
        !overlay &&
        s &&
        (bc.includes("238") || bc.includes("eef2f6") || bc.includes("242, 246"));
      return {
        vw,
        sw,
        overflowX: sw > vw + 0.5,
        overlay,
        accentGone: !accent,
        borderBottomWidth: bb,
        borderBottomColor: bc,
        overlayLineOk,
        solidSandBorderOk: !isHome || overlay ? true : sandOk,
        contactSolidOk: !isHome ? !overlay && parseFloat(bb) >= 1 : true,
        logoInside: inside(logo),
        menuInside: menuBtn ? inside(menuBtn) : null,
        ctaInside: cta && cta.offsetParent !== null ? inside(cta) : null,
      };
    }, spec.path === "/");

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
