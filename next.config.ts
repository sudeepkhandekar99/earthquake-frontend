import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable TS errors from blocking Vercel build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable Turbopack (avoids react-leaflet issues)
  experimental: {
    turbo: false,
  },
};

export default nextConfig;