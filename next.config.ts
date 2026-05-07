import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // เพิ่มบรรทัดนี้
  experimental: {
    serverActions: {
      allowedOrigins: ['10.1.255.1', 'localhost:3000'],
    }, // 1. ปิด serverActions
  }, // 2. ปิด experimental (จุดที่หายไปในโค้ดเดิมของคุณ)
}; // 3. ปิด nextConfig

export default nextConfig;