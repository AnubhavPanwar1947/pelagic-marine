import { navLinks, newsItems, serviceCategories } from "./site-data";

import { getServiceItemHref } from "./service-slugs";



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



  const services: SearchResult[] = serviceCategories.flatMap((s) => [

    {

      title: s.title,

      href: `/services#${s.slug}`,

      category: "Service",

      excerpt: s.summary,

    },

    ...s.items.map((item) => ({

      title: item.label,

      href: getServiceItemHref(item),

      category: s.title,

      excerpt: item.teaser ?? s.summary,

    })),

  ]);



  const news: SearchResult[] = newsItems.map((n) => ({

    title: n.title,

    href: "/news",

    category: "News",

    excerpt: n.excerpt,

  }));



  const extra: SearchResult[] = [

    {

      title: "Capabilities — software & tools",

      href: "/capabilities",

      category: "Page",

      excerpt: "ANSYS, NAPA, mooring analysis, LNG compatibility, UMISTAB-X.",

    },

    {

      title: "Team — naval architects & Master Mariners",

      href: "/team",

      category: "Page",

      excerpt: "Meet the people behind Pelagic Marine Solutions.",

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

  ];



  return [...pages, ...services, ...news, ...extra];

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

