"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
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

/** Ảnh cao hơn văn bản ít nhất ngần này (px) mới coi là "chênh lệch đáng
    kể" cần hiện khối lấp — chênh lệch nhỏ hơn chấp nhận để nguyên, không
    cố lấp bằng mọi giá (xem doc comment dưới). */
const FILL_GAP_THRESHOLD_PX = 48;
/** 2 cột chỉ áp dụng từ `lg:` (1024px, khớp class `lg:grid-cols-2` bên
    dưới) — dưới ngưỡng này ảnh/text xếp dọc, không có "cột nào cao hơn
    cột nào" để so, nên không cần (và không nên) hiện khối lấp. */
const TWO_COLUMN_MIN_WIDTH = 1024;

/**
 * Giới thiệu chi nhánh (văn bản) cạnh ảnh mặt tiền toà nhà, bố cục 2 cột —
 * ảnh giữ tỉ lệ thật (không crop, trừ 7 chi nhánh ảnh quá dọc đã ép 3:4 từ
 * LocationPageTemplate.tsx). Khi ảnh cao hơn văn bản đáng kể (chi nhánh có
 * đoạn giới thiệu ngắn), thay vì để trống 1 khoảng lớn dưới văn bản như bố
 * cục 2 cột từng bị bỏ trước đây, tự HIỆN thêm 1 khối "Điểm nổi bật khu
 * vực" (`benefitsFiller`) — LẤY DỮ LIỆU THẬT từ `data.benefits` (field đã
 * dùng sẵn cho section "Lợi ích" đầy đủ phía dưới trang, không bịa nội
 * dung mới) để lấp bớt chỗ trống.
 *
 * `benefitsFiller` được RENDER SẴN ở LocationPageTemplate.tsx (Server
 * Component) rồi truyền xuống dạng ReactNode thay vì truyền thẳng
 * `BenefitItem[]` — mỗi `BenefitItem.icon` là 1 THAM CHIẾU COMPONENT
 * (function), không thể truyền qua ranh giới Server→Client Component
 * (Next.js báo lỗi "Functions cannot be passed directly to Client
 * Components" nếu làm vậy — đã gặp thật khi build component này lần đầu).
 * Component client CHỈ quyết định HIỆN/ẨN khối đã dựng sẵn đó (boolean),
 * không tự render lại nội dung bên trong.
 *
 * ĐO CHIỀU CAO THẬT bằng ResizeObserver (không đoán qua công thức, giống
 * cách sửa row-span gói VPA trong VoPlanCard.tsx trước đây — công thức
 * đoán từng gây bug thật vì không phản ánh đúng độ dài chữ/xuống dòng
 * thực tế) — so chiều cao khối văn bản GỐC (chỉ đoạn giới thiệu, không
 * tính khối lấp) với chiều cao khung ảnh; vượt ngưỡng mới hiện khối lấp,
 * để tránh hiện thừa khi văn bản đã đủ dài tự nhiên cân bằng với ảnh.
 * Chỉ hoạt động khi đang xếp 2 cột (≥1024px) — dưới ngưỡng đó ảnh/text
 * xếp dọc tuần tự, không có khái niệm "cột nào cao hơn" nên luôn ẩn khối
 * lấp, không cần đo.
 */
export default function LocationFacade({
  name,
  image,
  imageSide = "right",
  paragraphs,
  benefitsFiller,
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
  benefitsFiller?: ReactNode;
  onImageClick?: () => void;
}) {
  const imageOrderClass = imageSide === "left" ? "order-1" : "order-1 lg:order-2";
  const textOrderClass = imageSide === "left" ? "order-2" : "order-2 lg:order-1";
  const textRef = useRef<HTMLDivElement>(null);
  const imageBoxRef = useRef<HTMLButtonElement>(null);
  const [showFiller, setShowFiller] = useState(false);

  useLayoutEffect(() => {
    const textEl = textRef.current;
    const imageEl = imageBoxRef.current;
    if (!textEl || !imageEl || !benefitsFiller) return;

    const measure = () => {
      if (window.innerWidth < TWO_COLUMN_MIN_WIDTH) {
        setShowFiller((prev) => (prev ? false : prev));
        return;
      }
      const gap = imageEl.getBoundingClientRect().height - textEl.getBoundingClientRect().height;
      const next = gap > FILL_GAP_THRESHOLD_PX;
      setShowFiller((prev) => (prev === next ? prev : next));
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
  }, [benefitsFiller]);

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
            {showFiller && benefitsFiller}
          </Reveal>
          <Reveal delay={0.1} className={imageOrderClass}>
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
