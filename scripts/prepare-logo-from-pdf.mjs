/**
 * Build web logos from Final.pdf (Canva vector export).
 * logo.png       — anchor + waves (PDF colors, no enhancement)
 * logo-circle.png — anchor mark for circular UI (header + splash)
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicDir = `${root}public/`;
const BG = { r: 253, g: 251, b: 247, alpha: 0 };
const WHITE = { r: 255, g: 255, b: 255 };

const pdfCandidates = [
  `${publicDir}logo-final.pdf`,
  "c:/Users/Admin/Downloads/Final.pdf",
];

function renderPdfToPng(pdfPath) {
  const base = pdfPath.replace(/\.pdf$/i, "");
  spawnSync("npx", ["--yes", "pdf-to-img", pdfPath, base], {
    cwd: root,
    shell: true,
    encoding: "utf8",
  });
  const candidates = [
    `${base}-1.png`,
    `${root}logo-final-1.png`,
    `${publicDir}logo-final-1.png`,
  ];
  const found = candidates.find((p) => existsSync(p));
  if (!found) throw new Error("PDF render failed — logo-final-1.png not found");
  return found;
}

/** Remove PELAGIC — clear text rows above ring apex, keep full ring */
async function stripPelagicText(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const iw = info.width;
  const ih = info.height;
  const ch = info.channels;

  const cx0 = Math.floor(iw * 0.41);
  const cx1 = Math.floor(iw * 0.59);
  const scanX0 = Math.floor(iw * 0.38);
  const scanX1 = Math.floor(iw * 0.62);

  let ringApex = -1;
  for (let y = 0; y < Math.floor(ih * 0.3); y++) {
    let minX = iw;
    let maxX = -1;
    for (let x = scanX0; x < scanX1; x++) {
      if (data[(y * iw + x) * ch + 3] > 48) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
      }
    }
    if (maxX >= minX && maxX - minX <= iw * 0.09) {
      ringApex = y;
      break;
    }
  }

  if (ringApex < 0) {
    for (let y = 0; y < Math.floor(ih * 0.34); y++) {
      let centerHits = 0;
      for (let x = cx0; x < cx1; x++) {
        if (data[(y * iw + x) * ch + 3] > 48) centerHits++;
      }
      if (centerHits > (cx1 - cx0) * 0.14) {
        ringApex = y;
        break;
      }
    }
  }

  const clearThrough = ringApex > 0 ? Math.max(0, ringApex - 16) : Math.floor(ih * 0.2);

  for (let y = 0; y < clearThrough; y++) {
    for (let x = 0; x < iw; x++) {
      const i = (y * iw + x) * ch;
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 0;
    }
  }

  let cleared = await sharp(data, { raw: { width: iw, height: ih, channels: ch } })
    .flatten({ background: WHITE })
    .png()
    .toBuffer();

  cleared = await clearPelagicWingRemnants(cleared);

  const padTop = Math.round(ih * 0.08);
  return sharp(cleared)
    .extend({ top: padTop, bottom: 0, left: 0, right: 0, background: WHITE })
    .png()
    .toBuffer();
}

/** Erase leftover PELAGIC letter wings in top corners (ring stays centered) */
async function clearPelagicWingRemnants(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const iw = info.width;
  const ih = info.height;
  const ch = info.channels;
  const wingRows = Math.floor(ih * 0.38);
  const wingCols = Math.floor(iw * 0.34);

  for (let y = 0; y < wingRows; y++) {
    for (let x = 0; x < wingCols; x++) {
      const i = (y * iw + x) * ch;
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
    }
    for (let x = iw - wingCols; x < iw; x++) {
      const i = (y * iw + x) * ch;
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
    }
  }

  return sharp(data, { raw: { width: iw, height: ih, channels: ch } })
    .flatten({ background: WHITE })
    .png()
    .toBuffer();
}

async function writeSizes(trimmedBuffer, baseName) {
  const meta = await sharp(trimmedBuffer).metadata();
  const w = meta.width ?? 700;
  const h = meta.height ?? 1024;

  for (const maxH of [256, 512, 1024]) {
    const scale = maxH / h;
    const outW = Math.round(w * scale);
    const outH = maxH;
    const out = await sharp(trimmedBuffer)
      .resize(outW, outH, { fit: "inside", background: BG, kernel: sharp.kernel.lanczos3 })
      .png({ compressionLevel: 4 })
      .toBuffer();

    const name =
      baseName === "logo"
        ? maxH === 1024
          ? "logo.png"
          : `logo-${maxH}.png`
        : maxH === 1024
          ? "logo-full.png"
          : `logo-full-${maxH}.png`;
    writeFileSync(`${publicDir}${name}`, out);
    console.log(`Wrote ${name} (${outW}x${outH}) aspect ${(outH / outW).toFixed(2)}`);
  }
}

/** Square canvas — full anchor visible top-to-bottom, PDF colors preserved */
async function toCircleSquare(buffer) {
  const trimmed = await sharp(buffer).flatten({ background: WHITE }).trim({ threshold: 10 }).toBuffer();

  const meta = await sharp(trimmed).metadata();
  const w = meta.width ?? 700;
  const h = meta.height ?? 700;
  const size = Math.max(w, h);
  const padTop = Math.round(size * 0.1);
  const padSide = Math.round(size * 0.04);
  const padBottom = Math.round(size * 0.03);
  const innerW = size - padSide * 2;
  const innerH = size - padTop - padBottom;

  const scaled = await sharp(trimmed)
    .resize(innerW, innerH, { fit: "inside", background: WHITE })
    .png()
    .toBuffer();

  const sm = await sharp(scaled).metadata();
  const sw = sm.width ?? innerW;
  const sh = sm.height ?? innerH;

  return sharp({
    create: { width: size, height: size, channels: 3, background: WHITE },
  })
    .composite([
      {
        input: scaled,
        left: Math.floor((size - sw) / 2),
        top: padTop + Math.floor((innerH - sh) / 2),
      },
    ])
    .png()
    .toBuffer();
}

async function writeCircleSizes(trimmedBuffer, baseName) {
  const square = await toCircleSquare(trimmedBuffer);

  for (const maxS of [256, 512, 1024]) {
    const out = await sharp(square)
      .resize(maxS, maxS, { fit: "fill", kernel: sharp.kernel.lanczos3 })
      .png({ compressionLevel: 4 })
      .toBuffer();

    const name =
      baseName === "logo-circle"
        ? maxS === 1024
          ? "logo-circle.png"
          : `logo-circle-${maxS}.png`
        : maxS === 1024
          ? "logo-full-circle.png"
          : `logo-full-circle-${maxS}.png`;
    writeFileSync(`${publicDir}${name}`, out);
    console.log(`Wrote ${name} (${maxS}x${maxS})`);
  }
}

let pdfPath = pdfCandidates.find((p) => existsSync(p));
if (!pdfPath) throw new Error("Final.pdf not found");

if (!existsSync(`${publicDir}logo-final.pdf`) && pdfPath !== `${publicDir}logo-final.pdf`) {
  copyFileSync(pdfPath, `${publicDir}logo-final.pdf`);
}

const rendered = renderPdfToPng(
  existsSync(`${publicDir}logo-final.pdf`) ? `${publicDir}logo-final.pdf` : pdfPath,
);

const trimmed = await sharp(readFileSync(rendered)).ensureAlpha().trim({ threshold: 12 }).toBuffer();
const meta = await sharp(trimmed).metadata();
const w = meta.width ?? 1115;
const h = meta.height ?? 1628;

// Anchor + waves only: remove MARINE SOLUTIONS below, then PELAGIC above
const emblemH = Math.round(h * 0.795);
let emblem = await sharp(trimmed)
  .extract({ left: 0, top: 0, width: w, height: emblemH })
  .trim({ threshold: 10 })
  .png()
  .toBuffer();

emblem = await stripPelagicText(emblem);

await writeSizes(emblem, "logo");
await writeCircleSizes(emblem, "logo-circle");
console.log("Anchor mark — PELAGIC removed");
