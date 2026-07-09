import { company } from "@/lib/site-data";

const whatsappMessage = encodeURIComponent(
  "Hello Pelagic Marine — I would like to enquire about marine consultancy services."
);

export function ContactSocialChannels() {
  const channels = [
    {
      label: "LinkedIn",
      detail: "Company updates & professional enquiries",
      href: company.linkedin,
      external: true,
      icon: "in",
    },
    {
      label: "WhatsApp",
      detail: "Quick message · India line",
      href: `https://wa.me/${company.whatsapp}?text=${whatsappMessage}`,
      external: true,
      icon: "wa",
    },
    {
      label: "Email",
      detail: company.emails.info,
      href: `mailto:${company.emails.info}`,
      external: false,
      icon: "mail",
    },
    {
      label: "Call India",
      detail: company.phones.india,
      href: `tel:${company.phones.india.replace(/\s/g, "")}`,
      external: true,
      icon: "phone",
    },
  ];

  return (
    <section className="border-b border-pelagic-mist bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-pelagic-accent">
          Connect with us
        </p>
        <p className="mt-2 max-w-2xl text-sm text-pelagic-steel">
          LinkedIn and email for formal enquiries; WhatsApp for quick coordination in
          India and the UAE — the same mix used by Sea Delta and regional survey firms.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.external ? "_blank" : undefined}
              rel={channel.external ? "noopener noreferrer" : undefined}
              className="seadelta-card group flex flex-col rounded-xl border border-pelagic-mist bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-pelagic-accent/40 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-pelagic-accent/10 text-xs font-bold uppercase text-pelagic-accent group-hover:bg-pelagic-accent group-hover:text-white">
                {channel.icon}
              </span>
              <span className="mt-4 font-semibold text-pelagic-ink">{channel.label}</span>
              <span className="mt-1 text-sm text-pelagic-steel">{channel.detail}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
