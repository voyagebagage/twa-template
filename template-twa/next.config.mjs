/** @type {import('next').NextConfig} */
import { i18n } from "./next-i18next.config.js";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    dirs: ["src"],
  },
  i18n,
  // Configure headers for Telegram Web App and security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOW-FROM https://telegram.org/",
          },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://telegram.org/ https://*.telegram.org/",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
