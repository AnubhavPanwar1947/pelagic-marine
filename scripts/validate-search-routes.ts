import fs from "node:fs";
import path from "node:path";
import { getSearchIndexHrefs } from "../src/lib/search-index";
import { getAllCapabilityTopics, getAllServiceTopics } from "../src/lib/topic-pages";

const root = path.join(import.meta.dirname, "..");
const appDir = path.join(root, "src", "app");

const staticRoutes = new Set<string>([
  "/",
  "/about/",
  "/services/",
  "/capabilities/",
  "/sectors/",
  "/decarbonization/",
  "/news/",
  "/news/computational-fluid-dynamics/",
  "/team/",
  "/careers/",
  "/contact/",
  "/login/",
  "/privacy/",
  "/disclaimer/",
  "/cookies/",
  "/terms/",
  "/engagement/",
  "/search/",
]);

for (const topic of getAllServiceTopics()) {
  staticRoutes.add(`/services/${topic.slug}/`);
}

for (const topic of getAllCapabilityTopics()) {
  staticRoutes.add(`/capabilities/${topic.slug}/`);
}

function normalize(href: string): string {
  if (href === "/") {
    return "/";
  }
  const clean = href.split("#")[0].split("?")[0];
  return clean.endsWith("/") ? clean : `${clean}/`;
}

const missing: string[] = [];

for (const href of getSearchIndexHrefs()) {
  const normalized = normalize(href);
  if (staticRoutes.has(normalized)) {
    continue;
  }
  const segments = normalized.replace(/^\//, "").replace(/\/$/, "").split("/");
  const pageFile = path.join(appDir, ...segments, "page.tsx");
  if (!fs.existsSync(pageFile)) {
    missing.push(normalized);
  }
}

if (missing.length > 0) {
  console.error("Search index contains routes without pages:");
  for (const href of missing) {
    console.error(`  - ${href}`);
  }
  process.exit(1);
}

console.log(`Validated ${getSearchIndexHrefs().length} search index routes.`);
