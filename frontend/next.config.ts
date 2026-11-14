import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    const backendPort = process.env.NODE_ENV === "production" ? "8005" : "8000";
    const backendUrl = process.env.INTERNAL_API_URL || `http://127.0.0.1:${backendPort}/api/v1`;
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
