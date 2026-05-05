import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ['10.1.255.1'],
  },
};

export default nextConfig;