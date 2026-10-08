import assert from "node:assert/strict";
import { searchAllMatches } from "../src/lib/search-index";

function assertContactSearchHit(query: string): void {
  assert.ok(
    searchAllMatches(query).some((r) => r.href.includes("/contact/")),
    `expected /contact/ for query: ${query}`,
  );
}

for (const q of [
  "Woodlands",
  "Woods Square",
  "737715",
  "Yokohama",
  "Utsukushigaoka",
  "Aoba",
  "225-0002",
  "Japan",
  "Associate Office",
  "12 Woodlands Square, #06-74, Woods Square, Singapore 737715",
  "4-54-6 UTSUKUSHIGAOKA, AOBA WARD, YOKOHAMA CITY -225-0002",
  "Dehradun",
  "Garhi Cantonment",
  "Dubai",
]) {
  assertContactSearchHit(q);
}

console.log("contact-presence-search-index.test.ts: all assertions passed");
