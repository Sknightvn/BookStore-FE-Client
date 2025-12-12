/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const domain =
      process.env.NEXT_PUBLIC_API_DOMAIN || "bookstore-be-b450.onrender.com"

    return [
      {
        source: "/api/:path*",
        destination: `https://${domain}/api/:path*`,
      },
    ]
  },
}

export default nextConfig