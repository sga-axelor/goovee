/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ["@axelor/cms-core"],
  webpack: (config, context) => {
    config.module.rules
      .find((rule) => typeof rule.oneOf === "object")
      ?.oneOf?.filter((x) => x.use)
      .flatMap((x) => [x.use].flat())
      .filter((x) => x.loader && x.loader.includes("css-loader"))
      .filter((x) => x.options?.modules?.mode === "pure")
      .forEach((x) => (x.options.modules.mode = "local"));

    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

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
