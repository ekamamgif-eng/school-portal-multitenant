import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Fix: Remove unsupported 'eslint' key
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow cross-origin requests for multi-tenant dev environment
  allowedDevOrigins: [
    "localhost:3000",
    "local.cursorschool.test:3000",
    "*.local.cursorschool.test:3000"
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // No custom webpack config needed for now
} as any;

export default nextConfig;
