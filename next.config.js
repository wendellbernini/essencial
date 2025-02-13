/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  swcMinify: true,
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{member}}",
      preventFullImport: true,
    },
  },
  experimental: {
    turbotrace: {
      logLevel: "error",
      logDetail: true,
    },
  },
  optimizeFonts: true,
  compress: true,
  optimizePackageImports: ["lucide-react"],
  optimizeCss: true,
};

module.exports = nextConfig;
