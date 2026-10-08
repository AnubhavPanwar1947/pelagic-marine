import assert from "node:assert/strict";
import { buildHomePageSearchBody } from "../src/lib/page-search-content";
import { searchAllMatches } from "../src/lib/search-index";
import { containsExactPhrase, containsExactToken } from "../src/lib/search-matching";

const homeBody = buildHomePageSearchBody();
const removedPhrase = "register of representative assignments";

assert.ok(
  !homeBody.toLowerCase().includes(removedPhrase),
  "home search body must not index removed phrase",
);
assert.ok(
  !containsExactPhrase(homeBody, removedPhrase),
  "home search body must not contain removed phrase as exact phrase",
);
assert.ok(
  !containsExactToken(homeBody, "register"),
  "home search body must not contain token register",
);
assert.ok(
  !containsExactToken(homeBody, "representative"),
  "home search body must not contain token representative",
);
assert.ok(
  !containsExactToken(homeBody, "assignments"),
  "home search body must not contain token assignments",
);

assert.ok(
  searchAllMatches("breadth of vessels").some((r) => r.href === "/"),
  "breadth of vessels must match home",
);

console.log("home-track-record-search.test.ts: all assertions passed");
