// import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */
  webpack(config: { module: { rules: { test: RegExp; use: string[] }[] } }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    domains: ["img.spoonacular.com"],
  },
};

export default nextConfig;
