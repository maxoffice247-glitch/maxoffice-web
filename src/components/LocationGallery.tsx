"use client";

import Image from "next/image";
import Reveal from "./Reveal";

export type InteriorImage = {
  src: string;
  alt: string;
  caption?: string;
  objectPosition?: string;
  /** Khung hiển thị CỐ ĐỊNH ("W / H") — ƯU TIÊN HƠN width/height thật bên
      dưới khi có khai. Dùng cho 2 trường hợp: (1) box "1 ảnh duy nhất"
      không có width/height để tính (ảnh bảng tên dạng đứng cần khung dọc
      thay vì mặc định); (2) CHỦ ĐỘNG ép 1 ảnh tỉ lệ quá cực đoan (VD ảnh
      mặt tiền quá dọc ~2:3) về khung ổn định hơn để không có 1 cột Masonry
      cao vọt hẳn so với các cột khác — xem FACADE_TALL_RATIO_THRESHOLD ở
      LocationPageTemplate.tsx. KHÔNG khai (undefined) — trường hợp bình
      thường, tuyệt đại đa số ảnh — nghĩa là "giữ đúng tỉ lệ thật qua
      width/height", ĐÚNG nguyên tắc Masonry gốc: không crop trừ khi có lý
      do chủ động, tường minh qua field này. */
  aspectRatio?: string;
  /** Kích thước pixel THẬT của ảnh — đọc từ file qua getPublicJpegDimensions() (xem LocationPageTemplate.tsx), dùng để dựng khung Masonry đúng tỉ lệ thật (không crop) khi KHÔNG có `aspectRatio` ép riêng ở trên. Thiếu cả 2 (ảnh lỗi/không đọc được, không ép riêng) thì rơi về tỉ lệ 4:3 mặc định cho bố cục 2+ ảnh. */
  width?: number;
  height?: number;
};

/** `aspectRatio` ép riêng (nếu có) LUÔN thắng width/height thật — xem doc
    comment InteriorImage.aspectRatio. Dùng chung cho cả 2 bố cục (1 ảnh
    và Masonry 2+ ảnh) để không lệch quy tắc ưu tiên giữa 2 nơi. */
function resolveAspectRatio(img: InteriorImage, fallback: string): string {
  if (img.aspectRatio) return img.aspectRatio;
  if (img.width && img.height) return `${img.width} / ${img.height}`;
  return fallback;
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

  // 1 ảnh duy nhất (hiếm — VD chi nhánh chỉ có 1 ảnh bảng tên) — KHÔNG cần
  // Masonry nhiều cột, giữ nguyên khung dọc căn giữa + object-contain như
  // trước, đã tự tránh crop rồi (dùng aspectRatio riêng nếu có, mặc định
  // 3:4 — thường là ảnh bảng tên dạng đứng).
  if (count === 1) {
    const img = images[0];
    return (
      <section className="pt-3 pb-3">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <Reveal>
            <div className="mx-auto w-full max-w-[420px]">
              <button
                type="button"
                onClick={() => onImageClick?.(0)}
                aria-label={img.caption ?? img.alt}
                className="relative block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-bg-tint shadow-card"
                style={{ aspectRatio: resolveAspectRatio(img, "3 / 4") }}
              >
                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 1024px) 90vw, 420px" className="object-contain" />
              </button>
              {img.caption && (
                <p className="mt-1.5 text-center text-[11px] leading-snug text-body-text">{img.caption}</p>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  // 2+ ảnh — bố cục MASONRY kiểu Pinterest (CSS columns + break-inside:
  // avoid) thay vì lưới ô vuông/chữ nhật cố định trước đây (ép mọi ảnh vào
  // aspect-[4/3] bằng object-cover, cắt mất góc ảnh dọc như mặt tiền toà
  // nhà). MẶC ĐỊNH mỗi ảnh giữ ĐÚNG tỉ lệ thật của nó qua `aspect-ratio`
  // tính từ width/height thật (getPublicJpegDimensions() ở
  // LocationPageTemplate.tsx) — khung đã khớp đúng hình dạng ảnh nên
  // object-cover không còn gì để cắt (box và ảnh cùng tỉ lệ). Ảnh thiếu cả
  // width/height lẫn `aspectRatio` ép riêng (đọc file lỗi) rơi về 4:3 —
  // vẫn tốt hơn hẳn 1 box trống, chỉ hiếm khi xảy ra. resolveAspectRatio()
  // ưu tiên `img.aspectRatio` NẾU CÓ khai (VD ảnh mặt tiền quá dọc bị ép
  // 3:4 — xem FACADE_TALL_RATIO_THRESHOLD ở LocationPageTemplate.tsx) —
  // chỉ ảnh nào chủ động khai field đó mới bị crop, các ảnh còn lại (đa
  // số) không đọc thấy field này nên vẫn rơi đúng vào nhánh width/height,
  // giữ nguyên tỉ lệ thật tuyệt đối như thiết kế Masonry gốc.
  // 2 cột từ mobile trở lên (masonry vốn tự cân bằng cột, không còn cần
  // carousel cuộn ngang như bản lưới cứng trước đây), 3 cột từ lg: — đúng
  // yêu cầu "2-3 cột tuỳ độ rộng màn hình".
  return (
    <section className="pt-3 pb-3">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="columns-2 gap-3 sm:gap-4 lg:columns-3">
          {images.map((img, i) => {
            const ratio = resolveAspectRatio(img, "4 / 3");
            return (
              <div key={img.src} className="mb-3 break-inside-avoid sm:mb-4">
                <button
                  type="button"
                  onClick={() => onImageClick?.(i)}
                  aria-label={img.caption ?? img.alt}
                  className="relative block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-bg-tint shadow-card"
                  style={{ aspectRatio: ratio }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover"
                    style={{ objectPosition: img.objectPosition ?? "center" }}
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
