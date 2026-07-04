import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import SectionHead from "@/components/SectionHead";
import ChecklistList, { type ChecklistGroup } from "@/components/ChecklistList";
import PrintPdfButton from "@/components/PrintPdfButton";
import { ClockIcon, CheckCircleIcon, DocumentCheckIcon, HeadsetIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Checklist Thành Lập Doanh Nghiệp — Tải PDF Miễn Phí | MAX OFFICE",
  description:
    "Checklist đầy đủ các bước và giấy tờ cần chuẩn bị khi thành lập Hộ kinh doanh, Công ty TNHH hoặc Công ty Cổ phần — tick từng mục, tải PDF miễn phí.",
};

const CHECKLIST_GROUPS: ChecklistGroup[] = [
  {
    groupTitle: "Giai đoạn 1: Chuẩn bị trước khi nộp hồ sơ",
    items: [
      "Xác định loại hình phù hợp: Hộ kinh doanh, Công ty TNHH hoặc Công ty Cổ phần",
      "Chọn và tra cứu tên doanh nghiệp dự kiến, tránh trùng hoặc gây nhầm lẫn",
      "Xác định địa chỉ trụ sở — cần địa chỉ đăng ký kinh doanh hợp lệ (có thể dùng văn phòng ảo)",
      "Xác định ngành nghề kinh doanh dự kiến đăng ký",
      "Dự kiến mức vốn điều lệ",
      "Chuẩn bị bản sao CCCD/hộ chiếu của chủ sở hữu, thành viên hoặc cổ đông sáng lập",
    ],
  },
  {
    groupTitle: "Giai đoạn 2: Soạn và nộp hồ sơ",
    items: [
      "Soạn hồ sơ đăng ký doanh nghiệp (giấy đề nghị đăng ký, điều lệ công ty, danh sách thành viên/cổ đông tuỳ loại hình)",
      "Nộp hồ sơ tại cơ quan đăng ký kinh doanh có thẩm quyền",
      "Theo dõi hồ sơ và bổ sung nếu cơ quan đăng ký yêu cầu",
    ],
  },
  {
    groupTitle: "Giai đoạn 3: Sau khi có giấy phép",
    items: [
      "Nhận Giấy chứng nhận đăng ký doanh nghiệp",
      "Khắc dấu doanh nghiệp",
      "Mở tài khoản ngân hàng doanh nghiệp",
      "Đăng ký thuế ban đầu",
      "Treo bảng hiệu tại trụ sở",
      "Thông báo phát hành hoá đơn điện tử (nếu cần xuất hoá đơn)",
    ],
  },
  {
    groupTitle: "Lưu ý quan trọng",
    items: [
      "Mỗi loại hình và ngành nghề có thể phát sinh yêu cầu hồ sơ khác nhau — liên hệ MAX OFFICE để được hướng dẫn chi tiết theo đúng trường hợp của bạn.",
    ],
  },
];

const BENEFITS = [
  { icon: ClockIcon, title: "Tiết kiệm thời gian", desc: "Nắm rõ toàn bộ các bước cần làm, không bỏ sót giấy tờ quan trọng." },
  { icon: CheckCircleIcon, title: "Đúng trình tự thực tế", desc: "Checklist theo đúng quy trình MAX OFFICE đang tư vấn cho khách hàng." },
  { icon: DocumentCheckIcon, title: "Tải về dễ dàng", desc: "Xuất file PDF để lưu lại và theo dõi ngoại tuyến." },
  { icon: HeadsetIcon, title: "Hỗ trợ khi cần", desc: "Liên hệ MAX OFFICE bất kỳ lúc nào nếu có bước chưa rõ." },
];

const RELATED_SERVICES = [
  { slug: "thanh-lap-doanh-nghiep", name: "Thành lập doanh nghiệp", desc: "Từ 800.000đ kèm Văn phòng ảo" },
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
  { slug: "ke-toan-thue", name: "Kế toán & thuế", desc: "Từ 800.000đ/tháng" },
];

const FAQS = [
  { q: "Thành lập doanh nghiệp mất bao lâu?", a: "Thông thường vài ngày làm việc tuỳ loại hình và hồ sơ. MAX OFFICE sẽ hỗ trợ theo dõi tiến độ và thông báo kết quả sớm nhất." },
  { q: "Tôi có thể dùng địa chỉ văn phòng ảo để đăng ký kinh doanh không?", a: "Có. Địa chỉ văn phòng ảo tại MAX OFFICE hoàn toàn hợp lệ để đăng ký kinh doanh và đăng ký thuế." },
  { q: "Checklist này có áp dụng cho mọi ngành nghề không?", a: "Đây là checklist các bước chung cho phần lớn trường hợp. Một số ngành nghề có điều kiện có thể cần thêm giấy phép con — liên hệ MAX OFFICE để được tư vấn cụ thể." },
  { q: "Tôi có thể tải checklist này về để lưu không?", a: "Có. Bấm nút \"Tải PDF\" ở đầu danh sách để lưu checklist dưới dạng PDF." },
  { q: "Sau khi có giấy phép, tôi cần làm gì tiếp theo?", a: "Bạn cần khắc dấu, mở tài khoản ngân hàng và đăng ký thuế ban đầu — MAX OFFICE có thể hỗ trợ trọn gói các bước này." },
];

export default function ChecklistThanhLapDoanhNghiepPage() {
  return (
    <ToolPageTemplate
      heroTitle="Checklist thành lập doanh nghiệp"
      heroDescription="Danh sách đầy đủ các bước và giấy tờ cần chuẩn bị khi thành lập Hộ kinh doanh, Công ty TNHH hoặc Công ty Cổ phần — tick từng mục hoặc tải PDF để lưu lại."
      breadcrumbLabel="Checklist thành lập doanh nghiệp"
      benefitsTitle="Vì sao nên dùng checklist này"
      benefits={BENEFITS}
      relatedServices={RELATED_SERVICES}
      faqTopic="checklist thành lập doanh nghiệp"
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
