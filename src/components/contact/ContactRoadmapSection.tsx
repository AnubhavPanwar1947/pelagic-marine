import { contactPage } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactTestimonialCarousel } from "@/components/contact/ContactTestimonialCarousel";

type ContactRoadmapSectionProps = {
  compact?: boolean;
  showQuote?: boolean;
};

export function ContactRoadmapSection({
  compact = false,
  showQuote = false,
}: ContactRoadmapSectionProps) {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Your enquiry"
            title="What happens next"
            description="From enquiry to expert attendance — three clear steps."
          />
        </Reveal>

        <ol
          className={`mt-12 grid gap-6 ${compact ? "md:grid-cols-3" : "lg:grid-cols-3 lg:gap-8"}`}
        >
          {contactPage.responseSteps.map((step, i) => (
            <Reveal key={step.step} delay={i * 60}>
              <li className="card-premium group relative overflow-hidden rounded-3xl border border-pelagic-sand bg-white p-7 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pelagic-gold to-amber-600 text-sm font-bold text-white shadow-md">
                  {step.step}
                </span>
                <h3 className="font-display mt-5 text-xl font-semibold text-pelagic-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-pelagic-slate">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        {(!compact || showQuote) && <ContactTestimonialCarousel />}
      </div>
    </section>
  );
}
