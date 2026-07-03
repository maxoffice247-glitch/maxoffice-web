import type { ComponentType } from "react";
import SectionHead from "./SectionHead";
import { RevealGroup, RevealItem } from "./Reveal";

export type BenefitItem = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
};

export default function ServiceBenefits({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: BenefitItem[];
}) {
  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead eyebrow="Lợi ích" title={title} description={description} />
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <RevealItem key={item.title}>
              <div className="group h-full rounded-2xl border border-line bg-white p-7 transition-all duration-400 ease-out hover:-translate-y-2 hover:border-transparent hover:shadow-card">
                <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-primary-tint text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2.5 text-[17px] font-bold text-navy">{item.title}</h3>
                <p className="text-[14px] leading-relaxed text-body-text">{item.desc}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
