import { contactPage } from "@/lib/site-data";
import { ContactSectionIntro } from "@/components/contact/ContactSectionIntro";
import { Reveal } from "@/components/ui/Reveal";

export function ContactResponseFlow() {
  return (
    <section
      id="contact-next-steps"
      className="contact-section-vibrant-d relative scroll-mt-28 overflow-hidden py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ContactSectionIntro
          step="6"
          eyebrow="What happens next"
          title="From enquiry to expert — in three clear steps"
          description="No black hole. No endless waiting. Here is exactly what happens after you reach out."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {contactPage.responseSteps.map((item, i) => (
            <Reveal key={item.step} delay={i * 80}>
              <div className="contact-content-bright card-premium h-full rounded-3xl p-8">
                <p className="font-display text-4xl font-semibold text-pelagic-gold">{item.step}</p>
                <h3 className="font-display mt-4 text-xl font-semibold text-pelagic-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-pelagic-charcoal">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
