/**
 * Normalize homepage service icons to match audit icon visual scale.
 * Run: node scripts/trim-home-service-icons.mjs
 */
import fs from "fs";
import nodePath from "node:path";
import sharp from "sharp";

const DIR = nodePath.join(process.cwd(), "public", "images", "icons", "home");
const REF = "inspection-audits-surveying.png";
const TARGETS = ["naval-architecture.png", "engineering.png", "loadicator.png"];
const CANVAS = 600;
const INK_LUM = 235;
/** Fallback audit ink bounds on 600×600 canvas (measured from reference PNG). */
const AUDIT_INK = { left: 149, top: 123, width: 302, height: 354 };
const CANVAS_MARGIN = 6;

function inkBoundsFromRaw(data, width, height, channels) {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 12) {
        continue;
      }
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum >= INK_LUM) {
        continue;
      }
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (!Number.isFinite(minX) || maxX < minX) {
    return null;
  }
  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function stripEngineeringBackground(data, channels) {
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    if (lum > 130 && lum < 252 && chroma < 60) {
      data[i + 3] = 0;
    }
  }
}

async function measureRefInk() {
  const file = nodePath.join(DIR, REF);
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  const channels = info.channels || 4;
  const box = inkBoundsFromRaw(data, info.width, info.height, channels);
  if (!box) {
    throw new Error("Could not measure reference icon ink bounds");
  }
  return box;
}

async function normalizeIcon(filename, refInk, stripGrayBg) {
  const filePath = nodePath.join(DIR, filename);
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  const pixels = Buffer.from(data);
  if (stripGrayBg) {
    stripEngineeringBackground(pixels, info.channels);
  }
  const channels = info.channels || 4;
  const crop = inkBoundsFromRaw(pixels, info.width, info.height, channels);
  if (!crop) {
    throw new Error(`No ink bounds: ${filename}`);
  }
  const cropped = await sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .extract({
      left: crop.left,
      top: crop.top,
      width: crop.width,
      height: crop.height,
    })
    .png()
    .toBuffer();

  const maxW = CANVAS - CANVAS_MARGIN * 2;
  const maxH = CANVAS - CANVAS_MARGIN * 2;
  let targetH = refInk.height;
  let targetW = Math.round(crop.width * (targetH / crop.height));
  if (targetW > maxW) {
    targetW = maxW;
    targetH = Math.round(crop.height * (targetW / crop.width));
  }
  if (targetH > maxH) {
    targetH = maxH;
    targetW = Math.round(crop.width * (targetH / crop.height));
  }
  const fitted = await sharp(cropped)
    .resize(targetW, targetH, { fit: "fill" })
    .png()
    .toBuffer();
  const meta = await sharp(fitted).metadata();
  const left = Math.round((CANVAS - meta.width) / 2);
  const top =
    refInk.top + Math.round((refInk.height - meta.height) / 2);

  const out = await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: fitted, left, top }])
    .png()
    .toBuffer();

  fs.writeFileSync(filePath, out);
  const afterBuf = await sharp(out).ensureAlpha().raw().toBuffer();
  const after = inkBoundsFromRaw(afterBuf, CANVAS, CANVAS, 4);
  console.log(filename, {
    crop,
    fitted: { w: meta.width, h: meta.height },
    placed: { left, top },
    inkAfter: after,
  });
}

const measured = await measureRefInk();
const refInk =
  measured && Number.isFinite(measured.left) ? measured : AUDIT_INK;
console.log("Reference ink:", refInk);

for (const name of TARGETS) {
  await normalizeIcon(name, refInk, name === "engineering.png");
}

console.log("Done. Reference unchanged:", REF);
