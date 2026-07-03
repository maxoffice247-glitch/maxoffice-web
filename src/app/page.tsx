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
      <BookingFormSection />
    </main>
  );
}
