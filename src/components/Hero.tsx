"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
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

/** Khối mô tả dưới H1 (H1 nay đứng yên) xoay vòng 8 slide, TẤT CẢ cùng 1
 * cấu trúc: câu hỏi (nỗi đau khách hàng, in đậm màu nhấn) + câu trả lời
 * ngắn bên dưới — kể cả 2 slide đầu (trước đây là đoạn giới thiệu 1 dòng,
 * đã viết lại thành hỏi-đáp để đồng nhất với 6 slide còn lại). Số chi
 * nhánh trong slide 2 và slide 3 lấy ĐỘNG từ LOCATIONS_LIST.length. */
type HeroSlide = { question: string; answer: string };

function getHeroSlides(branchCount: number): HeroSlide[] {
  return [
    {
      question: "Bạn cần đối tác đồng hành lâu dài, không chỉ thuê văn phòng đơn thuần?",
      answer: "MAX OFFICE đồng hành cùng bạn từ ngày thành lập đến khi mở rộng quy mô.",
    },
    {
      question: "Chưa biết chọn đơn vị nào đủ uy tín, đủ chi nhánh để tin tưởng?",
      answer: `Hơn 500 doanh nghiệp đã tin chọn MAX OFFICE, tại ${branchCount} địa điểm trung tâm TP.HCM.`,
    },
    {
      question: "Cần địa chỉ kinh doanh hợp pháp nhưng ngại chi phí thuê văn phòng?",
      answer: `Từ 299.000đ/tháng, ${branchCount} chi nhánh trung tâm TP.HCM.`,
    },
    {
      question: "Sợ ký hợp đồng dài hạn, không linh hoạt?",
      answer: "Hợp đồng linh hoạt, có ưu đãi hấp dẫn khi gia hạn dài hạn.",
    },
    {
      question: "Lo phí phát sinh không rõ ràng?",
      answer: "Giá minh bạch, không phí ẩn — cam kết rõ ràng bằng hợp đồng.",
    },
    {
      question: "Cần hỗ trợ thủ tục pháp lý, không biết bắt đầu từ đâu?",
      answer: "🚀 Gói Vững Bước Khởi Nghiệp — tặng dịch vụ thành lập doanh nghiệp khi ký hợp đồng dài hạn.",
    },
    {
      question: "Thư từ thất lạc, mất thông báo thuế quan trọng?",
      answer: "Lễ tân tiếp nhận thư từ, bưu phẩm — thông báo ngay qua Zalo, không lo thất lạc giấy tờ.",
    },
    {
      question: "Ngân hàng từ chối mở tài khoản vì không có trụ sở thực?",
      answer: "Địa chỉ thật, có bảng tên, có lễ tân — đầy đủ giấy tờ xác minh cho ngân hàng.",
    },
    {
      question: "Sợ hóa đơn sai địa chỉ khiến mất quyền khấu trừ thuế VAT?",
      answer: "Địa chỉ tại MAX OFFICE luôn ổn định, được cơ quan thuế xác nhận hợp lệ, giúp bạn an tâm không lo bị truy thu.",
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

  // Auto-advance every ~4.5s. Re-armed off `activeSlide` so a manual dot
  // click resets the countdown from that moment instead of firing early.
  // Skipped entirely under prefers-reduced-motion — the block then sits
  // fixed on whichever slide the visitor last chose, only dot clicks move it.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setTimeout(() => {
      setActiveSlide((i) => (i + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearTimeout(id);
  }, [activeSlide, prefersReducedMotion, slides.length]);

  // --- Hiệu ứng cuộn "co nhỏ dần rồi biến mất" (tham khảo litespace.com.vn) ---
  // KHÔNG đụng gì đến carousel/dot indicator/auto-advance ở trên.
  //
  // Bản đầu dùng kỹ thuật "dính" (position: sticky trong 1 wrapper cao hơn
  // section thật) giống hệt litespace — nhưng bị báo 3 vấn đề thực tế: (1)
  // wrapper cao hơn đẩy StatsFloat khuất hẳn dưới màn hình, phải cuộn nhiều
  // mới thấy; (2) khoảng đệm hữu hạn (dù đã cố định bằng CSS để tránh CLS)
  // quá dễ bị "cuộn hết veo" chỉ trong 1 lần lướt chuột/trackpad (đặc biệt
  // với scroll-behavior:smooth toàn site), khiến hiệu ứng co nhỏ dồn hết vào
  // ngay lần cuộn đầu tiên rồi phần còn lại chỉ trượt suông — không mượt
  // theo đúng tốc độ cuộn như bên tham khảo; (3) mờ dần (opacity) làm mờ cả
  // nội dung, không được yêu cầu.
  //
  // Đổi sang cơ chế ĐƠN GIẢN & CHẮC CHẮN hơn: KHÔNG sticky, KHÔNG wrapper
  // nhân tạo — Hero vẫn nằm đúng vị trí tự nhiên trong luồng trang (StatsFloat
  // hiện ngay lập tức như trước, không bị đẩy khuất), chỉ co nhỏ dần (scale)
  // + bo góc trong khi TỰ NÓ cuộn khỏi màn hình theo tốc độ cuộn thật —
  // progress đo trên toàn bộ chiều cao THẬT của chính section (từ lúc đỉnh
  // section chạm đỉnh màn hình đến lúc đáy section chạm đỉnh màn hình), nên
  // luôn tỉ lệ đúng 1:1 với quãng đường đã cuộn, không phụ thuộc đoán trước 1
  // khoảng đệm cố định nào — cuộn tới đâu co nhỏ đến đó, không dồn cục.
  // KHÔNG còn opacity — giữ nguyên nội dung rõ nét, chỉ co nhỏ rồi tự cuộn
  // khuất khỏi màn hình (biến mất tự nhiên, không cần hiệu ứng mờ riêng).
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Co nhỏ rõ rệt hơn bản trước (0.94 -> 0.8) để hiệu ứng dễ nhận thấy hơn,
  // theo đúng phản hồi "phần thu nhỏ còn rộng nên chưa thấy rõ". Bo góc dần
  // theo, tạo cảm giác "khối card thu nhỏ về" khi cuộn qua.
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rawRadius = useTransform(scrollYProgress, [0, 1], [0, 40]);
  // Parallax: khối nội dung chữ dịch NHIỀU hơn ảnh nền khi cuộn — ảnh nền
  // "chậm hơn"/ở xa hơn nội dung (tỉ lệ ~3 lần, giữ như bản trước).
  const rawContentY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const rawBgY = useTransform(scrollYProgress, [0, 1], [0, -10]);
  // Tắt hẳn dưới prefers-reduced-motion — Hero cuộn bình thường, không co,
  // giống cách carousel cũng tắt auto-advance ở trên.
  const scrollStyle = prefersReducedMotion
    ? undefined
    : { scale: rawScale, borderRadius: rawRadius };
  const bgParallaxStyle = prefersReducedMotion ? undefined : { y: rawBgY };
  const contentParallaxStyle = prefersReducedMotion ? undefined : { y: rawContentY };

  return (
    <motion.section
      ref={sectionRef}
      style={scrollStyle}
      // origin-top: co nhỏ hướng vào mép TRÊN (điểm neo là đỉnh section, nơi
      // vừa chạm đỉnh màn hình) thay vì co đều 2 phía quanh tâm — tự nhiên
      // hơn cho cảm giác "thu nhỏ dần về" khi cuộn qua.
      className="relative flex min-h-[80vh] origin-top items-center overflow-hidden pt-24 pb-24 sm:pt-28 sm:pb-28 lg:pt-28 lg:pb-32"
    >
        <motion.div className="absolute inset-x-0 -top-6 -bottom-6" style={bgParallaxStyle}>
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
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto w-full max-w-[1240px] px-5 sm:px-8"
          initial="hidden"
          animate="visible"
          variants={container}
          style={contentParallaxStyle}
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

          {/* Khối mô tả xoay vòng: mỗi slide xếp chồng trong cùng 1 ô grid
              (grid-area 1/1 qua col-start-1/row-start-1) nên chiều cao khối
              luôn bằng slide cao nhất trong 8 slide — không có slide nào
              gây tràn hay để lại khoảng trống thừa. */}
          <motion.div variants={item} className="mb-6 grid max-w-[700px]">
            {slides.map((slide, i) => {
              const isActive = i === activeSlide;
              return (
                <motion.div
                  key={i}
                  className="col-start-1 row-start-1"
                  aria-hidden={!isActive}
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
                  transition={{ duration: 0.5, ease: EASE_PREMIUM }}
                  style={{ pointerEvents: isActive ? "auto" : "none" }}
                >
                  <div>
                    {/* Quay lại tông xanh (đỏ giờ dành riêng cho phần tử
                        bấm/tương tác: 6 link dịch vụ + nút CTA, xem
                        SERVICE_KEYWORDS bên dưới), nhưng KHÔNG dùng lại
                        #3B9EFF của H1 để tránh lặp vấn đề khó phân biệt giữa
                        H1 tĩnh và câu hỏi carousel động.
                        Bản đầu dùng --color-primary (#1565c0, text-primary)
                        nhưng bị BÁO LÀ QUÁ TỐI, gần như không thấy — #1565c0
                        vốn đã tối, cộng thêm viền text-shadow đen 3 lớp (cần
                        để đọc được ở vùng sáng của ảnh) khiến chữ chìm hẳn
                        vào nền tối navy (dải gradient wash rgba(9,15,28,…))
                        vì cả chữ lẫn nền lẫn viền đều tối, không đủ chênh
                        lệch độ sáng — khác với đỏ (accent) vốn nổi bật nhờ
                        chênh lệch TÔNG MÀU (ấm/lạnh) chứ không cần chữ sáng.
                        Đổi sang #38BDF8 (xanh sky/cyan, không phải token có
                        sẵn — không có biến xanh SÁNG nào trong hệ thống màu,
                        chỉ có primary/primary-dark đều tối hơn hoặc
                        primary-tint gần trắng dễ lẫn với câu trả lời trắng
                        bên dưới) — sáng và ngả cyan rõ hơn #3B9EFF (vốn ngả
                        azure thuần) nên vừa đủ sáng để nổi trên nền tối, vừa
                        đủ khác tông để không lẫn với H1 khi nhìn thoáng qua.
                        Giữ nguyên 3 lớp text-shadow outline tối — với chữ đã
                        đủ sáng, viền tối giờ có tác dụng đúng nghĩa "viền"
                        (tăng độ nét trên nền sáng của ảnh) thay vì làm chữ
                        chìm nghỉm như với #1565c0. Cỡ chữ giữ nguyên
                        text-lg/sm:text-xl từ lần tăng trước. */}
                    <p className="text-lg font-bold text-[#38BDF8] [text-shadow:0_0_2px_rgba(0,0,0,0.95),0_0_6px_rgba(0,0,0,0.85),0_1px_14px_rgba(0,0,0,0.6)] sm:text-xl">
                      {slide.question}
                    </p>
                    <p className="mt-1 text-base text-white/86 sm:text-lg">{slide.answer}</p>
                  </div>
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
                key={i}
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

          <motion.div variants={item} className="mb-6">
            <nav
              aria-label="Dịch vụ nổi bật"
              // 2 cột trên mobile (trước đây 1 cột — xếp dọc quá dài) — 3 cột
              // từ sm: trở lên.
              className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 sm:gap-x-6"
            >
              {SERVICE_KEYWORDS.map((kw) => (
                <Link
                  key={kw.href}
                  href={kw.href}
                  // Đỏ (phần tử bấm được, cùng quy tắc màu Hero với xanh =
                  // nhấn nội dung/thương hiệu) — nhưng KHÔNG dùng text-accent
                  // (#dc3530) nữa mà #FF3B30, đỏ tươi/sáng hơn để nổi hơn
                  // trên nền ảnh, theo yêu cầu riêng cho 6 link này (không
                  // áp dụng lại quy tắc "chỉ dùng token có sẵn" như các nơi
                  // khác — đây là ngoại lệ có chủ ý).
                  // Lịch sử thử nghiệm: text-shadow trắng (halo mờ — CHÓI)
                  // -> khung bo viền trắng chứa chữ (hiểu sai ý, viền
                  // KHUNG chứ không phải viền CHỮ) -> -webkit-text-stroke
                  // trắng viền chữ (bị báo "thảm hoạ còn dữ hơn" — có lẽ do
                  // stroke làm chữ bệt/nhoè ở cỡ nhỏ 12.5px) -> quay lại
                  // đúng bản ĐẦU TIÊN: text-shadow ĐEN 3 lớp (không dùng
                  // trắng/stroke nữa), chỉ đổi thêm đỏ tươi hơn.
                  className="text-[12.5px] font-bold text-[#FF3B30] [text-shadow:0_0_1px_rgba(0,0,0,0.9),0_0_4px_rgba(0,0,0,0.75),0_1px_8px_rgba(0,0,0,0.5)] transition-colors duration-200 hover:text-white hover:underline"
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
              Xem {LOCATIONS_LIST.length} chi nhánh
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
    </motion.section>
  );
}
