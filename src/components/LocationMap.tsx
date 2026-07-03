import SectionHead from "./SectionHead";
import Reveal from "./Reveal";
import { BuildingIcon, ArrowRightSmallIcon } from "./icons";

export default function LocationMap({
  name,
  address,
}: {
  name: string;
  address: string;
}) {
  const mapQuery = encodeURIComponent(address);

  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Bản đồ"
          title={`Vị trí văn phòng ${name}`}
          description="Xem trực tiếp vị trí văn phòng trên Google Maps để thuận tiện di chuyển khi đến tham quan."
        />
        <Reveal className="overflow-hidden rounded-2xl border border-line bg-bg-tint shadow-soft">
          <div className="relative">
            <iframe
              title={`Bản đồ văn phòng ${name}`}
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              width="100%"
              height="420"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="relative z-10 block w-full grayscale-[15%]"
            />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 text-body-text">
              <BuildingIcon className="h-8 w-8" />
              <span className="text-[13.5px] font-medium">Đang tải bản đồ...</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-white px-6 py-4">
            <span className="text-[13.5px] font-medium text-body-text">{address}</span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-primary hover:gap-2.5"
            >
              Mở trong Google Maps
              <ArrowRightSmallIcon />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
