import Link from "next/link";
import { RevealItem } from "./Reveal";
import { ArrowRightSmallIcon } from "./icons";
import type { LocationListItem } from "@/lib/locationsData";

export default function LocationCard({ loc, index }: { loc: LocationListItem; index: number }) {
  return (
    <RevealItem y={18}>
      <Link
        href={`/locations/${loc.slug}`}
        className="group flex h-full flex-col gap-4 rounded-2xl border border-line bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
      >
        <div className="flex gap-4">
          <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-bg-tint font-mono text-[13px] font-bold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div>
            <h3 className="mb-1 text-[15.5px] font-bold text-navy">{loc.name}</h3>
            <p className="text-[13.5px] text-body-text">{loc.shortAddress}</p>
            {loc.tag && (
              <span className="mt-2.5 inline-block rounded-full bg-accent/8 px-2.5 py-1 text-[11.5px] font-bold text-accent">
                {loc.tag}
              </span>
            )}
          </div>
        </div>
        <span className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-bold text-primary">
          Xem chi tiết
          <ArrowRightSmallIcon className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </Link>
    </RevealItem>
  );
}
