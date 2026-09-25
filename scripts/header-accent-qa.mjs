import { chromium } from "playwright";

const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const navBp = 960;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const out = [];
for (const path of ["/", "/contact/"]) {
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(`http://localhost:3000${path}`, {
      waitUntil: "networkidle",
    });
    let mobileMenu = null;
    if (w < navBp) {
      await page.evaluate(() => {
        document.querySelector(".site-header-menu-toggle")?.click();
      });
      await page.waitForSelector("#site-mobile-nav", { state: "visible" });
      mobileMenu = await page.evaluate(() => {
        const header = document.querySelector("header.site-header");
        const panel = document.getElementById("site-mobile-nav");
        const logo = document.querySelector(".brand-logo-lockup--header");
        const hr = header?.getBoundingClientRect();
        const pr = panel?.getBoundingClientRect();
        const lr = logo?.getBoundingClientRect();
        return {
          panelTop: pr ? Math.round(pr.top) : 0,
          headerBottom: hr ? Math.round(hr.bottom) : 0,
          panelBelowHeader: pr && hr && pr.top >= hr.bottom - 2,
          logoAbovePanel: lr && pr && lr.bottom <= pr.top + 2,
        };
      });
      await page.evaluate(() => {
        const b = document.querySelector(".site-header-menu-toggle");
        if (b?.getAttribute("aria-expanded") === "true") b.click();
      });
    }

    const data = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      const accent = document.querySelector(".site-header-accent");
      const header = document.querySelector("header.site-header");
      const bar = document.querySelector(".site-header-bar");
      const logo = document.querySelector(".brand-logo-home-link");
      const menuBtn = document.querySelector(".site-header-menu-toggle");
      const cta = document.querySelector(".site-header-contact-cta");
      const hr = header?.getBoundingClientRect();
      const br = bar?.getBoundingClientRect();
      const inside = (el) => {
        const r = el?.getBoundingClientRect();
        return (
          r &&
          hr &&
          r.top >= hr.top - 1 &&
          r.bottom <= hr.bottom + 1 &&
          r.left >= hr.left - 2 &&
          r.right <= hr.right + 2
        );
      };
      const topStrip =
        header &&
        br &&
        window.getComputedStyle(header).backgroundImage.includes("gradient");
      return {
        vw,
        sw,
        overflowX: sw > vw + 0.5,
        accentGone: !accent,
        headerTopMatchesBar: hr && br && Math.abs(hr.top - br.top) < 2,
        logoInside: inside(logo),
        menuInside: menuBtn ? inside(menuBtn) : null,
        ctaInside: cta && cta.offsetParent !== null ? inside(cta) : null,
        headerHasBgGradient: topStrip,
      };
    });

    out.push({ path, targetWidth: w, ...data, mobileMenu });
  }
}

for (const path of ["/", "/team/"]) {
  await page.setViewportSize({ width: 50, height: 900 });
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
  const scroll = await page.evaluate(() => ({
    vw: document.documentElement.clientWidth,
    sw: document.documentElement.scrollWidth,
  }));
  out.push({ path, targetWidth: 50, scrollReport: scroll });
}

await browser.close();
console.log(JSON.stringify(out, null, 2));
