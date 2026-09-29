import { searchAllMatches } from "../src/lib/search-index";

const queries = [
  "LNG",
  "Surveying",
  "Naval architecture",
  "CFD",
  "marine",
  "clean fuel",
  "Master Mariners",
  "stability",
  "India",
  "Dubai",
  "careers",
  "privacy",
  "survying",
];

let failed = false;

for (const query of queries) {
  const results = searchAllMatches(query);
  const hrefs = results.map((item) => item.href);
  const has404 = hrefs.some((href) => href.includes("advisory-expansion-india-uae"));
  if (has404) {
    console.error(`FAIL ${query}: contains broken advisory slug`);
    failed = true;
  }
  console.log(`${query}: ${results.length} results`);
  if (results.length === 0) {
    console.error(`FAIL ${query}: no results`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}
