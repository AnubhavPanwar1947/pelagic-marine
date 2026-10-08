import { queryTokenForms } from "./search-field-index";
import {
  SEARCH_TOKEN_PHRASE_ALIASES,
  containsExactPhrase,
  containsTokenWithAliasVariants,
  countExactTokenMatches,
  meaningfulTokensFromParsed,
  normalizeSearchText,
  parseSearchQuery,
  stripTokenEdges,
  tokenMatchForms,
  type ParsedSearchQuery,
} from "./search-matching";

const MIN_QUERY_LENGTH = 2;
const ELLIPSIS = "…";

/** Split long legal-style text before choosing the best excerpt chunk. */
export function splitTextIntoExcerptChunks(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();
  if (!normalized) {
    return [];
  }

  const segments: string[] = [];
  const pushParts = (block: string) => {
    const trimmed = block.trim();
    if (trimmed.length >= MIN_QUERY_LENGTH) {
      segments.push(trimmed);
    }
  };

  for (const line of normalized.split(/\n+/)) {
    for (const semi of line.split(/;/)) {
      for (const sentence of semi.split(/(?<=[.!?])\s+/)) {
        const subParts = sentence.split(/(?=\(\s*[a-z]\)\s+)/i);
        for (const part of subParts) {
          const numbered = part.split(/(?=\d+\.\d+\s+)/);
          for (const piece of numbered) {
            pushParts(piece);
          }
        }
      }
    }
  }

  if (!segments.length) {
    return [normalized];
  }
  return segments;
}

function tokenAppearsInChunk(chunk: string, token: string): boolean {
  return containsTokenWithAliasVariants(chunk, token);
}

function distinctTokensInChunk(chunk: string, parsed: ParsedSearchQuery): number {
  const tokens = [
    ...meaningfulTokensFromParsed(parsed),
    ...parsed.requiredPhrases.flatMap((p) =>
      p.split(/\s+/).filter((t) => t.length >= MIN_QUERY_LENGTH),
    ),
  ];
  const unique = [...new Set(tokens)];
  return unique.filter((token) => tokenAppearsInChunk(chunk, token)).length;
}

function chunkMatchesAllTokens(chunk: string, parsed: ParsedSearchQuery): boolean {
  for (const phrase of parsed.requiredPhrases) {
    if (!containsExactPhrase(chunk, phrase)) {
      return false;
    }
  }
  const tokens = meaningfulTokensFromParsed(parsed);
  if (!tokens.length) {
    return parsed.requiredPhrases.length > 0;
  }
  return tokens.every((token) => tokenAppearsInChunk(chunk, token));
}

function highlightTermsForExcerpt(query: string): string[] {
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
  for (const token of meaningfulTokensFromParsed(parsed)) {
    for (const form of queryTokenForms(token)) {
      terms.add(form);
    }
    const norm = normalizeSearchText(stripTokenEdges(token));
    for (const phrase of SEARCH_TOKEN_PHRASE_ALIASES[norm] ?? []) {
      terms.add(phrase);
      for (const part of phrase.split(/\s+/)) {
        if (part.length >= MIN_QUERY_LENGTH) {
          terms.add(part);
        }
      }
    }
  }
  return [...terms].filter((t) => t.length >= MIN_QUERY_LENGTH);
}

function findMatchSpans(text: string, terms: string[]): { start: number; end: number }[] {
  const lower = text.toLowerCase();
  const spans: { start: number; end: number }[] = [];

  for (const term of terms) {
    const forms = [...new Set([term, ...tokenMatchForms(term)])];
    for (const form of forms) {
      if (form.length < MIN_QUERY_LENGTH) {
        continue;
      }
      const escaped = form.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const spaced = escaped.replace(/-/g, " ");
      const pattern =
        spaced !== escaped ? `(?:${escaped}|${spaced})` : escaped;
      const regex = new RegExp(
        `(^|[^a-z0-9])(${pattern})([^a-z0-9]|$)`,
        "gi",
      );
      let match: RegExpExecArray | null;
      while ((match = regex.exec(lower)) !== null) {
        const boundaryBefore = match[1] ?? "";
        const core = match[2] ?? "";
        const start = match.index + boundaryBefore.length;
        const end = start + core.length;
        if (end > start) {
          spans.push({ start, end });
        }
      }
    }
  }

  spans.sort((a, b) => a.start - b.start);
  return spans;
}

function snapStartToWordBoundary(text: string, index: number): number {
  let i = index;
  while (i > 0 && /[a-z0-9]/i.test(text[i - 1] ?? "")) {
    i -= 1;
  }
  return i;
}

function snapEndToWordBoundary(text: string, index: number): number {
  let i = index;
  while (i < text.length && /[a-z0-9]/i.test(text[i] ?? "")) {
    i += 1;
  }
  return i;
}

export function windowTextAroundMatches(
  text: string,
  spans: { start: number; end: number }[],
  maxLen: number,
): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) {
    return "";
  }
  if (!spans.length) {
    return clean.length <= maxLen ? clean : `${clean.slice(0, maxLen - 1).trimEnd()}${ELLIPSIS}`;
  }

  const focusStart = spans[0]!.start;
  const focusEnd = spans[spans.length - 1]!.end;

  let end = Math.min(clean.length, focusEnd);
  let start = Math.max(0, end - maxLen);
  if (start > focusStart) {
    start = Math.max(0, focusStart - Math.floor((maxLen - (focusEnd - focusStart)) / 2));
  }
  if (end - start < maxLen) {
    end = Math.min(clean.length, start + maxLen);
  }

  start = snapStartToWordBoundary(clean, start);
  end = snapEndToWordBoundary(clean, end);

  if (end < focusEnd) {
    end = Math.min(clean.length, focusEnd);
    start = Math.max(0, end - maxLen);
    start = snapStartToWordBoundary(clean, start);
  }

  if (end - start > maxLen) {
    start = Math.max(0, end - maxLen);
    start = snapStartToWordBoundary(clean, start);
  }

  let slice = clean.slice(start, end).trim();
  const prefix = start > 0 ? ELLIPSIS : "";
  const suffix = end < clean.length ? ELLIPSIS : "";
  if (prefix) {
    slice = `${prefix}${slice}`;
  }
  if (suffix) {
    slice = `${slice}${suffix}`;
  }
  return slice;
}

function excerptFromChunk(chunk: string, query: string, maxLen: number): string {
  const terms = highlightTermsForExcerpt(query);
  const spans = findMatchSpans(chunk, terms);
  if (!spans.length) {
    const parsed = parseSearchQuery(query);
    for (const token of meaningfulTokensFromParsed(parsed)) {
      const aliasSpans = findMatchSpans(chunk, queryTokenForms(token));
      if (aliasSpans.length) {
        return windowTextAroundMatches(chunk, aliasSpans, maxLen);
      }
    }
    return windowTextAroundMatches(chunk, [], maxLen);
  }
  return windowTextAroundMatches(chunk, spans, maxLen);
}

type ScoredChunk = { chunk: string; index: number; score: number; allMatch: boolean };

function rankChunks(chunks: string[], parsed: ParsedSearchQuery): ScoredChunk[] {
  const scored: ScoredChunk[] = [];
  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index]!;
    const score = distinctTokensInChunk(chunk, parsed);
    if (score <= 0 && !parsed.requiredPhrases.some((p) => containsExactPhrase(chunk, p))) {
      continue;
    }
    scored.push({
      chunk,
      index,
      score: score + countExactTokenMatches(chunk, parsed.tokens) * 0.1,
      allMatch: chunkMatchesAllTokens(chunk, parsed),
    });
  }
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (a.allMatch !== b.allMatch) {
      return a.allMatch ? -1 : 1;
    }
    return a.index - b.index;
  });
  return scored;
}

/** Build one or two windowed excerpts centered on matched terms. */
export function buildQueryExcerpts(options: {
  title: string;
  bodyText: string;
  query: string;
  maxLen?: number;
}): string {
  const { title, bodyText, query, maxLen = 160 } = options;
  const trimmed = query.trim();
  if (trimmed.length < MIN_QUERY_LENGTH) {
    const fallback = `${title} ${bodyText}`.replace(/\s+/g, " ").trim();
    return fallback.length <= maxLen
      ? fallback
      : `${fallback.slice(0, maxLen - 1).trimEnd()}${ELLIPSIS}`;
  }

  const parsed = parseSearchQuery(trimmed);
  if (!parsed.requiredPhrases.length && !meaningfulTokensFromParsed(parsed).length) {
    return "";
  }

  const corpus = `${title}. ${bodyText}`.replace(/\s+/g, " ").trim();
  const chunks = splitTextIntoExcerptChunks(corpus);
  const ranked = rankChunks(chunks.length ? chunks : [corpus], parsed);

  const terms = highlightTermsForExcerpt(trimmed);

  if (!ranked.length) {
    const fallback = windowTextAroundMatches(
      corpus,
      findMatchSpans(corpus, terms),
      maxLen,
    );
    return ensureExcerptShowsMatch(corpus, terms, fallback, maxLen, trimmed);
  }

  const top = ranked[0]!;
  let primary = "";
  if (top.allMatch || meaningfulTokensFromParsed(parsed).length <= 1) {
    primary = excerptFromChunk(top.chunk, trimmed, maxLen);
  }

  if (!primary) {
    const snippets: string[] = [excerptFromChunk(top.chunk, trimmed, maxLen)];
    const usedTokens = new Set(
      meaningfulTokensFromParsed(parsed).filter((t) => tokenAppearsInChunk(top.chunk, t)),
    );
    const missing = meaningfulTokensFromParsed(parsed).filter((t) => !usedTokens.has(t));

    if (missing.length > 0) {
      for (const row of ranked.slice(1)) {
        if (snippets.length >= 2) {
          break;
        }
        if (missing.some((t) => tokenAppearsInChunk(row.chunk, t))) {
          snippets.push(excerptFromChunk(row.chunk, trimmed, maxLen));
        }
      }
    }
    primary = snippets.join(` ${ELLIPSIS} `);
  }

  return ensureExcerptShowsMatch(corpus, terms, primary, maxLen, trimmed);
}

function textContainsTokenForm(text: string, token: string): boolean {
  const lower = text.toLowerCase();
  for (const form of queryTokenForms(token)) {
    const escaped = form.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const spaced = escaped.replace(/-/g, " ");
    const pattern =
      spaced !== escaped ? `(?:${escaped}|${spaced})` : escaped;
    const regex = new RegExp(`(^|[^a-z0-9])(${pattern})([^a-z0-9]|$)`, "i");
    if (regex.test(lower)) {
      return true;
    }
  }
  const norm = normalizeSearchText(stripTokenEdges(token));
  for (const phrase of SEARCH_TOKEN_PHRASE_ALIASES[norm] ?? []) {
    if (containsExactPhrase(text, phrase)) {
      return true;
    }
  }
  return false;
}

function spanCoversQueryToken(
  text: string,
  span: { start: number; end: number },
  queryTokens: string[],
): boolean {
  const slice = normalizeSearchText(text.slice(span.start, span.end));
  if (!slice) {
    return false;
  }
  for (const token of queryTokens) {
    const forms = tokenMatchForms(token);
    if (forms.some((form) => form === slice)) {
      return true;
    }
    const norm = normalizeSearchText(stripTokenEdges(token));
    for (const phrase of SEARCH_TOKEN_PHRASE_ALIASES[norm] ?? []) {
      if (normalizeSearchText(phrase) === slice) {
        return true;
      }
    }
  }
  return false;
}

function windowAroundLiteralToken(corpus: string, token: string, maxLen: number): string | null {
  const lowerCorpus = corpus.toLowerCase();
  const forms = tokenMatchForms(token).sort((a, b) => b.length - a.length);
  for (const form of forms) {
    const index = lowerCorpus.lastIndexOf(form);
    if (index >= 0) {
      return windowTextAroundMatches(corpus, [{ start: index, end: index + form.length }], maxLen);
    }
  }
  const norm = normalizeSearchText(stripTokenEdges(token));
  for (const phrase of SEARCH_TOKEN_PHRASE_ALIASES[norm] ?? []) {
    const phraseNorm = normalizeSearchText(phrase);
    const index = lowerCorpus.indexOf(phraseNorm);
    if (index >= 0) {
      return windowTextAroundMatches(
        corpus,
        [{ start: index, end: index + phraseNorm.length }],
        maxLen,
      );
    }
  }
  return null;
}

function ensureExcerptShowsMatch(
  corpus: string,
  terms: string[],
  primary: string,
  maxLen: number,
  query: string,
): string {
  const parsed = parseSearchQuery(query);
  const queryTokens = [
    ...meaningfulTokensFromParsed(parsed),
    ...parsed.requiredPhrases.flatMap((p) =>
      p.split(/\s+/).filter((t) => t.length >= MIN_QUERY_LENGTH),
    ),
  ];

  const primaryShowsLiteral = queryTokens.every((token) => textContainsTokenForm(primary, token));
  const primarySpans = primary ? findMatchSpans(primary, terms) : [];
  if (
    primaryShowsLiteral &&
    primarySpans.some((span) => spanCoversQueryToken(primary, span, queryTokens))
  ) {
    return primary;
  }
  const spans = findMatchSpans(corpus, terms);
  const querySpans = spans.filter((span) => spanCoversQueryToken(corpus, span, queryTokens));
  if (querySpans.length > 0) {
    const pick = querySpans[querySpans.length - 1]!;
    return windowTextAroundMatches(corpus, [pick], maxLen);
  }

  const lowerCorpus = corpus.toLowerCase();
  if (!primaryShowsLiteral) {
    for (const token of [...queryTokens].reverse()) {
      const literal = windowAroundLiteralToken(corpus, token, maxLen);
      if (literal) {
        return literal;
      }
    }
  }

  return primary;
}

export function excerptForQueryMatch(
  title: string,
  bodyText: string,
  query: string,
  maxLen = 160,
): string {
  return buildQueryExcerpts({ title, bodyText, query, maxLen });
}

export { highlightTermsForExcerpt };
