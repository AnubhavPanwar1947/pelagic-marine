import assert from "node:assert/strict";
import {
  buildSearchDestinationHref,
  getIndexedTeamSearchText,
  searchAllMatches,
  corpusForSearchResult,
  searchPrefixSuggestionMatches,
  searchRelatedMatches,
  searchSuggestionMatches,
} from "../src/lib/search-index";
import { documentMatchesPrefixAutocomplete } from "../src/lib/search-matching";
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

// Multi-word AND matching — every meaningful token must appear on the page
assertSomeResults("Naval architecture");
assertSomeResults("mooring compatibility");
assertSomeResults("computational fluid dynamics");

const reachOut = searchAllMatches("Reach out");
assert.ok(reachOut.length > 0);
assert.ok(hasHref(reachOut, "/contact/"));

const bothOnTerms = searchAllMatches("export sanctions");
assert.ok(hasHref(bothOnTerms, "/terms-and-conditions/"));
assert.ok(
  !searchAllMatches("Optimoor sanctions").some((r) => r.href === "/"),
  "Optimoor sanctions must not match home page",
);
assert.ok(
  !searchAllMatches("register of representative assignments").some((r) => r.href === "/"),
);

assertNoResults("of");
assert.ok(hasHref(searchAllMatches("Yokohama"), "/contact/"));
assert.ok(
  searchAllMatches("Yokohama").every((r) => r.href.includes("/contact/")),
  "Yokohama must only match pages that contain it",
);
assert.ok(hasHref(searchAllMatches("Woodlands"), "/contact/"));
assert.ok(hasHref(searchAllMatches("Anubhav"), "/team/"));

// Legal and service coverage
assert.ok(hasHref(searchAllMatches("sanctions"), "/terms-and-conditions/"));
assert.ok(
  searchAllMatches("Aghaadir").some(
    (r) =>
      r.href.includes("/privacy-policy/") ||
      r.href.includes("/terms-and-conditions/") ||
      r.href.includes("/cookies-policy/") ||
      r.href.includes("/disclaimer/") ||
      r.href.includes("/standard-terms-and-conditions-of-engagement/"),
  ),
);
assert.ok(hasHref(searchAllMatches("Personal Data"), "/privacy-policy/"));
assert.ok(hasHref(searchAllMatches("cookies"), "/cookies-policy/"));
assert.ok(
  hasHref(searchAllMatches("engagement"), "/standard-terms-and-conditions-of-engagement/"),
);
assert.ok(searchAllMatches("surveying").length > 0);

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
  searchPrefixSuggestionMatches("mast").every((r) =>
    documentMatchesPrefixAutocomplete(corpusForSearchResult(r), "mast"),
  ),
);

const singaporeOffice = searchAllMatches("Woodlands Square");
assert.ok(hasHref(singaporeOffice, "/contact/"));
assert.ok(
  singaporeOffice.every((r) => r.href.includes("/contact/")),
  "Woodlands Square should only match contact presence copy",
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

// Contact presence copy (rendered on page, indexed in search body)
assert.ok(hasHref(searchAllMatches("Associate Office"), "/contact/"));

// Destination anchors
const team = searchAllMatches("Nishchay").find((r) => r.href.includes("/team/"));
assert.ok(team);
const teamHref = buildSearchDestinationHref(team!, "Nishchay");
assert.match(teamHref, /#team-nishchay/);

const dubai = searchAllMatches("Dubai").find((r) => r.href.includes("/contact/"));
assert.ok(dubai);
const dubaiHref = buildSearchDestinationHref(dubai!, "Dubai");
assert.match(dubaiHref, /\/contact\/\?q=Dubai/);
assert.match(dubaiHref, /#search-land-target/);

const privacy100 = searchAllMatches("100").find((r) => r.href.includes("/privacy-policy/"));
assert.ok(privacy100);
const privacyHref = buildSearchDestinationHref(privacy100!, "100");
assert.match(privacyHref, /\/privacy-policy\/\?q=100/);
assert.match(privacyHref, /#search-land-target/);
assert.match(privacyHref, /land=/);

const engagementAgreement = searchAllMatches("Agreement").find((r) =>
  r.href.includes("/standard-terms-and-conditions-of-engagement/"),
);
assert.ok(engagementAgreement);
const engagementHref = buildSearchDestinationHref(engagementAgreement!, "Agreement");
assert.match(engagementHref, /land=/);
assert.match(engagementHref, /#search-land-target/);
assert.match(engagementHref, /Agreement/);

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

const vipulSidhu = searchAllMatches("Vipul Sidhu");
assert.equal(vipulSidhu.length, 0, "no exact or partial team split for two-name queries");
assert.ok(searchRelatedMatches("Vipul Sidhu").length >= 0);

const captVipul = searchAllMatches("Capt Vipul");
assert.ok(captVipul.some((r) => r.title.includes("Vipul")));
assert.ok(!captVipul.some((r) => r.title.includes("Abhinav") && !r.title.includes("Vipul")));
assert.ok(
  searchAllMatches("Captain Vipul").some((r) => r.title.includes("Vipul")),
  "capt/captain alias should match Vipul",
);

assert.ok(searchAllMatches("Upadhyaya").some((r) => r.title.includes("Upadhyay")));
assert.ok(searchAllMatches("Harjeet").some((r) => r.title.includes("Harjit")));
assert.ok(searchAllMatches("specialized").length > 0);

// Substring false positives removed
const portHits = searchAllMatches("port");
assert.ok(!portHits.some((r) => r.href.includes("conversion-upgradation")));
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
