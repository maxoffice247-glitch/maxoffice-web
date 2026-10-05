import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import LeadFormButton from "./LeadFormButton";
import Button from "./Button";
import ScrollFadeContainer from "./ScrollFadeContainer";
import { BadgePercentIcon } from "./icons";
import { AMENDMENT_SCOPE_NOTE, AMENDMENT_SERVICES, COMBO_DISCOUNT_RULE } from "@/lib/setupFees";

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
          description={AMENDMENT_SCOPE_NOTE}
        />

        <Reveal className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
          {/* MỘT cấu trúc DOM duy nhất (table/tr/td): dưới md mỗi dòng hiển thị dạng THẺ xếp dọc bằng CSS (display:block/flex,
              nhãn "Thời gian" lấy từ data-label qua ::before) nên vừa trọn bề ngang điện thoại, không kéo ngang, không nhân đôi
              nội dung. Từ md trở lên giữ nguyên bảng 3 cột như cũ. Thêm role tường minh vì display khác table* làm trình đọc màn
              hình (Safari/VoiceOver) mất ngữ nghĩa bảng. */}
          <ScrollFadeContainer className="md:overflow-x-auto">
            <table role="table" className="block w-full border-collapse text-left md:table md:min-w-[560px] md:table-fixed">
              <colgroup>
                <col className="w-[54%]" />
                <col className="w-[23%]" />
                <col className="w-[23%]" />
              </colgroup>
              <thead role="rowgroup" className="sr-only md:not-sr-only md:table-header-group">
                <tr role="row" className="border-b border-line">
                  <th role="columnheader" className="bg-bg-tint py-3.5 pr-2 pl-6 text-[12.5px] font-bold text-navy">
                    Dịch vụ
                  </th>
                  <th role="columnheader" className="bg-bg-tint px-2 py-3.5 text-center text-[12.5px] font-bold whitespace-nowrap text-navy">
                    Giá
                  </th>
                  <th role="columnheader" className="bg-bg-tint py-3.5 pr-5 pl-2 text-right text-[12.5px] font-bold whitespace-nowrap text-navy">
                    Thời gian
                  </th>
                </tr>
              </thead>
              <tbody role="rowgroup" className="block md:table-row-group">
                {AMENDMENT_SERVICES.map((s, i) => (
                  <tr
                    key={s.slug}
                    role="row"
                    className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line px-4 py-3.5 md:table-row md:border-b-0 md:p-0 ${
                      i % 2 === 1 ? "bg-[#f9fbfe] md:bg-transparent" : "bg-white md:bg-transparent"
                    }`}
                  >
                    <td
                      role="cell"
                      data-label="Dịch vụ"
                      className={`w-full text-[14px] leading-snug font-semibold text-navy md:table-cell md:leading-normal md:w-auto md:border-b md:border-line md:py-3 md:pr-2 md:pl-6 md:text-[13.5px] md:font-medium ${
                        i % 2 === 1 ? "md:bg-[#f9fbfe]" : "md:bg-white"
                      }`}
                    >
                      {s.name}
                    </td>
                    <td
                      role="cell"
                      data-label="Giá"
                      className={`font-mono text-[15px] font-bold whitespace-nowrap text-primary md:table-cell md:border-b md:border-line md:px-2 md:py-3 md:text-center md:text-[14px] ${
                        i % 2 === 1 ? "md:bg-bg-tint/50" : ""
                      }`}
                    >
                      {formatVND(s.price)}
                    </td>
                    <td
                      role="cell"
                      data-label="Thời gian"
                      className={`ml-auto text-[12.5px] text-body-text before:mr-1 before:text-[11.5px] before:font-semibold before:text-body-text/70 before:content-[attr(data-label)_':'] md:ml-0 md:table-cell md:border-b md:border-line md:py-3 md:pr-5 md:pl-2 md:text-right md:text-[13px] md:whitespace-nowrap md:before:content-none ${
                        i % 2 === 1 ? "md:bg-bg-tint/50" : ""
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
          <div className="mt-7 rounded-2xl border-2 border-accent/25 bg-accent/5 p-5 sm:p-7">
            <h3 className="mb-2.5 flex items-center gap-2 text-[16px] font-bold text-navy">
              <BadgePercentIcon className="text-accent" />
              Ưu đãi combo khi đặt từ 2 dịch vụ trở lên
            </h3>
            <p className="text-[14px] leading-relaxed text-body-text">{COMBO_DISCOUNT_RULE}</p>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <LeadFormButton service="Thành lập doanh nghiệp" variant="primary">
            Nhận tư vấn miễn phí
          </LeadFormButton>
          {/* Mở công cụ Báo giá tổng hợp với loại "Dịch vụ pháp lý sửa đổi" chọn sẵn (?loai=sua-doi). */}
          <Button href="/tien-ich/tao-bao-gia-tong-hop?loai=sua-doi" variant="ghost">
            Tạo báo giá dịch vụ sửa đổi
          </Button>
        </div>
      </div>
    </section>
  );
}
