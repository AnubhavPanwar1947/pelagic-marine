export type OfficeRegion = "India" | "UAE";

export type Office = {
  label: string;
  address: string;
  region: OfficeRegion;
  phone: string;
  /** Building-focused query for Google Maps search links */
  mapQuery: string;
  /** Verified pin coordinates for embedded maps */
  coordinates: { lat: number; lng: number };
  hq?: boolean;
};

export const company = {
  name: "Pelagic Marine Solutions",
  legalName: "Pelagic Marine Consultants and Surveyors",
  tagline: "Delivering marine and engineering consultancy round the clock.",
  heroHeadline: "Expert marine consultancy. Any hour. Any ocean.",
  heroSubline:
    "Surveying, engineering, LNG support & maritime legal — one team across India and Dubai.",
  sectors: ["Maritime", "Offshore", "Oil & Gas", "Renewables"],
  phones: {
    india: "+91 7895039068",
    uae: "+971-503-941-049",
  },
  emails: {
    info: "info@pelagic-marine.com",
    career: "career@pelagic-marine.com",
  },
  offices: [
    {
      label: "India — Mumbai",
      address: "18th Floor, Cyber One, Sector 30, Vashi, Navi Mumbai 400703",
      region: "India",
      phone: "+91 7895039068",
      mapQuery: "Cyber One, Sector 30, Vashi, Navi Mumbai",
      coordinates: { lat: 19.07598, lng: 72.99876 },
    },
    {
      label: "India — Dehradun (HQ)",
      address: "3/11 D, 2nd Floor Gyan Tower, Garhi Cantonment, Dehradun 248001",
      region: "India",
      phone: "+91 7895039068",
      mapQuery: "Gyan Tower, Garhi Cantonment, Dehradun",
      coordinates: { lat: 30.32528, lng: 78.04417 },
      hq: true,
    },
    {
      label: "UAE — Dubai",
      address: "Office No. 104, Almas Business Center, Aghaadir Building, Al Raffa, Dubai",
      region: "UAE",
      phone: "+971-503-941-049",
      mapQuery: "Almas Business Center, Al Raffa, Dubai",
      coordinates: { lat: 25.25443, lng: 55.28639 },
    },
  ] satisfies Office[],
  founded: 2021,
  linkedin: "https://www.linkedin.com/company/pelagic-marine-solutions/",
};

export const navLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/sectors", label: "Sectors" },
  { href: "/projects", label: "Projects" },
  { href: "/decarbonization", label: "Decarbonization" },
  { href: "/news", label: "News" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export type NavDropdownChild = {
  href: string;
  label: string;
  description?: string;
};

export type NavMenuItem =
  | { type: "link"; href: string; label: string }
  | {
      type: "dropdown";
      label: string;
      href: string;
      children: NavDropdownChild[];
    };

export const sectorDetails = [
  {
    title: "Maritime & Shipping",
    slug: "maritime-shipping",
    summary:
      "Surveys, warranty work, cargo operations, and fleet technical support for owners, managers, and P&I clubs.",
  },
  {
    title: "Offshore & Oil & Gas",
    slug: "offshore-oil-gas",
    summary:
      "Mooring analysis, FPSO/SBM assessments, loadout, marine warranty, and operational engineering.",
  },
  {
    title: "Renewables & Energy Transition",
    slug: "renewables",
    summary:
      "Offshore wind support, clean fuels advisory, and decarbonisation pathway planning.",
  },
  {
    title: "Ports & Infrastructure",
    slug: "ports-infrastructure",
    summary:
      "Berth compatibility, dredging support, port engineering, and marine construction assurance.",
  },
];

export const decarbonization = {
  headline: "Supporting the voyage to cleaner seas",
  summary:
    "From LNG bunkering compatibility to FuelEU compliance and alternative fuels strategy — we help owners and operators navigate the energy transition with practical, regulation-ready advice.",
  points: [
    "LNG bunkering compatibility review & onboard supervision",
    "Clean fuels and FuelEU advisory",
    "Operational efficiency and emissions reduction planning",
    "Renewable energy and offshore wind marine support",
  ],
};

export const newsItems = [
  {
    title: "Pelagic expands 24/7 marine advisory across India and UAE",
    category: "Company",
    date: "2026-06-15",
    excerpt:
      "Our Master Mariners and engineers now provide round-the-clock surveying and technical support from Mumbai, Dehradun, and Dubai.",
    slug: "24-7-advisory-expansion",
  },
  {
    title: "Remote magnetic compass adjustment — 100+ vessels served",
    category: "Projects",
    date: "2026-05-20",
    excerpt:
      "Cost-effective, compliant compass deviation adjustments delivered remotely for fleets worldwide — no onboard attendance required.",
    slug: "remote-compass-milestone",
  },
  {
    title: "LNG bunkering supervision at Singapore Anchorage",
    category: "LNG",
    date: "2026-04-08",
    excerpt:
      "Full operational oversight for maiden LNG bunkering of a dual-fuel tanker, including compatibility review and joint operations meetings.",
    slug: "lng-bunkering-singapore",
  },
];

export const careers = {
  headline: "Join our team — shape the future of marine consultancy",
  summary:
    "We hire Master Mariners, marine engineers, naval architects, and maritime professionals who want to deliver quality service across surveying, engineering, and legal advisory.",
  perks: [
    "Work on global projects from India and Dubai",
    "Collaborate with experienced mariners and engineers",
    "Grow into the Maritime Advisory Platform (coming soon)",
  ],
  applyEmail: "career@pelagic-marine.com",
};

export const stats = [
  { value: "100+", label: "Remote compass adjustments" },
  { value: "24/7", label: "Global advisory support" },
  { value: "3", label: "Office locations" },
  { value: "2021", label: "Founded by mariners & engineers" },
];

export const serviceCategories = [
  {
    title: "Inspection, Audits & Surveying",
    slug: "inspection-audits-surveying",
    summary:
      "Marine surveys, warranty surveys, damage and loss prevention, risk assessment, and chemical cargo handling.",
    items: [
      "Marine & condition surveys",
      "Marine warranty surveys",
      "Loss prevention & damage surveys",
      "Flag state & internal audits",
      "Pre-purchase inspection & valuation",
      "Remote magnetic compass deviation",
    ],
  },
  {
    title: "Naval Architecture & Design",
    slug: "naval-architecture-design",
    summary:
      "Design, analysis, and engineering studies for vessels, berths, and offshore assets.",
    items: [
      "FEED & engineering analysis",
      "Global & local strength analysis",
      "Finite element analysis",
      "Mooring compatibility assessment",
      "Ship plans & drawings",
      "Stability solutions",
    ],
  },
  {
    title: "Engineering",
    slug: "engineering",
    summary:
      "Technical engineering for conversions, cargo operations, hydrodynamics, and project delivery.",
    items: [
      "Conversion & upgradation",
      "Manuals & procedures",
      "Hydrodynamic calculations & CFD",
      "Loadout & sea fastening",
      "Heat transfer analysis",
      "Project cargo planning",
    ],
  },
  {
    title: "LNG & Alternative Fuels",
    slug: "lng-alternative-fuels",
    summary:
      "Specialist support for LNG bunkering, compatibility reviews, and the transition to clean fuels.",
    items: [
      "LNG bunkering compatibility review",
      "On-site bunkering supervision",
      "Joint operations meeting support",
      "FuelEU & clean fuels advisory",
      "Operational safety & compliance",
      "Decarbonisation pathway support",
    ],
  },
  {
    title: "Legal Consultancy",
    slug: "legal-consultancy",
    summary:
      "Maritime legal experts for contracts, disputes, insurance, and ship arrests.",
    items: [
      "Vessel sale & carriage contracts",
      "Insurance & trade contracts",
      "Pre-litigation disputes",
      "Ship arrests & court representation",
      "Document validation & translation",
      "Loss prevention claims",
    ],
  },
  {
    title: "Vessel Operations",
    slug: "vessel-operations",
    summary:
      "Operational support for dry and wet cargo, mooring, and offshore marine projects.",
    items: [
      "Dry & wet cargo handling",
      "Mooring & berthing analysis",
      "SBM / FPSO assessments",
      "Offshore operations support",
      "Incident & feasibility studies",
      "HSEQ & compliance preparation",
    ],
  },
];

export const caseStudies = [
  {
    title: "LNG bunkering — MV Arctic Tern",
    location: "Singapore Anchorage",
    description:
      "Maiden LNG bunkering supervision for a dual-fuel tanker including compatibility review, joint ops meetings, and onboard operational oversight.",
    tags: ["LNG", "Bunkering", "Operations"],
  },
  {
    title: "Remote compass deviation",
    location: "Global fleet support",
    description:
      "Remote magnetic compass adjustment for 100+ vessels — compliant, cost-effective, and delivered without onboard attendance.",
    tags: ["Compliance", "Remote service"],
  },
  {
    title: "Engineering & stability",
    location: "International projects",
    description:
      "Structural design, mooring compatibility, CFD analysis, and stability solutions delivered for ship owners and energy operators.",
    tags: ["Naval architecture", "CFD"],
  },
];

export const highlights = [
  {
    title: "LNG bunkering supervision",
    description:
      "Supported maiden LNG bunkering for a dual-fuel tanker at Singapore Anchorage with full operational oversight.",
  },
  {
    title: "Remote compass service",
    description:
      "Remote magnetic compass deviation adjustment completed for 100+ vessels — no onboard attendance required.",
  },
  {
    title: "One-stop consultancy",
    description:
      "Master Mariners, marine engineers, naval architects, and maritime lawyers under one roof.",
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Consult & scope",
    text: "Understand your vessel, voyage, contract, or legal matter and define a clear scope of work.",
  },
  {
    step: "02",
    title: "Expert delivery",
    text: "Deploy Master Mariners, engineers, naval architects, or maritime lawyers as required.",
  },
  {
    step: "03",
    title: "Documented outcomes",
    text: "Receive auditable reports, calculations, and recommendations grounded in regulation and practice.",
  },
  {
    step: "04",
    title: "Ongoing support",
    text: "24/7 availability from India and Dubai for follow-up, disputes, and operational guidance.",
  },
];

export const trustBadges = [
  "ISO 9001 Quality Management",
  "Master Mariners & MICS leadership",
  "India · UAE · Global operations",
  "24/7 emergency response",
];

/** Client testimonials — replace with real quotes when approved by boss */
export const testimonials = [
  {
    quote:
      "Pelagic responded within hours on a critical survey matter. Their Master Mariner was thorough, impartial, and clear in the report — exactly what our underwriters needed.",
    author: "Technical Superintendent",
    company: "International tanker operator",
  },
  {
    quote:
      "From LNG compatibility review to onboard bunkering supervision, the team combined practical sea experience with sharp engineering. A reliable partner at anchorage.",
    author: "Fleet Operations Manager",
    company: "Dual-fuel vessel owner",
  },
  {
    quote:
      "Remote compass adjustment for our fleet saved time and cost without compromising compliance. Professional service and fast turnaround.",
    author: "HSQE Manager",
    company: "Regional ship management company",
  },
];

/** Main app bar — order aligned with Global Maritime & peer consultancies */
export const navMenu: NavMenuItem[] = [
  { type: "link", href: "/about", label: "About" },
  {
    type: "dropdown",
    label: "Services",
    href: "/services",
    children: serviceCategories.map((s) => ({
      href: `/services#${s.slug}`,
      label: s.title,
      description: s.summary,
    })),
  },
  {
    type: "dropdown",
    label: "Sectors",
    href: "/sectors",
    children: sectorDetails.map((s) => ({
      href: `/sectors#${s.slug}`,
      label: s.title,
      description: s.summary,
    })),
  },
  { type: "link", href: "/projects", label: "Projects" },
  {
    type: "dropdown",
    label: "Decarbonization",
    href: "/decarbonization",
    children: [
      {
        href: "/decarbonization",
        label: "Energy transition overview",
        description: decarbonization.summary,
      },
      {
        href: "/services#lng-alternative-fuels",
        label: "LNG & alternative fuels",
        description: "Bunkering compatibility, supervision, and clean fuels advisory.",
      },
      {
        href: `/sectors#renewables`,
        label: "Renewables & offshore wind",
        description: "Marine support for renewable and offshore energy projects.",
      },
    ],
  },
  { type: "link", href: "/news", label: "News" },
  { type: "link", href: "/careers", label: "Careers" },
];
