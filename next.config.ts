import type { NextConfig } from "next";

/** Static HTML/CSS/JS for DreamHost shared hosting. Contact uses PHP mail (no Node API). */
const nextConfig: NextConfig = {
  output: "export",
  // Static export has no Next image optimizer — use `npm run generate-images` + srcset instead.
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
