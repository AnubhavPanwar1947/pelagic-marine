/**
 * One-off: engineering.svg uses an embedded PNG with a white matte.
 * Set fully white pixels to transparent so the service card background shows through.
 */
import fs from "fs";
import sharp from "sharp";

const path = "public/images/icons/engineering.svg";
const svg = fs.readFileSync(path, "utf8");
const m = svg.match(
  /(<image[^>]*xlink:href=")data:image\/png;base64,([^"]+)("[^>]*\/>)/,
);
if (!m) {
  console.error("embedded PNG not found");
  process.exit(1);
}

const buf = Buffer.from(m[2], "base64");
const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  if (r > 250 && g > 250 && b > 250) {
    data[i + 3] = 0;
  }
}

const outPng = await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toBuffer();

const newSvg = svg.replace(
  m[0],
  `${m[1]}data:image/png;base64,${outPng.toString("base64")}${m[3]}`,
);
fs.writeFileSync(path, newSvg);
console.log("Updated", path, "PNG bytes", outPng.length);
