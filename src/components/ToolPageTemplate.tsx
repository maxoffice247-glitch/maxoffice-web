import type { ReactNode } from "react";
import Link from "next/link";
import PageHero from "./PageHero";
import Breadcrumb from "./Breadcrumb";
import SectionHead from "./SectionHead";
import ServiceBenefits, { type BenefitItem } from "./ServiceBenefits";
import Faq from "./Faq";
import type { FaqItem } from "./Faq";
import BookingFormLayout from "./BookingFormLayout";
import { RevealGroup, RevealItem } from "./Reveal";
import { ArrowRightSmallIcon } from "./icons";

type RelatedService = { slug: string; name: string; desc: string };

export default function ToolPageTemplate({
  heroTitle,
  heroDescription,
  breadcrumbLabel,
  benefitsTitle,
  benefits,
  relatedServices,
  faqTopic,
  faqs,
  defaultService,
  children,
}: {
  heroTitle: string;
  heroDescription: string;
  breadcrumbLabel: string;
  benefitsTitle: string;
  benefits: BenefitItem[];
  relatedServices: RelatedService[];
  faqTopic: string;
  faqs: FaqItem[];
  defaultService?: string;
  children: ReactNode;
}) {
  return (
    <main>
      <PageHero
        image="/images/khong-gian-lam-viec.png"
        eyebrow="Tiện ích miễn phí"
        title={heroTitle}
        description={heroDescription}
      />
      <Breadcrumb
        items={[
          { label: "Tiện ích", href: "/tien-ich" },
          { label: breadcrumbLabel },
        ]}
      />

      {children}

      <ServiceBenefits title={benefitsTitle} items={benefits} />

      <section className="bg-bg-tint py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Dịch vụ liên quan"
            title="Khám phá dịch vụ MAX OFFICE"
            description="Sau khi có kết quả, xem chi tiết dịch vụ phù hợp với nhu cầu của bạn."
          />
          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedServices.map((svc) => (
              <RevealItem key={svc.slug}>
                <Link
                  href={`/services/${svc.slug}`}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card"
                >
                  <div>
                    <h3 className="mb-1.5 text-[14.5px] font-bold text-navy">
                      {svc.name}
                    </h3>
                    <p className="text-[12.5px] text-body-text">{svc.desc}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-accent">
                    Xem chi tiết
                    <ArrowRightSmallIcon className="transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Faq
        title="Câu hỏi thường gặp"
        description={`Giải đáp thắc mắc phổ biến về ${faqTopic}.`}
        items={faqs}
        tint
      />

      <section id="lead-form" className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Nhận tư vấn miễn phí"
            title="Nhận tư vấn chi tiết miễn phí"
            description="Để lại thông tin, chuyên viên MAX OFFICE sẽ liên hệ tư vấn chi tiết dựa trên kết quả bạn vừa nhận được."
          />
          <BookingFormLayout
            defaultService={defaultService}
            title="Nhận tư vấn chi tiết miễn phí"
            description="Điền thông tin bên dưới, chuyên viên MAX OFFICE sẽ liên hệ tư vấn miễn phí trong thời gian sớm nhất."
          />
        </div>
      </section>
    </main>
  );
}
