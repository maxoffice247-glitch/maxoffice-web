"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import Reveal from "./Reveal";

export type InteriorImage = {
  src: string;
  alt: string;
  caption?: string;
  /** Điểm neo crop khi `object-fit: cover` (VD "center top", "right",
      "top") — MỌI ảnh trong lưới (kể cả ảnh "bảng tên" tỉ lệ cực đoan) đều
      dùng CHUNG khung 4:3 cố định — chỉ khác nhau ở field này để giữ đúng
      phần nội dung quan trọng khi bị crop. Mặc định "center". */
  objectPosition?: string;
};

/**
 * Số cột lưới desktop/tablet (`sm:grid-cols-N`) tuỳ số ảnh — Y HỆT logic
 * gốc trước đợt đổi sang Masonry (`git show e42183f:...`): 1 ảnh → 1 cột,
 * 2 ảnh → 2 cột, 3 ảnh → 3 cột, 4 ảnh → 4 cột, 5+ ảnh → 2 cột (sm) rồi 3
 * cột (lg).
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

/** Chiều rộng từng ô ảnh: 1 ảnh → giới hạn bề rộng + căn giữa (không kéo
    full-width trông trơ trọi); 3+ ảnh (đang carousel mobile) → 68% +
    shrink-0; 2 ảnh → để lưới tự chia. */
function itemClass(count: number) {
  if (count === 1) return "mx-auto w-full max-w-[520px]";
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
      chi nhánh). Truyền dạng ReactNode vì không thể truyền `BenefitItem[]`
      (mỗi `icon` là 1 tham chiếu component) qua ranh giới Server→Client
      Component. */
  benefitsBlock?: ReactNode;
  onImageClick?: (index: number) => void;
}) {
  const count = images?.length ?? 0;

  if (count === 0 && !benefitsBlock) return null;

  return (
    <section className="pt-3 pb-3">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        {count >= 1 && (
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
        )}

        {benefitsBlock && <div className={count > 0 ? "mt-6" : ""}>{benefitsBlock}</div>}
      </div>
    </section>
  );
}
