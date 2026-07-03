import Link from "next/link";
import Reveal, { RevealGroup, RevealItem } from "./Reveal";
import Button from "./Button";
import { MapPinIcon, ArrowRightSmallIcon, BuildingIcon } from "./icons";
import { LOCATIONS_LIST } from "@/lib/locationsData";

export default function LocationCrossLinks({ currentSlug }: { currentSlug: string }) {
  const otherLocations = LOCATIONS_LIST.filter((loc) => loc.slug !== currentSlug).slice(0, 5);

  return (
    <section className="bg-bg-tint py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="mb-10 max-w-[640px]">
          <span className="mb-4 inline-flex items-center gap-2 text-[12.5px] font-bold tracking-[0.14em] text-primary uppercase before:h-[2px] before:w-[22px] before:rounded-full before:bg-accent">
            Chi nhánh khác
          </span>
          <h2 className="mb-3.5 font-display text-[26px] leading-[1.2] font-extrabold text-navy sm:text-[32px]">
            Khám phá các địa điểm khác của MAX OFFICE
          </h2>
          <p className="text-[15.5px] text-body-text">
            12 địa điểm trải khắp TP.HCM — chọn chi nhánh gần đối tác, khách
            hàng hoặc thuận tiện nhất cho đội ngũ của bạn.
          </p>
        </Reveal>
        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {otherLocations.map((loc) => (
            <RevealItem key={loc.slug}>
              <Link
                href={`/locations/${loc.slug}`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card"
              >
                <div>
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                    <MapPinIcon className="h-5 w-5" />
                  </span>
                  <h3 className="mb-1 text-[14.5px] font-bold text-navy">{loc.name}</h3>
                  <p className="text-[12.5px] text-body-text">{loc.shortAddress}</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-accent">
                  Xem chi tiết
                  <ArrowRightSmallIcon className="transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal
          delay={0.1}
          className="mt-10 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-line bg-white p-7"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
              <BuildingIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-[15.5px] font-bold text-navy">
                Xem toàn bộ 12 địa điểm
              </h3>
              <p className="text-[13.5px] text-body-text">
                So sánh vị trí và chọn chi nhánh phù hợp nhất với bạn.
              </p>
            </div>
          </div>
          <Button href="/dia-diem" variant="ghost">
            Xem tất cả địa điểm
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
