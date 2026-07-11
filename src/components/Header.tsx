"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PhoneIcon, MenuIcon, CloseIcon, SearchIcon } from "./icons";
import Button from "./Button";
import { useSearch } from "./SearchContext";
import { NavIndicatorProvider, NavLink } from "./NavIndicator";

// Dropdown panel content only — split out of Header's own chunk (loaded on
// every page) since the panels stay closed until hover/click. Server-rendered
// by default (no ssr:false) so their internal links stay crawlable.
const MegaMenu = dynamic(() => import("./MegaMenu"));
const ToolsMegaMenu = dynamic(() => import("./ToolsMegaMenu"));
const LocationsMegaMenu = dynamic(() => import("./LocationsMegaMenu"));

// The logo already links home (see the <Link href="/"> wrapping it below),
// so "Trang chủ" is intentionally not repeated in either nav list.
//
// Keys for the 3 dropdown items ("dich-vu", "chi-nhanh", "tien-ich") are
// semantic group ids rather than a single href, since each dropdown's
// content spans multiple route prefixes (e.g. "Dịch vụ" covers both the
// /dich-vu hub and every /services/* detail page).
const NAV_MATCHERS: { key: string; prefixes: string[] }[] = [
  { key: "/ve-chung-toi", prefixes: ["/ve-chung-toi"] },
  { key: "dich-vu", prefixes: ["/dich-vu", "/services"] },
  { key: "chi-nhanh", prefixes: ["/dia-diem", "/locations"] },
  { key: "tien-ich", prefixes: ["/tien-ich"] },
  { key: "/knowledge-center", prefixes: ["/knowledge-center", "/blog"] },
  { key: "/bang-gia", prefixes: ["/bang-gia"] },
  { key: "/lien-he", prefixes: ["/lien-he"] },
];

function matchActiveKey(pathname: string): string | null {
  const hit = NAV_MATCHERS.find((m) =>
    m.prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`)),
  );
  return hit?.key ?? null;
}

const NAV_LINKS_MOBILE = [
  { key: "/ve-chung-toi", label: "Về chúng tôi", href: "/ve-chung-toi" },
  { key: "dich-vu", label: "Dịch vụ", href: "/dich-vu" },
  { key: "chi-nhanh", label: "Chi nhánh", href: "/dia-diem" },
  { key: "tien-ich", label: "Tiện ích", href: "/tien-ich" },
  { key: "/knowledge-center", label: "Kiến thức", href: "/knowledge-center" },
  { key: "/bang-gia", label: "Bảng giá", href: "/bang-gia" },
  { key: "/lien-he", label: "Liên hệ", href: "/lien-he" },
];

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { setOpen: setSearchOpen } = useSearch();
  const pathname = usePathname();
  const activeKey = matchActiveKey(pathname);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
          solid
            ? "bg-white/95 py-3 shadow-[0_1px_0_rgba(15,27,45,0.06)] backdrop-blur-md"
            : "bg-transparent py-4 sm:py-5"
        }`}
      >
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8">
          <Link href="/" className="relative flex h-9 w-[150px] shrink-0 items-center sm:h-10 sm:w-[168px]">
            <Image
              src="/images/logo-white.png"
              alt="MAX OFFICE"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="168px"
              className={`object-contain object-left transition-opacity duration-300 ${solid ? "opacity-0" : "opacity-100"}`}
            />
            <Image
              src="/images/logo-red.png"
              alt="MAX OFFICE"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="168px"
              className={`object-contain object-left transition-opacity duration-300 ${solid ? "opacity-100" : "opacity-0"}`}
            />
          </Link>

          <NavIndicatorProvider activeKey={activeKey}>
            <NavLink
              href="/ve-chung-toi"
              label="Về chúng tôi"
              solid={solid}
              isActive={activeKey === "/ve-chung-toi"}
            />
            <MegaMenu solid={solid} isActive={activeKey === "dich-vu"} />
            <LocationsMegaMenu solid={solid} isActive={activeKey === "chi-nhanh"} />
            <ToolsMegaMenu solid={solid} isActive={activeKey === "tien-ich"} />
            <NavLink
              href="/knowledge-center"
              label="Kiến thức"
              solid={solid}
              isActive={activeKey === "/knowledge-center"}
            />
            <NavLink
              href="/bang-gia"
              label="Bảng giá"
              solid={solid}
              isActive={activeKey === "/bang-gia"}
            />
            <NavLink
              href="/lien-he"
              label="Liên hệ"
              solid={solid}
              isActive={activeKey === "/lien-he"}
            />
          </NavIndicatorProvider>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              aria-label="Tìm kiếm"
              onClick={() => setSearchOpen(true)}
              className={`hidden h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 sm:flex ${
                solid ? "text-navy hover:bg-bg-tint" : "text-white hover:bg-white/10"
              }`}
            >
              <SearchIcon className="h-[18px] w-[18px]" />
            </button>
            <Button
              href="tel:0898082188"
              variant="primary"
              icon={
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span aria-hidden className="animate-header-phone-ring absolute inset-0 rounded-full" />
                  <PhoneIcon className="animate-header-phone-icon relative h-4 w-4" />
                </span>
              }
              className="max-sm:hidden !py-3"
            >
              089 8082 188
            </Button>
            <button
              type="button"
              aria-label="Mở menu"
              onClick={() => setMenuOpen(true)}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 xl:hidden ${
                solid ? "text-navy" : "text-white"
              }`}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay — kept outside <header> so backdrop-blur on the
          solid header state cannot create a containing block that clips this
          fixed-position layer to the header's own height. */}
      <div
        className={`fixed inset-0 z-[110] bg-navy transition-opacity duration-300 xl:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 sm:px-8">
          <div className="relative h-9 w-[150px]">
            <Image src="/images/logo-white.png" alt="MAX OFFICE" fill loading="eager" sizes="150px" className="object-contain object-left" />
          </div>
          <button
            type="button"
            aria-label="Đóng menu"
            onClick={() => setMenuOpen(false)}
            className="flex h-10 w-10 items-center justify-center text-white"
          >
            <CloseIcon />
          </button>
        </div>
        <nav aria-label="Menu di động" className="flex flex-col gap-1 px-5 py-6 sm:px-8">
          {NAV_LINKS_MOBILE.map((link) => {
            const isActive = activeKey === link.key;
            return (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2.5 border-b border-white/10 py-4 text-lg transition-colors ${
                  isActive
                    ? "-mx-5 bg-accent/15 px-5 font-bold text-accent sm:-mx-8 sm:px-8"
                    : "font-semibold text-white/90 hover:text-accent"
                }`}
              >
                {isActive && <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
                {link.label}
              </Link>
            );
          })}
          <a
            href="tel:0898082188"
            onClick={() => setMenuOpen(false)}
            className="mt-6 flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 py-3.5 text-[15px] font-bold text-white transition-colors duration-300 hover:bg-white/20"
          >
            <PhoneIcon />
            089 8082 188
          </a>
          <Button
            href="/#lead"
            variant="primary"
            className="mt-3 w-full"
            onClick={() => setMenuOpen(false)}
          >
            Nhận tư vấn miễn phí
          </Button>
        </nav>
      </div>
    </>
  );
}
