import Link from "next/link";
import PageHero from "./PageHero";
import Breadcrumb from "./Breadcrumb";
import ServiceIntro from "./ServiceIntro";
import ServiceBenefits from "./ServiceBenefits";
import ServiceFeatures from "./ServiceFeatures";
import ServicePricingTable from "./ServicePricingTable";
import AmendmentPricingTable from "./AmendmentPricingTable";
import ServiceProcess from "./ServiceProcess";
import ServiceComparison from "./ServiceComparison";
import ServiceCrossLinks from "./ServiceCrossLinks";
import ServiceLeadForm from "./ServiceLeadForm";
import Testimonials from "./Testimonials";
import Faq from "./Faq";
import CtaBanner from "./CtaBanner";
import { ArrowRightSmallIcon, DocumentCheckIcon } from "./icons";
import type { ServiceData } from "@/lib/servicesData";
import { SITE_URL, SITE_NAME, COMPANY_PHONE, COMPANY_EMAIL } from "@/lib/siteConfig";
import { SERVICE_NAME_BY_SLUG } from "@/lib/serviceSelectEvent";

export default function ServicePageTemplate({ data }: { data: ServiceData }) {
  const serviceName = SERVICE_NAME_BY_SLUG[data.slug] ?? data.name;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: data.name,
    name: data.heroTitle,
    description: data.heroDescription,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      telephone: COMPANY_PHONE,
      email: COMPANY_EMAIL,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Số 10 Sông Thao, P. Tân Sơn Hoà",
        addressLocality: "Thành phố Hồ Chí Minh",
        addressCountry: "VN",
      },
    },
    areaServed: {
      "@type": "City",
      name: "Thành phố Hồ Chí Minh",
    },
    image: `${SITE_URL}${data.image}`,
    url: `${SITE_URL}/services/${data.slug}`,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <PageHero
        image={data.image}
        eyebrow="Dịch vụ"
        title={data.heroTitle}
        description={data.heroDescription}
      />
      <Breadcrumb
        items={[
          { label: "Dịch vụ", href: "/#services" },
          { label: data.name },
        ]}
      />

      <ServiceIntro paragraphs={data.intro} image={data.introImage} />
      <ServiceBenefits title={data.benefitsTitle} items={data.benefits} />
      <ServiceFeatures
        title={data.featuresTitle}
        description={data.featuresDescription}
        image={data.featuresImage?.src ?? data.image}
        imageAlt={data.featuresImage?.alt ?? data.name}
        items={data.features}
      />
      <ServicePricingTable
        title={data.pricingTitle}
        description={data.pricingDescription}
        pricing={data.pricing}
        image={data.pricingImage}
        serviceName={serviceName}
      />
      {data.slug === "thanh-lap-doanh-nghiep" && <AmendmentPricingTable />}
      {data.slug === "thanh-lap-doanh-nghiep" && (
        <section className="py-9">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
            <Link
              href="/tien-ich/soan-ho-so-doanh-nghiep"
              className="group grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 rounded-2xl bg-gradient-to-br from-navy to-primary-dark p-6 text-white transition-transform duration-300 ease-out hover:-translate-y-1 sm:flex sm:flex-row sm:flex-nowrap sm:gap-5 sm:p-7"
            >
              {/* Di động xếp DỌC (lưới 2 cột: icon + nhãn, rồi tiêu đề/mô tả/nút full-width). Trước đây flex-wrap + cột chữ
                  flex-1 (flex-basis 0) khiến icon, cột chữ và nút nằm chung 1 hàng, cột chữ bị ép còn ~34px ở 360px
                  (1 từ/dòng, thẻ cao ~900px). Từ sm trở lên giữ hàng ngang như cũ. */}
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white sm:h-14 sm:w-14">
                <DocumentCheckIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
              <div className="contents min-w-0 sm:block sm:flex-1">
                <span className="col-start-2 row-start-1 mb-0 inline-block w-fit rounded-full bg-accent px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase sm:mb-1.5">
                  Công cụ miễn phí
                </span>
                <h3 className="col-span-2 text-[18px] font-bold sm:col-auto">Soạn hồ sơ doanh nghiệp tự động</h3>
                <p className="col-span-2 text-[13.5px] text-white/75 sm:col-auto sm:mt-1">
                  Thành lập mới, mở chi nhánh, chuyển nhượng vốn, đổi địa chỉ GPKD, Mẫu số 12 —
                  điền thông tin, nhận hồ sơ ngay, không cần chờ soạn thủ công.
                </p>
              </div>
              <span className="col-span-2 inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-bold text-navy transition-transform duration-200 group-hover:translate-x-1 sm:col-auto">
                Dùng ngay
                <ArrowRightSmallIcon />
              </span>
            </Link>
          </div>
        </section>
      )}
      <ServiceProcess
        title={`Quy trình sử dụng dịch vụ ${data.name}`}
        description="Chỉ 4 bước đơn giản để bắt đầu sử dụng dịch vụ."
        steps={data.process}
      />
      <Testimonials
        eyebrow="Khách hàng nói gì"
        title="Khách hàng đánh giá gì về dịch vụ này"
        description={`Những chia sẻ thực tế từ khách hàng đã sử dụng dịch vụ ${data.name} tại MAX OFFICE.`}
        items={data.testimonials}
      />
      <ServiceComparison
        title={data.comparisonTitle}
        alternativeLabel={data.comparisonAlternative}
        rows={data.comparison}
      />
      <Faq
        title="Câu hỏi thường gặp"
        description={`Giải đáp những thắc mắc phổ biến nhất về dịch vụ ${data.name}.`}
        items={data.faqs}
        tint
      />
      {data.relatedGuide && (
        <section className="py-9">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
            <Link
              href={data.relatedGuide.href}
              className="group grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-2.5 rounded-2xl border border-line bg-bg-tint p-6 transition-all duration-300 ease-out hover:border-primary/30 hover:shadow-card sm:flex sm:flex-row sm:flex-nowrap sm:items-center"
            >
              {/* Di động: icon + cột chữ (1fr) cùng hàng, liên kết "Xem hướng dẫn" xuống dưới cột chữ — cùng nguyên nhân/cách
                  sửa với thẻ "Công cụ miễn phí" phía trên (flex-wrap + flex-1 ép cột chữ ~70px ở 360px). */}
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                <DocumentCheckIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0 sm:flex-1">
                <p className="text-[15px] font-bold text-navy">{data.relatedGuide.label}</p>
                <p className="text-[13px] text-body-text">{data.relatedGuide.description}</p>
              </div>
              <span className="col-start-2 inline-flex shrink-0 items-center gap-1.5 text-[13px] font-bold text-primary sm:col-auto">
                Xem hướng dẫn
                <ArrowRightSmallIcon className="transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </section>
      )}
      <ServiceCrossLinks currentSlug={data.slug} />
      <ServiceLeadForm serviceName={data.name} />
      <CtaBanner service={serviceName} />
    </main>
  );
}
