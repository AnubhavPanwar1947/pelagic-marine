import type { TopicPage } from "./topic-pages";

export type ServiceArticleContent = {
  subheading?: string;
  paragraphs: string[];
  leadIn?: string;
  bullets?: string[];
  closing?: string;
};

type LegacyArticleInput = {
  intro: string;
  leadIn: string;
  bullets: string[];
  closing: string;
};

type ArticleInput = ServiceArticleContent | LegacyArticleInput;

function normalizeArticle(input: ArticleInput): ServiceArticleContent {
  if ("paragraphs" in input) {
    return input;
  }
  return {
    paragraphs: [input.intro],
    leadIn: input.leadIn,
    bullets: input.bullets,
    closing: input.closing,
  };
}

const articles: Record<string, ArticleInput> = {
  "naval-architecture-design": {
    intro:
      "Pelagic Marine’s Naval Architecture & Design practice covers hull form, structure and the analysis that supports every design decision — from early concept through class and statutory approval.",
    leadIn: "Within this practice we routinely deliver:",
    bullets: [
      "Concept and detailed design studies aligned with operational and regulatory needs",
      "Strength, stability and response analysis tied to real loading and sea states",
      "Class- and yard-ready plans, calculations and supporting documentation",
    ],
    closing:
      "Whether you are shaping a new vessel or refining an existing one, we align naval architecture work with your build, conversion or operations programme.",
  },
  engineering: {
    intro:
      "Our Engineering practice applies marine and offshore engineering where assets are designed, converted and operated — with documentation and calculations that stand up in yard and class review.",
    leadIn: "Representative work includes:",
    bullets: [
      "Conversion and upgrade engineering with clear scope and class coordination",
      "Hydrodynamics, stability and specialist analysis for operations and projects",
      "Manuals, procedures and technical packages for crews and shore teams",
    ],
    closing:
      "We integrate engineering output with your project milestones so yards, operators and class societies receive consistent, reviewable deliverables.",
  },
  "inspection-audits-surveying": {
    intro:
      "Inspection, Audits & Surveying at Pelagic Marine is carried out by mariners and engineers who understand how vessels are run — not only how they are drawn.",
    leadIn: "Our teams support:",
    bullets: [
      "Condition, pre-purchase and warranty surveys with clear findings",
      "ISM, ISPS, MLC and operational audits with practical recommendations",
      "Risk, cargo and compass-related work where compliance and safety meet operations",
    ],
    closing:
      "Reports are written for decision-makers: concise where possible, thorough where the situation demands it.",
  },
  "mooring-compatibility": {
    intro:
      "Mooring & Compatibility studies help terminals, operators and charterers understand mooring loads, fendering and ship–shore interaction for berthing and STS operations.",
    leadIn: "We apply industry tools and engineering judgement to:",
    bullets: [
      "Static and dynamic mooring analysis for terminals and vessels",
      "Ship–shore compatibility and mooring arrangement review",
      "Scenario testing for weather, passing traffic and operational limits",
    ],
    closing:
      "Studies are scoped to your berth, vessel mix and operating rules so results can be used in operations and investment decisions.",
  },
  loadicator: {
    intro:
      "The Loadicator practice provides class-approved loading and stability tools for crews and fleet technical teams who need reliable, auditable results at sea and ashore.",
    leadIn: "We focus on:",
    bullets: [
      "Deployment and support of UMISTAB-X for approved loading and stability workflows",
      "Alignment with class rules and company procedures",
      "Training and handover so teams can run cases confidently",
    ],
    closing:
      "From initial setup through ongoing use, we keep loadicator workflows practical for the people who depend on them every voyage.",
  },
  "service-design": {
    paragraphs: [
      "At the core of our services is a passion for innovation in marine and offshore engineering. We design a wide variety of vessels and offshore structures—fixed, floating, or mobile—catering to the Oil & Gas, Marine, and Renewable Energy industries.",
    ],
    leadIn: "From initial concept to final design, we provide:",
    bullets: [
      "Conceptual Design",
      "FEED (Front-End Engineering Design) Studies",
      "Detailed Engineering",
    ],
    closing:
      "Our design process is client-driven and powered by a team of experienced professionals using cutting-edge, industry-standard software. We ensure every project meets technical, operational, and regulatory requirements—on time and with precision. Whether you need support with new builds or modifications, we bring expertise and innovation to every stage of the design journey.",
  },
  "service-enganalysis": {
    paragraphs: [
      "Our experienced engineering and design team provides reliable analysis services across all key phases of an asset’s lifecycle.",
    ],
    leadIn: "We support projects through:",
    bullets: [
      "In-place Analysis – Ensuring long-term structural performance under operational and environmental loads.",
      "Pre-service Analysis – Evaluating conditions during fabrication, transportation, and installation, including temporary load scenarios.",
      "Fatigue Analysis – Assessing fatigue life using industry-accepted methods to help extend asset lifespan and plan maintenance.",
      "Decommissioning Analysis – Supporting safe and efficient removal planning through structural assessments and procedural reviews.",
    ],
    closing:
      "We apply a combination of trusted engineering tools and proven methodologies to deliver accurate, code-compliant results that help clients make informed decisions at every stage.",
  },
  "service-feed": {
    paragraphs: [
      "Front-End Engineering Design (FEED) is the essential bridge between conceptual design and full-scale project execution. Conducted after the feasibility phase and before Engineering, Procurement, and Construction (EPC) begins, FEED lays the groundwork for a successful project.",
      "At this stage, our experienced team of naval architects and engineers carries out in-depth technical studies to identify potential design and operational challenges. We also provide preliminary cost estimates to give clients a clearer picture of project viability and investment requirements.",
      "Our FEED studies help clients make confident, informed decisions—reducing risk, refining project scope, and setting the foundation for cost-effective execution.",
    ],
  },
  "service-strength": {
    paragraphs: [
      "Our team conducts Global and Local Strength Analysis (GLSA) to evaluate the structural response of marine and offshore structures under extreme environmental loading. The analysis is grounded in first-principles methodologies, ensuring a physics-based, high-fidelity representation of structural behaviour.",
      "Extreme load assessments are performed across a range of dominant load cases, which are identified based on vessel or structure type. For each load case, an Equivalent Design Wave (EDW) is derived to represent the most critical sea state in a simplified regular wave format. This approach enables detailed yet computationally efficient structural simulations.",
      "GLSA is carried out using advanced finite element modelling to capture both global load distribution and localized stress concentrations. Our scope includes global structural analysis of jacket platforms, floating production units (FPUs), and self-elevating platforms (SEPs), all executed in full compliance with class and industry requirements.",
      "Our analyses have consistently met or exceeded client specifications, supporting both newbuild and in-service assessment projects.",
    ],
  },
  "service-fea": {
    paragraphs: [
      "Finite Element Analysis (FEA) is a powerful computational method used to simulate and predict the structural and thermal behaviour of components and systems under real-world physical conditions such as mechanical loading, vibration, thermal gradients, and fluid interaction. While termed “analysis,” FEA is an integral part of the design and verification process, allowing engineers to anticipate structural performance, identify critical stress areas, and optimize designs before fabrication or physical testing.",
      "In the offshore and marine industry, FEA is extensively utilized to address complex engineering problems associated with floating and fixed structures. Applications include evaluating global structural integrity, local stress concentrations, fatigue life estimation, buckling assessments, and dynamic response to environmental loads.",
      "Our engineering team employs ANSYS, a leading FEA platform, to carry out high-fidelity simulations that support the structural design and assessment of offshore platforms, subsea equipment, riser systems, and hull structures. All analyses are performed in accordance with relevant industry codes and class society requirements, ensuring both safety and performance across the asset lifecycle.",
    ],
  },
  "service-shipplans": {
    paragraphs: [
      "Our team of experienced Naval Architects provides a full suite of plans and technical drawings essential throughout the lifecycle of a marine asset. We ensure all documentation is prepared in accordance with the requirements of the relevant flag state and tailored for approval by leading classification societies.",
    ],
    leadIn: "Our deliverables include, but are not limited to:",
    bullets: [
      "General Arrangement (GA) Plans",
      "Structural Drawings",
      "Freeboard and Loadline Calculations & Plans",
      "Tonnage Calculations and Plans",
      "Tank Capacity Plans",
      "Docking Plans",
      "Outfitting and Piping Drawings",
      "Lines Plans",
      "Safety Manuals and Fire Control Plans",
      "Life-Saving Appliances (LSA) Plans",
      "Wheelhouse Visibility and Escape Route Plans",
      "Mooring and Towing Plans",
      "Wheelhouse Posters",
      "Light and Sound Signaling Plans",
    ],
    closing:
      "Our goal is to support vessel compliance, safety, and operational efficiency from concept to completion.",
  },
  "service-conversion": {
    subheading: "Lifecycle Engineering & Asset Upgrades",
    paragraphs: [
      "To stay ahead in today’s fast-evolving industry, upgrading assets with the latest technologies and equipment is essential. Our team of seasoned experts delivers comprehensive engineering solutions throughout the entire lifecycle of your assets. From concept to completion, we support your most ambitious conversion and upgrade projects across the offshore, marine, and renewable energy sectors—boosting performance, reliability, and efficiency every step of the way.",
    ],
  },
  "service-manuals": {
    paragraphs: [
      "Equipped with the right knowledge, skills, and hands-on experience, our team has successfully prepared and delivered a wide range of procedural and operational manuals tailored to the specific needs of our clients across the maritime and offshore sectors.",
    ],
    leadIn: "Our portfolio includes, but is not limited to, the following:",
    bullets: [
      "Operating Manuals for Vessels, Rigs, and Platforms",
      "Cargo Securing Manual",
      "ISPS (International Ship and Port Facility Security) Manual",
      "Man Overboard Recovery Manual",
      "Emergency Towing Booklet",
      "Biofouling Management Plan",
      "Ship-to-Ship (STS) Transfer Plan",
      "VOC (Volatile Organic Compounds) Management Plan",
      "VECS (Vapour Emission Control System) Manual",
      "Anchor Handling Manual",
      "Damage Control Booklet",
      "Stability Booklet",
      "FiFi (Fire Fighting) Operation Manual",
      "Helideck Operations Manual",
      "SOLAS Training Manual (including LSA and FFA Manuals)",
      "Ballast Water Management Plan",
      "Garbage Management Plan",
      "SOPEP (Shipboard Oil Pollution Emergency Plan) Manual",
      "SMPEP (Shipboard Marine Pollution Emergency Plan) Manual",
      "SEEMP (Ship Energy Efficiency Management Plan)",
      "Procedure and Arrangements Manual",
      "Feasibility Studies",
    ],
    closing:
      "Each document is developed in compliance with the latest IMO guidelines, flag state requirements, class standards, and best industry practices, ensuring safety, efficiency, and regulatory alignment for your operations.",
  },
  "service-hydro": {
    paragraphs: [
      "Marine environments are constantly changing—and so is vessel performance. Our expert team of naval architects and hydrodynamic engineers utilizes cutting-edge simulation tools and industry-leading software to accurately predict how marine assets will perform in real-world sea and weather conditions. From seakeeping and RAO calculations to resistance, motion response, multi-body dynamics, sloshing analysis, and propeller performance assessment—we provide end-to-end hydrodynamic solutions. Whether it’s during the design phase or in operational optimization, we help you enhance safety, efficiency, and reliability at sea.",
    ],
  },
  "service-loadout": {
    paragraphs: [
      "When transporting cargo by sea, it is essential to secure it in a way that prevents any movement which could potentially damage the cargo or the vessel. Improperly secured cargo can shift during transit, posing serious risks to vessel stability and endangering both the crew and the cargo. This is especially critical when handling valuable assets such as machinery, equipment, fabricated structures, and marine components of varying sizes and complexities. Insurers often mandate that cargo is properly fastened to mitigate these risks. Our team of experienced engineers and naval architects ensures that loadout and sea fastening are executed to the highest standards—optimized for safety, efficiency, and in full compliance with the requirements of clients, insurers, and all relevant stakeholders.",
    ],
  },
  "service-cfd": {
    paragraphs: [
      "At the forefront of engineering innovation, Computational Fluid Dynamics (CFD) is a core tool we use to simulate and optimize fluid flow behavior in complex systems. Whether designing next-generation wind turbines, high-performance marine vessels, or energy-efficient HVAC systems, CFD allows us to deliver data-driven solutions with precision and reliability.",
      "CFD involves the numerical analysis of fluid behavior based on physical parameters such as velocity, pressure, temperature, density, and viscosity. By replicating real-world fluid interactions within a virtual environment, we can accurately predict performance, identify inefficiencies, and refine designs long before any physical prototype is built.",
      "As a digital fluid dynamics simulator, CFD plays a critical role in high-end design optimization, reducing development time and cost while enhancing safety and functionality. Our team leverages advanced CFD tools and deep domain expertise to deliver customized solutions tailored to your engineering challenges.",
    ],
  },
  "service-heat": {
    paragraphs: [
      "Our engineering team delivers high-performance heat transfer analysis solutions tailored for the maritime industry. We provide precise evaluation of temperature distribution and heat flux in structural components exposed to thermal loads, supporting both steady-state and transient conditions, as well as linear and non-linear material behavior.",
      "With proven expertise in handling high-temperature cargo scenarios, we ensure optimal thermal management and insulation design for vessels operating beyond typical ambient marine conditions. Our solutions help enhance safety, maintain cargo integrity, and improve energy efficiency—meeting the rigorous demands of modern shipping operations.",
    ],
  },
  "service-stability": {
    paragraphs: [
      "At Pelagic Marine, we provide comprehensive stability calculations tailored to the needs of our offshore and main fleet clients. Our services encompass a wide range of stability-related tasks, ensuring the safe and efficient operation of vessels.",
    ],
    leadIn: "Our expertise includes:",
    bullets: [
      "Loading Calculations: Accurate calculations to ensure proper weight distribution during loading.",
      "Weight Estimation: Determining the weight of cargo and vessel components to assess stability.",
      "Inclining Experiment: Performing inclining tests to verify the vessel’s stability characteristics.",
      "Hydrostatic Particulars: Providing detailed hydrostatic data, essential for operational safety.",
      "Intact and Damage Stability Calculations: Analyzing the vessel’s stability under intact and damage conditions to ensure compliance with international regulations.",
      "Loading Plan Development: Creating loading plans based on detailed stability analysis.",
    ],
    closing:
      "We are committed to delivering precise, reliable, and efficient stability solutions, supporting vessel safety and operational performance.",
  },
  "service-survey": {
    paragraphs: [
      "At Pelagic Marine, we leverage the expertise of our team, comprising Master Mariners and Marine Engineers, to deliver precise and comprehensive marine and technical surveys. Our services cater to a wide range of vessel types, providing in-depth assessments to ensure operational efficiency, safety, and compliance with industry standards.",
      "Our clientele spans ship owners, operators, charterers, P&I clubs, insurers, financial institutions, flag states, and classification societies.",
    ],
    bullets: [
      "Condition Surveys: Comprehensive assessments on behalf of P&I clubs, H&M insurers, and individual clients to evaluate the overall condition of the vessel and identify potential risks.",
      "On-Hire/Off-Hire Condition Surveys: Detailed assessments to verify the condition of vessels at the time of charter hire, including equipment, machinery, and hull integrity.",
      "On-Hire/Off-Hire Bunker Surveys: Verification of bunker fuel quantities at the start and end of the charter, including fuel quality analysis.",
      "Pre-Loading Vessel Surveys: Technical inspections to ensure vessel readiness for cargo operations, focusing on structural integrity and load distribution.",
      "Project Cargo Loading & Lashing Approvals: Certification of appropriate cargo securing methods and compliance with maritime safety standards for heavy and oversized cargoes.",
      "Non-Exclusive Surveys: Independent, non-affiliated surveys to assess the condition and functionality of specific vessel systems or components.",
      "Bollard Pull & Winch Testing: Performance testing of towing and mooring systems, including winch load testing and bollard pull capacity measurements.",
      "Safety Attestations: Official certification for compliance with safety regulations from local authorities and flag state authorities.",
      "Carving and Marking Note Attestations: Verification of compliance with specific maritime regulations regarding vessel markings, including classification and ownership details.",
      "\"Fit for Purpose\" Approvals: Assessments and certifications for project-specific applications, ensuring that vessels and equipment meet operational requirements for particular tasks or cargo.",
      "Project Cargo Loading/Unloading Attendance: On-site supervision and technical support during the loading and unloading of project cargo, ensuring compliance with safety and operational protocols.",
      "Pre-Purchase Inspections: Detailed technical evaluations of vessels, focusing on mechanical, structural, and safety systems, to support the acquisition decision-making process.",
      "Valuation Reports: Expert evaluations of vessel market value, based on condition, market trends, and technical specifications.",
    ],
    closing:
      "With an unwavering focus on precision and adherence to international standards, Pelagic Marine ensures the highest level of technical integrity and operational safety across all maritime operations.",
  },
  "service-audits": {
    paragraphs: [
      "At Pelagic Marine, we understand the critical importance of compliance, operational integrity, and continuous improvement in the maritime industry. We perform systematic evaluations of vessel operations, shipboard practices, safety management frameworks, and navigational protocols. Our services are aligned with the latest IMO conventions, flag state requirements, OCIMF standards, and classification society guidelines.",
      "We conduct systematic examinations of vessel systems, onboard procedures, and management practices to verify that your Safety Management System (SMS) is properly implemented and adhered to by the crew. Each audit is meticulously carried out to support safety, efficiency, and compliance across all levels of maritime operations.",
    ],
    bullets: [
      "ISM Audit: Verification of compliance with the International Safety Management (ISM) Code.",
      "ISPS Audit: Evaluation of security measures under the International Ship and Port Facility Security (ISPS) Code.",
      "MLC Audit: Inspection under the Maritime Labour Convention (MLC) to ensure crew welfare and rights.",
      "Navigation Audit: Assessment of bridge team performance, passage planning, and navigational safety.",
      "VDR Audit: Review and analysis of Voyage Data Recorder (VDR) data for operational and incident evaluation.",
      "Operators Management Review: Systematic review of shore-based management systems and documentation.",
      "Marine Terminal Inspection: Evaluation of terminal operations, safety protocols, and compatibility with vessel systems.",
      "Flag State Inspection (Liberia): Authorized inspections under the Liberian Registry to ensure vessel compliance.",
      "Pre-Vetting Inspection: Preparatory inspections to ensure readiness for SIRE and other vetting programs.",
      "Pre-CDI Inspection: Comprehensive checks to meet Chemical Distribution Institute (CDI) audit standards.",
      "Pre-OVID Inspection: Offshore Vessel Inspection Database (OVID) pre-inspection for offshore support vessels.",
      "Third-Party Vetting & Clearance Assessments: Independent evaluations to meet charterer and stakeholder requirements.",
      "Bulk Carrier Inspection & Hold Preparation: Thorough inspection and preparation of cargo holds for dry bulk operations.",
    ],
  },
  "service-mws": {
    paragraphs: [
      "We deliver independent third-party Marine Warranty Survey (MWS) services to support the safe, efficient, and compliant execution of high-value, high-risk marine projects.",
      "Our expert surveyors provide comprehensive technical review and approval for the handling, sea transportation, and offshore installation of critical marine assets—including fixed platforms, offshore wind turbines, subsea facilities, pipelines, power cables, and mooring systems.",
      "From initial planning to final execution, we ensure all operations meet international standards, satisfy insurance policy conditions, and fall within acceptable industry risk thresholds. Our mission is to protect your assets, reduce operational risk, and contribute to the successful, on-schedule delivery of offshore projects—safeguarding the interests of all stakeholders involved.",
    ],
  },
  optimoor: {
    paragraphs: [
      "Optimoor supports static and dynamic mooring analysis for vessels, berths, terminals and ship-to-ship operations, helping operators assess line loads, fender response, environmental conditions and safe operating limits. Pelagic Marine combines model setup, scenario testing and engineering judgement to turn mooring results into clear recommendations for berth design, upgrade studies, incident review and day-to-day marine operations.",
    ],
  },
  orcaflex: {
    paragraphs: [
      "OrcaFlex is used to model the time-domain behaviour of dynamic marine systems, including mooring lines, risers, towed bodies and offshore installation arrangements. Pelagic Marine applies OrcaFlex to evaluate combined wind, wave and current conditions, installation and tow dynamics, sensitivity cases and operational limits, giving project teams a clearer basis for design decisions and safe execution.",
    ],
  },
  "umistab-x": {
    paragraphs: [
      "UMISTAB-X is an onboard system for bulk-carrier loading, stability, and longitudinal-strength assessment. It manages cargo, ballast, fuel, freshwater, stores, grain, dry bulk, deck icing, tanks, and other weights. The software calculates displacement, drafts, trim, hydrostatics, stability criteria, shear forces, and bending moments for intact and damage conditions. Users review GZ curves, validation results, visibility, draft surveys, load-line settings, and PDF reports. It supports amendments to the Grain Code in accordance with MSC.552(101) and also includes an optional module for deck-loading calculations.",
    ],
  },
};

const fallbackArticle = (topic: TopicPage): ServiceArticleContent =>
  normalizeArticle({
    intro: `${topic.summary} Pelagic Marine provides this as part of our services portfolio.`,
    leadIn: "Our work in this area includes:",
    bullets: [
      "Scoping and engineering aligned with class and statutory requirements",
      "Deliverables prepared for yard, operator and survey review",
      "Coordination with your project team through approval and handover",
    ],
    closing:
      "Reach out through the site contact options to discuss vessel particulars, timelines and deliverables.",
  });

export function getServiceArticleContent(topic: TopicPage): ServiceArticleContent {
  if (topic.kind === "capability") {
    return fallbackArticle(topic);
  }
  const raw = articles[topic.slug];
  return raw ? normalizeArticle(raw) : fallbackArticle(topic);
}

export function isServiceTopic(topic: TopicPage): boolean {
  return topic.kind === "service-item" || topic.kind === "service-category";
}
