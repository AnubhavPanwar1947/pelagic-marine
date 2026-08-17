const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function featherMask(width, height, inset = 36, blur = 22) {
  const core = await sharp({
    create: {
      width: Math.max(1, width - inset * 2),
      height: Math.max(1, height - inset * 2),
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: core, left: inset, top: inset }])
    .blur(blur)
    .png()
    .toBuffer();
}

async function main() {
  const root = path.join(__dirname, "..");
  const original = path.join(root, "public/images/contact-hero.jpg");
  const out = path.join(root, "public/images/hero-consultant.jpg");
  const verifyDir = path.join(root, "public/images");

  const meta = await sharp(original).metadata();
  const W = meta.width;

  // Text region on ORIGINAL (person left, text readable)
  const origRegion = { left: 1080, top: 1000, width: 900, height: 250 };

  // Same region after horizontal flip
  const flippedLeft = W - origRegion.left - origRegion.width;
  const region = {
    left: flippedLeft,
    top: origRegion.top,
    width: origRegion.width,
    height: origRegion.height,
  };

  console.log("orig region", origRegion);
  console.log("flipped region", region);

  // 1) Full mirror of original
  const flippedBuf = await sharp(original).flop().toBuffer();

  // Save probe of mirrored (broken) text
  await sharp(flippedBuf)
    .extract(region)
    .jpeg({ quality: 95 })
    .toFile(path.join(verifyDir, "_step1-mirrored-text.jpg"));

  // 2) Take that mirrored text patch and flop it alone → readable again
  const textReadable = await sharp(flippedBuf)
    .extract(region)
    .flop()
    .ensureAlpha()
    .png()
    .toBuffer();

  await sharp(textReadable)
    .jpeg({ quality: 95 })
    .toFile(path.join(verifyDir, "_step2-readable-text.jpg"));

  // 3) Soft-edge mask so patch blends into suit
  const mask = await featherMask(region.width, region.height, 42, 26);
  const patched = await sharp(textReadable)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  // 4) Composite readable text onto mirrored full image
  await sharp(flippedBuf)
    .composite([{ input: patched, left: region.left, top: region.top }])
    .jpeg({ quality: 95 })
    .toFile(out);

  // 5) Verify final text area
  await sharp(out)
    .extract({
      left: Math.max(0, region.left - 30),
      top: Math.max(0, region.top - 30),
      width: region.width + 60,
      height: region.height + 60,
    })
    .jpeg({ quality: 95 })
    .toFile(path.join(verifyDir, "_step3-final-text.jpg"));

  const kb = Math.round(fs.statSync(out).size / 1024);
  const m = await sharp(out).metadata();
  console.log(`wrote ${path.basename(out)} ${m.width}x${m.height} ${kb}KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
