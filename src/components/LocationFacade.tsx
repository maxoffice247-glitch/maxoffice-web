"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

export type FacadeImage = {
  src: string;
  alt: string;
  /** Tỉ lệ khung ("W / H") — ĐÃ tính sẵn ở LocationPageTemplate.tsx (thật
      cho đa số chi nhánh, ép "3 / 4" riêng cho 7 chi nhánh ảnh quá dọc qua
      FACADE_TALL_RATIO_THRESHOLD). Component này chỉ dùng lại, không tự
      tính — 1 nguồn tính duy nhất, tránh lệch với cách LocationGallery.tsx
      tính cho các ảnh khác. */
  aspectRatio: string;
  objectPosition?: string;
};

/** VĂN BẢN cao hơn ẢNH quá ngần này (px) → bọc ảnh trong khối nền màu
    thương hiệu giãn hết cột + căn giữa (`centerImage`). Chỉ đáng làm khi
    cột ảnh thấp hơn HẲN (ảnh mặt tiền tỉ lệ NGANG), không phải cho chênh
    lệch nhỏ (ảnh dọc 3:4 chỉ ngắn hơn văn bản chút ít — để top-align như
    cũ, chấp nhận khoảng hở nhỏ ở đáy).

    Đo trên 29 chi nhánh (ngưỡng 180 + chặn `isLandscapeFacade` bên dưới):
    KÍCH HOẠT ở Mai Chí Thọ (hở 490), Yên Thế (361), 54-56 Lê Quốc Hưng
    (292). KHÔNG kích hoạt: Tân Thắng (158), Bàu Cát 2 (113), Hoàng Kế Viêm
    (86), Lam Sơn (75) — ảnh ngang nhưng hở vừa phải, khối nền màu sẽ quá
    nặng so với khoảng trống; Nguyễn Oanh / Quận 7 ảnh gần vuông (tỉ lệ
    1.0) đã bị `isLandscapeFacade` loại. Toàn bộ ảnh mặt tiền tỉ lệ DỌC
    không bao giờ chạm ngưỡng (ảnh dọc luôn cao hơn hoặc xấp xỉ cột văn
    bản). */
const CENTER_IMAGE_GAP_THRESHOLD_PX = 180;
/** Chỉ ảnh mặt tiền tỉ lệ NGANG rõ rệt (rộng/cao > 1.1) mới xét
    `centerImage` — tách khỏi nhóm ảnh gần vuông (Nguyễn Oanh, Quận 7 ~1.0)
    và ảnh dọc. Trong tỉ lệ THẬT của 29 ảnh mặt tiền có khoảng trống tự
    nhiên giữa 1.00 và 1.23 (Lam Sơn) nên 1.1 tách 2 nhóm sạch. Tỉ lệ lấy
    từ `image.aspectRatio` (chuỗi "W / H" đã tính sẵn ở
    LocationPageTemplate.tsx từ header file .jpg), không đo lại. */
const LANDSCAPE_FACADE_MIN_RATIO = 1.1;
/** 2 cột chỉ áp dụng từ `lg:` (1024px, khớp class `lg:grid-cols-2` bên
    dưới) — dưới ngưỡng này ảnh/text xếp dọc, không có "cột nào cao hơn
    cột nào" để so. */
const TWO_COLUMN_MIN_WIDTH = 1024;

/**
 * Giới thiệu chi nhánh (văn bản) cạnh ảnh mặt tiền toà nhà, bố cục 2 cột —
 * ảnh giữ tỉ lệ thật (không crop, trừ 7 chi nhánh ảnh quá dọc đã ép 3:4 từ
 * LocationPageTemplate.tsx).
 *
 * KHỐI NÀY GIỜ CHỈ CÒN văn bản + ảnh mặt tiền — KHÔNG còn chèn "Điểm nổi
 * bật khu vực" (benefits) động vào đây nữa. Cơ chế cũ dùng ResizeObserver
 * so chiều cao 2 cột để quyết định CÓ/KHÔNG chèn benefits cho kết quả
 * không nhất quán giữa các chi nhánh (chi nhánh chênh lệch nhỏ vẫn bị chèn
 * benefits vào giữa mạch đọc). Benefits nay đặt CỐ ĐỊNH full-width ngay
 * dưới lưới gallery ảnh nội thất — xem LocationGallery.tsx +
 * LocationPageTemplate.tsx.
 *
 * CHỈ CÒN 1 xử lý động: với ảnh mặt tiền tỉ lệ NGANG (isLandscapeFacade,
 * lọc trước theo tỉ lệ file), ĐO CHIỀU CAO THẬT bằng ResizeObserver để
 * phát hiện cột ảnh thấp hơn HẲN cột văn bản (> 180px) → `centerImage`.
 * Đo trên 29 chi nhánh: kích hoạt ở Mai Chí Thọ, Yên Thế, 54-56 Lê Quốc
 * Hưng (xem số đo cụ thể ở doc comment CENTER_IMAGE_GAP_THRESHOLD_PX).
 * `centerImage`: cột ảnh
 * giãn hết chiều cao hàng (lg:self-stretch), bọc ảnh trong 1 khối nền
 * `bg-primary-tint` bo góc và CĂN GIỮA ảnh theo chiều dọc — biến khoảng
 * trống "dồn hết xuống đáy" (trông như lỗi) thành phần nền khối "featured
 * image" chia đều trên/dưới. Chỉ hoạt động khi đang xếp 2 cột (≥1024px).
 * Đo DOM thật (không đoán qua công thức) vì độ dài chữ/xuống dòng khác
 * nhau theo từng chi nhánh — công thức đoán từng gây bug thật (xem
 * VoPlanCard.tsx).
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
  /** Bên đặt ảnh mặt tiền — SO LE thủ công theo từng chi nhánh (data.facadeImageSide
      ở locationsData.ts) để khách xem lần lượt nhiều trang chi nhánh không
      thấy đơn điệu 1 bên cố định. Y HỆT logic gốc trước khi component này bị
      xoá rồi dựng lại (xem git show 7ca6b39:src/components/LocationFacade.tsx)
      — mobile LUÔN hiện ảnh trước bất kể `imageSide` (order-1 cả 2 trường
      hợp), chỉ đổi bên ở desktop (lg:order-1/2) khi `imageSide === "left"`. */
  imageSide?: "left" | "right";
  paragraphs: string[];
  onImageClick?: () => void;
}) {
  const imageOrderClass = imageSide === "left" ? "order-1" : "order-1 lg:order-2";
  const textOrderClass = imageSide === "left" ? "order-2" : "order-2 lg:order-1";
  const textRef = useRef<HTMLDivElement>(null);
  const imageBoxRef = useRef<HTMLButtonElement>(null);
  const [centerImage, setCenterImage] = useState(false);

  // Tỉ lệ ngang/dọc từ chuỗi "W / H" (đã tính sẵn ở LocationPageTemplate.tsx).
  const [ratioW, ratioH] = image.aspectRatio.split("/").map((n) => parseFloat(n));
  const isLandscapeFacade =
    Number.isFinite(ratioW) && Number.isFinite(ratioH) && ratioH > 0
      ? ratioW / ratioH > LANDSCAPE_FACADE_MIN_RATIO
      : false;

  useLayoutEffect(() => {
    const textEl = textRef.current;
    const imageEl = imageBoxRef.current;
    if (!textEl || !imageEl) return;

    const measure = () => {
      if (!isLandscapeFacade || window.innerWidth < TWO_COLUMN_MIN_WIDTH) {
        setCenterImage((prev) => (prev ? false : prev));
        return;
      }
      const imgH = imageEl.getBoundingClientRect().height;
      const textH = textEl.getBoundingClientRect().height;
      const nextCenter = textH - imgH > CENTER_IMAGE_GAP_THRESHOLD_PX;
      setCenterImage((prev) => (prev === nextCenter ? prev : nextCenter));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(textEl);
    ro.observe(imageEl);

    // Phòng trường hợp trang mount lúc tab/khung xem đang ẩn — xem doc
    // comment tương tự ở VoPlanCard.tsx (đã phát hiện thật khi test qua
    // Browser pane bị host ẩn giữa chừng, 1 số trình duyệt tạm dừng
    // callback ResizeObserver cho tab nền).
    const onVisible = () => {
      if (document.visibilityState === "visible") measure();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [isLandscapeFacade]);

  return (
    <section className="pt-9 pb-3">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className={textOrderClass}>
            <div ref={textRef} className="space-y-5">
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
          <Reveal delay={0.1} className={`${imageOrderClass} ${centerImage ? "lg:self-stretch" : ""}`}>
            {/* Khi văn bản cao hơn ảnh (ảnh mặt tiền tỉ lệ ngang) — bọc ảnh
                trong 1 KHỐI NỀN màu thương hiệu (primary-tint) giãn hết
                chiều cao cột, căn giữa ảnh theo chiều dọc: khoảng trống trở
                thành phần nền của khối "featured image", trông có chủ đích
                thay vì dồn hết xuống đáy. Khi không (đa số chi nhánh ảnh
                dọc) — div này là lớp trong suốt, ảnh hiển thị y như cũ. */}
            <div
              className={
                centerImage
                  ? "flex h-full items-center justify-center rounded-2xl bg-primary-tint p-4 sm:p-5"
                  : ""
              }
            >
              <button
                ref={imageBoxRef}
                type="button"
                onClick={onImageClick}
                aria-label={`Xem lớn ảnh mặt tiền văn phòng ${name}`}
                className="relative block w-full cursor-zoom-in overflow-hidden rounded-2xl shadow-card"
                style={{ aspectRatio: image.aspectRatio }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  style={{ objectPosition: image.objectPosition ?? "center" }}
                />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
