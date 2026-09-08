"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

export type ScrollytellingImage = {
  src: string;
  alt: string;
  caption: string;
};

/**
 * Hiệu ứng "scrollytelling" (pin-and-scrub): cột tiêu đề/mô tả đứng yên
 * (position: sticky) trong lúc người dùng cuộn qua 1 khoảng không gian đủ
 * dài, lần lượt hiện từng ảnh bên cạnh (crossfade theo opacity) — sau ảnh
 * cuối mới nhả cho trang cuộn tiếp xuống section kế tiếp.
 *
 * ĐANG THỬ NGHIỆM CHỈ Ở 1 CHI NHÁNH (380 Trần Hưng Đạo) — component viết
 * dạng nhận props (title/description/images) để tái dùng ngay cho chi
 * nhánh khác nếu quyết định nhân rộng, nhưng KHÔNG tự động gọi ở đâu khác;
 * xem điều kiện `data.slug === "tran-hung-dao"` tại LocationPageTemplate.tsx.
 *
 * 3 chế độ hiển thị tuỳ ngữ cảnh (không ép 1 kiểu cho mọi màn hình):
 * 1. `prefers-reduced-motion: reduce` — TẮT HẲN pin/scroll-jacking, hiện
 *    gallery ảnh tĩnh dạng lưới bình thường, không có hiệu ứng cuộn nào.
 * 2. Desktop (lg: trở lên), không giảm hiệu ứng — pin-and-scrub đầy đủ.
 * 3. Mobile/tablet (dưới lg:), không giảm hiệu ứng — KHÔNG pin (đánh giá
 *    thực tế: pin-scroll cần ~500vh cuộn tay trên màn hình nhỏ, dễ gây
 *    khó chịu/mất phương hướng hơn hẳn desktop dùng chuột/trackpad; cộng
 *    thêm rủi ro `100vh` đổi giá trị khi thanh địa chỉ Safari ẩn/hiện làm
 *    khung pin giật/nhảy — 2 lý do đủ để chọn carousel cuộn ngang đơn
 *    giản thay thế, giữ nguyên ảnh + caption, không cần cuộn dọc thêm).
 *
 * Kỹ thuật: dùng useScroll() + useMotionValueEvent() của framer-motion
 * (đã dùng sẵn cho hiệu ứng cuộn co nhỏ của Hero.tsx — cùng thư viện,
 * cùng cách tôn trọng prefers-reduced-motion qua useReducedMotion()) thay
 * vì tự viết scroll listener tay — framer-motion tự throttle qua rAF,
 * không tự tính lại layout (chỉ đọc scrollY, không set style trực tiếp ở
 * đây). Chuyển đổi ẢNH bằng state React (activeIndex) + className
 * transition-opacity (opacity/transform, không đụng thuộc tính gây
 * reflow như width/height/top) — CHỈ set state khi chỉ số ảnh THẬT SỰ đổi
 * (so sánh trong callback) để không re-render mỗi pixel cuộn.
 *
 * Toàn bộ N ảnh được RENDER SẴN cùng lúc (chỉ đổi opacity ẩn/hiện), không
 * đợi tới lượt mới mount — tránh đúng lỗi "resource load delay" mà
 * Hero.tsx từng gặp với Lighthouse (ảnh đổi qua state sau mount khiến
 * trình duyệt không biết trước để tải sớm). Khác Hero (ảnh LCP, phải
 * `loading="eager"`), 5 ảnh ở đây nằm dưới màn hình đầu (sau Gallery) nên
 * để mặc định lazy — không cạnh tranh băng thông với LCP thật của trang.
 */
export default function LocationScrollytelling({
  eyebrow,
  title,
  description,
  images,
}: {
  eyebrow: string;
  title: string;
  description: string;
  images: ScrollytellingImage[];
}) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(images.length - 1, Math.max(0, Math.floor(v * images.length)));
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  const heading = (
    <div>
      <span className="mb-4 inline-flex items-center gap-2 text-[12.5px] font-bold tracking-[0.14em] text-primary uppercase before:h-[2px] before:w-[22px] before:rounded-full before:bg-accent">
        {eyebrow}
      </span>
      <h2 className="mb-3.5 font-display text-[26px] leading-[1.2] font-extrabold text-navy sm:text-[32px] lg:text-[36px]">
        {title}
      </h2>
      <p className="max-w-[440px] text-[15.5px] leading-relaxed text-body-text">{description}</p>
    </div>
  );

  // prefers-reduced-motion: gallery tĩnh thông thường, không pin, không
  // scroll-jacking — giống hệt cách Hero.tsx tắt hẳn auto-advance/parallax
  // khi bật cờ này (xem comment trong Hero.tsx), chỉ khác đây là tắt HẲN
  // cả cơ chế useScroll thay vì chỉ bỏ style, vì hiệu ứng chính của section
  // này LÀ scroll-jacking — không có gì để "giảm bớt" ở giữa chừng.
  if (prefersReducedMotion) {
    return (
      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          {heading}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => (
              <div key={img.src}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bg-tint">
                  <Image src={img.src} alt={img.alt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                </div>
                <p className="mt-1.5 text-center text-[12px] leading-snug text-body-text">{img.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Desktop (lg:+) — pin-and-scrub. Chiều cao wrapper = N × 100vh: đủ
          dài để mỗi ảnh có ~1 màn hình cuộn riêng (tránh bị "lướt qua hết"
          chỉ trong 1 lần cuộn chuột/trackpad — bài học từ hiệu ứng co nhỏ
          của Hero, xem comment trong Hero.tsx). */}
      <section
        ref={containerRef}
        style={{ height: `${images.length * 100}vh` }}
        className="relative hidden lg:block"
      >
        <div className="sticky top-24 flex h-[min(calc(100vh-6rem),640px)] items-center overflow-hidden">
          <div className="mx-auto grid w-full max-w-[1240px] grid-cols-[0.9fr_1.1fr] items-center gap-14 px-5 sm:px-8">
            {heading}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-bg-tint shadow-card">
              {images.map((img, i) => (
                <div
                  key={img.src}
                  aria-hidden={activeIndex !== i}
                  className="absolute inset-0 transition-opacity duration-700 ease-out"
                  style={{ opacity: activeIndex === i ? 1 : 0 }}
                >
                  <Image src={img.src} alt={img.alt} fill sizes="55vw" className="object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pt-14 pb-5">
                    <p className="text-[14.5px] font-semibold text-white">{img.caption}</p>
                  </div>
                </div>
              ))}
              {/* Chỉ báo tiến trình — chấm tròn, không bấm được (thứ tự do
                  cuộn quyết định, không phải điều hướng thủ công như dot
                  indicator của Hero). */}
              <div className="absolute top-5 right-5 flex gap-1.5">
                {images.map((img, i) => (
                  <span
                    key={img.src}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/45"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile/tablet (dưới lg:) — carousel cuộn ngang đơn giản thay vì
          pin (lý do xem comment đầu file), cùng khuôn mẫu flex
          overflow-x-auto đã dùng ở LocationGallery.tsx. */}
      <section className="py-9 lg:hidden">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          {heading}
          <div className="mt-6 flex gap-4 overflow-x-auto pb-1">
            {images.map((img) => (
              <div key={img.src} className="w-[78%] shrink-0 sm:w-[45%]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bg-tint">
                  <Image src={img.src} alt={img.alt} fill sizes="80vw" className="object-cover" />
                </div>
                <p className="mt-1.5 text-center text-[12px] leading-snug text-body-text">{img.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
