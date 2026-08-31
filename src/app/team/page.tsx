import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SiteImage } from "@/components/ui/SiteImage";
import { teamMembers } from "@/lib/site-data";
import { imageSizes } from "@/lib/image-sizes";
import { siteImages } from "@/lib/site-images";
import "./team-theme.css";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the Pelagic Marine Solutions team: naval architects and Master Mariners across design, engineering, surveys, clean fuels and operations.",
};

export default function TeamPage() {
  return (
    <div className="team-page">
      <div className="team-hero-shell team-surface-icy border-b border-pelagic-sand">
        <PageHero
          eyebrow="Team"
          title="Naval architects and Master Mariners"
          description="A team that has designed structure and stood on deck — so the advice you receive is grounded in both the analysis and the operation."
          imageSrc={siteImages.team}
        />
      </div>

      <section className="team-surface-soft border-b border-pelagic-sand py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="team-member-card overflow-hidden rounded-3xl border shadow-sm motion-reduce:transition-none"
              >
                <div className="grid min-w-0 sm:grid-cols-[minmax(0,11.5rem)_minmax(0,1fr)]">
                  <div className="relative aspect-[3/4] w-full min-w-0 shrink-0 overflow-hidden bg-white sm:aspect-auto sm:h-full sm:min-h-[17rem] sm:max-w-[11.5rem]">
                    <SiteImage
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      sizes={imageSizes.teamPortrait}
                    />
                  </div>
                  <div className="min-w-0 bg-white p-6 sm:p-8">
                    <h2 className="font-display min-w-0 break-words text-2xl font-semibold text-[#0e235e]">
                      {member.name}
                    </h2>
                    <p className="mt-1 text-sm font-bold uppercase tracking-wider text-pelagic-accent">
                      {member.role}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[#364b5e]">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="team-surface-icy py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold text-[#0e235e]">
            Work with the people behind the work
          </h2>
          <p className="mt-4 text-[#364b5e]">
            Tell us what you are facing and we will point it to the right person.
          </p>
          <div className="mt-8">
            <Button href="/contact" variant="primary">
              Contact the team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
