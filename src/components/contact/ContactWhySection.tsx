import { contactPage, company } from "@/lib/site-data";
import { ContactSectionIntro } from "@/components/contact/ContactSectionIntro";
import { Reveal } from "@/components/ui/Reveal";

export function ContactWhySection() {
  return (
    <section id="contact-why" className="contact-section-vibrant-c relative scroll-mt-28 overflow-hidden py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ContactSectionIntro
          step="5"
          eyebrow="Why Pelagic"
          title="Built for operators who cannot afford delays"
          description="Whether you need a warranty survey in Mumbai, engineering support from Dehradun, or Middle East advisory from Dubai — you are speaking to one integrated marine consultancy."
        />

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:items-start">
          <Reveal delay={80}>
            <div className="contact-content-bright rounded-3xl p-6 sm:p-8">
              <p className="text-base leading-8 text-pelagic-charcoal">
                We built this page so you know exactly who you are reaching — real consultants,
                real offices, and a clear path from first message to mobilisation.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`mailto:${company.emails.info}`}
                  className="rounded-full bg-pelagic-gold px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-pelagic-gold-light"
                >
                  Email {company.emails.info}
                </a>
                <a
                  href={company.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-pelagic-mist bg-white px-6 py-3 text-sm font-semibold text-pelagic-charcoal transition hover:border-pelagic-gold/50"
                >
                  Follow on LinkedIn
                </a>
              </div>
            </div>
          </Reveal>

          <div className="space-y-4">
            {contactPage.reasons.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="contact-content-bright rounded-2xl p-6">
                  <h3 className="font-display text-lg font-semibold text-pelagic-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-pelagic-charcoal">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
