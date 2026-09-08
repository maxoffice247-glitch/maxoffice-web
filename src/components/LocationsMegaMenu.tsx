"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon, MapPinIcon, PhoneIcon, SearchIcon } from "./icons";
import Button from "./Button";
import {
  getGroupedLocations,
  stripCuSuffix,
  ACTIVE_BRANCH_COUNT,
  type LocationListItem,
  type LocationRow,
} from "@/lib/locationsData";
import { CLUSTER_COLORS, getClusterWidthShares } from "@/lib/locationClusterColors";
import { getCheapestPriceForLocation, formatVoPriceShort } from "@/lib/virtualOfficePlans";
import { useNavIndicator } from "./NavIndicator";

function MegaMenuLocationItem({ loc }: { loc: LocationListItem }) {
  const price = getCheapestPriceForLocation(loc.slug);
  return (
    <Link
      href={`/locations/${loc.slug}`}
      className="group flex items-start gap-2.5 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-bg-tint"
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
        <MapPinIcon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] leading-snug font-bold text-navy">{loc.name}</span>
        <span className="block truncate text-[11.5px] text-body-text">{loc.shortAddress}</span>
        {price !== undefined && (
          <span className="mt-0.5 block text-[11px] text-body-text">
            Từ <span className="text-accent font-bold italic">{formatVoPriceShort(price)}/tháng</span>
          </span>
        )}
        {loc.tag && (
          <span className="mt-1 flex flex-wrap gap-1">
            <span className="inline-block rounded-full bg-amber/12 px-2 py-0.5 text-[10px] font-bold text-amber-dark">
              {loc.tag}
            </span>
          </span>
        )}
      </span>
    </Link>
  );
}

/** 1 khu vực >2 chi nhánh — chiếm trọn 1 "hàng" riêng trong danh sách cuộn,
    y hệt layout cũ (không đổi): tiêu đề nhỏ viết hoa + lưới 2-3 cột. */
function MegaMenuAreaBlock({ area, locations }: { area: { slug: string; name: string }; locations: LocationListItem[] }) {
  return (
    <div className="mb-3.5 last:mb-0">
      <p className="mb-1.5 px-1 text-[11px] font-bold tracking-[0.08em] text-body-text/70 uppercase">
        {stripCuSuffix(area.name)}
        <span className="ml-1.5 normal-case text-body-text/50">({locations.length})</span>
      </p>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
        {locations.map((loc) => (
          <MegaMenuLocationItem key={loc.slug} loc={loc} />
        ))}
      </div>
    </div>
  );
}

/** 1 khu vực ≤2 chi nhánh bên trong 1 hàng ghép — ĐỒNG BỘ nguyên tắc màu
    với /dia-diem: viền mảnh (1px, giống mọi khối viền khác trong dropdown
    — border-line ở khối liên hệ cuối trang) bao quanh 4 cạnh + tiêu đề
    màu, viền và chữ CÙNG 1 tông (xem locationClusterColors.ts) nên không
    lệch màu. Dropdown hẹp hơn /dia-diem nhiều nên card gọn hơn: lưới 1
    cột (thay vì 2-3 cột như khối "full") vì mỗi khu vực chỉ có 1-2 chi
    nhánh, xếp ngang không cần thiết và dễ chật trong nửa hàng. */
function MegaMenuClusterCard({
  area,
  locations,
  colorIndex,
  widthShare,
}: {
  area: { slug: string; name: string };
  locations: LocationListItem[];
  colorIndex: number;
  widthShare: "1/2" | "1/3" | "2/3" | "full";
}) {
  const color = CLUSTER_COLORS[colorIndex % CLUSTER_COLORS.length];
  const basisClass =
    widthShare === "full"
      ? ""
      : widthShare === "1/2"
        ? "basis-1/2"
        : widthShare === "1/3"
          ? "basis-1/3"
          : "basis-2/3";

  return (
    <div className={`min-w-0 rounded-lg border ${color.border} p-1.5 ${basisClass}`}>
      <p className={`mb-1 px-1 text-[11px] font-bold tracking-[0.06em] uppercase ${color.text}`}>
        {stripCuSuffix(area.name)}
        <span className="ml-1 normal-case text-body-text/50">({locations.length})</span>
      </p>
      <div className="grid grid-cols-1 gap-1">
        {locations.map((loc) => (
          <MegaMenuLocationItem key={loc.slug} loc={loc} />
        ))}
      </div>
    </div>
  );
}

function MegaMenuClusterRow({ groups }: { groups: Extract<LocationRow, { kind: "cluster" }>["groups"] }) {
  const widthShares = getClusterWidthShares(groups.map((g) => g.locations.length));

  return (
    <div className="mb-3.5 flex gap-2 last:mb-0">
      {groups.map((g, i) => (
        <MegaMenuClusterCard
          key={g.area.slug}
          area={g.area}
          locations={g.locations}
          colorIndex={g.colorIndex}
          widthShare={widthShares[i]}
        />
      ))}
    </div>
  );
}

export default function LocationsMegaMenu({ solid, isActive }: { solid: boolean; isActive: boolean }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { registerRef, setHoveredKey } = useNavIndicator();
  const { rows } = getGroupedLocations();

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
    setHoveredKey("chi-nhanh");
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
    setHoveredKey(null);
  };

  const stateClasses = isActive
    ? "font-bold text-accent"
    : `font-semibold hover:text-accent ${solid ? "text-ink" : "text-white/90"}`;

  return (
    <div
      ref={(node) => registerRef("chi-nhanh", node)}
      className="relative flex items-center"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        href="/dia-diem"
        className={`text-[14.5px] whitespace-nowrap transition-colors duration-300 ${stateClasses}`}
      >
        Chi nhánh
      </Link>
      <button
        type="button"
        aria-label="Xem danh sách chi nhánh"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center p-1.5 transition-colors duration-300 ${stateClasses}`}
      >
        <ChevronDownIcon className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.22, ease: [0.22, 0.9, 0.32, 1] }}
            className="absolute top-[calc(100%+18px)] left-1/2 z-50 w-[860px] max-w-[92vw] -translate-x-1/2"
          >
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_70px_rgba(11,31,58,0.22)]">
              <div className="scrollbar-thin max-h-[60vh] overflow-y-auto p-5">
                {rows.map((row, i) =>
                  row.kind === "full" ? (
                    <MegaMenuAreaBlock key={row.area.slug} area={row.area} locations={row.locations} />
                  ) : (
                    <MegaMenuClusterRow key={`cluster-${i}`} groups={row.groups} />
                  )
                )}
              </div>
              <div className="flex flex-col items-start gap-3 border-t border-line bg-bg-tint px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary">
                    <MapPinIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[13.5px] text-navy">
                      <span className="font-bold">{ACTIVE_BRANCH_COUNT} chi nhánh</span> - luôn có vị trí
                      phù hợp cho bạn
                    </p>
                    <p className="text-[10px] font-bold tracking-[0.08em] text-body-text/70 uppercase">
                      Hệ thống văn phòng ảo phủ khắp Sài Gòn
                    </p>
                  </div>
                </div>
                <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2.5 sm:w-auto sm:flex-nowrap">
                  <Button
                    href="/tien-ich/tim-goi-phu-hop"
                    variant="link"
                    icon={<SearchIcon className="h-3.5 w-3.5" />}
                    className="!text-[12.5px] !text-primary hover:!text-primary-dark"
                  >
                    Tìm nhanh VPA phù hợp
                  </Button>
                  <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
                    <Button
                      href="tel:0898082188"
                      variant="ghost"
                      icon={<PhoneIcon className="h-3.5 w-3.5" />}
                      className="flex-1 !px-4 !py-2 !text-[12.5px] sm:flex-none"
                    >
                      Gọi ngay
                    </Button>
                    <Button
                      href="/#lead"
                      variant="primary"
                      className="flex-1 !px-4 !py-2 !text-[12.5px] sm:flex-none"
                    >
                      Đặt lịch tham quan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
