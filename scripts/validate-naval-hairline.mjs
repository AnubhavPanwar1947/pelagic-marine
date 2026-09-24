import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const svg = fs.readFileSync(
  path.join(process.cwd(), "public/images/icons/naval-architecture.svg"),
  "utf8",
);
const pngs = [...svg.matchAll(/data:image\/png;base64,([^"]+)/g)];
const box = { x0: 248, x1: 402, y0: 493, y1: 497 };
const runs = [
  [[251, 313], [340, 401]],
  [[265, 298], [305, 314], [338, 387]],
];

function inRuns(x, y, layerRuns) {
  for (const [a, b] of layerRuns) {
    if (x >= a - 3 && x <= b + 3 && y >= 493 && y <= 497) return true;
  }
  return false;
}

for (let li = 0; li < pngs.length; li++) {
  const { data, info } = await sharp(Buffer.from(pngs[li][1], "base64"))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let dark = 0;
  let notPureWhite = 0;
  for (let y = box.y0; y <= box.y1; y++) {
    for (let x = box.x0; x <= box.x1; x++) {
      const i = (y * info.width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 150) continue;
      if (Math.max(r, g, b) < 200) dark++;
      if (r < 245 || g < 245 || b < 245) notPureWhite++;
    }
  }
  let lineDark = 0;
  for (let y = box.y0; y <= box.y1; y++) {
    for (let x = box.x0; x <= box.x1; x++) {
      if (!inRuns(x, y, runs[li])) continue;
      const i = (y * info.width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a > 150 && Math.max(r, g, b) < 200) lineDark++;
    }
  }
  console.log(
    `layer ${li} line-region dark(max<200):`,
    lineDark,
    "(full bbox dark:",
    dark,
    ")",
  );
}

console.log(
  "header:",
  svg.match(/viewBox="([^"]+)"/)?.[1],
  svg.match(/preserveAspectRatio="([^"]+)"/)?.[1],
);
