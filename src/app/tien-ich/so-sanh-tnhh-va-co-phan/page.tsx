import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import SectionHead from "@/components/SectionHead";
import ComparisonTable, { type ComparisonTableRow } from "@/components/ComparisonTable";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { TagIcon, CheckCircleIcon, KeyIcon, TrendingUpIcon, HeadsetIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "So Sánh Công Ty TNHH & Công Ty Cổ Phần | MAX OFFICE",
  description:
    "So sánh Công ty TNHH và Công ty Cổ phần: số lượng thành viên/cổ đông, vốn điều lệ, cơ cấu quản lý và khả năng huy động vốn — giúp bạn chọn đúng loại hình.",
};

const ROWS: ComparisonTableRow[] = [
  {
    label: "Số lượng thành viên/cổ đông",
    left: "Tối thiểu 1, tối đa 50 thành viên",
    right: "Tối thiểu 3 cổ đông, không giới hạn số lượng tối đa",
  },
  {
    label: "Vốn điều lệ",
    left: "Không quy định mức tối thiểu cho hầu hết ngành nghề, trừ ngành nghề có điều kiện",
    right: "Không quy định mức tối thiểu cho hầu hết ngành nghề, trừ ngành nghề có điều kiện",
  },
  {
    label: "Cơ cấu quản lý",
    left: "Đơn giản hơn — Chủ sở hữu hoặc Hội đồng thành viên, Giám đốc/Tổng giám đốc",
    right: "Phức tạp hơn — Đại hội đồng cổ đông, Hội đồng quản trị, Giám đốc/Tổng giám đốc",
  },
  {
    label: "Khả năng huy động vốn",
    left: "Hạn chế hơn, không được phát hành cổ phần",
    right: "Linh hoạt hơn, có thể phát hành cổ phần để huy động vốn",
  },
  {
    label: "Phù hợp với",
    left: "Doanh nghiệp nhỏ và vừa, số lượng thành viên ít, muốn cơ cấu quản lý đơn giản",
    right: "Doanh nghiệp có kế hoạch mở rộng, gọi vốn từ nhiều nhà đầu tư",
  },
];

const BENEFITS = [
  { icon: TagIcon, title: "Thông tin chính xác", desc: "Nêu đúng khác biệt pháp lý và cơ cấu giữa hai loại hình theo quy định hiện hành." },
  { icon: CheckCircleIcon, title: "So sánh khách quan", desc: "Nêu rõ khác biệt về cơ cấu, vốn và khả năng huy động vốn để bạn tự quyết định." },
  { icon: HeadsetIcon, title: "Tư vấn thêm miễn phí", desc: "Chưa chắc chắn nên chọn loại hình nào? Liên hệ để được tư vấn theo đúng kế hoạch kinh doanh." },
];

const RELATED_SERVICES = [
  { slug: "thanh-lap-doanh-nghiep", name: "Thành lập doanh nghiệp", desc: "Từ 1.299.000đ kèm Văn phòng ảo" },
  { slug: "ke-toan-thue", name: "Kế toán & thuế", desc: "Từ 800.000đ/tháng" },
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
];

const FAQS = [
  { q: "Tôi có thể chuyển đổi từ TNHH sang Cổ phần sau này không?", a: "Có. Đây là một trong các dịch vụ pháp lý sửa đổi MAX OFFICE cung cấp — liên hệ để được tư vấn thủ tục khi bạn cần." },
  { q: "Công ty TNHH 1 thành viên và 2 thành viên khác nhau thế nào?", a: "Khác nhau về số lượng chủ sở hữu góp vốn — TNHH 1 thành viên chỉ có 1 chủ sở hữu, TNHH 2 thành viên trở lên có từ 2 đến 50 thành viên góp vốn." },
  { q: "Công ty Cổ phần có bắt buộc niêm yết chứng khoán không?", a: "Không. Công ty Cổ phần không bắt buộc niêm yết — chỉ niêm yết khi doanh nghiệp đủ điều kiện và có nhu cầu huy động vốn qua thị trường chứng khoán." },
  { q: "Chi phí thành lập giữa TNHH và Cổ phần có khác nhau không?", a: "Không. Chi phí thành lập được tính theo gói dịch vụ (Gói 1 hoặc Gói 2), áp dụng chung cho mọi loại hình doanh nghiệp — xem chi tiết tại công cụ Tính chi phí thành lập công ty hoặc trang Thành lập doanh nghiệp." },
];

export default function SoSanhTnhhCoPhanPage() {
  return (
    <ToolPageTemplate
      heroTitle="So sánh Công ty TNHH và Công ty Cổ phần"
      heroDescription="Bảng so sánh chi tiết vốn điều lệ, cơ cấu quản lý và khả năng huy động vốn để bạn chọn đúng loại hình doanh nghiệp."
      breadcrumbLabel="So sánh TNHH & Cổ phần"
      benefitsTitle="Vì sao nên tham khảo bảng so sánh này"
      benefits={BENEFITS}
      relatedServices={RELATED_SERVICES}
      faqTopic="công ty TNHH và công ty Cổ phần"
      faqs={FAQS}
      defaultService="Thành lập doanh nghiệp"
    >
      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Bảng so sánh"
            title="Công ty TNHH và Công ty Cổ phần khác nhau thế nào?"
            description="Đối chiếu trực tiếp từng tiêu chí để bạn dễ dàng chọn đúng loại hình doanh nghiệp. Chi phí thành lập không phân biệt loại hình — xem bảng giá theo gói dịch vụ tại trang Thành lập doanh nghiệp."
          />
          <ComparisonTable leftLabel="Công ty TNHH" rightLabel="Công ty Cổ phần" rows={ROWS} />
        </div>
      </section>

      <section className="bg-bg-tint py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Khuyến nghị"
            title="Nên chọn loại nào?"
            description="Gợi ý nhanh dựa trên kế hoạch phát triển của doanh nghiệp bạn."
          />
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <RevealItem>
              <div className="h-full rounded-2xl border border-line bg-white p-7">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-tint text-primary">
                  <KeyIcon className="h-6 w-6" />
                </span>
                <h3 className="mb-3 text-[18px] font-bold text-navy">Nên chọn Công ty TNHH nếu...</h3>
                <ul className="space-y-2 text-[14px] leading-relaxed text-body-text">
                  <li>• Bạn mới khởi nghiệp, số lượng thành viên góp vốn ít</li>
                  <li>• Bạn muốn cơ cấu quản lý đơn giản, dễ vận hành</li>
                  <li>• Chưa có kế hoạch huy động vốn từ nhiều nhà đầu tư</li>
                  <li>• Bạn ưu tiên quy trình thành lập gọn nhẹ</li>
                </ul>
              </div>
            </RevealItem>
            <RevealItem>
              <div className="h-full rounded-2xl border-2 border-primary bg-white p-7">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-tint text-primary">
                  <TrendingUpIcon className="h-6 w-6" />
                </span>
                <h3 className="mb-3 text-[18px] font-bold text-navy">Nên chọn Công ty Cổ phần nếu...</h3>
                <ul className="space-y-2 text-[14px] leading-relaxed text-body-text">
                  <li>• Bạn có kế hoạch mở rộng quy mô trong tương lai gần</li>
                  <li>• Bạn cần huy động vốn từ nhiều nhà đầu tư, cổ đông</li>
                  <li>• Doanh nghiệp của bạn có từ 3 cổ đông sáng lập trở lên</li>
                  <li>• Bạn hướng tới khả năng phát hành cổ phần trong tương lai</li>
                </ul>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>
    </ToolPageTemplate>
  );
}
