import { chromium } from "playwright";

const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const paths = ["/", "/about/", "/services/", "/team/", "/contact/", "/news/", "/capabilities/"];
const COPY_RGB = "rgb(47, 74, 99)";
const COPY_MUTED_RGB = "rgb(77, 97, 119)";
const base = process.env.QA_BASE_URL ?? "http://localhost:3000";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const out = [];

for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 });
  const row = { width: w, clientWidth: 0, scrollWidth: 0, overflowX: false, pages: [] };

  for (const path of paths) {
    await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    const data = await page.evaluate((copyRgb) => {
      const vw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      const paragraphs = [...document.querySelectorAll("main p")].filter((p) => {
        if (p.classList.contains("type-eyebrow")) return false;
        if (p.classList.contains("home-hero-line--4")) return false;
        if (p.closest("footer") || p.closest(".bg-pelagic-charcoal")) return false;
        const rect = p.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });

      const mismatches = paragraphs
        .filter((p) => getComputedStyle(p).color !== copyRgb)
        .map((p) => ({
          color: getComputedStyle(p).color,
          className: p.className.slice(0, 100),
          text: (p.textContent ?? "").trim().slice(0, 48),
        }));

      const darkParagraphs = [...document.querySelectorAll(".bg-pelagic-charcoal p")].map(
        (p) => getComputedStyle(p).color,
      );

      return {
        vw,
        sw,
        paragraphCount: paragraphs.length,
        mismatches,
        darkParagraphColors: [...new Set(darkParagraphs)],
      };
    }, COPY_RGB);

    row.clientWidth = data.vw;
    row.scrollWidth = data.sw;
    row.overflowX = data.sw > data.vw + 0.5;
    row.pages.push({
      path,
      paragraphCount: data.paragraphCount,
      bodyCopyOk: data.mismatches.length === 0,
      mismatches: data.mismatches.slice(0, 3),
      darkParagraphColors: data.darkParagraphColors,
    });
  }

  out.push(row);
}

await browser.close();
console.log(JSON.stringify(out, null, 2));
