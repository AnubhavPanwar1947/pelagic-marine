import fs from "fs";
import sharp from "sharp";

const path = "public/images/icons/loadicator.svg";
const svg = fs.readFileSync(path, "utf8");
const match = svg.match(/xlink:href="data:image\/png;base64,([^"]+)"/);
if (!match) {
  console.error("No embedded PNG");
  process.exit(1);
}

const input = Buffer.from(match[1], "base64");
const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

let cleared = 0;
for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const neutral = max - min < 22;
  if (neutral && min >= 236) {
    data[i + 3] = 0;
    cleared += 1;
  } else if (neutral && min >= 210) {
    const fade = (min - 210) / 26;
    data[i + 3] = Math.round(data[i + 3] * (1 - fade));
    cleared += 1;
  } else if (neutral && max <= 16) {
    data[i + 3] = 0;
    cleared += 1;
  } else if (neutral && max <= 36) {
    const fade = (36 - max) / 20;
    data[i + 3] = Math.round(data[i + 3] * (1 - fade));
    cleared += 1;
  }
}

const png = await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toBuffer();

const corner = data[3];
const next = svg.replace(
  /xlink:href="data:image\/png;base64,[^"]+"/,
  `xlink:href="data:image/png;base64,${png.toString("base64")}"`,
);
fs.writeFileSync(path, next);
console.log({
  width: info.width,
  height: info.height,
  cleared,
  cornerAlpha: corner,
  bytes: png.length,
});
