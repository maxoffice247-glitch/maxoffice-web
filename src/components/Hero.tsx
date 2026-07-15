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
        {/* Left-to-right wash — darkest (65%) at the left edge under the text,
            fading to clear by ~65% width where all 3 photos' busier detail
            (desks, skyline) sits. */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(9,15,28,0.65)] from-0% via-[rgba(9,15,28,0.28)] via-45% to-[rgba(9,15,28,0)] to-65%" />
        {/* Separate, independent strip so the header nav always reads clearly
            regardless of how light the photo is right at the top edge. */}
        <div className="absolute inset-x-0 top-0 h-[110px] bg-gradient-to-b from-[rgba(6,12,24,0.85)] to-transparent" />
      </div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-[1240px] px-5 sm:px-8"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <div className="max-w-[760px]">
          <motion.p
            variants={item}
            className="mb-3 inline-flex items-center gap-2 text-[12.5px] font-bold tracking-[0.14em] text-[#8FC1F5] uppercase before:h-[2px] before:w-[22px] before:rounded-full before:bg-accent"
          >
            Đối tác vận hành doanh nghiệp toàn diện
          </motion.p>
          <motion.h1
            variants={item}
            className="mb-4 font-display text-[32px] leading-[1.15] font-extrabold text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.35)] sm:text-[38px] lg:text-[51px] lg:leading-[1.12]"
          >
            Nơi doanh nghiệp của bạn{" "}
            <span className="text-[#3B9EFF]">bắt đầu vững vàng</span>{" "}
            &amp; phát triển bền vững
          </motion.h1>
          <motion.p
            variants={item}
            className="mb-6 max-w-[700px] text-base text-white/86 sm:text-lg"
          >
            MAX OFFICE không chỉ cho thuê văn phòng — chúng tôi đồng hành
            cùng bạn từ ngày thành lập, xuyên suốt quá trình vận hành, đến
            khi mở rộng quy mô. Hơn 500 doanh nghiệp đã chọn MAX OFFICE tại
            12 địa điểm trung tâm TP.HCM để vận hành đúng luật, đúng tiến độ
            và tối ưu chi phí.
          </motion.p>
          <motion.div variants={item} className="mb-6">
            <nav
              aria-label="Dịch vụ nổi bật"
              className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3"
            >
              {SERVICE_KEYWORDS.map((kw) => (
                <Link
                  key={kw.href}
                  href={kw.href}
                  className="text-[12.5px] font-bold text-[#8FC1F5] transition-colors duration-200 hover:text-white hover:underline"
                >
                  {kw.label}
                </Link>
              ))}
            </nav>
          </motion.div>
          <motion.div
            variants={item}
            className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center"
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
        </div>
      </motion.div>
    </section>
  );
}
