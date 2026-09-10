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
  // renderOgImage() (src/lib/og.tsx) đọc ảnh nền bằng
  // `readFile(join(process.cwd(), "public", backgroundImagePath))` với
  // backgroundImagePath là BIẾN runtime → @vercel/nft không suy ra được
  // file cụ thể nên gom TOÀN BỘ cây public/images (~190MB) vào trace của
  // MỌI route. Function bundle vượt giới hạn 250MB unzipped của Vercel →
  // deploy fail ở bước đóng gói (build vẫn compile sạch, nên không tái
  // hiện ở local `next build`). Thêm 7 ảnh (2.9MB) ở 972eda7 là giọt tràn.
  //
  // Cắt cây public/images khỏi trace, rồi include lại ĐÚNG thứ lambda cần
  // đọc lúc chạy: ảnh mặt tiền `dia-diem-*.jpg` (OG route [slug]/[plan] là
  // ƒ dynamic), ảnh nền `og/*`, và logo. Các ảnh khác (hero, blog, quote,
  // originals) chỉ phục vụ qua <Image> (CDN), KHÔNG route nào readFile —
  // đã rà toàn bộ `fs.readFile*` trong src/.
  outputFileTracingExcludes: {
    "**": ["public/images/**", "public/videos/**"],
  },
  outputFileTracingIncludes: {
    "/**/opengraph-image": [
      "./public/images/dia-diem-*.jpg",
      "./public/images/og/**",
      "./public/images/logo-white.png",
    ],
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
