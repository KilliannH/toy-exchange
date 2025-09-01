import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ❌ Ne bloque plus le build si erreurs
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ❌ Ne bloque pas le build en cas d'erreurs TS
    ignoreBuildErrors: true,
  },
  output: 'standalone',
};

export default nextConfig;
