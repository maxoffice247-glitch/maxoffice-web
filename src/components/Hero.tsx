"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { PhoneIcon, MapPinIcon } from "./icons";
import Button from "./Button";
import LeadFormButton from "./LeadFormButton";
import { LOCATIONS_LIST } from "@/lib/locationsData";

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

/** Mỗi slide là 1 câu hỏi ("nỗi đau" khách hàng) + 1 câu trả lời ngắn, với
 * đúng 1 cụm từ khoá được tô màu xanh nhấn — nhất quán với cách H1 tĩnh cũ
 * tô màu "bắt đầu vững vàng". answer.highlight của slide đầu tiên được nội
 * suy số chi nhánh ĐANG ACTIVE thật (LOCATIONS_LIST.length), không hardcode. */
type HeroSlide = {
  question: string;
  answerPre?: string;
  answerHighlight: string;
  answerPost?: string;
};

function getHeroSlides(branchCount: number): HeroSlide[] {
  return [
    {
      question: "Cần địa chỉ kinh doanh hợp pháp nhưng ngại chi phí thuê văn phòng?",
      answerPre: "Từ ",
      answerHighlight: "299.000đ/tháng",
      answerPost: `, ${branchCount} chi nhánh trung tâm TP.HCM.`,
    },
    {
      question: "Sợ ký hợp đồng dài hạn, không linh hoạt?",
      answerHighlight: "Hợp đồng linh hoạt",
      answerPost: ", có ưu đãi hấp dẫn khi gia hạn dài hạn.",
    },
    {
      question: "Lo phí phát sinh không rõ ràng?",
      answerPre: "Giá minh bạch, ",
      answerHighlight: "không phí ẩn",
      answerPost: " — cam kết rõ ràng bằng hợp đồng.",
    },
    {
      question: "Cần hỗ trợ thủ tục pháp lý, không biết bắt đầu từ đâu?",
      answerHighlight: "Tặng dịch vụ thành lập doanh nghiệp",
      answerPost: " khi ký hợp đồng dài hạn.",
    },
  ];
}

const SLIDE_INTERVAL_MS = 4500;

export default function Hero() {
  // Defaults to the first image so server and client render identically on
  // first paint (no hydration mismatch); the effect then swaps in a random
  // pick client-side, so each page load can land on a different photo.
  const [heroImage, setHeroImage] = useState(HERO_IMAGES[0]);

  useEffect(() => {
    setHeroImage(HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)]);
  }, []);

  const slides = getHeroSlides(LOCATIONS_LIST.length);
  const [activeSlide, setActiveSlide] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Auto-advance every ~4.5s. Re-armed off `activeSlide` (functional update
  // not needed since we depend on it directly) so a manual dot click resets
  // the countdown from that moment instead of firing early. Skipped entirely
  // under prefers-reduced-motion — the carousel then sits fixed on whichever
  // slide the visitor last chose (slide 1 by default), only dot clicks move it.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setTimeout(() => {
      setActiveSlide((i) => (i + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearTimeout(id);
  }, [activeSlide, prefersReducedMotion, slides.length]);

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
        {/* Mobile-only extra wash — narrow viewports show proportionally more
            of the un-overlaid right side of the photo, so add a flat dark
            layer here without touching the desktop/tablet gradient above. */}
        <div className="absolute inset-0 bg-[rgba(9,15,28,0.13)] sm:hidden" />
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

          {/* Carousel "nỗi đau khách hàng": mỗi slide xếp chồng trong cùng 1 ô
              grid (grid-area 1/1) nên chiều cao khối luôn bằng slide cao nhất
              — không có slide nào gây nhảy/giật layout khi đổi câu hỏi. */}
          <motion.div variants={item} className="mb-6 grid">
            {slides.map((slide, i) => {
              const isActive = i === activeSlide;
              // Chỉ slide đang hiển thị mới thực sự là thẻ <h1> — các slide còn
              // lại render dưới dạng <div> ẩn với trợ năng, tránh nhiều <h1>
              // cùng lúc trong DOM.
              const HeadingTag = isActive ? "h1" : "div";
              return (
                <motion.div
                  key={slide.question}
                  className="col-start-1 row-start-1"
                  aria-hidden={!isActive}
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
                  transition={{ duration: 0.5, ease: EASE_PREMIUM }}
                  style={{ pointerEvents: isActive ? "auto" : "none" }}
                >
                  <HeadingTag className="mb-3 font-display text-[30px] leading-[1.18] font-extrabold text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.35)] sm:text-[36px] lg:text-[46px] lg:leading-[1.15]">
                    {slide.question}
                  </HeadingTag>
                  <p className="text-lg font-semibold text-white/95 sm:text-xl lg:text-[26px]">
                    {slide.answerPre}
                    <span className="text-[#3B9EFF]">{slide.answerHighlight}</span>
                    {slide.answerPost}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Dot indicator — bấm để chuyển slide thủ công. */}
          <motion.div
            variants={item}
            role="tablist"
            aria-label="Chọn nội dung nổi bật"
            className="mb-6 flex items-center gap-2"
          >
            {slides.map((slide, i) => (
              <button
                key={slide.question}
                type="button"
                role="tab"
                aria-selected={i === activeSlide}
                aria-label={`Xem nội dung ${i + 1} trên ${slides.length}`}
                onClick={() => setActiveSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeSlide ? "w-6 bg-[#3B9EFF]" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </motion.div>

          <motion.p
            variants={item}
            className="mb-6 max-w-[700px] text-base text-white/86 sm:text-lg"
          >
            MAX OFFICE không chỉ cho thuê văn phòng — chúng tôi đồng hành
            cùng bạn từ ngày thành lập, xuyên suốt quá trình vận hành, đến
            khi mở rộng quy mô. Hơn 500 doanh nghiệp đã chọn MAX OFFICE tại
            22 địa điểm trung tâm TP.HCM để vận hành đúng luật, đúng tiến độ
            và tối ưu chi phí.
          </motion.p>
          <motion.div variants={item} className="mb-6">
            <nav
              aria-label="Dịch vụ nổi bật"
              className="grid grid-cols-1 gap-y-2 sm:grid-cols-3 sm:gap-x-6"
            >
              {SERVICE_KEYWORDS.map((kw) => (
                <Link
                  key={kw.href}
                  href={kw.href}
                  className="text-[12.5px] font-bold text-[#3B9EFF] transition-colors duration-200 hover:text-white hover:underline"
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
              Xem 22 chi nhánh
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
