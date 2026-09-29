"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { OfferedPlan } from "@/lib/planFinder";

type Props = {
  locations: { slug: string; name: string }[];
  plans: OfferedPlan[];
};

type StepForm = { step: "form" };
type StepPaying = { step: "paying"; orderCode: string; qrUrl: string; amount: number; sepayConfigured: boolean };
type StepPaid = { step: "paid"; orderCode: string };
type UiState = StepForm | StepPaying | StepPaid;

const POLL_INTERVAL_MS = 4000;

/** Form đăng ký dịch vụ mới (Luồng B, Phase 2) — 2 bước: điền thông tin →
    QR thanh toán (polling tự động tới khi "paid"). KHÔNG tự tính giá/tên
    gói phía client — server (POST /api/portal/orders) tự tra lại từ
    getOfferedPlan() theo đúng locationSlug+planKey gửi lên, tránh rủi ro
    client tự sửa giá trước khi gửi. */
export default function RegisterOrderForm({ locations, plans }: Props) {
  const [ui, setUi] = useState<UiState>({ step: "form" });
  const [customerName, setCustomerName] = useState("");
  const [mst, setMst] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [locationSlug, setLocationSlug] = useState(locations[0]?.slug ?? "");
  const [planKey, setPlanKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const plansForLocation = plans.filter((p) => p.locationSlug === locationSlug);
  // Không cần effect để "đồng bộ" planKey mặc định khi đổi chi nhánh — rơi
  // về plansForLocation[0] ngay tại đây là đủ (tránh lỗi lint
  // react-hooks/set-state-in-effect vì gọi setState đồng bộ trong effect
  // chỉ để đồng bộ 1 giá trị đã tính được ngay lúc render).
  const selectedPlan = plansForLocation.find((p) => p.planKey === planKey) ?? plansForLocation[0];

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const startPolling = (orderCode: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/portal/orders/${orderCode}`);
        const data = await res.json();
        if (data.status === "paid") {
          if (pollRef.current) clearInterval(pollRef.current);
          setUi({ step: "paid", orderCode });
        } else if (data.status === "expired") {
          if (pollRef.current) clearInterval(pollRef.current);
          setErrorMessage("Đơn hàng đã hết hạn (quá 30 phút chưa thanh toán). Vui lòng đăng ký lại.");
          setUi({ step: "form" });
        }
      } catch {
        // Bỏ qua lỗi mạng tạm thời của 1 lượt poll — vòng lặp sẽ tự thử lại.
      }
    }, POLL_INTERVAL_MS);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || loading) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/portal/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          mst: mst.trim() || undefined,
          phone: phone.trim(),
          email: email.trim() || undefined,
          locationSlug,
          planKey: selectedPlan.planKey,
        }),
      });
      const data = await res.json();
      if (data.status === "created") {
        setUi({ step: "paying", orderCode: data.orderCode, qrUrl: data.qrUrl, amount: data.amount, sepayConfigured: data.sepayConfigured });
        startPolling(data.orderCode);
      } else {
        setErrorMessage(data.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch {
      setErrorMessage("Không kết nối được máy chủ, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[480px] rounded-2xl bg-white p-7 shadow-[0_20px_60px_rgba(11,31,58,0.12)] sm:p-8">
      {ui.step === "form" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h2 className="mb-1 text-[19px] font-bold text-navy">Đăng ký dịch vụ</h2>
            <p className="text-[13.5px] text-body-text">Điền thông tin để nhận mã QR thanh toán.</p>
          </div>

          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Tên công ty hoặc họ tên"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink placeholder:text-body-text/60 focus:border-primary focus:outline-none"
          />
          <input
            type="text"
            value={mst}
            onChange={(e) => setMst(e.target.value)}
            placeholder="Mã số thuế (để trống nếu chưa có)"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink placeholder:text-body-text/60 focus:border-primary focus:outline-none"
          />
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Số điện thoại"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink placeholder:text-body-text/60 focus:border-primary focus:outline-none"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (không bắt buộc)"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink placeholder:text-body-text/60 focus:border-primary focus:outline-none"
          />

          <select
            value={locationSlug}
            onChange={(e) => {
              setLocationSlug(e.target.value);
              setPlanKey("");
            }}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink focus:border-primary focus:outline-none"
          >
            {locations.map((loc) => (
              <option key={loc.slug} value={loc.slug}>
                {loc.name}
              </option>
            ))}
          </select>

          <select
            value={selectedPlan?.planKey ?? ""}
            onChange={(e) => setPlanKey(e.target.value)}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink focus:border-primary focus:outline-none"
          >
            {plansForLocation.map((p) => (
              <option key={p.planKey} value={p.planKey}>
                {p.planName} — {p.price.toLocaleString("vi-VN")}đ/{p.duration}
              </option>
            ))}
          </select>

          {errorMessage && <p className="text-[13px] text-accent">{errorMessage}</p>}

          <button
            type="submit"
            disabled={loading || !selectedPlan}
            className="flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-white transition-colors duration-200 hover:bg-accent-dark disabled:pointer-events-none disabled:opacity-60"
          >
            {loading ? "Đang tạo đơn..." : "Tạo đơn & thanh toán"}
          </button>
        </form>
      )}

      {ui.step === "paying" && (
        <div className="space-y-4 text-center">
          <h2 className="text-[19px] font-bold text-navy">Quét mã QR để thanh toán</h2>
          <p className="text-[13.5px] text-body-text">
            Mã đơn: <span className="font-semibold text-ink">{ui.orderCode}</span>
          </p>
          {!ui.sepayConfigured && (
            <p className="rounded-lg bg-amber/10 px-3 py-2 text-[12.5px] text-amber-dark">
              Hệ thống thanh toán đang được cấu hình — nếu mã QR không quét được, vui lòng liên hệ CSKH.
            </p>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element -- ảnh QR động từ VietQR, không qua next/image */}
          <img src={ui.qrUrl} alt="Mã QR thanh toán" className="mx-auto h-[240px] w-[240px] rounded-xl border border-line object-contain" />
          <p className="text-[16px] font-bold text-accent">{ui.amount.toLocaleString("vi-VN")}đ</p>
          <p className="text-[13px] text-body-text">Đang chờ xác nhận thanh toán tự động...</p>
        </div>
      )}

      {ui.step === "paid" && (
        <div className="space-y-4 text-center">
          <h2 className="text-[19px] font-bold text-navy">Thanh toán thành công!</h2>
          <p className="text-[13.5px] text-body-text">
            Mã đơn hàng của bạn: <span className="font-semibold text-ink">{ui.orderCode}</span> — vui lòng lưu lại
            để đối chiếu khi cần.
          </p>
          <p className="text-[13.5px] text-body-text">
            MAX OFFICE sẽ liên hệ xử lý hợp đồng trong giờ làm việc. Sau khi hợp đồng được tạo, bạn có thể tra cứu
            tại trang <span className="font-semibold text-ink">Tra cứu hợp đồng</span> bằng mã số thuế.
          </p>
        </div>
      )}
    </div>
  );
}
