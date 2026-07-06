import PageHero from "./PageHero";
import Breadcrumb from "./Breadcrumb";
import ServiceIntro from "./ServiceIntro";
import ServiceInlineImage from "./ServiceInlineImage";
import ServiceBenefits from "./ServiceBenefits";
import ServiceFeatures from "./ServiceFeatures";
import ServicePricingTable from "./ServicePricingTable";
import ServiceProcess from "./ServiceProcess";
import ServiceComparison from "./ServiceComparison";
import ServiceCrossLinks from "./ServiceCrossLinks";
import ServiceLeadForm from "./ServiceLeadForm";
import Testimonials from "./Testimonials";
import Faq from "./Faq";
import CtaBanner from "./CtaBanner";
import type { ServiceData } from "@/lib/servicesData";
import { SITE_URL, SITE_NAME, COMPANY_PHONE, COMPANY_EMAIL } from "@/lib/siteConfig";

export default function ServicePageTemplate({ data }: { data: ServiceData }) {
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

      <ServiceIntro paragraphs={data.intro} />
      {data.benefitsImage && (
        <ServiceInlineImage src={data.benefitsImage.src} alt={data.benefitsImage.alt} />
      )}
      <ServiceBenefits title={data.benefitsTitle} items={data.benefits} />
      {data.featuresImage && (
        <ServiceInlineImage src={data.featuresImage.src} alt={data.featuresImage.alt} />
      )}
      <ServiceFeatures
        title={data.featuresTitle}
        description={data.featuresDescription}
        image={data.image}
        imageAlt={data.name}
        items={data.features}
      />
      <ServicePricingTable
        title={data.pricingTitle}
        description={data.pricingDescription}
        pricing={data.pricing}
      />
      {data.processImage && (
        <ServiceInlineImage src={data.processImage.src} alt={data.processImage.alt} />
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
      <ServiceCrossLinks currentSlug={data.slug} />
      <ServiceLeadForm serviceName={data.name} />
      <CtaBanner secondaryHref="#lead-form" />
    </main>
  );
}
