import SectionHead from "./SectionHead";
import Reveal from "./Reveal";
import BookingFormLayout from "./BookingFormLayout";
import type { BookingFormProps } from "./BookingForm";

type BookingFormSectionProps = BookingFormProps & {
  id?: string;
  eyebrow?: string;
  sectionTitle?: string;
  sectionDescription?: string;
};

export default function BookingFormSection({
  id = "lead",
  eyebrow = "Đặt lịch tham quan",
  sectionTitle = "Sẵn sàng bắt đầu cùng MAX OFFICE?",
  sectionDescription = "Để lại thông tin, đội ngũ chuyên viên sẽ liên hệ tư vấn và sắp xếp lịch tham quan miễn phí trong thời gian sớm nhất.",
  ...formProps
}: BookingFormSectionProps) {
  return (
    <section id={id} className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow={eyebrow}
          title={sectionTitle}
          description={sectionDescription}
        />
        <Reveal>
          <BookingFormLayout {...formProps} />
        </Reveal>
      </div>
    </section>
  );
}
