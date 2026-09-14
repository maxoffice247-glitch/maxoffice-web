import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/Button";
import { HomeIcon, PhoneIcon } from "@/components/icons";

// Next.js render not-found.tsx BÊN TRONG layout.tsx gốc (Header/Footer/
// FloatingButtons đã có sẵn ở đó) nên chỉ cần viết phần nội dung <main> —
// không tự bọc thêm Header/Footer ở đây.
export const metadata: Metadata = {
  title: "Không tìm thấy trang | MAX OFFICE",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main>
      {/* Dải nền tối phía sau header — Header.tsx mặc định hiện logo TRẮNG
          khi ở đầu trang (chưa cuộn) vì mọi trang khác trong site đều có
          ảnh hero tối màu ngay phía dưới header. Trang 404 không có hero
          ảnh nên cần dải màu tối riêng để logo trắng không bị "chìm" vào
          nền sáng — xem PageHero.tsx cho cách các trang khác xử lý (dùng
          ảnh thật thay vì màu phẳng, không phù hợp ở đây). */}
      <div aria-hidden className="h-28 bg-gradient-to-b from-navy to-bg sm:h-32" />
      <div className="flex min-h-[55vh] items-center justify-center px-5 pt-10 pb-20 sm:px-8">
        <div className="mx-auto max-w-[480px] text-center">
          {/* Linh vật MAX cầm kính lúp "tìm kiếm" — hợp với trang 404 hơn
              hẳn khối chữ "404" khô khan mặc định của Next.js. */}
          <Image
            src="/images/mascot/linh-vat-max-tim-kiem.png"
            alt=""
            width={340}
            height={227}
            priority
            className="mx-auto mb-6 h-auto w-full max-w-[320px] object-contain"
          />
          <p className="mb-2 font-mono text-[15px] font-bold tracking-[0.08em] text-primary">
            LỖI 404
          </p>
          <h1 className="mb-3 text-[24px] font-bold text-navy sm:text-[28px]">
            Không tìm thấy trang bạn cần
          </h1>
          <p className="mb-8 text-[14.5px] leading-relaxed text-body-text">
            Trang này có thể đã bị xoá, đổi địa chỉ, hoặc đường link chưa chính xác.
            Quay về trang chủ hoặc liên hệ hotline để được hỗ trợ tìm đúng thông tin bạn cần.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href="/" variant="primary" icon={<HomeIcon className="h-4 w-4" />}>
              Về trang chủ
            </Button>
            <Button href="/lien-he" variant="ghost" icon={<PhoneIcon className="h-4 w-4" />}>
              Liên hệ tư vấn
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
