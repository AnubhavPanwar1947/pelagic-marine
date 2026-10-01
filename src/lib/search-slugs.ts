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

export const teamPageCtaAnchorId = "team-work-with-the-people";

export const SEARCH_SCROLL_MARGIN_CLASS =
  "scroll-mt-[calc(var(--site-header-height,75px)+1rem)]";
