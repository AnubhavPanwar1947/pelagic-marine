import assert from "node:assert/strict";
import { getSearchIndexRouteAudit, searchAllMatches } from "../src/lib/search-index";
import { REMOVED_SITE_ROUTES, getSiteRouteHrefs, normalizeSiteHref } from "../src/lib/site-routes";

const audit = getSearchIndexRouteAudit();

assert.equal(audit.orphanedIndex.length, 0, `orphaned index: ${audit.orphanedIndex.join(", ")}`);
assert.equal(
  audit.missingFromIndex.length,
  0,
  `missing from index: ${audit.missingFromIndex.join(", ")}`,
);

const indexedSet = new Set(audit.indexed.map(normalizeSiteHref));
for (const removed of REMOVED_SITE_ROUTES) {
  assert.ok(!indexedSet.has(removed), `removed route still indexed: ${removed}`);
}

function assertNoRemovedRouteHits(query: string) {
  for (const result of searchAllMatches(query)) {
    const href = normalizeSiteHref(result.href);
    assert.ok(
      !REMOVED_SITE_ROUTES.includes(href as (typeof REMOVED_SITE_ROUTES)[number]),
      `"${query}" must not link to removed route ${href}`,
    );
  }
}

assertNoRemovedRouteHits("careers");
assertNoRemovedRouteHits("projects");
assertNoRemovedRouteHits("login");
assertNoRemovedRouteHits("decarbonization");
assertNoRemovedRouteHits("Naval Architecture");
assertNoRemovedRouteHits("Engineering");
assertNoRemovedRouteHits("Inspection");
assertNoRemovedRouteHits("Mooring");
assertNoRemovedRouteHits("Loadicator");

assert.equal(searchAllMatches("of").length, 0);

const siteCount = getSiteRouteHrefs().length;
assert.equal(audit.indexed.length, siteCount);
assert.equal(new Set(audit.indexed).size, siteCount, "indexed URLs must be unique");

console.log(`search-branch-routes.test.ts: ${siteCount} routes, all assertions passed`);
