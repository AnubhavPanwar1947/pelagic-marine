/** Standalone category landing pages removed — sections live on /services/ only. */
export const REMOVED_SERVICE_CATEGORY_SLUGS = [
  "naval-architecture-design",
  "engineering",
  "inspection-audits-surveying",
  "mooring-compatibility",
  "loadicator",
] as const;

export type RemovedServiceCategorySlug = (typeof REMOVED_SERVICE_CATEGORY_SLUGS)[number];

export function isRemovedServiceCategorySlug(slug: string): boolean {
  return (REMOVED_SERVICE_CATEGORY_SLUGS as readonly string[]).includes(slug);
}

export function removedServiceCategoryRedirectPath(slug: string): string | null {
  return isRemovedServiceCategorySlug(slug) ? "/services/" : null;
}
