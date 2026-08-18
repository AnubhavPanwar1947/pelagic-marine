import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const WIDTHS = [640, 960, 1280, 1920];
const IMAGE_DIR = fileURLToPath(new URL("../public/images/", import.meta.url));
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
const VARIANT_RE = /-\d+w\.(jpe?g|png|webp)$/i;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }
    if (!IMAGE_EXT.test(entry.name) || VARIANT_RE.test(entry.name)) continue;
    files.push(fullPath);
  }

  return files;
}

async function generateVariants(filePath) {
  const relative = path.relative(IMAGE_DIR, filePath).replace(/\\/g, "/");
  const parsed = path.parse(filePath);
  const meta = await sharp(filePath).metadata();
  const sourceWidth = meta.width ?? WIDTHS[WIDTHS.length - 1];

  for (const width of WIDTHS) {
    const targetWidth = Math.min(width, sourceWidth);
    const outPath = path.join(parsed.dir, `${parsed.name}-${width}w${parsed.ext}`);

    await sharp(filePath)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .toFile(outPath);

    console.log(`Wrote images/${relative.replace(parsed.base, path.basename(outPath))}`);
  }
}

const files = await walk(IMAGE_DIR);

if (files.length === 0) {
  console.log("No source images found in public/images.");
  process.exit(0);
}

for (const filePath of files) {
  const info = await stat(filePath);
  if (!info.isFile()) continue;
  await generateVariants(filePath);
}

console.log(`Generated responsive variants for ${files.length} image(s).`);
