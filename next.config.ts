import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Si usas imágenes externas de Unsplash
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
