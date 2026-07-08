"use client";

import { FormEvent, useState } from "react";
import { ContactQuickBar } from "@/components/contact/ContactQuickBar";
import { OfficeLocator } from "@/components/contact/OfficeLocator";
import { WorldMapBackdrop } from "@/components/ui/WorldMapBackdrop";
import { submitEnquiry } from "@/lib/api";
import { company } from "@/lib/site-data";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffice, setSelectedOffice] = useState(0);

  function selectOffice(index: number) {
    setSelectedOffice(index);
  }

  function scrollToLocator() {
    document.getElementById("locations-map")?.scrollIntoView({ behavior: "smooth" });
  }

  function selectOfficeFromMap(index: number) {
    setSelectedOffice(index);
    scrollToLocator();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const result = await submitEnquiry({
      name: String(formData.get("name") ?? ""),
      company: String(formData.get("company") ?? ""),
      email: String(formData.get("email") ?? ""),
      surveyType: String(formData.get("service") ?? ""),
      message: String(formData.get("message") ?? ""),
    });

    setLoading(false);

    if (result.success) {
      form.reset();
      setSubmitted(true);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <div>
      <ContactQuickBar />

      {/* Hero — world map + form (Aalmar / Anglo-Eastern global presence) */}
      <section className="relative min-h-[680px] overflow-hidden border-b border-pelagic-water/30">
        <WorldMapBackdrop offices={company.offices} onSelectOffice={selectOfficeFromMap} />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-pelagic-gold">
              Get in touch
            </p>
            <h1 className="font-display mt-4 text-4xl font-bold leading-tight text-pelagic-ink sm:text-5xl">
              Our global network
            </h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-pelagic-steel">
              Pelagic Marine consultants and surveyors across India and the UAE. Interact with the
              map to explore our offices, or send an enquiry — we respond around the clock.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {company.offices.map((office, index) => (
                <button
                  key={office.label}
                  type="button"
                  onClick={() => selectOfficeFromMap(index)}
                  className="inline-flex items-center gap-2 rounded-full border border-pelagic-mist bg-white/85 px-4 py-2 text-sm font-semibold text-pelagic-charcoal shadow-sm backdrop-blur-sm transition hover:border-pelagic-gold/60 hover:shadow-md"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pelagic-gold text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  {office.label.split("—").pop()?.trim()}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={scrollToLocator}
              className="mt-8 text-sm font-semibold text-pelagic-accent underline-offset-4 hover:underline"
            >
              View all offices on the map ↓
            </button>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-pelagic-mist/80 bg-white/95 p-8 shadow-[0_20px_50px_-12px_rgba(26,22,20,0.12)] backdrop-blur-sm sm:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pelagic-water via-pelagic-gold-light to-pelagic-sunset" />
            <h2 className="font-display text-2xl font-semibold text-pelagic-ink">
              Send an enquiry
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Your message is saved securely. A consultant will contact you shortly.
            </p>

            {submitted ? (
              <div className="mt-8 rounded-2xl bg-pelagic-sand px-6 py-8 text-pelagic-ink">
                <p className="font-semibold">Thank you for your enquiry.</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Your message has been saved. A Pelagic Marine consultant will contact you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setError(null);
                  }}
                  className="mt-6 text-sm font-semibold text-pelagic-steel underline-offset-4 hover:underline"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-700" htmlFor="name">
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-pelagic-steel focus:ring-2 focus:ring-pelagic-steel/20"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700" htmlFor="company">
                      Company
                    </label>
                    <input
                      id="company"
                      name="company"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-pelagic-steel focus:ring-2 focus:ring-pelagic-steel/20"
                      placeholder="Your organisation"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700" htmlFor="email">
                    Work email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-pelagic-gold focus:ring-2 focus:ring-pelagic-gold/20"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700" htmlFor="service">
                    Service required
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-pelagic-gold focus:ring-2 focus:ring-pelagic-gold/20"
                  >
                    <option>Marine surveying</option>
                    <option>Naval architecture & design</option>
                    <option>Engineering / CFD</option>
                    <option>LNG & alternative fuels</option>
                    <option>Legal consultancy</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-pelagic-gold focus:ring-2 focus:ring-pelagic-gold/20"
                    placeholder="Vessel, port, survey type, or project details..."
                  />
                </div>

                {error && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-pelagic-gold px-6 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-pelagic-gold-light disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Unified locator — themed to match hero */}
      <section
        id="locations-map"
        className="relative overflow-hidden bg-contact-section py-20 scroll-mt-20"
      >
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-pelagic-gold-light/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-pelagic-water/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-pelagic-gold">
            Global offices
          </p>
          <h2 className="font-display mt-3 text-2xl font-semibold text-pelagic-ink sm:text-3xl">
            Search our global network of offices
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-pelagic-steel">
            Filter by region, search by city, or select a numbered location. The map updates as you
            browse.
          </p>
          <div className="mt-10">
            <OfficeLocator
              offices={company.offices}
              selectedIndex={selectedOffice}
              onSelectOffice={selectOffice}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
