import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import SectionHead from "@/components/SectionHead";
import ChecklistList, { type ChecklistGroup } from "@/components/ChecklistList";
import PrintPdfButton from "@/components/PrintPdfButton";
import { ClockIcon, CheckCircleIcon, DocumentCheckIcon, HeadsetIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Checklist Thay Đổi Giấy Phép Kinh Doanh — Tải PDF | MAX OFFICE",
  description:
    "Checklist các bước khi thay đổi nội dung giấy phép kinh doanh: đổi tên, đổi địa chỉ, đổi ngành nghề, đổi vốn điều lệ — tick từng mục, tải PDF miễn phí.",
};

const CHECKLIST_GROUPS: ChecklistGroup[] = [
  {
    groupTitle: "Giai đoạn 1: Xác định nội dung cần thay đổi",
    items: [
      "Xác định rõ nội dung cần thay đổi: tên doanh nghiệp, địa chỉ trụ sở, ngành nghề kinh doanh, vốn điều lệ, người đại diện pháp luật...",
      "Rà soát điều kiện liên quan đến nội dung thay đổi (ví dụ: ngành nghề có điều kiện, ảnh hưởng đến nghĩa vụ thuế khi đổi vốn điều lệ)",
      "Kiểm tra tên mới hoặc địa chỉ mới (nếu có) để tránh trùng lặp, gây nhầm lẫn",
    ],
  },
  {
    groupTitle: "Giai đoạn 2: Soạn và nộp hồ sơ",
    items: [
      "Chuẩn bị biên bản/quyết định của chủ sở hữu, hội đồng thành viên hoặc đại hội đồng cổ đông về nội dung thay đổi",
      "Soạn thông báo thay đổi nội dung đăng ký doanh nghiệp tương ứng",
      "Nộp hồ sơ thay đổi tại cơ quan đăng ký kinh doanh",
      "Theo dõi hồ sơ và bổ sung nếu cơ quan đăng ký yêu cầu",
    ],
  },
  {
    groupTitle: "Giai đoạn 3: Sau khi có kết quả",
    items: [
      "Nhận Giấy chứng nhận đăng ký doanh nghiệp mới (đã cập nhật nội dung thay đổi)",
      "Khắc lại con dấu (nếu thay đổi tên doanh nghiệp)",
      "Cập nhật thông tin với cơ quan thuế, ngân hàng và các đối tác liên quan",
      "Thông báo thay đổi tới khách hàng, đối tác nếu cần thiết",
    ],
  },
  {
    groupTitle: "Lưu ý quan trọng",
    items: [
      "Mỗi loại thay đổi có hồ sơ và điều kiện riêng — liên hệ MAX OFFICE để được tư vấn chính xác theo đúng nội dung bạn muốn thay đổi.",
    ],
  },
];

const BENEFITS = [
  { icon: ClockIcon, title: "Tiết kiệm thời gian", desc: "Nắm rõ các bước cần làm cho từng loại thay đổi, không bỏ sót thủ tục." },
  { icon: CheckCircleIcon, title: "Đúng trình tự thực tế", desc: "Checklist theo đúng quy trình MAX OFFICE đang tư vấn cho khách hàng." },
  { icon: DocumentCheckIcon, title: "Tải về dễ dàng", desc: "Xuất file PDF để lưu lại và theo dõi ngoại tuyến." },
  { icon: HeadsetIcon, title: "Hỗ trợ khi cần", desc: "Liên hệ MAX OFFICE bất kỳ lúc nào nếu có bước chưa rõ." },
];

const RELATED_SERVICES = [
  { slug: "thanh-lap-doanh-nghiep", name: "Thành lập doanh nghiệp", desc: "Từ 1.299.000đ kèm Văn phòng ảo" },
  { slug: "ke-toan-thue", name: "Kế toán & thuế", desc: "Từ 800.000đ/tháng" },
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
];

const FAQS = [
  { q: "Thay đổi giấy phép kinh doanh mất bao lâu?", a: "Thời gian xử lý tuỳ nội dung thay đổi và cơ quan đăng ký kinh doanh. MAX OFFICE sẽ hỗ trợ chuẩn bị hồ sơ và theo dõi tiến độ xuyên suốt." },
  { q: "Đổi địa chỉ công ty có cần đổi con dấu không?", a: "Không nhất thiết, trừ khi con dấu có in địa chỉ cũ. Đổi tên doanh nghiệp thường mới cần khắc lại con dấu." },
  { q: "Đổi vốn điều lệ có ảnh hưởng gì đến thuế không?", a: "Có thể ảnh hưởng đến một số nghĩa vụ liên quan — liên hệ MAX OFFICE để được tư vấn cụ thể theo tình huống của doanh nghiệp bạn." },
  { q: "Tôi có thể thay đổi nhiều nội dung cùng lúc không?", a: "Có thể, tuỳ quy định hiện hành cho từng loại thay đổi. MAX OFFICE sẽ tư vấn cách gộp hồ sơ hợp lý nhất để tiết kiệm thời gian." },
  { q: "Tôi có thể tải checklist này về để lưu không?", a: "Có. Bấm nút \"Tải PDF\" ở đầu danh sách để lưu checklist dưới dạng PDF." },
];

export default function ChecklistThayDoiGiayPhepPage() {
  return (
    <ToolPageTemplate
      heroTitle="Checklist thay đổi giấy phép kinh doanh"
      heroDescription="Danh sách các bước khi thay đổi nội dung giấy phép kinh doanh: đổi tên, đổi địa chỉ, đổi ngành nghề, đổi vốn điều lệ — tick từng mục hoặc tải PDF để lưu lại."
      breadcrumbLabel="Checklist thay đổi giấy phép"
      benefitsTitle="Vì sao nên dùng checklist này"
      benefits={BENEFITS}
      relatedServices={RELATED_SERVICES}
      faqTopic="thay đổi giấy phép kinh doanh"
      faqs={FAQS}
      defaultService="Thành lập doanh nghiệp"
    >
      <section className="py-9">
        <div className="mx-auto max-w-[900px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Checklist miễn phí"
            title="Các bước cần chuẩn bị"
            description="Tick từng mục khi hoàn thành, hoặc tải về PDF để lưu lại và theo dõi ngoại tuyến."
          />
          <div className="mb-7 flex justify-center">
            <PrintPdfButton />
          </div>
          <ChecklistList groups={CHECKLIST_GROUPS} />
        </div>
      </section>
    </ToolPageTemplate>
  );
}
