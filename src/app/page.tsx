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

export const metadata: Metadata = {
  title: "Văn Phòng Ảo Từ 299K, Trọn Gói TP.HCM | MAX OFFICE",
  description:
    "Văn phòng ảo từ 299.000đ/tháng, văn phòng trọn gói tại TP.HCM. Địa chỉ kinh doanh hợp lệ, hỗ trợ thành lập doanh nghiệp, hơn 500 doanh nghiệp tin dùng.",
};

export default function Home() {
  return (
    <main>
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
