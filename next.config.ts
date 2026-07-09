import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first (smaller), WebP fallback — Next picks whichever the browser's
    // Accept header supports.
    formats: ["image/avif", "image/webp"],
    // Kept at the framework default (not raised): this project routinely
    // re-crops/replaces photos under the same filename (see /images/originals),
    // and Next has no cache-invalidation mechanism for the image optimizer —
    // a longer TTL would risk serving a stale photo for that long after a swap.
    minimumCacheTTL: 14400,
  },
  experimental: {
    // framer-motion isn't in Next's built-in optimized-imports list; our
    // components import many named exports from it, so this keeps only the
    // used modules in each bundle instead of the whole package.
    optimizePackageImports: ["framer-motion"],
  },
  async headers() {
    return [
      {
        // Static photos served directly from /public (e.g. by link-preview
        // crawlers hitting the raw og:image URL, bypassing next/image).
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
