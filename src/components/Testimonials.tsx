import SectionHead from "./SectionHead";
import { RevealGroup, RevealItem } from "./Reveal";
import { QuoteIcon, StarIcon } from "./icons";

export type Testimonial = {
  quote: string;
  initial: string;
  name: string;
  role: string;
};

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
];

type TestimonialsProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: Testimonial[];
  tint?: boolean;
};

export default function Testimonials({
  id = "testimonials",
  eyebrow = "Khách hàng nói gì",
  title = "Được hơn 500 doanh nghiệp tin dùng",
  description = "Từ startup mới thành lập đến doanh nghiệp đang mở rộng quy mô — đây là những chia sẻ thật từ khách hàng đã đồng hành cùng MAX OFFICE.",
  items = DEFAULT_TESTIMONIALS,
  tint = false,
}: TestimonialsProps) {
  return (
    <section id={id} className={`py-9 ${tint ? "bg-bg-tint" : ""}`}>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead eyebrow={eyebrow} title={title} description={description} />
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <RevealItem key={t.name}>
              <div className="group h-full rounded-2xl border border-line bg-white p-8 transition-all duration-400 ease-out hover:-translate-y-2 hover:border-transparent hover:shadow-card">
                <div className="mb-4 flex items-center justify-between">
                  <QuoteIcon className="text-primary-tint" />
                  <div className="flex gap-0.5 text-[#F5A623]">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <StarIcon key={idx} />
                    ))}
                  </div>
                </div>
                <p className="mb-6 text-[15px] leading-relaxed text-ink">
                  &ldquo;{t.quote}&rdquo;
                </p>
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
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
