/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2o2bcehk92sin.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'd1rawlyg9re39v.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'd3kqb7oxkf9gw0.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'marathon-web-assets.s3.ap-south-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'd1d8a3050v4fu6.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'marathon-org-assets.s3.ap-south-1.amazonaws.com',
      },
    ],
  },
  reactStrictMode: false,
  // Optimize CSS loading - reduces Material-UI CSS bundle size
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  
  async redirects() {
    return [
      {
        source: '/industry/aerospace-and-defence/:slug*',
        destination: '/industry/aerospace-and-aviation/:slug*',
        permanent: true,
      },
      {
        source: '/industry/video-games-and-vr/:slug*',
        destination: '/industry/video-games-and-virtual-reality/:slug*',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/tools/cad-renderer',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
       {
        source: '/dashboard',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        source: "/creator/:creator_id*",
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      // Optimize CSS loading with proper cache headers
      {
        source: '/:path*.css',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
