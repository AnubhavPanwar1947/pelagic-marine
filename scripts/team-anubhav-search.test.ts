import assert from "node:assert/strict";
import { searchAllMatches } from "../src/lib/search-index";

function teamHits(query: string) {
  return searchAllMatches(query).some((r) => r.href.includes("/team"));
}

assert.ok(teamHits("Anubhav Panwar"), "Anubhav Panwar must match team");
assert.ok(teamHits("Digital Solutions"), "Digital Solutions must match team");
assert.ok(teamHits("Flutter"), "Flutter must match team");

console.log("team-anubhav-search.test.ts: all assertions passed");
