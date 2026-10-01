export type SearchResultGroup = "services" | "articles" | "pages";

export type SearchResult = {
  title: string;
  href: string;
  category: string;
  excerpt?: string;
  keywords?: string;
  breadcrumb?: string;
  group: SearchResultGroup;
  resultKey?: string;
  anchorId?: string;
  relatedReason?: string;
};

export const SEARCH_DEBOUNCE_MS = 150;
export const SEARCH_MIN_QUERY_LENGTH = 2;
export const SEARCH_LAND_TARGET_ID = "search-land-target";
export const SEARCH_OVERLAY_PREVIEW_LIMIT = 8;
export const SEARCH_SUGGESTIONS_LIMIT = 8;

export type SearchFilterTab = "all" | SearchResultGroup;

export const SEARCH_FILTER_TABS: { id: SearchFilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "services", label: "Services" },
  { id: "articles", label: "Articles" },
  { id: "pages", label: "Pages" },
];

export const SEARCH_GROUP_LABELS: Record<SearchResultGroup, string> = {
  services: "Services",
  articles: "Articles",
  pages: "Pages",
};

export const SEARCH_GROUP_ORDER: SearchResultGroup[] = ["services", "articles", "pages"];
