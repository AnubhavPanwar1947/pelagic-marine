import {
  capabilitiesSections,
  careers,
  caseStudies,
  company,
  decarbonization,
  newsItems,
  sectorDetails,
  serviceCategories,
  teamMembers,
} from "./site-data";
import { caseStudyAnchorId, decarbPointAnchorId, teamMemberAnchorId } from "./search-slugs";
import { getAllCapabilityTopics, getAllServiceTopics } from "./topic-pages";
import { getServiceCategoryHref, getServiceItemHref } from "./service-slugs";

export type SearchResultGroup = "services" | "articles" | "pages";

export type SearchResult = {
  title: string;
  href: string;
  category: string;
  excerpt?: string;
  keywords?: string;
  group: SearchResultGroup;
};

export const SEARCH_DEBOUNCE_MS = 150;
export const SEARCH_MIN_QUERY_LENGTH = 2;
export const SEARCH_OVERLAY_PREVIEW_LIMIT = 8;
export const SEARCH_SUGGESTIONS_LIMIT = 8;

export type SearchPageAnchor = {
  id: string;
  label: string;
  searchText: string;
};

export const SEARCH_QUICK_LINKS = [
  { label: "Services", href: "/services/" },
  { label: "Projects", href: "/projects/" },
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

export type SearchFilterTab = "all" | SearchResultGroup;

export const SEARCH_FILTER_TABS: { id: SearchFilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "services", label: "Services" },
  { id: "articles", label: "Articles" },
  { id: "pages", label: "Pages" },
];

const PHRASE_SYNONYM_RULES: { pattern: RegExp; replacement: string }[] = [
  { pattern: /\bship design\b/gi, replacement: "naval architecture" },
  { pattern: /\bclean fuel\b/gi, replacement: "lng alternative fuels" },
  { pattern: /\balternative fuels\b/gi, replacement: "lng clean fuel" },
  { pattern: /\bmaster mariners\b/gi, replacement: "master mariner" },
];

const TOKEN_SYNONYMS: Record<string, string[]> = {
  lng: ["clean", "fuel", "alternative", "fuels", "decarbonization", "bunkering"],
  clean: ["fuel", "lng", "alternative", "fuels", "decarbonization"],
  fuel: ["clean", "lng", "alternative", "fuels", "decarbonization"],
  cfd: ["computational", "fluid", "dynamics"],
  survey: ["surveying", "inspection", "audits"],
  surveying: ["survey", "inspection", "audits"],
  inspection: ["survey", "surveying", "audits"],
  mooring: ["optimoor", "compatibility", "terminal"],
  naval: ["architecture", "architect", "design"],
  architecture: ["naval", "design", "architect"],
  design: ["naval", "architecture"],
  mariner: ["mariners", "master"],
  mariners: ["mariner", "master"],
  stability: ["umistab", "loadicator", "intact", "damage"],
  survying: ["surveying", "survey"],
};

export const SEARCH_GROUP_LABELS: Record<SearchResultGroup, string> = {
  services: "Services",
  articles: "Articles",
  pages: "Pages",
};

export const SEARCH_GROUP_ORDER: SearchResultGroup[] = ["services", "articles", "pages"];

type IndexedSearchResult = SearchResult & {
  searchText: string;
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

function stripPunctuation(token: string): string {
  return token.replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, "");
}

function normalizeToken(token: string): string {
  let value = stripPunctuation(token.toLowerCase());
  if (value.endsWith("ies") && value.length > 4) {
    value = `${value.slice(0, -3)}y`;
  } else if (value.endsWith("ing") && value.length > 5) {
    value = value.slice(0, -3);
  } else if (value.endsWith("ed") && value.length > 4) {
    value = value.slice(0, -2);
  } else if (value.endsWith("s") && value.length > 3) {
    value = value.slice(0, -1);
  }
  return value;
}

function expandPhraseSynonyms(query: string): string {
  let expanded = query;
  for (const rule of PHRASE_SYNONYM_RULES) {
    expanded = expanded.replace(rule.pattern, (match) => `${match} ${rule.replacement}`);
  }
  return expanded;
}

function synonymTermsForToken(token: string): string[] {
  const stem = normalizeToken(token);
  const extras = TOKEN_SYNONYMS[stem] ?? TOKEN_SYNONYMS[token.toLowerCase()] ?? [];
  return [token, stem, ...extras];
}

function rawTokensFromQuery(query: string): string[] {
  const withoutQuotes = query.replace(/"([^"]+)"/g, " $1 ");
  const normalized = normalizeWhitespace(withoutQuotes).toLowerCase();
  if (!normalized) {
    return [];
  }
  return normalized
    .split(/\s+/)
    .map(stripPunctuation)
    .filter((token) => token.length >= SEARCH_MIN_QUERY_LENGTH);
}

export function getSearchTokens(query: string): string[] {
  const tokens = rawTokensFromQuery(query);
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const token of tokens) {
    const key = normalizeToken(token);
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(token);
  }
  return unique;
}

export function getHighlightTerms(query: string): string[] {
  const terms = new Set<string>();
  for (const token of rawTokensFromQuery(query)) {
    if (token.length >= SEARCH_MIN_QUERY_LENGTH) {
      terms.add(token);
    }
  }
  const expanded = expandPhraseSynonyms(query);
  for (const token of rawTokensFromQuery(expanded)) {
    if (token.length >= SEARCH_MIN_QUERY_LENGTH) {
      terms.add(token);
    }
    for (const synonym of synonymTermsForToken(token)) {
      if (synonym.length >= SEARCH_MIN_QUERY_LENGTH) {
        terms.add(synonym);
      }
    }
  }
  const phrase = extractExactPhrase(query);
  if (phrase) {
    for (const part of phrase.split(/\s+/)) {
      if (part.length >= SEARCH_MIN_QUERY_LENGTH) {
        terms.add(part);
      }
    }
  }
  return [...terms];
}

function extractExactPhrase(query: string): string | null {
  const quoted = query.match(/"([^"]+)"/);
  if (quoted?.[1]?.trim()) {
    return quoted[1].trim().toLowerCase();
  }
  const trimmed = normalizeWhitespace(query).toLowerCase();
  if (trimmed.includes(" ") && trimmed.length >= SEARCH_MIN_QUERY_LENGTH) {
    return trimmed;
  }
  return null;
}

export function isQueryTooShort(query: string): boolean {
  const trimmed = query.trim();
  if (!trimmed) {
    return false;
  }
  return trimmed.length < SEARCH_MIN_QUERY_LENGTH;
}

function levenshtein(a: string, b: string): number {
  if (a === b) {
    return 0;
  }
  if (!a.length) {
    return b.length;
  }
  if (!b.length) {
    return a.length;
  }
  const row = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j += 1) {
    row[j] = j;
  }
  for (let i = 1; i <= a.length; i += 1) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const temp = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  return row[b.length];
}

function haystackContainsToken(haystack: string, token: string): boolean {
  const lower = haystack.toLowerCase();
  const raw = token.toLowerCase();
  if (lower.includes(raw)) {
    return true;
  }
  const stem = normalizeToken(raw);
  if (stem && lower.includes(stem)) {
    return true;
  }
  if (raw.length < 5) {
    return false;
  }
  const words = lower.split(/[^a-z0-9]+/).filter((word) => word.length >= 4);
  return words.some(
    (word) =>
      levenshtein(word, raw) <= 1 &&
      Math.abs(word.length - raw.length) <= 1 &&
      word.length >= 4,
  );
}

function tokenMatchesHaystack(haystack: string, token: string): boolean {
  return synonymTermsForToken(token).some((term) => haystackContainsToken(haystack, term));
}

function countTokenMatches(haystack: string, tokens: string[]): number {
  return tokens.reduce(
    (count, token) => (tokenMatchesHaystack(haystack, token) ? count + 1 : count),
    0,
  );
}

function scoreResult(item: IndexedSearchResult, query: string, tokens: string[]): number {
  const phrase = extractExactPhrase(query);
  const title = item.title.toLowerCase();
  const haystack = item.searchText.toLowerCase();
  const trimmed = normalizeWhitespace(query).toLowerCase();

  let score = 0;

  if (trimmed && title === trimmed) {
    score += 1200;
  } else if (trimmed && title.includes(trimmed)) {
    score += 700;
  }

  if (phrase && haystack.includes(phrase)) {
    score += 400;
  }

  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (title === lower) {
      score += 500;
    } else if (title.includes(lower)) {
      score += 320;
    } else if (item.excerpt?.toLowerCase().includes(lower)) {
      score += 180;
    } else if (item.keywords?.toLowerCase().includes(lower)) {
      score += 140;
    } else if (tokenMatchesHaystack(haystack, token)) {
      score += 90;
    }
  }

  const matched = countTokenMatches(haystack, tokens);
  score += matched * 40;

  return score;
}

function addIndexEntry(map: Map<string, IndexedSearchResult>, entry: SearchResult & { body?: string }) {
  const href = normalizeHref(entry.href);
  const searchText = normalizeWhitespace(
    [entry.title, entry.category, entry.excerpt ?? "", entry.keywords ?? "", entry.body ?? ""].join(" "),
  );
  const next: IndexedSearchResult = {
    title: entry.title,
    href,
    category: entry.category,
    excerpt: entry.excerpt,
    keywords: entry.keywords,
    group: entry.group,
    searchText,
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
  map.set(href, {
    ...existing,
    excerpt: existing.excerpt ?? entry.excerpt,
    keywords: mergedKeywords || undefined,
    searchText: normalizeWhitespace(`${existing.searchText} ${searchText}`),
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
  appendPageAnchors(
    map,
    "/team/",
    teamMembers.map((member) => ({
      id: teamMemberAnchorId(member.name),
      label: member.name,
      searchText: `${member.name} ${member.role} ${member.bio}`,
    })),
  );

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
    "/projects/",
    caseStudies.map((project) => ({
      id: caseStudyAnchorId(project.title),
      label: project.title,
      searchText: `${project.title} ${project.description} ${project.tags.join(" ")}`,
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
    body: company.sectors.join(" "),
  });

  addIndexEntry(map, {
    title: "About",
    href: "/about/",
    category: "Page",
    excerpt:
      "Pelagic Marine is a naval architecture and marine engineering consultancy in Dubai, serving maritime, offshore, oil & gas and renewables clients worldwide.",
    group: "pages",
  });

  addIndexEntry(map, {
    title: "Services",
    href: "/services/",
    category: "Page",
    excerpt: "Naval architecture, engineering, surveying, mooring, LNG, and fleet support.",
    group: "services",
    body: serviceCategories.map((category) => `${category.title} ${category.summary}`).join(" "),
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
    });
  }

  addIndexEntry(map, {
    title: "Capabilities",
    href: "/capabilities/",
    category: "Page",
    excerpt:
      "ANSYS, NAPA, AutoHydro, Optimoor and SACS; mooring and LNG compatibility analysis; and UMISTAB-X from Pelagic Marine.",
    group: "pages",
    body: capabilitiesSections
      .map((section) => `${section.title} ${section.summary} ${(section.tags ?? []).join(" ")}`)
      .join(" "),
  });

  for (const topic of getAllCapabilityTopics()) {
    addIndexEntry(map, {
      title: topic.title,
      href: `/capabilities/${topic.slug}/`,
      category: "Capability",
      excerpt: topic.summary,
      group: "pages",
      keywords: topic.eyebrow,
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
    title: "Projects",
    href: "/projects/",
    category: "Page",
    excerpt:
      "Marine surveying, LNG bunkering, engineering, and remote compass projects delivered by Pelagic Marine.",
    group: "pages",
    body: caseStudies
      .map((project) => `${project.title} ${project.description} ${project.tags.join(" ")}`)
      .join(" "),
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
    title: "Team",
    href: "/team/",
    category: "Page",
    excerpt:
      "Meet the Pelagic Marine team: naval architects and Master Mariners across design, engineering, surveys, clean fuels and operations.",
    group: "pages",
    body: teamMembers.map((member) => `${member.name} ${member.role} ${member.bio}`).join(" "),
    keywords: "master mariners naval architects",
  });

  addIndexEntry(map, {
    title: "Careers",
    href: "/careers/",
    category: "Page",
    excerpt: careers.summary,
    group: "pages",
    body: careers.perks.join(" "),
    keywords: "jobs hiring master mariners marine engineers naval architects",
  });

  addIndexEntry(map, {
    title: "Contact",
    href: "/contact/",
    category: "Page",
    excerpt: "Mumbai, Dehradun and Dubai — get in touch with Pelagic Marine.",
    group: "pages",
    keywords: "India UAE Dubai offices enquiry",
    body: company.offices.map((office) => `${office.label} ${office.address} ${office.region}`).join(" "),
  });

  addIndexEntry(map, {
    title: "Client login",
    href: "/login/",
    category: "Page",
    excerpt: "Secure client access to the Pelagic Maritime Advisory Platform.",
    group: "pages",
  });

  addIndexEntry(map, {
    title: "Privacy policy",
    href: "/privacy/",
    category: "Legal",
    excerpt: "How Pelagic Marine collects, uses, and protects your information.",
    group: "pages",
  });

  addIndexEntry(map, {
    title: "Cookies policy",
    href: "/cookies/",
    category: "Legal",
    excerpt: "How we use cookies on this website.",
    group: "pages",
  });

  addIndexEntry(map, {
    title: "Terms & conditions",
    href: "/terms/",
    category: "Legal",
    excerpt: "Terms governing use of our website and services.",
    group: "pages",
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

let cachedIndex: IndexedSearchResult[] | null = null;

function getIndexedEntries(): IndexedSearchResult[] {
  if (!cachedIndex) {
    cachedIndex = [...buildIndexedSearchMap().values()];
  }
  return cachedIndex;
}

export function buildSearchIndex(): SearchResult[] {
  return getIndexedEntries().map(({ searchText: _searchText, ...result }) => result);
}

/** Used by route validation scripts. */
export function getSearchIndexHrefs(): string[] {
  return getIndexedEntries().map((item) => item.href);
}

function orderMatchedResults(matched: SearchResult[]): SearchResult[] {
  return SEARCH_GROUP_ORDER.flatMap((group) =>
    matched.filter((item) => item.group === group),
  );
}

export function searchAllMatches(query: string): SearchResult[] {
  const trimmed = query.trim();
  if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) {
    return [];
  }

  const tokens = getSearchTokens(trimmed);
  if (!tokens.length) {
    return [];
  }

  const scored = getIndexedEntries()
    .map((item) => ({
      item,
      score: scoreResult(item, trimmed, tokens),
      matchedCount: countTokenMatches(item.searchText, tokens),
    }))
    .filter((entry) => entry.score > 0 && entry.matchedCount > 0);

  const fullMatches = scored.filter((entry) => entry.matchedCount === tokens.length);
  const pool = fullMatches.length > 0 ? fullMatches : scored;

  pool.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.item.title.localeCompare(b.item.title);
  });

  const seen = new Set<string>();
  const results: SearchResult[] = [];
  for (const entry of pool) {
    const key = entry.item.href;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    const { searchText: _searchText, ...result } = entry.item;
    results.push(result);
  }

  return orderMatchedResults(results);
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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type HighlightPart = { text: string; highlight: boolean };

export function splitTextByHighlights(text: string, query: string): HighlightPart[] {
  const source = String(text ?? "");
  const terms = getHighlightTerms(query)
    .filter((term) => term.length >= SEARCH_MIN_QUERY_LENGTH)
    .sort((a, b) => b.length - a.length);
  if (!source || !terms.length) {
    return [{ text: source, highlight: false }];
  }

  const pattern = terms.map((term) => escapeRegExp(term)).join("|");
  const regex = new RegExp(`(${pattern})`, "gi");
  const parts: HighlightPart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(source)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: source.slice(lastIndex, match.index), highlight: false });
    }
    parts.push({ text: match[0], highlight: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < source.length) {
    parts.push({ text: source.slice(lastIndex), highlight: false });
  }

  return parts.length ? parts : [{ text: source, highlight: false }];
}

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
  const tokens = getSearchTokens(trimmed);
  if (!tokens.length) {
    return null;
  }

  let best: { id: string; score: number } | null = null;
  for (const anchor of entry.anchors) {
    const haystack = anchor.searchText.toLowerCase();
    const matched = countTokenMatches(haystack, tokens);
    if (matched === 0) {
      continue;
    }
    let score = matched * 100;
    for (const token of tokens) {
      const lower = token.toLowerCase();
      if (anchor.label.toLowerCase().includes(lower)) {
        score += 200;
      }
      if (haystack.includes(lower)) {
        score += 80;
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
  const anchorId = resolveBestAnchorId(result.href, trimmed);
  const queryString = params.toString();
  if (anchorId) {
    return `${base}?${queryString}#${anchorId}`;
  }
  return `${base}?${queryString}`;
}

export function textMatchesSearchQuery(
  text: string,
  query: string,
  mode: "all" | "any" = "any",
): boolean {
  const trimmed = query.trim();
  if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) {
    return false;
  }
  const tokens = getSearchTokens(trimmed);
  if (!tokens.length) {
    return false;
  }
  const haystack = text.toLowerCase();
  if (mode === "all") {
    return tokens.every((token) => tokenMatchesHaystack(haystack, token));
  }
  return tokens.some((token) => tokenMatchesHaystack(haystack, token));
}
