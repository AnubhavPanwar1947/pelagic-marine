import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicDetailPage } from "@/components/ui/TopicDetailPage";
import { getAllCapabilityTopics, getCapabilityTopic } from "@/lib/topic-pages";
import { siteImages } from "@/lib/site-images";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllCapabilityTopics().map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getCapabilityTopic(slug);
  if (!topic) return { title: "Capability" };
  return {
    title: topic.title,
    description: topic.summary.slice(0, 160),
  };
}

export default async function CapabilityTopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = getCapabilityTopic(slug);
  if (!topic) notFound();

  return <TopicDetailPage topic={topic} imageSrc={siteImages.expertise} />;
}
