"use client";

import { useState } from "react";
import SectionHead from "../SectionHead";
import Reveal from "../Reveal";
import { SpinnerIcon } from "../icons";

/**
 * Nhúng iframe công cụ "Soạn hồ sơ doanh nghiệp tự động" tại gpkd.maxoffice.vn
 * (hệ thống nội bộ MAX OFFICE, cùng công ty — đã xác nhận KHÔNG có
 * X-Frame-Options/CSP frame-ancestors chặn nhúng iframe cross-origin trước
 * khi tạo trang này). Toàn bộ tương tác (điền form, tải file) diễn ra ngay
 * trong khung nhúng, URL trên thanh địa chỉ vẫn giữ nguyên maxoffice.vn.
 *
 * min-height khá lớn vì đây là form nhiều bước (thông tin giám đốc, ngành
 * nghề, vốn điều lệ...) — ưu tiên hiển thị đủ nội dung mà không cuộn kép;
 * nếu nội dung bên trong dài hơn nữa, trình duyệt sẽ tự thêm scrollbar
 * riêng cho iframe (chấp nhận được, không phải lỗi).
 */
export default function GpkdEmbedTool() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Công cụ miễn phí"
          title="Soạn hồ sơ doanh nghiệp tự động"
          description="Điền thông tin theo hướng dẫn, nhận ngay bộ hồ sơ soạn sẵn cho: thành lập doanh nghiệp mới, mở chi nhánh, chuyển nhượng vốn góp/cổ phần, thay đổi địa chỉ đăng ký kinh doanh (GPKD) và kê khai Mẫu số 12 — áp dụng cho công ty TNHH 1 thành viên, TNHH 2 thành viên trở lên và công ty cổ phần."
        />

        <Reveal className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          {!loaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-bg-tint">
              <SpinnerIcon className="h-8 w-8 text-primary" />
              <p className="text-[13.5px] font-semibold text-body-text">
                Đang tải công cụ soạn hồ sơ...
              </p>
            </div>
          )}
          <iframe
            src="https://gpkd.maxoffice.vn"
            title="Soạn hồ sơ doanh nghiệp tự động"
            onLoad={() => setLoaded(true)}
            className="block w-full min-h-[650px] sm:min-h-[820px]"
            style={{ height: "85vh" }}
            allow="clipboard-write"
          />
        </Reveal>

        <p className="mt-4 text-center text-[12px] text-body-text italic">
          Công cụ do MAX OFFICE cung cấp và vận hành. Cần hỗ trợ trực tiếp khi soạn hồ sơ? Liên hệ
          đội ngũ tư vấn ở form bên dưới.
        </p>
      </div>
    </section>
  );
}
