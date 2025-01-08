/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          module: false,
          path: false,
        };
      }
      return config;
    },
    experimental: {
      serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium']
    }
  };
  
  module.exports = nextConfig;