/**
 * Compare indexed title/heading/body terms to rendered main-content corpora.
 * Run: npx tsx scripts/search-index-drift.js
 *
 * After legal page copy changes: npm run generate:legal-search-text
 */
import { REMOVED_SERVICE_CATEGORY_SLUGS } from "../src/lib/service-category-slugs.ts";
import { renderedVisibleCorpusForEntity } from "../src/lib/search-rendered-corpus.ts";
import { getSearchEntitiesSnapshot, searchAllMatches } from "../src/lib/search-index.ts";
import {
  containsExactToken,
  isSearchStopWord,
  normalizeSearchText,
} from "../src/lib/search-matching.ts";
import { SEARCH_MIN_QUERY_LENGTH } from "../src/lib/search-types.ts";

const REMOVED = REMOVED_SERVICE_CATEGORY_SLUGS.map((s) => `/services/${s}/`);

function visibleCorpus(entity) {
  return normalizeSearchText(
    `${entity.title} ${renderedVisibleCorpusForEntity(entity)}`,
  );
}

const entities = getSearchEntitiesSnapshot();
const driftFailures = [];
const keywordNotes = [];

for (const entity of entities) {
  const visible = visibleCorpus(entity);
  const loc = entity.anchorId
    ? `${entity.href}#${entity.anchorId}`
    : entity.href;

  for (const [fieldName, wordSet] of [
    ["title", entity.searchFields.titleWords],
    ["heading", entity.searchFields.headingWords],
    ["body", entity.searchFields.bodyWords],
  ]) {
    for (const word of wordSet) {
      if (word.length < SEARCH_MIN_QUERY_LENGTH || isSearchStopWord(word)) {
        continue;
      }
      if (!containsExactToken(visible, word)) {
        driftFailures.push({
          href: loc,
          title: entity.title,
          term: word,
          sourceField: fieldName,
          matchKind: "exact-body",
          excerpt: entity.excerpt?.slice(0, 120) ?? "",
        });
      }
    }
  }

  for (const word of entity.searchFields.keywordWords) {
    if (!containsExactToken(visible, word)) {
      keywordNotes.push({
        href: loc,
        title: entity.title,
        term: word,
        sourceField: "keywords",
        matchKind: "keyword-metadata",
      });
    }
  }
}

for (const path of REMOVED) {
  for (const r of searchAllMatches("survey")) {
    if (r.href === path) {
      driftFailures.push({
        href: path,
        title: r.title,
        term: "(removed route)",
        sourceField: "route",
        matchKind: "removed-url",
        excerpt: "",
      });
    }
  }
}

const consultants = searchAllMatches("consultants");
const contactConsultants = consultants.filter((r) => r.href === "/contact/");
if (contactConsultants.length > 0) {
  const visible = visibleCorpus(
    entities.find((e) => e.href === "/contact/" && !e.anchorId) ?? {
      title: "Contact",
      excerptSource: "",
      searchFields: { titleWords: new Set(), headingWords: new Set(), bodyWords: new Set(), keywordWords: new Set() },
    },
  );
  if (!containsExactToken(visible, "consultants")) {
    driftFailures.push({
      href: "/contact/",
      title: "Contact",
      term: "consultants",
      sourceField: "search-result",
      matchKind: "stale-contact-match",
      excerpt: contactConsultants[0]?.excerpt ?? "",
    });
  }
}

console.log(`Indexed entities: ${entities.length}`);
console.log(`Keyword metadata terms (not required on page): ${keywordNotes.length}`);
console.log(`Body/title/heading drift failures: ${driftFailures.length}`);

if (process.argv.includes("--verbose")) {
  console.log("\nEntity inventory:");
  for (const entity of entities) {
    const loc = entity.anchorId ? `${entity.href}#${entity.anchorId}` : entity.href;
    console.log(`  ${loc} — ${entity.title} (${entity.category})`);
  }
}

if (driftFailures.length) {
  console.log("\nDrift failures:");
  for (const f of driftFailures.slice(0, 50)) {
    console.log(`  [${f.matchKind}] ${f.href} — ${f.title}`);
    console.log(`    term: ${f.term} (${f.sourceField})`);
    if (f.excerpt) {
      console.log(`    excerpt: ${f.excerpt}…`);
    }
  }
  process.exit(1);
}

console.log("\nSearch index drift check passed.");
process.exit(0);
