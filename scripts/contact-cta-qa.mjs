import { chromium } from "playwright";

const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const pages = ["/", "/team/", "/services/", "/contact/"];
const navBp = 960;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const out = [];
for (const path of pages) {
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(`http://localhost:3000${path}`, {
      waitUntil: "networkidle",
    });

    let mobile = null;
    if (w < navBp) {
      const hasToggle = await page.locator(".site-header-menu-toggle").count();
      if (hasToggle) {
        await page.evaluate(() => {
          document.querySelector(".site-header-menu-toggle")?.click();
        });
        await page.waitForSelector(".site-mobile-nav-panel__cta", {
          state: "visible",
          timeout: 5000,
        });
        mobile = await page.evaluate(() => {
          const el = document.querySelector(".site-mobile-nav-panel__cta");
          const s = el ? getComputedStyle(el) : null;
          const r = el?.getBoundingClientRect();
          const fs = s ? parseFloat(s.fontSize) : 0;
          return {
            text: el?.textContent?.trim() ?? "",
            fontSizePx: fs,
            fontSizeOk: Math.abs(fs - 16) < 0.05,
            weight: s ? parseFloat(s.fontWeight) : 0,
            transform: s?.textTransform ?? "",
            synthesis: s?.fontSynthesis ?? "",
            oneLine: r ? r.height <= 28 : false,
          };
        });
        await page.evaluate(() => {
          const btn = document.querySelector(".site-header-menu-toggle");
          if (btn?.getAttribute("aria-expanded") === "true") btn.click();
        });
      }
    }

    const desktop = await page.evaluate((bp) => {
      const vw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      const el = document.querySelector(".site-header-contact-cta");
      const visible =
        el && el.offsetParent !== null && getComputedStyle(el).display !== "none";
      if (!visible || vw < bp) {
        return { visible: false, vw, sw, overflowX: sw > vw + 0.5 };
      }
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const fs = parseFloat(s.fontSize);
      return {
        visible: true,
        vw,
        sw,
        overflowX: sw > vw + 0.5,
        text: el.textContent?.trim() ?? "",
        fontSizePx: fs,
        fontSizeOk: Math.abs(fs - 16) < 0.05,
        weight: parseFloat(s.fontWeight),
        transform: s.textTransform,
        synthesis: s.fontSynthesis,
        letterSpacing: s.letterSpacing,
        oneLine: r.height <= 32,
        nowrap: s.whiteSpace === "nowrap",
        pillFitsBar:
          r.right <= document.documentElement.clientWidth + 1,
      };
    }, navBp);

    out.push({
      path,
      targetWidth: w,
      desktop,
      mobile,
    });
  }
}
await browser.close();
console.log(JSON.stringify(out, null, 2));
