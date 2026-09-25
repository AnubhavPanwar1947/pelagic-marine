import { chromium } from "playwright";

const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const paths = ["/", "/about/", "/services/", "/team/", "/contact/"];
const base = process.env.QA_BASE_URL ?? "http://localhost:3000";
const COPY_RGB = "rgb(47, 74, 99)";

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
      const body = document.body;
      const bodyStyle = getComputedStyle(body);
      const lead = document.querySelector("main .type-lead");
      const copy = document.querySelector("main .type-copy, main p.type-copy");
      const leadStyle = lead ? getComputedStyle(lead) : null;
      const copyStyle = copy ? getComputedStyle(copy) : null;
      const leadLh = leadStyle ? parseFloat(leadStyle.lineHeight) / parseFloat(leadStyle.fontSize) : null;
      const copyLh = copyStyle ? parseFloat(copyStyle.lineHeight) / parseFloat(copyStyle.fontSize) : null;
      const copyFs = copyStyle ? parseFloat(copyStyle.fontSize) : null;
      const bodyLh = parseFloat(bodyStyle.lineHeight) / parseFloat(bodyStyle.fontSize);

      return {
        vw,
        sw,
        bodyLineHeight: bodyLh,
        bodyColor: bodyStyle.color,
        leadLineHeight: leadLh,
        copyLineHeight: copyLh,
        copyFontSizePx: copyFs,
        copyColor: copyStyle?.color ?? null,
        leadLargerThanCopy:
          leadStyle && copyStyle
            ? parseFloat(leadStyle.fontSize) > parseFloat(copyStyle.fontSize)
            : null,
        colorOk: copyStyle ? copyStyle.color === copyRgb : true,
      };
    }, COPY_RGB);

    row.clientWidth = data.vw;
    row.scrollWidth = data.sw;
    row.overflowX = data.sw > data.vw + 0.5;
    row.pages.push({ path, ...data });
  }

  out.push(row);
}

await browser.close();
console.log(JSON.stringify(out, null, 2));
