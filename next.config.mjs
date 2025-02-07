/** @type {import('next').NextConfig} */
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const nextConfig = {

  images: {
    domains: [
      'marathon-web-assets.s3.ap-south-1.amazonaws.com',
      'd2o2bcehk92sin.cloudfront.net'
    ],
  },
 
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all', // Splits chunks more effectively for better caching
  //   },
  //   runtimeChunk: 'single', // Optimizes runtime code for caching
  // },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Analyze client-side bundle size
      // const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: '../analyze/client.html',
        })
      );
    }

    return config;
  },
  compress: true, // Enable gzip and Brotli compression
  swcMinify: true, // Use SWC for faster and better minification
  productionBrowserSourceMaps: false, // Avoid generating source maps in production
  reactStrictMode: true, // Helps identify potential problems in React components
};

export default nextConfig;
