/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'd1d8a3050v4fu6.cloudfront.net',
        },
        // {
        //   protocol: 'https',
        //   hostname: 'anotherdomain.com',
        // },
      ],
      // domains: ['marathon-web-assets.s3.ap-south-1.amazonaws.com','d1d8a3050v4fu6.cloudfront.net'], 
    }, 
    
  };
export default nextConfig;
