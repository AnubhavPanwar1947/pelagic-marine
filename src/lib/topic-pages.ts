import { serviceCategories, type ServiceItem } from "./site-data";

export type TopicPage = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  /** Where the “back” link goes */
  parentHref: string;
  parentLabel: string;
  kind: "service-item" | "service-category";
};

const PLACEHOLDER =
  "Detailed content for this topic is being prepared. In the meantime, contact our team to discuss scope, vessel details and delivery timelines.";

function categoryTopics(): TopicPage[] {
  return serviceCategories.map((category) => ({
    slug: category.slug,
    title: category.title,
    eyebrow: "Services",
    summary: category.summary,
    parentHref: "/services/",
    parentLabel: "All services",
    kind: "service-category" as const,
  }));
}

function itemTopics(): TopicPage[] {
  return serviceCategories.flatMap((category) =>
    category.items.map((item: ServiceItem) => ({
      slug: item.slug,
      title: item.label,
      eyebrow: category.title,
      summary: item.teaser ?? `Overview of ${item.label}.`,
      parentHref: `/services/#${category.slug}`,
      parentLabel: category.title,
      kind: "service-item" as const,
    })),
  );
}

/** Short placeholder body used on detail pages (separate from hero summary). */
export function getTopicBody(topic: TopicPage) {
  if (topic.kind === "service-item") {
    return PLACEHOLDER;
  }
  const category = serviceCategories.find((c) => c.slug === topic.slug);
  const names = category?.items.map((i) => i.label).join(", ");
  return names
    ? `${PLACEHOLDER} Related offerings include: ${names}.`
    : PLACEHOLDER;
}

export function getAllServiceTopics(): TopicPage[] {
  return [...categoryTopics(), ...itemTopics()];
}

/** Service item pages only — excludes removed category landing URLs. */
export function getPublishedServiceItemTopics(): TopicPage[] {
  return itemTopics();
}

export function getServiceTopic(slug: string): TopicPage | undefined {
  return getPublishedServiceItemTopics().find((t) => t.slug === slug);
}

export function getTopicHeroDescription(topic: TopicPage) {
  return topic.summary;
}
