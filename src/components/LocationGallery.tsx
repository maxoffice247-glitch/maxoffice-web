"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import Reveal from "./Reveal";

export type InteriorImage = {
  src: string;
  alt: string;
  caption?: string;
  /** Điểm neo crop khi `object-fit: cover` (VD "center top", "right",
      "top") — MỌI ảnh trong lưới (kể cả 3 ảnh "bảng tên" tỉ lệ cực đoan)
      đều dùng CHUNG khung 4:3 cố định — chỉ khác nhau ở field này để giữ
      đúng phần nội dung quan trọng khi bị crop. Mặc định "center". */
  objectPosition?: string;
  /** Khung hiển thị CỐ ĐỊNH ("W / H") — CHỈ dùng cho box "1 ảnh duy nhất"
      (nhánh `isSolo`, hiếm — VD ảnh bảng tên vuông 1:1 ở Hoàng Kế Viêm).
      KHÔNG áp dụng cho lưới nhiều ảnh (luôn dùng 4:3 chung). */
  aspectRatio?: string;
};

/**
 * Số cột lưới desktop/tablet (`sm:grid-cols-N`) tuỳ số ảnh — Y HỆT logic
 * gốc trước đợt đổi sang Masonry (`git show e42183f:...`): 2 ảnh → 2 cột,
 * 3 ảnh → 3 cột, 4 ảnh → 4 cột, 5+ ảnh → 2 cột (sm) rồi 3 cột (lg).
 *
 * MOBILE (dưới `sm:`, 640px): 3+ ảnh → CAROUSEL cuộn ngang (`flex
 * overflow-x-auto`, mỗi ảnh 68% chiều rộng, hé lộ ảnh kế tiếp).
 */
function galleryClass(count: number) {
  if (count <= 1) return "grid grid-cols-1";
  if (count === 2) return "grid grid-cols-2";
  if (count === 3) {
    return "flex overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0";
  }
  if (count === 4) {
    return "flex overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0";
  }
  return "flex overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3";
}

/** Chiều rộng từng ảnh trong carousel mobile (68% + shrink-0) — chỉ áp dụng
    khi ĐANG carousel (3+ ảnh); 1-2 ảnh giữ `w-auto` (lưới tự chia). */
function itemClass(count: number) {
  if (count === 1) return "mx-auto w-full max-w-[420px]";
  if (count >= 3) return "w-[68%] shrink-0 sm:w-auto";
  return "";
}

export default function LocationGallery({
  images,
  benefitsBlock,
  onImageClick,
}: {
  images?: InteriorImage[];
  /** Khối "Điểm nổi bật khu vực" ĐÃ RENDER SẴN (Server Component, icon đã
      resolve thành JSX) — hiển thị CỐ ĐỊNH full-width NGAY DƯỚI lưới ảnh,
      NHẤT QUÁN cho MỌI chi nhánh (không phụ thuộc so đo chiều cao động như
      cơ chế cũ ở LocationFacade.tsx, không phụ thuộc số ảnh gallery từng
      chi nhánh — 2-4 ảnh là phổ biến, rất ít chi nhánh có ≥5). Truyền dạng
      ReactNode vì không thể truyền `BenefitItem[]` (mỗi `icon` là 1 tham
      chiếu component) qua ranh giới Server→Client Component. */
  benefitsBlock?: ReactNode;
  onImageClick?: (index: number) => void;
}) {
  const count = images?.length ?? 0;

  if (count === 0 && !benefitsBlock) return null;

  return (
    <section className="pt-3 pb-3">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        {count === 1 ? (
          // 1 ảnh duy nhất (Hoàng Kế Viêm — ảnh bảng tên vuông 1:1) — giữ
          // NGUYÊN "1 ảnh căn giữa, object-contain, không crop".
          <Reveal className="mx-auto w-full max-w-[420px]">
            <button
              type="button"
              onClick={() => onImageClick?.(0)}
              aria-label={images![0].caption ?? images![0].alt}
              className={`relative block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-bg-tint shadow-card ${
                images![0].aspectRatio ? "" : "aspect-[3/4]"
              }`}
              style={images![0].aspectRatio ? { aspectRatio: images![0].aspectRatio } : undefined}
            >
              <Image
                src={images![0].src}
                alt={images![0].alt}
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-contain"
              />
            </button>
            {images![0].caption && (
              <p className="mt-1.5 text-center text-[11px] leading-snug text-body-text">{images![0].caption}</p>
            )}
          </Reveal>
        ) : count >= 2 ? (
          <Reveal className={`gap-3 sm:gap-4 ${galleryClass(count)}`}>
            {images!.map((img, i) => (
              <div key={img.src} className={itemClass(count)}>
                <button
                  type="button"
                  onClick={() => onImageClick?.(i)}
                  aria-label={img.caption ?? img.alt}
                  className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-2xl shadow-card"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 68vw, 25vw"
                    className="object-cover"
                    style={{ objectPosition: img.objectPosition ?? "center" }}
                  />
                </button>
                {img.caption && (
                  <p className="mt-1.5 text-center text-[11px] leading-snug text-body-text">{img.caption}</p>
                )}
              </div>
            ))}
          </Reveal>
        ) : null}

        {benefitsBlock && <div className={count > 0 ? "mt-6" : ""}>{benefitsBlock}</div>}
      </div>
    </section>
  );
}
