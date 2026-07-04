import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import SectionHead from "@/components/SectionHead";
import ComparisonTable, { type ComparisonTableRow } from "@/components/ComparisonTable";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import {
  TagIcon,
  CheckCircleIcon,
  BuildingIcon,
  ScreenIcon,
  HeadsetIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "So Sánh Văn Phòng Ảo & Văn Phòng Trọn Gói | MAX OFFICE",
  description:
    "So sánh chi tiết Văn phòng ảo (từ 299.000đ/tháng, 6 gói) và Văn phòng trọn gói (từ 4.500.000đ/tháng): tính năng, ưu nhược điểm, phù hợp với ai — giúp bạn chọn đúng gói.",
};

const ROWS: ComparisonTableRow[] = [
  { label: "Giá", left: "Từ 299.000đ/tháng (6 gói, tuỳ chi nhánh)", right: "Từ 4.500.000đ/tháng" },
  {
    label: "Không gian vật lý",
    left: "Không có — chỉ địa chỉ đăng ký, không có chỗ ngồi cố định",
    right: "Có không gian riêng, sẵn sàng làm việc ngay",
  },
  {
    label: "Nội thất & tiện ích",
    left: "Không bao gồm",
    right: "Đầy đủ: bàn ghế, tủ lưu trữ, internet tốc độ cao, khu vực tiếp khách",
  },
  {
    label: "Nhận thư & lễ tân",
    left: "Nhận thư hộ, thông báo qua Zalo/email",
    right: "Lễ tân trực tiếp tiếp đón khách hàng, đối tác",
  },
  {
    label: "Phòng họp",
    left: "Có thể thuê thêm theo giờ khi cần",
    right: "Có quyền sử dụng phòng họp dùng chung",
  },
  {
    label: "Phù hợp với",
    left: "Startup, freelancer, công ty mới chỉ cần địa chỉ đăng ký kinh doanh",
    right: "Đội nhóm cần nơi làm việc thực tế hàng ngày",
  },
  {
    label: "Tính linh hoạt hợp đồng",
    left: "Theo tháng hoặc theo năm, dễ điều chỉnh",
    right: "Theo tháng hoặc theo năm, dễ điều chỉnh",
  },
];

const BENEFITS = [
  { icon: TagIcon, title: "Dữ liệu giá chính xác", desc: "Đúng theo bảng giá hiện hành của MAX OFFICE, không phát sinh chi phí ẩn." },
  { icon: CheckCircleIcon, title: "So sánh khách quan", desc: "Nêu rõ ưu, nhược điểm từng gói để bạn tự quyết định phù hợp nhất." },
  { icon: HeadsetIcon, title: "Tư vấn thêm miễn phí", desc: "Chưa chắc chắn nên chọn gói nào? Liên hệ để được tư vấn theo đúng nhu cầu." },
];

const RELATED_SERVICES = [
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
  { slug: "van-phong-tron-goi", name: "Văn phòng trọn gói", desc: "Từ 4.500.000đ/tháng" },
  { slug: "cho-ngoi-linh-dong", name: "Chỗ ngồi linh động", desc: "Từ 2.000.000đ/tháng" },
];

const FAQS = [
  { q: "Văn phòng ảo có dùng để đăng ký kinh doanh được không?", a: "Có. Địa chỉ văn phòng ảo tại MAX OFFICE hoàn toàn hợp lệ để đăng ký kinh doanh và đăng ký thuế." },
  { q: "Tôi có thể bắt đầu bằng Văn phòng ảo rồi nâng cấp lên Trọn gói không?", a: "Có. Bạn có thể nâng cấp bất kỳ lúc nào khi đội ngũ phát triển và cần không gian làm việc thực tế." },
  { q: "Văn phòng trọn gói có yêu cầu hợp đồng dài hạn không?", a: "Không. Hợp đồng linh hoạt theo tháng hoặc theo năm tuỳ nhu cầu, không ràng buộc dài hạn." },
  { q: "Nếu đội của tôi chỉ 1-2 người thì nên chọn gói nào?", a: "Tuỳ nhu cầu: nếu chỉ cần địa chỉ đăng ký, Văn phòng ảo là đủ; nếu cần chỗ ngồi làm việc hàng ngày, có thể cân nhắc Chỗ ngồi linh động hoặc Văn phòng trọn gói." },
];

export default function SoSanhVanPhongAoTronGoiPage() {
  return (
    <ToolPageTemplate
      heroTitle="So sánh Văn phòng ảo và Văn phòng trọn gói"
      heroDescription="Bảng so sánh chi tiết tính năng, chi phí và đối tượng phù hợp giữa hai gói dịch vụ phổ biến nhất của MAX OFFICE."
      breadcrumbLabel="So sánh Văn phòng ảo & Trọn gói"
      benefitsTitle="Vì sao nên tham khảo bảng so sánh này"
      benefits={BENEFITS}
      relatedServices={RELATED_SERVICES}
      faqTopic="văn phòng ảo và văn phòng trọn gói"
      faqs={FAQS}
      defaultService="Tư vấn chung"
    >
      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Bảng so sánh"
            title="Văn phòng ảo và Văn phòng trọn gói khác nhau thế nào?"
            description="Đối chiếu trực tiếp từng tiêu chí để bạn dễ dàng chọn đúng gói dịch vụ."
          />
          <ComparisonTable leftLabel="Văn phòng ảo" rightLabel="Văn phòng trọn gói" rows={ROWS} />
        </div>
      </section>

      <section className="bg-bg-tint py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Khuyến nghị"
            title="Nên chọn loại nào?"
            description="Gợi ý nhanh dựa trên tình huống thực tế của doanh nghiệp bạn."
          />
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <RevealItem>
              <div className="h-full rounded-2xl border border-line bg-white p-7">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-tint text-primary">
                  <BuildingIcon className="h-6 w-6" />
                </span>
                <h3 className="mb-3 text-[18px] font-bold text-navy">Nên chọn Văn phòng ảo nếu...</h3>
                <ul className="space-y-2 text-[14px] leading-relaxed text-body-text">
                  <li>• Bạn mới bắt đầu kinh doanh, muốn tối ưu chi phí</li>
                  <li>• Bạn làm việc từ xa hoặc online, chưa cần chỗ ngồi cố định</li>
                  <li>• Bạn chỉ cần một địa chỉ hợp lệ để đăng ký kinh doanh</li>
                  <li>• Đội ngũ của bạn còn nhỏ (1-2 người) hoặc là freelancer</li>
                </ul>
              </div>
            </RevealItem>
            <RevealItem>
              <div className="h-full rounded-2xl border-2 border-primary bg-white p-7">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-tint text-primary">
                  <ScreenIcon className="h-6 w-6" />
                </span>
                <h3 className="mb-3 text-[18px] font-bold text-navy">Nên chọn Văn phòng trọn gói nếu...</h3>
                <ul className="space-y-2 text-[14px] leading-relaxed text-body-text">
                  <li>• Đội ngũ của bạn cần nơi làm việc thực tế hàng ngày</li>
                  <li>• Bạn thường xuyên tiếp khách hàng, đối tác trực tiếp</li>
                  <li>• Bạn muốn có không gian sẵn sàng sử dụng ngay, không tốn vốn đầu tư nội thất</li>
                  <li>• Bạn cần hình ảnh chuyên nghiệp cho đội ngũ đang mở rộng</li>
                </ul>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>
    </ToolPageTemplate>
  );
}
