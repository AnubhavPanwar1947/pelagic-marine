import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SiteImage } from "@/components/ui/SiteImage";
import { imageSizes } from "@/lib/image-sizes";
import { getImageObjectPosition } from "@/lib/site-images";
import { teamMembers } from "@/lib/site-data";
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
        />
      </div>

      <section className="team-surface-soft border-b border-pelagic-sand py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {teamMembers.map((member) => {
              const isAbhinav = member.photo.endsWith("/abhinav.png");
              return (
              <article
                key={member.name}
                className={`team-member-card w-full min-w-0 overflow-hidden rounded-3xl border shadow-sm motion-reduce:transition-none${isAbhinav ? " team-member-card--abhinav" : " team-member-card--uniform-portrait"}`}
              >
                <div className="team-member-card__layout grid min-w-0 sm:grid-cols-[14.25rem_minmax(0,1fr)] sm:items-start">
                  <div
                    className="team-member-card__portrait relative aspect-[4/9] w-full min-w-0 shrink-0 overflow-hidden bg-white sm:w-[14.25rem] sm:max-w-[14.25rem]"
                  >
                    <SiteImage
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover"
                      objectPosition={
                        getImageObjectPosition(member.photo) ?? "50% 20%"
                      }
                      sizes={imageSizes.teamPortrait}
                    />
                  </div>
                  <div className="team-member-card__body min-w-0 bg-white">
                    <h2 className="team-member-card__heading-name font-display min-w-0 break-words font-semibold text-[#0e235e]">
                      {member.name}
                    </h2>
                    <p
                      className={
                        isAbhinav
                          ? "team-member-card__heading-role mt-1 text-sm font-semibold text-pelagic-accent"
                          : "mt-1 text-sm font-bold uppercase tracking-wider text-pelagic-accent"
                      }
                    >
                      {member.role}
                    </p>
                    <p className="team-member-card__bio">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </article>
            );
            })}
          </div>
        </div>
      </section>

      <section className="team-surface-icy py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold text-[#0e235e]">
            Work with the people behind the work
          </h2>
          <p className="type-copy mt-4">
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
