import type { ComponentType } from "react";
import SectionHead from "./SectionHead";
import Reveal, { RevealGroup, RevealItem } from "./Reveal";
import { CheckCircleIcon } from "./icons";

export type TransportItem = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
};

export default function LocationAccess({
  name,
  transportItems,
  parkingInfo,
}: {
  name: string;
  transportItems: TransportItem[];
  parkingInfo: string[];
}) {
  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Di chuyển & đỗ xe"
          title={`Cách di chuyển đến văn phòng ${name}`}
          description="Thông tin phương tiện di chuyển và chỗ đỗ xe giúp bạn chủ động sắp xếp thời gian khi đến văn phòng."
        />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h3 className="mb-5 text-[15.5px] font-bold text-navy">Phương tiện di chuyển</h3>
            <RevealGroup className="space-y-3.5">
              {transportItems.map((item) => (
                <RevealItem key={item.title}>
                  <div className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <span className="block text-[14px] font-bold text-navy">{item.title}</span>
                      <span className="block text-[13px] text-body-text">{item.desc}</span>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
          <div>
            <h3 className="mb-5 text-[15.5px] font-bold text-navy">Thông tin đỗ xe</h3>
            <Reveal className="rounded-2xl border border-line bg-bg-tint p-6">
              <ul className="space-y-3">
                {parkingInfo.map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-body-text">
                    <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
