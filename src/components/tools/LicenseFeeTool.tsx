import Reveal from "../Reveal";
import SectionHead from "../SectionHead";
import Button from "../Button";
import LeadFormButton from "../LeadFormButton";
import { CheckCircleIcon, BadgePercentIcon } from "../icons";

export default function LicenseFeeTool() {
  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Cập nhật quy định mới"
          title="Lệ phí môn bài đã được bãi bỏ"
          description="Từ ngày 01/01/2026, doanh nghiệp và hộ kinh doanh không còn phải tính hay nộp lệ phí môn bài."
        />

        <Reveal className="mx-auto max-w-[720px] overflow-hidden rounded-2xl border-2 border-primary bg-white text-center shadow-card">
          <div className="bg-gradient-to-tr from-navy to-primary-dark p-8 sm:p-10">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
              <BadgePercentIcon className="h-7 w-7" />
            </span>
            <span className="mb-2 block text-[12px] font-bold tracking-[0.14em] text-[#8FC1F5] uppercase">
              Nghị quyết 198/2025/QH15 · Điều 10, Khoản 7
            </span>
            <div className="font-mono text-[38px] font-bold text-white">
              0đ
              <span className="text-[16px] font-medium text-white/70"> — Đã bãi bỏ</span>
            </div>
          </div>
          <div className="p-7 sm:p-9">
            <p className="mb-5 text-[15px] leading-relaxed text-body-text">
              Từ ngày <strong className="text-navy">01/01/2026</strong>, lệ phí môn bài đã{" "}
              <strong className="text-navy">chính thức bãi bỏ</strong> theo{" "}
              <strong className="text-navy">Nghị quyết 198/2025/QH15</strong>, áp dụng cho{" "}
              <strong className="text-navy">tất cả loại hình</strong>: doanh nghiệp (TNHH, Cổ
              phần, tư nhân), hợp tác xã, hộ kinh doanh và cá nhân kinh doanh — không còn phải
              nộp lệ phí môn bài và không cần nộp tờ khai.
            </p>
            <p className="mb-6 text-[12.5px] text-body-text">
              *Thông tin cập nhật theo quy định pháp luật hiện hành. Nếu bạn cần tư vấn về các
              loại thuế, phí khác liên quan đến vận hành doanh nghiệp, hãy liên hệ đội ngũ MAX
              OFFICE để được hỗ trợ chính xác theo tình huống cụ thể.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <Button href="/services/ke-toan-thue" variant="ghost">
                Xem dịch vụ kế toán & thuế
              </Button>
              <LeadFormButton service="Kế toán & thuế" variant="primary">
                Cần tư vấn thuế khác? Liên hệ MAX OFFICE
              </LeadFormButton>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-8 flex max-w-[720px] items-start gap-3 rounded-xl bg-primary-tint p-4">
          <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-[12.5px] leading-relaxed text-navy">
            Cần hỗ trợ rà soát các nghĩa vụ thuế khác của doanh nghiệp? Để lại thông tin để
            chuyên viên MAX OFFICE tư vấn miễn phí.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
