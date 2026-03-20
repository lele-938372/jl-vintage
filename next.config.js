/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@upstash/redis'],
  images: {
    domains: ['images.unsplash.com', 'cdn.pixabay.com'],
  },
}

module.exports = nextConfig
