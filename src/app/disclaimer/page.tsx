import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `Website disclaimer for ${company.name} — general information only, not project-specific advice.`,
};

export default function DisclaimerPage() {
  return (
    <LegalPageShell title="Disclaimer" updated="29 September 2026">
      <p>
        <strong>Draft notice:</strong> This page is website draft copy pending formal legal review. It
        does not replace advice from qualified counsel or project-specific documentation.
      </p>

      <h2>General information</h2>
      <p>
        Content on this website is published by {company.legalName} for general information about our
        marine consultancy, surveying, and engineering services. It is not tailored to a particular
        vessel, contract, jurisdiction, or operational situation unless we confirm that separately in
        writing.
      </p>

      <h2>No professional advice</h2>
      <p>
        Nothing on this site constitutes naval architecture, marine engineering, legal, or regulatory
        advice. You should not rely on website copy alone when making operational, commercial, or
        compliance decisions. Engagements are scoped through proposals, statements of work, or
        engagement letters — see our{" "}
        <a href="/engagement">Standard T&amp;C of engagement</a> overview.
      </p>

      <h2>Accuracy and updates</h2>
      <p>
        We aim to keep information current, but we do not warrant that all content is complete,
        accurate, or up to date at every moment. Case studies and examples are illustrative unless
        stated otherwise.
      </p>

      <h2>Third-party content</h2>
      <p>
        Links or embeds (including maps and social profiles) may point to third-party services. We do
        not control their content and are not responsible for their availability or policies.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this disclaimer:{" "}
        <a href={`mailto:${company.emails.info}`}>{company.emails.info}</a> · India{" "}
        {company.phones.india} · UAE {company.phones.uae} ·{" "}
        <a href="/contact">Contact page</a>.
      </p>
    </LegalPageShell>
  );
}
