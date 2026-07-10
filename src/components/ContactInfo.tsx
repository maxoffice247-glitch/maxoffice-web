import { PhoneIcon, BuildingIcon, CalendarIcon } from "./icons";
import BrandIcon from "./BrandIcon";

const CHANNELS = [
  {
    icon: PhoneIcon,
    label: "Hotline",
    value: "089 8082 188 – 0932 357 357",
    href: "tel:0898082188",
  },
  {
    icon: BuildingIcon,
    label: "Email",
    value: "cskh@maxoffice.vn",
    href: "mailto:cskh@maxoffice.vn",
  },
];

export default function ContactInfo() {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="rounded-2xl border border-line bg-white p-7">
        <h3 className="mb-5 text-[17px] font-bold text-navy">Thông tin liên hệ</h3>
        <ul className="space-y-4">
          {CHANNELS.map((c) => (
            <li key={c.label}>
              <a href={c.href} className="group flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                  <c.icon className="h-[18px] w-[18px]" />
                </span>
                <span>
                  <span className="block text-[12px] font-bold tracking-wide text-body-text uppercase">
                    {c.label}
                  </span>
                  <span className="block text-[14.5px] font-bold text-navy">{c.value}</span>
                </span>
              </a>
            </li>
          ))}
          <li>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                <BuildingIcon className="h-[18px] w-[18px]" />
              </span>
              <span>
                <span className="block text-[12px] font-bold tracking-wide text-body-text uppercase">
                  Trụ sở chính
                </span>
                <span className="block text-[14.5px] font-bold text-navy">
                  Số 10 Sông Thao, P. Tân Sơn Hoà, TP.HCM
                </span>
              </span>
            </div>
          </li>
          <li>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                <CalendarIcon className="h-[18px] w-[18px]" />
              </span>
              <span>
                <span className="block text-[12px] font-bold tracking-wide text-body-text uppercase">
                  Giờ làm việc
                </span>
                <span className="block text-[14.5px] font-bold text-navy">
                  Thứ 2 – Thứ 7: 8:00 – 17:30
                </span>
              </span>
            </div>
          </li>
        </ul>
      </div>

      <div className="rounded-2xl bg-gradient-to-tr from-navy to-primary-dark p-7">
        <h3 className="mb-4 text-[15px] font-bold text-white">
          Cần hỗ trợ ngay?
        </h3>
        <div className="flex flex-col gap-3">
          <a
            href="https://zalo.me/0898082188"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-[14px] font-bold text-white transition-colors duration-200 hover:bg-white/20"
          >
            <BrandIcon type="zalo" className="h-8 w-8" />
            Chat qua Zalo
          </a>
          <a
            href="https://www.facebook.com/maxoffice.hcm/"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-[14px] font-bold text-white transition-colors duration-200 hover:bg-white/20"
          >
            <BrandIcon type="messenger" className="h-8 w-8" />
            Chat qua Messenger
          </a>
        </div>
      </div>
    </div>
  );
}
