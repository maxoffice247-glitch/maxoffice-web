"use client";

import { Component, type ReactNode } from "react";
import BrandIcon from "../BrandIcon";

const ZALO_URL = "https://zalo.me/0898082188";

/**
 * Bọc khối form Hồ sơ thành lập doanh nghiệp: nếu JS trong form ném lỗi khi render (trình duyệt cũ,
 * dữ liệu bất ngờ...) thì hiện thông báo thân thiện + Zalo/hotline thay vì để trống hoặc mất cả trang.
 * KHÔNG ghi nội dung khách đã điền vào log — chỉ ghi tên lỗi.
 */
export default class FormErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error("[checklist-form] render error:", error.name);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="rounded-2xl border border-line bg-white p-6 text-center sm:p-8">
        <h3 className="mb-2 text-[18px] font-bold text-navy">Biểu mẫu tạm thời chưa hiển thị được</h3>
        <p className="mx-auto mb-5 max-w-[460px] text-[14.5px] leading-relaxed text-body-text">
          Rất xin lỗi bạn. Bạn vẫn có thể gửi thông tin cho MAX OFFICE qua Zalo hoặc gọi hotline 089 8082 188, nhân viên sẽ lên hồ sơ giúp bạn.
        </p>
        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a
            href={ZALO_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0068FF] px-6 py-3.5 text-[15px] font-bold text-white"
          >
            <BrandIcon type="zalo" className="h-6 w-6" />
            Nhắn Zalo MAX OFFICE
          </a>
          <a
            href="tel:0898082188"
            className="inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-line bg-white px-6 py-3.5 text-[15px] font-bold text-navy"
          >
            Gọi 089 8082 188
          </a>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-full border-[1.5px] border-line bg-white px-6 py-3.5 text-[15px] font-bold text-navy"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }
}
