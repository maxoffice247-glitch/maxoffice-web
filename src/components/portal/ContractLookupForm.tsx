"use client";

import { useState, type ComponentType, type FormEvent } from "react";
import type { ContractLink, ContractStatus } from "@/lib/portal/types";
import { BuildingIcon, CalendarIcon, CheckCircleIcon, KeyIcon, MailIcon, PhoneIcon } from "@/components/icons";

type StepIdle = { step: "idle" };
type StepConfirm = {
  step: "confirm";
  sessionId: string;
  /** "contact" (SĐT/email -> OTP, luồng gốc) hoặc "password" (nhóm Mộc
      Gia không có SĐT/email, dùng 1 mật khẩu DÙNG CHUNG cho cả nhóm — khớp
      đúng vào thẳng Mức 3, không qua OTP). Quyết định TOÀN BỘ nhánh nào
      hiển thị ở form xác nhận bên dưới. */
  confirmMethod: "contact" | "password";
  companyName: string;
  startDate: string | null;
  endDate: string | null;
  phoneMasked: string | null;
  emailMasked: string | null;
  contractStatus: ContractStatus;
  contractStatusLabel: string;
  daysRemaining: number | null;
};
type StepOtp = { step: "otp"; sessionId: string; emailMasked: string };
type StepDeadEnd = { step: "dead_end"; companyName?: string; message: string };
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
type UiState = StepIdle | StepConfirm | StepOtp | StepDeadEnd | StepVerified;

/** Form tra cứu hợp đồng 3 MỨC (Phase 1, bản chốt cuối):
      Mức 1 — tìm theo MST/số hợp đồng, hiện tên che 60% + ngày hợp đồng
        đầy đủ + SĐT/email che 1 phần.
      Mức 2 — khách nhập lại TOÀN BỘ SĐT hoặc email để xác nhận; khớp thì
        hệ thống tự gửi OTP tới email đã lưu sẵn (không phải giá trị vừa
        gõ) — trừ khi hợp đồng không có email, dẫn tới bế tắc báo CSKH.
      Mức 3 — nhập đúng OTP mới thấy đầy đủ chi tiết + link tải file.
    Component CHỈ quản lý trạng thái hiển thị theo phản hồi API, không tự
    quyết định gì thêm về bảo mật/logic — toàn bộ nghiệp vụ nằm ở
    src/app/api/portal/{search,confirm,verify-otp}. */
export default function ContractLookupForm() {
  const [ui, setUi] = useState<UiState>({ step: "idle" });
  const [query, setQuery] = useState("");
  const [confirmValue, setConfirmValue] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetToIdle = () => {
    setUi({ step: "idle" });
    setQuery("");
    setConfirmValue("");
    setOtp("");
  };

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
      if (data.status === "found") {
        setUi({
          step: "confirm",
          sessionId: data.sessionId,
          confirmMethod: data.confirmMethod,
          companyName: data.companyName,
          startDate: data.startDate,
          endDate: data.endDate,
          phoneMasked: data.phoneMasked,
          emailMasked: data.emailMasked,
          contractStatus: data.contractStatus,
          contractStatusLabel: data.contractStatusLabel,
          daysRemaining: data.daysRemaining,
        });
      } else if (data.status === "no_contact_info") {
        setUi({ step: "dead_end", companyName: data.companyName, message: data.message });
      } else {
        // not_found / rate_limited / error — ở lại bước nhập, chỉ hiện thông báo
        setErrorMessage(data.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch {
      setErrorMessage("Không kết nối được máy chủ, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: FormEvent) => {
    if (ui.step !== "confirm") return;
    e.preventDefault();
    if (!confirmValue.trim() || loading) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/portal/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: ui.sessionId, value: confirmValue.trim() }),
      });
      const data = await res.json();
      if (data.status === "otp_sent") {
        setUi({ step: "otp", sessionId: ui.sessionId, emailMasked: data.emailMasked });
        setConfirmValue("");
      } else if (data.status === "verified") {
        // Nhánh mật khẩu (confirmMethod "password") — khớp đúng bỏ qua
        // OTP, vào thẳng Mức 3 luôn.
        setUi({ step: "verified", record: data.record });
        setConfirmValue("");
      } else if (data.status === "no_email" || data.status === "too_many_attempts" || data.status === "expired") {
        setUi({ step: "dead_end", message: data.message });
      } else {
        setErrorMessage(
          data.message || (ui.confirmMethod === "password" ? "Mật khẩu không đúng." : "Số điện thoại hoặc email không khớp.")
        );
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
        setUi({ step: "dead_end", message: data.message });
      } else {
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

      {ui.step === "confirm" && (
        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <h2 className="mb-1 text-[19px] font-bold text-navy">Xác nhận danh tính</h2>
          </div>
          <dl className="space-y-2.5 rounded-xl bg-bg-tint px-4 py-3 text-[13px]">
            <InfoRow icon={BuildingIcon} label="Tên công ty" value={ui.companyName} />
            <InfoRow icon={CalendarIcon} label="Ngày bắt đầu" value={formatDate(ui.startDate)} />
            <InfoRow icon={CalendarIcon} label="Ngày kết thúc" value={formatDate(ui.endDate)} />
            <div className="flex flex-col gap-0.5">
              <dt className="flex items-center gap-1.5 text-body-text">
                <CheckCircleIcon className="h-4 w-4 shrink-0" />
                Tình trạng hợp đồng
              </dt>
              <dd>
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-[12px] font-bold whitespace-nowrap ${
                    ui.contractStatus === "active"
                      ? "bg-green-50 text-green-700"
                      : ui.contractStatus === "pending_payment"
                        ? "bg-amber/12 text-amber-dark"
                        : "bg-accent/10 text-accent"
                  }`}
                >
                  {ui.contractStatus === "active" && ui.daysRemaining !== null
                    ? `${ui.contractStatusLabel} — còn ${ui.daysRemaining} ngày`
                    : ui.contractStatusLabel}
                </span>
              </dd>
            </div>
            {ui.phoneMasked && <InfoRow icon={PhoneIcon} label="SĐT đã đăng ký" value={ui.phoneMasked} />}
            {ui.emailMasked && <InfoRow icon={MailIcon} label="Email đã đăng ký" value={ui.emailMasked} />}
          </dl>
          {/* Nút "Gia hạn hợp đồng" khi sắp/đã hết hạn — hiện ở Mức 1 (trước
              khi xác minh) vì đây là nơi khách nhìn thấy đầu tiên, kể cả khi
              chưa muốn xác nhận SĐT/email/mật khẩu ngay. BẢN TẠM: chỉ mở
              Zalo hotline để nhân viên tư vấn thủ công — CHƯA xây luồng tự
              chọn số tháng + thanh toán SePay (cần tài khoản ngân hàng mới
              trước). Khi có luồng tự phục vụ, thay href này bằng link tới
              trang đăng ký gia hạn mới, không phải sửa chỗ khác. */}
          {(ui.contractStatus === "expired" ||
            (ui.contractStatus === "active" && ui.daysRemaining !== null && ui.daysRemaining <= 30)) && (
            <a
              href="https://zalo.me/0898082188"
              target="_blank"
              rel="noopener"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0068FF] px-6 py-3.5 text-[15px] font-bold text-white transition-opacity duration-200 hover:opacity-90"
            >
              Gia hạn hợp đồng
            </a>
          )}
          {ui.confirmMethod === "password" ? (
            <p className="text-[13px] text-body-text">
              Để xem đầy đủ chi tiết hợp đồng (giá trị, ngày cụ thể, file hợp đồng), vui lòng nhập
              đúng mật khẩu tra cứu MAX OFFICE đã thông báo:
            </p>
          ) : (
            <p className="text-[13px] text-body-text">
              Để xem đầy đủ chi tiết hợp đồng (giá trị, ngày cụ thể, file hợp đồng), vui lòng xác nhận
              đúng số điện thoại hoặc email đã đăng ký với MAX OFFICE:
            </p>
          )}
          <div className="relative">
            {ui.confirmMethod === "password" && (
              <KeyIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-body-text/60" />
            )}
            <input
              type={ui.confirmMethod === "password" ? "password" : "text"}
              required
              value={confirmValue}
              onChange={(e) => setConfirmValue(e.target.value)}
              placeholder={
                ui.confirmMethod === "password" ? "Nhập mật khẩu tra cứu MAX OFFICE đã thông báo" : "Số điện thoại hoặc email đầy đủ"
              }
              className={`w-full rounded-xl border border-line bg-white py-3 text-[14.5px] text-ink placeholder:text-body-text/60 focus:border-primary focus:outline-none ${
                ui.confirmMethod === "password" ? "pr-4 pl-10" : "px-4"
              }`}
            />
          </div>
          {errorMessage && <p className="text-[13px] text-accent">{errorMessage}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-[15px] font-bold text-white transition-colors duration-200 hover:bg-primary-dark disabled:pointer-events-none disabled:opacity-60"
          >
            {loading ? "Đang xác nhận..." : "Xác nhận"}
          </button>
          <button type="button" onClick={resetToIdle} className="w-full text-center text-[13px] text-body-text underline">
            Tra cứu lại
          </button>
        </form>
      )}

      {ui.step === "otp" && (
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <h2 className="mb-1 text-[19px] font-bold text-navy">Nhập mã xác minh</h2>
            <p className="text-[13.5px] text-body-text">
              Mã xác minh đã gửi tới <span className="font-semibold text-ink">{ui.emailMasked}</span>.
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
          <button type="button" onClick={resetToIdle} className="w-full text-center text-[13px] text-body-text underline">
            Tra cứu lại
          </button>
        </form>
      )}

      {ui.step === "dead_end" && (
        <div className="space-y-4 text-center">
          <h2 className="text-[19px] font-bold text-navy">Cần hỗ trợ thêm</h2>
          {ui.companyName && (
            <p className="text-[13.5px] text-body-text">
              Tìm thấy công ty <span className="font-semibold text-ink">{ui.companyName}</span>.
            </p>
          )}
          <p className="text-[13.5px] text-body-text">{ui.message}</p>
          <div className="flex gap-3">
            <a href="tel:0898082188" className="flex-1 rounded-full bg-accent px-4 py-3 text-[14px] font-bold text-white">
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
          <button type="button" onClick={resetToIdle} className="w-full text-center text-[13px] text-body-text underline">
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
          <button type="button" onClick={resetToIdle} className="w-full text-center text-[13px] text-body-text underline">
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

/** Dòng thông tin ở Mức 1 (khối kết quả tra cứu ban đầu) kèm icon nhỏ đầu
    dòng — CHỦ Ý không dùng linh vật/hình minh hoạ ở đây, chỉ icon đường nét
    đơn sắc, giữ tông nghiêm túc phù hợp nội dung hợp đồng/pháp lý.

    Label LUÔN ở trên, giá trị LUÔN ở dưới (xếp chồng, không đặt cạnh nhau
    trên cùng 1 hàng) — ÁP DỤNG ĐỒNG NHẤT cho mọi dòng, kể cả dòng badge
    "Tình trạng hợp đồng" ngay dưới. Trước đây dùng `flex justify-between`
    (label trái/giá trị phải cùng hàng) chỉ ổn với giá trị NGẮN — tên công
    ty dài (VD "CÔNG TY TNHH THẾ GIỚI CỬA ĐẸP ADOOR") làm riêng dòng đó bị
    wrap xuống 2 hàng trong khi các dòng giá trị ngắn khác vẫn 1 hàng, tạo
    bố cục không nhất quán giữa các dòng tuỳ độ dài nội dung. Xếp chồng loại
    bỏ hẳn sự phụ thuộc này — giá trị dài bao nhiêu cũng tự wrap gọn bên
    dưới label mà không ảnh hưởng layout dòng khác. */
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="flex items-center gap-1.5 text-body-text">
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </dt>
      <dd className="font-medium text-ink">{value}</dd>
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
