/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    // Otimização de imagens
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
  },
  // Otimização de bundle
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Minificação
  swcMinify: true,
  // Otimização de módulos
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{member}}",
      preventFullImport: true,
    },
  },
  // Cache de build
  experimental: {
    turbotrace: {
      logLevel: "error",
      logDetail: true,
    },
  },
  // Otimização de fontes
  optimizeFonts: true,
  // Compressão
  compress: true,
  // Otimização de pacotes
  optimizePackageImports: ["lucide-react"],
  // Otimização de CSS
  optimizeCss: true,
};

module.exports = nextConfig;
