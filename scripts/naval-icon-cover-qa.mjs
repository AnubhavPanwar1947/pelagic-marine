import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";

const widths = [
  50, 80, 120, 160, 200, 240, 280, 320, 360, 390, 430, 600, 768, 820, 1024,
  1280, 1440, 1920, 2560, 3258,
];
const screenshotWidths = [50, 320, 768, 1280, 2560];
const baseUrl = process.env.BASE_URL || "http://localhost:3000/";
const outDir = path.join(os.tmpdir(), "naval-icon-cover-qa");
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

async function navalTileState() {
  return page.evaluate(() => {
    const tile = [...document.querySelectorAll("a")].find((a) =>
      /Naval Architecture/i.test(a.textContent ?? ""),
    );
    const icon = tile?.querySelector(".home-service-tile-icon--naval-hairline-fix");
    const cover = icon?.querySelector(".home-service-icon-cover");
    const img = icon?.querySelector("img.home-service-tile-icon__img");
    const face = tile?.querySelector(".home-service-tile-face");
    if (!tile || !icon || !cover || !img) {
      return { ok: false, error: "missing naval tile elements" };
    }
    const coverCs = getComputedStyle(cover);
    const coverRect = cover.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const coverVisible = coverCs.display !== "none" && coverRect.width > 0;
    const faceDisplay = face ? getComputedStyle(face).display : "";
    return {
      ok: true,
      vw,
      imgW: Math.round(imgRect.width),
      imgH: Math.round(imgRect.height),
      coverVisible,
      coverDisplay: coverCs.display,
      coverBg: coverCs.backgroundColor,
      coverPe: coverCs.pointerEvents,
      coverZ: coverCs.zIndex,
      coverInsideImg:
        coverRect.left >= imgRect.left - 1 &&
        coverRect.right <= imgRect.right + 1 &&
        coverRect.top >= imgRect.top - 1 &&
        coverRect.bottom <= imgRect.bottom + 1,
      faceDisplay,
    };
  });
}

async function sampleHairlineDarkness() {
  return page.evaluate(async () => {
    const tile = [...document.querySelectorAll("a")].find((a) =>
      /Naval Architecture/i.test(a.textContent ?? ""),
    );
    const img = tile?.querySelector("img.home-service-tile-icon__img");
    if (!img) return { error: "no img" };
    const ir = img.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    const w = Math.max(1, Math.round(ir.width));
    const h = Math.max(1, Math.round(ir.height));
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { error: "no ctx" };
    try {
      ctx.drawImage(img, 0, 0, w, h);
    } catch {
      return { error: "drawImage failed" };
    }
    const yFrac = 0.603;
    const x0 = Math.floor(w * 0.22);
    const x1 = Math.ceil(w * 0.78);
    const y = Math.min(h - 1, Math.round(h * yFrac));
    let maxDark = 0;
    let sum = 0;
    let n = 0;
    for (let x = x0; x <= x1; x++) {
      const d = ctx.getImageData(x, y, 1, 1).data;
      const lum = (d[0] + d[1] + d[2]) / 3;
      if (d[3] > 128) {
        sum += lum;
        n++;
        if (lum < 200) maxDark = Math.max(maxDark, 255 - lum);
      }
    }
    const avgLum = n ? sum / n : 255;
    return { y, x0, x1, avgLum, maxDark, hairlineLikely: maxDark > 40 };
  });
}

const results = [];

for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.mouse.move(0, 0);
  const resting = await navalTileState();
  const sample = resting.coverVisible ? await sampleHairlineDarkness() : { skipped: true };
  const entry = {
    width: w,
    resting: { ...resting, sample },
    coverExpected: w >= 640,
    coverOk:
      w >= 640
        ? resting.coverVisible &&
          resting.coverBg === "rgb(255, 255, 255)" &&
          resting.coverPe === "none"
        : !resting.coverVisible,
  };
  results.push(entry);

  if (screenshotWidths.includes(w)) {
    const tile = page.getByRole("link", { name: /Naval Architecture/i });
    await tile.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: path.join(outDir, `naval-tile-${w}.png`),
      clip: await tile.boundingBox(),
    });
  }
}

// 200% zoom at 1280 layout width
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.body.style.zoom = "200%";
});
await page.waitForTimeout(200);
const zoomResting = await navalTileState();
await page.getByRole("link", { name: /Naval Architecture/i }).hover({ force: true });
await page.waitForTimeout(250);
const hoverState = await page.evaluate(() => {
  const tile = [...document.querySelectorAll("a")].find((a) =>
    /Naval Architecture/i.test(a.textContent ?? ""),
  );
  const face = tile?.querySelector(".home-service-tile-face");
  const cover = tile?.querySelector(".home-service-icon-cover");
  return {
    faceDisplay: face ? getComputedStyle(face).display : "",
    coverDisplay: cover ? getComputedStyle(cover).display : "",
  };
});
await page.evaluate(() => {
  document.body.style.zoom = "";
});

results.push({
  width: "1280@200%zoom",
  resting: zoomResting,
  hover: hoverState,
  hoverOk: hoverState.faceDisplay === "none",
});

const summary = {
  baseUrl,
  outDir,
  allCoverDisplayOk: results.every((r) => r.coverOk !== false && (r.coverOk ?? true)),
  widthsChecked: results.length,
  failures: results.filter((r) => r.coverOk === false),
  results,
};

const outPath = path.join(process.cwd(), "scripts", "naval-icon-cover-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));

await browser.close();
