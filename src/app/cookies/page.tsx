import { permanentRedirect } from "next/navigation";

export default function LegacyCookiesRedirect() {
  permanentRedirect("/cookies-policy/");
}
