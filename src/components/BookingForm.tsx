"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircleIcon } from "./icons";
import { LOCATIONS_LIST } from "@/lib/locationsData";
import { useLeadSubmit } from "@/lib/useLeadSubmit";

const SERVICES = [
  "Văn phòng ảo",
  "Văn phòng trọn gói",
  "Chỗ ngồi linh động",
  "Phòng họp",
  "Thành lập doanh nghiệp",
  "Kế toán & thuế",
  "Tư vấn chung",
];

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink placeholder:text-body-text/60 transition-colors duration-200 focus:border-primary focus:outline-none";

const labelClass = "mb-1.5 block text-[13px] font-bold text-white";

export type BookingFormProps = {
  title?: string;
  description?: string;
  defaultService?: string;
  defaultLocationSlug?: string;
  formType?: string;
  className?: string;
};

type FormState = {
  name: string;
  phone: string;
  email: string;
  service: string;
  branch: string;
  date: string;
  time: string;
  note: string;
};

export default function BookingForm({
  title = "Đặt lịch tham quan / Nhận tư vấn",
  description = "Điền thông tin bên dưới, chuyên viên MAX OFFICE sẽ liên hệ xác nhận trong thời gian sớm nhất.",
  defaultService = "",
  defaultLocationSlug = "",
  formType = "Đặt lịch tham quan",
  className = "",
}: BookingFormProps) {
  const { status, submit } = useLeadSubmit();
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    service: defaultService,
    branch: defaultLocationSlug,
    date: "",
    time: "",
    note: "",
  });

  const update =
    (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const doSubmit = async () => {
    const branchName = LOCATIONS_LIST.find((loc) => loc.slug === form.branch)?.name;
    await submit({
      formType,
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      service: form.service || undefined,
      branch: branchName || form.branch || undefined,
      date: form.date || undefined,
      time: form.time || undefined,
      note: form.note || undefined,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    doSubmit();
  };

  if (status === "success") {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-navy p-10 text-center sm:p-12 ${className}`}
      >
        <div
          aria-hidden
          className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-accent/16 blur-[2px]"
        />
        <span className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-[#8FC1F5]">
          <CheckCircleIcon className="h-7 w-7" />
        </span>
        <h3 className="relative mb-2.5 text-[20px] font-bold text-white">
          Cảm ơn bạn đã đặt lịch!
        </h3>
        <p className="relative max-w-[380px] text-[14.5px] leading-relaxed text-white/70">
          Đội ngũ MAX OFFICE đã nhận được thông tin và sẽ liên hệ xác nhận
          trong vòng 15 phút làm việc. Nếu cần hỗ trợ ngay, hãy gọi hotline{" "}
          <a href="tel:0898082188" className="font-bold text-[#8FC1F5]">
            089 8082 188
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative overflow-hidden rounded-2xl bg-navy p-7 sm:p-8 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent/14 blur-[2px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-primary/20 blur-[2px]"
      />

      <div className="relative">
        <h3 className="mb-1.5 text-[19px] font-bold text-white">{title}</h3>
        <p className="mb-6 text-[14px] text-white/65">{description}</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Họ tên / Tên công ty <span className="text-accent">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Nguyễn Văn A / Công ty ABC"
              value={form.name}
              onChange={update("name")}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Số điện thoại <span className="text-accent">*</span>
            </label>
            <div className="flex overflow-hidden rounded-xl border border-line bg-white transition-colors duration-200 focus-within:border-primary">
              <span className="flex items-center border-r border-line px-3 text-[14.5px] font-bold text-body-text">
                +84
              </span>
              <input
                required
                type="tel"
                placeholder="9xx xxx xxx"
                value={form.phone}
                onChange={update("phone")}
                className="w-full min-w-0 px-3 py-3 text-[14.5px] text-ink placeholder:text-body-text/60 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              placeholder="ban@congty.com"
              value={form.email}
              onChange={update("email")}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Dịch vụ quan tâm <span className="text-accent">*</span>
            </label>
            <select
              required
              value={form.service}
              onChange={update("service")}
              className={`${inputClass} appearance-none`}
            >
              <option value="" disabled>
                Chọn dịch vụ bạn quan tâm
              </option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClass}>Chọn chi nhánh muốn tham quan</label>
          <select
            value={form.branch}
            onChange={update("branch")}
            className={`${inputClass} appearance-none`}
          >
            <option value="">Chưa xác định / Tư vấn giúp tôi chọn</option>
            {LOCATIONS_LIST.map((loc) => (
              <option key={loc.slug} value={loc.slug}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Ngày mong muốn</label>
            <input
              type="date"
              value={form.date}
              onChange={update("date")}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Giờ mong muốn</label>
            <input
              type="time"
              value={form.time}
              onChange={update("time")}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClass}>Ghi chú</label>
          <textarea
            rows={3}
            placeholder="Số lượng nhân viên, yêu cầu không gian..."
            value={form.note}
            onChange={update("note")}
            className={`${inputClass} resize-none`}
          />
        </div>

        {status === "error" && (
          <div className="mt-4 rounded-xl border border-accent/30 bg-accent/10 p-4 text-[13.5px] leading-relaxed text-white">
            Có lỗi xảy ra, vui lòng gọi trực tiếp hotline{" "}
            <a href="tel:0898082188" className="font-bold underline">
              089 8082 188
            </a>{" "}
            hoặc thử lại.{" "}
            <button
              type="button"
              onClick={doSubmit}
              className="font-bold text-[#8FC1F5] underline"
            >
              Thử lại
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-6 flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(229,57,53,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-[0_14px_28px_rgba(229,57,53,0.4)] disabled:pointer-events-none disabled:opacity-60"
        >
          {status === "loading" ? "Đang gửi..." : "Đặt lịch tham quan ngay"}
        </button>
        <p className="mt-3 text-center text-[12px] text-white/50">
          Bằng việc gửi thông tin, bạn đồng ý để MAX OFFICE liên hệ tư vấn.
        </p>
      </div>
    </form>
  );
}
