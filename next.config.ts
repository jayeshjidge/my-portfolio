import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Ready for Vercel / Netlify / Cloudflare Pages / static hosts */
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Uncomment for static export (GitHub Pages / S3 / any static host):
  // output: "export",
  // images: { unoptimized: true },
};

export default nextConfig;
