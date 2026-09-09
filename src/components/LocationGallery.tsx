"use client";

import Image from "next/image";
import Reveal from "./Reveal";

export type InteriorImage = {
  src: string;
  alt: string;
  caption?: string;
  objectPosition?: string;
  /** Khung hiển thị CỐ ĐỊNH ("W / H") ép riêng — ƯU TIÊN HƠN width/height
      thật bên dưới. Dùng cho ảnh có tỉ lệ CHỦ ĐỘNG cần giữ nguyên hình dạng
      (hiếm — khai tay từng ảnh cụ thể). KHÔNG khai (undefined) — trường hợp
      bình thường, tuyệt đại đa số ảnh — nghĩa là ô lưới dùng khung CỐ ĐỊNH
      4:3 chung (object-cover) như mọi ảnh khác trong cùng gallery, TRỪ khi
      width/height thật rơi vào 1 trong 2 ngưỡng outlier bên dưới. */
  aspectRatio?: string;
  /** Kích thước pixel THẬT của ảnh — đọc từ file qua getPublicJpegDimensions()
      (xem LocationPageTemplate.tsx). CHỈ dùng để phát hiện 3 ảnh "bảng tên"
      outlier tỉ lệ quá cực đoan (xem GALLERY_TALL/WIDE_CLAMP_THRESHOLD bên
      dưới) — KHÔNG dùng để dựng khung Masonry theo tỉ lệ thật cho mọi ảnh
      như trước đây (đã bỏ, xem doc comment gallery bên dưới lý do). */
  width?: number;
  height?: number;
};

/**
 * 3 ảnh "bảng tên" duy nhất trong toàn bộ 28 chi nhánh có tỉ lệ THẬT quá
 * cực đoan (đo qua `sips`, xem lịch sử commit) — ép cứng vào khung 4:3
 * chung như mọi ảnh khác sẽ crop mất phần lớn nội dung (VD ảnh dọc 0.562
 * ép vào khung ngang 4:3 chỉ còn thấy 1 dải nhỏ ở giữa). 2 ngưỡng này lấy
 * ĐÚNG bằng ngưỡng đã dùng khi gallery còn ở dạng Masonry (xem lịch sử
 * commit) — vẫn còn đúng vì dữ liệu đo không đổi, chỉ đổi CÁCH ÁP DỤNG:
 * trước đây áp dụng cho MỌI ảnh (mỗi ảnh 1 tỉ lệ riêng, layout Masonry rời
 * rạc, thiếu nhất quán khi 1 chi nhánh chỉ có 3-5 ảnh) — nay CHỈ áp dụng
 * làm ngoại lệ cho đúng 3 ảnh outlier này, còn lại dùng chung khung 4:3 cố
 * định để lưới đồng nhất, nhất quán giữa các trang chi nhánh:
 *   - Dưới 0.72 (quá dọc/hẹp): yên-thế bảng-tên (0.562), nguyễn-oanh
 *     bảng-tên (0.694) — điểm đo BÌNH THƯỜNG gần nhất là 0.75.
 *   - Trên 2.0 (quá ngang/dẹt): mạc-đĩnh-chi bảng-tên (2.223) — điểm đo
 *     bình thường gần nhất là 1.79-1.80.
 */
const GALLERY_TALL_CLAMP_THRESHOLD = 0.72;
const GALLERY_TALL_CLAMP_RATIO = "3 / 4";
const GALLERY_WIDE_CLAMP_THRESHOLD = 2;
const GALLERY_WIDE_CLAMP_RATIO = "16 / 9";

/** Trả về khung ("W / H") ÉP RIÊNG cho ảnh cần ngoại lệ — `undefined` nghĩa
    là ảnh BÌNH THƯỜNG, dùng khung 4:3 chung qua class `aspect-[4/3]` (không
    set style riêng). `aspectRatio` khai tay (nếu có) luôn thắng; nếu không,
    kiểm tra width/height thật có rơi vào 1 trong 2 ngưỡng outlier ở trên
    không — chỉ đúng 3 ảnh "bảng tên" hiện có rơi vào đây. */
function resolveAspectRatioOverride(img: InteriorImage): string | undefined {
  if (img.aspectRatio) return img.aspectRatio;
  if (img.width && img.height) {
    const realRatio = img.width / img.height;
    if (realRatio < GALLERY_TALL_CLAMP_THRESHOLD) return GALLERY_TALL_CLAMP_RATIO;
    if (realRatio > GALLERY_WIDE_CLAMP_THRESHOLD) return GALLERY_WIDE_CLAMP_RATIO;
  }
  return undefined;
}

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
            const isSolo = count === 1;
            const override = resolveAspectRatioOverride(img);
            const cellClass = isSolo
              ? `bg-bg-tint ${override ? "" : "aspect-[3/4]"}`
              : override
                ? ""
                : "aspect-[4/3]";
            return (
              <div key={img.src} className={itemClass(count)}>
                <button
                  type="button"
                  onClick={() => onImageClick?.(i)}
                  aria-label={img.caption ?? img.alt}
                  className={`relative block w-full cursor-zoom-in overflow-hidden rounded-2xl shadow-card ${cellClass}`}
                  style={override ? { aspectRatio: override } : undefined}
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
