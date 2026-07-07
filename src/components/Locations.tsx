import Link from "next/link";
import Reveal, { RevealGroup, RevealItem } from "./Reveal";
import Button from "./Button";

const LOCATIONS = [
  {
    num: "01",
    slug: "dien-bien-phu",
    name: "Điện Biên Phủ, Quận 1",
    address: "Số 95 Điện Biên Phủ, P. Tân Định",
    tag: "Vị trí VIP",
  },
  {
    num: "02",
    slug: "song-thao",
    name: "Sông Thao, Tân Bình",
    address: "Số 10 Sông Thao, P. Tân Sơn Hoà",
    tag: "Trụ sở chính",
  },
  {
    num: "03",
    slug: "nguyen-oanh",
    name: "Nguyễn Oanh, Gò Vấp",
    address: "238-240-242 Nguyễn Oanh, P. Gò Vấp",
  },
  {
    num: "04",
    slug: "yen-the",
    name: "Yên Thế, Tân Bình",
    address: "92 Yên Thế, P. Tân Sơn Hòa",
  },
  {
    num: "05",
    slug: "cong-hoa",
    name: "Cộng Hoà, Tân Bình",
    address: "123 Cộng Hoà, P. Bảy Hiền",
  },
  {
    num: "06",
    slug: "cmt8",
    name: "CMT8, Quận 10",
    address: "283/26-28 CMT8, P. Hoà Hưng",
  },
];

export default function Locations() {
  return (
    <section id="locations" className="bg-bg-tint py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[520px] text-left">
            <span className="mb-4 inline-flex items-center gap-2 text-[12.5px] font-bold tracking-[0.14em] text-primary uppercase before:h-[2px] before:w-[22px] before:rounded-full before:bg-accent">
              Chi nhánh
            </span>
            <h2 className="mb-3.5 font-display text-[28px] leading-[1.2] font-extrabold text-navy sm:text-[34px] lg:text-[40px]">
              12 chi nhánh tại TP.HCM
            </h2>
            <p className="text-[16.5px] text-body-text">
              Từ Tân Bình, Gò Vấp, Tân Phú, Quận 10 đến trung tâm Quận 1 —
              chọn địa chỉ gần đối tác, khách hàng hoặc thuận tiện nhất cho
              đội ngũ của bạn.
            </p>
          </div>
          <Button href="/dia-diem" variant="ghost">
            Xem tất cả 12 chi nhánh
          </Button>
        </Reveal>
        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LOCATIONS.map((loc) => (
            <RevealItem key={loc.num} y={18}>
              <Link
                href={`/locations/${loc.slug}`}
                className="group flex gap-4 rounded-2xl border border-line bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
              >
                <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-bg-tint font-mono text-[13px] font-bold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  {loc.num}
                </div>
                <div>
                  <h4 className="mb-1 text-[15.5px] font-bold text-navy">
                    {loc.name}
                  </h4>
                  <p className="text-[13.5px] text-body-text">{loc.address}</p>
                  {loc.tag && (
                    <span className="mt-2.5 inline-block rounded-full bg-accent/8 px-2.5 py-1 text-[11.5px] font-bold text-accent">
                      {loc.tag}
                    </span>
                  )}
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
