"use client";

import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import LocationFacade, { type FacadeImage } from "./LocationFacade";
import LocationGallery, { type InteriorImage } from "./LocationGallery";

// Only mounted once a thumbnail is clicked — keep its framer-motion/swipe
// logic out of the location page's initial JS chunk.
const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

/**
 * Ảnh mặt tiền + đoạn giới thiệu (bố cục 2 cột SO LE trái/phải theo từng
 * chi nhánh, LocationFacade.tsx) rồi tới lưới ảnh NỘI THẤT còn lại (lưới cố
 * định + carousel mobile, LocationGallery.tsx), và khối tóm tắt "Điểm nổi
 * bật khu vực" đặt CỐ ĐỊNH ngay dưới lưới ảnh — NHẤT QUÁN cho mọi chi
 * nhánh. Trước đây khối benefits được chèn ĐỘNG vào khối 2 cột khi
 * ResizeObserver phát hiện cột văn bản cao hơn cột ảnh; cơ chế đó đã bỏ vì
 * cho kết quả không đều (chi nhánh chênh lệch nhỏ vẫn bị chèn benefits cắt
 * ngang mạch đọc phần giới thiệu). Khối 2 cột giờ CHỈ còn văn bản + ảnh
 * mặt tiền.
 *
 * Ảnh mặt tiền KHÔNG nằm trong mảng truyền cho LocationGallery (đã hiện
 * riêng ở LocationFacade) — tránh hiện trùng. `allImages` cho Lightbox vẫn
 * gộp đủ CẢ 2 (mặt tiền index 0, nội thất index 1+) để điều hướng prev/next
 * liền mạch qua toàn bộ ảnh của chi nhánh.
 */
export default function LocationImagesSection({
  name,
  facadeImage,
  imageSide,
  paragraphs,
  benefitsBlock,
  interiorImages,
}: {
  name: string;
  facadeImage: FacadeImage;
  /** So le trái/phải ảnh mặt tiền theo từng chi nhánh — xem doc comment
      `imageSide` ở LocationFacade.tsx. */
  imageSide?: "left" | "right";
  paragraphs: string[];
  /** Khối "Điểm nổi bật khu vực" ĐÃ RENDER SẴN (Server Component, icon đã
      resolve) — hiện CỐ ĐỊNH dưới lưới ảnh (LocationGallery.tsx). Xem doc
      comment LocationGallery.tsx vì sao không truyền thẳng `BenefitItem[]`
      xuống đây được. */
  benefitsBlock?: ReactNode;
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
        imageSide={imageSide}
        paragraphs={paragraphs}
        onImageClick={() => setOpenIndex(0)}
      />
      <LocationGallery
        images={interiorImages}
        benefitsBlock={benefitsBlock}
        onImageClick={(i) => setOpenIndex(i + 1)}
      />
      <Lightbox images={allImages} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
    </>
  );
}
