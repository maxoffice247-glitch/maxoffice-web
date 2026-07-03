import SectionHead from "./SectionHead";
import { RevealGroup, RevealItem } from "./Reveal";
import { MapPinIcon } from "./icons";

export type NearbyItem = { name: string; desc: string };

export default function LocationNearby({
  name,
  items,
}: {
  name: string;
  items: NearbyItem[];
}) {
  return (
    <section className="bg-bg-tint py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Khu vực lân cận"
          title={`Địa điểm nổi bật gần văn phòng ${name}`}
          description="Thuận tiện di chuyển, gặp gỡ đối tác và khách hàng nhờ vị trí kết nối tốt với các khu vực xung quanh."
        />
        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <RevealItem key={item.name}>
              <div className="flex h-full items-start gap-3 rounded-2xl border border-line bg-white p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                  <MapPinIcon className="h-4 w-4" />
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
