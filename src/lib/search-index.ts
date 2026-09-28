import { navLinks, newsItems, serviceCategories } from "./site-data";
import { getServiceCategoryHref, getServiceItemHref } from "./service-slugs";

export type SearchFilterId = "all" | "services" | "articles" | "team" | "about" | "legal";

export type SearchFilterGroup = Exclude<SearchFilterId, "all">;

export type SearchResult = {
  title: string;
  href: string;
  category: string;
  excerpt?: string;
  /** When set, the result appears under that filter; otherwise it is only shown under All. */
  filterGroup?: SearchFilterGroup;
};

export const SEARCH_DEBOUNCE_MS = 135;

export const SEARCH_MIN_QUERY_LENGTH = 2;

export const SEARCH_VAGUE_STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

export const SEARCH_FILTER_GROUPS: { id: SearchFilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "services", label: "Services" },
  { id: "articles", label: "Articles" },
  { id: "team", label: "Team" },
  { id: "about", label: "About" },
  { id: "legal", label: "Legal" },
];

function navFilterGroup(href: string): SearchFilterGroup | undefined {
  if (href === "/about") return "about";
  if (href === "/team") return "team";
  if (href === "/news") return "articles";
  if (href === "/services") return "services";
  return undefined;
}

export function buildSearchIndex(): SearchResult[] {
  const pages: SearchResult[] = navLinks.map((link) => ({
    title: link.label,
    href: link.href,
    category: "Page",
    filterGroup: navFilterGroup(link.href),
  }));

  const services: SearchResult[] = serviceCategories.flatMap((s) => [
    {
      title: s.title,
      href: getServiceCategoryHref(s.slug),
      category: "Service",
      excerpt: s.summary,
      filterGroup: "services" as const,
    },
    ...s.items.map((item) => ({
      title: item.label,
      href: getServiceItemHref(item),
      category: s.title,
      excerpt: item.teaser ?? s.summary,
      filterGroup: "services" as const,
    })),
  ]);

  const news: SearchResult[] = newsItems.map((n) => ({
    title: n.title,
    href: `/news/${n.slug}`,
    category: "Blog",
    excerpt: n.excerpt,
    filterGroup: "articles" as const,
  }));

  const extra: SearchResult[] = [
    {
      title: "Computational fluid dynamics",
      href: "/news/computational-fluid-dynamics",
      category: "Blog",
      excerpt: "CFD for hull forms, appendages, and offshore structures.",
      filterGroup: "articles",
    },
    {
      title: "Capabilities — software & tools",
      href: "/capabilities",
      category: "Page",
      excerpt: "ANSYS, NAPA, mooring analysis, LNG compatibility, UMISTAB-X.",
    },
    {
      title: "LNG bunkering & compatibility",
      href: "/capabilities/clean-fuel/",
      category: "Capability",
      excerpt: "Mooring, transfer compatibility, procedures and attendance.",
    },
    {
      title: "Team — naval architects & Master Mariners",
      href: "/team",
      category: "Page",
      excerpt: "Meet the people behind Pelagic Marine.",
      filterGroup: "team",
    },
    {
      title: "Projects — track record",
      href: "/projects",
      category: "Page",
      excerpt: "Surveying, LNG, engineering and fleet support assignments.",
    },
    {
      title: "Decarbonization & clean fuels",
      href: "/decarbonization",
      category: "Page",
      excerpt: "LNG bunkering, FuelEU, and energy transition advisory.",
    },
    {
      title: "Contact & offices",
      href: "/contact",
      category: "Page",
      excerpt: "Mumbai, Dehradun and Dubai — get in touch.",
    },
    {
      title: "Privacy policy",
      href: "/privacy",
      category: "Legal",
      excerpt: "How we collect, use, and protect your information.",
      filterGroup: "legal",
    },
    {
      title: "Cookies policy",
      href: "/cookies",
      category: "Legal",
      excerpt: "How we use cookies on this website.",
      filterGroup: "legal",
    },
    {
      title: "Terms & conditions",
      href: "/terms",
      category: "Legal",
      excerpt: "Terms governing use of our website and services.",
      filterGroup: "legal",
    },
  ];

  return [...pages, ...services, ...news, ...extra];
}

let cachedIndex: SearchResult[] | null = null;

function getSearchIndex(): SearchResult[] {
  if (!cachedIndex) {
    cachedIndex = buildSearchIndex();
  }
  return cachedIndex;
}

export function isKeepTypingQuery(query: string): boolean {
  const trimmed = query.trim();
  if (!trimmed) {
    return false;
  }
  if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) {
    return true;
  }
  const tokens = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
  return tokens.length === 1 && SEARCH_VAGUE_STOPWORDS.has(tokens[0]);
}

function matchesQuery(item: SearchResult, q: string): boolean {
  const haystack = [item.title, item.category, item.excerpt ?? ""]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function filterSearchResultsByGroup(
  items: SearchResult[],
  groupId: SearchFilterId,
): SearchResult[] {
  if (groupId === "all") {
    return items;
  }
  return items.filter((item) => item.filterGroup === groupId);
}

export function countSearchResultsByFilterGroup(items: SearchResult[]) {
  const counts: Record<SearchFilterId, number> = {
    all: items.length,
    services: 0,
    articles: 0,
    team: 0,
    about: 0,
    legal: 0,
  };
  for (const group of ["services", "articles", "team", "about", "legal"] as const) {
    counts[group] = filterSearchResultsByGroup(items, group).length;
  }
  return counts;
}

export function isFilterChipDisabled(
  groupId: SearchFilterId,
  counts: Record<SearchFilterId, number>,
): boolean {
  if (groupId === "all") {
    return false;
  }
  return (counts[groupId] ?? 0) === 0;
}

export function searchSite(query: string, limit = 8): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed || isKeepTypingQuery(trimmed)) {
    return [];
  }

  const q = trimmed.toLowerCase();
  return getSearchIndex()
    .filter((item) => matchesQuery(item, q))
    .slice(0, limit);
}

export function searchSiteAllMatches(query: string): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed || isKeepTypingQuery(trimmed)) {
    return [];
  }
  const q = trimmed.toLowerCase();
  return getSearchIndex().filter((item) => matchesQuery(item, q));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type HighlightPart = { text: string; highlight: boolean };

export function splitTextByHighlights(text: string, query: string): HighlightPart[] {
  const source = String(text ?? "");
  const trimmed = query.trim();
  if (!source || !trimmed || isKeepTypingQuery(trimmed)) {
    return [{ text: source, highlight: false }];
  }

  const tokens = trimmed
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= SEARCH_MIN_QUERY_LENGTH);

  if (!tokens.length) {
    return [{ text: source, highlight: false }];
  }

  const pattern = tokens.map((token) => escapeRegExp(token)).join("|");
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
