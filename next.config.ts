import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first (smaller), WebP fallback — Next picks whichever the browser's
    // Accept header supports.
    formats: ["image/avif", "image/webp"],
    // 75 = mặc định Next (dùng cho hero/blog). 85 = ảnh chi nhánh
    // (LocationFacade/LocationGallery/Lightbox) — ảnh nội thất nhiều chi
    // tiết + chữ trên biển hiệu, 75 hơi mềm. Next 16 bắt buộc khai báo giá
    // trị quality được phép ở đây trước khi <Image quality={..}> dùng được.
    qualities: [75, 85],
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
  // file cụ thể nên gom TOÀN BỘ cây public/images vào trace của MỌI route.
  // Function bundle vượt giới hạn 250MB unzipped của Vercel → deploy fail
  // ở bước đóng gói (build vẫn compile sạch, nên không tái hiện ở local
  // `next build`).
  //
  // Cắt cây public/images khỏi trace, rồi include lại ĐÚNG thứ lambda OG
  // cần đọc lúc chạy: CHỈ ảnh mặt tiền trong public/images/facade/ (OG
  // route [slug]/[plan] là ƒ dynamic, đọc facade theo slug bất kỳ), ảnh
  // nền hero cho OG công cụ, và logo. Ảnh gallery nội thất (~110 file,
  // public/images/dia-diem-*-*.jpg) KHÔNG route nào readFile — chỉ phục vụ
  // qua <Image> (CDN) — nên KHÔNG nằm trong bundle, thoải mái để chất
  // lượng cao mà không ăn vào giới hạn 250MB. Đã rà toàn bộ `fs.readFile*`
  // trong src/: chỉ og.tsx đọc ảnh runtime; imageDimensions.ts chỉ đọc
  // facade lúc build.
  outputFileTracingExcludes: {
    "**": ["public/images/**", "public/videos/**"],
  },
  outputFileTracingIncludes: {
    "/**/opengraph-image": [
      "./public/images/facade/**",
      "./public/images/og/**",
      "./public/images/logo-white.png",
    ],
    // Route tạo ảnh báo giá ở server (thay cho html-to-image ở trình duyệt,
    // xem chú thích trong route.tsx) — cũng readFile() theo `slug` runtime
    // nên cùng vấn đề file-tracing như renderOgImage() ở trên.
    //
    // QUAN TRỌNG: key được so khớp bằng picomatch (route glob), trong đó
    // `[...]` là CHARACTER CLASS chứ không phải ký tự ngoặc vuông thật —
    // phải escape thành `\\[...\\]` thì mới khớp đúng tên thư mục dynamic
    // segment thật sự (xem ví dụ chính thức trong
    // node_modules/next/dist/docs/.../output.md: `/api/login/\\[\\[\\.\\.\\.slug\\]\\]`).
    // Bản đầu tiên dùng "[slug]"/"[plan]" KHÔNG escape — picomatch coi đó là
    // character class rỗng-ý-nghĩa, không khớp gì cả, nên file trong
    // public/images/quote/ và logo-red.png vẫn bị outputFileTracingExcludes
    // cắt khỏi bundle production dù next build local vẫn sạch (đúng y hệt
    // lỗi ENOENT/500 renderOgImage() từng gặp) — lỗi này CHỈ lộ ra khi chạy
    // trên Vercel thật, `next dev`/`next build` local không tái hiện được
    // vì dev/build không áp dụng giới hạn trace này khi phục vụ request.
    "/api/quote-image/\\[slug\\]/\\[plan\\]": ["./public/images/quote/**", "./public/images/logo-red.png"],
    "/api/quote-image/goi/\\[groupKey\\]": ["./public/images/quote/**", "./public/images/logo-red.png"],
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
