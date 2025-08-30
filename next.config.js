/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Mark packages as external for server components
    serverComponentsExternalPackages: ['jsdom']
  },
  images: {
    domains: ['www.google.com', 'abs.gov.au'],
    unoptimized: false,
  },
  // Vercel-specific optimizations
  swcMinify: true,
  compress: true,
  // Enable static optimization
  output: 'standalone',
  // Optimize for Vercel
  poweredByHeader: false,
  // Transpile packages that use modern JavaScript features
  transpilePackages: ['jsdom'],
  // CORS configuration
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
