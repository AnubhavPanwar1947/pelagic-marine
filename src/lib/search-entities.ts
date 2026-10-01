import {
  documentMatchesPrefixAutocomplete,
  documentMatchesQuery,
  documentMatchesWithAliasVariants,
  excerptForQueryMatch,
  findTypoVocabularyMatches,
  parseSearchQuery,
  scoreExactDocumentMatch,
  containsExactToken,
  containsTokenWithAliasVariants,
  normalizeSearchText,
  type ParsedSearchQuery,
} from "./search-matching";
import type { SearchResult, SearchResultGroup } from "./search-types";
import { SEARCH_MIN_QUERY_LENGTH, SEARCH_SUGGESTIONS_LIMIT } from "./search-types";
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

function snippetFromText(text: string, max = 160): string {
  const clean = normalizeWhitespace(text);
  if (clean.length <= max) {
    return clean;
  }
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

function entityToResult(
  entity: SearchEntity,
  query: string,
  relatedReason?: string,
): SearchResult {
  const excerpt =
    query.trim().length >= SEARCH_MIN_QUERY_LENGTH
      ? excerptForQueryMatch(entity.title, entity.searchText, query)
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
        const searchText = ownEntitySearchText([`${member.name} ${member.role} ${member.bio}`]);
        entities.push({
          resultKey: `team-member-${teamMemberAnchorId(member.name)}`,
          title: member.name,
          href: "/team/",
          category: "Team member",
          breadcrumb: `Team › ${member.name}`,
          excerpt: snippetFromText(`${member.role}. ${member.bio}`),
          searchText,
          group: "pages",
          anchorId: teamMemberAnchorId(member.name),
        });
      }
      for (const anchor of page.anchors) {
        if (teamMembers.some((m) => teamMemberAnchorId(m.name) === anchor.id)) {
          continue;
        }
        entities.push({
          resultKey: `${pageHref}#${anchor.id}`,
          title: anchor.label,
          href: pageHref,
          category: "Team",
          breadcrumb: `Team › ${anchor.label}`,
          excerpt: snippetFromText(anchor.searchText),
          searchText: normalizeWhitespace(anchor.searchText),
          group: page.group,
          anchorId: anchor.id,
        });
      }
      const teamOverviewText = pageLevelSearchText(page);
      entities.push({
        resultKey: "/team/page",
        title: page.title,
        href: "/team/",
        category: page.category,
        breadcrumb: "Team",
        excerpt: page.excerpt ?? snippetFromText(teamOverviewText),
        searchText: teamOverviewText,
        group: page.group,
      });
      continue;
    }

    for (const anchor of page.anchors) {
      entities.push({
        resultKey: `${pageHref}#${anchor.id}`,
        title: anchor.label,
        href: pageHref,
        category: page.category,
        breadcrumb: `${page.title} › ${anchor.label}`,
        excerpt: snippetFromText(anchor.searchText),
        searchText: ownEntitySearchText([anchor.label, anchor.searchText]),
        group: page.group,
        anchorId: anchor.id,
      });
    }

    const pageEntityText = pageLevelSearchText(page);

    entities.push({
      resultKey: pageHref,
      title: page.title,
      href: pageHref,
      category: page.category,
      breadcrumb: page.title,
      excerpt: page.excerpt ?? snippetFromText(pageEntityText),
      searchText: pageEntityText,
      group: page.group,
    });
  }

  return entities;
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
  return scoreExactDocumentMatch(entity.title, heading, entity.searchText, parsed);
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
          ? documentMatchesQuery(corpus, parsed)
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
    results.push(entityToResult(row.entity, trimmed));
  }
  return results;
}

export function searchEntitiesExact(entities: SearchEntity[], query: string): SearchResult[] {
  return matchEntities(entities, query, "exact");
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
  if (!parsed.tokens.length && !parsed.requiredPhrases.length) {
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

  if (parsed.tokens.length >= 2) {
    let anyFullAlias = false;
    for (const entity of entities) {
      const corpus = entityMatchCorpus(entity);
      if (documentMatchesQuery(corpus, parsed)) {
        continue;
      }
      const matchedTokens = parsed.tokens.filter((token) =>
        containsTokenWithAliasVariants(corpus, token),
      );
      if (matchedTokens.length === parsed.tokens.length) {
        anyFullAlias = true;
        push(entity, "Spelling or title variant", 500);
      } else if (matchedTokens.length >= 2) {
        anyFullAlias = true;
        push(entity, `Matches ${matchedTokens.join(" and ")}`, 320);
      }
    }
    if (!anyFullAlias) {
      for (const entity of entities) {
        const corpus = entityMatchCorpus(entity);
        const matchedTokens = parsed.tokens.filter((token) =>
          containsTokenWithAliasVariants(corpus, token),
        );
        if (matchedTokens.length === 1) {
          const token = matchedTokens[0]!;
          push(entity, `Matches “${token}”`, 120);
        }
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

  for (const token of parsed.tokens) {
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
