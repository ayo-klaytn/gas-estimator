/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
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
        querystring: false,
        punycode: false,
        events: false,
        util: false,
        buffer: false,
      };
    }
    
    // Ignore node-specific modules when bundling for the browser
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(lokijs|pino-pretty|encoding)$/,
      })
    );

    return config;
  },
  experimental: {
    esmExternals: 'loose',
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