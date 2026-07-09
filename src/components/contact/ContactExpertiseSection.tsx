import { contactPage, testimonials, trustBadges } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";

export function ContactExpertiseSection() {
  const testimonial = testimonials[0];

  return (
    <section className="border-t border-pelagic-mist bg-pelagic-sand/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pelagic-accent">
              Why Pelagic
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-pelagic-ink">
              Trusted marine advisers — not just report writers
            </h2>
            <div className="mt-8 space-y-6">
              {contactPage.reasons.map((reason, i) => (
                <Reveal key={reason.title} delay={i * 60}>
                  <div className="border-l-2 border-pelagic-gold pl-5">
                    <h3 className="font-semibold text-pelagic-ink">{reason.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-pelagic-steel">{reason.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <ul className="mt-8 flex flex-wrap gap-2">
              {trustBadges.map((badge) => (
                <li
                  key={badge}
                  className="rounded-full border border-pelagic-mist bg-white px-3 py-1.5 text-xs font-medium text-pelagic-charcoal"
                >
                  {badge}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pelagic-accent">
              What happens next
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-pelagic-ink">
              From enquiry to expert attendance
            </h2>
            <ol className="mt-8 space-y-5">
              {contactPage.responseSteps.map((step) => (
                <li
                  key={step.step}
                  className="flex gap-4 rounded-2xl border border-pelagic-mist bg-white p-5"
                >
                  <span className="font-display text-2xl font-semibold text-pelagic-gold">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="font-semibold text-pelagic-ink">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-pelagic-steel">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <blockquote className="mt-8 rounded-2xl border border-pelagic-mist bg-white p-6">
              <p className="text-sm italic leading-7 text-pelagic-charcoal">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer className="mt-4 text-xs font-semibold text-pelagic-steel">
                — {testimonial.author}, {testimonial.company}
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
