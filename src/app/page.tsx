import type { Metadata } from "next";
import Hero from "@/components/Hero";
import StatsFloat from "@/components/StatsFloat";
import GoogleReviews from "@/components/GoogleReviews";
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

export const metadata: Metadata = {
  title: "Văn Phòng Ảo & Văn Phòng Trọn Gói TP.HCM | MAX OFFICE",
  description:
    "MAX OFFICE cung cấp văn phòng ảo, văn phòng trọn gói, cho thuê văn phòng và dịch vụ thành lập doanh nghiệp tại TP.HCM — địa chỉ đăng ký kinh doanh hợp lệ, giá từ 299.000đ/tháng, hơn 500 doanh nghiệp tin dùng.",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsFloat />
      <GoogleReviews />
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
