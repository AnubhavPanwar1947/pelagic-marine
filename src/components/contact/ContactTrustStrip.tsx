import { company, trustBadges } from "@/lib/site-data";

const items = [
  { value: String(company.offices.length), label: "Global offices" },
  { value: "24/7", label: "Emergency advisory" },
  { value: "2", label: "Regions · India & UAE" },
  { value: "<24h", label: "Typical response" },
];

export function ContactTrustStrip() {
  return (
    <section className="border-b border-pelagic-mist bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="text-center sm:text-left">
              <p className="font-display text-3xl font-semibold text-pelagic-gold sm:text-4xl">
                {item.value}
              </p>
              <p className="mt-1 text-sm font-medium text-pelagic-steel">{item.label}</p>
            </div>
          ))}
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-2 sm:justify-start">
          {trustBadges.map((badge) => (
            <li
              key={badge}
              className="rounded-full border border-pelagic-mist bg-white px-3 py-1.5 text-xs font-semibold text-pelagic-charcoal"
            >
              {badge}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
