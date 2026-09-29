import type { Metadata } from "next";
import ContractLookupForm from "@/components/portal/ContractLookupForm";

export const metadata: Metadata = {
  alternates: { canonical: "/tra-cuu-hop-dong" },
  title: "Tra Cứu Hợp Đồng | MAX OFFICE",
  description: "Tra cứu thông tin hợp đồng văn phòng ảo/trọn gói tại MAX OFFICE bằng mã số thuế hoặc số hợp đồng, xác minh qua email.",
  robots: { index: false, follow: false }, // trang tra cứu riêng tư, không cần lập chỉ mục
};

export default function ContractLookupPage() {
  return (
    <main className="min-h-[70vh] bg-bg-tint py-14 sm:py-20">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <ContractLookupForm />
      </div>
    </main>
  );
}
