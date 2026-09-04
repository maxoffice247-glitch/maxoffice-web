"use client";

import { useState } from "react";
import SectionHead from "../SectionHead";
import Reveal from "../Reveal";
import { SpinnerIcon } from "../icons";

/**
 * Nhúng iframe công cụ "Tạo mã QR thanh toán tự động" tại qr.maxoffice.vn
 * (hệ thống nội bộ MAX OFFICE, cùng công ty — đã xác nhận KHÔNG có
 * X-Frame-Options/CSP frame-ancestors chặn nhúng iframe cross-origin trước
 * khi tạo trang này, cùng kiến trúc với gpkd.maxoffice.vn: trang gốc chỉ
 * là 1 wrapper nhúng Google Apps Script đã bật XFrameOptionsMode.ALLOWALL).
 * Toàn bộ tương tác (tạo mã QR, tải ảnh) diễn ra ngay trong khung nhúng,
 * URL trên thanh địa chỉ vẫn giữ nguyên maxoffice.vn.
 *
 * Cùng min-height responsive với GpkdEmbedTool.tsx (trang tham khảo) — công
 * cụ tạo mã QR có form ngắn hơn (số tiền, nội dung chuyển khoản) nên hiếm
 * khi cần cuộn, nhưng vẫn giữ min-height rộng để không bị hụt khung khi
 * hiển thị mã QR kết quả.
 *
 * src trỏ THẲNG vào URL Apps Script (script.google.com/.../exec), không
 * qua wrapper qr.maxoffice.vn — cùng phát hiện đã áp dụng cho
 * GpkdEmbedTool.tsx: wrapper KHÔNG forward query string vào iframe con
 * của nó (`qr.maxoffice.vn?embed=1` không có tác dụng gì), trong khi bản
 * thân Apps Script LẠI đọc đúng `?embed=1` và tự ẩn top bar "← Quay lại |
 * MAX WORKSPACE" của nó (xác nhận qua so sánh trực tiếp có/không tham
 * số). `?embed=1` phải nằm trên URL script.google.com này mới có tác
 * dụng.
 */
export default function QrEmbedTool() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Công cụ miễn phí"
          title="Tạo mã QR thanh toán tự động"
          description="Tạo mã QR VietQR để nhận thanh toán nhanh chóng, miễn phí — dùng được cho bất kỳ mục đích thanh toán nào, không giới hạn khách hàng của MAX OFFICE."
        />

        <Reveal className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          {!loaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-bg-tint">
              <SpinnerIcon className="h-8 w-8 text-primary" />
              <p className="text-[13.5px] font-semibold text-body-text">
                Đang tải công cụ tạo mã QR...
              </p>
            </div>
          )}
          <iframe
            src="https://script.google.com/macros/s/AKfycbzxu1M2jHCZx78WZIcFrVdqdHqyXvFh6QHl0WBZZevU5D1XUhpAMni3zgJoEMVXY-NI/exec?embed=1"
            title="Tạo mã QR thanh toán tự động"
            onLoad={() => setLoaded(true)}
            className="block w-full min-h-[650px] sm:min-h-[820px]"
            style={{ height: "85vh" }}
            allow="clipboard-write"
          />
        </Reveal>

        <p className="mt-4 text-center text-[12px] text-body-text italic">
          Công cụ do MAX OFFICE cung cấp và vận hành. Cần hỗ trợ trực tiếp? Liên hệ đội ngũ tư vấn
          ở form bên dưới.
        </p>
      </div>
    </section>
  );
}
