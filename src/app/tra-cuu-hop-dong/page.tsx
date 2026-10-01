import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import ContractLookupForm from "@/components/portal/ContractLookupForm";

export const metadata: Metadata = {
  alternates: { canonical: "/tra-cuu-hop-dong" },
  title: "Tra Cứu Hợp Đồng | MAX OFFICE",
  description: "Tra cứu thông tin hợp đồng văn phòng ảo/trọn gói tại MAX OFFICE bằng mã số thuế hoặc số hợp đồng, xác minh qua SĐT/email.",
  robots: { index: false, follow: false }, // trang tra cứu riêng tư, không cần lập chỉ mục
};

/** Đặt ở CẤP CAO (/tra-cuu-hop-dong), NGOÀI /tien-ich/ — trang này không
    phải 1 "tiện ích" công khai cho khách MỚI (như /tien-ich/tim-goi-phu-hop
    hay /tien-ich/tao-bao-gia-tong-hop), mà là cổng tra cứu RIÊNG cho khách
    ĐÃ KÝ hợp đồng, URL cũ /tien-ich/tra-cuu-hop-dong dễ gây hiểu nhầm về
    bản chất trang. Trước đó từng đặt trong /tien-ich/ CHỈ để mượn layout/
    PageHero/Header — sửa đúng lỗi "header trắng-trên-trắng" (trang không
    có PageHero thì không có dải tối đầu trang cho Header trong suốt/chữ
    trắng đủ tương phản lúc scrollY=0). Chuyển ra ngoài lần này VẪN giữ
    nguyên PageHero/Breadcrumb bên dưới — cách sửa lỗi đó không phụ thuộc
    việc có nằm trong /tien-ich/ hay không. Xem next.config.ts để biết
    redirect 301 từ URL cũ /tien-ich/tra-cuu-hop-dong.

    CHỦ Ý KHÔNG dùng ToolPageTemplate (kéo theo benefits/related services/
    FAQ — nội dung quảng bá cho "công cụ mới" công khai) và CHỦ Ý KHÔNG
    thêm trang này vào danh sách /tien-ich hay ToolsMegaMenu — đây không
    phải 1 công cụ để quảng bá tìm kiếm khách hàng mới. */
export default function ContractLookupPage() {
  return (
    <main>
      <PageHero
        image="/images/hero-lien-he.jpg"
        eyebrow="Khách hàng MAX OFFICE"
        title="Tra cứu hợp đồng"
        description="Nhập mã số thuế hoặc số hợp đồng để xem thông tin hợp đồng đang sử dụng tại MAX OFFICE."
      />
      <Breadcrumb items={[{ label: "Tra cứu hợp đồng" }]} />
      <div className="bg-bg-tint py-14 sm:py-20">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <ContractLookupForm />
        </div>
      </div>
    </main>
  );
}
