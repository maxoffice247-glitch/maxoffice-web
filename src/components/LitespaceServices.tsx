import Link from "next/link";
import SectionHead from "./SectionHead";
import { RevealGroup, RevealItem } from "./Reveal";
import Reveal from "./Reveal";
import QuotePlanMenu from "./QuotePlanMenu";
import LitespacePlanCard from "./LitespacePlanCard";
import {
  BuildingIcon,
  KeyIcon,
  UsersIcon,
  ScreenIcon,
  DocumentCheckIcon,
  CalculatorIcon,
  ArrowRightSmallIcon,
} from "./icons";
import { LITESPACE_PLANS, LITESPACE_VAT_NOTE } from "@/lib/virtualOfficePlans";
import { resolveTimedPromotions, type LocationData } from "@/lib/locationsData";

const OTHER_SERVICES = [
  { slug: "van-phong-tron-goi", icon: KeyIcon, title: "Văn phòng trọn gói", price: "Từ 4.500.000đ/tháng" },
  { slug: "cho-ngoi-linh-dong", icon: UsersIcon, title: "Chỗ ngồi linh động", price: "Từ 2.000.000đ/tháng" },
  { slug: "phong-hop", icon: ScreenIcon, title: "Phòng họp theo giờ", price: "Từ 150.000đ/giờ" },
  {
    slug: "thanh-lap-doanh-nghiep",
    icon: DocumentCheckIcon,
    title: "Thành lập doanh nghiệp",
    price: "Từ 1.299.000đ (kèm văn phòng ảo)",
  },
  { slug: "ke-toan-thue", icon: CalculatorIcon, title: "Kế toán & thuế", price: "Từ 500.000đ/tháng" },
];

/**
 * Bảng giá 3 gói CORE/PLUS/PRO hệ ĐỐI TÁC LiteSpace — hiện dùng cho địa chỉ
 * hợp tác LiteSpace đầu tiên (28 Mai Chí Thọ). Cùng nguồn dữ liệu
 * (LITESPACE_PLANS), chỉ khác tên chi nhánh hiển thị qua prop branchName.
 *
 * KHÁC các hệ giá MAX tự vận hành ở 2 điểm:
 * 1. Thẻ giá có giá gốc gạch ngang + badge "Ưu đãi ra mắt MAX" + câu mô tả
 *    riêng từng gói + khối combo nền vàng chỉ ở gói CORE (xem
 *    LitespacePlanCard.tsx).
 * 2. KHÔNG gộp lưới "Dịch vụ khác" chung với lưới gói (grid-flow-row-dense)
 *    như SilverGoldPremiumServices.tsx — 3 gói LiteSpace cao lệch nhau
 *    nhiều nên lưới gộp sẽ kéo giãn card thấp để lại khoảng trắng lớn (xem
 *    doc comment LitespacePlanCard.tsx). Lưới gói dùng `items-start` (đáy
 *    so le nhẹ), "Dịch vụ khác" là lưới RIÊNG bên dưới.
 *
 * LiteSpace KHÔNG khai báo "dịch vụ bổ sung" riêng nào (khác SGP có ĐKKD
 * 1.296K/khắc dấu 480K của MAX) nên KHÔNG có khối đó ở đây.
 */
export default function LitespaceServices({
  branchName,
  slug,
  promotions,
}: {
  branchName: string;
  /** Slug chi nhánh — dựng link "Tạo báo giá" từng gói tới
      /tien-ich/tim-goi-phu-hop/[slug]/[plan]. */
  slug: string;
  promotions?: LocationData["promotions"];
}) {
  const resolvedPromotions = resolveTimedPromotions(promotions);
  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Dịch vụ tại chi nhánh"
          title={`Bảng giá riêng tại chi nhánh ${branchName}`}
          description={`Chi nhánh ${branchName} áp dụng 3 gói văn phòng ảo CORE, PLUS, PRO (hệ giá đối tác LiteSpace) — khác với hệ thống LITE–RISE chung của MAX OFFICE. Các dịch vụ khác vẫn theo bảng giá chung.`}
        />

        <Reveal className="rounded-2xl border border-line bg-white p-6 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary">
                <BuildingIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-[16px] font-bold text-navy">Văn phòng ảo</h3>
                <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-[11.5px] font-bold text-accent">
                  Giá áp dụng riêng tại chi nhánh {branchName}
                </span>
              </div>
            </div>
            {/* Nút "Tạo báo giá" DUY NHẤT (xem doc comment QuotePlanMenu.tsx). */}
            <div className="flex shrink-0 items-center gap-3">
              <QuotePlanMenu slug={slug} plans={LITESPACE_PLANS} />
              <Link
                href="/services/van-phong-ao#bang-gia"
                className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-bold text-primary hover:gap-2.5"
              >
                Xem chi tiết
                <ArrowRightSmallIcon className="transition-transform duration-200" />
              </Link>
            </div>
          </div>
          {/* Lưới 3 gói — `items-start`: mỗi card cao theo nội dung thật
              (CORE/PLUS/PRO cao lệch nhau, xem doc comment LitespacePlanCard.tsx),
              KHÔNG gộp dày với "Dịch vụ khác" như các hệ giá đồng-chiều-cao. */}
          <RevealGroup className="grid grid-cols-1 items-start gap-5 sm:grid-cols-3">
            {LITESPACE_PLANS.map((plan) => (
              <LitespacePlanCard key={plan.key} plan={plan} />
            ))}
          </RevealGroup>
          <p className="mt-5 text-[12px] text-body-text italic">{LITESPACE_VAT_NOTE}</p>

          {/* Dịch vụ khác — lưới RIÊNG bên dưới (không gộp chung với lưới
              gói vì lý do ở trên). Giữ nguyên card link tóm tắt như các
              component dịch vụ chi nhánh khác. */}
          <p className="mt-8 mb-4 text-[12.5px] font-bold text-navy">Các dịch vụ khác tại chi nhánh</p>
          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {OTHER_SERVICES.map((svc) => (
              <RevealItem key={svc.slug}>
                <Link
                  href={`/services/${svc.slug}#bang-gia`}
                  className="group flex h-full flex-col justify-center rounded-2xl border border-line bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
                >
                  <div>
                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                      <svc.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mb-1.5 text-[15.5px] font-bold text-navy">{svc.title}</h3>
                    <p className="font-mono text-[13.5px] font-bold text-primary">{svc.price}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-accent">
                    Xem chi tiết
                    <ArrowRightSmallIcon className="transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Reveal>

        {resolvedPromotions && resolvedPromotions.length > 0 && (
          <Reveal className="mt-6 rounded-2xl bg-accent/8 p-6 sm:p-7">
            <p className="mb-2 flex items-center gap-1.5 text-[14.5px] font-bold text-navy">
              <span aria-hidden>🎁</span> Khuyến mãi riêng chi nhánh
            </p>
            <ul className="space-y-1.5">
              {resolvedPromotions.map((note) => (
                <li key={note} className="text-[13.5px] leading-relaxed text-body-text">
                  • {note}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
