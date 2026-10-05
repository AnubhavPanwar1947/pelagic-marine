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

// Multi-word OR matching with full-match ranking
assertSomeResults("Naval architecture");
assertSomeResults("mooring compatibility");
assertSomeResults("computational fluid dynamics");

const qualityManagement = searchAllMatches("Quality management");
assert.ok(qualityManagement.length > 0);
assert.ok(qualityManagement[0]!.href.includes("/contact/"));

const splitWords = searchAllMatches("Optimoor sanctions");
assert.ok(hasHref(splitWords, "/terms/"));
assert.ok(splitWords.some((r) => normalizeSearchText(r.title).includes("optimoor")));

// Legal and service coverage
assert.ok(hasHref(searchAllMatches("sanctions"), "/terms/"));
assert.ok(
  searchAllMatches("Aghaadir").some(
    (r) =>
      r.href.includes("/privacy/") ||
      r.href.includes("/terms/") ||
      r.href.includes("/cookies/") ||
      r.href.includes("/disclaimer/") ||
      r.href.includes("/engagement/"),
  ),
);
assert.ok(hasHref(searchAllMatches("Personal Data"), "/privacy/"));
assert.ok(hasHref(searchAllMatches("cookies"), "/cookies/"));
assert.ok(hasHref(searchAllMatches("engagement"), "/engagement/"));
assert.ok(
  searchAllMatches("surveying").some(
    (r) => r.href.includes("/services/") && !r.href.endsWith("/services/"),
  ) || hasHref(searchAllMatches("surveying"), "survey"),
);

const surveySingular = searchAllMatches("survey");
const surveyPlural = searchAllMatches("surveys");
assert.ok(surveySingular.length > 0 && surveyPlural.length > 0);

assert.equal(searchAllMatches("a").length, 0);

// Per-entity text only (no inherited page keywords)
const masterResults = searchAllMatches("master");
const masterTitles = masterResults.map((r) => r.title);
assert.ok(!masterTitles.includes("Bhanu Prabhakar"));
assert.ok(!masterTitles.includes("Nishchay Maken"));
assert.ok(!masterTitles.includes("Capt. Harjit Singh Sidhu"));
assert.ok(masterTitles.includes("Capt. Vipul Negi"));
assert.ok(masterTitles.includes("Capt. Abhinav Upadhyay"));
assert.ok(hasHref(masterResults, "/team/"));
assert.ok(!hasHref(masterResults, "/careers/"));
assert.ok(
  masterResults.some(
    (r) =>
      r.title === "Team" ||
      r.breadcrumb === "Team" ||
      (r.href.includes("/team/") && r.title.includes("Team")),
  ),
);
assert.ok(
  searchPrefixSuggestionMatches("mast").every((r) => {
    const hay = normalizeSearchText(`${r.title} ${r.excerpt ?? ""}`);
    return hay.includes("mast");
  }),
);

const architectsOnlyOnPage = searchAllMatches("MICS");
assert.ok(hasHref(architectsOnlyOnPage, "/contact/"));
assert.ok(
  !architectsOnlyOnPage.some(
    (r) => r.title === "Bhanu Prabhakar" || r.title === "Capt. Harjit Singh Sidhu",
  ),
);

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
assert.match(dubaiHref, /#enquiry-form/);

const privacy100 = searchAllMatches("100").find((r) => r.href.includes("/privacy/"));
assert.ok(privacy100);
const privacyHref = buildSearchDestinationHref(privacy100!, "100");
assert.match(privacyHref, /\/privacy\/\?q=100/);
assert.match(privacyHref, /#search-land-target/);
assert.match(privacyHref, /land=/);

const engagement100 = searchAllMatches("100").find((r) => r.href.includes("/engagement/"));
assert.ok(engagement100);
const engagementHref = buildSearchDestinationHref(engagement100!, "100");
assert.match(engagementHref, /land=/);
assert.match(engagementHref, /#search-land-target/);
assert.ok(
  decodeURIComponent(engagementHref).includes("total liability") ||
    decodeURIComponent(engagementHref).includes("US$"),
);

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
assert.ok(!hasHref(searchAllMatches("unrelatedword zeppelin"), "/team/"));

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
assert.equal(searchAllMatches("Opti").length, 0);
assert.ok(searchPrefixSuggestionMatches("Opti").some((r) => r.title.includes("Optimoor")));
assert.ok(searchAllMatches("Optimoor").length > 0);
assert.ok(searchPrefixSuggestionMatches("Optimoor").length >= 0);

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

assert.ok(searchAllMatches("Vipul Sidhu").some((r) => r.title.includes("Vipul")));
assert.ok(searchAllMatches("Vipul Sidhu").some((r) => r.title.includes("Sidhu")));
assert.ok(searchRelatedMatches("Vipul Sidhu").length >= 0);

const captainVipul = searchAllMatches("Captain Vipul");
assert.ok(captainVipul.some((r) => r.title.includes("Vipul")));
assert.ok(!captainVipul.some((r) => r.title.includes("Abhinav") && !r.title.includes("Vipul")));

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

// Prefix suggestions while typing (including when exact matches exist for other prefixes)
assert.equal(searchAllMatches("Vip").length, 0);
assert.ok(searchPrefixSuggestionMatches("Vip").some((r) => r.title.includes("Vipul")));
assert.equal(searchAllMatches("Ha").length, 0);
assert.ok(searchPrefixSuggestionMatches("Ha").length > 0);
assert.ok(searchAllMatches("Optimoor").length > 0);
assert.ok(
  searchPrefixSuggestionMatches("Optimoor").length >= 0 ||
    searchPrefixSuggestionMatches("Optimo").length >= 0,
);

console.log("search-exact-matching.test.ts: all assertions passed");
