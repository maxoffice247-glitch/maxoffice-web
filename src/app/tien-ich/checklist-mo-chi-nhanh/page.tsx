import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import SectionHead from "@/components/SectionHead";
import ChecklistList, { type ChecklistGroup } from "@/components/ChecklistList";
import PrintPdfButton from "@/components/PrintPdfButton";
import { ClockIcon, CheckCircleIcon, DocumentCheckIcon, HeadsetIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Checklist Mở Chi Nhánh Công Ty — Tải PDF Miễn Phí | MAX OFFICE",
  description:
    "Checklist đầy đủ các bước và giấy tờ cần chuẩn bị khi mở chi nhánh công ty — tick từng mục, tải PDF miễn phí, hỗ trợ bởi MAX OFFICE.",
};

const CHECKLIST_GROUPS: ChecklistGroup[] = [
  {
    groupTitle: "Giai đoạn 1: Chuẩn bị trước khi nộp hồ sơ",
    items: [
      "Xác định loại hình chi nhánh: hạch toán độc lập hoặc hạch toán phụ thuộc",
      "Xác định địa chỉ trụ sở chi nhánh — cần địa chỉ hợp lệ (có thể dùng văn phòng ảo)",
      "Xác định ngành nghề kinh doanh của chi nhánh (trong phạm vi ngành nghề công ty mẹ)",
      "Chọn và đặt tên chi nhánh theo đúng quy định",
      "Chuẩn bị bản sao CCCD/hộ chiếu của người đứng đầu chi nhánh",
    ],
  },
  {
    groupTitle: "Giai đoạn 2: Soạn và nộp hồ sơ",
    items: [
      "Soạn hồ sơ: quyết định và biên bản họp về việc thành lập chi nhánh, thông báo lập chi nhánh, quyết định bổ nhiệm người đứng đầu chi nhánh",
      "Nộp hồ sơ đăng ký hoạt động chi nhánh tại cơ quan đăng ký kinh doanh nơi đặt chi nhánh",
      "Theo dõi hồ sơ và bổ sung nếu cơ quan đăng ký yêu cầu",
    ],
  },
  {
    groupTitle: "Giai đoạn 3: Sau khi có giấy phép",
    items: [
      "Nhận Giấy chứng nhận đăng ký hoạt động chi nhánh",
      "Khắc dấu chi nhánh (nếu cần sử dụng con dấu riêng)",
      "Đăng ký thuế cho chi nhánh (mã số thuế phụ thuộc)",
      "Treo bảng hiệu tại trụ sở chi nhánh",
      "Thông báo phát hành hoá đơn điện tử cho chi nhánh (nếu hạch toán độc lập và có xuất hoá đơn)",
    ],
  },
  {
    groupTitle: "Lưu ý quan trọng",
    items: [
      "Thủ tục cụ thể có thể khác nhau tuỳ ngành nghề và tỉnh/thành nơi đặt chi nhánh — liên hệ MAX OFFICE để được hướng dẫn chi tiết theo đúng trường hợp của bạn.",
    ],
  },
];

const BENEFITS = [
  { icon: ClockIcon, title: "Tiết kiệm thời gian", desc: "Nắm rõ toàn bộ các bước cần làm khi mở rộng thêm chi nhánh." },
  { icon: CheckCircleIcon, title: "Đúng trình tự thực tế", desc: "Checklist theo đúng quy trình MAX OFFICE đang tư vấn cho khách hàng." },
  { icon: DocumentCheckIcon, title: "Tải về dễ dàng", desc: "Xuất file PDF để lưu lại và theo dõi ngoại tuyến." },
  { icon: HeadsetIcon, title: "Hỗ trợ khi cần", desc: "Liên hệ MAX OFFICE bất kỳ lúc nào nếu có bước chưa rõ." },
];

const RELATED_SERVICES = [
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
  { slug: "van-phong-tron-goi", name: "Văn phòng trọn gói", desc: "Từ 4.500.000đ/tháng" },
  { slug: "ke-toan-thue", name: "Kế toán & thuế", desc: "Từ 800.000đ/tháng" },
];

const FAQS = [
  { q: "Mở chi nhánh mất bao lâu?", a: "Thời gian xử lý tuỳ cơ quan đăng ký kinh doanh nơi đặt chi nhánh. MAX OFFICE sẽ hỗ trợ chuẩn bị hồ sơ và theo dõi tiến độ xuyên suốt." },
  { q: "Chi nhánh có cần địa chỉ riêng không?", a: "Có. Chi nhánh cần một địa chỉ trụ sở hợp lệ, có thể sử dụng dịch vụ văn phòng ảo tại địa điểm MAX OFFICE mong muốn." },
  { q: "Chi nhánh hạch toán độc lập và phụ thuộc khác nhau thế nào?", a: "Đây là hai hình thức kế toán khác nhau ảnh hưởng đến cách kê khai thuế của chi nhánh — liên hệ MAX OFFICE để được tư vấn lựa chọn phù hợp với mô hình kinh doanh của bạn." },
  { q: "Tôi có thể tải checklist này về để lưu không?", a: "Có. Bấm nút \"Tải PDF\" ở đầu danh sách để lưu checklist dưới dạng PDF." },
  { q: "Mở chi nhánh ở tỉnh/thành khác có khác gì không?", a: "Thủ tục có thể khác nhau tuỳ nơi đặt chi nhánh — liên hệ MAX OFFICE để được hướng dẫn chính xác theo địa điểm bạn dự định mở." },
];

export default function ChecklistMoChiNhanhPage() {
  return (
    <ToolPageTemplate
      heroTitle="Checklist mở chi nhánh công ty"
      heroDescription="Danh sách đầy đủ các bước và giấy tờ cần chuẩn bị khi mở chi nhánh công ty — tick từng mục hoặc tải PDF để lưu lại."
      breadcrumbLabel="Checklist mở chi nhánh"
      benefitsTitle="Vì sao nên dùng checklist này"
      benefits={BENEFITS}
      relatedServices={RELATED_SERVICES}
      faqTopic="mở chi nhánh công ty"
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
