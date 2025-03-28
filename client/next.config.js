/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ignore ESLint errors during build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return process.env.NODE_ENV === 'development' 
      ? [
          {
            source: '/api/:path*',
            destination: 'http://localhost:8000/api/:path*' // Proxy to Django backend
          }
        ]
      : [];
  },
}

module.exports = nextConfig
