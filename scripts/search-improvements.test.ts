import assert from "node:assert/strict";
import { REMOVED_SERVICE_CATEGORY_SLUGS } from "../src/lib/service-category-slugs";
import { searchAllMatches } from "../src/lib/search-index";

const removedPaths = REMOVED_SERVICE_CATEGORY_SLUGS.map((s) => `/services/${s}/`);

function assertNoRemoved(results: ReturnType<typeof searchAllMatches>) {
  for (const r of results) {
    for (const path of removedPaths) {
      assert.notEqual(r.href, path, `removed category ${path} in results`);
    }
  }
}

function hasHref(
  results: ReturnType<typeof searchAllMatches>,
  part: string,
  hash?: string,
) {
  return results.some((r) => {
    if (!r.href.includes(part)) {
      return false;
    }
    if (hash && r.anchorId !== hash && !r.href.includes(`#${hash}`)) {
      return false;
    }
    return true;
  });
}

const loadicator = searchAllMatches("the loadicator");
assert.ok(loadicator.length > 0);
assert.ok(
  hasHref(loadicator, "/services/umistab-x/") ||
    loadicator.some((r) => r.href === "/services/" && r.anchorId === "loadicator"),
);
assertNoRemoved(loadicator);

const naval = searchAllMatches("Naval Architecture");
assert.ok(hasHref(naval, "/services/"));
assert.ok(naval.length >= 2);
const servicesIdx = naval.findIndex((r) => r.href === "/services/" && !r.anchorId);
const titledBeforeHub =
  servicesIdx < 0 ||
  naval.slice(0, servicesIdx).some((r) =>
    r.title.toLowerCase().includes("naval"),
  );
assert.ok(titledBeforeHub, "title/section match should rank above Services hub when present");
assertNoRemoved(naval);

const fea = searchAllMatches("FEA");
assert.ok(hasHref(fea, "/services/finite-element-analysis/"));
assertNoRemoved(fea);

const cfd = searchAllMatches("CFD");
assert.ok(hasHref(cfd, "/services/computational-fluid-dynamics/"));
assert.ok(hasHref(cfd, "/marine-insights/computational-fluid-dynamics/"));
assertNoRemoved(cfd);

const mooringOnly = searchAllMatches("mooring");
assert.ok(mooringOnly.length > 0);
assertNoRemoved(mooringOnly);

const loadicatorOnly = searchAllMatches("loadicator");
assert.ok(loadicatorOnly.length > 0);
assertNoRemoved(loadicatorOnly);

assert.equal(searchAllMatches("surveys").length, searchAllMatches("survey").length);
assert.equal(searchAllMatches("of").length, 0);

console.log("search-improvements.test.ts: all assertions passed");
