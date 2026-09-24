/**
 * One-off prep: landscape 4:3 crop from public/images/owned/decarb.jpg
 * for the homepage Decarbonization card. Keeps LNG tank / bridge in frame.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = path.join(root, "public/images/owned/decarb.jpg");
const output = path.join(root, "public/images/owned/decarb-home.jpg");

const TARGET_W = 2400;
const TARGET_H = 1800;

const rotated = await sharp(input).rotate().toBuffer();
const { width: w, height: h } = await sharp(rotated).metadata();
if (!w || !h) {
  throw new Error("Could not read decarb.jpg dimensions");
}

let cropW = w;
let cropH = Math.round((cropW * 3) / 4);
if (cropH > h) {
  cropH = h;
  cropW = Math.round((cropH * 4) / 3);
}

const left = Math.max(0, Math.round((w - cropW) / 2));
// Bias crop slightly upward so LNG tank, bridge, and hull stay in frame (4:3 card).
const top = Math.max(0, Math.min(Math.round((h - cropH) * 0.12), h - cropH));

await sharp(rotated)
  .extract({ left, top, width: cropW, height: cropH })
  .resize(TARGET_W, TARGET_H, { fit: "inside", withoutEnlargement: true })
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(output);

const outMeta = await sharp(output).metadata();
console.log(
  `Source (oriented): ${w}×${h} → crop ${cropW}×${cropH} @ (${left},${top}) → ${outMeta.width}×${outMeta.height}`,
);
