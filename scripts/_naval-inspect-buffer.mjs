import sharp from "sharp";

const svg = process.argv[2];
if (!svg) {
  console.error("usage: node _naval-inspect-buffer.mjs <svg-string-file>");
  process.exit(1);
}
import fs from "node:fs";
const text = fs.readFileSync(svg, "utf8");

function findRuns(data, width, y, minLen = 8) {
  const runs = [];
  let start = null;
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    const hair = a > 150 && Math.max(r, g, b) < 120;
    if (hair) {
      if (start === null) start = x;
    } else if (start !== null) {
      if (x - start >= minLen) runs.push([start, x - 1]);
      start = null;
    }
  }
  return runs;
}

const pngs = [...text.matchAll(/data:image\/png;base64,([^"]+)/g)];
for (let li = 0; li < pngs.length; li++) {
  const { data, info } = await sharp(Buffer.from(pngs[li][1], "base64"))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  console.log(`\n=== PNG layer ${li} ===`);
  for (const y of [493, 494, 495, 496, 497]) {
    const all = findRuns(data, info.width, y);
    const seam = all.filter(([a, b]) => b >= 248 && a <= 402);
    if (seam.length) console.log(`  y=${y} seam-region dark runs (max<120):`, seam);
  }
  let dark = 0;
  for (let y = 493; y <= 497; y++) {
    for (let x = 248; x <= 402; x++) {
      const i = (y * info.width + x) * 4;
      if (data[i + 3] > 150 && Math.max(data[i], data[i + 1], data[i + 2]) < 200)
        dark++;
    }
  }
  console.log(`  bbox x248-402 y493-497 dark(max<200):`, dark);
}
