import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const publicDir = fileURLToPath(new URL("../public/", import.meta.url));

/** Cream matches site background — logo blends on header. */
const BG = { r: 253, g: 251, b: 247, alpha: 0 };

async function writePngSizes(buffer, label) {
  for (const size of [256, 512, 1024]) {
    const out = await sharp(buffer)
      .resize(size, size, {
        fit: "contain",
        background: BG,
        kernel: sharp.kernel.lanczos3,
      })
      .png({ compressionLevel: 9 })
      .toBuffer();
    writeFileSync(`${publicDir}logo-${size}.png`, out);
    console.log(`Wrote logo-${size}.png (${label})`);
  }
  writeFileSync(`${publicDir}logo.png`, buffer);
  console.log(`Wrote logo.png (${label})`);
}

async function buildFromRaster() {
  const source = readFileSync(`${publicDir}logo-source.png`);
  const meta = await sharp(source).metadata();
  const width = meta.width ?? 400;
  const height = meta.height ?? 400;

  const cropSize = Math.min(Math.round(Math.min(width, height) * 0.72), width, height);
  const left = Math.max(0, Math.floor((width - cropSize) / 2));
  const top = Math.max(0, Math.floor((height - cropSize) * 0.38));

  // Sharp cannot chain extract → trim; run in separate steps.
  let cropped = source;
  if (cropSize > 8) {
    cropped = await sharp(source)
      .extract({
        left,
        top,
        width: Math.min(cropSize, width - left),
        height: Math.min(cropSize, height - top),
      })
      .toBuffer();
  }

  const trimmed = await sharp(cropped).trim({ threshold: 18 }).toBuffer();

  const buffer = await sharp(trimmed)
    .resize(1024, 1024, {
      fit: "contain",
      background: BG,
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 1.15, m1: 1.1, m2: 0.45 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  await writePngSizes(buffer, "raster emblem");
}

async function buildFromSvg(svgFile, label) {
  const { Resvg } = await import("@resvg/resvg-js");
  const svg = readFileSync(`${publicDir}${svgFile}`);

  const master = new Resvg(svg, {
    fitTo: { mode: "width", value: 1024 },
    background: "transparent",
  }).render().asPng();

  await writePngSizes(master, label);
}

try {
  // Prefer clean vector emblem (Myntra-sharp at every size)
  await buildFromSvg("logo-emblem.svg", "vector emblem");
} catch (error) {
  console.warn("Vector emblem failed, trying raster source:", error);
  try {
    await buildFromRaster();
  } catch (rasterError) {
    console.warn("Raster failed, falling back to legacy SVG:", rasterError);
    await buildFromSvg("logo.svg", "legacy SVG");
  }
}
