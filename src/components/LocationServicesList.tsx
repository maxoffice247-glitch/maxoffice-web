import Link from "next/link";
import SectionHead from "./SectionHead";
import Button from "./Button";
import Reveal, { RevealGroup, RevealItem } from "./Reveal";
import {
  BuildingIcon,
  KeyIcon,
  UsersIcon,
  ScreenIcon,
  DocumentCheckIcon,
  CalculatorIcon,
  CheckCircleIcon,
  ArrowRightSmallIcon,
} from "./icons";
import { getPlansForLocation } from "@/lib/virtualOfficePlans";
import { resolveTimedPromotions, type LocationData } from "@/lib/locationsData";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

const OTHER_SERVICES = [
  {
    slug: "van-phong-tron-goi",
    icon: KeyIcon,
    title: "Văn phòng trọn gói",
    price: "Từ 4.500.000đ/tháng",
  },
  {
    slug: "cho-ngoi-linh-dong",
    icon: UsersIcon,
    title: "Chỗ ngồi linh động",
    price: "Từ 2.000.000đ/tháng",
  },
  {
    slug: "phong-hop",
    icon: ScreenIcon,
    title: "Phòng họp theo giờ",
    price: "Từ 150.000đ/giờ",
  },
  {
    slug: "thanh-lap-doanh-nghiep",
    icon: DocumentCheckIcon,
    title: "Thành lập doanh nghiệp",
    price: "Từ 1.299.000đ (kèm văn phòng ảo)",
  },
  {
    slug: "ke-toan-thue",
    icon: CalculatorIcon,
    title: "Kế toán & thuế",
    price: "Từ 500.000đ/tháng",
  },
];

export default function LocationServicesList({
  name,
  slug,
  promotions,
}: {
  name: string;
  slug: string;
  /** Khuyến mãi có thời hạn/điều kiện riêng của chi nhánh — nguyên trạng từ `LocationData.promotions` (chưa resolve theo thời gian, có thể là `TimedPromoVersion[]`), tự chọn đúng phiên bản qua `resolveTimedPromotions()` ngay bên dưới. Bỏ trống/undefined => ẩn hẳn khối khuyến mãi. */
  promotions?: LocationData["promotions"];
}) {
  const voPlans = getPlansForLocation(slug);
  const resolvedPromotions = resolveTimedPromotions(promotions);

  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Dịch vụ tại chi nhánh"
          title={`Dịch vụ sẵn sàng tại văn phòng ${name}`}
          description="Toàn bộ 6 dịch vụ cốt lõi của MAX OFFICE đều được cung cấp tại chi nhánh này với mức giá minh bạch, không phát sinh."
        />

        {/* Văn phòng ảo + Dịch vụ khác — GỘP CHUNG vào 1 flex-wrap DUY NHẤT
            (trước đây tách 2 khối riêng: lưới gói VPA rồi mới tới lưới
            "Dịch vụ khác" bên dưới). getPlansForLocation() trả về SỐ LƯỢNG
            KHÁC NHAU tuỳ chi nhánh (1-4 gói, xem LOCATION_VO_PLANS) — hàng
            gói VPA lẻ (không chia hết cột) trước đây bị "cụt", để lại
            khoảng trống cuối hàng. Gộp chung để 5 card "Dịch vụ khác" nối
            tiếp NGAY sau gói VPA cuối cùng, tự động chảy vào lấp đúng phần
            còn thiếu của hàng dở dang rồi mới xuống hàng mới — vd. chi
            nhánh 2 gói (Song Thao) sẽ ra [START][BASE][Văn phòng trọn gói]
            ở hàng 1. KHÔNG thêm field breakdown "Bảng tên:/Phòng họp:..."
            cho card gói VPA — loại dữ liệu đó không tồn tại cho
            VirtualOfficePlan (chỉ có features: string[] phẳng), khác với
            2 hệ giá kia (Quan3CuVOServices/SilverGoldPremiumServices). */}
        <Reveal className="rounded-2xl border border-line bg-white p-6 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary">
                <BuildingIcon className="h-5 w-5" />
              </span>
              <h3 className="text-[16px] font-bold text-navy">Văn phòng ảo</h3>
            </div>
            <Link
              href="/services/van-phong-ao#bang-gia"
              className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-bold text-primary hover:gap-2.5"
            >
              Xem chi tiết
              <ArrowRightSmallIcon className="transition-transform duration-200" />
            </Link>
          </div>
          {/* Bề rộng từng card tính tay = công thức tương đương grid N cột
              với gap-5 (20px): (100% - (N-1)*20px) / N — ÁP DỤNG CHUNG cho
              cả card gói VPA lẫn card "dịch vụ khác" (cùng 1 hàng, cùng 1
              độ rộng cột) để 2 loại card thẳng hàng, chảy liên tục vào
              nhau. Hàng cuối thiếu quân số tự nhiên chỉ chiếm đúng chỗ
              thật, không bị grid kéo giãn. */}
          <RevealGroup className="flex flex-wrap gap-5">
            {voPlans.map((plan) => (
              <RevealItem
                key={plan.key}
                className="w-full shrink-0 sm:w-[calc(50%-10px)] lg:w-[calc(33.3333%-13.334px)]"
              >
                <div className="flex h-full flex-col rounded-xl border border-line bg-bg-tint p-5">
                  <div className="mb-1 text-[14.5px] font-bold text-navy">{plan.name}</div>
                  <div className="mb-3 font-mono text-[20px] font-bold text-primary">
                    {formatVND(plan.price)}
                    <span className="ml-1 font-sans text-[12px] font-medium text-body-text">
                      {plan.duration}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-[12.5px] text-body-text">
                        <CheckCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {plan.addOn && (
                    <p className="mt-3 text-[11px] leading-relaxed text-body-text">
                      +{formatVND(plan.addOn.price)} {plan.addOn.label} ({plan.addOn.note})
                    </p>
                  )}
                  {/* Spacer flex-grow đẩy nút xuống đáy — card trong CÙNG 1
                      hàng flex-wrap cao bằng nhau (align-items: stretch mặc
                      định), nhưng checklist tính năng dài/ngắn khác nhau
                      tuỳ gói khiến nút lệch hàng nếu không có spacer này.
                      pt-4 trên wrapper đảm bảo khoảng cách tối thiểu với
                      nội dung phía trên dù mt-auto đã đẩy sát đáy. */}
                  <div className="grow" />
                  <div className="mt-auto pt-4">
                    {/* Link thẳng sang trang chi tiết gói (đã có sẵn preview
                        + xuất PNG báo giá qua PlanDetailActions/
                        PlanQuoteCard) — để khách/nhân viên tạo link báo giá
                        ngay tại đây, không phải sang lại
                        /tien-ich/tim-goi-phu-hop chọn lại chi nhánh + gói.
                        Dùng variant "ghost" (viền nhạt, không nền màu) để
                        không lấn át phần giá/tính năng phía trên. */}
                    <Button
                      href={`/tien-ich/tim-goi-phu-hop/${slug}/${plan.key}`}
                      variant="ghost"
                      size="sm"
                      className="w-full !px-3 text-center"
                    >
                      📄 Tạo báo giá
                    </Button>
                  </div>
                </div>
              </RevealItem>
            ))}
            {/* Dịch vụ khác — vẫn dạng link card tóm tắt như cũ, vì các
                dịch vụ này không có gói riêng theo chi nhánh (giá/tính năng
                giống nhau ở mọi chi nhánh, xem chi tiết đầy đủ tại trang
                dịch vụ tương ứng). justify-center (thay vì justify-between
                trước đây) để nội dung không bị kéo tách xa nhau, trống trải
                giữa card khi lọt vào hàng có gói VPA cao hơn (h-full kế
                thừa chiều cao stretch của hàng flex-wrap chung). */}
            {OTHER_SERVICES.map((svc) => (
              <RevealItem
                key={svc.slug}
                className="w-full shrink-0 sm:w-[calc(50%-10px)] lg:w-[calc(33.3333%-13.334px)]"
              >
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
        {/* Khuyến mãi riêng chi nhánh — chỉ hiện khi `promotions` có dữ liệu
            sau khi resolve theo thời gian (đồng bộ cách hiển thị với
            PhamVanDongServices.tsx). Đa số chi nhánh dùng component này
            không có `promotions` riêng nên khối này ẩn hoàn toàn với các
            chi nhánh đó, chỉ hiện với chi nhánh có khai báo (VD Sông Thao). */}
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
