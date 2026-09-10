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
import Quan3CuVOServices from "./Quan3CuVOServices";
import SilverGoldPremiumServices from "./SilverGoldPremiumServices";
import LitespaceServices from "./LitespaceServices";
import LocationCrossLinks from "./LocationCrossLinks";
import LocationLeadForm from "./LocationLeadForm";
import Testimonials from "./Testimonials";
import Faq from "./Faq";
import type { LocationData } from "@/lib/locationsData";
import { SITE_URL, COMPANY_PHONE, COMPANY_EMAIL } from "@/lib/siteConfig";
import { getPublicJpegDimensions } from "@/lib/imageDimensions";

/** Ảnh mặt tiền tỉ lệ THẬT dưới ngưỡng này (quá dọc, gần 2:3) bị ép về
    khung 3:4 cố định — đứng 1 mình cạnh đoạn giới thiệu (LocationFacade.tsx)
    ảnh quá dọc cao vọt hẳn so với cột văn bản, crop nhẹ về 3:4 giúp giảm
    hẳn phần chênh lệch. Tính theo NGƯỠNG SỐ trên tỉ lệ đọc
    THẬT từ file — không phải danh sách slug cứng — để tự đúng nếu ảnh gốc
    được thay bằng file khác tỉ lệ khác sau này mà không cần sửa code theo
    tay. 0.72 tách rõ 2 nhóm THẬT đang có trong ảnh mặt tiền của 28 chi
    nhánh: nhóm quá dọc ~0.64-0.67 (Sông Thao, 618 Ba Tháng Hai,
    89 Phan Đình Phùng, 84-86 Nguyễn Trường Tộ, 28-34 Pasteur,
    380 Trần Hưng Đạo) và nhóm còn lại ~0.75-1.4 (không cần ép, giữ tỉ lệ
    thật tuyệt đối trong khung 2 cột). */
const FACADE_TALL_RATIO_THRESHOLD = 0.72;
/** Số mục hiện trong khối tóm tắt "Điểm nổi bật khu vực" đặt ngay dưới lưới
    ảnh nội thất — đủ nêu bật vài điểm mạnh khu vực mà không lặp lại quá dài
    (khối benefits ĐẦY ĐỦ đã có riêng ở section "Lợi ích" phía dưới trang,
    xem ServiceBenefits). */
const MAX_GALLERY_BENEFIT_ITEMS = 4;

export default function LocationPageTemplate({ data }: { data: LocationData }) {
  // Đọc W/H THẬT của ảnh mặt tiền (đọc trực tiếp header file .jpg, xem
  // imageDimensions.ts) để tính tỉ lệ khung ở LocationFacade.tsx (2 cột,
  // xem bên dưới). Tính ở đây (Server Component, dùng được fs) rồi truyền
  // số liệu thuần xuống LocationImagesSection ("use client", không gọi fs
  // được) qua props — ảnh lỗi/không đọc được thì rơi về fallback, không
  // chặn build. Ảnh NỘI THẤT (LocationGallery.tsx) KHÔNG cần đọc W/H nữa —
  // mọi ảnh dùng chung khung 4:3 cố định (object-cover), không còn dựng
  // khung theo tỉ lệ thật cho ảnh nào trong gallery này (kể cả 3 ảnh "bảng
  // tên" tỉ lệ cực đoan — nay chỉ khác nhau ở `objectPosition`, xem
  // locationsData.ts).
  const facadeSrc = `/images/facade/dia-diem-${data.slug}.jpg`;
  const facadeDims = getPublicJpegDimensions(facadeSrc);
  const facadeRealRatio = facadeDims ? facadeDims.width / facadeDims.height : null;
  const facadeImage = {
    src: facadeSrc,
    alt: `Mặt tiền văn phòng ${data.name}`,
    // Quá dọc (< ngưỡng) → ép "3 / 4"; còn lại → tỉ lệ thật từ width/height
    // đọc được, hoặc `data.facadeAspectRatio` (khai tay) nếu hiếm khi đọc
    // file lỗi. LUÔN có giá trị cụ thể (không optional) — LocationFacade.tsx
    // chỉ dùng lại, không tự tính thêm lần nữa.
    aspectRatio:
      facadeRealRatio !== null && facadeRealRatio < FACADE_TALL_RATIO_THRESHOLD
        ? "3 / 4"
        : facadeDims
          ? `${facadeDims.width} / ${facadeDims.height}`
          : data.facadeAspectRatio,
  };
  // Render SẴN ở đây (Server Component, icon đã resolve thành phần tử JSX
  // cụ thể) rồi truyền xuống LocationImagesSection dạng ReactNode — không
  // truyền thẳng `data.benefits` (BenefitItem[], mỗi phần tử có `icon` là
  // THAM CHIẾU COMPONENT) xuống component "use client" được, Next.js chặn
  // truyền function/component qua ranh giới Server→Client Component.
  //
  // Khối này giờ đặt CỐ ĐỊNH full-width ngay DƯỚI lưới ảnh nội thất
  // (LocationGallery.tsx) — NHẤT QUÁN cho mọi chi nhánh, không còn cơ chế
  // ĐỘNG so đo chiều cao 2 cột ở LocationFacade.tsx để quyết định chèn hay
  // không (cơ chế cũ cho kết quả không đều: có chi nhánh bị chèn benefits
  // vào giữa mạch đọc phần giới thiệu). Bố cục 2 hàng (grid sm:grid-cols-2)
  // hợp khung ngang full-width, khác khối cũ 1 cột hẹp cạnh ảnh mặt tiền.
  const galleryBenefits =
    data.benefits.length > 0 ? (
      <div className="rounded-2xl border border-line bg-bg-tint p-5 sm:p-6">
        <p className="mb-4 text-[11.5px] font-bold tracking-[0.08em] text-body-text/70 uppercase">
          Điểm nổi bật khu vực
        </p>
        <ul className="grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
          {data.benefits.slice(0, MAX_GALLERY_BENEFIT_ITEMS).map((b) => (
            <li key={b.title} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary">
                <b.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[13.5px] font-bold text-navy">{b.title}</p>
                <p className="text-[12.5px] leading-snug text-body-text">{b.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `MAX OFFICE - ${data.name}`,
    // Ảnh mặt tiền THẬT của chính chi nhánh này cho schema.org (khác với
    // data.image — ảnh hero banner chọn riêng cho tính thẩm mỹ/đa dạng ở
    // PageHero bên dưới, không phải ảnh thật của chi nhánh).
    image: `${SITE_URL}/images/facade/dia-diem-${data.slug}.jpg`,
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
        facadeImage={facadeImage}
        imageSide={data.facadeImageSide}
        paragraphs={data.intro}
        benefitsBlock={galleryBenefits}
        interiorImages={data.interiorImages}
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
      ) : data.slug === "ut-tich" ? (
        <SilverGoldPremiumServices branchName="40A-40B Út Tịch" slug={data.slug} promotions={data.promotions} />
      ) : data.slug === "mai-chi-tho" ? (
        <LitespaceServices branchName="28 Mai Chí Thọ" slug={data.slug} promotions={data.promotions} />
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
      {/* CtaBanner (chung, dùng ở nhiều trang khác — xem CtaBanner.tsx) ĐÃ
          BỎ riêng ở trang chi nhánh: ngay phía trên là LocationLeadForm —
          1 form đặt lịch tham quan ĐẦY ĐỦ, RIÊNG cho chi nhánh này — nên
          banner chung lặp lại y hệt thông điệp "đặt lịch tham quan" ngay
          sau đó là dư thừa. Các trang khác (trang chủ, dịch vụ, blog,...)
          không có form riêng như vậy nên vẫn giữ nguyên CtaBanner. */}
      <LocationLeadForm name={data.name} slug={data.slug} />
    </main>
  );
}
