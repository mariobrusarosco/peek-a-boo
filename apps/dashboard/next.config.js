/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@peek-a-boo/core'],
  
  // Enable source maps for better debugging in production
  productionBrowserSourceMaps: true,
  experimental: {
    serverSourceMaps: true,
  },
  
  webpack: (config, { dev, isServer }) => {
    // Force source maps in production
    if (!dev) {
      config.devtool = isServer ? 'source-map' : 'hidden-source-map';
    }
    
    // Ensure proper module resolution
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

module.exports = nextConfig; 