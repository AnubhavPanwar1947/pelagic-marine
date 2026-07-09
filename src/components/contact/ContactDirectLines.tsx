import { company } from "@/lib/site-data";

const lines = [
  {
    label: "General enquiries",
    value: company.emails.info,
    href: `mailto:${company.emails.info}`,
    detail: "Projects, surveys, engineering & legal",
  },
  {
    label: "India 24/7 line",
    value: company.phones.india,
    href: `tel:${company.phones.india.replace(/\s/g, "")}`,
    detail: "Urgent attendance · IST business hours + emergency",
  },
  {
    label: "UAE line",
    value: company.phones.uae,
    href: `tel:${company.phones.uae.replace(/\s/g, "")}`,
    detail: "Middle East operations · GST hours + emergency",
  },
  {
    label: "Careers",
    value: company.emails.career,
    href: `mailto:${company.emails.career}`,
    detail: "Surveyor & engineering opportunities",
  },
];

export function ContactDirectLines() {
  return (
    <section className="border-b border-pelagic-mist bg-white py-10">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
        {lines.map((line) => (
          <a
            key={line.label}
            href={line.href}
            className="rounded-xl border border-pelagic-mist bg-pelagic-cream/40 p-5 transition hover:border-pelagic-accent/40 hover:shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-pelagic-accent">
              {line.label}
            </p>
            <p className="mt-2 font-semibold text-pelagic-ink">{line.value}</p>
            <p className="mt-1 text-xs leading-5 text-pelagic-steel">{line.detail}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
