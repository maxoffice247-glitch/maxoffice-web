import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHead from "@/components/SectionHead";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import BookingFormSection from "@/components/BookingFormSection";
import { BuildingIcon, MapPinIcon, ArrowRightSmallIcon, CheckCircleIcon } from "@/components/icons";
import { LOCATIONS_LIST } from "@/lib/locationsData";
import { VIRTUAL_OFFICE_PLANS, getLocationsForPlan } from "@/lib/virtualOfficePlans";

export const metadata: Metadata = {
  alternates: { canonical: "/van-phong-ao-gia-re" },
  title: "Văn Phòng Ảo Giá Tốt — Từ 299.000đ/Tháng | MAX OFFICE",
  description:
    "Gói văn phòng ảo LITE giá thấp nhất hệ thống MAX OFFICE — 299.000đ/tháng, khả dụng tại 5 chi nhánh: Hoàng Việt, Bàu Cát 2, Lam Sơn, Hoàng Kế Viêm, CMT8. Địa chỉ đăng ký kinh doanh hợp lệ, phù hợp doanh nghiệp mới thành lập.",
};

const LITE = VIRTUAL_OFFICE_PLANS.lite;
const liteSlugs = getLocationsForPlan("lite");
const liteLocations = LOCATIONS_LIST.filter((loc) => liteSlugs.includes(loc.slug));

/** Mô hình lễ tân thực tế khác nhau theo chi nhánh — không phải mọi nơi đều có quầy lễ tân riêng của MAX OFFICE. */
const RECEPTION_NOTE: Record<string, string> = {
  "hoang-viet": "Lễ tân MAX OFFICE trực tại quầy, tiếp nhận thư từ và đón khách",
  "bau-cat": "Lễ tân MAX OFFICE trực tại quầy, tiếp nhận thư từ và đón khách",
  "lam-son": "Nhân viên toà nhà tiếp nhận thư từ, bưu phẩm",
  "hoang-ke-viem": "Nhân viên toà nhà tiếp nhận thư từ, bưu phẩm",
  cmt8: "Nhân viên toà nhà tiếp nhận thư từ, bưu phẩm",
};

/** Chỉ 3/5 chi nhánh LITE có khu vực tiếp khách riêng biệt (sofa, bàn tiếp khách). */
const HAS_GUEST_AREA = new Set(["hoang-viet", "bau-cat", "hoang-ke-viem"]);

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default function VanPhongAoGiaRePage() {
  return (
    <main>
      <PageHero
        image="/images/hero-bang-gia.jpg"
        eyebrow="Văn phòng ảo giá tốt"
        title="Văn phòng ảo giá tốt — Từ 299.000đ/tháng"
        description="Gói LITE — mức giá khởi điểm thấp nhất trong toàn hệ thống MAX OFFICE, khả dụng tại 5 chi nhánh khu vực Tân Bình và Quận 10."
      />
      <Breadcrumb items={[{ label: "Văn phòng ảo giá tốt" }]} />

      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="mb-12 max-w-[760px]">
            <p className="text-justify-vn text-[15.5px] leading-relaxed text-body-text">
              Gói <span className="font-bold text-navy">LITE</span> là gói văn phòng ảo có mức giá khởi
              điểm thấp nhất trong toàn bộ hệ thống MAX OFFICE — chỉ <span className="font-bold text-primary">{formatVND(LITE.price)}{LITE.duration}</span>,
              bao gồm địa chỉ đăng ký kinh doanh (ĐKKD) hợp lệ, lễ tân, wifi và quyền tham gia workshop.
              Đây là lựa chọn phù hợp nhất cho doanh nghiệp mới thành lập hoặc hộ kinh doanh cá thể muốn
              tối ưu chi phí vận hành ngay từ giai đoạn đầu, mà vẫn có địa chỉ pháp lý hợp lệ để đăng ký
              kinh doanh và đăng ký thuế. Gói LITE hiện khả dụng tại {liteLocations.length} chi nhánh dưới
              đây — chọn địa chỉ gần bạn nhất hoặc phù hợp nhất với nhu cầu của doanh nghiệp.
            </p>
          </div>

          <SectionHead
            eyebrow="Chi nhánh áp dụng gói LITE"
            title={`${liteLocations.length} chi nhánh đang có gói LITE ${formatVND(LITE.price)}${LITE.duration}`}
            description="Giá và phí bảng hiệu niêm yết minh bạch — không phát sinh chi phí ẩn."
          />

          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {liteLocations.map((loc) => (
              <RevealItem key={loc.slug} y={18}>
                <div className="flex h-full flex-col gap-4 rounded-2xl border border-line bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-card">
                  <div className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary">
                      <MapPinIcon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="mb-1 text-[15.5px] font-bold text-navy">{loc.name}</h3>
                      <p className="text-[13px] text-body-text">{loc.shortAddress}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-bg-tint p-4">
                    <div>
                      <p className="mb-1 text-[11px] font-semibold tracking-wide text-body-text uppercase">
                        Giá thuê
                      </p>
                      <p className="font-mono text-[19px] leading-tight font-bold text-primary">
                        {formatVND(LITE.price)}
                      </p>
                      <p className="text-[11px] text-body-text">/ tháng</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-semibold tracking-wide text-body-text uppercase">
                        Phí bảng hiệu
                      </p>
                      <p className="font-mono text-[19px] leading-tight font-bold text-accent">
                        {formatVND(LITE.addOn!.price)}
                      </p>
                      <p className="text-[11px] text-body-text">
                        Thu DUY NHẤT 1 LẦN, không thu lại khi gia hạn
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-1.5">
                    {LITE.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-[12.5px] text-body-text">
                        <CheckCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        {f === "Lễ tân" ? RECEPTION_NOTE[loc.slug] : f}
                      </li>
                    ))}
                    {HAS_GUEST_AREA.has(loc.slug) && (
                      <li className="flex items-start gap-1.5 text-[12.5px] text-body-text">
                        <CheckCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        Khu vực tiếp khách riêng
                      </li>
                    )}
                  </ul>

                  <Link
                    href={`/locations/${loc.slug}`}
                    className="group mt-auto inline-flex items-center gap-1.5 text-[13px] font-bold text-primary"
                  >
                    Xem chi tiết chi nhánh
                    <ArrowRightSmallIcon className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-bg-tint p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary">
              <BuildingIcon className="h-5 w-5" />
            </span>
            <p className="flex-1 text-[13.5px] leading-relaxed text-body-text">
              <span className="font-bold text-navy">Phí bảng hiệu: {formatVND(LITE.addOn!.price)}</span> — thu{" "}
              <span className="font-bold text-accent">DUY NHẤT 1 LẦN</span> khi làm bảng hiệu ban đầu,{" "}
              <span className="font-bold text-accent">KHÔNG thu lại</span> khi gia hạn hợp đồng các kỳ sau.
              Đây là phụ phí chỉ áp dụng nếu doanh nghiệp cần treo bảng hiệu công ty tại toà nhà, không bắt
              buộc với mọi trường hợp đăng ký kinh doanh.
            </p>
          </div>
        </div>
      </section>

      <BookingFormSection
        sectionTitle="Nhận tư vấn gói LITE phù hợp với bạn"
        sectionDescription="Để lại thông tin, đội ngũ MAX OFFICE sẽ tư vấn chi nhánh phù hợp và sắp xếp lịch tham quan miễn phí."
        formType="Văn phòng ảo giá tốt"
      />
    </main>
  );
}
