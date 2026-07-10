import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/sectors", destination: "/", permanent: false },
      { source: "/sectors/:path*", destination: "/", permanent: false },
      { source: "/careers", destination: "/contact", permanent: false },
      { source: "/login", destination: "/contact", permanent: false },
    ];
  },
};

export default nextConfig;
