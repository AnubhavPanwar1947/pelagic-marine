import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionMaritime } from "@/components/ui/SectionMaritime";
import {
  getTopicBody,
  getTopicHeroDescription,
  type TopicPage,
} from "@/lib/topic-pages";
import { serviceCategories } from "@/lib/site-data";
import { getServiceItemHref } from "@/lib/service-slugs";
import { siteImages } from "@/lib/site-images";

type TopicDetailPageProps = {
  topic: TopicPage;
  imageSrc?: string;
};

export function TopicDetailPage({
  topic,
  imageSrc = siteImages.pageHeroes.services,
}: TopicDetailPageProps) {
  const category =
    topic.kind === "service-category"
      ? serviceCategories.find((c) => c.slug === topic.slug)
      : undefined;

  return (
    <div>
      <PageHero
        eyebrow={topic.eyebrow}
        title={topic.title}
        description={getTopicHeroDescription(topic)}
        imageSrc={imageSrc}
      />

      <SectionMaritime variant="plain" className="py-20 lg:py-24" gridOpacity={40}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-base leading-8 text-pelagic-steel">{getTopicBody(topic)}</p>

          {category && category.items.length > 0 ? (
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {category.items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={getServiceItemHref(item)}
                    className="flex flex-col gap-1 rounded-2xl border border-pelagic-sand bg-white px-5 py-4 text-sm transition hover:border-pelagic-accent/40 hover:shadow-sm"
                  >
                    <span className="font-semibold text-pelagic-ink">{item.label}</span>
                    {item.teaser ? (
                      <span className="text-xs text-pelagic-steel">{item.teaser}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Button href="/contact" variant="primary">
              Enquire about {topic.title}
            </Button>
            <Link
              href={topic.parentHref}
              className="text-sm font-semibold text-pelagic-accent hover:underline"
            >
              ← {topic.parentLabel}
            </Link>
          </div>
        </div>
      </SectionMaritime>
    </div>
  );
}
