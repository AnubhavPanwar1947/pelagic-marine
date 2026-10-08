import fs from "node:fs";
import path from "node:path";
import { getSearchIndexRouteAudit, getSearchIndexHrefs } from "../src/lib/search-index";
import { getSiteRouteHrefs, normalizeSiteHref } from "../src/lib/site-routes";
import { getPublishedServiceItemTopics } from "../src/lib/topic-pages";

const root = path.join(import.meta.dirname, "..");
const appDir = path.join(root, "src", "app");

const allowed = new Set(getSiteRouteHrefs().map(normalizeSiteHref));
const serviceTopicSlugs = new Set(getPublishedServiceItemTopics().map((topic) => topic.slug));
const dynamicServicePage = path.join(appDir, "services", "[slug]", "page.tsx");

const missingPageFiles: string[] = [];

for (const href of allowed) {
  if (href === "/") {
    const home = path.join(appDir, "page.tsx");
    if (!fs.existsSync(home)) {
      missingPageFiles.push(href);
    }
    continue;
  }
  const segments = href.replace(/^\//, "").replace(/\/$/, "").split("/");
  if (segments[0] === "services" && segments.length === 2) {
    if (!fs.existsSync(dynamicServicePage) || !serviceTopicSlugs.has(segments[1]!)) {
      missingPageFiles.push(href);
    }
    continue;
  }
  const pageFile = path.join(appDir, ...segments, "page.tsx");
  if (!fs.existsSync(pageFile)) {
    missingPageFiles.push(href);
  }
}

const audit = getSearchIndexRouteAudit();
let failed = false;

if (missingPageFiles.length > 0) {
  failed = true;
  console.error("Site route list includes paths without page.tsx:");
  for (const href of missingPageFiles) {
    console.error(`  - ${href}`);
  }
}

if (audit.orphanedIndex.length > 0) {
  failed = true;
  console.error("Search index contains routes not in Boss Content Round 1 site routes:");
  for (const href of audit.orphanedIndex) {
    console.error(`  - ${href}`);
  }
}

if (audit.missingFromIndex.length > 0) {
  failed = true;
  console.error("Published site routes missing from search index:");
  for (const href of audit.missingFromIndex) {
    console.error(`  - ${href}`);
  }
}

if (failed) {
  process.exit(1);
}

console.log(
  `Validated ${getSearchIndexHrefs().length} indexed URLs against ${allowed.size} site routes.`,
);
