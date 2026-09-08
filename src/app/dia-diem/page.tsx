import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHead from "@/components/SectionHead";
import CtaBanner from "@/components/CtaBanner";
import LocationsAreaBrowser from "@/components/LocationsAreaBrowser";
import { SearchIcon, ArrowRightSmallIcon } from "@/components/icons";
import { getGroupedLocations, ACTIVE_BRANCH_COUNT, AREAS } from "@/lib/locationsData";

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem" },
  title: `${ACTIVE_BRANCH_COUNT} Chi Nhánh Văn Phòng MAX OFFICE Tại TP.HCM`,
  // "nhóm theo N khu vực" đọc N từ AREAS.length thay vì liệt kê tên từng khu
  // vực bằng tay — trước đây hardcode "7 khu vực tại Tân Bình, Gò Vấp, Tân
  // Phú, Quận 10, Quận 1, Quận 7 và Thủ Đức" nhưng AREAS đã lên 11-12 khu
  // vực từ lâu (thêm Quận 3, Bình Thạnh, Phú Nhuận, Quận 4, Quận 5...) mà
  // câu mô tả này chưa được cập nhật theo — lặp lại đúng lỗi lệch số mà
  // ACTIVE_BRANCH_COUNT được tạo ra để tránh, chỉ khác là ở khu vực thay vì
  // chi nhánh. Dùng AREAS.length để không tái diễn khi thêm khu vực mới.
  description: `Danh sách đầy đủ ${ACTIVE_BRANCH_COUNT} chi nhánh văn phòng ảo, văn phòng trọn gói và coworking của MAX OFFICE, nhóm theo ${AREAS.length} khu vực tại TP.HCM.`,
  // Ảnh OG giờ đến từ opengraph-image.tsx cùng thư mục (dùng renderOgImage()
  // — logo + overlay chuẩn hoá như mọi trang khác). Trước đây trỏ thẳng tới
  // 1 ảnh nền thô "/images/og/hero-dia-diem.jpg" không qua template, không
  // có logo/overlay như các trang khác.
};

export default function DiaDiemPage() {
  const { areaGroups } = getGroupedLocations();

  return (
    <main>
      <PageHero
        image="/images/hero-chi-nhanh.png"
        eyebrow="Chi nhánh"
        title={`${ACTIVE_BRANCH_COUNT} chi nhánh văn phòng tại TP.HCM`}
        description="Từ Tân Bình, Gò Vấp, Tân Phú, Quận 10 đến trung tâm Quận 1 — chọn địa chỉ gần đối tác, khách hàng hoặc thuận tiện nhất cho đội ngũ của bạn."
      />
      <Breadcrumb items={[{ label: "Chi nhánh" }]} />

      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Hệ thống chi nhánh"
            // "MAX OFFICE" dùng non-breaking space — tránh H1 xuống dòng
            // tách rời "OFFICE" khỏi "MAX" (từng bị lẻ loi 1 mình ở dòng
            // 2 tại các độ rộng container hẹp/H1 cỡ lớn của SectionHead).
            title={`Toàn bộ ${ACTIVE_BRANCH_COUNT} chi nhánh MAX OFFICE`}
            tagline="Hệ thống văn phòng ảo phủ khắp Sài Gòn"
            description="Mỗi địa điểm đều đủ điều kiện đăng ký kinh doanh, đăng ký thuế và sẵn sàng phục vụ văn phòng ảo, văn phòng trọn gói, phòng họp và chỗ ngồi linh động."
          />

          <LocationsAreaBrowser
            areaGroups={areaGroups}
            cta={
              // Lối tắt cho khách vào thẳng /dia-diem (không qua dropdown
              // mega menu) — khỏi phải tự kéo xem hết {ACTIVE_BRANCH_COUNT}
              // chi nhánh để tìm gói phù hợp. Đây là 1 trong 2 lối song song
              // với ô tìm kiếm nhanh theo khu vực phía trên — không thay thế
              // nhau, giữ nguyên vị trí ngay dưới ô tìm kiếm.
              <Link
                href="/tien-ich/tim-goi-phu-hop"
                className="group mb-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/20 bg-primary-tint/60 p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-card sm:flex-row sm:items-center sm:p-6"
              >
                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary">
                    <SearchIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[15.5px] font-bold text-navy">
                      Chưa biết chọn chi nhánh hay gói nào phù hợp?
                    </p>
                    <p className="text-[13.5px] text-body-text">
                      Dùng công cụ tìm gói phù hợp — trả lời vài câu hỏi, nhận gợi ý ngay.
                    </p>
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13.5px] font-bold whitespace-nowrap text-white transition-colors duration-200 group-hover:bg-primary-dark">
                  Tìm nhanh VPA phù hợp
                  <ArrowRightSmallIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            }
          />
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
