import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
  },
};

export default nextConfig;
