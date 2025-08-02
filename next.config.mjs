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
      
    ];
  },
};

export default nextConfig;
