export function toSearchAnchorId(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function teamMemberAnchorId(name: string): string {
  return `team-${toSearchAnchorId(name)}`;
}

export function caseStudyAnchorId(title: string): string {
  return `project-${toSearchAnchorId(title)}`;
}

export function decarbPointAnchorId(point: string): string {
  return `decarb-${toSearchAnchorId(point)}`;
}

export const SEARCH_SCROLL_MARGIN_CLASS =
  "scroll-mt-[calc(var(--site-header-height,75px)+1rem)]";
