/** Old blog/legal paths → current routes (Boss Content Round 1). */
export const LEGACY_SITE_PATH_REDIRECTS: Record<string, string> = {
  "/news": "/marine-insights/",
  "/news/": "/marine-insights/",
  "/news/computational-fluid-dynamics": "/marine-insights/computational-fluid-dynamics/",
  "/news/computational-fluid-dynamics/": "/marine-insights/computational-fluid-dynamics/",
  "/privacy": "/privacy-policy/",
  "/privacy/": "/privacy-policy/",
  "/cookies": "/cookies-policy/",
  "/cookies/": "/cookies-policy/",
  "/terms": "/terms-and-conditions/",
  "/terms/": "/terms-and-conditions/",
  "/engagement": "/standard-terms-and-conditions-of-engagement/",
  "/engagement/": "/standard-terms-and-conditions-of-engagement/",
};

export function legacySitePathRedirect(fromPath: string): string | null {
  const normalized = fromPath.endsWith("/") ? fromPath : `${fromPath}/`;
  const noSlash = normalized.replace(/\/$/, "") || "/";
  return (
    LEGACY_SITE_PATH_REDIRECTS[fromPath] ??
    LEGACY_SITE_PATH_REDIRECTS[normalized] ??
    LEGACY_SITE_PATH_REDIRECTS[noSlash] ??
    null
  );
}

export function buildLegacySiteVercelRedirects(): {
  source: string;
  destination: string;
  permanent: boolean;
}[] {
  const seen = new Set<string>();
  const out: { source: string; destination: string; permanent: boolean }[] = [];
  for (const [from, to] of Object.entries(LEGACY_SITE_PATH_REDIRECTS)) {
    const source = from.endsWith("/") && from.length > 1 ? from.slice(0, -1) : from;
    if (seen.has(source)) {
      continue;
    }
    seen.add(source);
    out.push({ source, destination: to, permanent: true });
    if (!from.endsWith("/")) {
      out.push({ source: `${source}/`, destination: to, permanent: true });
    }
  }
  return out;
}
