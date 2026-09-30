import { teamMembers } from "./site-data";
import { teamMemberAnchorId, teamPageCtaAnchorId } from "./search-slugs";

export const teamPageMetadata = {
  title: "Team",
  description:
    "Meet the Pelagic Marine team: naval architects and Master Mariners across design, engineering, surveys, clean fuels and operations.",
} as const;

export const teamPageHero = {
  eyebrow: "Team",
  title: "Naval architects and Master Mariners",
  description:
    "A team that has designed structure and stood on deck — so the advice you receive is grounded in both the analysis and the operation.",
} as const;

export const teamPageCta = {
  anchorId: teamPageCtaAnchorId,
  heading: "Work with the people behind the work",
  buttonLabel: "Contact the team",
  buttonHref: "/contact/",
} as const;

export { teamMembers };

export function teamMemberImageAlt(memberName: string): string {
  return memberName;
}

/** Flat list of every meaningful Team page field used for search integrity checks. */
export function getTeamPageSearchFieldValues(): string[] {
  const memberFields = teamMembers.flatMap((member) => [
    member.name,
    member.role,
    member.bio,
    teamMemberImageAlt(member.name),
  ]);
  return [
    teamPageMetadata.title,
    teamPageMetadata.description,
    teamPageHero.eyebrow,
    teamPageHero.title,
    teamPageHero.description,
    teamPageCta.heading,
    teamPageCta.buttonLabel,
    ...memberFields,
  ];
}

export function buildTeamPageSearchBody(): string {
  const memberText = teamMembers
    .map(
      (member) =>
        `${member.name} ${member.role} ${member.bio} ${teamMemberImageAlt(member.name)}`,
    )
    .join(" ");
  return [
    teamPageHero.eyebrow,
    teamPageHero.title,
    teamPageHero.description,
    teamPageCta.heading,
    teamPageCta.buttonLabel,
    memberText,
  ].join(" ");
}
