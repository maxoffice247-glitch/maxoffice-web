import Reveal from "./Reveal";
import { BuildingIcon, ArrowRightSmallIcon } from "./icons";

const ADDRESS = "Số 10 Sông Thao, Phường Tân Sơn Hoà, Tân Bình, TP.HCM";
const MAP_QUERY = encodeURIComponent(ADDRESS);

export default function ContactMap() {
  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="overflow-hidden rounded-2xl border border-line bg-bg-tint shadow-soft">
          <div className="relative">
            <iframe
              title="Bản đồ trụ sở chính MAX OFFICE"
              src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
              width="100%"
              height="420"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full grayscale-[15%]"
            />
            <div className="pointer-events-none absolute inset-0 -z-10 flex flex-col items-center justify-center gap-3 text-body-text">
              <BuildingIcon className="h-8 w-8" />
              <span className="text-[13.5px] font-medium">Đang tải bản đồ...</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-white px-6 py-4">
            <span className="text-[13.5px] font-medium text-body-text">{ADDRESS}</span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
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
