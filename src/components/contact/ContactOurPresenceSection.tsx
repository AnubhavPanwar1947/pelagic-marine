import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getOfficeById } from "@/lib/site-data";

const PRESENCE_EYEBROW = "Our presence";

const MAP_ALT = "World map";

function PresenceCardBody({ children }: { children: ReactNode }) {
  return (
    <ul className="contact-office-card-bullet-list mt-3 min-w-0 p-0">
      <li className="min-w-0 break-words">{children}</li>
    </ul>
  );
}

function PresenceCardShell({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <article className="contact-office-card relative flex min-h-0 min-w-0 flex-col rounded-xl border border-[#d7e6f0] p-5">
      <div className="contact-office-card-top-accent" aria-hidden />
      <h3 className="contact-office-card-title text-base font-semibold">{title}</h3>
      {children}
    </article>
  );
}

export function ContactOurPresenceSection() {
  const dubai = getOfficeById("dubai");
  const dehradun = getOfficeById("dehradun");

  return (
    <section
      className="contact-surface-icy border-b border-pelagic-sand pb-8 pt-6 sm:pb-10 sm:pt-8"
      aria-labelledby="contact-presence-heading"
    >
      <div className="mx-auto max-w-7xl min-w-0 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <Reveal variant="text">
            <div className="contact-presence-heading min-w-0">
              <SectionHeading eyebrow={PRESENCE_EYEBROW} />
            </div>
          </Reveal>
          <h2 id="contact-presence-heading" className="sr-only">
            {PRESENCE_EYEBROW}
          </h2>

          <div className="contact-presence-body min-w-0">
            <div className="contact-presence-map-wrap min-h-0 min-w-0">
              <div className="contact-presence-map-scroller min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/map.png"
                  alt={MAP_ALT}
                  className="contact-presence-map"
                  width={2000}
                  height={1500}
                  fetchPriority="high"
                />
              </div>
            </div>

            <Reveal variant="text">
              <ul className="contact-presence-cards mt-4 grid min-w-0 list-none grid-cols-1 gap-4 p-0 md:mt-0 md:grid-cols-2">
              <li className="min-w-0">
                <PresenceCardShell title="Dubai">
                  <PresenceCardBody>
                    <address className="contact-office-card-body type-copy not-italic">
                      {dubai.address}
                    </address>
                  </PresenceCardBody>
                </PresenceCardShell>
              </li>

              <li className="min-w-0">
                <PresenceCardShell title="India">
                  <PresenceCardBody>
                    <address className="contact-office-card-body type-copy not-italic">
                      {dehradun.address}
                    </address>
                  </PresenceCardBody>
                </PresenceCardShell>
              </li>

              <li className="contact-presence-card-singapore min-w-0">
                <PresenceCardShell title="Singapore">
                  <PresenceCardBody>
                    <address className="contact-office-card-body type-copy not-italic">
                      12 Woodlands Square, #06-74, Woods Square, Singapore 737715
                    </address>
                  </PresenceCardBody>
                </PresenceCardShell>
              </li>

              <li className="contact-presence-card-japan min-w-0">
                <PresenceCardShell title="Japan — Associate Office">
                  <PresenceCardBody>
                    <address className="contact-office-card-body type-copy not-italic">
                      4-54-6 UTSUKUSHIGAOKA, AOBA WARD, YOKOHAMA CITY -225-0002
                    </address>
                  </PresenceCardBody>
                </PresenceCardShell>
              </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
