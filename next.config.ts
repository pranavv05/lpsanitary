import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  // Disable compression globally to prevent PDF corruption
  compress: false,
  
  // Prevent optimization of static files
  experimental: {
    optimizePackageImports: [],
    optimizeCss: false, // Disable CSS optimization that might interfere
  },
  
  // Configure static file serving
  staticPageGenerationTimeout: 1000,
  
  // Ensure proper handling of binary files
  poweredByHeader: false,
  
  // Ensure static files are served properly
  trailingSlash: false,
  
  async headers() {
    return [
      {
        source: '/resources/:path*.pdf',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/pdf',
          },
          {
            key: 'Content-Disposition',
            value: 'inline; filename="catalog.pdf"',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Accept-Ranges',
            value: 'bytes',
          },
          // Prevent any encoding that might corrupt PDFs
          {
            key: 'Content-Encoding',
            value: 'identity',
          },
          // Ensure binary transfer
          {
            key: 'Content-Transfer-Encoding',
            value: 'binary',
          },
          // Override any platform compression
          {
            key: 'X-Content-Encoding-Override',
            value: 'none',
          },
          {
            key: 'X-Compression-Override',
            value: 'false',
          },
          // Prevent GZIP/Brotli compression
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      // Also handle requests without extension
      {
        source: '/resources/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
