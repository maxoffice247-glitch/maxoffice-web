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

/** Card 1 chi nhánh trong dropdown — CHỈ dùng ở đây (không dùng chung với
    LocationCard.tsx của /dia-diem, nên thu gọn thoải mái không ảnh hưởng
    trang chính). Cô đọng còn tên + giá — bỏ hẳn dòng địa chỉ đầy đủ (khách
    lướt dropdown để tìm nhanh ĐÚNG khu vực/mức giá, không cần xem địa chỉ
    chi tiết ngay tại đây — bấm vào là sang thẳng trang chi nhánh có đủ).
    Padding/icon/cỡ chữ đều giảm so với bản cũ để tăng mật độ thông tin. */
function MegaMenuLocationItem({ loc }: { loc: LocationListItem }) {
  const price = getCheapestPriceForLocation(loc.slug);
  return (
    <Link
      href={`/locations/${loc.slug}`}
      className="group flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors duration-200 hover:bg-bg-tint"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
        <MapPinIcon className="h-3 w-3" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-1.5">
          <span className="truncate text-[11.5px] leading-tight font-bold text-navy">{loc.name}</span>
          {loc.tag && (
            <span className="shrink-0 rounded-full bg-amber/12 px-1.5 py-px text-[9px] font-bold whitespace-nowrap text-amber-dark">
              {loc.tag}
            </span>
          )}
        </span>
        {price !== undefined && (
          <span className="block text-[10px] leading-tight text-body-text">
            Từ <span className="text-accent font-bold italic">{formatVoPriceShort(price)}/tháng</span>
          </span>
        )}
      </span>
    </Link>
  );
}

/** 1 khu vực >2 chi nhánh — chiếm trọn 1 "hàng" riêng trong danh sách cuộn:
    tiêu đề nhỏ viết hoa + lưới 2-3 cột. Đã thu gọn khoảng cách/cỡ chữ so
    với bản trước (xem doc comment chung ở cuối file) — CHƯA từng có khung
    viền nên không cần bỏ gì ở khối này, chỉ giảm mb/gap/font. */
function MegaMenuAreaBlock({ area, locations }: { area: { slug: string; name: string }; locations: LocationListItem[] }) {
  return (
    <div className="mb-2 last:mb-0">
      <p className="mb-1 px-1 text-[10px] font-bold tracking-[0.06em] text-body-text/70 uppercase">
        {stripCuSuffix(area.name)}
        <span className="ml-1 normal-case text-body-text/50">({locations.length})</span>
      </p>
      <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-3">
        {locations.map((loc) => (
          <MegaMenuLocationItem key={loc.slug} loc={loc} />
        ))}
      </div>
    </div>
  );
}

/** 1 khu vực ≤2 chi nhánh bên trong 1 hàng ghép — vẫn ĐỒNG BỘ nguyên tắc
    màu với /dia-diem (viền/chữ cùng 1 tông, xem locationClusterColors.ts),
    NHƯNG bỏ hẳn khung viền bao quanh 4 cạnh (khác /dia-diem — /dia-diem
    giữ nguyên, không đổi) — dropdown ưu tiên mật độ, không phải "duyệt kỹ"
    như trang riêng, nên chỉ còn 1 DẢI MÀU MẢNH (border-l-2) ngay cạnh dòng
    tiêu đề để vẫn nhận ra ranh giới màu, không bọc cả khối chi nhánh bên
    dưới trong 1 hộp riêng nữa. */
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
    <div className={`min-w-0 ${basisClass}`}>
      <p className={`mb-1 border-l-2 py-px pl-1.5 text-[10px] font-bold tracking-[0.06em] uppercase ${color.border} ${color.text}`}>
        {stripCuSuffix(area.name)}
        <span className="ml-1 normal-case text-body-text/50">({locations.length})</span>
      </p>
      <div className="grid grid-cols-1 gap-0.5">
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
    <div className="mb-2 flex gap-3 last:mb-0">
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
              {/* p-3.5 (trước p-5) — giảm viền đệm quanh toàn bộ danh sách
                  khu vực, cộng dồn với việc thu gọn từng khối bên trong
                  (xem các component ở trên) để giảm tổng chiều cao dropdown
                  đáng kể. Không đụng /dia-diem — panel này chỉ tồn tại
                  trong dropdown. */}
              <div className="scrollbar-thin max-h-[60vh] overflow-y-auto p-3.5">
                {rows.map((row, i) =>
                  row.kind === "full" ? (
                    <MegaMenuAreaBlock key={row.area.slug} area={row.area} locations={row.locations} />
                  ) : (
                    <MegaMenuClusterRow key={`cluster-${i}`} groups={row.groups} />
                  )
                )}
              </div>
              <div className="flex flex-col items-start gap-2.5 border-t border-line bg-bg-tint px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary">
                    <MapPinIcon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[12.5px] text-navy">
                      <span className="font-bold">{ACTIVE_BRANCH_COUNT} chi nhánh</span> - luôn có vị trí
                      phù hợp cho bạn
                    </p>
                    <p className="text-[9.5px] font-bold tracking-[0.08em] text-body-text/70 uppercase">
                      Hệ thống văn phòng ảo phủ khắp Sài Gòn
                    </p>
                  </div>
                </div>
                <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 sm:w-auto sm:flex-nowrap">
                  <Button
                    href="/tien-ich/tim-goi-phu-hop"
                    variant="link"
                    icon={<SearchIcon className="h-3.5 w-3.5" />}
                    className="!text-[12px] !text-primary hover:!text-primary-dark"
                  >
                    Tìm nhanh VPA phù hợp
                  </Button>
                  <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
                    <Button
                      href="tel:0898082188"
                      variant="ghost"
                      icon={<PhoneIcon className="h-3.5 w-3.5" />}
                      className="flex-1 !px-3.5 !py-1.5 !text-[12px] sm:flex-none"
                    >
                      Gọi ngay
                    </Button>
                    <Button
                      href="/#lead"
                      variant="primary"
                      className="flex-1 !px-3.5 !py-1.5 !text-[12px] sm:flex-none"
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
