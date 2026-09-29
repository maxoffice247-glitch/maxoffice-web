import type { Metadata } from "next";
import { getAllOfferedPlans } from "@/lib/planFinder";
import RegisterOrderForm from "@/components/portal/RegisterOrderForm";

export const metadata: Metadata = {
  alternates: { canonical: "/dang-ky-dich-vu" },
  title: "Đăng Ký Dịch Vụ | MAX OFFICE",
  description: "Đăng ký gói văn phòng ảo/trọn gói MAX OFFICE và thanh toán trực tuyến qua VietQR.",
  robots: { index: false, follow: false },
};

/** Nhóm theo chi nhánh cho form chọn 2 cấp (chi nhánh -> gói) — server
    component tự tra `getAllOfferedPlans()` (nguồn giá CHÍNH THỨC đã dùng
    cho /tien-ich/tim-goi-phu-hop), KHÔNG lặp lại logic giá ở đâu khác. */
export default function RegisterOrderPage() {
  const plans = getAllOfferedPlans();
  const locations = Array.from(new Map(plans.map((p) => [p.locationSlug, p.locationName])).entries()).map(
    ([slug, name]) => ({ slug, name })
  );

  return (
    <main className="min-h-[70vh] bg-bg-tint py-14 sm:py-20">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <RegisterOrderForm locations={locations} plans={plans} />
      </div>
    </main>
  );
}
