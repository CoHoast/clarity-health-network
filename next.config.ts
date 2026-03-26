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
  // This applies to Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  // API route body size is handled by Next.js default (4MB)
  // For larger files, consider chunked uploads or streaming
  // Current 8,498 provider CSV (~1-2MB) fits within default limit
};

export default nextConfig;
