// next.config.ts
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://resumescanner-mwph.onrender.com/api/:path*',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups', 
          },
        ],
      },
    ]
  },
}

export default nextConfig
