import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  // Only use static export for Surge deployment
  // For Railway, we need server-side rendering for API routes
  ...(isStaticExport ? { output: "export" } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Increase body size limit for large CSV imports (8000+ providers)
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
