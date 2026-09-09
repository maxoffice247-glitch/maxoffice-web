"use client";

import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import LocationFacade, { type FacadeImage } from "./LocationFacade";
import LocationGallery, { type InteriorImage } from "./LocationGallery";

// Only mounted once a thumbnail is clicked — keep its framer-motion/swipe
// logic out of the location page's initial JS chunk.
const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

/**
 * Ảnh mặt tiền + đoạn giới thiệu (bố cục 2 cột, LocationFacade.tsx) rồi
 * tới gallery Masonry ảnh NỘI THẤT còn lại (LocationGallery.tsx) — bố cục
 * 2 cột từng bị bỏ hẳn (chuyển ảnh mặt tiền vào chung Masonry) vì gây
 * khoảng trắng lớn khi văn bản ngắn hơn nhiều so với ảnh dọc; khôi phục
 * lại theo đúng yêu cầu, nhưng lần này XỬ LÝ TẬN GỐC khoảng trắng bằng
 * cách LẤP nó (khối "Điểm nổi bật khu vực" tự chèn khi cần — xem doc
 * comment LocationFacade.tsx) thay vì né tránh bằng cách bỏ hẳn bố cục.
 *
 * Ảnh mặt tiền KHÔNG còn nằm trong mảng truyền cho LocationGallery nữa
 * (đã hiện riêng ở LocationFacade) — tránh hiện trùng 2 lần. `allImages`
 * cho Lightbox vẫn gộp đủ CẢ 2 (mặt tiền index 0, nội thất index 1+) để
 * điều hướng prev/next liền mạch qua toàn bộ ảnh của chi nhánh, giống hệt
 * hành vi trước khi có Masonry.
 */
export default function LocationImagesSection({
  name,
  facadeImage,
  paragraphs,
  benefitsFiller,
  interiorImages,
}: {
  name: string;
  facadeImage: FacadeImage;
  paragraphs: string[];
  /** Khối "Điểm nổi bật khu vực" ĐÃ RENDER SẴN (Server Component, icon đã
      resolve) — xem doc comment LocationFacade.tsx vì sao không truyền
      thẳng `BenefitItem[]` xuống đây được. */
  benefitsFiller?: ReactNode;
  interiorImages?: InteriorImage[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const allImages = [
    { src: facadeImage.src, alt: facadeImage.alt },
    ...(interiorImages ?? []).map((img) => ({ src: img.src, alt: img.alt })),
  ];

  return (
    <>
      <LocationFacade
        name={name}
        image={facadeImage}
        paragraphs={paragraphs}
        benefitsFiller={benefitsFiller}
        onImageClick={() => setOpenIndex(0)}
      />
      <LocationGallery images={interiorImages} onImageClick={(i) => setOpenIndex(i + 1)} />
      <Lightbox images={allImages} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
    </>
  );
}
