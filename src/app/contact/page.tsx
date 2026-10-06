import { ContactEnquiryForm } from "@/components/contact/ContactEnquiryForm";
import { ContactEnquiryProvider } from "@/components/contact/ContactEnquiryContext";
import { ContactOurPresenceSection } from "@/components/contact/ContactOurPresenceSection";
import { Reveal } from "@/components/ui/Reveal";
import "./contact-theme.css";

export default function ContactPage() {
  return (
    <div className="contact-page">
      <ContactEnquiryProvider>
        <ContactOurPresenceSection />

        <section className="contact-surface-soft border-b border-pelagic-sand pb-12 pt-8 sm:pb-16 sm:pt-10">
          <div className="mx-auto max-w-7xl min-w-0 px-4 sm:px-6 lg:px-8">
            <Reveal variant="text">
              <div className="mx-auto max-w-2xl min-w-0">
                <div
                  id="enquiry-form"
                  className="contact-enquiry-shell min-w-0 scroll-mt-28"
                >
                  <ContactEnquiryForm />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </ContactEnquiryProvider>
    </div>
  );
}
