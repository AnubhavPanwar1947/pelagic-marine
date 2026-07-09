import { navLinks, newsItems, serviceCategories, sectorDetails } from "./site-data";

export type SearchResult = {
  title: string;
  href: string;
  category: string;
  excerpt?: string;
};

export function buildSearchIndex(): SearchResult[] {
  const pages: SearchResult[] = navLinks.map((link) => ({
    title: link.label,
    href: link.href,
    category: "Page",
  }));

  const services: SearchResult[] = serviceCategories.map((s) => ({
    title: s.title,
    href: "/services",
    category: "Service",
    excerpt: s.summary,
  }));

  const sectors: SearchResult[] = sectorDetails.map((s) => ({
    title: s.title,
    href: "/sectors",
    category: "Sector",
    excerpt: s.summary,
  }));

  const news: SearchResult[] = newsItems.map((n) => ({
    title: n.title,
    href: "/news",
    category: "News",
    excerpt: n.excerpt,
  }));

  const extra: SearchResult[] = [
    {
      title: "About — Pelagic Marine",
      href: "/about",
      category: "Page",
      excerpt: "Who we are — company story, leadership, and approach.",
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
      excerpt: "Mumbai, Dehradun, Dubai — get in touch.",
    },
  ];

  return [...pages, ...services, ...sectors, ...news, ...extra];
}

export function searchSite(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return buildSearchIndex()
    .filter((item) => {
      const haystack = [item.title, item.category, item.excerpt ?? ""]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    })
    .slice(0, limit);
}
