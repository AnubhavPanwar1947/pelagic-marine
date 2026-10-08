import { permanentRedirect } from "next/navigation";

export default function LegacyNewsIndexRedirect() {
  permanentRedirect("/marine-insights/");
}
