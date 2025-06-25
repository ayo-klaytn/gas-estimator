/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    };
    return config;
  },
  transpilePackages: [
    '@rainbow-me/rainbowkit',
    'wagmi',
    'viem',
    '@wagmi/core',
    '@wagmi/connectors',
  ],
};

module.exports = nextConfig;