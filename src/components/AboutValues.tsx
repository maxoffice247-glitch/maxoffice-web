import SectionHead from "./SectionHead";
import Reveal, { RevealGroup, RevealItem } from "./Reveal";
import { ShieldCheckIcon, ClockIcon, UsersIcon, TagIcon } from "./icons";

const VALUES = [
  {
    icon: TagIcon,
    title: "Minh bạch",
    desc: "Không phí ẩn, không mập mờ trong bất kỳ thoả thuận nào — khách hàng luôn biết rõ mình đang trả cho điều gì.",
  },
  {
    icon: UsersIcon,
    title: "Tận tâm",
    desc: "Đồng hành thực chất với từng khách hàng, không chỉ dừng lại ở việc bán một dịch vụ.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Chuyên nghiệp",
    desc: "Đội ngũ am hiểu pháp lý, thuế và vận hành doanh nghiệp, tư vấn đúng và đủ ngay từ đầu.",
  },
  {
    icon: ClockIcon,
    title: "Đồng hành lâu dài",
    desc: "Mối quan hệ với khách hàng không kết thúc sau hợp đồng đầu tiên — chúng tôi ở lại cùng bạn qua từng giai đoạn phát triển.",
  },
];

export default function AboutValues() {
  return (
    <section className="bg-bg-tint py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Giá trị cốt lõi"
          title="Điều làm nên cách MAX OFFICE vận hành"
          description="Bốn giá trị này định hình mọi quyết định, từ cách chúng tôi tư vấn đến cách chúng tôi chăm sóc khách hàng mỗi ngày."
        />
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <RevealItem key={value.title}>
              <div className="group h-full rounded-2xl border border-line bg-white p-7 transition-all duration-400 ease-out hover:-translate-y-2 hover:border-transparent hover:shadow-card">
                <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-primary-tint text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2.5 text-[17px] font-bold text-navy">{value.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-body-text">{value.desc}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-12 rounded-2xl bg-gradient-to-tr from-navy to-primary-dark p-8 text-center sm:p-12">
          <span className="mb-3 inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.14em] text-[#8FC1F5] uppercase before:h-[2px] before:w-[18px] before:rounded-full before:bg-accent after:h-[2px] after:w-[18px] after:rounded-full after:bg-accent">
            Triết lý kinh doanh
          </span>
          <p className="mx-auto max-w-[680px] font-display text-[20px] leading-relaxed font-bold text-white sm:text-[24px]">
            &ldquo;Thành công của khách hàng chính là thước đo thành công của
            MAX OFFICE.&rdquo;
          </p>
        </Reveal>
      </div>
    </section>
  );
}
