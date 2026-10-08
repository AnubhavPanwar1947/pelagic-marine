import {
  SEARCH_TOKEN_ALIASES,
  SEARCH_TOKEN_PHRASE_ALIASES,
  containsExactPhrase,
  containsExactToken,
  meaningfulTokensFromParsed,
  normalizeSearchText,
  parseSearchQuery,
  stripTokenEdges,
  type ParsedSearchQuery,
} from "./search-matching";
import { SEARCH_MIN_QUERY_LENGTH } from "./search-types";

const MIN_LEN = SEARCH_MIN_QUERY_LENGTH;

export type SearchDocumentFields = {
  titleWords: Set<string>;
  headingWords: Set<string>;
  bodyWords: Set<string>;
  keywordWords: Set<string>;
};

export function textToWordSet(text: string): Set<string> {
  const normalized = normalizeSearchText(text);
  const words = new Set<string>();
  for (const word of normalized.split(/[^a-z0-9]+/)) {
    if (word.length >= MIN_LEN) {
      words.add(word);
    }
  }
  const hyphenated = normalized.match(/[a-z0-9]+(?:-[a-z0-9]+)+/g) ?? [];
  for (const token of hyphenated) {
    if (token.length >= MIN_LEN) {
      words.add(token);
    }
  }
  return words;
}

export function buildDocumentFields(parts: {
  title: string;
  heading?: string;
  body?: string;
  keywords?: string;
}): SearchDocumentFields {
  return {
    titleWords: textToWordSet(parts.title),
    headingWords: textToWordSet(parts.heading ?? ""),
    bodyWords: textToWordSet(parts.body ?? ""),
    keywordWords: textToWordSet(parts.keywords ?? ""),
  };
}

/** Explicit plural pairs only — no generic trailing-s stemming. */
const PLURAL_PAIR_LIST: [string, string][] = [
  ["survey", "surveys"],
  ["audit", "audits"],
  ["drawing", "drawings"],
  ["inspection", "inspections"],
];

const PLURAL_VARIANTS = new Map<string, Set<string>>();
for (const [a, b] of PLURAL_PAIR_LIST) {
  if (!PLURAL_VARIANTS.has(a)) {
    PLURAL_VARIANTS.set(a, new Set());
  }
  if (!PLURAL_VARIANTS.has(b)) {
    PLURAL_VARIANTS.set(b, new Set());
  }
  PLURAL_VARIANTS.get(a)!.add(b);
  PLURAL_VARIANTS.get(b)!.add(a);
}

function addPluralForms(base: string, out: Set<string>): void {
  const norm = normalizeSearchText(stripTokenEdges(base));
  if (norm.length < MIN_LEN) {
    return;
  }
  out.add(norm);
  const noTrailPunct = norm.replace(/[.]+$/g, "");
  if (noTrailPunct.length >= MIN_LEN) {
    out.add(noTrailPunct);
  }
  if (norm.includes("&")) {
    out.add(norm.replace(/&/g, "and"));
  }
  if (norm.includes("and")) {
    out.add(norm.replace(/\band\b/g, "&"));
  }
  const hyphenAsSpace = norm.replace(/-/g, " ");
  if (hyphenAsSpace !== norm) {
    out.add(hyphenAsSpace);
  }
  const spaceAsHyphen = norm.replace(/\s+/g, "-");
  if (spaceAsHyphen !== norm) {
    out.add(spaceAsHyphen);
  }
  if (norm.endsWith("'s") && norm.length > MIN_LEN + 2) {
    out.add(norm.slice(0, -2));
  }
  for (const variant of PLURAL_VARIANTS.get(norm) ?? []) {
    out.add(variant);
  }
}

export function queryTokenForms(token: string): string[] {
  const forms = new Set<string>();
  addPluralForms(token, forms);
  const norm = normalizeSearchText(stripTokenEdges(token));
  for (const alias of SEARCH_TOKEN_ALIASES[norm] ?? []) {
    addPluralForms(alias, forms);
  }
  return [...forms].filter((form) => form.length >= MIN_LEN);
}

function wordSetContainsAnyForm(wordSet: Set<string>, token: string): boolean {
  if (!wordSet.size) {
    return false;
  }
  for (const form of queryTokenForms(token)) {
    if (wordSet.has(form)) {
      return true;
    }
  }
  return false;
}

export type TokenFieldHit = "title" | "heading" | "body" | "keywords" | "phrase" | "none";

export function tokenHitField(
  fields: SearchDocumentFields,
  corpus: string,
  token: string,
): TokenFieldHit {
  const norm = normalizeSearchText(stripTokenEdges(token));
  for (const phrase of SEARCH_TOKEN_PHRASE_ALIASES[norm] ?? []) {
    if (containsExactPhrase(corpus, phrase)) {
      return "phrase";
    }
  }
  if (wordSetContainsAnyForm(fields.titleWords, token)) {
    return "title";
  }
  if (wordSetContainsAnyForm(fields.headingWords, token)) {
    return "heading";
  }
  if (wordSetContainsAnyForm(fields.keywordWords, token)) {
    return "keywords";
  }
  if (wordSetContainsAnyForm(fields.bodyWords, token)) {
    return "body";
  }
  return "none";
}

export function tokenSatisfiesQuery(
  fields: SearchDocumentFields,
  corpus: string,
  token: string,
): boolean {
  return tokenHitField(fields, corpus, token) !== "none";
}

export function documentFieldsMatchQuery(
  fields: SearchDocumentFields,
  corpus: string,
  parsed: ParsedSearchQuery,
): boolean {
  for (const phrase of parsed.requiredPhrases) {
    if (!containsExactPhrase(corpus, phrase)) {
      return false;
    }
  }
  const tokens = meaningfulTokensFromParsed(parsed);
  if (!tokens.length) {
    return parsed.requiredPhrases.length > 0;
  }
  return tokens.every((token) => tokenSatisfiesQuery(fields, corpus, token));
}

const FIELD_SCORE: Record<TokenFieldHit, number> = {
  title: 420,
  heading: 280,
  keywords: 200,
  body: 120,
  phrase: 360,
  none: 0,
};

export function scoreDocumentFields(
  title: string,
  heading: string,
  fields: SearchDocumentFields,
  corpus: string,
  parsed: ParsedSearchQuery,
): number {
  const titleNorm = normalizeSearchText(title);
  const headingNorm = normalizeSearchText(heading);
  let score = 0;

  if (parsed.normalizedTrimmed && titleNorm === parsed.normalizedTrimmed) {
    score += 1400;
  } else if (parsed.normalizedTrimmed && containsExactPhrase(title, parsed.normalizedTrimmed)) {
    score += 800;
  }

  const unquotedPhrase =
    parsed.tokens.length >= 2 && !parsed.requiredPhrases.length
      ? parsed.tokens.join(" ")
      : "";
  if (unquotedPhrase) {
    if (containsExactPhrase(title, unquotedPhrase)) {
      score += 700;
    } else if (containsExactPhrase(heading, unquotedPhrase)) {
      score += 480;
    } else if (containsExactPhrase(corpus, unquotedPhrase)) {
      score += 300;
    }
  }

  for (const phrase of parsed.requiredPhrases) {
    if (containsExactPhrase(title, phrase)) {
      score += 520;
    } else if (containsExactPhrase(heading, phrase)) {
      score += 360;
    } else if (containsExactPhrase(corpus, phrase)) {
      score += 240;
    }
  }

  const tokens = [
    ...meaningfulTokensFromParsed(parsed),
    ...parsed.requiredPhrases.flatMap((p) =>
      p.split(/\s+/).filter((t) => t.length >= MIN_LEN),
    ),
  ];
  const unique = [...new Set(tokens)];

  let allInTitle = unique.length > 0;
  let bestFieldRank = 0;

  for (const token of unique) {
    const hit = tokenHitField(fields, corpus, token);
    score += FIELD_SCORE[hit];
    if (hit !== "title") {
      allInTitle = false;
    }
    const rank =
      hit === "title"
        ? 4
        : hit === "phrase" || hit === "heading"
          ? 3
          : hit === "keywords"
            ? 2
            : hit === "body"
              ? 1
              : 0;
    bestFieldRank = Math.max(bestFieldRank, rank);
  }

  if (allInTitle) {
    score += 450;
  }

  if (unique.length > 1) {
    const matched = unique.filter((t) => tokenSatisfiesQuery(fields, corpus, t)).length;
    if (matched === unique.length) {
      score += 550;
    } else if (matched > 0) {
      score += matched * 35;
    }
  }

  score += bestFieldRank * 40;

  return score;
}

export function countMatchedQueryTokens(
  fields: SearchDocumentFields,
  corpus: string,
  parsed: ParsedSearchQuery,
): { matched: number; total: number } {
  const tokens = meaningfulTokensFromParsed(parsed);
  if (!tokens.length) {
    return { matched: 0, total: 0 };
  }
  let matched = 0;
  for (const token of tokens) {
    if (tokenSatisfiesQuery(fields, corpus, token)) {
      matched += 1;
    }
  }
  return { matched, total: tokens.length };
}

export function partialMatchScore(
  title: string,
  heading: string,
  fields: SearchDocumentFields,
  corpus: string,
  parsed: ParsedSearchQuery,
  matched: number,
): number {
  let score = matched * 200;
  score += scoreDocumentFields(title, heading, fields, corpus, parsed) * 0.35;
  return score;
}

export { parseSearchQuery };
