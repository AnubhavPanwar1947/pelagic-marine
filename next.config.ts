import type { NextConfig } from "next";

/** Static HTML/CSS/JS for DreamHost shared hosting. Contact uses PHP mail (no Node API). */
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
