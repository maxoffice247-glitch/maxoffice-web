import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import SectionHead from "@/components/SectionHead";
import CompanyRegistrationForm from "@/components/tools/CompanyRegistrationForm";
import { ClockIcon, CheckCircleIcon, DocumentCheckIcon, HeadsetIcon } from "@/components/icons";
import { REGISTRATION_CONFIG, REGISTRATION_TYPES } from "@/lib/companyRegistration";
import { getBranchAddressGroups } from "@/lib/branchAddress";
import { SITE_NAME } from "@/lib/siteConfig";

const PAGE_PATH = "/tien-ich/checklist-thanh-lap-doanh-nghiep";
const PAGE_DESCRIPTION =
  "Chọn loại hình (Công ty Cổ phần, TNHH 2 thành viên trở lên, TNHH 1 thành viên, Hộ kinh doanh), điền thông tin cần chuẩn bị và gửi hồ sơ để MAX OFFICE lên hồ sơ thành lập — miễn phí.";

export const metadata: Metadata = {
  alternates: { canonical: PAGE_PATH },
  title: "Checklist Thành Lập Doanh Nghiệp — Tải PDF Miễn Phí | MAX OFFICE",
  description: PAGE_DESCRIPTION,
  // Khai báo og:title/description/url (trang này có opengraph-image.tsx riêng
  // nên KHÔNG khai báo images ở đây). openGraph của page thay thế hẳn openGraph
  // của layout nên phải nhắc lại siteName/locale/type. url luôn trỏ về URL gốc —
  // các link ?loai=... dùng chung đúng 1 bộ thẻ này.
  openGraph: {
    title: "Hồ sơ thành lập doanh nghiệp | MAX OFFICE",
    description: PAGE_DESCRIPTION,
    url: PAGE_PATH,
    siteName: SITE_NAME,
    locale: "vi_VN",
    type: "website",
  },
};

const BENEFITS = [
  { icon: ClockIcon, title: "Tiết kiệm thời gian", desc: "Biết trước cần chuẩn bị gì cho đúng loại hình, không bỏ sót thông tin quan trọng." },
  { icon: CheckCircleIcon, title: "Đúng thông tin cần dùng", desc: "Các mục theo đúng thông tin MAX OFFICE dùng để lên hồ sơ thành lập cho khách hàng." },
  { icon: DocumentCheckIcon, title: "Gửi và lưu dễ dàng", desc: "Gửi hồ sơ trực tuyến cho MAX OFFICE hoặc xuất file PDF để lưu lại." },
  { icon: HeadsetIcon, title: "Hỗ trợ khi cần", desc: "Liên hệ MAX OFFICE bất kỳ lúc nào nếu có mục chưa rõ." },
];

const RELATED_SERVICES = [
  { slug: "thanh-lap-doanh-nghiep", name: "Thành lập doanh nghiệp", desc: "Từ 1.299.000đ kèm Văn phòng ảo" },
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
  { slug: "ke-toan-thue", name: "Kế toán & thuế", desc: "Từ 500.000đ/tháng" },
];

const FAQS = [
  { q: "Thành lập doanh nghiệp mất bao lâu?", a: "Thông thường vài ngày làm việc tuỳ loại hình và hồ sơ. MAX OFFICE sẽ hỗ trợ theo dõi tiến độ và thông báo kết quả sớm nhất." },
  { q: "Tôi có thể dùng địa chỉ văn phòng ảo để đăng ký kinh doanh không?", a: "Có. Địa chỉ văn phòng ảo tại MAX OFFICE hoàn toàn hợp lệ để đăng ký kinh doanh và đăng ký thuế." },
  { q: "Tôi gửi ảnh VNeID bằng cách nào?", a: "Sau khi bấm \"Gửi hồ sơ\", bấm \"Mở Zalo gửi ảnh VNeID\" để gửi ảnh qua Zalo hotline của MAX OFFICE. Vui lòng chụp thấy rõ ngày cấp CCCD và không nhập số CCCD vào form." },
  { q: "Cần tối thiểu bao nhiêu cổ đông hoặc thành viên?", a: "Công ty Cổ phần cần tối thiểu 3 cổ đông; Công ty TNHH 2 thành viên trở lên cần tối thiểu 2 thành viên; Công ty TNHH 1 thành viên chỉ có 1 chủ sở hữu. Mỗi người cần cung cấp ảnh VNeID." },
  { q: "Danh sách này có áp dụng cho mọi ngành nghề không?", a: "Đây là các thông tin chung cần có cho phần lớn trường hợp. Một số ngành nghề có điều kiện có thể cần thêm giấy phép con — MAX OFFICE sẽ tư vấn cụ thể sau khi nhận hồ sơ." },
  { q: "Tôi có thể tải nội dung đã điền về để lưu không?", a: "Có. Sau khi chọn loại hình và điền thông tin, bấm nút \"Tải PDF\" để lưu lại bản đã điền, hoặc bấm \"Sao chép nội dung\" sau khi gửi hồ sơ." },
];

export default function ChecklistThanhLapDoanhNghiepPage() {
  return (
    <ToolPageTemplate
      heroImage="/images/thanh-lap-doanh-nghiep.jpg"
      heroTitle="Checklist thành lập doanh nghiệp"
      heroDescription="Chọn loại hình doanh nghiệp, điền các thông tin cần chuẩn bị rồi gửi hồ sơ để MAX OFFICE lên hồ sơ thành lập cho bạn."
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
            eyebrow="Hồ sơ thành lập doanh nghiệp"
            title="Thông tin cần chuẩn bị"
            description="Chọn loại hình, điền thông tin rồi gửi cho MAX OFFICE — hoặc tải về PDF để lưu lại."
          />
          <div className="mb-8 rounded-2xl bg-bg-tint p-5 text-[14.5px] leading-relaxed text-ink sm:p-6 print:hidden">
            <p className="mb-2.5">MAX OFFICE hỗ trợ lên hồ sơ thành lập cho 4 loại hình:</p>
            <ul className="list-disc space-y-1 pl-5">
              {REGISTRATION_TYPES.map((t) => (
                <li key={t}>{REGISTRATION_CONFIG[t].introText}</li>
              ))}
            </ul>
          </div>
          <CompanyRegistrationForm branchGroups={getBranchAddressGroups()} />
        </div>
      </section>
    </ToolPageTemplate>
  );
}
