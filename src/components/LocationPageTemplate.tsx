import Link from "next/link";
import PageHero from "./PageHero";
import Breadcrumb from "./Breadcrumb";
import LocationImagesSection from "./LocationImagesSection";
import ServiceBenefits from "./ServiceBenefits";
import LocationNearby from "./LocationNearby";
import LocationAccess from "./LocationAccess";
import LocationDining from "./LocationDining";
import LocationMap from "./LocationMap";
import LocationServicesList from "./LocationServicesList";
import PhamVanDongServices from "./PhamVanDongServices";
import QuanBaServices from "./QuanBaServices";
import VuonLaiServices from "./VuonLaiServices";
import Quan3CuVOServices from "./Quan3CuVOServices";
import SilverGoldPremiumServices from "./SilverGoldPremiumServices";
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
        eyebrow="Chi nhánh"
        title={data.heroTitle}
        description={data.heroDescription}
      />
      <Breadcrumb
        items={[
          { label: "Chi nhánh", href: "/dia-diem" },
          { label: data.area.name, href: `/dia-diem/${data.area.slug}` },
          { label: data.name },
        ]}
      />

      <LocationImagesSection
        name={data.name}
        facadeImage={{
          src: `/images/dia-diem-${data.slug}.jpg`,
          alt: `Mặt tiền văn phòng ${data.name}`,
          aspectRatio: data.facadeAspectRatio,
          fit: data.facadeFit,
          objectPosition: data.facadeObjectPosition,
          maxWidth: data.facadeMaxWidth,
        }}
        imageSide={data.facadeImageSide}
        paragraphs={data.intro}
        interiorImages={data.interiorImages}
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
      {data.slug === "pham-van-dong" ? (
        <PhamVanDongServices />
      ) : data.slug === "quan-7" ? (
        <QuanBaServices />
      ) : data.slug === "vuon-lai" ? (
        <VuonLaiServices />
      ) : data.slug === "nguyen-thong" ? (
        <Quan3CuVOServices branchName="60 Nguyễn Thông" />
      ) : data.slug === "cach-mang-thang-8" ? (
        <Quan3CuVOServices branchName="520 Cách Mạng Tháng 8" />
      ) : data.slug === "mac-dinh-chi" ? (
        <Quan3CuVOServices branchName="36 Mạc Đĩnh Chi" />
      ) : data.slug === "ung-van-khiem" ? (
        <SilverGoldPremiumServices branchName="161 Ung Văn Khiêm" />
      ) : data.slug === "tan-cang" ? (
        <SilverGoldPremiumServices branchName="23 Tân Cảng" />
      ) : data.slug === "n1-dien-bien-phu" ? (
        <SilverGoldPremiumServices branchName="N1 Điện Biên Phủ" />
      ) : data.slug === "quoc-huong" ? (
        <SilverGoldPremiumServices branchName="27C Quốc Hương" />
      ) : data.slug === "phan-dinh-phung" ? (
        <SilverGoldPremiumServices branchName="89 Phan Đình Phùng" />
      ) : data.slug === "nguyen-truong-to" ? (
        <SilverGoldPremiumServices branchName="84-86 Nguyễn Trường Tộ" />
      ) : data.slug === "le-quoc-hung" ? (
        <SilverGoldPremiumServices branchName="54-56 Lê Quốc Hưng" />
      ) : (
        <LocationServicesList name={data.name} slug={data.slug} />
      )}
      {data.lowerTierAlternatives && data.lowerTierAlternatives.length > 0 && (
        <section className="pb-9">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
            <div className="rounded-2xl border border-line bg-bg-tint p-6 sm:p-7">
              <p className="mb-2 text-[14.5px] font-bold text-navy">
                Cần gói văn phòng ảo giá thấp hơn?
              </p>
              <p className="mb-4 text-[13.5px] leading-relaxed text-body-text">
                Chi nhánh {data.name} hiện chỉ áp dụng các gói từ ORIGIN trở lên. Nếu bạn cần gói
                LITE hoặc START để tối ưu chi phí ban đầu, các chi nhánh sau đang cung cấp:
              </p>
              <div className="flex flex-wrap gap-2.5">
                {data.lowerTierAlternatives.map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/locations/${loc.slug}`}
                    className="rounded-full border border-line bg-white px-4 py-2 text-[13px] font-semibold text-primary transition-colors duration-200 hover:border-primary/40 hover:bg-primary-tint"
                  >
                    {loc.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
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
      />
    </main>
  );
}
