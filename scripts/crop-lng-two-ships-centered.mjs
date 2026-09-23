import fs from "fs";
import path from "path";
import sharp from "sharp";

const srcArg = process.argv[2];
if (!srcArg) {
  console.error("Usage: node scripts/crop-lng-two-ships-centered.mjs <source.jpg>");
  process.exit(1);
}
const src = path.resolve(srcArg);
const out = path.join(
  process.cwd(),
  "public",
  "images",
  "stock",
  "lng-carrier-two-ships-centered.jpg",
);

const meta = await sharp(src).metadata();
const { width, height } = meta;

// Centre crop: trim sky and lower foreground deck; keep full width so neither vessel is clipped.
const cropHeightRatio = 0.72;
const cropHeight = Math.round(height * cropHeightRatio);
const top = Math.round((height - cropHeight) / 2);
const left = 0;
const cropWidth = width;

await fs.promises.mkdir(path.dirname(out), { recursive: true });

await sharp(src)
  .extract({ left, top, width: cropWidth, height: cropHeight })
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(out);

const outMeta = await sharp(out).metadata();
console.log(
  `source ${width}x${height} -> crop left=${left} top=${top} ${cropWidth}x${cropHeight}`,
);
console.log(`wrote ${out} (${outMeta.width}x${outMeta.height})`);
