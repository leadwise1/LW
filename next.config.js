/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    
    // Essential for Netlify deployment
    trailingSlash: false,
    
    // Optimize for static generation where possible
    output: 'standalone',
    
    // Handle static assets properly
    assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
    
    // API routes configuration
    async rewrites() {
      return [];
    },
    
    // Environment variables that should be available on the client side
    env: {
      CUSTOM_KEY: process.env.CUSTOM_KEY,
    },
    
    // Webpack configuration if needed
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      return config;
    },
  };
  
  module.exports = nextConfig;