import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import {
  LegalContactListItem,
  legalContactListClassName,
} from "@/components/legal/LegalContactIcons";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and Conditions for use of the Pelagic Marine Solutions L.L.C. website and services.",
};

const wrap = "min-w-0 break-words";

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms and Conditions">
      <div className={wrap}>
        <h2 className={wrap}>Interpretation and Definitions</h2>
        <p className={wrap}>
          The words of which the initial letter is capitalised have meanings defined under the
          following conditions. The following definitions shall have the same meaning regardless of
          whether they appear in singular or in plural.
        </p>
        <dl className={`${wrap} space-y-3`}>
          <dt className={`${wrap} font-semibold text-pelagic-charcoal`}>“Company”</dt>
          <dd className={`${wrap} pb-2`}>
            means Pelagic Marine Solutions L.L.C. (referred to as “Pelagic”, “the Company”, “We”, “Us”
            or “Our”), having its office at: Office No. 104, Almas Business Center, Aghaadir Building,
            Al Raffa, Dubai, U.A.E.
          </dd>
          <dt className={`${wrap} font-semibold text-pelagic-charcoal`}>“Country”</dt>
          <dd className={`${wrap} pb-2`}>means the United Arab Emirates.</dd>
          <dt className={`${wrap} font-semibold text-pelagic-charcoal`}>“Device”</dt>
          <dd className={`${wrap} pb-2`}>
            means any device that can access the Service, such as a computer, a mobile phone or a
            digital tablet.
          </dd>
          <dt className={`${wrap} font-semibold text-pelagic-charcoal`}>“Service”</dt>
          <dd className={`${wrap} pb-2`}>
            means the Website and the information, content, materials, features and functionalities
            made available through the Website.
          </dd>
          <dt className={`${wrap} font-semibold text-pelagic-charcoal`}>“Terms and Conditions”</dt>
          <dd className={`${wrap} pb-2`}>
            means (also referred to as “Terms”) these Terms and Conditions that form the entire
            agreement between You and the Company regarding the use of the Service.
          </dd>
          <dt className={`${wrap} font-semibold text-pelagic-charcoal`}>“Website”</dt>
          <dd className={`${wrap} pb-2`}>
            means the website operated by Pelagic Marine Solutions LLC, accessible from{" "}
            <a href="https://pelagic-marine.com" className="break-all">
              https://pelagic-marine.com
            </a>
          </dd>
          <dt className={`${wrap} font-semibold text-pelagic-charcoal`}>“You”</dt>
          <dd className={`${wrap} pb-2`}>
            means the individual accessing or using the Service, or the company or other legal entity on
            behalf of which such individual is accessing or using the Service.
          </dd>
        </dl>

        <h2 className={wrap}>Acknowledgment</h2>
        <p className={wrap}>
          These are the Terms and Conditions governing the use of this Service and the agreement that
          operates between You and the Company. Your access to and use of the Service is conditioned on
          Your acceptance of and compliance with these Terms. These Terms apply to all visitors and
          users who access or use the Service. By accessing or using the Service, You agree to be bound
          by these Terms. If You disagree with any part of these Terms, then You may not access or use
          the Service.
        </p>
        <p className={wrap}>
          Where You access or use the Service on behalf of a company or other legal entity, You
          represent that You are authorised to bind such entity to these Terms.
        </p>
        <p className={wrap}>
          You represent that You are over the age of 18. The Company does not permit those under 18 to
          use the Service.
        </p>
        <p className={wrap}>
          Your access to and use of the Service is also subject to the{" "}
          <Link href="/privacy-policy" className="break-words">
            Privacy policy
          </Link>{" "}
          and{" "}
          <Link href="/cookies-policy" className="break-words">
            Cookies policy
          </Link>{" "}
          of the Company, which describe Our policies and procedures on the collection, use and
          disclosure of Your personal information and tell You about Your privacy rights. Please read
          the Privacy Policy carefully before using the Service.
        </p>

        <h2 className={wrap}>The Service</h2>
        <p className={wrap}>
          The Service is an informational website describing the Company and the marine engineering,
          design, analysis, surveying and consultancy services it provides. Information, content and
          materials made available through the Service are provided for general informational purposes
          and to provide an overview of the Company and its services.
        </p>
        <p className={wrap}>
          The Website does not offer user accounts, registration or online purchasing. Where You choose
          to contact the Company through an enquiry or contact form, You agree to provide accurate and
          complete information.
        </p>
        <p className={wrap}>
          Nothing made available through the Service constitutes professional engineering, surveying,
          legal or other professional advice, or a technical report, survey, assessment, certification,
          calculation, analysis, recommendation or other professional deliverable of the Company in
          relation to any specific matter. You should not rely upon Website content as a substitute for
          a formal professional engagement with the Company.
        </p>
        <p className={wrap}>
          Any professional services provided by the Company shall be subject to a separate engagement
          and the Company’s applicable{" "}
          <Link href="/standard-terms-and-conditions-of-engagement" className="break-words">
            Standard Terms and Conditions of Engagement
          </Link>
          . Any reports, assessments, calculations, analyses, recommendations or other professional
          deliverables issued pursuant to such engagement shall be subject to the terms, qualifications,
          limitations and disclaimers applicable to that engagement.
        </p>

        <h2 className={wrap}>Links to Other Websites</h2>
        <p className={wrap}>
          Our Service may contain links to third-party websites or services that are not owned or
          controlled by the Company. The Company has no control over, and assumes no responsibility for,
          the content, availability, security, privacy policies or practices of any third-party websites
          or services. We strongly advise You to read the terms and conditions and privacy policies of
          any third-party websites or services that You visit. Your access to and use of such third-party
          websites or services is subject to their respective terms and policies.
        </p>

        <h2 className={wrap}>Intellectual Property</h2>
        <p className={wrap}>
          The Service and its original content, features and functionality (including text, drawings,
          images, analyses and branding) are and will remain the exclusive property of the Company
          and/or its licensors, as applicable. The content of the Service may not be copied, reproduced,
          modified, distributed, published, transmitted, commercially exploited or otherwise used for
          any commercial purpose without the prior written consent of the Company.
        </p>
        <p className={wrap}>
          Nothing in these Terms grants You any licence or right to use any intellectual property of the
          Company except for the limited right to access and use the Website for its intended purpose.
        </p>

        <h2 className={wrap}>Acceptable Use</h2>
        <p className={wrap}>You shall not:</p>
        <ul className={`${wrap} list-disc pl-5`}>
          <li className={wrap}>
            misuse the Website or use the Service for any unlawful, fraudulent or unauthorised purpose;
          </li>
          <li className={wrap}>
            interfere with or disrupt the operation or security of the Website;
          </li>
          <li className={wrap}>
            attempt to gain unauthorised access to the Website or its systems;
          </li>
          <li className={wrap}>introduce viruses or other harmful material; or</li>
          <li className={wrap}>
            use the Website in any manner that may damage the Company or impair the use of the Website
            by others.
          </li>
        </ul>

        <h2 className={wrap}>Termination</h2>
        <p className={wrap}>
          We may terminate or suspend Your access immediately, without prior notice or liability, where
          We reasonably consider that You have breached these Terms, misused the Service, created a
          security or legal risk, or where suspension or termination is otherwise necessary to protect
          the Website, the Company or other users, including without limitation if You breach these
          Terms. Upon termination, Your right to use the Service will cease immediately.
        </p>

        <h2 className={wrap}>Limitation of Liability</h2>
        <p className={wrap}>
          To the maximum extent permitted by applicable law, in no event shall the Company or its
          suppliers be liable for any special, incidental, indirect or consequential loss or damages
          whatsoever (including, but not limited to, damages for loss of profits, loss of data or other
          information, business interruption, personal injury or loss of privacy) arising out of or in
          any way related to the use of, reliance on or inability to use the Service, even if the Company
          or any supplier has been advised of the possibility of such damages.
        </p>
        <p className={wrap}>
          The Company shall not be responsible for any decision made or action taken in reliance upon
          information or content made available through the Service.
        </p>
        <p className={wrap}>
          Nothing in these Terms excludes or limits any liability of the Company that cannot be excluded
          or limited under applicable law.
        </p>
        <p className={wrap}>
          Some jurisdictions do not allow the exclusion or limitation of liability for incidental or
          consequential damages; in such jurisdictions, each party’s liability will be limited to the
          greatest extent permitted by law.
        </p>

        <h2 className={wrap}>“AS IS” and “AS AVAILABLE” Disclaimer of Warranties</h2>
        <p className={wrap}>
          The Service is provided to You “AS IS” and “AS AVAILABLE” to the maximum extent permitted by
          applicable law. While the Company uses reasonable efforts to maintain the Website and provide
          accurate and up-to-date information, the Company does not warrant or guarantee the
          completeness, accuracy, reliability, availability or suitability of the Service or its content,
          with all faults and defects, without warranty of any kind.
        </p>
        <p className={wrap}>
          To the maximum extent permitted under applicable law, the Company expressly disclaims all
          warranties, whether express, implied, statutory or otherwise, with respect to the Service,
          including all implied warranties of merchantability, fitness for a particular purpose, title
          and non-infringement. The Company makes no representation that the Service will meet Your
          requirements, be uninterrupted or error-free, or that any errors or defects can or will be
          corrected.
        </p>
        <p className={wrap}>
          The Company reserves the right to modify, update, suspend or discontinue any part of the
          Website or its content at any time without prior notice.
        </p>

        <h2 className={wrap}>Sanctions and Export Compliance</h2>
        <ul className={`${wrap} list-disc pl-5`}>
          <li className={wrap}>
            You represent and warrant that You are not located in, and are not a national or resident
            of, any country or territory subject to comprehensive trade sanctions, and that You are not
            listed on any applicable list of prohibited or restricted parties maintained by any competent
            national, supranational or international authority.
          </li>
          <li className={wrap}>
            You shall not use the Service in any manner that would cause the Company to breach any
            applicable sanctions, export control or trade-restriction laws or regulations.
          </li>
        </ul>

        <h2 className={wrap}>Governing Law</h2>
        <p className={wrap}>
          The laws of the United Arab Emirates and the applicable laws of the Emirate of Dubai shall
          govern these Terms and Your use of the Service. Any disputes arising under or in connection
          with these Terms or the Website shall be subject to the exclusive jurisdiction of the Courts
          of Dubai, U.A.E.
        </p>

        <h2 className={wrap}>Disputes Resolution</h2>
        <p className={wrap}>
          If You have any concern or dispute about the Service, You agree to first try to resolve the
          dispute informally by contacting the Company.
        </p>

        <h2 className={wrap}>For European Union (EU) Users</h2>
        <p className={wrap}>
          If You are a consumer resident in the European Union, You will benefit from any mandatory
          provisions of the law of the country in which You are resident.
        </p>

        <h2 className={wrap}>Severability and Waiver</h2>
        <p className={wrap}>
          If any provision of these Terms is held to be unenforceable or invalid, such provision will be
          changed and interpreted to accomplish the objectives of such provision to the greatest extent
          possible under applicable law, and the remaining provisions will continue in full force and
          effect. The failure to exercise a right or to require performance of an obligation under these
          Terms shall not affect a party’s ability to exercise such right or require such performance at
          any time thereafter, nor shall the waiver of a breach constitute a waiver of any subsequent
          breach.
        </p>

        <h2 className={wrap}>Translation Interpretation</h2>
        <p className={wrap}>
          These Terms and Conditions may have been translated into other languages if We have made them
          available to You through Our Service. You agree that the original English text shall prevail in
          the case of a dispute. In the event of any inconsistency between a translated version and the
          English version, the English version shall prevail, subject to applicable law.
        </p>

        <h2 className={wrap}>Changes to These Terms and Conditions</h2>
        <p className={wrap}>
          We reserve the right, at Our sole discretion, to modify or replace these Terms at any time.
          Any revised Terms will be posted on the Website and the “Last updated” date will be revised
          accordingly.
        </p>
        <p className={wrap}>
          By continuing to access or use Our Service after any revisions become effective, You agree to
          be bound by the revised Terms. If You do not agree to the new Terms, in whole or in part,
          please stop using the Website and the Service.
        </p>

        <h2 className={wrap}>Contact Us</h2>
        <p className={wrap}>If You have any questions regarding this page, You can contact Us:</p>
        <ul className={legalContactListClassName}>
          <LegalContactListItem kind="mail">
            <a href={`mailto:${company.emails.info}`} className="break-all">
              {company.emails.info}
            </a>
          </LegalContactListItem>
          <LegalContactListItem kind="phone">+971 50 394 1049</LegalContactListItem>
          <LegalContactListItem kind="location">
            Office No. 104, Almas Business Center, Aghaadir Building, Al Raffa, Dubai, U.A.E.
          </LegalContactListItem>
        </ul>
      </div>
    </LegalPageShell>
  );
}
