import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev-only "N" badge defaults to bottom-left, where it covers the phone tab bar.
  devIndicators: { position: "top-right" },
};

export default nextConfig;
