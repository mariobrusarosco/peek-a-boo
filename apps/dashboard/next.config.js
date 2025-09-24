/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@peek-a-boo/shared'],
  
  // Enable source maps for better debugging in production
  productionBrowserSourceMaps: true,
  experimental: {
    serverSourceMaps: true,
  },
  
  webpack: (config) => {
    // Ensure proper module resolution
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

module.exports = nextConfig; 