import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import {
  LegalContactListItem,
  legalContactListClassName,
} from "@/components/legal/LegalContactIcons";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Cookies Policy",
  description:
    "How Pelagic Marine Solutions LLC uses cookies on its website, the types of cookies used, and how you can manage them.",
};

const wrap = "min-w-0 break-words";

export default function CookiesPage() {
  return (
    <LegalPageShell title="Cookies policy">
      <div className={wrap}>
        <p className={wrap}>
          This Cookies Policy explains how Pelagic Marine Solutions LLC (“Pelagic”, the “Company”,
          “We”, “Us” or “Our”) uses Cookies on Our Website, what Cookies are and how We use them. You
          should read this policy so You can understand what type of cookies We use, the information
          We collect using Cookies, and how that information is used. Cookies help Us operate the
          Website, provide certain Website functionality, remember Your preferences and, where
          applicable, understand and improve how the Website is used.
        </p>
        <p className={wrap}>
          Cookies do not typically contain any information that directly personally identifies a user,
          but Personal Data that We store about You may be linked to information stored in and
          obtained from Cookies. For further information on how We collect, use, store and keep Your
          Personal Data secure, see Our{" "}
          <Link href="/privacy-policy" className="break-words">
            Privacy policy
          </Link>
          . We do not store sensitive personal information, such as mailing addresses or account
          passwords, in the Cookies We use.
        </p>

        <h2 className={wrap}>Interpretation and Definitions</h2>
        <dl className={`${wrap} space-y-3`}>
          <dt className={`${wrap} font-semibold text-pelagic-charcoal`}>“Company”</dt>
          <dd className={`${wrap} pb-2`}>
            means Pelagic Marine Solutions LLC (referred to as “Pelagic”, “the Company”, “We”, “Us” or
            “Our”), Office No. 104, Almas Business Center, Aghaadir Building, Al Raffa, Dubai, U.A.E.
          </dd>
          <dt className={`${wrap} font-semibold text-pelagic-charcoal`}>“Cookies”</dt>
          <dd className={`${wrap} pb-2`}>
            means small files that are placed on Your computer, mobile device or any other device by a
            website, containing information relating to Your use of that website, including details of
            Your browsing history, browsing activity and preferences on that website among its many
            uses.
          </dd>
          <dt className={`${wrap} font-semibold text-pelagic-charcoal`}>“Personal Data”</dt>
          <dd className={`${wrap} pb-2`}>
            means any information that relates to an identified or identifiable individual, directly or
            indirectly, in accordance with applicable data-protection laws.
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
            means the individual accessing or using the Website, or a company or any legal entity on
            behalf of which such individual is accessing or using the Website.
          </dd>
        </dl>

        <h2 className={wrap}>Types of Cookies We Use</h2>
        <p className={wrap}>
          Cookies can be “Persistent” or “Session” Cookies. Persistent Cookies remain on Your personal
          computer or mobile device when You go offline, while Session Cookies are deleted as soon as
          You close Your web browser. We use both Session and/or Persistent Cookies, as applicable for
          the purposes set out below.
        </p>

        <h3 className={wrap}>Necessary / Essential Cookies</h3>
        <p className={wrap}>
          <strong>Type:</strong> Session Cookies.
          <br />
          <strong>Administered by:</strong> Us.
          <br />
          <strong>Purpose:</strong> These Cookies are essential to provide You with services available
          through the Website and to enable You to use some of its features. Without these Cookies, the
          basic services You have asked for cannot be provided, and We only use these Cookies to provide
          You with those services.
        </p>

        <h3 className={wrap}>Functionality Cookies</h3>
        <p className={wrap}>
          <strong>Type:</strong> Persistent Cookies.
          <br />
          <strong>Administered by:</strong> Us.
          <br />
          <strong>Purpose:</strong> These Cookies allow Us to remember choices You make when You use
          the Website, such as remembering Your preferences or language selection. The purpose of these
          Cookies is to provide You with a more personal experience and to avoid You having to
          re-enter Your preferences every time You use the Website.
        </p>

        <h3 className={wrap}>Analytics / Performance Cookies</h3>
        <p className={wrap}>
          <strong>Type:</strong> Persistent Cookies.
          <br />
          <strong>Administered by:</strong> Us or third-party providers.
          <br />
          <strong>Purpose:</strong> These Cookies may be used to understand how visitors interact with
          the Website, so that We can measure and improve its performance.
        </p>
        <p className={wrap}>
          At present, the Website does not use third-party analytics cookies (such as Google Analytics).
          Should We introduce such cookies in future, this Cookies Policy and, where applicable, Our
          Privacy Policy will be updated and, where required by applicable law, Your consent will be
          obtained through a compliant consent mechanism before any non-essential cookies are placed.
        </p>

        <h2 className={wrap}>Your Choices Regarding Cookies</h2>
        <p className={wrap}>
          You may manage or control Cookies through Your browser settings. Where Your consent is
          required for the use of certain Cookies, You may withdraw or change Your consent at any time
          through Your browser settings, as applicable.
        </p>
        <p className={wrap}>
          If You prefer to avoid the use of non-essential Cookies on the Website, You may disable or
          refuse the use of such Cookies in Your browser settings and then delete the Cookies
          previously saved in Your browser associated with this Website. You may use this option to
          prevent the use of Cookies at any time.
        </p>
        <p className={wrap}>
          Please note that Necessary / Essential Cookies may be required for the proper operation and
          security of the Website. If You do not accept certain of Our Cookies, You may experience some
          inconvenience in Your use of the Website and some features may not function properly.
        </p>
        <p className={wrap}>
          If You would like to delete Cookies or instruct Your web browser to delete or refuse Cookies,
          please visit the help pages of Your web browser:
        </p>
        <ul className={`${wrap} list-disc pl-5`}>
          <li className={wrap}>
            For the Chrome web browser:{" "}
            <a
              href="https://support.google.com/accounts/answer/32050"
              className="break-all"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://support.google.com/accounts/answer/32050
            </a>
          </li>
          <li className={wrap}>
            For the Firefox web browser:{" "}
            <a
              href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored"
              className="break-all"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored
            </a>
          </li>
          <li className={wrap}>
            For the Safari web browser:{" "}
            <a
              href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
              className="break-all"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac
            </a>
          </li>
          <li className={wrap}>
            For Microsoft Edge and any other web browser, please refer to that browser’s official help
            pages.
          </li>
        </ul>

        <h2 className={wrap}>Changes to This Cookies Policy</h2>
        <p className={wrap}>
          We may update this Cookies Policy from time to time to reflect changes to the Cookies or
          technologies used on the Website or applicable legal or regulatory requirements. Any changes
          will be posted on this page and the “Last updated” date will be revised accordingly.
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
            Office No. 104, Almas Business Center, Aghaadir Building, Al Raffa, Dubai,
            U.A.E.
          </LegalContactListItem>
        </ul>
      </div>
    </LegalPageShell>
  );
}
