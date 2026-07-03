import SectionHead from "./SectionHead";
import { RevealGroup, RevealItem } from "./Reveal";

const MILESTONES = [
  {
    year: "2022",
    title: "Thành lập MAX OFFICE",
    desc: "Thành lập MAX OFFICE tại Số 10 Sông Thao, Tân Bình.",
  },
  {
    year: "2023",
    title: "Mở rộng 4 chi nhánh",
    desc: "Mở thêm 4 chi nhánh, ra mắt dịch vụ Văn phòng ảo.",
  },
  {
    year: "2024",
    title: "Đạt 10 chi nhánh",
    desc: "Đạt 10 chi nhánh, bổ sung dịch vụ Kế toán & Thuế trọn gói.",
  },
  {
    year: "2025",
    title: "Vượt mốc 500 doanh nghiệp",
    desc: "Vượt mốc 500 doanh nghiệp, mở thêm CN Điện Biên Phủ, tổng 12 địa điểm.",
  },
];

export default function AboutTimeline() {
  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Hành trình phát triển"
          title="Từ 1 địa điểm đến 12 địa điểm trong 3 năm"
        />
        <RevealGroup className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-4 lg:gap-0">
          <div
            aria-hidden
            className="pointer-events-none absolute top-[26px] right-[12.5%] left-[12.5%] hidden h-0.5 lg:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, var(--color-line) 0 10px, transparent 10px 18px)",
            }}
          />
          {MILESTONES.map((m, i) => (
            <RevealItem key={m.year} className="group relative z-[1] text-center lg:px-5">
              <div
                className={`mx-auto mb-5 flex h-[54px] w-[54px] items-center justify-center rounded-full font-mono text-[14px] font-bold text-white shadow-soft transition-transform duration-300 group-hover:scale-110 ${
                  i === MILESTONES.length - 1 ? "bg-accent" : "bg-navy"
                }`}
              >
                {m.year}
              </div>
              <h3 className="mb-2 text-[16.5px] font-bold text-navy">{m.title}</h3>
              <p className="text-[13.5px] text-body-text">{m.desc}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
