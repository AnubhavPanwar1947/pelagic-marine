import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { EngagementTermsBody } from "@/app/engagement/EngagementTermsBody";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Standard Terms and Conditions of Engagement",
  description: `Standard terms and conditions of engagement for ${company.name} — website draft copy pending formal legal review. Last updated 26 June 2026.`,
};

export default function EngagementPage() {
  return (
    <LegalPageShell title="Standard Terms and Conditions of Engagement">
      <EngagementTermsBody />
    </LegalPageShell>
  );
}
