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

export const metadata: Metadata = {
  title: "Computational Fluid Dynamics",
  description:
    "3% resistance reduction and structured CFD for total resistance, energy-saving devices, and multiphase simulation — clarity before capital is committed.",
};

export default function ComputationalFluidDynamicsPage() {
  return (
    <SectionMaritime variant="mist" className="py-12 sm:py-16 md:py-20" gridOpacity={48}>
      <article className="mx-auto min-w-0 max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="min-w-0 break-words text-xs font-bold uppercase tracking-wider text-pelagic-accent">
          Computational Fluid Dynamics
        </p>
        <h1 className="font-display mt-3 min-w-0 break-words text-2xl font-semibold text-pelagic-ink sm:text-3xl">
          3% Resistance Reduction = 6-Figure Annual Savings
        </h1>
        <p className="mt-4 min-w-0 break-words text-base font-semibold leading-relaxed text-pelagic-ink">
          That&apos;s not theory. That&apos;s operational mathematics.
        </p>
        <p className="mt-4 min-w-0 break-words text-base leading-relaxed text-pelagic-copy">
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

        <h2 className="font-display mt-10 min-w-0 break-words text-xl font-semibold text-pelagic-ink sm:text-2xl">
          Where CFD Creates Measurable Impact
        </h2>
        <p className="mt-4 min-w-0 break-words text-base font-semibold leading-relaxed text-pelagic-ink">
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

        <h2 className="font-display mt-10 min-w-0 break-words text-xl font-semibold text-pelagic-ink sm:text-2xl">
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

        <h2 className="font-display mt-10 min-w-0 break-words text-xl font-semibold text-pelagic-ink sm:text-2xl">
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

        <h2 className="font-display mt-10 min-w-0 break-words text-xl font-semibold text-pelagic-ink sm:text-2xl">
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

        <h2 className="font-display mt-10 min-w-0 break-words text-xl font-semibold text-pelagic-ink sm:text-2xl">
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

        <h2 className="font-display mt-10 min-w-0 break-words text-xl font-semibold text-pelagic-ink sm:text-2xl">
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

        <h2 className="font-display mt-10 min-w-0 break-words text-xl font-semibold text-pelagic-ink sm:text-2xl">
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

        <div className="mt-10 min-w-0 space-y-2 text-base leading-relaxed text-pelagic-copy">
          <p className="min-w-0 break-words">For more information, please contact us:</p>
          <p className="min-w-0 break-words">
            <a
              href="mailto:info@pelagic-marine.com"
              className="min-w-0 break-all font-semibold text-pelagic-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pelagic-accent"
            >
              info@pelagic-marine.com
            </a>
          </p>
          <p className="min-w-0 break-words">
            <Link
              href="/news"
              className="font-semibold text-pelagic-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pelagic-accent"
            >
              Back to Marine Insights
            </Link>
          </p>
        </div>
      </article>
    </SectionMaritime>
  );
}
