import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const svgPath = path.join(
  process.cwd(),
  "public/images/icons/naval-architecture.svg",
);
const svg = fs.readFileSync(svgPath, "utf8");

console.log("=== SVG structure ===");
console.log({
  bytes: svg.length,
  viewBox: svg.match(/viewBox="([^"]+)"/)?.[1],
  preserveAspectRatio: svg.match(/preserveAspectRatio="([^"]+)"/)?.[1],
  width: svg.match(/\bwidth="([^"]+)"/)?.[1],
  height: svg.match(/\bheight="([^"]+)"/)?.[1],
  imageTags: (svg.match(/<image/g) || []).length,
  pngEmbeds: (svg.match(/data:image\/png;base64,/g) || []).length,
  vectorLines: (svg.match(/<line\b/g) || []).length,
  vectorPaths: (svg.match(/<path\b/g) || []).length,
  hasMask: /<mask\b/.test(svg),
  hasClipPath: /<clipPath\b/.test(svg),
});

const pathSnippet = svg.indexOf("<path");
if (pathSnippet >= 0) {
  console.log("first <path> (clip/mask context):", svg.slice(pathSnippet, pathSnippet + 120));
}

const pngs = [...svg.matchAll(/data:image\/png;base64,([^"]+)/g)];
console.log("identical PNG data:", pngs.length === 2 && pngs[0][1] === pngs[1][1]);

function findRuns(data, width, y, minLen = 8) {
  const runs = [];
  let start = null;
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    const hair = a > 150 && Math.max(r, g, b) < 120;
    if (hair) {
      if (start === null) start = x;
    } else if (start !== null) {
      if (x - start >= minLen) runs.push([start, x - 1]);
      start = null;
    }
  }
  return runs;
}

for (let li = 0; li < pngs.length; li++) {
  const { data, info } = await sharp(Buffer.from(pngs[li][1], "base64"))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  console.log(`\n=== PNG layer ${li} ${info.width}x${info.height} ===`);
  for (const y of [492, 493, 494, 495, 496, 497, 498]) {
    const runs = findRuns(data, info.width, y);
    if (runs.length) console.log(`  y=${y} dark runs (max<120):`, runs);
  }
  const box = { x0: 248, x1: 402, y0: 493, y1: 497 };
  let dark = 0;
  for (let y = box.y0; y <= box.y1; y++) {
    for (let x = box.x0; x <= box.x1; x++) {
      const i = (y * info.width + x) * 4;
      if (data[i + 3] > 150 && Math.max(data[i], data[i + 1], data[i + 2]) < 200)
        dark++;
    }
  }
  console.log(`  bbox x248-402 y493-497 dark(max<200):`, dark);
}
