import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import LeadFormButton from "./LeadFormButton";
import ScrollFadeContainer from "./ScrollFadeContainer";
import { BadgePercentIcon } from "./icons";
import { AMENDMENT_SERVICES, COMBO_DISCOUNT_RULE } from "@/lib/setupFees";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default function AmendmentPricingTable() {
  return (
    <section id="dich-vu-phap-ly-sua-doi" className="scroll-mt-24 py-9">
      <div className="mx-auto max-w-[1000px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Bảng giá"
          title="Dịch vụ pháp lý sửa đổi"
          description="Áp dụng chung cho Hộ kinh doanh, Công ty TNHH và Công ty Cổ phần — không phân biệt loại hình."
        />

        <Reveal className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
          <ScrollFadeContainer className="overflow-x-auto">
            <table className="w-full min-w-[560px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[54%]" />
                <col className="w-[23%]" />
                <col className="w-[23%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-line">
                  <th className="bg-bg-tint py-3.5 pr-2 pl-6 text-[12.5px] font-bold text-navy">
                    Dịch vụ
                  </th>
                  <th className="bg-bg-tint px-2 py-3.5 text-center text-[12.5px] font-bold whitespace-nowrap text-navy">
                    Giá
                  </th>
                  <th className="bg-bg-tint py-3.5 pr-5 pl-2 text-right text-[12.5px] font-bold whitespace-nowrap text-navy">
                    Thời gian
                  </th>
                </tr>
              </thead>
              <tbody>
                {AMENDMENT_SERVICES.map((s, i) => (
                  <tr key={s.slug}>
                    <td
                      className={`border-b border-line py-3 pr-2 pl-6 text-[13.5px] font-medium text-navy ${
                        i % 2 === 1 ? "bg-[#f9fbfe]" : "bg-white"
                      }`}
                    >
                      {s.name}
                    </td>
                    <td
                      className={`border-b border-line px-2 py-3 text-center font-mono text-[14px] font-bold whitespace-nowrap text-primary ${
                        i % 2 === 1 ? "bg-bg-tint/50" : ""
                      }`}
                    >
                      {formatVND(s.price)}
                    </td>
                    <td
                      className={`border-b border-line py-3 pr-5 pl-2 text-right text-[13px] whitespace-nowrap text-body-text ${
                        i % 2 === 1 ? "bg-bg-tint/50" : ""
                      }`}
                    >
                      {s.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollFadeContainer>
        </Reveal>

        <Reveal>
          <div className="mt-7 rounded-2xl border-2 border-accent/25 bg-accent/5 p-6 sm:p-7">
            <h3 className="mb-2.5 flex items-center gap-2 text-[16px] font-bold text-navy">
              <BadgePercentIcon className="text-accent" />
              Ưu đãi combo khi đặt từ 2 dịch vụ trở lên
            </h3>
            <p className="text-[14px] leading-relaxed text-body-text">{COMBO_DISCOUNT_RULE}</p>
          </div>
        </Reveal>

        <div className="mt-8 text-center">
          <LeadFormButton service="Thành lập doanh nghiệp" variant="primary">
            Nhận tư vấn miễn phí
          </LeadFormButton>
        </div>
      </div>
    </section>
  );
}
