import type { MetadataRoute } from "next";
import { getSiteRouteHrefs } from "@/lib/site-routes";

export const dynamic = "force-static";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pelagic-marine.com";

const routes = getSiteRouteHrefs().filter((path) => path !== "/search/");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/contact/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/contact/" ? 0.9 : 0.7,
  }));
}
