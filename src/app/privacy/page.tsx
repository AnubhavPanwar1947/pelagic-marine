import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${company.name} collects, uses and protects personal data from website visitors and enquiry forms.`,
};

export default function PrivacyPage() {
  return (
    <LegalPageShell eyebrow="Legal" title="Privacy policy" updated="14 July 2026">
      <p>
        {company.legalName} (“Pelagic”, “we”, “us”) respects your privacy. This policy explains what
        personal data we collect through our website and enquiry channels, why we use it, and your
        choices. It mirrors the approach used by professional maritime firms: clear purpose, limited
        retention, and secure handling.
      </p>

      <h2>Who we are</h2>
      <p>
        Controller: {company.legalName}. Contact:{" "}
        <a href={`mailto:${company.emails.info}`}>{company.emails.info}</a> · India{" "}
        {company.phones.india} · UAE {company.phones.uae}.
      </p>

      <h2>Data we collect</h2>
      <ul>
        <li>
          <strong>Enquiry data</strong> — name, email, phone, company, vessel/IMO, port, message, and
          related operational details you submit on the contact form.
        </li>
        <li>
          <strong>Technical data</strong> — IP address (for rate-limiting and security), browser type,
          and security challenge tokens (e.g. Cloudflare Turnstile) when configured.
        </li>
        <li>
          <strong>Consent &amp; preference data</strong> — your cookie choices stored in the browser.
        </li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To respond to marine consultancy enquiries and assign the right office or expert.</li>
        <li>To send a confirmation or follow-up related to your request.</li>
        <li>To protect the site against spam, abuse and automated attacks.</li>
        <li>To operate essential site functions and, with consent, understand site usage.</li>
      </ul>

      <h2>Legal bases</h2>
      <p>
        Depending on your location, we rely on legitimate interests (responding to business enquiries
        and securing our systems), contract/pre-contract steps when you request services, and consent for
        optional analytics cookies.
      </p>

      <h2>Sharing</h2>
      <p>
        We do not sell personal data. We may use trusted processors such as hosting (e.g. Vercel),
        database (Supabase), email delivery (Resend), and bot protection (Cloudflare Turnstile) solely
        to run the website and enquiry workflow. They process data under their own security and
        privacy terms.
      </p>

      <h2>Retention</h2>
      <p>
        Enquiry records are kept as long as needed to handle your request and maintain a professional
        business record, then deleted or anonymised when no longer required, unless law requires
        longer retention.
      </p>

      <h2>Security</h2>
      <p>
        We use HTTPS, security headers, form spam controls (rate limits, honeypot, timing checks, and
        optional CAPTCHA), and access-restricted storage for enquiry data. No method is perfect; if
        you suspect an issue, email us immediately.
      </p>

      <h2>Your rights</h2>
      <p>
        Subject to applicable law, you may request access, correction, deletion, or restriction of
        your personal data, or object to certain processing. Contact{" "}
        <a href={`mailto:${company.emails.info}`}>{company.emails.info}</a>. You may also lodge a
        complaint with your local data protection authority where available.
      </p>

      <h2>Cookies</h2>
      <p>
        See our <a href="/cookies">Cookie policy</a> and use the on-site cookie controls to manage
        optional categories.
      </p>

      <h2>Updates</h2>
      <p>
        We may update this policy as our services or legal requirements change. The “Last updated”
        date at the top will change when we do.
      </p>
    </LegalPageShell>
  );
}
