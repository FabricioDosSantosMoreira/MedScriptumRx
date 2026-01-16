import type { NextConfig } from 'next';

const nextConfig: NextConfig = {

  allowedDevOrigins: [
    'http://localhost:3000',
    '*',
  ],
  
  compiler: {
    styledComponents: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
