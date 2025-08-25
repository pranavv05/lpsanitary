import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  // Disable compression for PDF files to prevent corruption
  compress: false,
  
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
  
  // Ensure static files are served properly
  trailingSlash: false,
  
  // Optimize for better file serving
  experimental: {
    optimizeCss: false, // Disable CSS optimization that might interfere
  },
};

export default nextConfig;
