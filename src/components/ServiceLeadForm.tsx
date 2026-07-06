import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

export default function ServiceLeadForm({ serviceName }: { serviceName: string }) {
  return (
    <section id="lead-form" className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Nhận tư vấn miễn phí"
          title={`Bắt đầu với ${serviceName} ngay hôm nay`}
          description="Để lại thông tin, chuyên viên MAX OFFICE sẽ liên hệ tư vấn miễn phí trong vòng 15 phút làm việc."
        />
        <Reveal className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
          <ContactForm
            defaultService={serviceName}
            title={`Đăng ký tư vấn ${serviceName}`}
            description="Điền thông tin bên dưới, chuyên viên MAX OFFICE sẽ liên hệ tư vấn miễn phí trong thời gian sớm nhất."
            formType={`Dịch vụ - ${serviceName}`}
          />
          <ContactInfo />
        </Reveal>
      </div>
    </section>
  );
}
