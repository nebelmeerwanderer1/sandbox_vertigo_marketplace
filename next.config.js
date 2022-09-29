/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
      domains: ["ipfs.io"],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      },
}

module.exports = nextConfig
