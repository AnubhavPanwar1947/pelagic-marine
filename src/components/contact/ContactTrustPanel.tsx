import { contactPage } from "@/lib/site-data";

export function ContactTrustPanel() {
  const { companyInfo } = contactPage;

  return (
    <div className="min-w-0 rounded-xl border border-[#d7e6f0] bg-white p-6 transition-[border-color,background-color] duration-300 ease-out motion-reduce:transition-none sm:p-8">
      <p className="type-eyebrow">{companyInfo.eyebrow}</p>
      <dl className="mt-5 space-y-5 text-base leading-7 text-[#364b5e]">
        <div>
          <dt className="text-sm font-semibold text-[#0e235e]">Office</dt>
          <dd className="mt-1">
            {companyInfo.officeLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-[#0e235e]">Email</dt>
          <dd className="mt-1">
            <a
              href={`mailto:${companyInfo.email}`}
              className="font-medium text-[#1e7fd0] underline-offset-2 transition-colors duration-300 ease-out hover:text-pelagic-accent-hover hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e7fd0] motion-reduce:transition-none"
            >
              {companyInfo.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-[#0e235e]">Phone</dt>
          <dd className="mt-1">
            <a
              href={`tel:${companyInfo.phone.replace(/\s/g, "")}`}
              className="font-medium text-[#1e7fd0] underline-offset-2 transition-colors duration-300 ease-out hover:text-pelagic-accent-hover hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e7fd0] motion-reduce:transition-none"
            >
              {companyInfo.phone}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-[#0e235e]">Web</dt>
          <dd className="mt-1">
            <a
              href={companyInfo.websiteUrl}
              className="font-medium text-[#1e7fd0] underline-offset-2 transition-colors duration-300 ease-out hover:text-pelagic-accent-hover hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e7fd0] motion-reduce:transition-none"
            >
              {companyInfo.website}
            </a>
          </dd>
        </div>
      </dl>
    </div>
  );
}
