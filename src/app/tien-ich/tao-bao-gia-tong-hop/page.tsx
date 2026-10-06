import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import CompositeQuoteTool from "@/components/tools/CompositeQuoteTool";
import { ClockIcon, WalletIcon, ShieldCheckIcon, HeadsetIcon } from "@/components/icons";
import { VIRTUAL_OFFICE_PLANS } from "@/lib/virtualOfficePlans";
import { AMENDMENT_SERVICES } from "@/lib/setupFees";
import { SERVICES_DATA } from "@/lib/servicesData";

// Số liệu trong FAQ lấy thẳng từ dữ liệu giá (cùng nguồn với công cụ) để không lệch khi bảng giá đổi.
const SIGNAGE_FEE = VIRTUAL_OFFICE_PLANS.lite.addOn;
const ACCOUNTING_PRICING = SERVICES_DATA["ke-toan-thue"].pricing;
const ACCOUNTING_TIER_COUNT = ACCOUNTING_PRICING.mode === "accounting" ? ACCOUNTING_PRICING.tiers.length : 0;
const ACCOUNTING_GROUP_COUNT = ACCOUNTING_PRICING.mode === "accounting" ? ACCOUNTING_PRICING.groups.length : 0;

export const metadata: Metadata = {
  alternates: { canonical: "/tien-ich/tao-bao-gia-tong-hop" },
  title: "Tạo Báo Giá Tổng Hợp Nhiều Dịch Vụ - Miễn Phí | MAX OFFICE",
  description:
    "Chọn nhiều dịch vụ MAX OFFICE cùng lúc (Văn phòng ảo, Thành lập doanh nghiệp, Kế toán & thuế...), xuất ra 1 ảnh báo giá tổng hợp duy nhất để gửi khách hàng.",
  // KHÔNG khai báo openGraph.images ở đây — dùng opengraph-image.tsx động
  // cùng thư mục (renderOgImage()), cùng quy ước với mọi trang /tien-ich/*
  // khác (xem giải thích tại src/app/tien-ich/page.tsx).
};

const BENEFITS = [
  { icon: ClockIcon, title: "Gộp nhiều dịch vụ trong 1 ảnh", desc: "Không cần chụp/ghép nhiều ảnh báo giá riêng lẻ khi khách quan tâm từ 2 dịch vụ trở lên." },
  { icon: ShieldCheckIcon, title: "Giá luôn khớp bảng giá mới nhất", desc: "Văn phòng ảo, Thành lập doanh nghiệp và Kế toán & thuế được hệ thống tự tra giá, không gõ tay nên không lo sai lệch." },
  { icon: WalletIcon, title: "Rõ ràng theo từng đơn vị tính phí", desc: "Ảnh xuất ra tách riêng chi phí thuê Văn phòng ảo, hàng tháng, một lần, theo giờ và khoản thu hộ — khách nhìn là biết khoản nào tính theo đơn vị nào." },
  { icon: HeadsetIcon, title: "Không lưu trữ thông tin khách hàng", desc: "Tên, số điện thoại, tên công ty dự kiến chỉ dùng để in lên ảnh báo giá, không được gửi hay lưu vào bất kỳ hệ thống nào." },
];

const RELATED_SERVICES = [
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
  { slug: "thanh-lap-doanh-nghiep", name: "Thành lập doanh nghiệp", desc: "Từ 1.299.000đ kèm Văn phòng ảo" },
  { slug: "ke-toan-thue", name: "Kế toán & thuế", desc: "Từ 500.000đ/tháng" },
  { slug: "van-phong-tron-goi", name: "Văn phòng trọn gói", desc: "Từ 4.500.000đ/tháng" },
];

const FAQS = [
  {
    q: "Công cụ này dùng để làm gì?",
    a: "Dùng khi khách hàng quan tâm từ 2 dịch vụ trở lên cùng lúc (VD: thuê Văn phòng ảo và cần luôn dịch vụ Thành lập doanh nghiệp) — thay vì tạo 2-3 ảnh báo giá riêng lẻ cho từng dịch vụ, công cụ gộp tất cả vào 1 ảnh duy nhất để gửi khách.",
  },
  {
    q: "Giá hiển thị trên ảnh báo giá có chính xác không?",
    a: "Với Văn phòng ảo, Thành lập doanh nghiệp, Dịch vụ pháp lý sửa đổi, Kế toán & thuế, Chữ ký số và Hoá đơn điện tử, giá được hệ thống tự tra theo đúng bảng giá đang áp dụng — không thể chỉnh sửa tay. Với Văn phòng trọn gói, Chỗ ngồi linh động, Phòng họp theo giờ (chưa có bảng giá cố định theo gói) và Dịch vụ khác, người tạo báo giá tự nhập giá đã thống nhất với khách.",
  },
  {
    q: "Ảnh báo giá có dòng tổng cộng không?",
    a: "Có. Mỗi nhóm chi phí (thuê Văn phòng ảo, hàng tháng, một lần, theo giờ) có dòng tổng riêng khi nhóm đó có từ 2 dịch vụ trở lên. Khi báo giá chỉ có dịch vụ MAX OFFICE và từ 2 dịch vụ trở lên, ảnh thêm ô \"Tổng cộng toàn bộ báo giá\" (đã gồm VAT) cộng tất cả các dịch vụ đó; dịch vụ nhập giá chưa tách được số (VD \"Liên hệ báo giá\") không được cộng và có ghi chú ngay dưới ô tổng. Riêng Chữ ký số và Hoá đơn điện tử là khoản MAX OFFICE thu hộ nên tách thành nhóm riêng. Khi báo giá có cả dịch vụ MAX OFFICE lẫn dịch vụ thu hộ, ảnh chỉ có một ô tổng \"Tổng toàn bộ báo giá MAX OFFICE và thu hộ\" (đã gồm VAT, cộng cả hai nhóm), số tiền bằng chữ nằm ngay trong ô, kèm hai dòng nhỏ ghi số tiền chuyển vào tài khoản công ty và vào tài khoản thu hộ.",
  },
  {
    q: "Mã QR trên ảnh báo giá hoạt động thế nào?",
    a: "Bật ô \"Hiện mã QR chuyển khoản\": ảnh có mã QR VietQR của tài khoản công ty (chọn từ danh sách có sẵn), điền sẵn số tiền tổng các dịch vụ MAX OFFICE; nội dung chuyển khoản tự gợi ý theo thông tin khách và sửa được. Nếu báo giá có Chữ ký số hoặc Hoá đơn điện tử, ảnh thêm mã QR thứ hai cho tài khoản thu hộ với số tiền của nhóm đó, vì khoản này không chuyển vào tài khoản công ty.",
  },
  {
    q: "Tính năng đặt cọc trong báo giá dùng như thế nào?",
    a: "Khi báo giá có dịch vụ MAX OFFICE, bật ô \"Khách đặt cọc trước\" rồi nhập số tiền cọc (hoặc bấm 30% / 50% tổng các dịch vụ MAX OFFICE). Ảnh đợt 1 ghi số tiền đặt cọc kèm mã QR chuyển vào tài khoản công ty, số tiền khách thanh toán đủ và khoản hoàn lại tiền đặt cọc. Ảnh đợt 2 dùng sau khi khách đã đặt cọc: ghi \"Đã đặt cọc\" và số cần thanh toán đủ, mã QR như báo giá thường. Tiền cọc không trừ vào tổng. Thời điểm thanh toán đủ và điều kiện hoàn cọc ghi trên ảnh là câu có sẵn, người tạo báo giá sửa được. Cọc chỉ tính trên nhóm dịch vụ MAX OFFICE (không áp dụng cho Chữ ký số và Hoá đơn điện tử), phải lớn hơn 0 và nhỏ hơn tổng nhóm đó.",
  },
  {
    q: "Phí bảng hiệu của gói LITE có được tính trong báo giá không?",
    a: `Có. Gói LITE chưa gồm bảng hiệu công ty — phí ${SIGNAGE_FEE?.price.toLocaleString("vi-VN")}đ, ${SIGNAGE_FEE ? SIGNAGE_FEE.note.charAt(0).toLowerCase() + SIGNAGE_FEE.note.slice(1) : ""}. Khi chọn gói LITE, form có ô \"Có làm bảng hiệu công ty\" (mặc định tích): ảnh ghi thêm một dòng phí bảng hiệu và cộng vào tạm tính, VAT và thành tiền của dòng Văn phòng ảo. Bỏ tích khi khách gia hạn hoặc đã có bảng hiệu. Phí này không nhân với số tháng và không nằm trong ưu đãi tặng tháng khi ký dài hạn (ưu đãi chỉ áp cho tiền thuê).`,
  },
  {
    q: "Dịch vụ pháp lý sửa đổi có tính ưu đãi combo không?",
    a: "Bạn tích các dịch vụ sửa đổi cần báo giá (chọn được nhiều dịch vụ). Ô \"Áp dụng ưu đãi combo\" mặc định tắt: mọi dịch vụ tính theo giá gốc. Khi bật và chọn từ 2 dịch vụ trở lên, ảnh tính theo quy tắc combo đang áp dụng trên trang Dịch vụ pháp lý sửa đổi, gạch giá gốc của dịch vụ được giảm và ghi cả tổng giá gốc lẫn tạm tính sau combo. Mỗi báo giá chỉ có một dòng Dịch vụ pháp lý sửa đổi.",
  },
  {
    q: "Kế toán & thuế có tính được phụ phí không?",
    a: "Có. Ngoài nhóm loại hình và số hoá đơn mỗi quý, form cho tích thêm các khoản phụ phí đang hiển thị trên trang Kế toán & thuế: tờ khai hải quan (nhập số tờ khai), xuất hoá đơn hộ (tính theo tháng) và báo cáo tài chính (nhập số năm). Khoản tính theo tháng nằm cùng thẻ phí hàng tháng; các khoản còn lại thành một thẻ phụ phí trong nhóm \"Chi phí một lần\". Riêng dòng Nhóm A của tờ khai hải quan chưa có đơn giá cố định nên không tính được trong công cụ.",
  },
  {
    q: "Có tạo được ảnh bảng giá đầy đủ để gửi khách hỏi giá không?",
    a: `Có, với Dịch vụ pháp lý sửa đổi và Kế toán & thuế. Chọn loại dịch vụ rồi chọn \"Dạng ảnh: Bảng giá đầy đủ\": ảnh in toàn bộ bảng giá đang áp dụng (${AMENDMENT_SERVICES.length} dịch vụ sửa đổi kèm giá chưa VAT và đã gồm VAT; hoặc ${ACCOUNTING_TIER_COUNT} mức số hoá đơn × ${ACCOUNTING_GROUP_COUNT} nhóm loại hình của Kế toán & thuế cùng các khoản phụ phí kèm đơn vị tính), không có dòng tổng và mã QR; thông tin khách hàng là tuỳ chọn. Mỗi báo giá chỉ có một ảnh bảng giá.`,
  },
  {
    q: "Ảnh báo giá có bản tiếng Anh không?",
    a: "Có. Chọn \"Ngôn ngữ xuất báo giá: English\" trước khi tạo ảnh: nhãn, tên dịch vụ và các câu mô tả trên ảnh chuyển sang tiếng Anh, tiền hiển thị dạng VND. Tên chi nhánh, địa chỉ và nội dung nhập tay (tên khách, tên công ty, mô tả dịch vụ tự nhập...) giữ nguyên; dòng \"Bằng chữ\" chỉ có ở bản tiếng Việt. Form nhập liệu luôn bằng tiếng Việt.",
  },
  {
    q: "Thông tin khách hàng nhập vào có được lưu lại không?",
    a: "Không. Tên, số điện thoại và tên công ty dự kiến chỉ được dùng để in trực tiếp lên ảnh báo giá xuất ra — không có bước gửi hay lưu trữ nào vào hệ thống, khác hoàn toàn với form \"Nhận tư vấn miễn phí\" ở cuối trang.",
  },
  {
    q: "Ai có thể dùng công cụ này?",
    a: "Bất kỳ ai cần soạn báo giá nhiều dịch vụ MAX OFFICE cùng lúc — nhân viên tư vấn hoặc khách hàng tự tìm hiểu đều dùng được, không yêu cầu đăng nhập.",
  },
];

export default function TaoBaoGiaTongHopPage() {
  return (
    <ToolPageTemplate
      heroImage="/images/hero-bang-gia.jpg"
      heroTitle="Tạo báo giá tổng hợp"
      heroDescription="Chọn nhiều dịch vụ khác nhau, xuất ra 1 ảnh báo giá duy nhất để gửi khách hàng — không cần ghép nhiều ảnh báo giá riêng lẻ."
      breadcrumbLabel="Tạo báo giá tổng hợp"
      benefitsTitle="Vì sao nên dùng công cụ này"
      benefits={BENEFITS}
      relatedServices={RELATED_SERVICES}
      faqTopic="tạo báo giá tổng hợp nhiều dịch vụ"
      faqs={FAQS}
      defaultService="Khác"
    >
      <CompositeQuoteTool />
    </ToolPageTemplate>
  );
}
