import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import ContactProcess from "@/components/ContactProcess";
import BookingFormLayout from "@/components/BookingFormLayout";
import ContactMap from "@/components/ContactMap";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Liên Hệ MAX OFFICE - Tư Vấn Miễn Phí",
  description:
    "Liên hệ MAX OFFICE để được tư vấn miễn phí về văn phòng ảo, văn phòng trọn gói, thành lập doanh nghiệp và kế toán thuế. Hotline 089 8082 188 - 0932 357 357.",
  openGraph: {
    images: [{ url: "/images/og/hero-lien-he.jpg", width: 1200, height: 630 }],
  },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;

  return (
    <main>
      <PageHero
        image="/images/hero-lien-he.jpg"
        eyebrow="Liên hệ"
        title="Sẵn sàng đồng hành cùng bạn"
        description="Chỉ cần một tin nhắn hoặc một cuộc gọi — đội ngũ MAX OFFICE sẽ tư vấn miễn phí và đề xuất giải pháp phù hợp nhất với doanh nghiệp của bạn."
      />
      <Breadcrumb items={[{ label: "Liên hệ" }]} />
      <ContactProcess />
      <section id="lead-form" className="bg-bg-tint py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <Reveal>
            <BookingFormLayout
              title="Đặt lịch tham quan / Nhận tư vấn"
              description="Điền thông tin bên dưới, chuyên viên MAX OFFICE sẽ liên hệ tư vấn miễn phí trong thời gian sớm nhất."
              formType="Liên hệ"
              defaultService={service}
            />
          </Reveal>
        </div>
      </section>
      <ContactMap />
    </main>
  );
}
