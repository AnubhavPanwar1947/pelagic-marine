import { contactPage } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ContactFaqSection() {
  return (
    <section className="border-t border-[#d7e6f0] bg-[#f3f9fd] section-py-md">
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
              <details className="group rounded-xl border border-[#d7e6f0] bg-white transition-[border-color,background-color] duration-300 ease-out hover:border-[#c8d8e8] hover:bg-[#f3f9fb] motion-reduce:transition-none">
                <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-[#0e235e] marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e7fd0] sm:px-6">
                  <span className="flex items-center justify-between gap-4">
                    {item.question}
                    <span
                      className="shrink-0 text-[#1e7fd0] transition-transform duration-300 ease-out group-open:rotate-45 motion-reduce:transition-none motion-reduce:transform-none"
                      aria-hidden
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="border-t border-[#d7e6f0] px-5 pb-5 pt-3 text-sm leading-relaxed text-[#364b5e] sm:px-6">
                  {item.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
