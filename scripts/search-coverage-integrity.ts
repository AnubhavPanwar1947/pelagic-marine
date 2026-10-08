import fs from "node:fs";
import path from "node:path";
import { searchAllMatches } from "../src/lib/search-index";
import { normalizeSearchText } from "../src/lib/search-matching";

const root = path.join(import.meta.dirname, "..");
const outDir = path.join(root, "out");

const UI_WORDS = new Set(
  [
    "back",
    "services",
    "home",
    "about",
    "team",
    "blog",
    "contact",
    "search",
    "menu",
    "clear",
    "submit",
    "next",
    "previous",
    "read",
    "more",
    "less",
    "all",
    "skip",
    "pelagic",
    "marine",
    "amp",
    "quot",
    "x27",
  ].map((w) => normalizeSearchText(w)),
);

const STOP_WORDS = new Set(
  [
    "this",
    "that",
    "with",
    "from",
    "your",
    "our",
    "not",
    "are",
    "was",
    "will",
    "have",
    "has",
    "had",
    "been",
    "being",
    "would",
    "could",
    "should",
    "about",
    "into",
    "over",
    "under",
    "after",
    "before",
    "while",
    "when",
    "where",
    "which",
    "their",
    "there",
    "than",
    "then",
    "them",
    "they",
    "these",
    "those",
    "what",
    "were",
    "also",
    "only",
    "other",
    "such",
    "each",
    "very",
    "just",
    "like",
    "through",
    "during",
    "until",
    "unless",
    "may",
    "can",
    "any",
    "all",
    "how",
    "who",
    "why",
    "its",
    "his",
    "her",
    "she",
    "him",
    "you",
    "we",
    "us",
    "or",
    "and",
    "the",
    "for",
    "but",
  ].map((w) => normalizeSearchText(w)),
);

function normalizeRoute(filePath: string): string {
  const rel = path.relative(outDir, filePath).replace(/\\/g, "/");
  if (rel === "index.html") {
    return "/";
  }
  return `/${rel.replace(/index\.html$/, "")}`;
}

function extractVisibleWords(html: string): string[] {
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const chunk = mainMatch?.[1] ?? html;
  const withAlt = chunk.replace(/<img\b[^>]*\balt="([^"]*)"[^>]*>/gi, " $1 ");
  const text = withAlt
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/gi, " and ")
    .replace(/&#0?39;/g, "'")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = new Set<string>();
  for (const word of normalizeSearchText(text).split(/[^a-z0-9]+/)) {
    if (word.length >= 3 && !UI_WORDS.has(word) && !STOP_WORDS.has(word)) {
      words.add(word);
    }
  }
  return [...words];
}

function collectHtmlFiles(dir: string, acc: string[] = []): string[] {
  if (!fs.existsSync(dir)) {
    return acc;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtmlFiles(full, acc);
    } else if (entry.name === "index.html") {
      acc.push(full);
    }
  }
  return acc;
}

if (!fs.existsSync(outDir)) {
  console.warn("search-coverage-integrity: out/ not found — run npm run build first. Skipping.");
  process.exit(0);
}

const files = collectHtmlFiles(outDir);
let totalWords = 0;
let missingWords = 0;
const failures: { route: string; missing: string[]; coverage: number }[] = [];

for (const file of files) {
  const route = normalizeRoute(file);
  if (route === "/search/" || route.includes("404") || route.includes("_not-found")) {
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const words = extractVisibleWords(html);
  const missing: string[] = [];
  for (const word of words) {
    totalWords += 1;
    const hits = searchAllMatches(word);
    const found = hits.some((hit) => {
      const href = hit.href.endsWith("/") ? hit.href : `${hit.href}/`;
      const normalizedRoute = route.endsWith("/") ? route : `${route}/`;
      return href === normalizedRoute || href === "/";
    });
    if (!found) {
      missing.push(word);
      missingWords += 1;
    }
  }
  const coverage = words.length ? (words.length - missing.length) / words.length : 1;
  const normalizedRoute = route.endsWith("/") ? route : `${route}/`;
  const threshold =
    ["/team/", "/contact/", "/about/"].includes(normalizedRoute)
      ? 0.99
      : [
            "/privacy-policy/",
            "/cookies-policy/",
            "/terms-and-conditions/",
            "/standard-terms-and-conditions-of-engagement/",
            "/disclaimer/",
          ].includes(normalizedRoute) || normalizedRoute.startsWith("/marine-insights/")
        ? 0.85
        : 0.9;
  if (coverage < threshold) {
    failures.push({ route, missing: missing.slice(0, 25), coverage });
  }
}

if (failures.length) {
  console.warn("Search coverage below route threshold:");
  for (const failure of failures) {
    console.warn(
      `  ${failure.route} ${(failure.coverage * 100).toFixed(1)}% missing sample: ${failure.missing.join(", ")}`,
    );
  }
  const critical = failures.filter((failure) =>
    ["/team/", "/contact/", "/about/"].includes(
      failure.route.endsWith("/") ? failure.route : `${failure.route}/`,
    ),
  );
  if (critical.length) {
    console.error("Critical routes below 99% coverage:", critical.map((c) => c.route).join(", "));
    process.exit(1);
  }
}

const overall = totalWords ? (totalWords - missingWords) / totalWords : 1;
console.log(
  `search-coverage-integrity: ${files.length} routes, ${(overall * 100).toFixed(1)}% word recall (${totalWords} words checked).`,
);
