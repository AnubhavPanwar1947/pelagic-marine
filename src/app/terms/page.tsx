import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Website terms of use for ${company.name} — scope of information, liability limits, and acceptable use.`,
};

export default function TermsPage() {
  return (
    <LegalPageShell eyebrow="Legal" title="Terms of use" updated="14 July 2026">
      <p>
        By using this website you agree to these terms. They govern access to our public site only —
        professional engagements are covered by separate contracts, proposals, or engagement letters.
      </p>

      <h2>Information on this site</h2>
      <p>
        Content is provided for general information about {company.name} and our marine consultancy
        capabilities. It is not a substitute for project-specific advice, class rules interpretation
        for a particular vessel, or legal advice. Operational decisions should not be based solely on
        website copy.
      </p>

      <h2>Enquiries</h2>
      <p>
        Submitting an enquiry does not create a consultancy contract. We will respond in good faith;
        availability, commercial terms, and scope are confirmed separately. Please provide accurate
        vessel and contact details.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not attempt to disrupt, scrape abusively, or overload the site or forms.</li>
        <li>Do not submit unlawful, harmful, or misleading content.</li>
        <li>Do not impersonate another person or organisation.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        Site design, branding, text, and original graphics are owned by {company.legalName} or our
        licensors. You may not copy or reuse them commercially without written permission.
      </p>

      <h2>Third-party links</h2>
      <p>
        Links to external sites (including maps or social profiles) are provided for convenience. We
        are not responsible for their content or privacy practices.
      </p>

      <h2>Liability</h2>
      <p>
        To the fullest extent permitted by law, we are not liable for loss arising from use of, or
        inability to use, this website or reliance on its general content. Nothing in these terms
        excludes liability that cannot be limited by law.
      </p>

      <h2>Privacy</h2>
      <p>
        Personal data is handled as described in our <a href="/privacy">Privacy policy</a> and{" "}
        <a href="/cookies">Cookie policy</a>.
      </p>

      <h2>Contact</h2>
      <p>
        Questions: <a href={`mailto:${company.emails.info}`}>{company.emails.info}</a> ·{" "}
        <a href="/contact">Contact page</a>.
      </p>
    </LegalPageShell>
  );
}
