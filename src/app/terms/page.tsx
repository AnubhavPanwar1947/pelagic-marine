import { permanentRedirect } from "next/navigation";

export default function LegacyTermsRedirect() {
  permanentRedirect("/terms-and-conditions/");
}
