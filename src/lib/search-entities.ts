import {
  buildDocumentFields,
  countMatchedQueryTokens,
  documentFieldsMatchQuery,
  partialMatchScore,
  scoreDocumentFields,
  tokenHitField,
  type SearchDocumentFields,
} from "./search-field-index";
import {
  documentMatchesPrefixAutocomplete,
  documentMatchesQuery,
  documentMatchesWithAliasVariants,
  meaningfulTokensFromParsed,
  isSearchStopWord,
  excerptForQueryMatch,
  findTypoVocabularyMatches,
  parseSearchQuery,
  containsExactToken,
  containsTokenWithAliasVariants,
  normalizeSearchText,
  type ParsedSearchQuery,
} from "./search-matching";
import type { SearchResult, SearchResultGroup } from "./search-types";
import { SEARCH_MIN_QUERY_LENGTH, SEARCH_SUGGESTIONS_LIMIT } from "./search-types";
import { CONTACT_PRESENCE_EYEBROW } from "./search-rendered-corpus";
import { company } from "./site-data";
import {
  teamMembers,
  teamPageCta,
  teamPageHero,
  teamPageMetadata,
} from "./team-page-content";
import { teamMemberAnchorId } from "./search-slugs";

export type SearchEntity = {
  resultKey: string;
  title: string;
  href: string;
  category: string;
  breadcrumb?: string;
  excerpt: string;
  searchText: string;
  /** Body copy for snippet generation (excludes keyword stuffing). */
  excerptSource: string;
  searchFields: SearchDocumentFields;
  /** Extra index keywords included in snippet corpus (not shown as card excerpt). */
  snippetKeywords?: string;
  relatedKeywords?: string;
  group: SearchResultGroup;
  anchorId?: string;
};

type IndexedPage = {
  title: string;
  href: string;
  category: string;
  excerpt?: string;
  keywords?: string;
  body?: string;
  group: SearchResultGroup;
  anchors: { id: string; label: string; searchText: string }[];
};

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function pageLevelSearchText(page: IndexedPage): string {
  if (page.href === "/team/") {
    return normalizeWhitespace(
      [
        teamPageMetadata.title,
        teamPageMetadata.description,
        teamPageHero.eyebrow,
        teamPageHero.title,
        teamPageHero.description,
        teamPageCta.heading,
        teamPageCta.buttonLabel,
        page.body ?? "",
        page.keywords ?? "",
      ].join(" "),
    );
  }
  return normalizeWhitespace(
    [page.title, page.excerpt ?? "", page.body ?? "", page.keywords ?? ""].join(" "),
  );
}

function ownEntitySearchText(parts: string[]): string {
  return normalizeWhitespace(parts.join(" "));
}

/** Text used for matching — title plus this entity’s own indexed copy only (no parent keywords). */
export function entityMatchCorpus(entity: Pick<SearchEntity, "title" | "searchText">): string {
  return normalizeWhitespace(`${entity.title} ${entity.searchText}`);
}

function pageHeadingLabel(page: IndexedPage): string {
  if (page.href === "/") {
    return company.heroHeadline;
  }
  if (page.href === "/about/") {
    return "About Us";
  }
  if (page.href === "/contact/") {
    return CONTACT_PRESENCE_EYEBROW;
  }
  if (page.href === "/search/") {
    return "Search";
  }
  if (page.href === "/services/") {
    return "Practices built for the full vessel lifecycle";
  }
  if (/^\/services\/[^/]+\/$/.test(page.href)) {
    return page.title;
  }
  if (page.category === "Legal" || page.category === "Blog") {
    return page.title;
  }
  return page.category;
}

function pageIndexedBody(page: IndexedPage): string {
  if (page.href === "/services/" || /^\/services\/[^/]+\/$/.test(page.href)) {
    return normalizeWhitespace(page.body ?? "");
  }
  if (
    page.href === "/contact/" ||
    page.href === "/about/" ||
    page.href === "/" ||
    page.category === "Legal"
  ) {
    return normalizeWhitespace(page.body ?? "");
  }
  return normalizeWhitespace([page.excerpt ?? "", page.body ?? ""].join(" "));
}

function anchorHeadingLabel(pageHref: string, pageTitle: string, anchorLabel: string): string {
  if (
    pageHref === "/services/" ||
    pageHref === "/contact/" ||
    (pageHref.startsWith("/marine-insights/") && pageHref !== "/marine-insights/")
  ) {
    return anchorLabel;
  }
  return pageTitle;
}

function snippetFromText(text: string, max = 160): string {
  const clean = normalizeWhitespace(text);
  if (clean.length <= max) {
    return clean;
  }
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

function visibleEntityCopy(entity: SearchEntity): string {
  return normalizeWhitespace(
    `${entity.title} ${entity.breadcrumb ?? entity.category} ${entity.excerptSource}`,
  );
}

function exactMatchRelatedReason(
  entity: SearchEntity,
  parsed: ParsedSearchQuery,
): string | undefined {
  const tokens = meaningfulTokensFromParsed(parsed);
  if (!tokens.length) {
    return undefined;
  }
  const corpus = entityMatchCorpus(entity);
  const visible = visibleEntityCopy(entity);
  if (tokens.every((token) => containsExactToken(visible, token))) {
    return undefined;
  }
  if (
    tokens.every(
      (token) =>
        containsExactToken(visible, token) || containsTokenWithAliasVariants(visible, token),
    )
  ) {
    return undefined;
  }

  const keywordHits = tokens.filter(
    (token) => tokenHitField(entity.searchFields, corpus, token) === "keywords",
  );
  if (keywordHits.length === tokens.length) {
    return "Keyword match";
  }

  if (tokens.every((token) => containsTokenWithAliasVariants(corpus, token))) {
    return "Related term match";
  }

  return undefined;
}

function entityToResult(
  entity: SearchEntity,
  query: string,
  relatedReason?: string,
): SearchResult {
  const excerptHeading = normalizeWhitespace(
    [entity.title, entity.category, entity.breadcrumb].filter(Boolean).join(". "),
  );
  const excerpt =
    query.trim().length >= SEARCH_MIN_QUERY_LENGTH
      ? excerptForQueryMatch(excerptHeading, entity.searchText, query)
      : entity.excerpt;
  return {
    title: entity.title,
    href: entity.href,
    category: entity.category,
    excerpt,
    breadcrumb: entity.breadcrumb,
    group: entity.group,
    resultKey: entity.resultKey,
    anchorId: entity.anchorId,
    relatedReason,
  };
}

export function buildSearchEntitiesFromPages(pages: IndexedPage[]): SearchEntity[] {
  const entities: SearchEntity[] = [];

  for (const page of pages) {
    const pageHref = page.href;

    if (pageHref === "/team/") {
      for (const member of teamMembers) {
        const searchText = ownEntitySearchText([
          member.name,
          member.role,
          member.bio,
          ...(member.bioParagraphs ?? []),
        ]);
        const memberBody = ownEntitySearchText([
          member.bio,
          ...(member.bioParagraphs ?? []),
        ]);
        entities.push({
          resultKey: `team-member-${teamMemberAnchorId(member.name)}`,
          title: member.name,
          href: "/team/",
          category: "Team member",
          breadcrumb: `Team › ${member.name}`,
          excerpt: snippetFromText(`${member.role}. ${member.bio}`),
          searchText,
          excerptSource: normalizeWhitespace(`${member.role}. ${memberBody}`),
          searchFields: buildDocumentFields({
            title: member.name,
            heading: member.role,
            body: memberBody,
          }),
          group: "pages",
          anchorId: teamMemberAnchorId(member.name),
        });
      }
      for (const anchor of page.anchors) {
        if (teamMembers.some((m) => teamMemberAnchorId(m.name) === anchor.id)) {
          continue;
        }
        const anchorText = normalizeWhitespace(anchor.searchText);
        entities.push({
          resultKey: `${pageHref}#${anchor.id}`,
          title: anchor.label,
          href: pageHref,
          category: "Team",
          breadcrumb: `Team › ${anchor.label}`,
          excerpt: snippetFromText(anchor.searchText),
          searchText: anchorText,
          excerptSource: anchorText,
          searchFields: buildDocumentFields({
            title: anchor.label,
            heading: "Team",
            body: anchorText,
          }),
          group: page.group,
          anchorId: anchor.id,
        });
      }
      const teamOverviewText = pageLevelSearchText(page);
      const teamBody = normalizeWhitespace(
        [
          teamPageMetadata.description,
          teamPageHero.eyebrow,
          teamPageHero.title,
          teamPageHero.description,
          teamPageCta.heading,
          teamPageCta.buttonLabel,
        ].join(" "),
      );
      entities.push({
        resultKey: "/team/page",
        title: page.title,
        href: "/team/",
        category: page.category,
        breadcrumb: "Team",
        excerpt: page.excerpt ?? snippetFromText(teamOverviewText),
        searchText: teamOverviewText,
        excerptSource: normalizeWhitespace(`${page.title} ${teamBody}`),
        searchFields: buildDocumentFields({
          title: page.title,
          heading: teamPageHero.title,
          body: teamBody,
          keywords: page.keywords,
        }),
        group: page.group,
      });
      continue;
    }

    for (const anchor of page.anchors) {
      const anchorBody = ownEntitySearchText([anchor.searchText]);
      entities.push({
        resultKey: `${pageHref}#${anchor.id}`,
        title: anchor.label,
        href: pageHref,
        category: page.category,
        breadcrumb: `${page.title} › ${anchor.label}`,
        excerpt: snippetFromText(anchor.searchText),
        searchText: ownEntitySearchText([anchor.label, anchor.searchText]),
        excerptSource: normalizeWhitespace(`${anchor.label} ${anchorBody}`),
        searchFields: buildDocumentFields({
          title: anchor.label,
          heading: anchorHeadingLabel(pageHref, page.title, anchor.label),
          body: anchorBody,
        }),
        group: page.group,
        anchorId: anchor.id,
      });
    }

    const pageEntityText = pageLevelSearchText(page);
    const pageBody = pageIndexedBody(page);

    entities.push({
      resultKey: pageHref,
      title: page.title,
      href: pageHref,
      category: page.category,
      breadcrumb: page.title,
      excerpt: page.excerpt ?? snippetFromText(pageEntityText),
      searchText: pageEntityText,
      excerptSource: normalizeWhitespace(`${page.title} ${pageBody}`),
      searchFields: buildDocumentFields({
        title: page.title,
        heading: pageHeadingLabel(page),
        body: pageBody,
        keywords: page.keywords,
      }),
      snippetKeywords: page.keywords,
      group: page.group,
    });
  }

  return entities;
}

/** Distinct non-stop words from all indexed field word sets (for excerpt QA). */
export function collectFieldVocabulary(entities: SearchEntity[]): string[] {
  const words = new Set<string>();
  for (const entity of entities) {
    for (const set of [
      entity.searchFields.titleWords,
      entity.searchFields.headingWords,
      entity.searchFields.bodyWords,
      entity.searchFields.keywordWords,
    ]) {
      for (const word of set) {
        if (word.length >= SEARCH_MIN_QUERY_LENGTH && !isSearchStopWord(word)) {
          words.add(word);
        }
      }
    }
  }
  return [...words].sort();
}

let vocabularyCache: string[] | null = null;

export function getSiteSearchVocabulary(entities: SearchEntity[]): string[] {
  if (vocabularyCache) {
    return vocabularyCache;
  }
  const words = new Set<string>();
  for (const entity of entities) {
    const corpus = normalizeSearchText(entityMatchCorpus(entity));
    for (const word of corpus.split(/[^a-z0-9]+/)) {
      if (word.length >= SEARCH_MIN_QUERY_LENGTH) {
        words.add(word);
      }
    }
  }
  vocabularyCache = [...words].sort();
  return vocabularyCache;
}

function scoreEntity(entity: SearchEntity, parsed: ParsedSearchQuery): number {
  const heading = entity.breadcrumb ?? entity.category;
  const corpus = entityMatchCorpus(entity);
  return scoreDocumentFields(
    entity.title,
    heading,
    entity.searchFields,
    corpus,
    parsed,
  );
}

function matchEntities(
  entities: SearchEntity[],
  query: string,
  mode: "exact" | "alias",
): SearchResult[] {
  const trimmed = query.trim();
  if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) {
    return [];
  }
  const parsed = parseSearchQuery(trimmed);
  if (!parsed.requiredPhrases.length && !parsed.tokens.length) {
    return [];
  }

  const scored = entities
    .map((entity) => {
      const corpus = entityMatchCorpus(entity);
      const matches =
        mode === "exact"
          ? documentFieldsMatchQuery(entity.searchFields, corpus, parsed)
          : documentMatchesWithAliasVariants(corpus, parsed);
      const score = matches ? scoreEntity(entity, parsed) : 0;
      return { entity, score, matches };
    })
    .filter((row) => row.matches && row.score > 0);

  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.entity.title.localeCompare(b.entity.title);
  });

  const seen = new Set<string>();
  const results: SearchResult[] = [];
  for (const row of scored) {
    if (seen.has(row.entity.resultKey)) {
      continue;
    }
    seen.add(row.entity.resultKey);
    const parsedForReason = parseSearchQuery(trimmed);
    results.push(
      entityToResult(
        row.entity,
        trimmed,
        exactMatchRelatedReason(row.entity, parsedForReason),
      ),
    );
  }
  return results;
}

export function searchEntitiesExact(entities: SearchEntity[], query: string): SearchResult[] {
  const trimmed = query.trim();
  if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) {
    return [];
  }
  const parsed = parseSearchQuery(trimmed);
  if (!parsed.requiredPhrases.length && !parsed.tokens.length) {
    return [];
  }

  const exact = matchEntities(entities, query, "exact");
  if (exact.length > 0) {
    return exact;
  }

  const tokens = meaningfulTokensFromParsed(parsed);
  if (!tokens.length) {
    return [];
  }

  const partialScored = entities
    .map((entity) => {
      const corpus = entityMatchCorpus(entity);
      const { matched, total } = countMatchedQueryTokens(entity.searchFields, corpus, parsed);
      if (matched === 0 || matched === total) {
        return null;
      }
      if (entity.category === "Team member" && tokens.length > 1) {
        return null;
      }
      const heading = entity.breadcrumb ?? entity.category;
      const score = partialMatchScore(
        entity.title,
        heading,
        entity.searchFields,
        corpus,
        parsed,
        matched,
      );
      return { entity, score, matched, total };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  partialScored.sort((a, b) => {
    if (b.matched !== a.matched) {
      return b.matched - a.matched;
    }
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.entity.title.localeCompare(b.entity.title);
  });

  const seen = new Set<string>();
  const results: SearchResult[] = [];
  for (const row of partialScored) {
    if (seen.has(row.entity.resultKey)) {
      continue;
    }
    seen.add(row.entity.resultKey);
    results.push(
      entityToResult(
        row.entity,
        trimmed,
        `Partial match (${row.matched} of ${row.total} terms)`,
      ),
    );
  }
  return results;
}

export function searchEntitiesPrefixSuggestions(
  entities: SearchEntity[],
  query: string,
  limit = SEARCH_SUGGESTIONS_LIMIT,
): SearchResult[] {
  const trimmed = query.trim();
  if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) {
    return [];
  }

  const parsed = parseSearchQuery(trimmed);
  const scored = entities
    .map((entity) => {
      const corpus = entityMatchCorpus(entity);
      const matchesPrefix = documentMatchesPrefixAutocomplete(corpus, trimmed);
      if (!matchesPrefix) {
        return null;
      }
      const score = scoreEntity(entity, parsed) + 2;
      return { entity, score };
    })
    .filter((row): row is { entity: SearchEntity; score: number } => row !== null);

  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.entity.title.localeCompare(b.entity.title);
  });

  const seen = new Set<string>();
  const results: SearchResult[] = [];
  for (const row of scored) {
    if (seen.has(row.entity.resultKey)) {
      continue;
    }
    seen.add(row.entity.resultKey);
    results.push(entityToResult(row.entity, trimmed));
    if (results.length >= limit) {
      break;
    }
  }
  return results;
}

export function searchEntitiesRelated(
  entities: SearchEntity[],
  query: string,
  limit = 5,
): SearchResult[] {
  const trimmed = query.trim();
  if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) {
    return [];
  }
  const parsed = parseSearchQuery(trimmed);
  const meaningful = meaningfulTokensFromParsed(parsed);
  if (!meaningful.length && !parsed.requiredPhrases.length) {
    return [];
  }

  const vocabulary = getSiteSearchVocabulary(entities);
  const scored: { entity: SearchEntity; reason: string; score: number }[] = [];
  const seen = new Set<string>();

  const push = (entity: SearchEntity, reason: string, score: number) => {
    if (seen.has(entity.resultKey)) {
      return;
    }
    seen.add(entity.resultKey);
    scored.push({ entity, reason, score });
  };

  if (meaningful.length >= 2) {
    for (const entity of entities) {
      const corpus = entityMatchCorpus(entity);
      if (documentMatchesQuery(corpus, parsed)) {
        continue;
      }
      const allAlias = meaningful.every((token) =>
        containsTokenWithAliasVariants(corpus, token),
      );
      if (allAlias) {
        push(entity, "Spelling or title variant", 500);
      }
    }
  } else {
    for (const entity of entities) {
      const corpus = entityMatchCorpus(entity);
      if (documentMatchesQuery(corpus, parsed)) {
        continue;
      }
      if (documentMatchesWithAliasVariants(corpus, parsed)) {
        push(entity, "Spelling or title variant", 300);
      }
    }
  }

  for (const token of meaningful) {
    const norm = normalizeSearchText(token);
    if (vocabulary.includes(norm)) {
      continue;
    }
    const typoHits = findTypoVocabularyMatches(token, vocabulary);
    for (const hit of typoHits.slice(0, 3)) {
      for (const entity of entities) {
        const corpus = entityMatchCorpus(entity);
        if (containsExactToken(corpus, hit.word)) {
          push(entity, `Did you mean “${hit.word}”?`, 80 - hit.distance);
        }
      }
    }
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.entity.title.localeCompare(b.entity.title);
  });
  return scored.slice(0, limit).map((row) => ({
    ...entityToResult(row.entity, trimmed, row.reason),
    relatedReason: row.reason,
  }));
}

export function resolveEntityAnchorId(
  entities: SearchEntity[],
  result: SearchResult,
  query: string,
): string | null {
  if (result.anchorId) {
    return result.anchorId;
  }
  const trimmed = query.trim();
  if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) {
    return null;
  }
  const parsed = parseSearchQuery(trimmed);
  const pageEntities = entities.filter(
    (e) => e.href === result.href && e.anchorId && e.resultKey !== result.resultKey,
  );
  let best: { id: string; score: number } | null = null;
  for (const entity of pageEntities) {
    const corpus = entityMatchCorpus(entity);
    if (!documentMatchesQuery(corpus, parsed)) {
      continue;
    }
    const score = scoreEntity(entity, parsed);
    if (!best || score > best.score) {
      best = { id: entity.anchorId!, score };
    }
  }
  return best?.id ?? null;
}
