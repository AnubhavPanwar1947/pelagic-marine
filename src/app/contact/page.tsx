"use client";

import { FormEvent, useState } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { company } from "@/lib/site-data";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title="Connect with Pelagic Marine consultants"
        description="Reach our team 24/7 for surveying, engineering, LNG operations, or maritime legal support."
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl font-semibold text-pelagic-ink">
            Our offices
          </h2>
          <div className="mt-8 space-y-6">
            {company.offices.map((office) => (
              <div
                key={office.label}
                className="card-premium rounded-3xl border border-pelagic-mist bg-white p-6 shadow-sm"
              >
                <h3 className="font-semibold text-pelagic-charcoal">{office.label}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {office.address}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-4 rounded-3xl bg-pelagic-charcoal p-8 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pelagic-gold-light">
              Direct contact
            </p>
            <p>
              <span className="text-slate-400">Email · </span>
              <a href={`mailto:${company.emails.info}`} className="hover:text-pelagic-gold-light">
                {company.emails.info}
              </a>
            </p>
            <p>
              <span className="text-slate-400">India · </span>
              <a
                href={`tel:${company.phones.india.replace(/\s/g, "")}`}
                className="hover:text-pelagic-gold-light"
              >
                {company.phones.india}
              </a>
            </p>
            <p>
              <span className="text-slate-400">UAE · </span>
              <a
                href={`tel:${company.phones.uae.replace(/\s/g, "")}`}
                className="hover:text-pelagic-gold-light"
              >
                {company.phones.uae}
              </a>
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-pelagic-mist bg-white p-10 shadow-lg lg:col-span-3">
          <h2 className="font-display text-2xl font-semibold text-pelagic-ink">
            Send an enquiry
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            We will connect this form to email or database in the next phase.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-2xl bg-pelagic-sand px-6 py-8 text-pelagic-ink">
              <p className="font-semibold">Thank you for your enquiry.</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Your message has been recorded locally for now. Our team will
                respond once the backend is connected.
              </p>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 sm:grid-cols-2">
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
                  rows={5}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-pelagic-gold focus:ring-2 focus:ring-pelagic-gold/20"
                  placeholder="Tell us about your vessel, project, or legal matter..."
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-pelagic-gold px-6 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-pelagic-gold-light"
              >
                Submit enquiry
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
