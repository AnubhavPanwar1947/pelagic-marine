/**
 * Search excerpt invariant tests.
 * Run: npx tsx scripts/test-search-excerpts.js
 *
 * After legal page copy changes, regenerate index text:
 *   npm run generate:legal-search-text
 * Indexed vs rendered drift: npx tsx scripts/search-index-drift.js
 */
import assert from "node:assert/strict";
import { REMOVED_SERVICE_CATEGORY_SLUGS } from "../src/lib/service-category-slugs.ts";
import {
  collectFieldVocabulary,
  getSearchEntitiesSnapshot,
  searchAllMatches,
  searchPrefixSuggestionMatches,
  searchSuggestionMatches,
  splitTextByHighlights,
} from "../src/lib/search-index.ts";
import { highlightTermsForExcerpt } from "../src/lib/search-excerpt.ts";
import {
  isSearchStopWord,
  meaningfulTokensFromParsed,
  parseSearchQuery,
} from "../src/lib/search-matching.ts";

const REMOVED = REMOVED_SERVICE_CATEGORY_SLUGS.map((s) => `/services/${s}/`);

function normHref(href) {
  if (!href || href === "/") return href === "/" ? "/" : href;
  return href.endsWith("/") ? href : `${href}/`;
}

function hasHighlightedPart(parts) {
  return parts.some((p) => p.highlight && p.text.trim().length > 0);
}

function textHasVisibleHighlight(text, query) {
  if (!text) {
    return false;
  }
  if (hasHighlightedPart(splitTextByHighlights(text, query))) {
    return true;
  }
  const terms = highlightTermsForExcerpt(query);
  const parts = splitTextByHighlights(text, query);
  const highlighted = parts.filter((p) => p.highlight).map((p) => p.text.toLowerCase());
  return highlighted.some((frag) =>
    terms.some((term) => frag.includes(term.toLowerCase()) || term.toLowerCase().includes(frag)),
  );
}

function resultShowsQueryEvidence(result, query) {
  if (textHasVisibleHighlight(result.title, query)) {
    return true;
  }
  if (textHasVisibleHighlight(result.category, query)) {
    return true;
  }
  if (textHasVisibleHighlight(result.breadcrumb, query)) {
    return true;
  }
  if (textHasVisibleHighlight(result.excerpt, query)) {
    return true;
  }
  if (excerptContainsMatchedTerm(result.excerpt, query)) {
    return true;
  }
  if (result.relatedReason?.startsWith("Partial match")) {
    const parsed = parseSearchQuery(query);
    const tokens = meaningfulTokensFromParsed(parsed);
    return tokens.some(
      (token) =>
        textHasVisibleHighlight(result.excerpt, token) ||
        textHasVisibleHighlight(result.title, token) ||
        textHasVisibleHighlight(result.breadcrumb, token),
    );
  }
  return false;
}

function isSearchableVocabularyWord(word) {
  if (!word || word.length < 3 || isSearchStopWord(word)) {
    return false;
  }
  if (!/^[a-z0-9][a-z0-9'-]*[a-z0-9]$/.test(word) && !/^[a-z]{3,}$/.test(word)) {
    return false;
  }
  if (word.includes("-")) {
    return word === "umistab-x";
  }
  return true;
}

function excerptContainsMatchedTerm(text, query) {
  if (!text) {
    return false;
  }
  const lower = text.toLowerCase();
  for (const term of highlightTermsForExcerpt(query)) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const spaced = escaped.replace(/-/g, " ");
    const pattern =
      spaced !== escaped ? `(?:${escaped}|${spaced})` : escaped;
    const regex = new RegExp(`(^|[^a-z0-9])(${pattern})([^a-z0-9]|$)`, "i");
    if (regex.test(lower)) {
      return true;
    }
  }
  return false;
}

function assertNoRemoved(results, query) {
  for (const r of results) {
    const h = normHref(r.href);
    for (const path of REMOVED) {
      assert.notEqual(h, path, `removed URL ${path} for query "${query}"`);
    }
  }
}

const failures = [];
let wordsTested = 0;
let resultsChecked = 0;

function checkResults(query, results) {
  assertNoRemoved(results, query);
  for (const r of results) {
    resultsChecked += 1;
    if (!resultShowsQueryEvidence(r, query)) {
      failures.push({
        query,
        href: r.href,
        title: r.title,
        excerpt: r.excerpt ?? "",
      });
    }
  }
}

const entities = getSearchEntitiesSnapshot();
const vocabulary = collectFieldVocabulary(entities).filter(isSearchableVocabularyWord);

for (const word of vocabulary) {
  wordsTested += 1;
  checkResults(word, searchAllMatches(word));
}

const phraseSamples = [];
for (const entity of entities) {
  const corpus = `${entity.title} ${entity.excerptSource}`.replace(/\s+/g, " ");
  const tokens = corpus
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3 && !isSearchStopWord(w));
  for (let i = 0; i < tokens.length - 1 && phraseSamples.length < 50; i += 3) {
    phraseSamples.push(`"${tokens[i]} ${tokens[i + 1]}"`);
  }
}

for (const phrase of phraseSamples) {
  checkResults(phrase, searchAllMatches(phrase));
}

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);
for (let i = 0; i < 100; i += 1) {
  const a = vocabulary[Math.floor(rand() * vocabulary.length)];
  const b = vocabulary[Math.floor(rand() * vocabulary.length)];
  if (!a || !b || a === b) {
    continue;
  }
  checkResults(`${a} ${b}`, searchAllMatches(`${a} ${b}`));
}

for (const word of vocabulary.slice(0, 200)) {
  const sug = [
    ...searchPrefixSuggestionMatches(word, 8),
    ...searchSuggestionMatches(word, 8),
  ];
  assertNoRemoved(sug, `suggest:${word}`);
}

const named = [
  "consultants",
  "the loadicator",
  "Naval Architecture",
  "FEA",
  "CFD",
  "surveys",
  "of",
];

console.log("Named query checks:");
for (const query of named) {
  const results = searchAllMatches(query);
  assertNoRemoved(results, query);
  if (query === "of") {
    assert.equal(results.length, 0, '"of" should return nothing');
    console.log(`  "${query}" → 0 results (ok)`);
    continue;
  }
  assert.ok(results.length > 0, `expected results for "${query}"`);
  checkResults(query, results);
  console.log(`  "${query}" → ${results.length} results`);
  for (const r of results.slice(0, 5)) {
    console.log(`    - ${r.title}: ${(r.excerpt ?? "").slice(0, 100)}…`);
  }
}

console.log("\nSummary:");
console.log(`  Vocabulary words searched: ${wordsTested}`);
console.log(`  Quoted phrase samples: ${phraseSamples.length}`);
console.log(`  Result rows checked: ${resultsChecked}`);
console.log(`  Failures: ${failures.length}`);

if (failures.length) {
  console.log("\nFailures (first 25):");
  for (const f of failures.slice(0, 25)) {
    console.log(`  [${f.query}] ${f.href} — ${f.title}`);
    console.log(`    excerpt: ${f.excerpt.slice(0, 140)}…`);
  }
  process.exit(1);
}

console.log("\nAll excerpt invariant checks passed.");
process.exit(0);
