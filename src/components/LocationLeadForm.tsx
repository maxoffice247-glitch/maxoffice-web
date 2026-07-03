import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import BookingFormLayout from "./BookingFormLayout";

export default function LocationLeadForm({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  return (
    <section id="lead-form" className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Đặt lịch tham quan miễn phí"
          title={`Ghé thăm văn phòng ${name}`}
          description="Để lại thông tin, chuyên viên MAX OFFICE sẽ liên hệ sắp xếp lịch tham quan trực tiếp, hoàn toàn miễn phí."
        />
        <Reveal>
          <BookingFormLayout
            title={`Đặt lịch tham quan tại ${name}`}
            description="Điền thông tin bên dưới, chuyên viên MAX OFFICE sẽ liên hệ xác nhận lịch tham quan miễn phí trong thời gian sớm nhất."
            defaultLocationSlug={slug}
          />
        </Reveal>
      </div>
    </section>
  );
}
