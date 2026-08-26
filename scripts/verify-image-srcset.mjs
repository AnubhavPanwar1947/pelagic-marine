/**
 * Verifies responsive image srcset selection at common viewport widths.
 * Run: node scripts/verify-image-srcset.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Load manifest by parsing the generated TS file
const manifestPath = path.join(ROOT, "src/lib/image-manifest.generated.ts");
const manifestSrc = readFileSync(manifestPath, "utf8");
const manifestMatch = manifestSrc.match(/export const imageManifest[^=]*=\s*(\{[\s\S]*\});/);
if (!manifestMatch) {
  console.error("Could not parse image manifest");
  process.exit(1);
}
const manifest = JSON.parse(manifestMatch[1]);

const VIEWPORTS = [280, 320, 360, 390, 414, 768, 844, 1024, 1280, 1440];

const SIZES = {
  hero: "100vw",
  contentHalf:
    "(max-width: 1023px) calc(100vw - 2rem), min(36rem, calc((min(100vw, 80rem) - 4rem) / 2))",
  projectCard:
    "(max-width: 1023px) calc(100vw - 2rem), min(24rem, calc((min(100vw, 80rem) - 4rem) / 3))",
  newsCard: "(max-width: 767px) calc(100vw - 2rem), 280px",
  sectorCard:
    "(max-width: 767px) calc(100vw - 2rem), min(22rem, calc((min(100vw, 80rem) - 4rem) / 2))",
  teamPortrait: "(max-width: 639px) calc(100vw - 2rem), 184px",
};

function parseSizes(sizes, viewportWidth) {
  const parts = sizes.split(",").map((p) => p.trim());
  for (const part of parts) {
    const match = part.match(/^\(max-width:\s*(\d+)px\)\s+(.+)$/);
    if (match) {
      const [, max, value] = match;
      if (viewportWidth <= Number(max)) {
        return evaluateSize(value, viewportWidth);
      }
      continue;
    }
    return evaluateSize(part, viewportWidth);
  }
  return viewportWidth;
}

function evaluateSize(expr, viewportWidth) {
  expr = expr.trim();
  if (expr === "100vw") return viewportWidth;
  if (expr === "0px") return 0;
  if (expr.endsWith("px")) return Number(expr.replace("px", ""));
  if (expr.includes("calc(")) {
    // Simplified eval for our known calc patterns
    const container = Math.min(viewportWidth, 1280); // 80rem
    const padding = viewportWidth <= 639 ? 32 : 64;
    if (expr.includes("/ 2")) {
      return Math.min(576, (container - padding) / 2);
    }
    if (expr.includes("/ 3")) {
      return Math.min(384, (container - padding) / 3);
    }
    if (expr.includes("100vw - 2rem")) {
      return viewportWidth - 32;
    }
    if (expr.includes("100vw - 4rem")) {
      return viewportWidth - 64;
    }
  }
  if (expr.includes("min(36rem")) return Math.min(576, viewportWidth / 2);
  if (expr.includes("min(24rem")) return Math.min(384, viewportWidth / 3);
  if (expr.includes("min(22rem")) return Math.min(352, viewportWidth / 2);
  return viewportWidth;
}

function pickVariant(variants, slotWidth) {
  const sorted = [...variants].sort((a, b) => a.width - b.width);
  let chosen = sorted[0];
  for (const v of sorted) {
    if (v.width >= slotWidth) {
      chosen = v;
      break;
    }
    chosen = v;
  }
  return chosen;
}

function verifyImage(label, src, sizesExpr) {
  const entry = manifest[src];
  if (!entry) {
    console.log(`\n${label}: REMOTE (${src.slice(0, 60)}…)`);
    return;
  }
  console.log(`\n${label}: ${src} (source ${entry.width}x${entry.height})`);
  for (const vw of VIEWPORTS) {
    const slot = parseSizes(sizesExpr, vw);
    const webp = pickVariant(entry.webp, slot);
    const noUpscale = webp.width <= entry.width;
    console.log(
      `  ${String(vw).padStart(4)}px → slot ${Math.round(slot)}px → ${webp.path.split("/").pop()} (${webp.width}w)${noUpscale ? "" : " ⚠️ UPSCALE"}`,
    );
  }
}

console.log("=== Responsive image srcset verification ===");
verifyImage("Homepage hero", "/images/home-page-hero-.jpg", SIZES.hero);
verifyImage("Content half", "/images/home-page-hero-.jpg", SIZES.contentHalf);
verifyImage("Decarbonization", "/images/decarbonization.jpg", SIZES.contentHalf);
verifyImage("Team portrait", "/images/team/abhinav.png", SIZES.teamPortrait);
verifyImage("Project card (local hero-port)", "/images/hero-port.jpg", SIZES.projectCard);
