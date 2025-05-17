import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["m.media-amazon.com", "res.cloudinary.com"], // Add Cloudinary domain
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
