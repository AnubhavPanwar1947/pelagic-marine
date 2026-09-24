/**
 * Recomposite Abhinav onto studio gray from the committed source portrait.
 * Foreground matte from spatially constrained region growing (not global brightness flood-fill).
 */
import sharp from "sharp";
import { execSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scriptsDir = path.join(root, "scripts");
const targetPath = path.join(root, "public/images/owned/team/abhinav.png");
const originalCache = path.join(scriptsDir, "_abhinav-original.png");
const source480 = path.join(scriptsDir, "_abhinav-480-centre.png");
const GIT_ORIGINAL = "7aa2b96:public/images/owned/team/abhinav.png";

const W = 480;
const H = 1080;

function studioGrayAt(x, y) {
  const t = y / (H - 1);
  return {
    r: Math.round(0xc7 + (0xbe - 0xc7) * t),
    g: Math.round(0xcb + (0xc2 - 0xcb) * t),
    b: Math.round(0xd0 + (0xc7 - 0xd0) * t),
  };
}

function lum(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function chroma(r, g, b) {
  return Math.max(r, g, b) - Math.min(r, g, b);
}

if (!existsSync(originalCache)) {
  const buf = execSync(`git show ${GIT_ORIGINAL}`, { maxBuffer: 15 * 1024 * 1024 });
  writeFileSync(originalCache, buf);
}

if (!existsSync(source480)) {
  await sharp(originalCache)
    .resize(W, H, { fit: "cover", position: "centre" })
    .png()
    .toFile(source480);
}

const { data, info } = await sharp(source480).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const ch = info.channels;
const n = W * H;
const isBg = new Uint8Array(n);

function idx(x, y) {
  return y * W + x;
}

/** Near-pure white studio backdrop only (top / sides). */
function isBackdropWhite(r, g, b) {
  return lum(r, g, b) >= 253 && chroma(r, g, b) <= 8;
}

/** Original lower gray band (below shirt hem), only in bottom third. */
function isLowerGrayBand(r, g, b, y) {
  if (y < H * 0.72) return false;
  const l = lum(r, g, b);
  return l >= 148 && l <= 218 && chroma(r, g, b) <= 16;
}

const queue = [];

function seedBackdrop(x, y) {
  const i = idx(x, y);
  if (isBg[i]) return;
  const o = i * ch;
  if (!isBackdropWhite(data[o], data[o + 1], data[o + 2])) return;
  isBg[i] = 1;
  queue.push({ x, y, mode: "white" });
}

function seedLowerGray(x, y) {
  const i = idx(x, y);
  if (isBg[i]) return;
  const o = i * ch;
  if (!isLowerGrayBand(data[o], data[o + 1], data[o + 2], y)) return;
  isBg[i] = 1;
  queue.push({ x, y, mode: "gray" });
}

for (let x = 0; x < W; x++) {
  seedBackdrop(x, 0);
  seedLowerGray(x, H - 1);
}
for (let y = 0; y < H; y++) {
  seedBackdrop(0, y);
  seedBackdrop(W - 1, y);
}

while (queue.length > 0) {
  const { x, y, mode } = queue.pop();
  const neighbors = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
  for (const [nx, ny] of neighbors) {
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
    const i = idx(nx, ny);
    if (isBg[i]) continue;
    const o = i * ch;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const ok =
      mode === "white"
        ? isBackdropWhite(r, g, b)
        : isLowerGrayBand(r, g, b, ny);
    if (!ok) continue;
    isBg[i] = 1;
    queue.push({ x: nx, y: ny, mode });
  }
}

/** Foreground matte: grow from facial/hair seeds through shirt, excluding backdrop islands. */
const isFg = new Uint8Array(n);
const growQ = [];

function canJoinForeground(x, y) {
  const i = idx(x, y);
  if (isBg[i]) return false;
  const o = i * ch;
  const r = data[o];
  const g = data[o + 1];
  const b = data[o + 2];
  const l = lum(r, g, b);
  return l < 252;
}

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = idx(x, y);
    const o = i * ch;
    const l = lum(data[o], data[o + 1], data[o + 2]);
    if (l < 182 && !isBg[i]) {
      isFg[i] = 1;
      growQ.push(i);
    }
  }
}

while (growQ.length > 0) {
  const i = growQ.pop();
  const x = i % W;
  const y = (i / W) | 0;
  for (const [nx, ny] of [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ]) {
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
    const ni = idx(nx, ny);
    if (isFg[ni]) continue;
    if (!canJoinForeground(nx, ny)) continue;
    isFg[ni] = 1;
    growQ.push(ni);
  }
}

// Include remaining non-backdrop pixels (white shirt) connected to shoulders
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = idx(x, y);
    if (isBg[i] || isFg[i]) continue;
    isFg[i] = 1;
  }
}

// Drop tiny white backdrop islands not touching the face component
const labels = new Int32Array(n).fill(-1);
let nextLabel = 0;
const sizes = [];
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = idx(x, y);
    if (!isFg[i] || labels[i] !== -1) continue;
    const label = nextLabel++;
    let size = 0;
    const stack = [i];
    labels[i] = label;
    let touchesFace = false;
    while (stack.length) {
      const ci = stack.pop();
      size++;
      const cx = ci % W;
      const cy = (ci / W) | 0;
      if (cy > 200 && cy < 520 && cx > 140 && cx < 340) touchesFace = true;
      const co = ci * ch;
      if (lum(data[co], data[co + 1], data[co + 2]) < 182) touchesFace = true;
      for (const [nx, ny] of [
        [cx - 1, cy],
        [cx + 1, cy],
        [cx, cy - 1],
        [cx, cy + 1],
      ]) {
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const ni = idx(nx, ny);
        if (!isFg[ni] || labels[ni] !== -1) continue;
        labels[ni] = label;
        stack.push(ni);
      }
    }
    sizes[label] = { size, touchesFace };
  }
}

for (let i = 0; i < n; i++) {
  if (!isFg[i]) continue;
  const { size, touchesFace } = sizes[labels[i]];
  if (!touchesFace && size < 12000) isFg[i] = 0;
}

// Minimal 1px dilation on exterior boundary to keep anti-aliased collar/shirt pixels
const dilated = new Uint8Array(isFg);
for (let y = 1; y < H - 1; y++) {
  for (let x = 1; x < W - 1; x++) {
    const i = idx(x, y);
    if (isFg[i]) continue;
    let fgN = 0;
    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ]) {
      if (isFg[idx(nx, ny)]) fgN++;
    }
    if (fgN >= 2) dilated[i] = 1;
  }
}

const out = Buffer.alloc(n * ch);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = idx(x, y);
    const o = i * ch;
    const gray = studioGrayAt(x, y);
    if (dilated[i]) {
      out[o] = data[o];
      out[o + 1] = data[o + 1];
      out[o + 2] = data[o + 2];
      out[o + 3] = 255;
    } else {
      out[o] = gray.r;
      out[o + 1] = gray.g;
      out[o + 2] = gray.b;
      out[o + 3] = 255;
    }
  }
}

// Boundary cleanup: if matte edge pixel was contaminated with studio gray in source composite, prefer source
for (let y = 1; y < H - 1; y++) {
  for (let x = 1; x < W - 1; x++) {
    const i = idx(x, y);
    if (!dilated[i]) continue;
    let bgN = 0;
    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ]) {
      if (!dilated[idx(nx, ny)]) bgN++;
    }
    if (bgN === 0) continue;
    const o = i * ch;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const l = lum(r, g, b);
    if (l > 190) {
      out[o] = r;
      out[o + 1] = g;
      out[o + 2] = b;
    }
  }
}

await sharp(out, { raw: { width: W, height: H, channels: ch } }).png().toFile(targetPath);

const meta = await sharp(targetPath).metadata();
const corner = await sharp(targetPath)
  .extract({ left: 20, top: 20, width: 1, height: 1 })
  .raw()
  .toBuffer();

console.log(
  JSON.stringify(
    {
      path: targetPath,
      width: meta.width,
      height: meta.height,
      foregroundPixels: dilated.reduce((a, v) => a + v, 0),
      backgroundPixels: n - dilated.reduce((a, v) => a + v, 0),
      sampleTopLeftRgb: [corner[0], corner[1], corner[2]],
      background: "linear gradient #c7cbd0 → #bec2c7",
      source: "git 7aa2b96 centre-cropped to 480×1080",
      matte: "spatial backdrop + lower-band region grow, 1px boundary dilation",
    },
    null,
    2,
  ),
);
