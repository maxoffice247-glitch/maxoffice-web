"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon, MapPinIcon, PhoneIcon, SearchIcon } from "./icons";
import Button from "./Button";
import { stripLocationNameCuSuffix, ACTIVE_BRANCH_COUNT, type LocationListItem } from "@/lib/locationsData";
import { getDefaultLocationsMenuLayout } from "@/lib/locationsMenuLayout";
import { getCheapestPriceForLocation, formatVoPriceShort } from "@/lib/virtualOfficePlans";
import { useNavIndicator } from "./NavIndicator";
import { useDropdownKeyboardClose } from "./useDropdownKeyboardClose";

function MegaMenuLocationItem({ loc, areaBadge }: { loc: LocationListItem; areaBadge?: string }) {
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
        <span className="block text-[13px] leading-snug font-bold text-navy">{stripLocationNameCuSuffix(loc.name)}</span>
        <span className="block truncate text-[11.5px] text-body-text">{loc.shortAddress}</span>
        {price !== undefined && (
          <span className="mt-0.5 block text-[11px] text-body-text">
            Từ <span className="text-accent font-bold italic">{formatVoPriceShort(price)}/tháng</span>
          </span>
        )}
        <span className="mt-1 flex flex-wrap gap-1">
          {loc.tag && (
            <span className="inline-block rounded-full bg-amber/12 px-2 py-0.5 text-[10px] font-bold text-amber-dark">
              {loc.tag}
            </span>
          )}
          {areaBadge && (
            <span className="inline-block rounded-full bg-primary-tint px-2 py-0.5 text-[10px] font-bold text-primary">
              {areaBadge}
            </span>
          )}
        </span>
      </span>
    </Link>
  );
}

export default function LocationsMegaMenu({ solid, isActive }: { solid: boolean; isActive: boolean }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const { registerRef, setHoveredKey } = useNavIndicator();

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
    setHoveredKey("chi-nhanh");
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
    setHoveredKey(null);
  };
  // Escape hoặc Tab ra khỏi vùng dropdown đều đóng menu (bổ sung lối đóng
  // bằng bàn phím cho cả dropdown này — trước đây chỉ đóng qua
  // handleLeave hẹn giờ, dành cho chuột).
  useDropdownKeyboardClose(open, () => setOpen(false), rootRef);

  // Bố cục 2 dải trung tâm/ngoại ô, cột cân bằng — tính từ dữ liệu tĩnh (xem locationsMenuLayout.ts), không đo DOM nên không nhảy bố cục. Chỉ tính khi menu MỞ (lần
  // đầu ~10ms rồi nhớ lại) để không cộng thêm việc cho luồng chính lúc tải trang — menu này được hydrate ngay cả khi chưa ai mở.
  const bands = open ? getDefaultLocationsMenuLayout() : [];

  const stateClasses = isActive
    ? "font-bold text-accent"
    : `font-semibold hover:text-accent ${solid ? "text-ink" : "text-white/90"}`;

  return (
    <div
      ref={(node) => {
        registerRef("chi-nhanh", node);
        rootRef.current = node;
      }}
      // KHÔNG đặt `relative` ở đây: để panel (absolute) neo vào cả dải điều hướng (NavIndicatorProvider đã `relative`) và canh giữa theo dải đó — panel rộng 1040px canh
      // theo riêng nút "Chi nhánh" sẽ tràn mép trái ở màn 1280px. Vị trí dọc không đổi vì dải điều hướng và nút cao bằng nhau.
      className="flex items-center"
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
            className="absolute top-[calc(100%+18px)] left-1/2 z-50 w-[1040px] max-w-[94vw] -translate-x-1/2"
          >
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_70px_rgba(11,31,58,0.22)]">
              {/* Cao tối đa theo màn hình (header ~76px + khoảng hở 18px + thanh chân menu ~72px); thấp hơn nội dung thì cuộn trong menu. */}
              <div className="scrollbar-thin max-h-[calc(100vh-12rem)] overflow-y-auto p-5">
                {bands.map((band, bi) => (
                  <div key={band.zone} className={bi > 0 ? "mt-5 border-t border-line pt-5" : ""}>
                    <p className="mb-3 px-1 text-[11px] font-bold tracking-[0.1em] text-primary uppercase">{band.label}</p>
                    <div className="grid grid-cols-4 items-start gap-x-3">
                      {band.columns.map((col, ci) => (
                        <div key={ci} className="flex min-w-0 flex-col gap-3.5">
                          {col.map((seg) => (
                            <div key={`${seg.area.slug}-${seg.continued ? "tiep" : "dau"}`}>
                              <p className="mb-1.5 px-1 text-[11px] font-bold tracking-[0.08em] text-body-text/70 uppercase">
                                {seg.area.name}
                                {seg.continued && <span className="ml-1 font-semibold tracking-normal normal-case text-body-text/50">· tiếp</span>}
                              </p>
                              <div className="flex flex-col gap-1">
                                {seg.locations.map((loc) => (
                                  <MegaMenuLocationItem key={loc.slug} loc={loc} />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
