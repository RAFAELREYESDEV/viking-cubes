import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.110.229",
    "192.168.110.*",
    "192.168.*.*",
    "localhost:3000"
  ],
  experimental: {
    agentUpgrade: "security"
  }
};

export default nextConfig;
