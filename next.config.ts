import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include test files in ESLint (for development)
  eslint: {
    dirs: ["app", "lib", "components", "hooks", "utils", "tests"],
  },
  webpack: (config) => {
    // Exclude test files from build bundle
    config.module.rules.push({
      test: /\.(test|spec)\.(ts|tsx|js|jsx)$/,
      use: "ignore-loader",
    });
    return config;
  },
};

export default nextConfig;
