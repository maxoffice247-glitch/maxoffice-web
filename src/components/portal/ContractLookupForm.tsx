"use client";

import { useState, type FormEvent } from "react";
import type { ContractLink } from "@/lib/portal/types";

type StepIdle = { step: "idle" };
type StepOtp = { step: "otp"; sessionId: string; companyNameMasked: string; emailMasked: string };
type StepNoEmail = { step: "no_email"; companyNameMasked: string };
type StepVerified = {
  step: "verified";
  record: {
    companyName: string;
    mst: string;
    contractNumber: string;
    branch: string;
    startDate: string | null;
    endDate: string | null;
    totalValue: number | null;
    statusLabel: string;
    links: ContractLink[];
  };
};
type UiState = StepIdle | StepOtp | StepNoEmail | StepVerified;

/** Form tra cứu hợp đồng 2 bước — Phase 1 kiến trúc portal khách hàng.
    Toàn bộ nghiệp vụ (fuzzy search, OTP, rate-limit, che tên/email) nằm ở
    API route (src/app/api/portal/search|verify-otp) — component này CHỈ
    quản lý trạng thái hiển thị theo phản hồi API, không tự quyết định gì
    thêm về bảo mật/logic. */
export default function ContractLookupForm() {
  const [ui, setUi] = useState<UiState>({ step: "idle" });
  const [query, setQuery] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/portal/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      const data = await res.json();
      if (data.status === "otp_sent") {
        setUi({ step: "otp", sessionId: data.sessionId, companyNameMasked: data.companyNameMasked, emailMasked: data.emailMasked });
      } else if (data.status === "no_email") {
        setUi({ step: "no_email", companyNameMasked: data.companyNameMasked });
      } else {
        // not_found / rate_limited / error đều chỉ cần hiện thông báo, ở
        // lại bước nhập (không có state riêng cho từng loại).
        setErrorMessage(data.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch {
      setErrorMessage("Không kết nối được máy chủ, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    if (ui.step !== "otp") return;
    e.preventDefault();
    if (!otp.trim() || loading) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/portal/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: ui.sessionId, otp: otp.trim() }),
      });
      const data = await res.json();
      if (data.status === "verified") {
        setUi({ step: "verified", record: data.record });
      } else if (data.status === "expired" || data.status === "too_many_attempts") {
        setErrorMessage(data.message);
        setUi({ step: "idle" });
        setQuery("");
      } else {
        // "invalid" — vẫn ở bước OTP, cho nhập lại
        setErrorMessage(data.message || "Mã xác minh không đúng.");
      }
    } catch {
      setErrorMessage("Không kết nối được máy chủ, vui lòng thử lại.");
    } finally {
      setLoading(false);
      setOtp("");
    }
  };

  return (
    <div className="mx-auto max-w-[480px] rounded-2xl bg-white p-7 shadow-[0_20px_60px_rgba(11,31,58,0.12)] sm:p-8">
      {ui.step === "idle" && (
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <h2 className="mb-1 text-[19px] font-bold text-navy">Tra cứu hợp đồng</h2>
            <p className="text-[13.5px] text-body-text">Nhập mã số thuế hoặc số hợp đồng để tra cứu.</p>
          </div>
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="VD: 0317942553 hoặc H250807/B82/HĐTVP"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink placeholder:text-body-text/60 focus:border-primary focus:outline-none"
          />
          {errorMessage && <p className="text-[13px] text-accent">{errorMessage}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-[15px] font-bold text-white transition-colors duration-200 hover:bg-primary-dark disabled:pointer-events-none disabled:opacity-60"
          >
            {loading ? "Đang tra cứu..." : "Tra cứu"}
          </button>
        </form>
      )}

      {ui.step === "otp" && (
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <h2 className="mb-1 text-[19px] font-bold text-navy">Xác minh mã OTP</h2>
            <p className="text-[13.5px] text-body-text">
              Tìm thấy công ty <span className="font-semibold text-ink">{ui.companyNameMasked}</span>. Mã xác minh
              đã gửi tới <span className="font-semibold text-ink">{ui.emailMasked}</span>.
            </p>
          </div>
          <input
            type="text"
            required
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Nhập mã 6 số"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-center text-[20px] tracking-[6px] text-ink placeholder:tracking-normal placeholder:text-body-text/60 focus:border-primary focus:outline-none"
          />
          {errorMessage && <p className="text-[13px] text-accent">{errorMessage}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-[15px] font-bold text-white transition-colors duration-200 hover:bg-primary-dark disabled:pointer-events-none disabled:opacity-60"
          >
            {loading ? "Đang xác minh..." : "Xác minh"}
          </button>
          <button
            type="button"
            onClick={() => {
              setUi({ step: "idle" });
              setErrorMessage(null);
              setQuery("");
            }}
            className="w-full text-center text-[13px] text-body-text underline"
          >
            Tra cứu lại
          </button>
        </form>
      )}

      {ui.step === "no_email" && (
        <div className="space-y-4 text-center">
          <h2 className="text-[19px] font-bold text-navy">Chưa có email xác minh</h2>
          <p className="text-[13.5px] text-body-text">
            Tìm thấy công ty <span className="font-semibold text-ink">{ui.companyNameMasked}</span>, nhưng hợp đồng
            này chưa có email đăng ký để nhận mã xác minh. Vui lòng liên hệ CSKH để bổ sung email, sau đó quay lại
            tra cứu.
          </p>
          <div className="flex gap-3">
            <a
              href="tel:0898082188"
              className="flex-1 rounded-full bg-accent px-4 py-3 text-[14px] font-bold text-white"
            >
              Gọi CSKH
            </a>
            <a
              href="https://zalo.me/0898082188"
              target="_blank"
              rel="noopener"
              className="flex-1 rounded-full bg-[#0068FF] px-4 py-3 text-[14px] font-bold text-white"
            >
              Chat Zalo
            </a>
          </div>
          <button
            type="button"
            onClick={() => {
              setUi({ step: "idle" });
              setQuery("");
            }}
            className="w-full text-center text-[13px] text-body-text underline"
          >
            Tra cứu lại
          </button>
        </div>
      )}

      {ui.step === "verified" && (
        <div className="space-y-4">
          <h2 className="text-[19px] font-bold text-navy">{ui.record.companyName}</h2>
          <dl className="space-y-2 text-[13.5px]">
            <Row label="MST" value={ui.record.mst} />
            <Row label="Số hợp đồng" value={ui.record.contractNumber || "—"} />
            <Row label="Chi nhánh" value={ui.record.branch || "—"} />
            <Row label="Ngày bắt đầu" value={formatDate(ui.record.startDate)} />
            <Row label="Ngày kết thúc" value={formatDate(ui.record.endDate)} />
            <Row label="Tổng giá trị" value={formatCurrency(ui.record.totalValue)} />
            <Row label="Trạng thái" value={ui.record.statusLabel} />
          </dl>
          {ui.record.links.length > 0 && (
            <div className="space-y-2 border-t border-line pt-4">
              <p className="text-[13px] font-semibold text-ink">Tài liệu hợp đồng</p>
              {ui.record.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener"
                  className="block rounded-lg bg-bg-tint px-3 py-2 text-[13px] font-medium text-primary hover:underline"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setUi({ step: "idle" });
              setQuery("");
            }}
            className="w-full text-center text-[13px] text-body-text underline"
          >
            Tra cứu hợp đồng khác
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line/60 py-1.5">
      <dt className="text-body-text">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function formatCurrency(value: number | null): string {
  if (value == null) return "—";
  return value.toLocaleString("vi-VN") + "đ";
}
