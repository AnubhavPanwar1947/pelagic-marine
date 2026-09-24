import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const svgPath = path.join(
  process.cwd(),
  "public/images/icons/naval-architecture.svg",
);
let svg = fs.readFileSync(svgPath, "utf8");

const Y0 = 493;
const Y1 = 497;

const layerRuns = [
  [
    [251, 313],
    [340, 401],
  ],
  [
    [265, 298],
    [305, 314],
    [338, 387],
  ],
];

function inExpandedRuns(x, y, runs, padX = 3, padY = 0) {
  if (y < Y0 - padY || y > Y1 + padY) return false;
  for (const [x0, x1] of runs) {
    if (x >= x0 - padX && x <= x1 + padX) return true;
  }
  return false;
}

function isWhiteHull(data, width, height, x, y) {
  if (y < 0 || y >= height) return false;
  const i = (y * width + x) * 4;
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];
  return a > 150 && r > 220 && g > 220 && b > 220;
}

function isLayer0Hairline(r, g, b, a) {
  if (a < 150) return false;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max >= 200) return false;
  if (max - min > 18) return false;
  return max < 200;
}

function isLayer1Hairline(r, g, b, a) {
  if (a < 150) return false;
  const max = Math.max(r, g, b);
  if (max >= 200) return false;
  if (r > 95 || g > 102 || b > 135) return false;
  if (b < r - 10) return false;
  return true;
}

async function patchPng(base64, layerIndex) {
  const runs = layerRuns[layerIndex];
  const buf = Buffer.from(base64, "base64");
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  const { width, height } = info;
  let changed = 0;
  for (let y = Y0; y <= Y1; y++) {
    for (let x = 0; x < width; x++) {
      if (!inExpandedRuns(x, y, runs, 3, 0)) continue;
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      const onHull =
        isWhiteHull(data, width, height, x, y - 1) ||
        isWhiteHull(data, width, height, x, y + 1);
      const ok =
        layerIndex === 0
          ? onHull && isLayer0Hairline(r, g, b, a)
          : isLayer1Hairline(r, g, b, a);
      if (!ok) continue;
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
      changed++;
    }
  }
  for (let y = Y0; y <= Y1; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 150) continue;
      const max = Math.max(r, g, b);
      if (max >= 200) continue;
      const min = Math.min(r, g, b);
      const cleanup0 =
        layerIndex === 0 &&
        inExpandedRuns(x, y, runs, 3, 0) &&
        max - min <= 20;
      const cleanup1 =
        layerIndex === 1 &&
        y >= 493 &&
        y <= 497 &&
        x >= 248 &&
        x <= 402 &&
        max < 200;
      if (!cleanup0 && !cleanup1) continue;
      if (r === 255 && g === 255 && b === 255) continue;
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
      changed++;
    }
  }
  return { data, info, changed };
}

const re =
  /(<image[^>]*xlink:href=")data:image\/png;base64,([^"]+)("[^>]*\/>)/g;
let layer = 0;
const parts = [];
let last = 0;
for (const m of svg.matchAll(re)) {
  const before = svg.slice(last, m.index);
  parts.push(before);
  const { data, info, changed } = await patchPng(m[2], layer);
  const outBuf = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
  console.log(`layer ${layer}: pixels set to white:`, changed);
  parts.push(
    `${m[1]}data:image/png;base64,${outBuf.toString("base64")}${m[3]}`,
  );
  last = m.index + m[0].length;
  layer++;
}
parts.push(svg.slice(last));
svg = parts.join("");

fs.writeFileSync(svgPath, svg);
console.log("wrote", svgPath, "bytes", svg.length);
