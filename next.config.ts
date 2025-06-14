/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // Usa Webpack en vez de Turbopack
  },
};

module.exports = nextConfig;
