import PageHero from "./PageHero";
import Breadcrumb from "./Breadcrumb";
import LocationIntro from "./LocationIntro";
import ServiceBenefits from "./ServiceBenefits";
import LocationNearby from "./LocationNearby";
import LocationAccess from "./LocationAccess";
import LocationDining from "./LocationDining";
import LocationMap from "./LocationMap";
import LocationServicesList from "./LocationServicesList";
import LocationCrossLinks from "./LocationCrossLinks";
import LocationLeadForm from "./LocationLeadForm";
import Testimonials from "./Testimonials";
import Faq from "./Faq";
import CtaBanner from "./CtaBanner";
import type { LocationData } from "@/lib/locationsData";
import { SITE_URL, COMPANY_PHONE, COMPANY_EMAIL } from "@/lib/siteConfig";

export default function LocationPageTemplate({ data }: { data: LocationData }) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `MAX OFFICE - ${data.name}`,
    image: `${SITE_URL}${data.image}`,
    telephone: COMPANY_PHONE,
    email: COMPANY_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: data.address,
      addressLocality: "Thành phố Hồ Chí Minh",
      addressCountry: "VN",
    },
    url: `${SITE_URL}/locations/${data.slug}`,
    priceRange: "299000-4500000",
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <PageHero
        image={data.image}
        eyebrow="Địa điểm"
        title={data.heroTitle}
        description={data.heroDescription}
      />
      <Breadcrumb
        items={[
          { label: "Địa điểm", href: "/dia-diem" },
          { label: data.name },
        ]}
      />

      <LocationIntro
        name={data.name}
        image={`/images/dia-diem-${data.slug}.jpg`}
        paragraphs={data.intro}
      />
      <ServiceBenefits title={data.benefitsTitle} items={data.benefits} />
      <LocationNearby name={data.name} items={data.nearbyItems} />
      <LocationAccess
        name={data.name}
        transportItems={data.transportItems}
        parkingInfo={data.parkingInfo}
      />
      <LocationDining name={data.name} items={data.diningItems} />
      <LocationMap name={data.name} address={data.address} />
      <LocationServicesList name={data.name} />
      <Testimonials
        eyebrow="Khách hàng nói gì"
        title="Khách hàng đánh giá gì về chi nhánh này"
        description={`Những chia sẻ thực tế từ khách hàng đã sử dụng dịch vụ tại văn phòng ${data.name}.`}
        items={data.testimonials}
      />
      <Faq
        title="Câu hỏi thường gặp"
        description={`Giải đáp những thắc mắc phổ biến nhất về văn phòng ${data.name}.`}
        items={data.faqs}
        tint
      />
      <LocationCrossLinks currentSlug={data.slug} />
      <LocationLeadForm name={data.name} slug={data.slug} />
      <CtaBanner
        eyebrow="Đặt lịch tham quan"
        title="Đặt lịch tham quan miễn phí ngay hôm nay"
        description={`Ghé thăm trực tiếp văn phòng ${data.name} — đội ngũ MAX OFFICE sẽ đón tiếp và tư vấn giải pháp phù hợp với bạn.`}
        secondaryLabel="Đặt lịch tham quan miễn phí"
        secondaryHref="#lead-form"
      />
    </main>
  );
}
