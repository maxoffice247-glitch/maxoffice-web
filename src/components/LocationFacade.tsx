"use client";

import Image from "next/image";
import Reveal from "./Reveal";

export type FacadeImage = {
  src: string;
  alt: string;
  /** Tỉ lệ khung ("W / H") — ĐÃ tính sẵn ở LocationPageTemplate.tsx (thật
      cho đa số chi nhánh, ép "3 / 4" riêng cho nhóm chi nhánh ảnh quá dọc
      qua FACADE_TALL_RATIO_THRESHOLD). Component này CHỈ dùng lại, không tự
      tính — 1 nguồn tính duy nhất, tránh lệch với cách LocationGallery.tsx
      tính cho các ảnh khác. Đặt thẳng vào `style={{ aspectRatio }}` nên ảnh
      giữ ĐÚNG tỉ lệ file (không ép cứng thêm gì ở đây). */
  aspectRatio: string;
  objectPosition?: string;
};

/**
 * Giới thiệu chi nhánh (văn bản) + ảnh mặt tiền toà nhà.
 *
 * BỐ CỤC = CSS FLOAT, KHÔNG CÒN LOGIC JS NÀO.
 * ---------------------------------------------------------------------
 * Desktop (≥ lg / 1024px): ảnh `float` sang 1 bên (trái/phải theo
 * `imageSide`), rộng cố định ~43% (`lg:w-[43%]`), có `margin` tạo khoảng
 * cách; văn bản nằm cùng container để trình duyệt TỰ chảy quanh ảnh. Văn
 * bản dài hơn ảnh → phần dư tự tràn full-width sau khi hết ảnh. Văn bản
 * ngắn hơn ảnh → `flow-root` (BFC) bọc trọn chiều cao ảnh, không cần xử lý
 * gì thêm. Không đo DOM, không phân loại "ảnh ngang / ảnh dọc" — 1 cơ chế
 * cho mọi tỉ lệ ảnh và mọi độ dài văn bản.
 *
 * Mobile (< lg): TẮT float (chỉ `lg:float-*` mới bật). Ảnh full-width phía
 * trên, văn bản full-width phía dưới — hành vi mobile tự nhiên, vốn ổn
 * định từ trước.
 *
 * Nhóm chi nhánh ảnh mặt tiền quá dọc vẫn được ép khung "3 / 4"
 * (object-cover) TỪ LocationPageTemplate.tsx — ở đây chỉ nhận
 * `image.aspectRatio` đã tính sẵn rồi float y như các chi nhánh khác,
 * KHÔNG có nhánh riêng.
 *
 * Khối "Điểm nổi bật khu vực" (benefits) KHÔNG còn liên quan component này
 * — đã chuyển thành khối cố định full-width dưới lưới gallery ảnh nội thất
 * (xem LocationGallery.tsx + LocationPageTemplate.tsx).
 */
export default function LocationFacade({
  name,
  image,
  imageSide = "right",
  paragraphs,
  onImageClick,
}: {
  name: string;
  image: FacadeImage;
  /** Bên đặt ảnh mặt tiền khi float (desktop) — SO LE thủ công theo từng
      chi nhánh (`data.facadeImageSide` ở locationsData.ts) để khách xem
      lần lượt nhiều trang chi nhánh không thấy đơn điệu 1 bên cố định.
      Mobile bỏ qua giá trị này (ảnh luôn nằm trên). */
  imageSide?: "left" | "right";
  paragraphs: string[];
  onImageClick?: () => void;
}) {
  const floatClass =
    imageSide === "left" ? "lg:float-left lg:mr-9" : "lg:float-right lg:ml-9";

  return (
    <section className="pt-9 pb-3">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        {/* `flow-root` = clearfix hiện đại: container tạo BFC, bọc trọn ảnh
            float kể cả khi văn bản ngắn hơn ảnh — không cần <div clear>. */}
        <Reveal className="flow-root">
          <button
            type="button"
            onClick={onImageClick}
            aria-label={`Xem lớn ảnh mặt tiền văn phòng ${name}`}
            className={`relative mb-6 block w-full cursor-zoom-in overflow-hidden rounded-2xl shadow-card lg:mb-2 lg:w-[43%] ${floatClass}`}
            style={{ aspectRatio: image.aspectRatio }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 43vw"
              className="object-cover"
              style={{ objectPosition: image.objectPosition ?? "center" }}
            />
          </button>
          <div className="space-y-5">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-justify-vn text-[17px] leading-relaxed font-medium text-ink"
                    : "text-justify-vn text-[15.5px] leading-relaxed text-body-text"
                }
              >
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
