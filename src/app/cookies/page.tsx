import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `How ${company.name} uses cookies and browser storage, and how you can manage consent.`,
};

export default function CookiesPage() {
  return (
    <LegalPageShell eyebrow="Legal" title="Cookie policy" updated="14 July 2026">
      <p>
        This policy explains how {company.name} uses cookies and similar technologies (such as local
        storage). It follows the category approach used on modern professional shipping and
        consultancy sites: essential by default, optional only with consent.
      </p>

      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device. We also use browser storage for the same
        kinds of purposes (remembering consent, protecting forms, basic preferences).
      </p>

      <h2>Categories we use</h2>
      <h3>Essential (always on)</h3>
      <ul>
        <li>Remembering your cookie consent choice</li>
        <li>Security and anti-spam measures on the enquiry form</li>
        <li>Core site operation and session integrity</li>
      </ul>

      <h3>Preferences (optional)</h3>
      <ul>
        <li>Remembering non-essential UI choices (for example splash preference)</li>
      </ul>

      <h3>Analytics (optional)</h3>
      <ul>
        <li>
          Anonymous usage measurement to improve content and performance — loaded only if you accept
          analytics. We do not sell this data.
        </li>
      </ul>

      <h2>Managing consent</h2>
      <p>
        On first visit you can <strong>Accept all</strong>, <strong>Reject non-essential</strong>, or{" "}
        <strong>Customise</strong> categories. Change your mind anytime via:
      </p>
      <ul>
        <li>The cookie button (bottom-left on every page)</li>
        <li>
          <strong>Cookies &amp; cache</strong> in the website footer
        </li>
        <li>
          <strong>Clear site cache</strong> inside preferences (clears stored site data and reloads)
        </li>
      </ul>

      <h2>Third parties</h2>
      <p>
        When enabled, analytics or security providers may set their own cookies under their policies.
        Maps embeds on the contact page may also set cookies controlled by the map provider.
      </p>

      <h2>More information</h2>
      <p>
        See our <a href="/privacy">Privacy policy</a> or email{" "}
        <a href={`mailto:${company.emails.info}`}>{company.emails.info}</a>.
      </p>
    </LegalPageShell>
  );
}
