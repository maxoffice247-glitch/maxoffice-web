import SectionHead from "./SectionHead";
import { RevealGroup, RevealItem } from "./Reveal";
import type { ProcessStep } from "@/lib/servicesData";

export default function ServiceProcess({
  title,
  description,
  steps,
}: {
  title: string;
  description?: string;
  steps: ProcessStep[];
}) {
  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead eyebrow="Quy trình" title={title} description={description} />
        <RevealGroup className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-4 lg:gap-0">
          <div
            aria-hidden
            className="pointer-events-none absolute top-[26px] right-[12.5%] left-[12.5%] hidden h-0.5 lg:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, var(--color-line) 0 10px, transparent 10px 18px)",
            }}
          />
          {steps.map((step, i) => (
            <RevealItem key={step.num} className="group relative z-[1] px-0 text-center lg:px-5">
              <div
                className={`mx-auto mb-5 flex h-[54px] w-[54px] items-center justify-center rounded-full font-mono text-[17px] font-bold text-white shadow-soft transition-transform duration-300 group-hover:scale-110 ${
                  i === 0 ? "bg-accent" : "bg-navy"
                }`}
              >
                {step.num}
              </div>
              <h3 className="mb-2 text-[16.5px] font-bold text-navy">{step.title}</h3>
              <p className="text-[13.5px] text-body-text">{step.desc}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
