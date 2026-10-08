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
    "A team that has a unique blend of engineering application and operational excellence, built on years of varied experience.",
} as const;

export const teamPageCta = {
  anchorId: teamPageCtaAnchorId,
  heading: "Work with the people behind the work",
  buttonLabel: "Contact the team",
  buttonHref: "/contact/",
} as const;

export { teamMembers };

export function teamMemberImageAlt(member: {
  name: string;
  role: string;
}): string {
  return `${member.name}, ${member.role}`;
}

export function teamMemberBioParagraphs(member: {
  bio: string;
  bioParagraphs?: string[];
}): string[] {
  if (member.bioParagraphs?.length) {
    return member.bioParagraphs;
  }
  return [member.bio];
}

/** Flat list of every meaningful Team page field used for search integrity checks. */
export function getTeamPageSearchFieldValues(): string[] {
  const memberFields = teamMembers.flatMap((member) => [
    member.name,
    member.role,
    member.bio,
    teamMemberImageAlt(member),
    ...(member.bioParagraphs ?? []),
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
    .map((member) => {
      const bios = [member.bio, ...(member.bioParagraphs ?? [])].join(" ");
      return `${member.name} ${member.role} ${bios} ${teamMemberImageAlt(member)}`;
    })
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
