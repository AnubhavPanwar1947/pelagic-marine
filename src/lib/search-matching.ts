const MIN_QUERY_LENGTH = 2;

export type ParsedSearchQuery = {
  /** Quoted phrases in order */
  requiredPhrases: string[];
  /** Meaningful tokens outside quotes (and from phrases when building highlights) */
  tokens: string[];
  normalizedTrimmed: string;
};

const DASH_CHARS = /[\u2010-\u2015\u2212‐‑‒–—―]/g;
const APOSTROPHE_CHARS = /[''`´]/g;

export function normalizeSearchText(text: string): string {
  return text
    .normalize("NFKC")
    .replace(APOSTROPHE_CHARS, "'")
    .replace(DASH_CHARS, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function stripTokenEdges(token: string): string {
  return token.replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, "");
}

export function parseSearchQuery(query: string): ParsedSearchQuery {
  const trimmed = query.trim();
  const requiredPhrases: string[] = [];
  const phraseRegex = /"([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = phraseRegex.exec(trimmed)) !== null) {
    const phrase = normalizeSearchText(match[1]);
    if (phrase.length >= MIN_QUERY_LENGTH) {
      requiredPhrases.push(phrase);
    }
  }

  const withoutQuotes = trimmed.replace(/"([^"]+)"/g, " ");
  const tokenParts = normalizeSearchText(withoutQuotes)
    .split(/\s+/)
    .map(stripTokenEdges)
    .filter((token) => token.length >= MIN_QUERY_LENGTH);

  const seen = new Set<string>();
  const tokens: string[] = [];
  for (const token of tokenParts) {
    const key = token;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    tokens.push(token);
  }

  const isQuoteOnly =
    requiredPhrases.length > 0 &&
    withoutQuotes.trim().length === 0 &&
    tokens.length === 0;

  if (isQuoteOnly) {
    return {
      requiredPhrases,
      tokens: [],
      normalizedTrimmed: normalizeSearchText(trimmed),
    };
  }

  return {
    requiredPhrases,
    tokens,
    normalizedTrimmed: normalizeSearchText(trimmed.replace(/"([^"]+)"/g, " $1 ")),
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Variants used only for exact token equality (not substring). */
export function tokenMatchForms(token: string): string[] {
  const base = normalizeSearchText(stripTokenEdges(token));
  if (base.length < MIN_QUERY_LENGTH) {
    return [];
  }
  const forms = new Set<string>([base]);
  const noTrailPunct = base.replace(/[.]+$/g, "");
  if (noTrailPunct.length >= MIN_QUERY_LENGTH) {
    forms.add(noTrailPunct);
  }
  if (base.includes("&")) {
    forms.add(base.replace(/&/g, "and"));
  }
  if (base.includes("and")) {
    forms.add(base.replace(/\band\b/g, "&"));
  }
  const hyphenAsSpace = base.replace(/-/g, " ");
  if (hyphenAsSpace !== base) {
    forms.add(hyphenAsSpace);
  }
  const spaceAsHyphen = base.replace(/\s+/g, "-");
  if (spaceAsHyphen !== base) {
    forms.add(spaceAsHyphen);
  }
  if (base.endsWith("'s") && base.length > MIN_QUERY_LENGTH + 2) {
    forms.add(base.slice(0, -2));
  }
  if (base.endsWith("s") && base.length > MIN_QUERY_LENGTH + 1) {
    forms.add(base.slice(0, -1));
  }
  return [...forms].filter((form) => form.length >= MIN_QUERY_LENGTH);
}

function tokenBoundaryPattern(token: string): RegExp {
  const forms = tokenMatchForms(token);
  const patterns = forms.map((form) => {
    const escaped = escapeRegExp(form);
    const spaced = escapeRegExp(form.replace(/-/g, " "));
    return spaced !== escaped ? `(?:${escaped}|${spaced})` : escaped;
  });
  const joined = patterns.join("|");
  return new RegExp(`(^|[^a-z0-9])(${joined})([^a-z0-9]|$)`, "i");
}

export function haystackWords(haystack: string): string[] {
  return normalizeSearchText(haystack)
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= MIN_QUERY_LENGTH);
}

/** Whole-token match with punctuation-insensitive hyphen / dash / apostrophe forms. */
export function containsExactToken(haystack: string, token: string): boolean {
  const tok = normalizeSearchText(stripTokenEdges(token));
  if (tok.length < MIN_QUERY_LENGTH) {
    return false;
  }

  if (tokenBoundaryPattern(tok).test(normalizeSearchText(haystack))) {
    return true;
  }

  const forms = tokenMatchForms(tok);
  const words = haystackWords(haystack);
  return forms.some((form) => words.some((word) => word === form));
}

export function containsExactPhrase(haystack: string, phrase: string): boolean {
  const h = normalizeSearchText(haystack);
  const p = normalizeSearchText(phrase);
  if (p.length < MIN_QUERY_LENGTH) {
    return false;
  }
  if (tokenBoundaryPattern(p.replace(/\s+/g, "-")).test(h)) {
    return true;
  }
  const tokens = p.split(/\s+/).filter((t) => t.length >= MIN_QUERY_LENGTH);
  if (tokens.length <= 1) {
    return h.includes(p) || h.replace(/-/g, " ").includes(p.replace(/-/g, " "));
  }
  const pattern = tokens.map((t) => `(?:${escapeRegExp(t)})`).join("[\\s-]+");
  return new RegExp(`(^|[^a-z0-9])${pattern}([^a-z0-9]|$)`, "i").test(h);
}

export function documentMatchesQuery(
  haystack: string,
  parsed: ParsedSearchQuery,
): boolean {
  if (!parsed.requiredPhrases.length && !parsed.tokens.length) {
    return false;
  }

  for (const phrase of parsed.requiredPhrases) {
    if (!containsExactPhrase(haystack, phrase)) {
      return false;
    }
  }

  for (const token of parsed.tokens) {
    if (!containsExactToken(haystack, token)) {
      return false;
    }
  }

  return true;
}

export function countExactTokenMatches(haystack: string, tokens: string[]): number {
  return tokens.reduce(
    (count, token) => (containsExactToken(haystack, token) ? count + 1 : count),
    0,
  );
}

export function highlightTermsFromQuery(query: string): string[] {
  const parsed = parseSearchQuery(query);
  const terms = new Set<string>();

  for (const phrase of parsed.requiredPhrases) {
    terms.add(phrase);
    for (const part of phrase.split(/\s+/)) {
      if (part.length >= MIN_QUERY_LENGTH) {
        terms.add(part);
      }
    }
  }

  for (const token of parsed.tokens) {
    terms.add(token);
    for (const form of tokenMatchForms(token)) {
      terms.add(form);
    }
  }

  const raw = query.trim();
  const quoted = raw.match(/"([^"]+)"/);
  if (quoted?.[1]) {
    terms.add(quoted[1].trim());
  }

  return [...terms].filter((term) => term.length >= MIN_QUERY_LENGTH);
}

export function scoreExactDocumentMatch(
  title: string,
  headingText: string,
  bodyText: string,
  parsed: ParsedSearchQuery,
): number {
  const titleNorm = normalizeSearchText(title);
  const headingNorm = normalizeSearchText(headingText);
  const bodyNorm = normalizeSearchText(bodyText);
  const fullNorm = normalizeSearchText(`${title} ${headingText} ${bodyText}`);

  let score = 0;

  if (parsed.normalizedTrimmed && titleNorm === parsed.normalizedTrimmed) {
    score += 1200;
  } else if (parsed.normalizedTrimmed && containsExactPhrase(title, parsed.normalizedTrimmed)) {
    score += 700;
  }

  const unquotedPhrase =
    parsed.tokens.length >= 2 && !parsed.requiredPhrases.length
      ? parsed.tokens.join(" ")
      : "";
  if (unquotedPhrase) {
    if (containsExactPhrase(title, unquotedPhrase)) {
      score += 650;
    } else if (containsExactPhrase(headingText, unquotedPhrase)) {
      score += 450;
    } else if (containsExactPhrase(bodyText, unquotedPhrase)) {
      score += 320;
    }
  }

  for (const phrase of parsed.requiredPhrases) {
    if (containsExactPhrase(title, phrase)) {
      score += 500;
    } else if (containsExactPhrase(headingText, phrase)) {
      score += 350;
    } else if (containsExactPhrase(bodyText, phrase)) {
      score += 250;
    } else if (containsExactPhrase(fullNorm, phrase)) {
      score += 200;
    }
  }

  const allTokens = [
    ...parsed.tokens,
    ...parsed.requiredPhrases.flatMap((p) => p.split(/\s+/).filter((t) => t.length >= MIN_QUERY_LENGTH)),
  ];

  const uniqueTokens = [...new Set(allTokens)];

  let allInTitle = uniqueTokens.length > 0;
  let allInHeading = uniqueTokens.length > 0;
  let allInBody = uniqueTokens.length > 0;

  for (const token of uniqueTokens) {
    const inTitle = containsExactToken(title, token);
    const inHeading = containsExactToken(headingText, token);
    const inBody = containsExactToken(bodyText, token);

    if (inTitle) {
      score += 320;
    } else if (inHeading) {
      score += 220;
    } else if (inBody) {
      score += 120;
    } else if (containsExactToken(fullNorm, token)) {
      score += 80;
    }

    if (!inTitle) {
      allInTitle = false;
    }
    if (!inHeading) {
      allInHeading = false;
    }
    if (!inBody) {
      allInBody = false;
    }
  }

  if (allInTitle) {
    score += 400;
  } else if (allInHeading) {
    score += 280;
  } else if (allInBody) {
    score += 160;
  }

  return score;
}

/** Autocomplete-only: completed segments must match exactly; final segment matches word start only. */
export function documentMatchesPrefixAutocomplete(
  haystack: string,
  rawQuery: string,
): boolean {
  const trimmed = rawQuery.trim();
  if (trimmed.length < MIN_QUERY_LENGTH) {
    return false;
  }

  const parsed = parseSearchQuery(trimmed);
  if (documentMatchesQuery(haystack, parsed)) {
    return true;
  }

  const normalizedQuery = normalizeSearchText(trimmed.replace(/"([^"]+)"/g, " "));
  const segments = normalizedQuery.split(/\s+/).filter(Boolean);
  if (!segments.length) {
    return false;
  }

  const trailingSpace = /\s$/.test(rawQuery);
  const completeSegments = trailingSpace ? segments : segments.slice(0, -1);
  const partialSegment = trailingSpace ? "" : segments[segments.length - 1] ?? "";

  for (const segment of completeSegments) {
    if (!containsExactToken(haystack, segment)) {
      return false;
    }
  }

  if (!partialSegment || partialSegment.length < MIN_QUERY_LENGTH) {
    return completeSegments.length > 0;
  }

  const words = haystackWords(haystack);
  return words.some((word) => word.startsWith(partialSegment));
}

export type HighlightPart = { text: string; highlight: boolean };

export function splitTextByHighlights(text: string, query: string): HighlightPart[] {
  const source = String(text ?? "");
  const terms = highlightTermsFromQuery(query)
    .filter((term) => term.length >= MIN_QUERY_LENGTH)
    .sort((a, b) => b.length - a.length);
  if (!source || !terms.length) {
    return [{ text: source, highlight: false }];
  }

  const ranges: { start: number; end: number }[] = [];
  const normSource = source;
  const lowerSource = normSource.toLowerCase();

  for (const term of terms) {
    const pattern = tokenBoundaryPattern(term);
    let match: RegExpExecArray | null;
    const regex = new RegExp(pattern.source, pattern.flags + (pattern.global ? "" : "g"));
    regex.lastIndex = 0;
    while ((match = regex.exec(lowerSource)) !== null) {
      const boundaryBefore = match[1] ?? "";
      const core = match[2] ?? "";
      const start = match.index + boundaryBefore.length;
      const end = start + core.length;
      if (end > start) {
        ranges.push({ start, end });
      }
    }
  }

  if (!ranges.length) {
    return [{ text: source, highlight: false }];
  }

  ranges.sort((a, b) => a.start - b.start || b.end - a.end - (a.end - a.start));
  const merged: { start: number; end: number }[] = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (!last || range.start >= last.end) {
      merged.push(range);
    } else if (range.end > last.end) {
      last.end = range.end;
    }
  }

  const parts: HighlightPart[] = [];
  let cursor = 0;
  for (const range of merged) {
    if (range.start > cursor) {
      parts.push({ text: source.slice(cursor, range.start), highlight: false });
    }
    parts.push({ text: source.slice(range.start, range.end), highlight: true });
    cursor = range.end;
  }
  if (cursor < source.length) {
    parts.push({ text: source.slice(cursor), highlight: false });
  }
  return parts.length ? parts : [{ text: source, highlight: false }];
}

/** Related-search aliases (not used for exact document match). */
export const SEARCH_TOKEN_ALIASES: Record<string, string[]> = {
  captain: ["capt"],
  capt: ["captain"],
  specialized: ["specialised"],
  specialised: ["specialized"],
  optimization: ["optimisation"],
  optimisation: ["optimization"],
  upadhyaya: ["upadhyay"],
  upadhyay: ["upadhyaya"],
  harjeet: ["harjit"],
  harjit: ["harjeet"],
};

export function expandTokensWithAliases(tokens: string[]): string[][] {
  return tokens.map((token) => {
    const norm = normalizeSearchText(stripTokenEdges(token));
    const variants = new Set<string>([norm, ...tokenMatchForms(norm)]);
    const aliases = SEARCH_TOKEN_ALIASES[norm] ?? [];
    for (const alias of aliases) {
      variants.add(alias);
      for (const form of tokenMatchForms(alias)) {
        variants.add(form);
      }
    }
    return [...variants];
  });
}

export function containsTokenWithAliasVariants(haystack: string, token: string): boolean {
  if (containsExactToken(haystack, token)) {
    return true;
  }
  const norm = normalizeSearchText(stripTokenEdges(token));
  const aliases = SEARCH_TOKEN_ALIASES[norm] ?? [];
  return aliases.some((alias) => containsExactToken(haystack, alias));
}

export function documentMatchesWithAliasVariants(
  haystack: string,
  parsed: ParsedSearchQuery,
): boolean {
  if (!parsed.tokens.length && !parsed.requiredPhrases.length) {
    return false;
  }
  for (const phrase of parsed.requiredPhrases) {
    if (!containsExactPhrase(haystack, phrase)) {
      return false;
    }
  }
  for (const token of parsed.tokens) {
    if (!containsTokenWithAliasVariants(haystack, token)) {
      return false;
    }
  }
  return true;
}

export function levenshteinDistance(a: string, b: string): number {
  const left = normalizeSearchText(a);
  const right = normalizeSearchText(b);
  if (left === right) {
    return 0;
  }
  const rows = left.length + 1;
  const cols = right.length + 1;
  const matrix: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i += 1) {
    matrix[i][0] = i;
  }
  for (let j = 0; j < cols; j += 1) {
    matrix[0][j] = j;
  }
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[rows - 1][cols - 1];
}

export function maxTypoDistanceForWord(word: string): number {
  const len = normalizeSearchText(word).length;
  if (len <= 3) {
    return 0;
  }
  if (len <= 7) {
    return 1;
  }
  return 2;
}

export function findTypoVocabularyMatches(
  token: string,
  vocabulary: string[],
): { word: string; distance: number }[] {
  const norm = normalizeSearchText(stripTokenEdges(token));
  if (norm.length < MIN_QUERY_LENGTH) {
    return [];
  }
  const maxDist = maxTypoDistanceForWord(norm);
  if (maxDist === 0) {
    return [];
  }
  const hits: { word: string; distance: number }[] = [];
  for (const word of vocabulary) {
    const distance = levenshteinDistance(norm, word);
    if (distance > 0 && distance <= maxDist) {
      hits.push({ word, distance });
    }
  }
  hits.sort((a, b) => a.distance - b.distance || a.word.localeCompare(b.word));
  return hits;
}
