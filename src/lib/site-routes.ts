import { getPublishedServiceItemTopics } from "./topic-pages";

/** Routes that exist in the Boss Content Round 1 site (matches sitemap + search). */
export function getSiteRouteHrefs(): string[] {
  const serviceRoutes = getPublishedServiceItemTopics().map(
    (topic) => `/services/${topic.slug}/`,
  );
  return [
    "/",
    "/about/",
    "/services/",
    "/team/",
    "/marine-insights/",
    "/marine-insights/computational-fluid-dynamics/",
    "/contact/",
    "/privacy-policy/",
    "/disclaimer/",
    "/cookies-policy/",
    "/terms-and-conditions/",
    "/standard-terms-and-conditions-of-engagement/",
    "/search/",
    ...serviceRoutes,
  ];
}

/** Routes removed from this branch — must never appear in search results. */
export const REMOVED_SITE_ROUTES = [
  "/careers/",
  "/projects/",
  "/login/",
  "/capabilities/",
  "/decarbonization/",
  "/sectors/",
  "/services/naval-architecture-design/",
  "/services/engineering/",
  "/services/inspection-audits-surveying/",
  "/services/mooring-compatibility/",
  "/services/loadicator/",
] as const;

export function normalizeSiteHref(href: string): string {
  if (href === "/" || href === "") {
    return "/";
  }
  const path = href.split("#")[0].split("?")[0];
  return path.endsWith("/") ? path : `${path}/`;
}
