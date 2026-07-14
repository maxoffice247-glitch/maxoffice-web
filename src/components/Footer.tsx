import Image from "next/image";
import Link from "next/link";
import { PhoneIcon, FacebookIcon } from "./icons";
import BrandIcon from "./BrandIcon";

const SERVICE_LINKS = [
  "Văn phòng ảo",
  "Văn phòng trọn gói",
  "Chỗ ngồi linh động",
  "Phòng họp theo giờ",
  "Thành lập doanh nghiệp",
  "Kế toán & thuế",
];

const COMPANY_LINKS = [
  { label: "Về chúng tôi", href: "/ve-chung-toi" },
  { label: "Chi nhánh", href: "/dia-diem" },
  { label: "Tiện ích", href: "/tien-ich" },
  { label: "Bảng giá", href: "/bang-gia" },
  { label: "Liên hệ", href: "/lien-he" },
  { label: "Kiến thức", href: "/knowledge-center" },
  { label: "Blog", href: "/blog" },
];

export default function Footer() {
  return (
    <footer className="relative bg-navy pt-9 pb-36 text-white/75 sm:pb-7">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary via-accent to-primary-dark" />
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="mb-12 grid grid-cols-1 gap-10 sm:mb-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <div className="relative mb-5 h-10 w-[170px]">
              <Image
                src="/images/logo-white.png"
                alt="MAX OFFICE"
                fill
                sizes="170px"
                className="object-contain object-left"
              />
            </div>
            <p className="text-[13.5px] leading-loose text-white/55">
              Công ty TNHH MAX Office
              <br />
              Số 10 Sông Thao, Phường Tân Sơn Hòa, Tp.HCM
              <br />
              GCNDKDN: 0317502009 do Sở Tài Chính - Tp. Hồ Chí Minh
              <br />
              Cấp ngày 03/10/2022
              <br />
              <br />
              Hotline: 089 8082 188 – 0932 357 357
              <br />
              Email: cskh@maxoffice.vn
            </p>
          </div>
          <div>
            <h2 className="mb-5 text-sm font-bold tracking-wide text-white">
              Dịch vụ
            </h2>
            <ul className="space-y-3">
              {SERVICE_LINKS.map((label) => (
                <li key={label} className="text-[13.5px]">
                  <Link
                    href="/#services"
                    className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-5 text-sm font-bold tracking-wide text-white">
              Công ty
            </h2>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label} className="text-[13.5px]">
                  <Link
                    href={link.href}
                    className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-5 text-sm font-bold tracking-wide text-white">
              Kết nối
            </h2>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="https://zalo.me/0898082188"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2.5 text-[13.5px] transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  <BrandIcon type="zalo" className="h-8 w-8" />
                  089 8082 188
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/maxoffice.hcm/"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2.5 text-[13.5px] transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  <BrandIcon type="messenger" className="h-8 w-8" />
                  Messenger
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/maxoffice.hcm/"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2.5 text-[13.5px] transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <FacebookIcon className="h-4 w-4" />
                  </span>
                  Fanpage Facebook
                </a>
              </li>
              <li>
                <a
                  href="tel:0898082188"
                  className="flex items-center gap-2.5 text-[13.5px] transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <PhoneIcon className="h-4 w-4" />
                  </span>
                  089 8082 188
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/12 pt-6 text-[12.5px] text-white/55">
          <span>© 2026 Công Ty TNHH MAX OFFICE. Tất cả các quyền được bảo lưu.</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            <Link href="/chinh-sach-bao-mat" className="transition-colors duration-200 hover:text-white">
              Chính sách bảo mật
            </Link>
            <Link href="/dieu-khoan-su-dung" className="transition-colors duration-200 hover:text-white">
              Điều khoản sử dụng
            </Link>
            <span>Thiết kế bởi MAX OFFICE Digital</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
