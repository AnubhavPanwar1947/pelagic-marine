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
    return `/services#${slug}`;
  }
  return `/services#${item.slug}`;
}
