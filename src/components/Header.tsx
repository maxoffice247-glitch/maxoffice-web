"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PhoneIcon, MenuIcon, CloseIcon, SearchIcon } from "./icons";
import Button from "./Button";
import MegaMenu from "./MegaMenu";
import ToolsMegaMenu from "./ToolsMegaMenu";
import { useSearch } from "./SearchContext";

const NAV_LINKS_BEFORE = [
  { label: "Trang chủ", href: "/" },
  { label: "Về chúng tôi", href: "/ve-chung-toi" },
];

const NAV_LINKS_MIDDLE = [{ label: "Địa điểm", href: "/dia-diem" }];

const NAV_LINKS_AFTER = [
  { label: "Kiến thức", href: "/knowledge-center" },
  { label: "Bảng giá", href: "/bang-gia" },
  { label: "Liên hệ", href: "/lien-he" },
];

const NAV_LINKS_MOBILE = [
  { label: "Trang chủ", href: "/" },
  { label: "Về chúng tôi", href: "/ve-chung-toi" },
  { label: "Dịch vụ", href: "/dich-vu" },
  { label: "Địa điểm", href: "/dia-diem" },
  { label: "Tiện ích", href: "/tien-ich" },
  { label: "Kiến thức", href: "/knowledge-center" },
  { label: "Bảng giá", href: "/bang-gia" },
  { label: "Liên hệ", href: "/lien-he" },
];

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { setOpen: setSearchOpen } = useSearch();

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
              priority
              sizes="168px"
              className={`object-contain object-left transition-opacity duration-300 ${solid ? "opacity-0" : "opacity-100"}`}
            />
            <Image
              src="/images/logo-red.png"
              alt="MAX OFFICE"
              fill
              priority
              sizes="168px"
              className={`object-contain object-left transition-opacity duration-300 ${solid ? "opacity-100" : "opacity-0"}`}
            />
          </Link>

          <nav className="hidden items-center gap-5 xl:flex">
            {NAV_LINKS_BEFORE.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[14.5px] font-semibold whitespace-nowrap transition-colors duration-300 hover:text-accent ${
                  solid ? "text-ink" : "text-white/90"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <MegaMenu solid={solid} />
            {NAV_LINKS_MIDDLE.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[14.5px] font-semibold whitespace-nowrap transition-colors duration-300 hover:text-accent ${
                  solid ? "text-ink" : "text-white/90"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <ToolsMegaMenu solid={solid} />
            {NAV_LINKS_AFTER.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[14.5px] font-semibold whitespace-nowrap transition-colors duration-300 hover:text-accent ${
                  solid ? "text-ink" : "text-white/90"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

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
              icon={<PhoneIcon />}
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
            <Image src="/images/logo-white.png" alt="MAX OFFICE" fill sizes="150px" className="object-contain object-left" />
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
        <nav className="flex flex-col gap-1 px-5 py-6 sm:px-8">
          {NAV_LINKS_MOBILE.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/10 py-4 text-lg font-semibold text-white/90 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
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
