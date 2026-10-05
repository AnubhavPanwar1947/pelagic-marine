import { company, contactPage, serviceCategories } from "./site-data";

/** Visible copy from the home page (hero + about band) for search indexing. */
export function buildHomePageSearchBody(): string {
  const homeServiceList = serviceCategories.filter((service) => service.home !== false);
  const homeServices = homeServiceList
    .map((service) => `${service.title} ${service.summary}`)
    .join(" ");
  const homeServiceItems = homeServiceList
    .flatMap((service) => service.items.slice(0, 4).map((item) => item.label))
    .join(" ");
  return [
    company.name,
    "Dubai, India, and Singapore",
    company.heroHeadline,
    company.heroSubline,
    "Start a consultation",
    "Services",
    "Four practices, one standard",
    homeServices,
    homeServiceItems,
    "Explore all services Read more",
    "Pelagic Marine brings naval architects and Master Mariners together to deliver design engineering and quality assurance in real marine operations. Across maritime offshore oil and gas and renewables we combine licensed analysis tools with decades of sea-going and project experience.",
    company.sectors.join(" "),
    "TRACK RECORD",
    "Proven across the fleet port to port",
    "A register of representative assignments the breadth of vessels tools and fuels Pelagic Marine has engineered analysed and surveyed for owners operators and charterers",
    "Total projects delivered",
    "Project cargo carriages",
    "Detailed engineering studies",
    "Stability assessments",
    "Clients Trusted across the fleet",
    "Let's Talk Connect with us for your varied needs Connect now",
    "Know more About us",
    "Marine consultant bridge overlooking port at golden hour",
    "Who we are",
  ].join(" ");
}

/** Visible copy from the About page for search indexing. */
export function buildAboutPageSearchBody(): string {
  return [
    "About Us",
    "Pelagic marine was formed in year 2021 by young entrepreneurs from the shipping and engineering fraternity with wide range of experience in vessel operations, ship surveying, Engineering, offshore operations, dry and wet cargo handling. The company was formed to act as a one stop shop for various shipping industry centric solution. The core team consists of experienced Master Mariners. We provide professional services to our clients from mainline shipping, oil and gas industry, offshore industry and renewable energy sector.",
    "Maritime and shipping surveys warranty cargo fleet technical support",
    "Offshore oil and gas mooring FPSO marine warranty",
    "Renewables energy transition offshore wind ports infrastructure berth compatibility",
    "What guides us",
    "Our mission",
    "Our mission is to transform the shipping industry into a sustainable and progressive industry.",
    "We do this by the application of engineering principles, innovation, and technology.",
    "Our vision",
    "Our vision is to be a leader in marine surveying, engineering, and design.",
    "Values",
    "Sustainable shipping and innovation.",
    "Integrity and customer satisfaction are core values of our organization.",
    "Marine office desk with a ship model, technical blueprint, and harbor view.",
  ].join(" ");
}

export function buildContactPageSearchBody(): string {
  return [
    contactPage.hero.eyebrow,
    contactPage.hero.fitStatement,
    contactPage.hero.imageAlt,
    ...contactPage.hero.stats.map((s) => `${s.value} ${s.label}`),
    ...contactPage.hero.credentials,
    contactPage.companyInfo.eyebrow,
    ...contactPage.companyInfo.officeLines,
    contactPage.emergency.label,
    contactPage.emergency.detail,
    ...contactPage.intentPaths.map((p) => `${p.title} ${p.description} ${p.cta}`),
    ...contactPage.expectations,
    contactPage.sla.standard,
    contactPage.sla.urgent,
    contactPage.sla.avgLabel,
    contactPage.sla.avgValue,
    ...contactPage.accreditations.map((a) => `${a.label} ${a.detail}`),
    contactPage.form.privacyNotice,
    contactPage.form.submit,
    contactPage.form.successMessage,
    contactPage.form.eyebrow,
    ...Object.values(contactPage.form.labels),
    ...contactPage.form.subjects,
    ...contactPage.form.offices.map((o) => o.label),
    ...contactPage.quickIntake.map((q) => `${q.label} ${q.messageHint}`),
    ...contactPage.faq.map((f) => `${f.question} ${f.answer}`),
    company.phones.india,
    company.phones.uae.replace(/\s/g, ""),
    "789 503 9068 971 50 394 1049",
    "Reach out",
    "Visit",
    "Mail",
    company.emails.info,
    company.emails.career,
    "careers jobs hiring apply career applications",
    "client login maritime advisory platform secure access",
    contactPage.companyInfo.website,
    "website",
    "last",
    "name",
  ].join(" ");
}
