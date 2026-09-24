import { chromium } from "playwright";

const widths = [50, 190, 320, 375, 480, 768, 960, 1024, 1280, 1440];
const url = "http://localhost:3000/";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(url, { waitUntil: "networkidle" });

const out = [];
for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.mouse.move(0, 0);
  await page.waitForTimeout(100);
  const base = await page.evaluate(() => {
    const tile = [...document.querySelectorAll("a")].find((a) =>
      /Naval Architecture/i.test(a.textContent),
    );
    tile?.scrollIntoView({ block: "center" });
    const img = tile?.querySelector("img.home-service-tile-icon__img");
    const grid = tile?.closest(".grid");
    if (!tile || !img) return { error: "missing" };
    const cr = tile.getBoundingClientRect();
    const ir = img.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const sm = 640;
    const xl = 1280;
    let ec = 1;
    if (vw >= xl) ec = 4;
    else if (vw >= sm) ec = 2;
    const gc = grid
      ? getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean)
          .length
      : 0;
    const src = img.currentSrc || img.src;
    const cs = getComputedStyle(img);
    const eAR = 163 / 169;
    const dAR = ir.width / ir.height;
    return {
      vw,
      sw,
      overflowX: sw > vw + 0.5,
      gridCols: gc,
      expectedCols: ec,
      gridOk: gc === ec,
      src: src.split("?")[0].replace(location.origin, ""),
      pathOk: src.includes("/images/icons/naval-architecture.svg"),
      objectFit: cs.objectFit,
      objectFitOk: cs.objectFit === "contain",
      insideCard:
        ir.left >= cr.left - 2 &&
        ir.right <= cr.right + 2 &&
        ir.top >= cr.top - 2 &&
        ir.bottom <= cr.bottom + 2,
      imgW: Math.round(ir.width),
      imgH: Math.round(ir.height),
      aspectOk: Math.abs(dAR - eAR) < 0.03 || ir.width < 163,
      restingBg: getComputedStyle(tile).backgroundColor,
      restingBgOk: getComputedStyle(tile).backgroundColor === "rgb(255, 255, 255)",
    };
  });
  await page.mouse.move(0, 0);
  await page.getByRole("link", { name: /Naval Architecture/i }).hover({ force: true });
  await page.waitForTimeout(300);
  const hover = await page.evaluate(() => {
    const tile = [...document.querySelectorAll("a")].find((a) =>
      /Naval Architecture/i.test(a.textContent),
    );
    return {
      hoverBg: getComputedStyle(tile).backgroundColor,
      hoverBgOk: getComputedStyle(tile).backgroundColor === "rgb(244, 250, 253)",
    };
  });
  out.push({ targetWidth: w, ...base, ...hover });
}
await browser.close();
console.log(JSON.stringify(out, null, 2));
