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
              className="group flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-bg-tint p-6 transition-all duration-300 ease-out hover:border-primary/30 hover:shadow-card sm:flex-nowrap"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                <DocumentCheckIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold text-navy">{data.relatedGuide.label}</p>
                <p className="text-[13px] text-body-text">{data.relatedGuide.description}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-bold text-primary">
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
