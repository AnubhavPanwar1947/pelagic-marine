import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { EngagementTermsBody } from "@/app/engagement/EngagementTermsBody";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Standard Terms and Conditions of Engagement",
  description: `Standard terms and conditions of engagement for ${company.name} — website draft copy pending formal legal review.`,
};

export default function EngagementPage() {
  return (
    <LegalPageShell title="Standard Terms and Conditions of Engagement" updated="29 September 2026">
      <EngagementTermsBody />
    </LegalPageShell>
  );
}
