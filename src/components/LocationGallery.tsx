"use client";

import Image from "next/image";
import Reveal from "./Reveal";

export type InteriorImage = {
  src: string;
  alt: string;
  caption?: string;
  /** Điểm neo crop khi `object-fit: cover` (VD "center top", "right",
      "top") — MỌI ảnh trong lưới (kể cả 3 ảnh "bảng tên" tỉ lệ cực đoan)
      đều dùng CHUNG khung 4:3 cố định (xem `galleryClass`/JSX bên dưới),
      không còn ngoại lệ khung riêng — chỉ khác nhau ở field này để giữ
      đúng phần nội dung quan trọng khi bị crop. Mặc định "center" khi
      không khai. */
  objectPosition?: string;
  /** Khung hiển thị CỐ ĐỊNH ("W / H") — CHỈ dùng cho box "1 ảnh duy nhất"
      (xem nhánh `isSolo` bên dưới, hiếm — chi nhánh chỉ có đúng 1 ảnh nội
      thất) khi ảnh không phải tỉ lệ dọc thông thường (VD ảnh vuông 1:1,
      xem Hoàng Kế Viêm). KHÔNG áp dụng cho lưới nhiều ảnh — lưới nhiều
      ảnh LUÔN dùng khung 4:3 chung, xem doc comment `objectPosition`. */
  aspectRatio?: string;
};

/**
 * Số cột lưới desktop/tablet (`sm:grid-cols-N`) tuỳ số ảnh — Y HỆT logic
 * gốc trước đợt đổi sang Masonry (khôi phục từ lịch sử commit, xem
 * `git show e42183f:src/components/LocationGallery.tsx`): 2 ảnh → 2 cột,
 * 3 ảnh → 3 cột, 4 ảnh → 4 cột, 5+ ảnh → 2 cột (sm) rồi 3 cột (lg) — tránh
 * 1 ảnh lẻ loi rơi xuống hàng riêng nếu chia phẳng 4 cột.
 *
 * MOBILE (dưới `sm:`, 640px): với 3+ ảnh, chuyển thành CAROUSEL cuộn ngang
 * (`flex overflow-x-auto`, mỗi ảnh chiếm 68% chiều rộng qua `itemClass` bên
 * dưới — hé lộ 1 phần ảnh kế tiếp để gợi ý vuốt tiếp) thay vì xếp lưới cố
 * định 2 cột nhỏ xíu khó xem trên màn hình hẹp — đây chính là hành vi gốc
 * đã có TRƯỚC KHI đổi sang Masonry (Masonry vô tình làm mất hành vi
 * carousel này vì xếp cột dọc như desktop mọi kích thước màn hình).
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

/** Chiều rộng từng ảnh trong carousel mobile (68% + shrink-0 để không bị ép
    co lại) — chỉ áp dụng khi ĐANG carousel (3+ ảnh); 1-2 ảnh luôn đã vừa
    màn hình nên giữ `w-auto` (grid tự chia đều). */
function itemClass(count: number) {
  if (count === 1) return "mx-auto w-full max-w-[420px]";
  if (count >= 3) return "w-[68%] shrink-0 sm:w-auto";
  return "";
}

export default function LocationGallery({
  images,
  onImageClick,
}: {
  images?: InteriorImage[];
  onImageClick?: (index: number) => void;
}) {
  const count = images?.length ?? 0;
  if (!images || count === 0) return null;

  return (
    <section className="pt-3 pb-3">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className={`gap-3 sm:gap-4 ${galleryClass(count)}`}>
          {images.map((img, i) => {
            // 1 ảnh duy nhất (hiếm — VD chi nhánh chỉ có 1 ảnh bảng tên) —
            // box dọc căn giữa + object-contain, không crop (ảnh dạng này
            // thường là bảng tên/tài liệu dọc, không phải ảnh chụp cảnh).
            // Nhánh riêng biệt, KHÔNG liên quan tới khung 4:3 chung của
            // lưới nhiều ảnh bên dưới.
            const isSolo = count === 1;
            return (
              <div key={img.src} className={itemClass(count)}>
                <button
                  type="button"
                  onClick={() => onImageClick?.(i)}
                  aria-label={img.caption ?? img.alt}
                  className={`relative block w-full cursor-zoom-in overflow-hidden rounded-2xl shadow-card ${
                    isSolo ? `bg-bg-tint ${img.aspectRatio ? "" : "aspect-[3/4]"}` : "aspect-[4/3]"
                  }`}
                  style={isSolo && img.aspectRatio ? { aspectRatio: img.aspectRatio } : undefined}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={isSolo ? "(max-width: 1024px) 90vw, 420px" : "(max-width: 640px) 68vw, 25vw"}
                    className={isSolo ? "object-contain" : "object-cover"}
                    style={isSolo ? undefined : { objectPosition: img.objectPosition ?? "center" }}
                  />
                </button>
                {img.caption && (
                  <p className="mt-1.5 text-center text-[11px] leading-snug text-body-text">{img.caption}</p>
                )}
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
