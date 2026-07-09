import type { Metadata } from "next";
import { OfficeNetworkPanel } from "@/components/contact/OfficeNetworkPanel";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SiteImage } from "@/components/ui/SiteImage";
import { company, processSteps } from "@/lib/site-data";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who we are — Pelagic Marine was founded in 2021 by mariners and engineers to deliver marine, surveying, and legal consultancy.",
};

export default function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="Who we are"
        title="Your partner in innovation and technology"
        description={`${company.legalName} was formed in ${company.founded} by entrepreneurs from the shipping and engineering fraternity to act as a one-stop shop for shipping industry solutions.`}
        imageSrc={siteImages.pageHeroes.about}
      />

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading eyebrow="Our expertise" title="Expertise forged at sea and ashore" />
            <p className="mt-6 leading-8 text-slate-600">
              Pelagic marine consultants and surveyors bring together experienced
              Master Mariners, marine engineers, naval architects, and maritime
              lawyers. We provide professional services to clients across mainline
              shipping, oil & gas, offshore operations, and renewable energy.
            </p>
            <p className="mt-4 leading-8 text-slate-600">
              Every member of our team is committed to delivering quality service,
              continuous operational improvement for clients, onboard safety, and
              technological enhancement across the maritime sector.
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-pelagic-mist shadow-sm">
              <SiteImage
                src={siteImages.expertise}
                alt="Container port and maritime operations"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="rounded-3xl border border-pelagic-mist bg-gradient-to-br from-white to-pelagic-mist/40 p-10 shadow-sm">
            <h3 className="font-display text-2xl font-semibold text-pelagic-ink">
              Our vision
            </h3>
            <p className="mt-4 leading-7 text-slate-700">
              To be leaders in the field of marine, surveying, engineering, and
              design consultancy — helping transform the maritime and energy
              sectors through innovative, sustainable, and technology-driven
              solutions.
            </p>
            <h3 className="font-display mt-10 text-lg font-semibold text-pelagic-ink">
              Industries we serve
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {company.sectors.map((sector) => (
                <span
                  key={sector}
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-pelagic-charcoal shadow-sm"
                >
                  {sector}
                </span>
              ))}
            </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-pelagic-sand py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Leadership"
            title="Founded and led by experienced mariners"
            description="Director Nishchay Maken (MICS) brings close to two decades of experience across marine and energy industries."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "At sea",
                text: "13+ years on tankers including VLCC, Suezmax, and Aframax operations.",
              },
              {
                title: "Surveying & audits",
                text: "Damage surveys, warranty surveys, flag state audits, and P&I club work.",
              },
              {
                title: "Energy transition",
                text: "LNG bunkering support, clean fuels advisory, and renewable energy focus.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-pelagic-warm bg-white p-7 shadow-sm"
              >
                <h3 className="font-display text-lg font-semibold text-pelagic-ink">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-pelagic-slate">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-pelagic-mist bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <OfficeNetworkPanel
            offices={company.offices}
            title="Where we operate"
            description="Pelagic Marine is built for India and the UAE — with offices in Mumbai, Dehradun (HQ), and Dubai for rapid survey and consultancy mobilisation."
          />
        </div>
      </section>

      <section className="bg-maritime-grid py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our approach"
            title="How we deliver for every client"
            align="center"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="rounded-3xl border border-white bg-white p-8 shadow-sm"
              >
                <p className="font-display text-3xl font-semibold text-pelagic-sand">
                  {step.step}
                </p>
                <h3 className="font-display mt-4 text-lg font-semibold text-pelagic-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
