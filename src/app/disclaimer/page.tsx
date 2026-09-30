import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import {
  LegalContactListItem,
  legalContactListClassName,
} from "@/components/legal/LegalContactIcons";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Website disclaimer for Pelagic Marine Solutions LLC — general information only, not professional advice.",
};

const wrap = "min-w-0 break-words";

export default function DisclaimerPage() {
  return (
    <LegalPageShell title="Disclaimer">
      <div className={wrap}>
        <h2 className={wrap}>Interpretation and Definitions</h2>
        <dl className={`${wrap} space-y-3`}>
          <dt className={`${wrap} font-semibold text-pelagic-charcoal`}>“Company”</dt>
          <dd className={`${wrap} pb-2`}>
            means Pelagic Marine Solutions LLC (referred to as “Pelagic”, “the Company”, “We”, “Us” or
            “Our”), having its office at Office No. 104, Almas Business Center, Aghaadir Building, Al
            Raffa, Dubai, U.A.E.
          </dd>
          <dt className={`${wrap} font-semibold text-pelagic-charcoal`}>“Service”</dt>
          <dd className={`${wrap} pb-2`}>
            means the Website and the information, content, materials, features and functionalities
            made available through the Website and services provided by Pelagic.
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
            means the individual accessing or using the Service, or the company or other legal entity
            on behalf of which such individual is accessing or using the Service.
          </dd>
        </dl>

        <h2 className={wrap}>Disclaimer</h2>
        <p className={wrap}>
          The information, content and materials contained on the Service are provided for general
          information purposes and to provide an overview of the Company and its service offerings only.
          Such information is not intended to constitute, and should not be relied upon as, professional
          advice, a technical assessment or a recommendation in relation to any specific matter.
        </p>
        <p className={wrap}>
          While the Company uses reasonable efforts to provide accurate and up-to-date information, the
          Company does not warrant or guarantee the completeness, accuracy, reliability or suitability
          of the contents of the Service. The Company assumes no responsibility for errors or omissions
          in the contents of the Service.
        </p>
        <p className={wrap}>
          In no event shall the Company be liable for any special, direct, indirect, consequential or
          incidental damages, or any damages whatsoever, whether in an action of contract, negligence
          or other tort, arising out of or in connection with the use of or reliance on the Service or
          the contents of the Service. The Company reserves the right to make additions, deletions or
          modifications to the contents of the Service at any time without prior notice. While the
          Company takes reasonable measures to maintain the security of the Website, the Company does
          not warrant that the Service is free of viruses or other harmful components.
        </p>

        <h2 className={wrap}>External Links Disclaimer</h2>
        <p className={wrap}>
          The Service may contain links to external third-party websites or services that are not
          provided or maintained by, or in any way affiliated with, the Company. Please note that the
          Company does not control and is not responsible for the content, availability, security,
          privacy policies or practices of such third-party websites or services and does not guarantee
          the accuracy, relevance, timeliness or completeness of any information contained on these
          external websites or services. Your access to and use of any such third-party websites or
          services is subject to their respective terms and policies.
        </p>

        <h2 className={wrap}>Professional Advice Disclaimer</h2>
        <p className={wrap}>
          The information on the Service is provided on the understanding that the Company is not,
          through the Website, rendering professional engineering, surveying, legal, accounting, tax or
          other professional advice in respect of any specific matter. General information published on
          the Website should not be used as a substitute for a formal engagement with the Company or for
          consultation with a suitably qualified professional. No information made available through the
          Website constitutes a technical report, survey, assessment, certification, calculation,
          recommendation or other professional deliverable of the Company.
        </p>
        <p className={wrap}>
          Any professional services are provided only under, and subject to, a separate written
          engagement and the Company’s{" "}
          <Link href="/engagement" className="break-words">
            Standard Terms and Conditions of Engagement
          </Link>
          . Any reports, assessments, calculations, analyses, recommendations or other professional
          deliverables issued by the Company shall be subject to the terms, assumptions, qualifications,
          limitations and disclaimers applicable to the relevant engagement.
        </p>

        <h2 className={wrap}>Errors and Omissions Disclaimer</h2>
        <p className={wrap}>
          The information given by the Service is for general guidance on matters of interest only. Even
          though the Company takes every reasonable precaution to ensure that the content of the Service
          is both current and accurate, errors can occur. In addition, given the changing nature of laws,
          rules and regulations, technical standards, industry practices and other information, there may
          be delays, omissions or inaccuracies in the information contained on the Service. To the fullest
          extent permitted by applicable laws, the Company is not responsible for any errors or omissions
          in such information, or for any loss arising from reliance on or the results obtained from the
          use of this information.
        </p>

        <h2 className={wrap}>Views Expressed Disclaimer</h2>
        <p className={wrap}>
          The Service may contain views and opinions which are those of the respective authors and do not
          necessarily reflect the official policy or position of the Company or any other author, agency,
          organisation, employer or company, including the Company, unless expressly stated otherwise.
        </p>

        <h2 className={wrap}>
          Website Information — Disclaimer and Limitation of Liability (“Use at Your Own Risk”
          Disclaimer)
        </h2>
        <p className={wrap}>
          All information in the Service is provided “as is”, with no guarantee of completeness, accuracy,
          timeliness or of the results obtained from the use of this information, and without warranty of
          any kind, express or implied, including but not limited to warranties of performance,
          merchantability and fitness for a particular purpose. The Company shall not be liable to You or
          anyone else for any decision made or action taken in reliance on the information given by the
          Service, or for any consequential, special or similar damages to the fullest extent permitted
          by applicable laws, even if advised of the possibility of such damages.
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
