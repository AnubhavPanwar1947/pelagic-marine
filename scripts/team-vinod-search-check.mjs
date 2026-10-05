import { searchAllMatches } from "../src/lib/search-index.ts";
import { teamMemberAnchorId } from "../src/lib/search-slugs.ts";

const queries = ["Vinod Janardanan", "Pelagic Singapore", "Bureau Veritas"];
let ok = true;
for (const q of queries) {
  const hits = searchAllMatches(q).filter((r) => r.href === "/team/");
  const vinod = hits.find((r) => r.title === "Vinod Janardanan");
  if (!vinod) {
    console.error("MISSING", q, hits.map((h) => h.title));
    ok = false;
  } else {
    console.log("OK", q, vinod.anchorId);
  }
}
console.log("anchor id", teamMemberAnchorId("Vinod Janardanan"));
process.exit(ok ? 0 : 1);
