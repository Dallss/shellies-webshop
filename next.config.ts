import type { NextConfig } from "next";

const supabaseHost = process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).hostname : undefined;

const nextConfig: NextConfig = {
  // The dev-only "N" badge defaults to bottom-left, where it covers the phone tab bar.
  devIndicators: { position: "top-right" },
  // Listing photos (up to 4 MB) are uploaded through a server action.
  experimental: { serverActions: { bodySizeLimit: "4.5mb" } },
  // Listing photos are served from Supabase Storage.
  images: {
    remotePatterns: supabaseHost ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }] : [],
  },
};

export default nextConfig;
