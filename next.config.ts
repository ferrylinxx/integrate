import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Habilitar output standalone para Docker
  output: "standalone",

  // Ignorar errores de TypeScript durante el build (temporal para Supabase type issue)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Ignorar errores de ESLint durante el build (temporal)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configuración de imágenes externas
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3-alpha-sig.figma.com',
        port: '',
        pathname: '/img/**',
      },
    ],
  },

  // Headers para SEO - Bloquear indexación
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet, noimageindex",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

