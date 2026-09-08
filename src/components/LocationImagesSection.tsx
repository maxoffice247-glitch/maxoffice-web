"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Reveal from "./Reveal";
import LocationGallery, { type InteriorImage } from "./LocationGallery";

// Only mounted once a thumbnail is clicked — keep its framer-motion/swipe
// logic out of the location page's initial JS chunk.
const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

/**
 * Đoạn giới thiệu chi nhánh (full-width) + gallery Masonry — TRƯỚC ĐÂY đoạn
 * giới thiệu nằm cạnh 1 ảnh mặt tiền lớn trong bố cục 2 cột (LocationFacade,
 * nay đã xoá), với ảnh nội thất xếp riêng thành gallery bên dưới. Bố cục 2
 * cột đó gây khoảng trắng RẤT LỚN (~300px ở Sông Thao) mỗi khi đoạn văn
 * ngắn hơn nhiều so với chiều cao ảnh mặt tiền (ảnh tỉ lệ dọc, có nơi ~2:3)
 * — không phải vấn đề thẩm mỹ chủ quan, mà là lỗi bố cục thật: 2 cột cùng
 * hàng cao bằng cột cao nhất (ảnh), cột text ngắn hơn để lại khoảng trống
 * y hệt phần chênh lệch chiều cao.
 *
 * SỬA: bỏ hẳn bố cục 2 cột — đoạn giới thiệu đứng ĐỘC LẬP, full-width (giới
 * hạn max-w-[820px] canh giữa để dễ đọc, không kéo dài dòng chữ hết màn
 * hình rộng). Ảnh mặt tiền chuyển vào LocationGallery (Masonry) làm ẢNH ĐẦU
 * TIÊN — gallery vốn đã tự đọc W/H thật của từng ảnh (getPublicJpegDimensions
 * ở LocationPageTemplate.tsx) để dựng khung đúng tỉ lệ, không crop, nên ảnh
 * mặt tiền dù tỉ lệ dọc cỡ nào cũng tự nhiên nằm gọn 1 ô Masonry — không còn
 * "phải cân đối với cột text" vì không còn đứng cạnh text nữa, loại bỏ tận
 * gốc nguyên nhân gây khoảng trắng thay vì chỉ che bớt bằng cách crop ảnh.
 *
 * Đây CHÍNH LÀ bố cục LocationIntro.tsx gốc trước đợt tách LocationFacade/
 * LocationGallery (commit e42183f) — đợt đó tách riêng ảnh mặt tiền ra 1 cột
 * cạnh text để "precision-crop" ảnh, nhưng lại tạo ra đúng lỗi khoảng trắng
 * này cho ảnh dọc. Khôi phục bố cục cũ, giữ nguyên các cải tiến sau này
 * (Masonry giữ tỉ lệ thật, Lightbox, Next/Image `fill`).
 */
export default function LocationImagesSection({
  paragraphs,
  images,
}: {
  paragraphs: string[];
  images: InteriorImage[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <section className="pt-9 pb-3">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <Reveal className="mx-auto max-w-[820px] space-y-5">
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
          </Reveal>
        </div>
      </section>
      <LocationGallery images={images} onImageClick={setOpenIndex} />
      <Lightbox
        images={images.map((img) => ({ src: img.src, alt: img.alt }))}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </>
  );
}
