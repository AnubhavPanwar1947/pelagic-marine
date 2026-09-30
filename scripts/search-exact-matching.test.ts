import assert from "node:assert/strict";
import {
  buildSearchDestinationHref,
  getIndexedTeamSearchText,
  searchAllMatches,
  searchPrefixSuggestionMatches,
  searchRelatedMatches,
  searchSuggestionMatches,
} from "../src/lib/search-index";
import { getTeamPageSearchFieldValues, teamMembers } from "../src/lib/team-page-content";
import { teamMemberAnchorId } from "../src/lib/search-slugs";
import { normalizeSearchText } from "../src/lib/search-matching";
import {
  containsExactPhrase,
  containsExactToken,
  documentMatchesQuery,
  parseSearchQuery,
} from "../src/lib/search-matching";

function hasHref(results: ReturnType<typeof searchAllMatches>, part: string): boolean {
  return results.some((item) => item.href.includes(part));
}

function assertNoResults(query: string) {
  const results = searchAllMatches(query);
  assert.equal(results.length, 0, `expected no results for "${query}", got ${results.length}`);
}

function assertSomeResults(query: string) {
  const results = searchAllMatches(query);
  assert.ok(results.length > 0, `expected results for "${query}"`);
}

// Single-word exact
assertSomeResults("Optimoor");
assertSomeResults("OrcaFlex");
assertSomeResults("Loadicator");
assertSomeResults("Dubai");
assertSomeResults("LNG");

// Case-insensitive
assert.equal(searchAllMatches("optimoor").length, searchAllMatches("Optimoor").length);

// Technical term normalization
assertSomeResults("UMISTAB");
assertSomeResults("UMISTAB-X");
assertSomeResults("umistab x");

// Multi-word AND
assertSomeResults("Naval architecture");
assertSomeResults("mooring compatibility");
assertSomeResults("computational fluid dynamics");

// Missing word should not match
assertNoResults("naval zeppelin");
assertNoResults("optimoor underwater basket");

// Typo must not fuzzy-match surveying
assertNoResults("survying");

// Quoted phrase must be contiguous
const phraseOnlySeparate = documentMatchesQuery("naval design and architecture studies", {
  requiredPhrases: ["naval architecture"],
  tokens: [],
  normalizedTrimmed: "naval architecture",
});
assert.equal(phraseOnlySeparate, false);
assert.equal(
  containsExactPhrase("our naval architecture practice", "naval architecture"),
  true,
);

const quotedResults = searchAllMatches('"naval architecture"');
assert.ok(quotedResults.length > 0);
assert.ok(quotedResults.some((r) => r.title.toLowerCase().includes("naval")));

// Punctuation / ampersand in index content
assertSomeResults("Mooring & compatibility");

// Quality management on contact accreditations
assert.ok(hasHref(searchAllMatches("Quality management"), "/contact/"));

// Destination anchors
const team = searchAllMatches("Nishchay").find((r) => r.href.includes("/team/"));
assert.ok(team);
const teamHref = buildSearchDestinationHref(team!, "Nishchay");
assert.match(teamHref, /#team-nishchay/);

const dubai = searchAllMatches("Dubai").find((r) => r.href.includes("/contact/"));
assert.ok(dubai);
const dubaiHref = buildSearchDestinationHref(dubai!, "Dubai");
assert.match(dubaiHref, /#office-dubai/);

// Parse query
const parsed = parseSearchQuery('naval  "fluid dynamics"');
assert.deepEqual(parsed.requiredPhrases, ["fluid dynamics"]);
assert.ok(parsed.tokens.includes("naval"));

// Team page coverage
assert.ok(hasHref(searchAllMatches("Team"), "/team/"));
assert.ok(hasHref(searchAllMatches("Master Mariners"), "/team/"));
assert.ok(hasHref(searchAllMatches("naval architects"), "/team/"));
assert.ok(hasHref(searchAllMatches('"Work with the people"'), "/team/"));
assert.ok(hasHref(searchAllMatches("Contact the team"), "/team/"));
assert.ok(!hasHref(searchAllMatches("naval unrelatedword"), "/team/"));

for (const member of teamMembers) {
  const first = member.name.replace(/^Capt\.\s*/i, "").split(/\s+/)[0]!;
  assert.ok(
    hasHref(searchAllMatches(first), "/team/"),
    `expected /team/ for member token ${first}`,
  );
  const href = buildSearchDestinationHref(
    searchAllMatches(first).find((r) => r.href.includes("/team/"))!,
    first,
  );
  assert.match(href, new RegExp(`#${teamMemberAnchorId(member.name)}`));
}

const nishSuggestions = searchSuggestionMatches("Nish");
assert.ok(nishSuggestions.some((r) => r.href.includes("/team/")));
assert.ok(searchSuggestionMatches("Bh").some((r) => r.href.includes("/team/")));
assert.equal(searchSuggestionMatches("Optimoor").length, searchAllMatches("Optimoor").length);

const indexedTeam = normalizeSearchText(getIndexedTeamSearchText());
for (const field of getTeamPageSearchFieldValues()) {
  const normalizedField = normalizeSearchText(field);
  assert.ok(
    indexedTeam.includes(normalizedField),
    `Team index missing field: ${field.slice(0, 48)}…`,
  );
}

// Baseline regressions: entity-level team results
const vipul = searchAllMatches("Vipul")[0];
assert.ok(vipul);
assert.match(vipul.title, /Vipul Negi/);
assert.equal(vipul.category, "Team member");

const opsMgr = searchAllMatches("Operations Manager")[0];
assert.ok(opsMgr);
assert.match(opsMgr.title, /Harjit|Sidhu/);

const headEng = searchAllMatches("Head of Engineering")[0];
assert.ok(headEng);
assert.match(headEng.title, /Bhanu/);

assertNoResults("Vipul Sidhu");
assert.ok(searchRelatedMatches("Vipul Sidhu").length >= 2);

assertNoResults("Captain Vipul");
const captainRelated = searchRelatedMatches("Captain Vipul");
assert.ok(captainRelated.some((r) => r.title.includes("Vipul")));
assert.ok(!captainRelated.some((r) => r.title.includes("Abhinav") && !r.title.includes("Vipul")));

assertNoResults("Upadhyaya");
assert.ok(searchRelatedMatches("Upadhyaya").some((r) => r.title.includes("Upadhyay")));

assertNoResults("Harjeet");
assert.ok(searchRelatedMatches("Harjeet").some((r) => r.title.includes("Harjit")));

assertNoResults("specialized");
assert.ok(searchRelatedMatches("specialized").length > 0);

// Substring false positives removed
const portHits = searchAllMatches("port");
assert.ok(!portHits.some((r) => r.href.includes("service-conversion")));
assert.equal(documentMatchesQuery("technical support only", parseSearchQuery("port")), false);

// Prefix suggestions without exact empty-state conflict
assert.equal(searchAllMatches("Vip").length, 0);
assert.ok(searchPrefixSuggestionMatches("Vip").some((r) => r.title.includes("Vipul")));
assert.equal(searchAllMatches("Ha").length, 0);
assert.ok(searchPrefixSuggestionMatches("Ha").length > 0);

console.log("search-exact-matching.test.ts: all assertions passed");
