import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/v1/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, Accept',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Handle Solana-related libraries for better compatibility
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    // Handle bigint serialization issues
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    // Ignore Solana-related warnings during build
    config.ignoreWarnings = [{ message: /bigint/ }, { message: /Failed to load bindings/ }];

    return config;
  },
  // External packages that should be handled by Node.js instead of bundled
  serverExternalPackages: ['@solana/web3.js', '@solana/spl-token'],
  // Enable experimental features for middleware
  experimental: {
    nodeMiddleware: true,
  },
};

export default nextConfig;
