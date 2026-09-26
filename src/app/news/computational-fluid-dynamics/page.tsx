import type { Metadata } from "next";
import Link from "next/link";
import { SectionMaritime } from "@/components/ui/SectionMaritime";
import { SiteImage } from "@/components/ui/SiteImage";

const cfdImages = {
  resistanceVelocity: "/images/cfd/resistance-velocity-contours.png",
  streamlines: "/images/cfd/streamlines-waps.png",
  propeller: "/images/cfd/propeller-contours.png",
  domainMesh: "/images/cfd/domain-mesh.png",
  vofDrag: "/images/cfd/vof-drag-force.png",
  industryPerspective: "/images/cfd/industry-perspective.png",
} as const;

const articleFigureSizes = "(max-width: 48rem) calc(100vw - 2rem), 48rem";
const cfdPageHeroSrc = "/images/blog-hero.png";

function CfdArticleBreadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-relaxed text-pelagic-copy">
        <li className="min-w-0 shrink-0">
          <Link
            href="/"
            className="font-semibold text-pelagic-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pelagic-accent"
          >
            Home
          </Link>
        </li>
        <li className="shrink-0 text-pelagic-slate" aria-hidden>
          /
        </li>
        <li className="min-w-0 shrink-0">
          <Link
            href="/news"
            className="font-semibold text-pelagic-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pelagic-accent"
          >
            Marine Insights
          </Link>
        </li>
        <li className="shrink-0 text-pelagic-slate" aria-hidden>
          /
        </li>
        <li className="min-w-0 break-words text-pelagic-ink" aria-current="page">
          Computational Fluid Dynamics
        </li>
      </ol>
    </nav>
  );
}

function CfdPageHeroPlot() {
  return (
    <div className="relative aspect-[21/9] min-w-0 w-full overflow-hidden rounded-lg bg-white sm:aspect-[2/1] md:aspect-[4/3]">
      <SiteImage
        src={cfdPageHeroSrc}
        alt="Computational fluid dynamics phase volume fraction contour plot"
        fill
        className="object-contain"
        objectPosition="center center"
        sizes="(max-width: 767px) 100vw, (max-width: 1024px) 16rem, 20rem"
        priority
      />
    </div>
  );
}

const inThisArticleLinks = [
  { id: "cfd-measurable-impact", num: "01", label: "Where CFD Creates Measurable Impact" },
  { id: "total-resistance-equation", num: "02", label: "Total Resistance = Still Water + Wave + Wind" },
  {
    id: "energy-saving-devices",
    num: "03",
    label: "Energy Saving Devices — Feasibility Before Retrofit",
  },
  {
    id: "multiphase-simulation",
    num: "04",
    label: "Multiphase Simulation = Realistic Sea Behaviour",
  },
  { id: "structured-cfd-value", num: "05", label: "How Structured CFD Creates Value" },
  { id: "strategic-reality", num: "06", label: "The Strategic Reality" },
  { id: "industry-perspective", num: "07", label: "Industry Perspective" },
  { id: "question-worth-considering", num: "08", label: "A Question Worth Considering" },
] as const;

const sectionScrollMargin = "scroll-mt-28";

function InThisArticleCard() {
  return (
    <nav
      aria-labelledby="cfd-in-this-article"
      className="min-w-0 rounded-2xl border border-pelagic-sand bg-white p-4 shadow-sm sm:p-5"
    >
      <h2
        id="cfd-in-this-article"
        className="min-w-0 break-words text-base font-semibold text-pelagic-ink sm:text-lg"
      >
        In this article
      </h2>
      <ol className="mt-4 min-w-0 space-y-3">
        {inThisArticleLinks.map((item) => (
          <li key={item.id} className="flex min-w-0 gap-2 sm:gap-3">
            <span className="shrink-0 text-xs font-semibold tabular-nums text-pelagic-copy-muted sm:text-sm">
              {item.num}
            </span>
            <a
              href={`#${item.id}`}
              className="min-w-0 break-words text-sm font-semibold leading-snug text-pelagic-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pelagic-accent"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ArticleFigure({
  src,
  alt,
  aspectClass = "aspect-[21/9] sm:aspect-[2/1]",
}: {
  src: string;
  alt: string;
  aspectClass?: string;
}) {
  return (
    <div
      className={`relative min-w-0 w-full overflow-hidden rounded-2xl bg-neutral-100 ${aspectClass}`}
    >
      <SiteImage
        src={src}
        alt={alt}
        fill
        className="object-contain"
        objectPosition="center center"
        sizes={articleFigureSizes}
      />
    </div>
  );
}

function ContactEnvelopeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`size-5 shrink-0 ${className}`}
      aria-hidden
    >
      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67z" />
      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Computational Fluid Dynamics",
  description:
    "3% resistance reduction and structured CFD for total resistance, energy-saving devices, and multiphase simulation — clarity before capital is committed.",
};

export default function ComputationalFluidDynamicsPage() {
  return (
    <SectionMaritime
      variant="mist"
      className="py-12 sm:py-16 md:py-20 !overflow-visible"
      gridOpacity={48}
    >
      <article className="mx-auto min-w-0 max-w-7xl overflow-visible px-4 sm:px-6 lg:px-8">
        <header className="min-w-0 border-b-2 border-[#8fb8d6] pb-4 sm:pb-5">
          <CfdArticleBreadcrumb />
          <div className="mt-6 flex min-w-0 flex-col gap-6 md:mt-8 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] md:items-center md:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
            <h1 className="type-display type-page-title min-w-0 break-words font-semibold normal-case text-pelagic-ink">
              Computational Fluid Dynamics
            </h1>
            <CfdPageHeroPlot />
          </div>
        </header>

        <div className="overflow-visible pt-4 sm:pt-5 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,14rem)] md:items-start md:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] lg:gap-10">
          <div className="min-w-0 md:col-start-1">
            <h2 className="font-display min-w-0 break-words text-2xl font-semibold text-pelagic-ink sm:text-3xl">
              3% Resistance Reduction = 6-Figure Annual Savings
            </h2>
            <p className="mt-4 min-w-0 break-words text-base font-semibold leading-relaxed text-pelagic-ink">
              That&apos;s not theory. That&apos;s operational mathematics.
            </p>

            <aside className="mt-6 min-w-0 md:hidden">
              <InThisArticleCard />
            </aside>

        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy md:mt-4">
          Most vessels don&apos;t have a design problem.In many cases, the real issue lies in flow
          behaviour.
        </p>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          Computational Fluid Dynamics (CFD) is no longer just a naval architect&apos;s modelling
          tool — it is now a decision-making instrument.
        </p>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          At its core, CFD numerically solves the Navier–Stokes equations to simulate how water and
          air interact with a vessel. But commercially, what it really delivers is clarity before
          capital is committed.
        </p>

        <h2
          id="cfd-measurable-impact"
          className={`font-display mt-10 min-w-0 break-words text-xl font-semibold text-pelagic-ink sm:text-2xl ${sectionScrollMargin}`}
        >
          Where CFD Creates Measurable Impact
        </h2>
        <p
          id="total-resistance-equation"
          className={`mt-4 min-w-0 break-words text-base font-semibold leading-relaxed text-pelagic-ink ${sectionScrollMargin}`}
        >
          Total Resistance = Still Water + Wave + Wind
        </p>
        <div className="mt-6 min-w-0">
          <ArticleFigure
            src={cfdImages.resistanceVelocity}
            alt="CFD velocity contours on a vessel side profile and plan view"
            aspectClass="aspect-[4/3] sm:aspect-[21/9]"
          />
        </div>
        <p className="mt-6 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          CFD evaluates resistance holistically by combining:
        </p>
        <ul className="mt-3 min-w-0 list-disc space-y-2 pl-5 text-base leading-relaxed text-pelagic-copy">
          <li className="min-w-0 break-words">Still water resistance</li>
          <li className="min-w-0 break-words">Wave-induced resistance</li>
          <li className="min-w-0 break-words">
            Wind resistance (open wind test &amp; statistical methods)
          </li>
        </ul>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          This integrated assessment provides the true operational resistance profile of a vessel —
          not just calm-water estimates.
        </p>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          Even a 2–4% reduction in total resistance can significantly improve fuel consumption and
          support compliance under frameworks governed by the International Maritime Organization,
          including EEXI and CII requirements.
        </p>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          Hydrodynamic efficiency is now a regulatory and commercial variable.
        </p>

        <h2
          id="energy-saving-devices"
          className={`font-display mt-10 min-w-0 break-words text-xl font-semibold text-pelagic-ink sm:text-2xl ${sectionScrollMargin}`}
        >
          Energy Saving Devices — Feasibility Before Retrofit
        </h2>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          CFD enables simulation and validation of:
        </p>
        <ul className="mt-3 min-w-0 list-disc space-y-2 pl-5 text-base leading-relaxed text-pelagic-copy">
          <li className="min-w-0 break-words">Wind Assisted Propulsion Systems (WAPS)</li>
          <li className="min-w-0 break-words">Air lubrication hull systems</li>
          <li className="min-w-0 break-words">Hull form modifications</li>
          <li className="min-w-0 break-words">Combined efficiency solutions</li>
        </ul>
        <div className="mt-6 grid min-w-0 gap-4 md:grid-cols-2">
          <ArticleFigure
            src={cfdImages.streamlines}
            alt="CFD streamline visualization of flow around a hull"
            aspectClass="aspect-[21/9] sm:aspect-[2/1]"
          />
          <ArticleFigure
            src={cfdImages.propeller}
            alt="CFD contour plot of a marine propeller"
            aspectClass="aspect-[21/9] sm:aspect-[2/1]"
          />
        </div>
        <p className="mt-6 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          Instead of installing devices based on assumptions, owners can evaluate expected gains
          digitally — before entering drydock.
        </p>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          The goal is not modification.The goal is validated modification.
        </p>

        <h2
          id="multiphase-simulation"
          className={`font-display mt-10 min-w-0 break-words text-xl font-semibold text-pelagic-ink sm:text-2xl ${sectionScrollMargin}`}
        >
          Multiphase Simulation = Realistic Sea Behaviour
        </h2>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          Using Volume of Fluid (VOF) modelling, CFD simulates:
        </p>
        <ul className="mt-3 min-w-0 list-disc space-y-2 pl-5 text-base leading-relaxed text-pelagic-copy">
          <li className="min-w-0 break-words">Wave interaction with hull</li>
          <li className="min-w-0 break-words">Slamming loads</li>
          <li className="min-w-0 break-words">Air–water volume fraction</li>
          <li className="min-w-0 break-words">Sloshing behaviour in ballast and cargo tanks</li>
        </ul>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          Velocity vector and contour analysis at operational speeds (e.g., 8–12 knots) provides
          insight into how performance changes across service profiles.
        </p>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          For commercial vessels, this translates directly into structural risk control and
          operational efficiency planning.
        </p>
        <div className="mt-6 min-w-0">
          <ArticleFigure
            src={cfdImages.domainMesh}
            alt="CFD computational domain mesh with inlet and outlet flow vectors"
            aspectClass="aspect-[4/3] sm:aspect-[21/9]"
          />
        </div>
        <div className="mt-6 min-w-0">
          <ArticleFigure
            src={cfdImages.vofDrag}
            alt="Phase volume fraction contour and drag force versus speed chart"
            aspectClass="aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9]"
          />
        </div>

        <h2
          id="structured-cfd-value"
          className={`font-display mt-10 min-w-0 break-words text-xl font-semibold text-pelagic-ink sm:text-2xl ${sectionScrollMargin}`}
        >
          How Structured CFD Creates Value
        </h2>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          A robust CFD approach is not just &ldquo;running software.&rdquo;
        </p>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          It typically follows a structured path:
        </p>
        <ol className="mt-3 min-w-0 list-decimal space-y-2 pl-5 text-base leading-relaxed text-pelagic-copy">
          <li className="min-w-0 break-words">
            Assessment of existing vessel performance and ratings
          </li>
          <li className="min-w-0 break-words">Proposal of optimization solutions</li>
          <li className="min-w-0 break-words">Vessel modeling and mesh preparation</li>
          <li className="min-w-0 break-words">
            CFD simulation (including multiphase where required)
          </li>
          <li className="min-w-0 break-words">
            Validation using classical resistance methods (Holtrop, Harvald &amp; Guldhammer)
          </li>
          <li className="min-w-0 break-words">Detailed reporting for owner and Class review</li>
        </ol>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          This ensures engineering credibility — not just visual output.
        </p>

        <h2
          id="strategic-reality"
          className={`font-display mt-10 min-w-0 break-words text-xl font-semibold text-pelagic-ink sm:text-2xl ${sectionScrollMargin}`}
        >
          The Strategic Reality
        </h2>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          Shipping today faces:
        </p>
        <ul className="mt-3 min-w-0 list-disc space-y-2 pl-5 text-base leading-relaxed text-pelagic-copy">
          <li className="min-w-0 break-words">Fuel price volatility</li>
          <li className="min-w-0 break-words">Transition to alternate fuels</li>
          <li className="min-w-0 break-words">Carbon intensity benchmarking</li>
          <li className="min-w-0 break-words">Increasing retrofit investments</li>
          <li className="min-w-0 break-words">Charterer performance scrutiny</li>
        </ul>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          CFD transforms assumptions into measurable data before financial decisions are made.
        </p>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          However, one point is worth emphasizing:
        </p>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          Running simulations alone does not create value — informed interpretation does.
        </p>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          Mesh quality, turbulence modelling (RANS/LES), boundary conditions and validation
          determine whether CFD becomes an asset — or a misleading dataset.
        </p>

        <h2
          id="industry-perspective"
          className={`font-display mt-10 min-w-0 break-words text-xl font-semibold text-pelagic-ink sm:text-2xl ${sectionScrollMargin}`}
        >
          Industry Perspective
        </h2>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          From our experience at Pelagic Marine Consultants &amp; Surveyors, CFD is most effective
          when used as a performance verification and retrofit evaluation tool — not merely a
          visualization exercise.
        </p>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          The objective is clear:
        </p>
        <ul className="mt-3 min-w-0 list-disc space-y-2 pl-5 text-base leading-relaxed text-pelagic-copy">
          <li className="min-w-0 break-words">Select the right energy-saving solution</li>
          <li className="min-w-0 break-words">Support CII and GHG alignment</li>
          <li className="min-w-0 break-words">Provide Class-ready technical reporting</li>
          <li className="min-w-0 break-words">Empower informed decision-making</li>
        </ul>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          Digital simulation must translate into operational outcome.
        </p>
        <div className="mt-6 min-w-0">
          <ArticleFigure
            src={cfdImages.industryPerspective}
            alt="CATIA vessel hull modeling views used for CFD mesh preparation"
            aspectClass="aspect-[4/3] sm:aspect-[16/9]"
          />
        </div>

        <h2
          id="question-worth-considering"
          className={`font-display mt-10 min-w-0 break-words text-xl font-semibold text-pelagic-ink sm:text-2xl ${sectionScrollMargin}`}
        >
          A Question Worth Considering
        </h2>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          When was the last time your vessel&apos;s total resistance profile was independently
          evaluated beyond sea trials?
        </p>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          Small flow inefficiencies compound over years. In a margin-driven industry, small
          percentages matter.
        </p>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
          If you&apos;re evaluating hull modification, WAPS, air lubrication, or propulsion
          optimisation — data-driven validation should come first.
        </p>

          </div>

          <aside className="hidden min-w-0 md:col-start-2 md:row-start-1 md:block md:sticky md:top-28 md:max-h-[calc(100vh-7.5rem)] md:overflow-y-auto md:overscroll-contain">
            <InThisArticleCard />
          </aside>
        </div>

        <div className="mt-4 min-w-0 border-t-2 border-[#8fb8d6] pt-4 sm:pt-5">
          <div className="min-w-0 space-y-3 text-left text-base leading-relaxed">
            <p className="min-w-0 break-words font-semibold text-[#0e235e]">
              For more information, please contact us:
            </p>
            <p className="min-w-0">
              <a
                href="mailto:info@pelagic-marine.com"
                className="group inline-flex max-w-full min-w-0 items-center gap-2 break-all font-semibold no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b7fc4]"
              >
                <ContactEnvelopeIcon className="text-[#1a557c]" />
                <span className="text-[#2b7fc4] group-hover:text-[#1f6aa8]">
                  info@pelagic-marine.com
                </span>
              </a>
            </p>
            <p className="min-w-0">
              <Link
                href="/news"
                className="font-semibold text-[#2b7fc4] no-underline hover:text-[#1f6aa8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b7fc4]"
              >
                Back to Marine Insights
              </Link>
            </p>
          </div>
        </div>
      </article>
    </SectionMaritime>
  );
}
