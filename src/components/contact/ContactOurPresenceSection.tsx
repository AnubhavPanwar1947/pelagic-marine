import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getOfficeById } from "@/lib/site-data";

const PRESENCE_EYEBROW = "Our presence";

const MAP_ALT =
  "World map showing Pelagic Marine offices in Dubai, Mumbai, and Dehradun";

function PresenceCardShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="contact-office-card relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#d7e6f0] bg-white p-5">
      <div className="contact-office-card-top-accent" aria-hidden />
      <h3 className="text-base font-semibold text-[#0e235e]">{title}</h3>
      {children}
    </article>
  );
}

export function ContactOurPresenceSection() {
  const dubai = getOfficeById("dubai");
  const mumbai = getOfficeById("mumbai");
  const dehradun = getOfficeById("dehradun");

  return (
    <section
      className="contact-surface-icy border-b border-pelagic-sand pb-10 pt-8 sm:pb-12 sm:pt-10"
      aria-labelledby="contact-presence-heading"
    >
      <div className="mx-auto max-w-7xl min-w-0 px-4 sm:px-6 lg:px-8">
        <Reveal variant="text">
          <div className="min-w-0">
            <div className="contact-presence-heading min-w-0">
              <SectionHeading eyebrow={PRESENCE_EYEBROW} />
            </div>
            <h2 id="contact-presence-heading" className="sr-only">
              {PRESENCE_EYEBROW}
            </h2>

            <div className="contact-presence-map-wrap mt-8 min-w-0 sm:mt-10">
              <div className="contact-presence-map-scroller min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/maps/pelagic-world-map.svg"
                  alt={MAP_ALT}
                  className="contact-presence-map"
                  width={1600}
                  height={800}
                  decoding="async"
                />
              </div>
            </div>

            <ul className="contact-presence-cards mt-6 grid min-w-0 list-none gap-4 p-0 sm:mt-8 md:grid-cols-3">
              <li className="min-w-0">
                <PresenceCardShell title="Dubai">
                  <address className="type-copy mt-3 min-w-0 break-words not-italic text-pelagic-copy">
                    {dubai.address}
                  </address>
                </PresenceCardShell>
              </li>

              <li className="min-w-0">
                <PresenceCardShell title="India">
                  <div className="type-copy mt-3 min-w-0 space-y-4 break-words text-pelagic-copy">
                    <div>
                      <p className="text-sm font-semibold text-[#0e235e]">
                        Mumbai
                      </p>
                      <address className="mt-1 not-italic">{mumbai.address}</address>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0e235e]">
                        Dehradun
                      </p>
                      <address className="mt-1 not-italic">
                        {dehradun.address}
                      </address>
                    </div>
                  </div>
                </PresenceCardShell>
              </li>

              <li className="min-w-0">
                <PresenceCardShell title="Singapore">
                  <p className="type-copy mt-3 min-w-0 break-words text-pelagic-copy">
                    Office details coming soon.
                  </p>
                </PresenceCardShell>
              </li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
