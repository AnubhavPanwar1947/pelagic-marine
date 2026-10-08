import assert from "node:assert/strict";
import { buildAboutPageSearchBody } from "../src/lib/page-search-content";
import { searchAllMatches } from "../src/lib/search-index";
const aboutBody = buildAboutPageSearchBody();

assert.ok(
  aboutBody.includes("experienced master mariners, naval architects, and engineers"),
  "about search body must include new sentence",
);
assert.ok(
  !aboutBody.includes("experienced Master Mariners"),
  "about search body must not index old Master Mariners wording",
);
assert.ok(
  !aboutBody.includes("The core team consists of experienced Master Mariners"),
  "about search body must not index old core team sentence",
);

function aboutHits(query: string) {
  return searchAllMatches(query).some((r) => r.href.includes("/about"));
}

assert.ok(aboutHits("naval architects"), "naval architects must match about");
assert.ok(aboutHits("engineers"), "engineers must match about");

console.log("about-hero-search.test.ts: all assertions passed");
