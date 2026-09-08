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
import { getPublicJpegDimensions } from "@/lib/imageDimensions";

export default function LocationPageTemplate({ data }: { data: LocationData }) {
  // Đọc W/H THẬT của từng ảnh gallery (đọc trực tiếp header file .jpg, xem
  // imageDimensions.ts) để LocationGallery.tsx dựng khung Masonry đúng tỉ lệ
  // thật — không crop ảnh dọc (VD mặt tiền) như bố cục lưới 4:3 cố định
  // trước đây. Tính ở đây (Server Component, dùng được fs) rồi truyền số
  // liệu thuần xuống LocationImagesSection/LocationGallery ("use client",
  // không gọi fs được) qua props — ảnh lỗi/không đọc được thì rơi về
  // fallback 4:3 ở chính LocationGallery.tsx, không chặn build.
  const interiorImagesWithDimensions = data.interiorImages?.map((img) => {
    const dims = getPublicJpegDimensions(img.src);
    return dims ? { ...img, width: dims.width, height: dims.height } : img;
  });

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `MAX OFFICE - ${data.name}`,
    // Ảnh mặt tiền THẬT của chính chi nhánh này cho schema.org (khác với
    // data.image — ảnh hero banner chọn riêng cho tính thẩm mỹ/đa dạng ở
    // PageHero bên dưới, không phải ảnh thật của chi nhánh).
    image: `${SITE_URL}/images/dia-diem-${data.slug}.jpg`,
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

      {/* Banner dùng data.image — ảnh hero wide-format (bối cảnh văn phòng/
          skyline) chọn riêng cho từng chi nhánh từ pool ~12 ảnh hero đã
          dùng chung trên site, KHÔNG phải ảnh mặt tiền dọc của chi nhánh.
          Trước đây banner dùng thẳng /images/dia-diem-{slug}.jpg (ảnh mặt
          tiền, tỉ lệ dọc) nên bị crop xấu khi ép vào khung banner ngang
          full-width — đổi lại ảnh mặt tiền vẫn giữ nguyên ở gallery bên
          dưới (LocationImagesSection) và card báo giá (PlanQuoteCard), chỉ
          đổi phần banner đầu trang này. Xem bảng gán đầy đủ trong lịch sử
          commit thêm trường "image" ở locationsData.ts. */}
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
        interiorImages={interiorImagesWithDimensions}
      />
      {/* "Dịch vụ tại chi nhánh" chuyển lên NGAY SAU gallery ảnh (trước đây
          nằm sau Bản đồ) — khách xem xong ảnh thực tế chi nhánh là thấy
          ngay giá/gói áp dụng, không phải cuộn qua Lợi ích/Khu vực lân
          cận/Di chuyển/Ăn uống/Bản đồ mới tới phần quan trọng nhất. Khối
          "Cần gói giá thấp hơn?" (lowerTierAlternatives) đi CÙNG vị trí
          mới này (không tách rời xuống dưới Bản đồ) vì nó nói tiếp mạch
          nội dung của lưới gói Văn phòng ảo ngay phía trên. */}
      {data.slug === "pham-van-dong" ? (
        <PhamVanDongServices />
      ) : data.slug === "quan-7" ? (
        <QuanBaServices />
      ) : data.slug === "vuon-lai" ? (
        <VuonLaiServices />
      ) : data.slug === "nguyen-thong" ? (
        <Quan3CuVOServices branchName="60 Nguyễn Thông" slug={data.slug} promotions={data.promotions} />
      ) : data.slug === "cach-mang-thang-8" ? (
        <Quan3CuVOServices branchName="520 Cách Mạng Tháng 8" slug={data.slug} promotions={data.promotions} />
      ) : data.slug === "mac-dinh-chi" ? (
        <Quan3CuVOServices branchName="36 Mạc Đĩnh Chi" slug={data.slug} promotions={data.promotions} />
      ) : data.slug === "pasteur" ? (
        <Quan3CuVOServices branchName="28-34 Pasteur" slug={data.slug} promotions={data.promotions} />
      ) : data.slug === "ung-van-khiem" ? (
        <SilverGoldPremiumServices branchName="161 Ung Văn Khiêm" slug={data.slug} promotions={data.promotions} />
      ) : data.slug === "tan-cang" ? (
        <SilverGoldPremiumServices branchName="23 Tân Cảng" slug={data.slug} promotions={data.promotions} />
      ) : data.slug === "n1-dien-bien-phu" ? (
        <SilverGoldPremiumServices branchName="N1 Điện Biên Phủ" slug={data.slug} promotions={data.promotions} />
      ) : data.slug === "quoc-huong" ? (
        <SilverGoldPremiumServices branchName="27C Quốc Hương" slug={data.slug} promotions={data.promotions} />
      ) : data.slug === "phan-dinh-phung" ? (
        <SilverGoldPremiumServices branchName="89 Phan Đình Phùng" slug={data.slug} promotions={data.promotions} />
      ) : data.slug === "nguyen-truong-to" ? (
        <SilverGoldPremiumServices branchName="84-86 Nguyễn Trường Tộ" slug={data.slug} promotions={data.promotions} />
      ) : data.slug === "le-quoc-hung" ? (
        <SilverGoldPremiumServices branchName="54-56 Lê Quốc Hưng" slug={data.slug} promotions={data.promotions} />
      ) : data.slug === "ba-thang-hai" ? (
        <SilverGoldPremiumServices branchName="614-616-618 Ba Tháng Hai" slug={data.slug} promotions={data.promotions} />
      ) : (
        <LocationServicesList name={data.name} slug={data.slug} promotions={data.promotions} />
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
      <ServiceBenefits title={data.benefitsTitle} items={data.benefits} />
      <LocationNearby name={data.name} items={data.nearbyItems} />
      <LocationAccess
        name={data.name}
        transportItems={data.transportItems}
        parkingInfo={data.parkingInfo}
      />
      <LocationDining name={data.name} items={data.diningItems} />
      <LocationMap name={data.name} address={data.address} />
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
