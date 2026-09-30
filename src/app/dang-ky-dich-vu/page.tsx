import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
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
    <main>
      {/* PageHero thêm SAU KHI phát hiện cùng lỗi "header trắng-trên-trắng"
          với /tra-cuu-hop-dong (xem chú thích ở đó) — trang này KHÔNG có
          dải tối đầu trang nên Header trong suốt/chữ trắng mất tương phản
          lúc scrollY=0. Không đổi route (khác /tra-cuu-hop-dong, trang này
          không được yêu cầu chuyển vào /tien-ich/), chỉ thêm PageHero tại
          chỗ để sửa đúng phần hiển thị. */}
      <PageHero
        image="/images/hero-lien-he.jpg"
        eyebrow="Khách hàng mới"
        title="Đăng ký dịch vụ"
        description="Điền thông tin để nhận mã QR thanh toán và đăng ký gói dịch vụ MAX OFFICE."
      />
      <div className="bg-bg-tint py-14 sm:py-20">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <RegisterOrderForm locations={locations} plans={plans} />
        </div>
      </div>
    </main>
  );
}
