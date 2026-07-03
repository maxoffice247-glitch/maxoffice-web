import SectionHead from "./SectionHead";
import { RevealGroup, RevealItem } from "./Reveal";

const STEPS = [
  {
    num: "01",
    title: "Liên hệ tư vấn",
    desc: "Chia sẻ nhu cầu, nhận tư vấn miễn phí từ chuyên viên MAX OFFICE.",
    accent: true,
  },
  {
    num: "02",
    title: "Chọn gói phù hợp",
    desc: "So sánh dịch vụ và mức giá, chọn giải pháp đúng nhu cầu & ngân sách.",
  },
  {
    num: "03",
    title: "Hoàn tất hồ sơ",
    desc: "Ký hợp đồng, chuẩn bị hồ sơ pháp lý với sự hỗ trợ trọn vẹn từ đội ngũ.",
  },
  {
    num: "04",
    title: "Bắt đầu vận hành",
    desc: "Doanh nghiệp chính thức hoạt động với đầy đủ hỗ trợ đi kèm.",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Quy trình hợp tác"
          title="Bắt đầu chỉ trong 4 bước"
          description="Quy trình tinh gọn, rõ ràng từng bước — để bạn luôn biết chính xác doanh nghiệp mình đang ở giai đoạn nào."
        />
        <RevealGroup className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-4 lg:gap-0">
          <div
            aria-hidden
            className="pointer-events-none absolute top-[26px] right-[12.5%] left-[12.5%] hidden h-0.5 lg:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, var(--color-line) 0 10px, transparent 10px 18px)",
            }}
          />
          {STEPS.map((step) => (
            <RevealItem key={step.num} className="group relative z-[1] px-0 text-center lg:px-5">
              <div
                className={`mx-auto mb-5 flex h-[54px] w-[54px] items-center justify-center rounded-full font-mono text-[17px] font-bold text-white shadow-soft transition-transform duration-300 group-hover:scale-110 ${
                  step.accent ? "bg-accent" : "bg-navy"
                }`}
              >
                {step.num}
              </div>
              <h3 className="mb-2 text-[16.5px] font-bold text-navy">
                {step.title}
              </h3>
              <p className="text-[13.5px] text-body-text">{step.desc}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
