import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getSearchIndexHrefs } from "../src/lib/search-index";
import { LEGACY_SITE_PATH_REDIRECTS } from "../src/lib/site-route-redirects";
import { getSiteRouteHrefs } from "../src/lib/site-routes";

const forbiddenInIndex = new Set([
  "/news/",
  "/privacy/",
  "/cookies/",
  "/terms/",
  "/engagement/",
  "/news/computational-fluid-dynamics/",
]);
for (const href of getSearchIndexHrefs()) {
  assert.ok(!forbiddenInIndex.has(href), `index still uses legacy ${href}`);
}

const required = [
  "/marine-insights/",
  "/marine-insights/computational-fluid-dynamics/",
  "/privacy-policy/",
  "/cookies-policy/",
  "/terms-and-conditions/",
  "/standard-terms-and-conditions-of-engagement/",
  "/disclaimer/",
];
for (const route of required) {
  assert.ok(getSiteRouteHrefs().includes(route), `missing route ${route}`);
}

const repoRoot = path.join(import.meta.dirname, "..");
const appDir = path.join(repoRoot, "src", "app");
assert.ok(fs.existsSync(path.join(appDir, "marine-insights", "page.tsx")));
assert.ok(fs.existsSync(path.join(appDir, "privacy-policy", "page.tsx")));
assert.ok(
  fs.existsSync(
    path.join(appDir, "standard-terms-and-conditions-of-engagement", "page.tsx"),
  ),
);

const srcFiles = walk(path.join(repoRoot, "src"));
const legacyHrefPattern =
  /href=["']\/(news|privacy|cookies|terms|engagement)(\/|["'])/;
for (const file of srcFiles) {
  if (file.includes("site-route-redirects")) {
    continue;
  }
  if (file.includes(String(path.join("app", "news")))) {
    continue;
  }
  if (file.includes(String(path.join("app", "privacy", "page.tsx")))) {
    continue;
  }
  if (file.includes(String(path.join("app", "cookies", "page.tsx")))) {
    continue;
  }
  if (file.includes(String(path.join("app", "terms", "page.tsx")))) {
    continue;
  }
  if (file.includes(String(path.join("app", "engagement", "page.tsx")))) {
    continue;
  }
  const text = fs.readFileSync(file, "utf8");
  assert.ok(!legacyHrefPattern.test(text), `legacy href in ${file}`);
}

assert.ok(Object.keys(LEGACY_SITE_PATH_REDIRECTS).length >= 12);

console.log("blog-legal-url-migration.test.ts: all assertions passed");

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      out.push(full);
    }
  }
  return out;
}
