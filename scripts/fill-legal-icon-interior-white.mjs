import fs from "fs";
import path from "path";
import sharp from "sharp";

const FILL = { r: 26, g: 85, b: 124 };
const root = path.join(process.cwd(), "public", "images", "icons");
const targets = ["legal-consultancy.svg", "legal consulttancy.svg"];

function extractPngBase64(svgText) {
  const match = svgText.match(
    /xlink:href="data:image\/png;base64,([^"]+)"/,
  );
  if (!match) {
    throw new Error("No embedded PNG found in SVG");
  }
  return Buffer.from(match[1], "base64");
}

function isWhitePixel(r, g, b, a, threshold = 245) {
  if (a < 16) return true;
  return r >= threshold && g >= threshold && b >= threshold;
}

/**
 * The raster has navy to the image edges, so border flood-fill cannot find exterior white.
 * Find white connected components and fill only the largest (main interior fill).
 */
function fillMainInteriorWhite(data, width, height, channels) {
  const out = Buffer.from(data);
  const n = width * height;
  const isWhite = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    const o = i * channels;
    isWhite[i] = isWhitePixel(
      out[o],
      out[o + 1],
      out[o + 2],
      out[o + 3],
    )
      ? 1
      : 0;
  }

  const visited = new Uint8Array(n);
  let largest = { size: 0, pixels: [] };

  for (let start = 0; start < n; start++) {
    if (!isWhite[start] || visited[start]) continue;
    const pixels = [];
    const stack = [start];
    visited[start] = 1;
    while (stack.length > 0) {
      const i = stack.pop();
      pixels.push(i);
      const x = i % width;
      const y = (i - x) / width;
      const neighbors = [
        x > 0 ? i - 1 : -1,
        x < width - 1 ? i + 1 : -1,
        y > 0 ? i - width : -1,
        y < height - 1 ? i + width : -1,
      ];
      for (const ni of neighbors) {
        if (ni >= 0 && isWhite[ni] && !visited[ni]) {
          visited[ni] = 1;
          stack.push(ni);
        }
      }
    }
    if (pixels.length > largest.size) {
      largest = { size: pixels.length, pixels };
    }
  }

  let interiorFilled = 0;
  for (const i of largest.pixels) {
    const o = i * channels;
    out[o] = FILL.r;
    out[o + 1] = FILL.g;
    out[o + 2] = FILL.b;
    out[o + 3] = 255;
    interiorFilled += 1;
  }

  let whiteKept = 0;
  for (let i = 0; i < n; i++) {
    if (!isWhite[i]) continue;
    const o = i * channels;
    if (out[o] === FILL.r && out[o + 1] === FILL.g && out[o + 2] === FILL.b) {
      continue;
    }
    whiteKept += 1;
  }

  return { out, interiorFilled, whiteKept, componentSize: largest.size };
}

function buildSvg(pngBuf, viewBox = "0 0 900 899.99999") {
  const b64 = pngBuf.toString("base64");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${viewBox}" width="900" height="900" preserveAspectRatio="xMidYMid meet">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <image width="900" height="900" xlink:href="data:image/png;base64,${b64}" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
}

const backupPath = path.join(
  root,
  "legal-consultancy.before-white-area-change.svg",
);
const sourcePath = path.join(root, "legal-consultancy.svg");
if (!fs.existsSync(sourcePath)) {
  throw new Error("Missing legal-consultancy.svg");
}
fs.copyFileSync(sourcePath, backupPath);
console.log(`backup: ${backupPath} (${fs.statSync(backupPath).size} bytes)`);

const sourceSvg = fs.readFileSync(sourcePath, "utf8");
const viewBox =
  sourceSvg.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 900 899.99999";
const pngIn = extractPngBase64(sourceSvg);
const { data, info } = await sharp(pngIn)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { out, interiorFilled, whiteKept, componentSize } = fillMainInteriorWhite(
  data,
  info.width,
  info.height,
  info.channels,
);

console.log(
  `embedded ${info.width}x${info.height}: main interior white → #1A557C: ${interiorFilled}px (component size ${componentSize}), other white kept: ${whiteKept}px`,
);

const pngOut = await sharp(out, {
  raw: { width: info.width, height: info.height, channels: info.channels },
}).png().toBuffer();

const outSvg = buildSvg(pngOut, viewBox);

for (const name of targets) {
  const filePath = path.join(root, name);
  if (!fs.existsSync(filePath)) {
    console.log(`skip missing: ${name}`);
    continue;
  }
  fs.writeFileSync(filePath, outSvg);
  console.log(`wrote ${name} (${outSvg.length} bytes)`);
}
