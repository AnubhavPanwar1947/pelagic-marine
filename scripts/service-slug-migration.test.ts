import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getSearchIndexHrefs } from "../src/lib/search-index";
import {
  SERVICE_SLUG_REDIRECTS,
  buildServiceSlugVercelRedirects,
} from "../src/lib/service-slug-redirects";
import { serviceCategories } from "../src/lib/site-data";

const legacyPattern = /^service-/;

for (const category of serviceCategories) {
  for (const item of category.items) {
    assert.ok(
      !legacyPattern.test(item.slug),
      `service item still uses legacy slug: ${item.slug}`,
    );
  }
}

for (const href of getSearchIndexHrefs()) {
  assert.ok(
    !href.includes("/service-"),
    `search index still references legacy path: ${href}`,
  );
}

const repoRoot = path.join(import.meta.dirname, "..");
const srcText = walkTsFiles(path.join(repoRoot, "src"))
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n");
assert.ok(
  !srcText.includes("/services/service-"),
  "src still contains /services/service- hrefs",
);

const vercel = JSON.parse(fs.readFileSync(path.join(repoRoot, "vercel.json"), "utf8"));
assert.ok(vercel.redirects.length >= Object.keys(SERVICE_SLUG_REDIRECTS).length * 2);
assert.equal(buildServiceSlugVercelRedirects().length, Object.keys(SERVICE_SLUG_REDIRECTS).length);

console.log(
  `service-slug-migration.test.ts: ${Object.keys(SERVICE_SLUG_REDIRECTS).length} redirects, all assertions passed`,
);

function walkTsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkTsFiles(full));
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      if (!full.includes("service-slug-redirects")) {
        out.push(full);
      }
    }
  }
  return out;
}
