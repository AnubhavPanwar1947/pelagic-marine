import {
  capabilitiesSections,
  careers,
  company,
  contactPage,
  decarbonization,
  newsItems,
  sectorDetails,
  serviceCategories,
  teamMembers,
} from "./site-data";
import { decarbPointAnchorId, teamMemberAnchorId } from "./search-slugs";
import {
  buildTeamPageSearchBody,
  teamPageHero,
  teamPageMetadata,
  teamPageCta,
} from "./team-page-content";
import {
  buildSearchEntitiesFromPages,
  resolveEntityAnchorId,
  searchEntitiesExact,
  searchEntitiesPrefixSuggestions,
  searchEntitiesRelated,
  type SearchEntity,
} from "./search-entities";
import {
  containsExactPhrase,
  containsExactToken,
  countExactTokenMatches,
  documentMatchesQuery,
  highlightTermsFromQuery,
  parseSearchQuery,
  splitTextByHighlights,
} from "./search-matching";
import { SEARCH_LAND_TARGET_ID } from "./search-types";
import {
  buildAboutPageSearchBody,
  buildCapabilitiesHubSearchBody,
  buildCareersPageSearchBody,
  buildContactPageSearchBody,
  buildHomePageSearchBody,
  buildLoginPageSearchBody,
} from "./page-search-content";
import {
  buildCookiesPageSearchBody,
  buildDisclaimerPageSearchBody,
  buildEngagementPageSearchBody,
  buildPrivacyPageSearchBody,
  buildTermsPageSearchBody,
} from "./legal-page-search-content";
import {
  SEARCH_DEBOUNCE_MS,
  SEARCH_FILTER_TABS,
  SEARCH_GROUP_LABELS,
  SEARCH_GROUP_ORDER,
  SEARCH_MIN_QUERY_LENGTH,
  SEARCH_OVERLAY_PREVIEW_LIMIT,
  SEARCH_SUGGESTIONS_LIMIT,
  type SearchFilterTab,
  type SearchResult,
  type SearchResultGroup,
} from "./search-types";
import { getServiceArticleContent } from "./service-topic-articles";
import { getAllCapabilityTopics, getAllServiceTopics, getTopicBody } from "./topic-pages";
import { getServiceCategoryHref, getServiceItemHref } from "./service-slugs";

export type { SearchFilterTab, SearchResult, SearchResultGroup } from "./search-types";
export {
  SEARCH_DEBOUNCE_MS,
  SEARCH_FILTER_TABS,
  SEARCH_GROUP_LABELS,
  SEARCH_GROUP_ORDER,
  SEARCH_MIN_QUERY_LENGTH,
  SEARCH_OVERLAY_PREVIEW_LIMIT,
  SEARCH_SUGGESTIONS_LIMIT,
} from "./search-types";

export type SearchPageAnchor = {
  id: string;
  label: string;
  searchText: string;
};

export const SEARCH_QUICK_LINKS = [
  { label: "Services", href: "/services/" },
  { label: "Team", href: "/team/" },
  { label: "Capabilities", href: "/capabilities/" },
  { label: "Contact", href: "/contact/" },
] as const;

export const SEARCH_POPULAR = [
  "LNG",
  "Surveying",
  "Naval architecture",
  "Mooring analysis",
  "Computational fluid dynamics",
] as const;

type IndexedSearchResult = SearchResult & {
  body?: string;
  anchors: SearchPageAnchor[];
};

function normalizeHref(href: string): string {
  if (href === "/" || href === "") {
    return "/";
  }
  const path = href.split("#")[0].split("?")[0];
  return path.endsWith("/") ? path : `${path}/`;
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function matchTokensForQuery(query: string): string[] {
  const parsed = parseSearchQuery(query);
  if (parsed.tokens.length) {
    return parsed.tokens;
  }
  return parsed.requiredPhrases.flatMap((phrase) =>
    phrase.split(/\s+/).filter((part) => part.length >= SEARCH_MIN_QUERY_LENGTH),
  );
}

export function getSearchTokens(query: string): string[] {
  return matchTokensForQuery(query);
}

export function getHighlightTerms(query: string): string[] {
  return highlightTermsFromQuery(query);
}

export function isQueryTooShort(query: string): boolean {
  const trimmed = query.trim();
  if (!trimmed) {
    return false;
  }
  return trimmed.length < SEARCH_MIN_QUERY_LENGTH;
}

function serviceArticlePlainText(topic: ReturnType<typeof getAllServiceTopics>[number]): string {
  const content = getServiceArticleContent(topic);
  return normalizeWhitespace(
    [
      content.subheading ?? "",
      ...content.paragraphs,
      content.leadIn ?? "",
      ...(content.bullets ?? []),
      content.closing ?? "",
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function addIndexEntry(map: Map<string, IndexedSearchResult>, entry: SearchResult & { body?: string }) {
  const href = normalizeHref(entry.href);
  const next: IndexedSearchResult = {
    title: entry.title,
    href,
    category: entry.category,
    excerpt: entry.excerpt,
    keywords: entry.keywords,
    group: entry.group,
    body: entry.body,
    anchors: [],
  };
  const existing = map.get(href);
  if (!existing) {
    map.set(href, next);
    return;
  }
  const mergedKeywords = normalizeWhitespace(
    [existing.keywords ?? "", entry.keywords ?? ""].filter(Boolean).join(" "),
  );
  const mergedBody = normalizeWhitespace([existing.body ?? "", entry.body ?? ""].filter(Boolean).join(" "));
  map.set(href, {
    ...existing,
    excerpt: existing.excerpt ?? entry.excerpt,
    keywords: mergedKeywords || undefined,
    body: mergedBody || undefined,
    anchors: existing.anchors,
  });
}

function appendPageAnchors(map: Map<string, IndexedSearchResult>, href: string, anchors: SearchPageAnchor[]) {
  const key = normalizeHref(href);
  const entry = map.get(key);
  if (!entry || !anchors.length) {
    return;
  }
  entry.anchors.push(...anchors);
}

function registerStructuredAnchors(map: Map<string, IndexedSearchResult>) {
  appendPageAnchors(map, "/team/", [
    ...teamMembers.map((member) => ({
      id: teamMemberAnchorId(member.name),
      label: member.name,
      searchText: `${member.name} ${member.role} ${member.bio}`,
    })),
    {
      id: teamPageCta.anchorId,
      label: teamPageCta.heading,
      searchText: `${teamPageCta.heading} ${teamPageCta.buttonLabel}`,
    },
  ]);

  appendPageAnchors(
    map,
    "/capabilities/",
    capabilitiesSections.map((section) => ({
      id: section.id,
      label: section.title,
      searchText: `${section.title} ${section.summary} ${(section.tags ?? []).join(" ")}`,
    })),
  );

  appendPageAnchors(
    map,
    "/sectors/",
    sectorDetails.map((sector) => ({
      id: sector.slug,
      label: sector.title,
      searchText: `${sector.title} ${sector.summary}`,
    })),
  );

  appendPageAnchors(
    map,
    "/decarbonization/",
    decarbonization.points.map((point) => ({
      id: decarbPointAnchorId(point),
      label: point,
      searchText: point,
    })),
  );

  appendPageAnchors(map, "/contact/", [
    {
      id: "office-dubai",
      label: "Dubai office",
      searchText: "Dubai UAE office Al Raffa Dehradun Mumbai India",
    },
    {
      id: "office-india",
      label: "India offices",
      searchText: "India Mumbai Dehradun phone mobilisation",
    },
  ]);

  appendPageAnchors(
    map,
    "/services/",
    serviceCategories.flatMap((category) => [
      {
        id: category.slug,
        label: category.title,
        searchText: `${category.title} ${category.summary}`,
      },
      ...category.items.map((item) => ({
        id: item.slug,
        label: item.label,
        searchText: `${item.label} ${item.teaser ?? ""} ${category.title}`,
      })),
    ]),
  );

  appendPageAnchors(map, "/news/computational-fluid-dynamics/", [
    {
      id: "cfd-measurable-impact",
      label: "Where CFD Creates Measurable Impact",
      searchText: "CFD computational fluid dynamics measurable impact resistance",
    },
    {
      id: "total-resistance-equation",
      label: "Total Resistance",
      searchText: "total resistance still water wave wind CFD",
    },
  ]);
}

function buildIndexedSearchMap(): Map<string, IndexedSearchResult> {
  const map = new Map<string, IndexedSearchResult>();

  addIndexEntry(map, {
    title: company.name,
    href: "/",
    category: "Home",
    excerpt: company.tagline,
    keywords: `${company.heroHeadline} ${company.heroSubline}`,
    group: "pages",
    body: buildHomePageSearchBody(),
  });

  addIndexEntry(map, {
    title: "About",
    href: "/about/",
    category: "Page",
    excerpt:
      "Pelagic Marine is a naval architecture and marine engineering consultancy in Dubai, serving maritime, offshore, oil & gas and renewables clients worldwide.",
    group: "pages",
    body: buildAboutPageSearchBody(),
  });

  addIndexEntry(map, {
    title: "Services",
    href: "/services/",
    category: "Page",
    excerpt: "Naval architecture, engineering, surveying, mooring, LNG, and fleet support.",
    group: "services",
    body: [
      "Practices built for the full vessel lifecycle",
      "Concept design structural analysis surveys audits mooring studies and loading tools the same engineering rigour whichever practice you need",
      ...serviceCategories.flatMap((category) => [
        category.title,
        category.summary,
        ...category.items.map((item) => `${item.label} ${item.teaser ?? ""}`),
      ]),
    ].join(" "),
  });

  for (const category of serviceCategories) {
    addIndexEntry(map, {
      title: category.title,
      href: getServiceCategoryHref(category.slug),
      category: "Service",
      excerpt: category.summary,
      group: "services",
      body: category.items.map((item) => `${item.label} ${item.teaser ?? ""}`).join(" "),
    });
    for (const item of category.items) {
      addIndexEntry(map, {
        title: item.label,
        href: getServiceItemHref(item),
        category: category.title,
        excerpt: item.teaser ?? category.summary,
        group: "services",
      });
    }
  }

  for (const topic of getAllServiceTopics()) {
    addIndexEntry(map, {
      title: topic.title,
      href: `/services/${topic.slug}/`,
      category: topic.kind === "service-category" ? "Service" : topic.eyebrow,
      excerpt: topic.summary,
      group: "services",
      body: serviceArticlePlainText(topic),
    });
  }

  addIndexEntry(map, {
    title: "Capabilities",
    href: "/capabilities/",
    category: "Page",
    excerpt:
      "ANSYS, NAPA, AutoHydro, Optimoor and SACS; mooring and LNG compatibility analysis; and UMISTAB-X from Pelagic Marine.",
    group: "pages",
    body: buildCapabilitiesHubSearchBody(),
  });

  for (const topic of getAllCapabilityTopics()) {
    addIndexEntry(map, {
      title: topic.title,
      href: `/capabilities/${topic.slug}/`,
      category: "Capability",
      excerpt: topic.summary,
      group: "pages",
      keywords: topic.eyebrow,
      body: `${topic.summary} ${getTopicBody(topic)}`,
    });
  }

  addIndexEntry(map, {
    title: "Sectors",
    href: "/sectors/",
    category: "Page",
    excerpt: "Maritime, offshore, renewables, and ports — sector expertise from Pelagic Marine.",
    group: "pages",
    body: sectorDetails.map((sector) => `${sector.title} ${sector.summary}`).join(" "),
  });

  addIndexEntry(map, {
    title: "Decarbonization & clean fuels",
    href: "/decarbonization/",
    category: "Page",
    excerpt: decarbonization.summary,
    group: "pages",
    keywords: "lng clean fuel alternative fuels fueleu bunkering",
    body: decarbonization.points.join(" "),
  });

  const newsBody = [
    ...newsItems.map((item) => `${item.title} ${item.excerpt} ${item.category}`),
    "Computational Fluid Dynamics CFD resistance fuel efficiency retrofit",
  ].join(" ");

  addIndexEntry(map, {
    title: "Marine Insights",
    href: "/news/",
    category: "Blog",
    excerpt:
      "Articles on marine engineering, inspections, surveying, offshore operations, and maritime advisory topics.",
    group: "articles",
    body: newsBody,
    keywords: "India UAE Dubai advisory expansion",
  });

  addIndexEntry(map, {
    title: "Computational Fluid Dynamics",
    href: "/news/computational-fluid-dynamics/",
    category: "Blog",
    excerpt:
      "3% resistance reduction and structured CFD for total resistance, energy-saving devices, and multiphase simulation.",
    keywords: "cfd computational fluid dynamics resistance fuel efficiency",
    group: "articles",
  });

  addIndexEntry(map, {
    title: teamPageMetadata.title,
    href: "/team/",
    category: "Page",
    excerpt: teamPageMetadata.description,
    group: "pages",
    body: buildTeamPageSearchBody(),
    keywords: `${teamPageHero.title} ${teamPageHero.eyebrow} Master Mariners naval architects`,
  });

  addIndexEntry(map, {
    title: "Careers",
    href: "/careers/",
    category: "Page",
    excerpt: careers.summary,
    group: "pages",
    body: buildCareersPageSearchBody(),
    keywords: "jobs hiring master mariners marine engineers naval architects",
  });

  addIndexEntry(map, {
    title: "Contact",
    href: "/contact/",
    category: "Page",
    excerpt: "Mumbai, Dehradun and Dubai — get in touch with Pelagic Marine.",
    group: "pages",
    keywords: "India UAE Dubai offices enquiry",
    body: buildContactPageSearchBody(),
  });

  addIndexEntry(map, {
    title: "Client login",
    href: "/login/",
    category: "Page",
    excerpt: "Secure client access to the Pelagic Maritime Advisory Platform.",
    group: "pages",
    body: buildLoginPageSearchBody(),
  });

  addIndexEntry(map, {
    title: "Privacy policy",
    href: "/privacy/",
    category: "Legal",
    excerpt: "How Pelagic Marine collects, uses, and protects your information.",
    group: "pages",
    body: buildPrivacyPageSearchBody(),
    keywords: "Personal Data PDPL GDPR privacy cookies consent",
  });

  addIndexEntry(map, {
    title: "Cookies policy",
    href: "/cookies/",
    category: "Legal",
    excerpt: "How we use cookies on this website.",
    group: "pages",
    body: buildCookiesPageSearchBody(),
    keywords: "cookies tracking analytics preferences",
  });

  addIndexEntry(map, {
    title: "Terms & conditions",
    href: "/terms/",
    category: "Legal",
    excerpt: "Terms governing use of our website and services.",
    group: "pages",
    body: buildTermsPageSearchBody(),
    keywords: "sanctions export control trade restrictions website terms",
  });

  addIndexEntry(map, {
    title: "Disclaimer",
    href: "/disclaimer/",
    category: "Legal",
    excerpt: "General information only — not project-specific professional advice.",
    group: "pages",
    body: buildDisclaimerPageSearchBody(),
    keywords:
      "legal review general information marine consultancy surveying engineering no professional advice naval architecture regulatory accuracy updates case studies illustrative Standard Terms engagement Aghaadir",
  });

  addIndexEntry(map, {
    title: "Standard Terms and Conditions of Engagement",
    href: "/engagement/",
    category: "Legal",
    excerpt: "Standard terms of engagement for Pelagic Marine consultancy services.",
    group: "pages",
    body: buildEngagementPageSearchBody(),
    keywords:
      "Engagement Letter Agreement Client Company Services Warranty Survey Pre-purchase Survey interpretation basis of contract fees liability marine warranty surveyor recommendations engagement sanctions",
  });

  addIndexEntry(map, {
    title: "Search",
    href: "/search/",
    category: "Page",
    excerpt: "Search services, articles, and pages across Pelagic Marine.",
    group: "pages",
  });

  registerStructuredAnchors(map);

  return map;
}

let cachedPages: IndexedSearchResult[] | null = null;
let cachedEntities: SearchEntity[] | null = null;

function getIndexedEntries(): IndexedSearchResult[] {
  if (!cachedPages) {
    cachedPages = [...buildIndexedSearchMap().values()];
  }
  return cachedPages;
}

function getSearchEntities(): SearchEntity[] {
  if (!cachedEntities) {
    cachedEntities = buildSearchEntitiesFromPages(
      getIndexedEntries().map((page) => ({
        title: page.title,
        href: page.href,
        category: page.category,
        excerpt: page.excerpt,
        keywords: page.keywords,
        body: page.body,
        group: page.group,
        anchors: page.anchors,
      })),
    );
  }
  return cachedEntities;
}

export function buildSearchIndex(): SearchResult[] {
  return getSearchEntities().map((entity) => ({
    title: entity.title,
    href: entity.href,
    category: entity.category,
    excerpt: entity.excerpt,
    breadcrumb: entity.breadcrumb,
    group: entity.group,
    resultKey: entity.resultKey,
    anchorId: entity.anchorId,
  }));
}

/** Used by route validation scripts. */
export function getSearchIndexHrefs(): string[] {
  return getIndexedEntries().map((item) => item.href);
}

export function getIndexedTeamSearchText(): string {
  return getSearchEntities()
    .filter((entity) => entity.href === "/team/")
    .map((entity) => entity.searchText)
    .join(" ");
}

export function searchSuggestionMatches(query: string, limit = SEARCH_SUGGESTIONS_LIMIT): SearchResult[] {
  return searchPrefixSuggestionMatches(query, limit);
}

export function searchPrefixSuggestionMatches(
  query: string,
  limit = SEARCH_SUGGESTIONS_LIMIT,
): SearchResult[] {
  const exactKeys = new Set(searchAllMatches(query).map((item) => item.resultKey ?? item.href));
  const prefix = searchEntitiesPrefixSuggestions(getSearchEntities(), query, limit * 2);
  const merged: SearchResult[] = [];
  const seen = new Set<string>();
  for (const item of prefix) {
    const key = item.resultKey ?? item.href;
    if (seen.has(key) || exactKeys.has(key)) {
      continue;
    }
    seen.add(key);
    merged.push(item);
    if (merged.length >= limit) {
      break;
    }
  }
  return merged;
}

export function searchRelatedMatches(query: string, limit = 5): SearchResult[] {
  const exact = searchAllMatches(query);
  if (exact.length > 0) {
    return [];
  }
  return searchEntitiesRelated(getSearchEntities(), query, limit);
}

export function searchAllMatches(query: string): SearchResult[] {
  return searchEntitiesExact(getSearchEntities(), query);
}

export function filterResultsByTab(
  items: SearchResult[],
  tab: SearchFilterTab,
): SearchResult[] {
  if (tab === "all") {
    return items;
  }
  return items.filter((item) => item.group === tab);
}

export function countResultsByTab(items: SearchResult[]): Record<SearchFilterTab, number> {
  return {
    all: items.length,
    services: items.filter((item) => item.group === "services").length,
    articles: items.filter((item) => item.group === "articles").length,
    pages: items.filter((item) => item.group === "pages").length,
  };
}

export function isSearchFilterTabDisabled(
  tab: SearchFilterTab,
  counts: Record<SearchFilterTab, number>,
): boolean {
  if (tab === "all") {
    return false;
  }
  return (counts[tab] ?? 0) === 0;
}

export function searchSite(query: string, limit = SEARCH_OVERLAY_PREVIEW_LIMIT): SearchResult[] {
  return searchAllMatches(query).slice(0, limit);
}

export function groupSearchResults(items: SearchResult[]): Record<SearchResultGroup, SearchResult[]> {
  const grouped: Record<SearchResultGroup, SearchResult[]> = {
    services: [],
    articles: [],
    pages: [],
  };
  for (const item of items) {
    grouped[item.group].push(item);
  }
  return grouped;
}

export type HighlightPart = { text: string; highlight: boolean };

export { splitTextByHighlights };

export function buildSearchResultsHref(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) {
    return "/search/";
  }
  return `/search/?q=${encodeURIComponent(trimmed)}`;
}

function getIndexedEntryForHref(href: string): IndexedSearchResult | undefined {
  const key = normalizeHref(href);
  return getIndexedEntries().find((item) => item.href === key);
}

export function resolveBestAnchorId(href: string, query: string): string | null {
  const trimmed = query.trim();
  if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) {
    return null;
  }
  const entry = getIndexedEntryForHref(href);
  if (!entry?.anchors.length) {
    return null;
  }
  const parsed = parseSearchQuery(trimmed);
  const tokens = matchTokensForQuery(trimmed);
  if (!parsed.requiredPhrases.length && !tokens.length) {
    return null;
  }

  let best: { id: string; score: number } | null = null;
  for (const anchor of entry.anchors) {
    const haystack = anchor.searchText;
    if (!documentMatchesQuery(haystack, parsed)) {
      continue;
    }
    const matched = countExactTokenMatches(haystack, tokens);
    let score = matched * 100;
    for (const token of tokens) {
      if (containsExactToken(anchor.label, token)) {
        score += 200;
      }
      if (containsExactToken(haystack, token)) {
        score += 80;
      }
    }
    for (const phrase of parsed.requiredPhrases) {
      if (haystack.toLowerCase().includes(phrase)) {
        score += 150;
      }
    }
    if (!best || score > best.score) {
      best = { id: anchor.id, score };
    }
  }

  return best?.id ?? null;
}

export function buildSearchDestinationHref(result: SearchResult, query: string): string {
  const trimmed = query.trim();
  const base = normalizeHref(result.href);
  if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) {
    return base;
  }
  const params = new URLSearchParams();
  params.set("q", trimmed);
  const anchorId =
    result.anchorId ??
    resolveEntityAnchorId(getSearchEntities(), result, trimmed) ??
    resolveBestAnchorId(result.href, trimmed);
  const queryString = params.toString();
  if (anchorId) {
    return `${base}?${queryString}#${anchorId}`;
  }
  const excerpt = result.excerpt?.trim();
  if (excerpt) {
    params.set("land", excerpt.length > 180 ? excerpt.slice(0, 180) : excerpt);
  }
  const withLand = params.toString();
  return `${base}?${withLand}#${SEARCH_LAND_TARGET_ID}`;
}

export function textMatchesSearchQuery(
  text: string,
  query: string,
  mode: "all" | "any" = "all",
): boolean {
  const trimmed = query.trim();
  if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) {
    return false;
  }
  const parsed = parseSearchQuery(trimmed);
  if (mode === "all") {
    return documentMatchesQuery(text, parsed);
  }
  const tokens = matchTokensForQuery(trimmed);
  if (parsed.requiredPhrases.some((phrase) => containsExactPhrase(text, phrase))) {
    return true;
  }
  return tokens.some((token) => containsExactToken(text, token));
}
