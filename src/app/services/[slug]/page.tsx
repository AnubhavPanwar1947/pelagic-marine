import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { TopicDetailPage } from "@/components/ui/TopicDetailPage";
import {
  REMOVED_SERVICE_CATEGORY_SLUGS,
  removedServiceCategoryRedirectPath,
} from "@/lib/service-category-slugs";
import {
  SERVICE_SLUG_REDIRECTS,
  legacyServiceRedirectPath,
} from "@/lib/service-slug-redirects";
import { getPublishedServiceItemTopics, getServiceTopic } from "@/lib/topic-pages";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const topics = getPublishedServiceItemTopics().map((topic) => ({ slug: topic.slug }));
  const legacy = Object.keys(SERVICE_SLUG_REDIRECTS).map((slug) => ({ slug }));
  const categories = REMOVED_SERVICE_CATEGORY_SLUGS.map((slug) => ({ slug }));
  return [...topics, ...legacy, ...categories];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getServiceTopic(slug);
  if (!topic) return { title: "Service" };
  return {
    title: topic.title,
    description: topic.summary.slice(0, 160),
  };
}

export default async function ServiceTopicPage({ params }: PageProps) {
  const { slug } = await params;
  const categoryRedirect = removedServiceCategoryRedirectPath(slug);
  if (categoryRedirect) {
    permanentRedirect(categoryRedirect);
  }
  const redirectPath = legacyServiceRedirectPath(slug);
  if (redirectPath) {
    permanentRedirect(redirectPath);
  }
  const topic = getServiceTopic(slug);
  if (!topic) notFound();

  return <TopicDetailPage topic={topic} />;
}
