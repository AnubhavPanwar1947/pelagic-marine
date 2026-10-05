import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionMaritime } from "@/components/ui/SectionMaritime";
import {
  getServiceArticleContent,
  isServiceTopic,
} from "@/lib/service-topic-articles";
import {
  getTopicBody,
  getTopicHeroDescription,
  type TopicPage,
} from "@/lib/topic-pages";
import { serviceCategories } from "@/lib/site-data";
import { getServiceItemHref } from "@/lib/service-slugs";

type TopicDetailPageProps = {
  topic: TopicPage;
};

function ServiceTopicArticle({ topic }: { topic: TopicPage }) {
  const article = getServiceArticleContent(topic);

  return (
    <article className="service-topic-article bg-white py-12 sm:py-16 lg:py-20">
      <div className="pelagic-copy-container mx-auto max-w-3xl min-w-0 px-4 sm:px-6 lg:px-8">
        <h1
          className="font-display type-subsection-title--lg min-w-0 break-words font-semibold text-[#0e235e]"
        >
          {topic.title}
        </h1>
        {article.subheading ? (
          <p className="type-copy mt-4 min-w-0 break-words font-semibold text-[#0e235e]">
            {article.subheading}
          </p>
        ) : null}
        {article.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={`type-copy min-w-0 break-words ${index === 0 ? "mt-6" : "mt-6"}`}
          >
            {paragraph}
          </p>
        ))}
        {article.leadIn ? (
          <p className="type-copy mt-6 min-w-0 break-words">{article.leadIn}</p>
        ) : null}
        {article.bullets && article.bullets.length > 0 ? (
          <ul className="type-copy mt-4 list-disc space-y-2 pl-6">
            {article.bullets.map((item) => (
              <li key={item} className="min-w-0 break-words">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        {article.closing ? (
          <p className="type-copy mt-6 min-w-0 break-words">{article.closing}</p>
        ) : null}
        <p className="mt-10">
          <Link
            href="/services/"
            className="text-sm font-semibold text-pelagic-accent hover:underline"
          >
            Back to Services
          </Link>
        </p>
      </div>
    </article>
  );
}

export function TopicDetailPage({ topic }: TopicDetailPageProps) {
  if (isServiceTopic(topic)) {
    return <ServiceTopicArticle topic={topic} />;
  }

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
      />

      <SectionMaritime variant="plain" className="section-py-md" gridOpacity={40}>
        <div className="pelagic-copy-container mx-auto max-w-3xl min-w-0 px-4 sm:px-6 lg:px-8">
          <p className="type-copy">{getTopicBody(topic)}</p>

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
                      <span className="text-xs text-pelagic-copy-muted">{item.teaser}</span>
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
