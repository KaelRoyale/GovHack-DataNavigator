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
  transpilePackages: ['jsdom']
}

module.exports = nextConfig
