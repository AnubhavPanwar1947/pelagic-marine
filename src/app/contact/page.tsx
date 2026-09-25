"use client";

import Image from "next/image";
import { ContactEnquiryForm } from "@/components/contact/ContactEnquiryForm";
import { ContactEnquiryProvider } from "@/components/contact/ContactEnquiryContext";
import { Reveal } from "@/components/ui/Reveal";
import { company, contactPage, getOfficeById } from "@/lib/site-data";
import "./contact-theme.css";

/** call-us.svg is not in public/images/icons; contact-us.svg is phone, visit-us.svg is map pin. */
function formatIndiaPhoneForDisplay(phone: string): string {
  const normalized = phone.replace(/\s/g, "");
  const match = normalized.match(/^\+91(\d{10})$/);
  if (match) {
    const digits = match[1];
    return `+91 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone;
}

const dubaiOfficeAddress = getOfficeById("dubai").address;

const contactHeroChannels = [
  {
    label: "Visit Us",
    detail: dubaiOfficeAddress,
    href: "#enquiry-form",
    src: "/images/icons/visit-us.svg",
    alt: "Visit Pelagic Marine offices",
  },
  {
    label: "Call Us",
    detail: formatIndiaPhoneForDisplay(company.phones.india),
    href: `tel:${company.phones.india.replace(/\s/g, "")}`,
    src: "/images/icons/contact-us.svg",
    alt: "Call Pelagic Marine",
  },
  {
    label: "Mail Us",
    detail: company.emails.info,
    href: `mailto:${company.emails.info}`,
    src: "/images/icons/mail-us.svg",
    alt: "Email Pelagic Marine",
  },
] as const;

export default function ContactPage() {
  return (
    <div className="contact-page">
      <ContactEnquiryProvider>
        <section className="contact-surface-white border-b border-pelagic-sand">
          <div className="mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 sm:pt-10 sm:pb-12 lg:px-8">
            <Reveal variant="text">
              <h1 className="type-display min-w-0 whitespace-nowrap text-[28px] font-semibold normal-case leading-tight text-[#0e235e] sm:text-[30px] lg:text-[32px]">
                {contactPage.hero.eyebrow}
              </h1>
              <ul className="mt-10 flex min-w-0 flex-col gap-10 md:mt-12 md:grid md:grid-cols-3 md:gap-8 lg:gap-10">
                {contactHeroChannels.map((channel) => (
                  <li key={channel.label} className="min-w-0">
                    <a
                      href={channel.href}
                      className="flex min-w-0 max-w-full flex-col items-center text-center no-underline motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e235e]"
                    >
                      <span className="relative block aspect-square w-[min(120px,100%)] max-w-[120px]">
                        <Image
                          src={channel.src}
                          alt={channel.alt}
                          width={120}
                          height={120}
                          className="size-full object-contain"
                          sizes="120px"
                        />
                      </span>
                      <span className="mt-4 text-base font-bold text-[#0e235e] sm:text-lg">
                        {channel.label}
                      </span>
                      <span className="mt-2 max-w-full break-words text-sm leading-relaxed text-pelagic-copy sm:text-[0.9375rem]">
                        {channel.detail}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="contact-surface-icy border-b border-pelagic-sand pb-12 pt-6 sm:pb-16 sm:pt-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal variant="text">
              <div
                id="enquiry-form"
                className="contact-enquiry-shell mx-auto max-w-2xl min-w-0 scroll-mt-28"
              >
                <ContactEnquiryForm />
              </div>
            </Reveal>
          </div>
        </section>
      </ContactEnquiryProvider>
    </div>
  );
}
