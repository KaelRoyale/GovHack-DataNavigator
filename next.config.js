/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
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
}

module.exports = nextConfig
