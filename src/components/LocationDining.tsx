import SectionHead from "./SectionHead";
import { RevealGroup, RevealItem } from "./Reveal";
import { CoffeeIcon } from "./icons";

export type DiningItem = { name: string; desc: string };

export default function LocationDining({
  name,
  items,
}: {
  name: string;
  items: DiningItem[];
}) {
  return (
    <section className="bg-bg-tint py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Ăn uống lân cận"
          title={`Quán ăn, cà phê gần văn phòng ${name}`}
          description="Đa dạng lựa chọn ăn uống, tiếp khách hoặc làm việc nhóm ngay gần văn phòng."
        />
        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {items.map((item) => (
            <RevealItem key={item.name}>
              <div className="flex h-full items-start gap-3 rounded-2xl border border-line bg-white p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                  <CoffeeIcon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="mb-1 text-[14.5px] font-bold text-navy">{item.name}</h3>
                  <p className="text-[13px] leading-relaxed text-body-text">{item.desc}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
