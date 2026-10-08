import { permanentRedirect } from "next/navigation";

export default function LegacyPrivacyRedirect() {
  permanentRedirect("/privacy-policy/");
}
