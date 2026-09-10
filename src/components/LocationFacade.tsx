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

/** ẢNH cao hơn VĂN BẢN quá ngần này (px) → hiện khối lấp benefits ở cột
    văn bản. Ngưỡng thấp vì "lấp benefits" là can thiệp nhẹ (thêm vài mục
    từ data.benefits có sẵn). */
const FILL_GAP_THRESHOLD_PX = 48;
/** VĂN BẢN cao hơn ẢNH quá ngần này (px) → bọc ảnh trong khối nền màu
    thương hiệu giãn hết cột + căn giữa (`centerImage`). Ngưỡng CAO hơn hẳn
    vì đây là can thiệp NẶNG về thị giác (đổi hẳn khung ảnh sang 1 khối
    màu lớn) — chỉ đáng làm khi cột ảnh thấp hơn HẲN (ảnh mặt tiền tỉ lệ
    ngang), không phải cho chênh lệch nhỏ (ảnh dọc 3:4 chỉ ngắn hơn văn
    bản chút ít — để top-align như cũ, chấp nhận khoảng hở nhỏ ở đáy). */
const CENTER_IMAGE_GAP_THRESHOLD_PX = 180;
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
 * tính khối lấp) với chiều cao khung ảnh:
 *   - ẢNH cao hơn VĂN BẢN quá ngưỡng → hiện khối lấp benefits ở cột văn
 *     bản (`showFiller`), tránh hiện thừa khi văn bản đã đủ dài.
 *   - VĂN BẢN cao hơn ẢNH quá ngưỡng (thường gặp khi ảnh mặt tiền tỉ lệ
 *     NGANG — Mai Chí Thọ, Yên Thế, Tân Thắng, Bàu Cát 2, Lam Sơn, Hoàng
 *     Kế Viêm, 54-56 Lê Quốc Hưng — cột ảnh thấp lè tè cạnh cột văn bản
 *     dài) → `centerImage`: cột ảnh giãn hết chiều cao hàng (lg:self-stretch),
 *     bọc ảnh trong 1 khung nền `bg-bg-tint` bo góc và CĂN GIỮA ảnh theo
 *     chiều dọc — biến khoảng trống "dồn hết xuống đáy" (trông như lỗi)
 *     thành phần nền khung ảnh chia đều trên/dưới, trông có chủ đích.
 * 2 nhánh loại trừ nhau (1 bên ảnh>văn bản, bên kia văn bản>ảnh) nên
 * không bao giờ bật cùng lúc. Chỉ hoạt động khi đang xếp 2 cột (≥1024px)
 * — dưới ngưỡng đó ảnh/text xếp dọc tuần tự, không có "cột nào cao hơn".
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
  const [centerImage, setCenterImage] = useState(false);

  useLayoutEffect(() => {
    const textEl = textRef.current;
    const imageEl = imageBoxRef.current;
    if (!textEl || !imageEl) return;

    const measure = () => {
      if (window.innerWidth < TWO_COLUMN_MIN_WIDTH) {
        setShowFiller((prev) => (prev ? false : prev));
        setCenterImage((prev) => (prev ? false : prev));
        return;
      }
      const imgH = imageEl.getBoundingClientRect().height;
      const textH = textEl.getBoundingClientRect().height;
      // Ảnh cao hơn văn bản → hiện khối lấp benefits (chỉ khi có sẵn khối
      // để hiện). Văn bản cao hơn ảnh → căn giữa + đóng khung ảnh.
      const nextFiller = !!benefitsFiller && imgH - textH > FILL_GAP_THRESHOLD_PX;
      const nextCenter = textH - imgH > CENTER_IMAGE_GAP_THRESHOLD_PX;
      setShowFiller((prev) => (prev === nextFiller ? prev : nextFiller));
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
