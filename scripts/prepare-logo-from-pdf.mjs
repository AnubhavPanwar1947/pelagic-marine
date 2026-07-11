/**
 * Build web logos from Final.pdf (Canva vector export).
 * logo.png       — PELAGIC + anchor + waves (header, enhanced)
 * logo-full.png  — full lockup + MARINE SOLUTIONS (splash)
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicDir = `${root}public/`;
const BG = { r: 253, g: 251, b: 247, alpha: 0 };

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

async function enhanceEmblem(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const iw = info.width;
  const ih = info.height;
  const ch = info.channels;
  const topBand = Math.floor(ih * 0.24);
  const waveStart = Math.floor(ih * 0.62);

  for (let y = 0; y < ih; y++) {
    for (let x = 0; x < iw; x++) {
      const i = (y * iw + x) * ch;
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      const a = data[i + 3];
      if (a < 8) continue;

      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const sat = maxC ? (maxC - minC) / maxC : 0;

      if (y < topBand && sat > 0.15 && lum > 25 && lum < 130) {
        // Darken & sharpen PELAGIC letterforms
        data[i] = Math.round(Math.min(40, r * 0.72));
        data[i + 1] = Math.round(Math.min(55, g * 0.75));
        data[i + 2] = Math.round(Math.min(95, b * 0.82));
      } else if (y >= waveStart && sat > 0.18 && lum < 220) {
        // Boost wave blues — deeper navy + brighter highlights
        if (lum < 95) {
          data[i] = Math.round(r * 0.82);
          data[i + 1] = Math.round(g * 0.88);
          data[i + 2] = Math.round(Math.min(255, b * 1.08));
        } else {
          data[i] = Math.round(Math.min(255, r * 0.95 + 8));
          data[i + 1] = Math.round(Math.min(255, g * 1.06 + 12));
          data[i + 2] = Math.round(Math.min(255, b * 1.22 + 18));
        }
      }
    }
  }

  let out = await sharp(data, { raw: { width: iw, height: ih, channels: ch } }).png().toBuffer();

  const topH = Math.floor(ih * 0.34);
  const topBoost = await sharp(out)
    .extract({ left: 0, top: 0, width: iw, height: topH })
    .linear(1.2, -14)
    .sharpen({ sigma: 1.1, m1: 1.2, m2: 0.5 })
    .png()
    .toBuffer();

  const waveH = ih - Math.floor(ih * 0.6);
  const waveBoost = await sharp(out)
    .extract({ left: 0, top: Math.floor(ih * 0.6), width: iw, height: waveH })
    .modulate({ saturation: 1.42, brightness: 1.04 })
    .linear(1.18, -12)
    .sharpen({ sigma: 1.3, m1: 1.3, m2: 0.55 })
    .png()
    .toBuffer();

  out = await sharp(out)
    .composite([
      { input: topBoost, top: 0, left: 0 },
      { input: waveBoost, top: Math.floor(ih * 0.6), left: 0 },
    ])
    .png()
    .toBuffer();

  return out;
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
      .png({ compressionLevel: 6 })
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

await writeSizes(trimmed, "logo-full");

// Crop: PELAGIC → waves only (remove MARINE SOLUTIONS + padding below)
const emblemH = Math.round(h * 0.795);
let emblem = await sharp(trimmed)
  .extract({ left: 0, top: 0, width: w, height: emblemH })
  .trim({ threshold: 12 })
  .png()
  .toBuffer();

emblem = await enhanceEmblem(emblem);
await writeSizes(emblem, "logo");
console.log("Enhanced emblem: bolder PELAGIC + clearer waves");
