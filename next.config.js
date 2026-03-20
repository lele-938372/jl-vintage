/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@vercel/kv'],
  },
  images: {
    domains: ['images.unsplash.com', 'cdn.pixabay.com'],
  },
}

module.exports = nextConfig
