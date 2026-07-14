import { offices } from "./offices";
import { getServiceItemHref } from "./service-slugs";

export type {
  MapHub,
  MapHubId,
  Office,
  OfficeId,
  OfficeRegion,
} from "./offices";
export {
  getHubForOffice,
  getHubOffices,
  getOfficeById,
  getOfficeIndex,
  mapHubs,
  offices,
} from "./offices";

export type ServiceItem = {
  label: string;
  slug: string;
  teaser?: string;
};

export const company = {
  name: "Pelagic Marine Solutions",
  legalName: "Pelagic Marine Solutions LLC",
  tagline: "Delivering marine and engineering consultancy worldwide.",
  heroHeadline: "Serving the shipping industry, round the clock.",
  heroSubline:
    "Naval architecture, stability, structures and clean-fuel advisory for owners, operators and charterers worldwide.",
  sectors: ["Maritime", "Offshore", "Oil & Gas", "Renewables"],
  phones: {
    india: "+91 7895039068",
    uae: "+971 50 394 1049",
  },
  emails: {
    info: "info@pelagic-marine.com",
    career: "career@pelagic-marine.com",
  },
  offices,
  founded: 2021,
  linkedin: "https://www.linkedin.com/company/pelagic-marine-solutions/",
  /** Add URL when live — Instagram icon appears automatically in contact & footer */
  // instagram: "https://www.instagram.com/yourprofile/",
  /** WhatsApp — India line without + or spaces */
  whatsapp: "917895039068",
};

export const contactPage = {
  hero: {
    eyebrow: "Contact",
    headline: "Tell us the vessel — we'll assign the expert",
    subline:
      "Surveying, engineering, LNG support, and maritime legal — one qualified team across India and the UAE. Tell us your vessel, port, or project scope and we will route you to the right consultant.",
    fitStatement:
      "Strong fit: pre-purchase surveys, warranty attendance, LNG bunkering supervision, remote compass adjustment, casualty response, and fleet technical advisory.",
    imageSrc: "/images/contact-hero.jpg",
    imageAlt: "Cargo vessel underway at sea — marine surveying and consultancy",
    imageCredit: "Unsplash",
    stats: [
      { value: "500+", label: "Projects delivered" },
      { value: "4", label: "Practices" },
      { value: "3", label: "Offices" },
    ],
    credentials: [
      "Master mariners & surveyors",
      "Naval architects & engineers",
      "India · UAE mobilisation",
    ],
  },
  emergency: {
    label: "Urgent line",
    detail: "Casualty, PSC detention, or time-critical survey mobilisation",
  },
  intentPaths: [
    {
      id: "project",
      title: "Project enquiry",
      description:
        "New survey, engineering review, LNG compatibility, or fleet support. We assign the right expert in India or Dubai.",
      cta: "Submit enquiry",
      target: "enquiry-form",
      icon: "project",
    },
    {
      id: "technical",
      title: "Technical advisory",
      description:
        "Rules interpretation, compliance questions, or post-survey follow-up. Email our consultants with vessel and scope details.",
      cta: "Email experts",
      href: `mailto:${company.emails.info}?subject=Technical%20advisory%20enquiry`,
      icon: "technical",
    },
    {
      id: "urgent",
      title: "Urgent attendance",
      description:
        "Vessel alongside, port state control, or emergency mobilisation. Call India or UAE — have IMO number, port, and nature of urgency ready.",
      cta: "Call now",
      href: `tel:${company.phones.india.replace(/\s/g, "")}`,
      icon: "urgent",
    },
  ],
  expectations: [
    "A consultant reviews your enquiry within one business day",
    "Urgent cases are prioritised for immediate consultant contact",
    "You receive clear next steps — proposal, mobilisation, or site attendance",
  ],
  sla: {
    standard: "Standard enquiries: response within 1 business day",
    urgent: "Time-critical matters: call India or UAE directly",
    avgLabel: "Typical first response",
    avgValue: "Under 4 hours",
  },
  accreditations: [
    { label: "ISO 9001", detail: "Quality management" },
    { label: "Master Mariners", detail: "MICS leadership" },
    { label: "India · UAE", detail: "Regional mobilisation" },
    { label: "6 disciplines", detail: "Survey to legal" },
  ],
  form: {
    privacyNotice:
      "Your enquiry is stored securely and used only to respond to your request. We do not sell contact details. Protected by rate limits, bot checks and encryption in transit.",
    privacyConsent:
      "I agree that Pelagic Marine may contact me about this enquiry and related marine consultancy services. I have read the Privacy policy.",
    offices: [
      { value: "auto", label: "Route to nearest qualified office (recommended)" },
      { value: "mumbai", label: "Mumbai — Surveys & fleet support" },
      { value: "dehradun", label: "Dehradun — Design & engineering" },
      { value: "dubai", label: "Dubai — Middle East shipping & offshore" },
    ],
    subjects: [
      "Pre-purchase / condition survey",
      "Marine warranty survey",
      "Casualty or damage survey",
      "LNG bunkering / alternative fuels",
      "Engineering or naval architecture review",
      "Maritime legal advisory",
      "Fleet technical support",
      "Other / general enquiry",
    ],
  },
  quickIntake: [
    {
      id: "lng",
      label: "LNG bunkering",
      service: "LNG & Alternative Fuels",
      urgency: "priority",
      messageHint: "LNG bunkering compatibility / supervision scope:",
    },
    {
      id: "casualty",
      label: "Casualty survey",
      service: "Inspection, Audits & Surveying",
      urgency: "urgent",
      messageHint: "Casualty / damage survey — vessel, port, nature of incident:",
    },
    {
      id: "compass",
      label: "Remote compass",
      service: "Inspection, Audits & Surveying",
      urgency: "standard",
      messageHint: "Remote magnetic compass adjustment — fleet size and vessel names:",
    },
    {
      id: "warranty",
      label: "Warranty survey",
      service: "Inspection, Audits & Surveying",
      urgency: "priority",
      messageHint: "Marine warranty survey — project location and scope:",
    },
  ],
  faq: [
    {
      question: "How fast can you mobilise to India or Dubai?",
      answer:
        "Standard enquiries receive a consultant review within one business day. Priority and casualty cases are escalated immediately — we regularly mobilise surveyors to Indian ports and UAE anchorages within hours when scope and access are confirmed.",
    },
    {
      question: "Do you attend casualties outside office hours?",
      answer:
        "Yes. Call the India or UAE number with vessel name, IMO, port or anchorage, and nature of urgency. For time-critical matters, phone is faster than email.",
    },
    {
      question: "What should I include in a survey request?",
      answer:
        "Vessel name and IMO (if applicable), port or location, cargo or operation involved, desired survey type, target attendance date, and any P&I or class society reference. The more operational detail you provide, the faster we assign the right expert.",
    },
    {
      question: "Can you support remote attendance?",
      answer:
        "Yes — including remote magnetic compass deviation adjustment for fleets worldwide. We will confirm whether remote or onboard attendance is appropriate for your scope.",
    },
    {
      question: "Which office handles my enquiry?",
      answer:
        "India covers surveys, engineering, LNG, and legal work; Dubai supports Middle East shipping and offshore advisory. We route every enquiry to the nearest qualified team automatically.",
    },
    {
      question: "How do I reach you for an urgent matter?",
      answer:
        "Call the India or UAE phone numbers on this page — do not rely on email alone for casualties or vessels alongside. For non-urgent projects, submit the enquiry form or email info@pelagic-marine.com.",
    },
  ],
  networkHub: {
    eyebrow: "Global Network Hub",
    title: "Find your nearest expert",
    description:
      "Search by city, filter by region, and open directions — your gateway to Pelagic offices across India and the UAE.",
  },
  responseSteps: [
    {
      step: "01",
      title: "We acknowledge",
      text: "Your enquiry is logged securely. A consultant reviews scope and urgency within hours.",
    },
    {
      step: "02",
      title: "Right expert assigned",
      text: "Surveying, engineering, LNG, or legal — we route you to the nearest qualified team in India or the UAE.",
    },
    {
      step: "03",
      title: "Clear next steps",
      text: "Proposal, mobilisation plan, or site attendance — with transparent timelines and deliverables.",
    },
  ],
  reasons: [
    {
      title: "One team, two regions",
      text: "India and UAE offices under one brand — no hand-offs between disconnected contractors.",
    },
    {
      title: "Mariners who mobilise",
      text: "Master mariners, naval architects, and engineers who understand operations, not just reports.",
    },
    {
      title: "Responsive support",
      text: "Urgent casualty, warranty, or port attendance — our network is built for time-critical marine work.",
    },
  ],
};

export const navLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/team", label: "Team" },
  { href: "/decarbonization", label: "Decarbonization" },
  { href: "/news", label: "News" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/contact", label: "Contact" },
];

export type NavDropdownChild = {
  href: string;
  label: string;
  description?: string;
  children?: { href: string; label: string }[];
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
    title: "Pelagic expands marine advisory across India and UAE",
    category: "Company",
    date: "2026-06-15",
    excerpt:
      "Our Master Mariners and engineers provide surveying and technical support from India and Dubai.",
    slug: "advisory-expansion-india-uae",
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
  { value: "500+", label: "Projects delivered" },
  { value: "150+", label: "Mooring arrangement modifications" },
  { value: "300+", label: "Plans & manuals" },
  { value: "120+", label: "Cargo & stability solutions" },
  { value: "40+", label: "Vessels & assets served" },
];

export const serviceCategories = [
  {
    title: "Naval Architecture & Design",
    slug: "naval-architecture-design",
    summary:
      "Hull form, structure and the analysis behind every design decision.",
    items: [
      { label: "Design & Analysis", slug: "service-design", teaser: "Concept to detailed design." },
      { label: "Engineering Analysis", slug: "service-enganalysis", teaser: "Load cases, response, verification." },
      { label: "FEED — Front-End Engineering Design", slug: "service-feed", teaser: "De-risk before commitment." },
      { label: "Global & Local Strength", slug: "service-strength", teaser: "Where structure governs." },
      { label: "Finite Element Analysis (FEA)", slug: "service-fea", teaser: "Stress, buckling, fatigue, ultimate strength." },
      { label: "Ship Plans & Drawings", slug: "service-shipplans", teaser: "Class- and statutory-standard drawings." },
    ],
  },
  {
    title: "Engineering",
    slug: "engineering",
    summary:
      "The applied engineering that keeps assets designed, converted and operating safely.",
    items: [
      { label: "Conversion & Upgradation", slug: "service-conversion", teaser: "Scope, class and yard-ready engineering." },
      { label: "Manuals & Procedures", slug: "service-manuals", teaser: "Operational and technical documentation." },
      { label: "Hydrodynamic Calculations", slug: "service-hydro", teaser: "Resistance, powering and seakeeping." },
      { label: "Loadout & Sea Fastening", slug: "service-loadout", teaser: "Heavy-lift and transport engineering." },
      { label: "Computational Fluid Dynamics (CFD)", slug: "service-cfd", teaser: "Flow, loads and performance modelling." },
      { label: "Heat Transfer Analysis", slug: "service-heat", teaser: "Thermal behaviour in marine systems." },
      { label: "Stability Calculation", slug: "service-stability", teaser: "Intact and damage stability solutions." },
    ],
  },
  {
    title: "Inspection, Audits & Surveying",
    slug: "inspection-audits-surveying",
    summary:
      "Surveys, audits and risk work carried out by people who have sailed.",
    items: [
      { label: "Marine Surveys", slug: "service-survey", teaser: "Condition, pre-purchase and valuation." },
      { label: "Audits & Inspections", slug: "service-audits", teaser: "ISM, ISPS, MLC and operational audits." },
      { label: "Marine Warranty Surveys", slug: "service-mws", teaser: "Loadout, tow and offshore operations." },
      { label: "Loss Prevention & Damage Surveys", slug: "service-loss", teaser: "Casualty, P&I and claims support." },
      { label: "Risk Assessment & Management", slug: "service-risk", teaser: "Operational and project risk frameworks." },
      { label: "Chemical Cargo Handling", slug: "service-chem", teaser: "Tank cleaning, carriage and compliance." },
      { label: "Magnetic Compass Remote Adjustment", slug: "service-compass", teaser: "Fleet-wide deviation adjustment." },
    ],
  },
  {
    title: "Legal Consultancy",
    slug: "legal-consultancy",
    summary:
      "Pre-legal, technical decision-support that makes the engineering picture defensible.",
    items: [
      { label: "Legal Consultancy", slug: "service-legal", teaser: "Contracts, disputes and maritime law." },
    ],
  },
] satisfies {
  title: string;
  slug: string;
  summary: string;
  items: ServiceItem[];
}[];

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
    text: "Continued support from India and Dubai for follow-up, disputes, and operational guidance.",
  },
];

export const trustBadges = [
  "Master mariners & surveyors",
  "India · UAE mobilisation",
  "Expert-led consultancy",
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

/** Main app bar */
export const navMenu: NavMenuItem[] = [
  { type: "link", href: "/about", label: "About" },
  {
    type: "dropdown",
    label: "Services",
    href: "/services",
    children: serviceCategories.map((s) => ({
      href: `/services#${s.slug}`,
      label: s.title,
      children: s.items.map((item) => ({
        href: getServiceItemHref(item),
        label: item.label,
      })),
    })),
  },
  { type: "link", href: "/projects", label: "Projects" },
  { type: "link", href: "/team", label: "Team" },
  {
    type: "dropdown",
    label: "Decarb",
    href: "/decarbonization",
    children: [
      {
        href: "/decarbonization",
        label: "Energy transition overview",
        description: decarbonization.summary,
      },
      {
        href: "/capabilities#clean-fuel",
        label: "LNG bunkering & compatibility",
        description: "Mooring, transfer compatibility, procedures and attendance.",
      },
    ],
  },
  { type: "link", href: "/news", label: "News" },
];

export const teamMembers = [
  {
    name: "Nishchay Maken",
    role: "Founder & Director",
    photo: "/images/team/nishchay.png",
    bio: "Nishchay founded Pelagic Marine to solve, through engineering and design, the problems most firms only survey. Across more than two decades, including over a decade at sea on tankers, he has specialised in project cargo workscopes and stability — the work that inspired UMISTAB-X. His wider expertise spans regulatory compliance, audits and inspections, loss prevention and incident investigation for leading P&I clubs.",
  },
  {
    name: "Bhanu Prabhakar",
    role: "Co-Founder & Head of Engineering and Design",
    photo: "/images/team/bhanu.png",
    bio: "A Naval Architect with fifteen years across offshore structures and seagoing vessels, Bhanu leads Pelagic Marine's design and engineering practice. A graduate of IIT Kharagpur in Ocean Engineering and Naval Architecture, his core strengths lie in structural and finite-element analysis, intact and damage stability, hydrodynamics, mooring analysis and CFD.",
  },
  {
    name: "Capt. Vipul Negi",
    role: "General Manager",
    photo: "/images/team/vipul.png",
    bio: "A Master Mariner and an expert in chemical cargo handling, Capt. Negi brings more than two decades across the marine and petrochemical industries. He leads the firm's inspection and survey work — including CDI inspections, condition and pre-purchase surveys, and damage and P&I claim surveys — together with ISM, ISPS and MLC audits.",
  },
  {
    name: "Capt. Abhinav Upadhyay",
    role: "Senior Marine Consultant | Clean Fuels",
    photo: "/images/team/abhinav.png",
    bio: "A Master Mariner with over twenty years in gas-carrier operations, Capt. Upadhyay is Pelagic Marine's specialist in clean and future fuels. He brings hands-on cargo experience across LNG, LPG, ethane, ethylene and ammonia, and advises on emerging fuels including methanol.",
  },
  {
    name: "Capt. Harjit Singh Sidhu",
    role: "Operations Manager",
    photo: "/images/team/harjit.png",
    bio: "Capt. Sidhu brings a container-shipping background and sea time with Maersk to his role managing Pelagic Marine's operations and day-to-day delivery. He advises on container-ship stability, cargo planning and load optimisation, and is a certified practitioner of remote magnetic compass adjustment.",
  },
];

export const capabilitiesSections = [
  {
    id: "software",
    eyebrow: "Software we use",
    title: "Analysis & simulation suites",
    summary:
      "Our work is built on a licensed toolchain spanning structures, stability, hydrodynamics and mooring. The software matters — but the judgement to set up a model correctly, and to read its output critically, matters more.",
    tags: ["ANSYS", "NAPA", "AutoHydro", "Optimoor", "SACS", "DAMHULL"],
  },
  {
    id: "mooring",
    eyebrow: "Mooring & compatibility",
    title: "Static and dynamic mooring analysis",
    summary:
      "We model both static and dynamic mooring response in Optimoor — line and fender loads, environmental cases and limiting conditions — and carry out LNG ship-shore compatibility studies for terminal and ship-to-ship operations.",
  },
  {
    id: "clean-fuel",
    eyebrow: "Clean fuel",
    title: "LNG bunkering & compatibility",
    summary:
      "We support LNG ship-to-ship and terminal operations — mooring and transfer compatibility, procedures and attendance — bringing hands-on gas-carrier experience to the safe delivery of clean fuel.",
  },
  {
    id: "umistab",
    eyebrow: "Proprietary",
    title: "UMISTAB-X",
    summary:
      "UMISTAB-X is our own loading and stability tool, conceived for bulk carriers and developed out of years of hands-on stability and project-cargo work. It is a class-approved loadicator — giving crews a fast, reliable way to plan and check loading conditions against the applicable criteria.",
  },
];
