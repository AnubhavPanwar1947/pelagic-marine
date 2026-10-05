import {
  buildSearchDestinationHref,
  searchAllMatches,
} from "../src/lib/search-index";

const cases: { query: string; hrefIncludes: string; hashIncludes?: string }[] = [
  { query: "Nishchay", hrefIncludes: "/team/", hashIncludes: "team-nishchay" },
  { query: "Dubai", hrefIncludes: "/contact/", hashIncludes: "enquiry-form" },
  { query: "UMISTAB", hrefIncludes: "/services/umistab-x/", hashIncludes: "umistab" },
  { query: "LNG", hrefIncludes: "/services/mooring-compatibility/" },
  { query: "CFD", hrefIncludes: "/news/computational-fluid-dynamics/" },
  { query: "Master Mariners", hrefIncludes: "/team/" },
  { query: "Surveying", hrefIncludes: "/services/" },
  { query: "privacy", hrefIncludes: "/privacy/" },
];

let failed = false;

for (const { query, hrefIncludes, hashIncludes } of cases) {
  const matches = searchAllMatches(query);
  const match = matches.find((item) => item.href.includes(hrefIncludes)) ?? matches[0];
  if (!match) {
    console.error(`FAIL ${query}: no match`);
    failed = true;
    continue;
  }
  const href = buildSearchDestinationHref(match, query);
  if (!href.includes(hrefIncludes)) {
    console.error(`FAIL ${query}: expected ${hrefIncludes} in ${href}`);
    failed = true;
  }
  if (hashIncludes && !href.includes(`#${hashIncludes}`)) {
    console.error(`FAIL ${query}: expected hash ${hashIncludes} in ${href}`);
    failed = true;
  }
  if (!href.includes(`q=${encodeURIComponent(query)}`) && !href.includes(`q=${query.replace(/ /g, "%20")}`)) {
    if (!href.includes("q=")) {
      console.error(`FAIL ${query}: missing q param in ${href}`);
      failed = true;
    }
  }
  console.log(`${query} → ${href}`);
}

if (failed) {
  process.exit(1);
}
