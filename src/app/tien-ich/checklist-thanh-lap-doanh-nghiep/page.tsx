import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import SectionHead from "@/components/SectionHead";
import ChecklistList, { type ChecklistGroup } from "@/components/ChecklistList";
import PrintPdfButton from "@/components/PrintPdfButton";
import BrandIcon from "@/components/BrandIcon";
import { ClockIcon, CheckCircleIcon, DocumentCheckIcon, HeadsetIcon } from "@/components/icons";

export const metadata: Metadata = {
  alternates: { canonical: "/tien-ich/checklist-thanh-lap-doanh-nghiep" },
  title: "Checklist Thành Lập Doanh Nghiệp — Tải PDF Miễn Phí | MAX OFFICE",
  description:
    "Checklist đầy đủ các bước và giấy tờ cần chuẩn bị khi thành lập Hộ kinh doanh, Công ty TNHH hoặc Công ty Cổ phần — tick từng mục, tải PDF miễn phí.",
};

const CHECKLIST_GROUPS: ChecklistGroup[] = [
  {
    groupTitle: "1. Hồ sơ thành lập Công ty Cổ phần",
    items: [
      "Tên công ty:",
      "Địa chỉ:",
      "Ngành nghề kinh doanh:",
      "Chọn ngành chính (tích dấu X vào ngành chính)",
      "Vốn điều lệ:",
      "Hình chụp VNeID của các cổ đông (Lưu ý: tối thiểu 3 cổ đông; chụp thấy rõ ngày cấp CCCD)",
      "SĐT đăng ký:",
      "Email: (nếu có)",
      "Website: (nếu có)",
    ],
  },
  {
    groupTitle: "2. Hồ sơ thành lập Công ty TNHH 2 thành viên trở lên",
    items: [
      "Tên công ty:",
      "Địa chỉ:",
      "Ngành nghề kinh doanh:",
      "Chọn ngành chính (tích dấu X vào ngành chính)",
      "Vốn điều lệ:",
      "Hình chụp VNeID của các thành viên (Lưu ý: tối thiểu 2 thành viên; chụp thấy rõ ngày cấp CCCD)",
      "SĐT đăng ký:",
      "Email: (nếu có)",
      "Website: (nếu có)",
    ],
  },
  {
    groupTitle: "3. Hồ sơ thành lập Công ty TNHH 1 thành viên",
    items: [
      "Tên công ty:",
      "Địa chỉ:",
      "Ngành nghề kinh doanh:",
      "Chọn ngành nghề kinh doanh chính",
      "Vốn điều lệ:",
      "Hình chụp VNeID (Lưu ý: chụp thấy rõ ngày cấp CCCD)",
      "SĐT đăng ký:",
      "Email: (nếu có)",
      "Website: (nếu có)",
    ],
  },
  {
    groupTitle: "4. Hồ sơ thành lập Hộ kinh doanh",
    items: [
      "Tên hộ kinh doanh:",
      "Địa chỉ:",
      "Số điện thoại:",
      "Email:",
      "Ngành nghề kinh doanh:",
      "Chọn ngành nghề kinh doanh chính",
      "Vốn kinh doanh:",
      "Hình chụp VNeID:",
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
  { slug: "thanh-lap-doanh-nghiep", name: "Thành lập doanh nghiệp", desc: "Từ 1.299.000đ kèm Văn phòng ảo" },
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
  { slug: "ke-toan-thue", name: "Kế toán & thuế", desc: "Từ 500.000đ/tháng" },
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
      heroImage="/images/thanh-lap-doanh-nghiep.jpg"
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
          <ChecklistList groups={CHECKLIST_GROUPS} showProgress={false} />
          <div className="mt-9 rounded-2xl bg-bg-tint p-6 text-center sm:p-8">
            <p className="mx-auto max-w-[640px] text-[14.5px] leading-relaxed text-ink">
              Trên là một số thông tin cần chuẩn bị. Nếu sử dụng dịch vụ Thành lập doanh nghiệp của MAX OFFICE, sau khi
              chuẩn bị đủ, bạn gửi qua Zalo để MAX OFFICE lên hồ sơ cho bạn.
            </p>
            <a
              href="https://zalo.me/0898082188"
              target="_blank"
              rel="noopener"
              className="mt-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0068FF] print:hidden px-7 py-3.5 text-[15px] font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,104,255,0.3)]"
            >
              <BrandIcon type="zalo" className="h-6 w-6" />
              Gửi hồ sơ qua Zalo
            </a>
          </div>
        </div>
      </section>
    </ToolPageTemplate>
  );
}
