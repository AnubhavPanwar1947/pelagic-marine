import assert from "node:assert/strict";
import { searchAllMatches } from "../src/lib/search-index";
import { REMOVED_SERVICE_CATEGORY_SLUGS } from "../src/lib/service-category-slugs";
import { getSearchIndexHrefs } from "../src/lib/search-index";
import { getSiteRouteHrefs } from "../src/lib/site-routes";

const removedPaths = REMOVED_SERVICE_CATEGORY_SLUGS.map((slug) => `/services/${slug}/`);

for (const path of removedPaths) {
  assert.ok(!getSiteRouteHrefs().includes(path), `route list still has ${path}`);
  assert.ok(!getSearchIndexHrefs().includes(path), `search index still has ${path}`);
}

function assertNoCategoryInResults(query: string) {
  for (const result of searchAllMatches(query)) {
    for (const path of removedPaths) {
      assert.notEqual(result.href, path, `"${query}" returned removed category ${path}`);
    }
  }
}

assertNoCategoryInResults("Naval Architecture");
assertNoCategoryInResults("Engineering");
assertNoCategoryInResults("Inspection");
assertNoCategoryInResults("Mooring");
assertNoCategoryInResults("Loadicator");

const engineeringHits = searchAllMatches("Engineering");
assert.ok(
  engineeringHits.some((r) => r.href === "/services/") ||
    engineeringHits.some((r) => r.href.startsWith("/services/") && !removedPaths.includes(r.href)),
  "Engineering search should return /services/ or item pages",
);

console.log(
  `service-category-removal.test.ts: ${getSiteRouteHrefs().length} routes, all assertions passed`,
);
