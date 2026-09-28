import fs from "fs";
import sharp from "sharp";

const svg = fs.readFileSync("public/images/icons/loadicator.svg", "utf8");
const match = svg.match(/base64,([^"]+)/);
const buf = Buffer.from(match[1], "base64");
const { data, info } = await sharp(buf)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

function px(x, y) {
  const i = (y * info.width + x) * 4;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
}

const samples = {
  size: info,
  tl: px(0, 0),
  tr: px(info.width - 1, 0),
  bl: px(0, info.height - 1),
  br: px(info.width - 1, info.height - 1),
  n10: px(10, 10),
  center: px(Math.floor(info.width / 2), Math.floor(info.height / 2)),
};

let opaque = 0;
let whiteish = 0;
for (let i = 0; i < data.length; i += 4) {
  if (data[i + 3] > 10) opaque += 1;
  const min = Math.min(data[i], data[i + 1], data[i + 2]);
  if (data[i + 3] > 200 && min > 245) whiteish += 1;
}
const buckets = new Map();
for (let i = 0; i < data.length; i += 4) {
  if (data[i + 3] < 20) continue;
  const key = `${Math.round(data[i] / 16) * 16},${Math.round(data[i + 1] / 16) * 16},${Math.round(data[i + 2] / 16) * 16}`;
  buckets.set(key, (buckets.get(key) || 0) + 1);
}
const top = [...buckets.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
let minX = info.width;
let minY = info.height;
let maxX = 0;
let maxY = 0;
let ink = 0;
for (let y = 0; y < info.height; y += 1) {
  for (let x = 0; x < info.width; x += 1) {
    const i = (y * info.width + x) * 4;
    if (data[i + 3] < 20) continue;
    if (data[i] < 12 && data[i + 1] < 12 && data[i + 2] < 12) continue;
    ink += 1;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
}
console.log({
  ...samples,
  opaque,
  whiteish,
  pixels: info.width * info.height,
  top,
  ink,
  inkBox: { minX, minY, maxX, maxY },
});
