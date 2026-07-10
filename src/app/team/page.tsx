import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { teamMembers } from "@/lib/site-data";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the Pelagic Marine Solutions team: naval architects and Master Mariners across design, engineering, surveys, clean fuels and operations.",
};

export default function TeamPage() {
  return (
    <div>
      <PageHero
        eyebrow="Team"
        title="Naval architects and Master Mariners"
        description="A team that has designed structure and stood on deck — so the advice you receive is grounded in both the analysis and the operation."
        imageSrc={siteImages.team}
      />

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="rounded-3xl border border-pelagic-mist bg-white p-8 shadow-sm"
            >
              <h2 className="font-display text-2xl font-semibold text-pelagic-ink">
                {member.name}
              </h2>
              <p className="mt-1 text-sm font-bold uppercase tracking-wider text-pelagic-gold">
                {member.role}
              </p>
              <p className="mt-4 text-sm leading-7 text-pelagic-steel">{member.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-pelagic-cream py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold text-pelagic-ink">
            Work with the people behind the work
          </h2>
          <p className="mt-4 text-pelagic-steel">
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
