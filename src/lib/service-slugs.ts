import type { ServiceItem } from "./site-data";

/** URL-safe anchor id for a service sub-item label */
export function getServiceItemSlug(label: string) {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getServiceItemHref(item: ServiceItem | string, serviceSlug?: string) {
  if (typeof item === "string") {
    const slug = serviceSlug
      ? `${serviceSlug}-${getServiceItemSlug(item)}`
      : getServiceItemSlug(item);
    return `/services/${slug}/`;
  }
  return `/services/${item.slug}/`;
}

/** Section anchor on the main Services page (category landing URLs are not published). */
export function getServiceCategorySectionHref(slug: string) {
  return `/services/#${slug}`;
}

/** @deprecated Use getServiceCategorySectionHref — category paths redirect to /services/ */
export function getServiceCategoryHref(slug: string) {
  return `/services/${slug}/`;
}
