/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@beam-coin/core", "@beam-coin/db"],
};

module.exports = nextConfig;

