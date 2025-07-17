import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: configs => {
    configs.externals.push('pino-pretty', 'lokijs', 'encoding')    
    return configs
  },
};

export default nextConfig;
