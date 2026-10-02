"use client";

import { useState, type FormEvent } from "react";
import { SpinnerIcon } from "./icons";

/**
 * Form nhập mật khẩu cho công cụ nội bộ — CHỈ hiển thị khi Server Component
 * gọi component này phát hiện CHƯA xác thực (xem paymentRequestAuth.ts).
 * Đăng nhập thành công thì tải lại trang để Server Component đọc được cookie
 * mới và render đúng nội dung thật — không tự chuyển trạng thái UI ở client
 * (nội dung thật chưa từng được gửi xuống trình duyệt ở lần tải đầu, không
 * có gì để "hiện ra" phía client).
 */
export default function PasswordGate({
  authEndpoint,
  title,
  description,
}: {
  authEndpoint: string;
  title: string;
  description: string;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(authEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError(res.status === 401 ? "Sai mật khẩu." : "Có lỗi xảy ra, vui lòng thử lại.");
        setLoading(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("Không kết nối được server, vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-5 py-20">
      <form onSubmit={handleSubmit} className="w-full max-w-[380px] rounded-2xl border border-line bg-white p-8 shadow-card">
        <h1 className="mb-2 text-[18px] font-bold text-navy">{title}</h1>
        <p className="mb-5 text-[13px] text-body-text">{description}</p>
        <label htmlFor="password-gate-input" className="mb-1.5 block text-[12px] font-bold text-body-text">
          Mật khẩu
        </label>
        <input
          id="password-gate-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13.5px] text-ink transition-colors duration-200 focus:border-primary focus:outline-none"
        />
        {error && <p className="mt-2 text-[12.5px] text-accent">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-[14px] font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark disabled:pointer-events-none disabled:opacity-50"
        >
          {loading && <SpinnerIcon className="h-4 w-4" />}
          {loading ? "Đang kiểm tra..." : "Vào công cụ"}
        </button>
      </form>
    </section>
  );
}
