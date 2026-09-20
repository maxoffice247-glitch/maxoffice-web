import type { Metadata } from "next";
import Hero from "@/components/Hero";
import StatsFloat from "@/components/StatsFloat";
import TrustBar from "@/components/TrustBar";
import WhyChoose from "@/components/WhyChoose";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Locations from "@/components/Locations";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import KnowledgeCenter from "@/components/KnowledgeCenter";
import Faq from "@/components/Faq";
import BookingFormSection from "@/components/BookingFormSection";
import { SITE_URL, SITE_NAME } from "@/lib/siteConfig";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "Văn Phòng Ảo Từ 299K, Trọn Gói TP.HCM | MAX OFFICE",
  description:
    "Văn phòng ảo từ 299.000đ/tháng, văn phòng trọn gói tại TP.HCM. Địa chỉ kinh doanh hợp lệ, hỗ trợ thành lập doanh nghiệp, hơn 500 doanh nghiệp tin dùng.",
};

// WebSite structured data — the signal Google's "site name" (line above the URL in
// results) actually reads; it must sit on the homepage. Organization (root layout)
// already declares the same name "MAX OFFICE" but is not what site-name uses.
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: ["maxoffice.vn"],
  url: `${SITE_URL}/`,
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Hero />
      <StatsFloat />
      <TrustBar />
      <WhyChoose />
      <Services />
      <Process />
      <Locations />
      <Testimonials />
      <Pricing />
      <KnowledgeCenter />
      <Faq />
      <BookingFormSection formType="Trang chủ" />
    </main>
  );
}
