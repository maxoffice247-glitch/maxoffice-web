"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PhoneIcon, MapPinIcon } from "./icons";
import Button from "./Button";
import LeadFormButton from "./LeadFormButton";

const EASE_PREMIUM = [0.22, 0.9, 0.32, 1] as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_PREMIUM } },
};

const SERVICE_KEYWORDS = [
  { label: "Văn phòng ảo", href: "/services/van-phong-ao" },
  { label: "Văn phòng trọn gói", href: "/services/van-phong-tron-goi" },
  { label: "Chỗ ngồi linh động", href: "/services/cho-ngoi-linh-dong" },
  { label: "Phòng họp theo giờ", href: "/services/phong-hop" },
  { label: "Thành lập doanh nghiệp", href: "/services/thanh-lap-doanh-nghiep" },
  { label: "Kế toán & thuế", href: "/services/ke-toan-thue" },
];

const HERO_IMAGES = [
  "/images/anh-hero-trang-chu.jpg",
  "/images/anh-hero-trang-chu-1.jpg",
  "/images/anh-hero-trang-chu-2.jpg",
];

export default function Hero() {
  // Defaults to the first image so server and client render identically on
  // first paint (no hydration mismatch); the effect then swaps in a random
  // pick client-side, so each page load can land on a different photo.
  const [heroImage, setHeroImage] = useState(HERO_IMAGES[0]);

  useEffect(() => {
    setHeroImage(HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)]);
  }, []);

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden pt-24 pb-24 sm:pt-28 sm:pb-28 lg:pt-28 lg:pb-32">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Không gian văn phòng MAX OFFICE"
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Light wash only — the glass card below now carries the text contrast,
            so the photo can stay bright and detailed instead of being darkened.
            30% (top of the 20-30% range) — measured against the brightest sky
            regions of the 3 new photos, anything lighter left the small blue
            text under WCAG AA contrast. */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-[1240px] px-5 sm:px-8"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <motion.div
          variants={item}
          className="w-full rounded-[24px] border p-[30px] sm:max-w-[640px] sm:p-[44px]"
          style={{
            background: "rgba(8,18,36,0.42)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderColor: "rgba(255,255,255,0.12)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          }}
        >
          <p className="mb-3 inline-flex items-center gap-2 text-[12.5px] font-bold tracking-[0.14em] text-[#E5F2FF] uppercase before:h-[2px] before:w-[22px] before:rounded-full before:bg-accent">
            Đối tác vận hành doanh nghiệp toàn diện
          </p>
          <h1 className="mb-4 font-display text-[32px] leading-[1.15] font-extrabold text-white sm:text-[38px] lg:text-[44px] lg:leading-[1.12]">
            Nơi doanh nghiệp của bạn{" "}
            <span className="text-[#9FCBFF]">bắt đầu vững vàng</span>{" "}
            &amp; phát triển bền vững
          </h1>
          <p className="mb-6 text-base text-white sm:text-lg">
            MAX OFFICE không chỉ cho thuê văn phòng — chúng tôi đồng hành
            cùng bạn từ ngày thành lập, xuyên suốt quá trình vận hành, đến
            khi mở rộng quy mô. Hơn 500 doanh nghiệp đã chọn MAX OFFICE tại
            12 địa điểm trung tâm TP.HCM để vận hành đúng luật, đúng tiến độ
            và tối ưu chi phí.
          </p>
          <nav
            aria-label="Dịch vụ nổi bật"
            className="grid grid-cols-2 gap-x-6 gap-y-2"
          >
            {SERVICE_KEYWORDS.map((kw) => (
              <Link
                key={kw.href}
                href={kw.href}
                className="text-[12.5px] font-bold text-[#E5F2FF] transition-colors duration-200 hover:text-white hover:underline"
              >
                {kw.label}
              </Link>
            ))}
          </nav>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-6 grid max-w-[640px] grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center"
        >
          <LeadFormButton
            variant="primary"
            className="w-full !px-5 text-center whitespace-normal sm:w-auto sm:whitespace-nowrap"
          >
            Nhận tư vấn miễn phí
          </LeadFormButton>
          <Button
            href="#pricing"
            variant="outline"
            className="w-full !px-5 text-center whitespace-normal sm:w-auto sm:whitespace-nowrap"
          >
            Xem bảng giá
          </Button>
          <Button
            href="/dia-diem"
            variant="outline"
            icon={<MapPinIcon />}
            className="w-full !px-5 text-center whitespace-normal sm:w-auto sm:whitespace-nowrap"
          >
            Xem 12 chi nhánh
          </Button>
          <Button
            href="tel:0898082188"
            variant="outline"
            icon={<PhoneIcon />}
            className="w-full !px-5 text-center whitespace-normal sm:w-auto sm:whitespace-nowrap"
          >
            Liên hệ ngay
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
