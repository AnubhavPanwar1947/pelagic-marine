/**
 * Builds logo.png from boss artwork:
 * - Keeps anchor + waves
 * - Clears faint raster PELAGIC (SVG overlay draws crisp wordmark on site)
 * - Drops bottom tagline
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const publicDir = fileURLToPath(new URL("../public/", import.meta.url));
const BG = { r: 253, g: 251, b: 247, alpha: 0 };

async function writePngSizes(buffer) {
  for (const size of [256, 512, 1024]) {
    const out = await sharp(buffer)
      .resize(size, size, { fit: "inside", withoutEnlargement: false })
      .png({ compressionLevel: 6 })
      .toBuffer();
    writeFileSync(`${publicDir}logo-${size}.png`, out);
    if (size === 1024) writeFileSync(`${publicDir}logo.png`, out);
    console.log(`Wrote logo${size === 1024 ? ".png" : "-" + size + ".png"}`);
  }
}

const source = readFileSync(`${publicDir}logo-source.png`);
let img = await sharp(source).ensureAlpha().trim({ threshold: 10 }).toBuffer();

const trimmed = await sharp(img).metadata();
const w = trimmed.width ?? 200;
const h = trimmed.height ?? 260;
const keepH = Math.round(h * 0.9);
img = await sharp(img).extract({ left: 0, top: 0, width: w, height: keepH }).toBuffer();

const { data, info } = await sharp(img).raw().toBuffer({ resolveWithObject: true });
const iw = info.width;
const ih = info.height;
const ch = info.channels;
const clearBand = Math.floor(ih * 0.38);

for (let y = 0; y < ih; y++) {
  for (let x = 0; x < iw; x++) {
    const i = (y * iw + x) * ch;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    let a = data[i + 3];
    if (a < 8) continue;

    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = maxC ? (maxC - minC) / maxC : 0;

    if (y < clearBand) {
      const isPaper = lum > 245 && sat < 0.06;
      if (!isPaper) {
        data[i + 3] = 0;
      }
    }
  }
}

const buffer = await sharp(data, { raw: { width: iw, height: ih, channels: ch } })
  .resize(1024, 1024, { fit: "contain", background: BG, kernel: sharp.kernel.lanczos3 })
  .sharpen({ sigma: 0.75, m1: 0.9, m2: 0.35 })
  .png({ compressionLevel: 6 })
  .toBuffer();

await writePngSizes(buffer);
console.log("Logo ready for SVG PELAGIC overlay");
