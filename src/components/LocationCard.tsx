import Link from "next/link";
import { RevealItem } from "./Reveal";
import { ArrowRightSmallIcon } from "./icons";
import type { LocationListItem } from "@/lib/locationsData";
import { getCheapestPriceForLocation, formatVoPriceShort } from "@/lib/virtualOfficePlans";

export default function LocationCard({
  loc,
  index,
  areaBadge,
}: {
  loc: LocationListItem;
  index: number;
  /** Nhãn khu vực hiển thị góc trên thẻ — chỉ dùng khi thẻ nằm trong khối gộp nhiều khu vực. */
  areaBadge?: string;
}) {
  const cheapestPrice = getCheapestPriceForLocation(loc.slug);

  return (
    <RevealItem y={18}>
      <Link
        href={`/locations/${loc.slug}`}
        className="group flex h-full flex-col gap-4 rounded-2xl border border-line bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
      >
        {areaBadge && (
          <div className="flex justify-start">
            <span className="shrink-0 rounded-full bg-primary-tint px-2.5 py-1 text-[10.5px] font-bold whitespace-nowrap text-primary">
              {areaBadge}
            </span>
          </div>
        )}
        <div className="flex gap-4">
          <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-bg-tint font-mono text-[13px] font-bold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="text-[15.5px] font-bold text-navy">{loc.name}</h3>
              {loc.tag && (
                <span className="shrink-0 rounded-full bg-amber/12 px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-amber-dark">
                  {loc.tag}
                </span>
              )}
            </div>
            <p className="text-[13.5px] text-body-text">{loc.shortAddress}</p>
          </div>
        </div>
        {cheapestPrice !== undefined && (
          <p className="-mt-1 text-[13px] text-body-text">
            Từ <span className="text-accent font-bold italic">{formatVoPriceShort(cheapestPrice)}/tháng</span>
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-bold text-primary">
          Xem chi tiết
          <ArrowRightSmallIcon className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </Link>
    </RevealItem>
  );
}
