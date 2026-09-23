import fs from "fs";
import path from "path";
import sharp from "sharp";

const TARGET = { r: 26, g: 85, b: 124 };
const root = path.join(process.cwd(), "public", "images", "icons");
const files = ["legal-consultancy.svg", "legal consulttancy.svg"];

function extractPngBase64(svgText) {
  const match = svgText.match(
    /xlink:href="data:image\/png;base64,([^"]+)"/,
  );
  if (!match) {
    throw new Error("No embedded PNG found in SVG");
  }
  return Buffer.from(match[1], "base64");
}

/**
 * Map black/grey linework to #1A557C while preserving luminance for anti-aliasing.
 * Near-white pixels stay white; darker pixels interpolate toward navy.
 */
async function recolorLineworkPng(pngBuf) {
  const { data, info } = await sharp(pngBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const out = Buffer.from(data);
  const whiteThreshold = 245;

  for (let i = 0; i < out.length; i += channels) {
    const pr = out[i];
    const pg = out[i + 1];
    const pb = out[i + 2];
    const pa = out[i + 3];

    if (pa < 8) {
      out[i] = 255;
      out[i + 1] = 255;
      out[i + 2] = 255;
      out[i + 3] = 255;
      continue;
    }

    const lum = (pr + pg + pb) / 3;

    if (lum >= whiteThreshold) {
      out[i] = 255;
      out[i + 1] = 255;
      out[i + 2] = 255;
      out[i + 3] = 255;
      continue;
    }

    // Darkness of linework (0 = white edge, 1 = black core)
    const ink = Math.min(1, Math.max(0, 1 - lum / 255));
    const t = Math.pow(ink, 0.92);

    out[i] = Math.round(255 + (TARGET.r - 255) * t);
    out[i + 1] = Math.round(255 + (TARGET.g - 255) * t);
    out[i + 2] = Math.round(255 + (TARGET.b - 255) * t);
    out[i + 3] = pa;
  }

  return sharp(out, { raw: { width, height, channels } }).png().toBuffer();
}

function buildSvg(pngBuf, viewBox = "0 0 900 899.99999") {
  const b64 = pngBuf.toString("base64");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${viewBox}" width="900" height="900" preserveAspectRatio="xMidYMid meet">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <image width="900" height="900" xlink:href="data:image/png;base64,${b64}" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
}

for (const name of files) {
  const filePath = path.join(root, name);
  if (!fs.existsSync(filePath)) {
    console.log(`skip missing: ${name}`);
    continue;
  }

  const svgText = fs.readFileSync(filePath, "utf8");
  const viewBox =
    svgText.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 900 899.99999";
  const pngIn = extractPngBase64(svgText);
  const meta = await sharp(pngIn).metadata();
  console.log(`${name}: embedded ${meta.width}x${meta.height}`);

  const pngOut = await recolorLineworkPng(pngIn);
  const outSvg = buildSvg(pngOut, viewBox);
  fs.writeFileSync(filePath, outSvg);
  console.log(`wrote ${name} (${outSvg.length} bytes)`);
}

const checkPath = path.join(root, "legal-consultancy.svg");
const checkPng = extractPngBase64(fs.readFileSync(checkPath, "utf8"));
const { data, info } = await sharp(checkPng)
  .raw()
  .toBuffer({ resolveWithObject: true });

let navyCore = 0;
let navyEdge = 0;
let white = 0;
let black = 0;

for (let i = 0; i < data.length; i += info.channels) {
  const pr = data[i];
  const pg = data[i + 1];
  const pb = data[i + 2];
  if (pr > 250 && pg > 250 && pb > 250) white += 1;
  else if (pr === TARGET.r && pg === TARGET.g && pb === TARGET.b) navyCore += 1;
  else if (pr < 40 && pg < 40 && pb < 40) black += 1;
  else if (
    pr >= TARGET.r - 30 &&
    pr <= TARGET.r + 30 &&
    pg >= TARGET.g - 30 &&
    pg <= TARGET.g + 30 &&
    pb >= TARGET.b - 30 &&
    pb <= TARGET.b + 30
  ) {
    navyEdge += 1;
  }
}

console.log(
  `pixels — white: ${white}, navy core: ${navyCore}, navy edge (anti-alias): ${navyEdge}, remaining black: ${black}`,
);
