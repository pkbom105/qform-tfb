import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 experimental: {
    // ย้ายจาก allowedDevOrigins มาอยู่ใน serverActions แทน
    serverActions: {
      allowedOrigins: ['10.1.255.1', 'localhost:3000'],
  },
};

export default nextConfig;