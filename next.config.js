/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'ui-avatars.com', 'localhost'],
    unoptimized: true,
  },
  output: 'standalone',
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-accordion'],
  },
  webpack: (config, { isServer, dev }) => {
    // Handle date-fns locale imports
    config.resolve.alias = {
      ...config.resolve.alias,
      'date-fns/locale': 'date-fns/locale/en-US',
    }

    // Optimize bundles for production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 244000, // 244KB chunks
            },
          },
        },
      }
    }

    return config
  },
}

module.exports = nextConfig 