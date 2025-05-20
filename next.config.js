/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'ui-avatars.com'],
    unoptimized: true,
  },
  output: 'standalone',
  webpack: (config, { isServer }) => {
    // Handle date-fns locale imports
    config.resolve.alias = {
      ...config.resolve.alias,
      'date-fns/locale': 'date-fns/locale/en-US',
    }
    return config
  },
}

module.exports = nextConfig 