import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SiteImage } from "@/components/ui/SiteImage";
import { imageSizes } from "@/lib/image-sizes";
import { getImageObjectPosition } from "@/lib/site-images";
import {
  teamMemberAnchorId,
  SEARCH_SCROLL_MARGIN_CLASS,
} from "@/lib/search-slugs";
import {
  teamMemberImageAlt,
  teamMembers,
  teamPageCta,
  teamPageHero,
  teamPageMetadata,
} from "@/lib/team-page-content";
import "./team-theme.css";

export const metadata: Metadata = {
  title: teamPageMetadata.title,
  description: teamPageMetadata.description,
};

export default function TeamPage() {
  return (
    <div className="team-page">
      <div className="team-hero-shell team-surface-icy border-b border-pelagic-sand">
        <PageHero
          eyebrow={teamPageHero.eyebrow}
          eyebrowClassName="min-w-0 break-words !text-[#0e235e]"
          title={teamPageHero.title}
          description={teamPageHero.description}
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
                id={teamMemberAnchorId(member.name)}
                className={`team-member-card w-full min-w-0 overflow-hidden rounded-3xl border shadow-sm motion-reduce:transition-none ${SEARCH_SCROLL_MARGIN_CLASS}${isAbhinav ? " team-member-card--abhinav" : " team-member-card--uniform-portrait"}`}
              >
                <div className="team-member-card__layout grid min-w-0 sm:grid-cols-[14.25rem_minmax(0,1fr)] sm:items-start">
                  <div
                    className="team-member-card__portrait relative aspect-[4/9] w-full min-w-0 shrink-0 overflow-hidden bg-white sm:w-[14.25rem] sm:max-w-[14.25rem]"
                  >
                    <SiteImage
                      src={member.photo}
                      alt={teamMemberImageAlt(member.name)}
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

      <section
        id={teamPageCta.anchorId}
        className={`team-surface-icy py-20 ${SEARCH_SCROLL_MARGIN_CLASS}`}
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold text-[#0e235e]">
            {teamPageCta.heading}
          </h2>
          <div className="mt-8">
            <Button href={teamPageCta.buttonHref} variant="primary">
              {teamPageCta.buttonLabel}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
