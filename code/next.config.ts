import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/events",
        destination: "http://localhost:3036/events",
      },
    ];
  },
};

export default nextConfig;
