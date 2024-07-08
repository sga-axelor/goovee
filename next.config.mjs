/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, context) => {
    const svgrules = config.module.rules.find(r => r.test?.test?.('.svg'));

    config.module.rules.push(
      {
        ...svgrules,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        resourceQuery: {not: /url/}, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    );

    svgrules.exclude = /\.svg$/i;

    /**
     * Disable minimize (ORM relation doesn't exists issue)
     */

    config.optimization.minimize = false;

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
