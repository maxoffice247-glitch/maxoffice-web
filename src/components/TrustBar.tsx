import Reveal, { RevealGroup, RevealItem } from "./Reveal";
import { ShieldCheckIcon, BadgePercentIcon, HeadsetIcon, CheckCircleIcon } from "./icons";

const BADGES = [
  {
    icon: ShieldCheckIcon,
    title: "Địa chỉ hợp lệ",
    desc: "Đăng ký kinh doanh & thuế",
  },
  {
    icon: BadgePercentIcon,
    title: "Giá minh bạch",
    desc: "Không phí ẩn phát sinh",
  },
  {
    icon: HeadsetIcon,
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ luôn sẵn sàng",
  },
  {
    icon: CheckCircleIcon,
    title: "Hợp đồng rõ ràng",
    desc: "Điều khoản minh bạch, không mập mờ",
  },
];

const CLIENTS = [
  "Sacombank",
  "Du Lịch Vàng",
  "Thiên Long Việt",
  "Phương Lâm",
  "Thái Dương",
  "Vũ Duy",
  "Thiên Thần",
  "AD Express",
  "Devela",
  "Sơn Lâm",
  "QE Agency",
  "Hồ Trần",
  "ST Beauty",
  "Châu Bình",
  "The Jump Network Việt Nam",
  "Ý Nhi",
  "Nam Việt",
  "Hoin Design",
  "Miền Nam",
  "Lê Minh Seafood",
  "Việt Nam Á Châu",
  "Genomed Vietnam",
  "Tradaco",
  "NTC",
  "Samymed",
  "Golden Shipping",
  "DTH Transport",
  "Hiệp Thành HT",
  "Sky City",
  "Toàn Lộc",
  "Do Archi",
  "Hoàng Group",
  "Meta Việt Nam",
  "Bình Minh",
  "Hòa Thịnh",
  "Thiên Kim",
  "Happy House",
  "Fabric Đại Việt",
  "Hoàng Gia",
  "F&B Quốc Tế",
  "Quốc Hoàng",
  "Hãng Luật Lê Phong",
  "Vinh Sang",
  "Vietlinko",
  "Yến Sào Hồng Phúc",
  "24H Moving",
  "Nam Anh Phát",
  "Cá Voi Đen",
  "GoGoX Việt Nam",
  "Promex",
  "Đại Phúc An",
  "Inox Nam Sài Gòn",
  "3S Solution",
  "BIFA",
  "Đắc Hòa An",
  "Viện Nghiên Cứu Chính Sách Và Phát Triển Bền Vững",
  "Amoda",
  "Thiên An",
  "Hoàng Khang",
  "Nhất Nguyên",
  "Chính Vy",
  "Vương Khôi",
  "Thành Công",
  "Lan Hương",
  "Đức Minh DM",
  "Dương An",
  "Quốc Bá",
  "Đại Phát Vina",
  "Đông Liên",
  "Việt Á Châu",
  "Phan Sơn",
  "Ngọc San",
  "Dương Đông",
  "DIC",
  "Anh Thơ",
  "Liên Việt VN",
  "Ánh Dương Power",
  "Hương Lê",
  "96 Design",
  "Lam Sơn",
  "Thanh Tùng",
  "Ngọc Duyên",
  "Việt Nam Tour",
  "SkyBox",
  "SG Thiên Minh",
  "Vận Tải TC",
  "Heng Tai",
  "PXD",
  "Ningbo Grandsense Consulting",
];

export default function TrustBar() {
  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <RevealGroup className="grid grid-cols-2 gap-4 border-b border-line pb-9 sm:grid-cols-4 sm:gap-6">
          {BADGES.map((badge) => (
            <RevealItem key={badge.title} y={16}>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                  <badge.icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[13.5px] font-bold text-navy">{badge.title}</div>
                  <div className="text-[12px] text-body-text">{badge.desc}</div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="pt-9">
          <p className="mb-6 text-center text-[12px] font-bold tracking-[0.14em] text-body-text uppercase">
            Được tin dùng bởi hơn 500 doanh nghiệp
          </p>
          <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div className="flex w-max items-center gap-x-10 will-change-transform animate-marquee group-hover:[animation-play-state:paused]">
              {[...CLIENTS, ...CLIENTS].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="shrink-0 font-display text-[15px] font-extrabold tracking-tight whitespace-nowrap text-navy/35 transition-colors duration-300 hover:text-navy/70"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
