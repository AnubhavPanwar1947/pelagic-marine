/** Legacy service-* slugs → readable slugs (Boss Content Round 1). */
export const SERVICE_SLUG_REDIRECTS: Record<string, string> = {
  "service-design": "design-analysis",
  "service-enganalysis": "engineering-analysis",
  "service-feed": "front-end-engineering-design",
  "service-strength": "global-local-strength",
  "service-fea": "finite-element-analysis",
  "service-shipplans": "ship-plans-drawings",
  "service-conversion": "conversion-upgradation",
  "service-manuals": "manuals-procedures",
  "service-hydro": "hydrodynamic-calculations",
  "service-loadout": "loadout-sea-fastening",
  "service-cfd": "computational-fluid-dynamics",
  "service-heat": "heat-transfer-analysis",
  "service-stability": "stability-calculation",
  "service-survey": "marine-surveys",
  "service-audits": "audits-inspections",
  "service-mws": "marine-warranty-surveys",
};

export function legacyServiceRedirectPath(legacySlug: string): string | null {
  const next = SERVICE_SLUG_REDIRECTS[legacySlug];
  return next ? `/services/${next}/` : null;
}

export function buildServiceSlugVercelRedirects(): {
  source: string;
  destination: string;
  permanent: boolean;
}[] {
  return Object.entries(SERVICE_SLUG_REDIRECTS).map(([from, to]) => ({
    source: `/services/${from}`,
    destination: `/services/${to}/`,
    permanent: true,
  }));
}
