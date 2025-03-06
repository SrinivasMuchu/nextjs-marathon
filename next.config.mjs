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
          hostname: 'marathon-org-assets.s3.ap-south-1.amazonaws.com',
        },
        // {
        //   protocol: 'https',
        //   hostname: 'anotherdomain.com',
        // },
      ],
      // domains: ['marathon-web-assets.s3.ap-south-1.amazonaws.com','d1d8a3050v4fu6.cloudfront.net'], 
    }, 
    reactStrictMode: false,
    
  };
export default nextConfig;
