import { permanentRedirect } from "next/navigation";

export default function LegacyEngagementRedirect() {
  permanentRedirect("/standard-terms-and-conditions-of-engagement/");
}
