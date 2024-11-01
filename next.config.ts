import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@mendable/firecrawl-js', 'ws'],
  webpack: (config) => {
    config.externals = [...(config.externals || []), { ws: 'ws' }];
    return config;
  },
};

export default nextConfig;
