import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHead from "@/components/SectionHead";
import ServiceBenefits, { type BenefitItem } from "@/components/ServiceBenefits";
import Faq, { type FaqItem } from "@/components/Faq";
import BookingFormLayout from "@/components/BookingFormLayout";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";
import {
  ScaleIcon,
  BadgePercentIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowRightSmallIcon,
} from "@/components/icons";
import { AMENDMENT_SERVICES, COMBO_DISCOUNT_RULE } from "@/lib/setupFees";
import { SITE_URL } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Dịch Vụ Pháp Lý Sửa Đổi Doanh Nghiệp - Bảng Giá Chi Tiết | MAX OFFICE",
  description:
    "Thay đổi tên công ty, địa chỉ, đại diện pháp luật, tăng vốn điều lệ, bổ sung ngành nghề... Bảng giá minh bạch, ưu đãi combo khi đặt từ 2 dịch vụ trở lên.",
};

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

const BENEFITS: BenefitItem[] = [
  {
    icon: ScaleIcon,
    title: "13 dịch vụ sửa đổi phổ biến",
    desc: "Từ đổi tên, đổi địa chỉ, đổi đại diện pháp luật đến tăng vốn điều lệ và chuyển đổi loại hình — đầy đủ trong một bảng giá.",
  },
  {
    icon: BadgePercentIcon,
    title: "Ưu đãi combo rõ ràng",
    desc: "Đặt từ 2 dịch vụ trở lên cùng lúc, các dịch vụ ngoài dịch vụ giá trị lớn nhất tự động được giảm giá.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Áp dụng chung mọi loại hình",
    desc: "Giá không phân biệt Hộ kinh doanh, Công ty TNHH hay Công ty Cổ phần.",
  },
  {
    icon: ClockIcon,
    title: "Thời gian xử lý nhanh",
    desc: "Phần lớn dịch vụ hoàn tất trong 3-7 ngày làm việc, MAX OFFICE theo dõi hồ sơ xuyên suốt.",
  },
];

const FAQS: FaqItem[] = [
  {
    q: "Ưu đãi combo hoạt động như thế nào?",
    a: "Khi bạn đặt từ 2 dịch vụ sửa đổi trở lên cùng lúc: dịch vụ có giá trị lớn nhất tính giá đầy đủ theo bảng giá; các dịch vụ còn lại được giảm — nếu giá gốc trên 500.000đ thì giảm còn 500.000đ, nếu giá gốc từ 500.000đ trở xuống thì giảm còn 300.000đ.",
  },
  {
    q: "Tôi có thể đặt cùng lúc 3-4 dịch vụ sửa đổi không?",
    a: "Có. Ưu đãi combo áp dụng cho mọi số lượng dịch vụ từ 2 trở lên — chỉ dịch vụ giá trị lớn nhất tính giá đầy đủ, tất cả các dịch vụ còn lại đều được giảm giá theo quy tắc trên.",
  },
  {
    q: "Giá dịch vụ sửa đổi có khác nhau giữa các loại hình doanh nghiệp không?",
    a: "Không. Bảng giá áp dụng chung cho Hộ kinh doanh, Công ty TNHH và Công ty Cổ phần.",
  },
  {
    q: "Thời gian xử lý có thể nhanh hơn thời gian niêm yết không?",
    a: "Thời gian niêm yết là thời gian xử lý tiêu chuẩn. Một số trường hợp có thể nhanh hơn tuỳ hồ sơ và cơ quan đăng ký — liên hệ MAX OFFICE để được tư vấn cụ thể.",
  },
  {
    q: "Tôi cần chuẩn bị giấy tờ gì cho từng loại thay đổi?",
    a: "Mỗi loại thay đổi có yêu cầu hồ sơ riêng (ví dụ: cần CCCD mới khi cập nhật CCCD, cần biên bản họp khi tăng vốn điều lệ). MAX OFFICE sẽ tư vấn chính xác theo đúng nội dung bạn cần thay đổi.",
  },
  {
    q: "Có công cụ nào giúp tôi ước tính tổng chi phí trước không?",
    a: "Có. Bạn có thể dùng công cụ Tính chi phí thành lập công ty — chọn thêm các dịch vụ sửa đổi cần thiết để xem tổng chi phí đã áp dụng ưu đãi combo.",
  },
];

const amendmentSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Dịch vụ pháp lý sửa đổi doanh nghiệp",
  name: "Dịch vụ pháp lý sửa đổi doanh nghiệp",
  description: metadata.description,
  provider: { "@type": "Organization", name: "MAX OFFICE" },
  url: `${SITE_URL}/dich-vu/dich-vu-phap-ly-sua-doi`,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Dịch vụ pháp lý sửa đổi",
    itemListElement: AMENDMENT_SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name },
      price: s.price,
      priceCurrency: "VND",
    })),
  },
};

export default function DichVuPhapLySuaDoiPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(amendmentSchema) }}
      />

      <PageHero
        image="/images/thanh-lap-doanh-nghiep.jpg"
        eyebrow="Dịch vụ"
        title="Dịch vụ pháp lý sửa đổi doanh nghiệp"
        description="Thay đổi tên công ty, địa chỉ, đại diện pháp luật, vốn điều lệ, ngành nghề... Bảng giá minh bạch, ưu đãi combo khi đặt từ 2 dịch vụ trở lên."
      />
      <Breadcrumb
        items={[
          { label: "Dịch vụ", href: "/dich-vu" },
          { label: "Thành lập doanh nghiệp", href: "/services/thanh-lap-doanh-nghiep" },
          { label: "Dịch vụ pháp lý sửa đổi" },
        ]}
      />

      <section className="py-9">
        <div className="mx-auto max-w-[1000px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Bảng giá"
            title="13 dịch vụ pháp lý sửa đổi phổ biến"
            description="Áp dụng chung cho Hộ kinh doanh, Công ty TNHH và Công ty Cổ phần — không phân biệt loại hình."
          />
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
              <table className="w-full border-collapse text-left text-[14px]">
                <thead>
                  <tr className="bg-bg-tint text-[13px] font-bold text-navy">
                    <th className="px-5 py-4">Dịch vụ</th>
                    <th className="px-5 py-4 whitespace-nowrap">Giá</th>
                    <th className="px-5 py-4 whitespace-nowrap">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {AMENDMENT_SERVICES.map((s, i) => (
                    <tr
                      key={s.slug}
                      className={`border-t border-line ${i % 2 === 1 ? "bg-bg-tint/50" : ""}`}
                    >
                      <td className="px-5 py-4 font-medium text-navy">{s.name}</td>
                      <td className="px-5 py-4 font-bold whitespace-nowrap text-primary">
                        {formatVND(s.price)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-body-text">
                        {s.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-7 rounded-2xl border-2 border-accent/25 bg-accent/5 p-6 sm:p-7">
              <h3 className="mb-2.5 flex items-center gap-2 text-[16px] font-bold text-navy">
                <BadgePercentIcon className="text-accent" />
                Ưu đãi combo khi đặt từ 2 dịch vụ trở lên
              </h3>
              <p className="mb-3 text-[14px] leading-relaxed text-body-text">
                {COMBO_DISCOUNT_RULE}
              </p>
              <p className="text-[13px] leading-relaxed text-body-text/80">
                Ví dụ: đặt cùng lúc &quot;Thay đổi tên công ty&quot; (700.000đ) và &quot;Cập nhật CCCD&quot; (500.000đ)
                — dịch vụ đổi tên (giá trị lớn nhất) tính đủ 700.000đ, dịch vụ cập nhật CCCD giảm còn 300.000đ.
                Tổng cộng: 1.000.000đ thay vì 1.200.000đ.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/tien-ich/tinh-chi-phi-thanh-lap"
                className="group inline-flex items-center gap-1.5 text-[14px] font-bold text-accent"
              >
                Dùng công cụ tính chi phí (áp dụng đúng ưu đãi combo)
                <ArrowRightSmallIcon className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/services/thanh-lap-doanh-nghiep"
                className="group inline-flex items-center gap-1.5 text-[14px] font-bold text-navy"
              >
                Xem dịch vụ thành lập doanh nghiệp
                <ArrowRightSmallIcon className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <ServiceBenefits
        title="Vì sao chọn MAX OFFICE cho dịch vụ sửa đổi"
        items={BENEFITS}
      />

      <Faq
        title="Câu hỏi thường gặp"
        description="Giải đáp thắc mắc phổ biến về dịch vụ pháp lý sửa đổi doanh nghiệp."
        items={FAQS}
        tint
      />

      <section id="lead-form" className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Nhận tư vấn miễn phí"
            title="Nhận tư vấn chi tiết miễn phí"
            description="Để lại thông tin, chuyên viên MAX OFFICE sẽ liên hệ tư vấn đúng loại thủ tục sửa đổi bạn cần."
          />
          <BookingFormLayout
            defaultService="Thành lập doanh nghiệp"
            title="Nhận tư vấn chi tiết miễn phí"
            description="Điền thông tin bên dưới, chuyên viên MAX OFFICE sẽ liên hệ tư vấn miễn phí trong thời gian sớm nhất."
            formType="Dịch vụ pháp lý sửa đổi"
          />
        </div>
      </section>

      <CtaBanner service="Thành lập doanh nghiệp" />
    </main>
  );
}
