/**
 * Visible on-page copy used for search indexing and drift checks.
 * Keep in sync with rendered routes — do not index dormant / unmounted UI data.
 */
import { CONTACT_MAILTO_NOTICE } from "./contact-mailto-fallback";
import {
  buildAboutPageSearchBody,
  buildHomePageSearchBody,
  buildNewsPageSearchBody,
} from "./page-search-content";
import {
  buildCookiesPageSearchBody,
  buildDisclaimerPageSearchBody,
  buildEngagementPageSearchBody,
  buildPrivacyPageSearchBody,
  buildTermsPageSearchBody,
} from "./legal-page-search-content";
import { getPublishedServiceItemTopics } from "./topic-pages";
import { getServiceArticleContent } from "./service-topic-articles";
import type { SearchEntity } from "./search-entities";
import { contactPage, getOfficeById, serviceCategories } from "./site-data";
import {
  teamMembers,
  teamMemberImageAlt,
  teamPageCta,
  teamPageHero,
  teamPageMetadata,
} from "./team-page-content";
import { teamMemberAnchorId } from "./search-slugs";

/** Matches ContactOurPresenceSection eyebrow (not contactPage.hero). */
export const CONTACT_PRESENCE_EYEBROW = "Our presence";

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Contact route: presence cards + enquiry form only. */
export function buildContactRenderedBody(): string {
  return normalizeWhitespace(
    [
      CONTACT_PRESENCE_EYEBROW,
      "Dubai",
      "India",
      "Singapore",
      "Japan — Associate Office",
      getOfficeById("dubai").address,
      getOfficeById("dehradun").address,
      "12 Woodlands Square, #06-74, Woods Square, Singapore 737715",
      "4-54-6 UTSUKUSHIGAOKA, AOBA WARD, YOKOHAMA CITY -225-0002",
      contactPage.form.eyebrow,
      "Name",
      "First",
      "Last",
      "Email",
      contactPage.form.labels.message,
      contactPage.form.submit,
      CONTACT_MAILTO_NOTICE,
    ].join(" "),
  );
}

export function buildContactEnquiryAnchorBody(): string {
  return normalizeWhitespace(
    [
      contactPage.form.eyebrow,
      "Name",
      "First",
      "Last",
      "Email",
      contactPage.form.labels.message,
      contactPage.form.submit,
      CONTACT_MAILTO_NOTICE,
    ].join(" "),
  );
}

function serviceArticlePlainText(slug: string): string {
  const topic = getPublishedServiceItemTopics().find((t) => t.slug === slug);
  if (!topic) {
    return "";
  }
  const content = getServiceArticleContent(topic);
  return normalizeWhitespace(
    [
      content.subheading ?? "",
      ...content.paragraphs,
      content.leadIn ?? "",
      ...(content.bullets ?? []),
      content.closing ?? "",
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function servicesHubRenderedBody(): string {
  return normalizeWhitespace(
    [
      "Practices built for the full vessel lifecycle",
      "Concept design structural analysis surveys audits mooring studies and cargo planning the same engineering rigour whichever practice you need",
      ...serviceCategories.flatMap((category) => [
        category.title,
        category.summary,
        ...category.items.map((item) => `${item.label} ${item.teaser ?? ""}`),
      ]),
    ].join(" "),
  );
}

function servicesAnchorBody(anchorId: string): string {
  for (const category of serviceCategories) {
    if (category.slug === anchorId) {
      return normalizeWhitespace(`${category.title} ${category.summary}`);
    }
    const item = category.items.find((i) => i.slug === anchorId);
    if (item) {
      return normalizeWhitespace(`${item.label} ${item.teaser ?? ""} ${category.title}`);
    }
  }
  if (anchorId === "umistab") {
    return "UMISTAB-X loadicator capabilities class-approved bulk carrier stability";
  }
  return "";
}

function cfdArticleAnchorBody(anchorId: string): string {
  if (anchorId === "cfd-measurable-impact") {
    return "Where CFD Creates Measurable Impact CFD computational fluid dynamics measurable impact resistance";
  }
  if (anchorId === "total-resistance-equation") {
    return "Total Resistance total resistance still water wave wind CFD";
  }
  return "";
}

function legalBodyForHref(href: string): string {
  switch (href.replace(/\/$/, "") || "/") {
    case "/privacy-policy":
      return buildPrivacyPageSearchBody();
    case "/cookies-policy":
      return buildCookiesPageSearchBody();
    case "/terms-and-conditions":
      return buildTermsPageSearchBody();
    case "/disclaimer":
      return buildDisclaimerPageSearchBody();
    case "/standard-terms-and-conditions-of-engagement":
      return buildEngagementPageSearchBody();
    default:
      return "";
  }
}

/**
 * Main-content visible copy for an indexed entity (excludes site chrome / footer).
 */
export function renderedVisibleCorpusForEntity(entity: SearchEntity): string {
  const href = entity.href.endsWith("/") ? entity.href : `${entity.href}/`;

  if (entity.category === "Team member" && entity.anchorId) {
    const member = teamMembers.find((m) => teamMemberAnchorId(m.name) === entity.anchorId);
    if (member) {
      return normalizeWhitespace(
        [
          member.name,
          member.role,
          member.bio,
          ...(member.bioParagraphs ?? []),
          teamMemberImageAlt(member),
        ].join(" "),
      );
    }
  }

  if (entity.anchorId) {
    if (href === "/contact/" && entity.anchorId === "enquiry-form") {
      return buildContactEnquiryAnchorBody();
    }
    if (href === "/team/" && entity.anchorId === teamPageCta.anchorId) {
      return normalizeWhitespace(`${teamPageCta.heading} ${teamPageCta.buttonLabel}`);
    }
    if (href === "/services/") {
      const anchorBody = servicesAnchorBody(entity.anchorId);
      if (anchorBody) {
        return anchorBody;
      }
    }
    if (href === "/services/umistab-x/" && entity.anchorId === "umistab") {
      return servicesAnchorBody("umistab");
    }
    if (href === "/marine-insights/computational-fluid-dynamics/") {
      const cfd = cfdArticleAnchorBody(entity.anchorId);
      if (cfd) {
        return cfd;
      }
    }
    return normalizeWhitespace(entity.excerptSource);
  }

  switch (href) {
    case "/":
      return buildHomePageSearchBody();
    case "/about/":
      return buildAboutPageSearchBody();
    case "/contact/":
      return buildContactRenderedBody();
    case "/marine-insights/":
      return buildNewsPageSearchBody();
    case "/team/":
      return normalizeWhitespace(
        [
          teamPageMetadata.title,
          teamPageMetadata.description,
          teamPageHero.eyebrow,
          teamPageHero.title,
          teamPageHero.description,
          teamPageCta.heading,
          teamPageCta.buttonLabel,
          ...teamMembers.flatMap((member) => [
            member.name,
            member.role,
            member.bio,
            ...(member.bioParagraphs ?? []),
            teamMemberImageAlt(member),
          ]),
        ].join(" "),
      );
    case "/services/":
      return servicesHubRenderedBody();
    default:
      break;
  }

  if (href.startsWith("/services/") && href !== "/services/") {
    const slug = href.replace(/^\/services\//, "").replace(/\/$/, "");
    return serviceArticlePlainText(slug);
  }

  const legal = legalBodyForHref(href);
  if (legal) {
    return legal;
  }

  return normalizeWhitespace(entity.excerptSource);
}

/** Indexed body text should match rendered corpus (single source for page builders). */
export function indexedBodyForPageHref(href: string): string | undefined {
  const key = href.endsWith("/") ? href : `${href}/`;
  switch (key) {
    case "/":
      return buildHomePageSearchBody();
    case "/about/":
      return buildAboutPageSearchBody();
    case "/contact/":
      return buildContactRenderedBody();
    case "/marine-insights/":
      return buildNewsPageSearchBody();
    default:
      return undefined;
  }
}
