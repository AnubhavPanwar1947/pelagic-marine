import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import sharp from "sharp";

const svgPath = path.join(
  process.cwd(),
  "public/images/icons/naval-architecture.svg",
);
const headSvg = execSync(
  `git show HEAD:public/images/icons/naval-architecture.svg`,
  { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
);

async function extractPngs(svg) {
  return [...svg.matchAll(/data:image\/png;base64,([^"]+)/g)].map((m) =>
    Buffer.from(m[1], "base64"),
  );
}

const samples = [
  { layer: 0, x: 280, y: 470, label: "blue band L0" },
  { layer: 0, x: 360, y: 472, label: "blue band L0" },
  { layer: 1, x: 280, y: 470, label: "blue band L1" },
  { layer: 1, x: 360, y: 472, label: "blue band L1" },
];

const before = await extractPngs(headSvg);
const after = await extractPngs(fs.readFileSync(svgPath, "utf8"));

for (const s of samples) {
  const { data, info } = await sharp(before[s.layer]).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  const i = (s.y * info.width + s.x) * 4;
  const b = [data[i], data[i + 1], data[i + 2], data[i + 3]];
  const { data: data2 } = await sharp(after[s.layer]).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  const j = (s.y * info.width + s.x) * 4;
  const a = [data2[j], data2[j + 1], data2[j + 2], data2[j + 3]];
  const same = b.every((v, k) => v === a[k]);
  console.log(s.label, `(${s.x},${s.y})`, same ? "UNCHANGED" : "CHANGED", "before", b, "after", a);
}
