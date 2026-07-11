"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";
import { PlusIcon } from "./icons";

export type FaqItem = { q: string; a: string };

const DEFAULT_FAQS: FaqItem[] = [
  {
    q: "Văn phòng ảo có được dùng để đăng ký kinh doanh không?",
    a: "Có. Địa chỉ văn phòng ảo tại MAX OFFICE hoàn toàn hợp lệ để đăng ký kinh doanh, đăng ký thuế và các thủ tục pháp lý liên quan.",
  },
  {
    q: "Thời gian hoàn tất thủ tục thành lập công ty mất bao lâu?",
    a: "Thông thường từ 3-5 ngày làm việc tuỳ loại hình doanh nghiệp, MAX OFFICE sẽ hỗ trợ chuẩn bị hồ sơ và theo dõi tiến độ xuyên suốt.",
  },
  {
    q: "Nên chọn Hộ kinh doanh hay Công ty TNHH?",
    a: "Tuỳ quy mô và kế hoạch phát triển: Hộ kinh doanh phù hợp mô hình nhỏ, thủ tục đơn giản; Công ty TNHH phù hợp khi bạn cần tư cách pháp nhân, mở rộng hoặc hợp tác với đối tác lớn. Đội ngũ MAX OFFICE sẽ tư vấn miễn phí để bạn chọn đúng ngay từ đầu.",
  },
  {
    q: "Tôi có thể đổi gói dịch vụ trong quá trình sử dụng không?",
    a: "Có. Bạn có thể nâng cấp hoặc thay đổi gói dịch vụ bất kỳ lúc nào để phù hợp với quy mô phát triển của doanh nghiệp.",
  },
  {
    q: "Chi phí kế toán thuế đã bao gồm những gì?",
    a: "Bao gồm kê khai thuế định kỳ, sổ sách kế toán và tư vấn nghĩa vụ thuế hàng tháng, đúng quy định pháp luật hiện hành.",
  },
  {
    q: "MAX OFFICE có bao nhiêu địa điểm tại TP.HCM?",
    a: "MAX OFFICE hiện có 12 địa điểm tại các quận trung tâm TP.HCM như Tân Bình, Gò Vấp, Tân Phú, Quận 10 và Quận 1 — bạn có thể chọn địa chỉ thuận tiện nhất cho khách hàng và đội ngũ.",
  },
  {
    q: "Hợp đồng thuê văn phòng ảo và văn phòng trọn gói có ràng buộc dài hạn không?",
    a: "Không. Hợp đồng linh hoạt theo tháng hoặc theo năm tuỳ nhu cầu thực tế, không yêu cầu cam kết dài hạn — phù hợp với cả doanh nghiệp mới thành lập lẫn doanh nghiệp đang mở rộng.",
  },
  {
    q: "Sau khi thành lập công ty, MAX OFFICE còn hỗ trợ gì nữa không?",
    a: "Có. MAX OFFICE đồng hành lâu dài với dịch vụ kế toán thuế hàng tháng, tư vấn pháp lý, và hỗ trợ thủ tục khi bạn mở thêm chi nhánh hoặc mở rộng quy mô kinh doanh.",
  },
];

type FaqProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: FaqItem[];
  tint?: boolean;
};

export default function Faq({
  id = "faq",
  eyebrow = "Câu hỏi thường gặp",
  title = "Giải đáp thắc mắc của bạn",
  description,
  items = DEFAULT_FAQS,
  tint = false,
}: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqSchema =
    items.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null;

  return (
    <section id={id} className={`py-9 ${tint ? "bg-bg-tint" : ""}`}>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead eyebrow={eyebrow} title={title} description={description} />
        <Reveal className="mx-auto max-w-[800px]">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-5 py-5 text-left text-base font-bold text-ink transition-colors duration-200 hover:text-primary sm:text-[16px]"
                  aria-expanded={isOpen}
                >
                  {item.q}
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen ? "rotate-45 bg-primary text-white" : "bg-primary-tint text-primary"
                    }`}
                  >
                    <PlusIcon />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 0.9, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[680px] pb-6 text-[14.5px] leading-relaxed whitespace-pre-line text-body-text">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
