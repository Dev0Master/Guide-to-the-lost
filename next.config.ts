import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Railway deployment configuration
  output: 'standalone',
  
  // Image optimization configuration
  images: {
    domains: [],
    unoptimized: false,
  },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Environment configuration for Railway
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Ensure proper trailing slash handling
  trailingSlash: false,
  
  // ESLint configuration for build
  eslint: {
    // Only run ESLint during build on specific directories
    dirs: ['src'],
    ignoreDuringBuilds: true,
  },
  
  // TypeScript configuration
  typescript: {
    // Allow production builds to successfully complete even with type errors
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
