import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import ContractLookupForm from "@/components/portal/ContractLookupForm";

export const metadata: Metadata = {
  alternates: { canonical: "/tien-ich/tra-cuu-hop-dong" },
  title: "Tra Cứu Hợp Đồng | MAX OFFICE",
  description: "Tra cứu thông tin hợp đồng văn phòng ảo/trọn gói tại MAX OFFICE bằng mã số thuế hoặc số hợp đồng, xác minh qua SĐT/email.",
  robots: { index: false, follow: false }, // trang tra cứu riêng tư, không cần lập chỉ mục
};

/** Đặt trong /tien-ich/ để DÙNG CHUNG layout/PageHero/Header đúng như mọi
    trang /tien-ich/* khác — sửa đúng lỗi "header trắng-trên-trắng" từng
    gặp ở URL cũ /tra-cuu-hop-dong (trang đó không có PageHero nên không có
    dải tối đầu trang cho Header trong suốt/chữ trắng đủ tương phản lúc
    scrollY=0 — xem next.config.ts để biết redirect 301 từ URL cũ).

    CHỦ Ý KHÔNG dùng ToolPageTemplate (kéo theo benefits/related services/
    FAQ — nội dung quảng bá cho "công cụ mới" công khai) và CHỦ Ý KHÔNG
    thêm trang này vào danh sách /tien-ich hay ToolsMegaMenu — đây chỉ mượn
    cấu trúc thư mục/layout kỹ thuật, không phải 1 công cụ để quảng bá tìm
    kiếm khách hàng mới. */
export default function ContractLookupPage() {
  return (
    <main>
      <PageHero
        image="/images/hero-lien-he.jpg"
        eyebrow="Khách hàng MAX OFFICE"
        title="Tra cứu hợp đồng"
        description="Nhập mã số thuế hoặc số hợp đồng để xem thông tin hợp đồng đang sử dụng tại MAX OFFICE."
      />
      <Breadcrumb items={[{ label: "Tiện ích", href: "/tien-ich" }, { label: "Tra cứu hợp đồng" }]} />
      <div className="bg-bg-tint py-14 sm:py-20">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <ContractLookupForm />
        </div>
      </div>
    </main>
  );
}
