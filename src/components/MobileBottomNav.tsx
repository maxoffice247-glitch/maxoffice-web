"use client";

import { useSearch } from "./SearchContext";
import { SearchIcon, PhoneIcon } from "./icons";
import BrandIcon from "./BrandIcon";

export default function MobileBottomNav() {
  const { setOpen } = useSearch();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[95] grid grid-cols-4 border-t border-line bg-white/95 backdrop-blur-md sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Điều hướng nhanh"
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center gap-1 py-2.5 text-body-text transition-colors duration-200 active:text-primary"
      >
        <SearchIcon className="h-5 w-5" />
        <span className="text-[10.5px] font-semibold">Tìm kiếm</span>
      </button>
      <a
        href="tel:0898082188"
        className="flex flex-col items-center justify-center gap-1 py-2.5 text-body-text transition-colors duration-200 active:text-accent"
      >
        <PhoneIcon className="h-5 w-5" />
        <span className="text-[10.5px] font-semibold">Gọi điện</span>
      </a>
      <a
        href="https://zalo.me/0898082188"
        target="_blank"
        rel="noopener"
        className="flex flex-col items-center justify-center gap-1 py-2.5 text-body-text transition-colors duration-200 active:text-primary"
      >
        <BrandIcon type="zalo" className="h-5 w-5" sizes="20px" />
        <span className="text-[10.5px] font-semibold">Zalo</span>
      </a>
      <a
        href="https://www.facebook.com/maxoffice.hcm/"
        target="_blank"
        rel="noopener"
        className="flex flex-col items-center justify-center gap-1 py-2.5 text-body-text transition-colors duration-200 active:text-primary"
      >
        <BrandIcon type="messenger" className="h-5 w-5" sizes="20px" />
        <span className="text-[10.5px] font-semibold">Messenger</span>
      </a>
    </nav>
  );
}
