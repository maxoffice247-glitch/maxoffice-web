"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionHead from "./SectionHead";
import { RevealGroup, RevealItem } from "./Reveal";
import { QuoteIcon, StarIcon, ChevronRightIcon } from "./icons";

export type Testimonial = {
  quote: string;
  initial: string;
  name: string;
  role: string;
};

const EASE_PREMIUM = [0.22, 0.9, 0.32, 1] as const;
const PAGE_SIZE = 3;

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "MAX OFFICE giúp công ty mình có địa chỉ kinh doanh tại Quận 1 chỉ trong vài ngày, thủ tục rõ ràng và đội ngũ hỗ trợ rất nhiệt tình.",
    initial: "H",
    name: "Thanh Hà",
    role: "Giám đốc, ABC Logistics",
  },
  {
    quote:
      "Chuyển từ văn phòng riêng sang văn phòng trọn gói của MAX OFFICE giúp startup của mình tiết kiệm đáng kể chi phí vận hành mỗi tháng.",
    initial: "M",
    name: "Minh Quân",
    role: "Founder, TechNova Studio",
  },
  {
    quote:
      "Dịch vụ kế toán thuế trọn gói giúp mình yên tâm về sổ sách, không còn lo trễ hạn kê khai như trước đây.",
    initial: "T",
    name: "Anh Tuấn",
    role: "CEO, Việt Phát Trading",
  },
  {
    quote:
      "Mở thêm chi nhánh thứ ba, tụi mình nhờ MAX OFFICE làm hết thủ tục đăng ký địa điểm kinh doanh, xong trong chưa đầy một tuần, không phải chạy lên chạy xuống Sở KH&ĐT như trước.",
    initial: "L",
    name: "Ngọc Lan",
    role: "Chủ chuỗi, Lan's Coffee & Tea",
  },
  {
    quote:
      "Bán hàng online nên tụi mình không cần văn phòng cố định, nhưng vẫn cần địa chỉ đăng ký kinh doanh đàng hoàng để xuất hoá đơn cho khách sỉ. Văn phòng ảo của MAX OFFICE giải quyết đúng vấn đề này.",
    initial: "P",
    name: "Gia Phúc",
    role: "Founder, Phúc Store",
  },
  {
    quote:
      "Đội mình làm sáng tạo, thích không gian mở để trao đổi ý tưởng. Chỗ ngồi linh động ở MAX OFFICE vừa đủ năng động vừa có phòng họp riêng khi cần gặp khách hàng.",
    initial: "K",
    name: "Bảo Khang",
    role: "Creative Director, Inkwell Studio",
  },
  {
    quote:
      "Trung tâm mình cần phòng họp để tư vấn phụ huynh vào buổi tối, đặt phòng qua MAX OFFICE rất tiện, không phải ký hợp đồng thuê nguyên tháng cho một vài buổi.",
    initial: "V",
    name: "Thuý Vy",
    role: "Giám đốc, Trung tâm Anh ngữ Bright Kids",
  },
  {
    quote:
      "Ngành xây dựng tụi mình hay phải mở pháp nhân mới cho từng dự án. MAX OFFICE hỗ trợ thành lập nhanh, giá rõ ràng ngay từ đầu, không phát sinh lặt vặt.",
    initial: "H",
    name: "Đức Huy",
    role: "Giám đốc dự án, Huy Thịnh Construction",
  },
  {
    quote:
      "Công ty phần mềm của mình làm việc remote là chính, nhưng khách hàng nước ngoài vẫn hay hỏi địa chỉ văn phòng khi ký hợp đồng. Có địa chỉ tại MAX OFFICE giúp mình trông chuyên nghiệp hơn hẳn.",
    initial: "N",
    name: "Anh Nguyên",
    role: "CTO, Vertex Software",
  },
];

type TestimonialsProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: Testimonial[];
  tint?: boolean;
};

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="group h-full rounded-2xl border border-line bg-white p-8 transition-all duration-400 ease-out hover:-translate-y-2 hover:border-transparent hover:shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <QuoteIcon className="text-primary-tint" />
        <div className="flex gap-0.5 text-[#F5A623]">
          {Array.from({ length: 5 }).map((_, idx) => (
            <StarIcon key={idx} />
          ))}
        </div>
      </div>
      <p className="mb-6 text-[15px] leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-gradient-to-br from-navy to-primary-dark font-mono text-[15px] font-bold text-white">
          {t.initial}
        </div>
        <div>
          <strong className="block text-sm text-navy">{t.name}</strong>
          <span className="text-[12.5px] text-body-text">{t.role}</span>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials({
  id = "testimonials",
  eyebrow = "Khách hàng nói gì",
  title = "Được hơn 500 doanh nghiệp tin dùng",
  description = "Từ startup mới thành lập đến doanh nghiệp đang mở rộng quy mô — đây là những chia sẻ thật từ khách hàng đã đồng hành cùng MAX OFFICE.",
  items = DEFAULT_TESTIMONIALS,
  tint = false,
}: TestimonialsProps) {
  const pageCount = Math.ceil(items.length / PAGE_SIZE);
  const [page, setPage] = useState(0);
  const reduceMotion = useReducedMotion();
  const isCarousel = pageCount > 1;

  const currentItems = isCarousel
    ? items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
    : items;

  const goTo = (next: number) => {
    setPage(((next % pageCount) + pageCount) % pageCount);
  };

  return (
    <section id={id} className={`py-9 ${tint ? "bg-bg-tint" : ""}`}>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead eyebrow={eyebrow} title={title} description={description} />

        {isCarousel ? (
          <>
            <div className="relative">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={page}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, ease: EASE_PREMIUM }}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {currentItems.map((t) => (
                    <TestimonialCard key={t.name} t={t} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={() => goTo(page - 1)}
                aria-label="Đánh giá trước đó"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white text-navy shadow-soft transition-colors duration-200 hover:bg-bg-tint"
              >
                <ChevronRightIcon className="h-4 w-4 rotate-180" />
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Xem nhóm đánh giá ${i + 1}`}
                    aria-current={i === page}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === page ? "w-6 bg-primary" : "w-2 bg-line hover:bg-primary/40"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => goTo(page + 1)}
                aria-label="Đánh giá tiếp theo"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white text-navy shadow-soft transition-colors duration-200 hover:bg-bg-tint"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((t) => (
              <RevealItem key={t.name}>
                <TestimonialCard t={t} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
