import { contactPage } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { SectionMaritime } from "@/components/ui/SectionMaritime";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ContactFaqSection() {
  return (
    <SectionMaritime variant="sand" className="border-t border-pelagic-sand py-20 lg:py-24" gridOpacity={52}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions"
            description="Mobilisation, scope, and how to reach us for urgent attendance."
            align="center"
          />
        </Reveal>

        <div className="mt-10 space-y-3">
          {contactPage.faq.map((item, i) => (
            <Reveal key={item.question} delay={i * 40}>
              <details className="group card-maritime rounded-2xl border shadow-sm">
                <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-pelagic-ink marker:content-none sm:px-6">
                  <span className="flex items-center justify-between gap-4">
                    {item.question}
                    <span
                      className="shrink-0 text-pelagic-accent transition group-open:rotate-45"
                      aria-hidden
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="border-t border-pelagic-mist px-5 pb-5 pt-3 text-sm leading-relaxed text-pelagic-steel sm:px-6">
                  {item.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionMaritime>
  );
}
