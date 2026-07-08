import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";
import { caseStudies } from "@/lib/site-data";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Marine surveying, LNG bunkering, engineering, and remote compass projects delivered by Pelagic Marine Solutions.",
};

export default function ProjectsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Projects"
        title="Track record across oceans and ports"
        description="Selected assignments in surveying, LNG operations, engineering, and fleet support."
      />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {caseStudies.map((project, i) => (
            <Reveal key={project.title} delay={i * 80}>
              <article className="card-premium overflow-hidden rounded-3xl border border-pelagic-sand bg-white shadow-sm">
                <div className="relative aspect-[16/10]">
                  <SiteImage
                    src={siteImages.cases[i] ?? siteImages.cases[0]}
                    alt={project.title}
                    fill
                    brandOverlay
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-pelagic-gold">
                    {project.location}
                  </p>
                  <h2 className="font-display mt-2 text-lg font-semibold text-pelagic-ink">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-pelagic-slate">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-pelagic-sand px-3 py-1 text-xs font-medium text-pelagic-steel"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-pelagic-gold px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-pelagic-gold-light"
          >
            Discuss your project
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
