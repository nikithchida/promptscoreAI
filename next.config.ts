import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/auth",
        destination: "/login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
