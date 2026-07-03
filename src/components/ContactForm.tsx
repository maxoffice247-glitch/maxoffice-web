"use client";

import { useState, type FormEvent } from "react";
import { CheckCircleIcon } from "./icons";

const SERVICES = [
  "Văn phòng ảo",
  "Văn phòng trọn gói",
  "Chỗ ngồi linh động",
  "Phòng họp theo giờ",
  "Thành lập doanh nghiệp",
  "Kế toán & thuế",
  "Khác",
];

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink placeholder:text-body-text/60 transition-colors duration-200 focus:border-primary focus:outline-none";

export default function ContactForm({
  defaultService = "",
  title = "Gửi thông tin cho chúng tôi",
  description = "Điền thông tin bên dưới, chuyên viên MAX OFFICE sẽ liên hệ tư vấn miễn phí trong thời gian sớm nhất.",
}: {
  defaultService?: string;
  title?: string;
  description?: string;
}) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-line bg-white p-10 text-center">
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary-tint text-primary">
          <CheckCircleIcon className="h-7 w-7" />
        </span>
        <h3 className="mb-2.5 text-[20px] font-bold text-navy">
          Cảm ơn bạn đã liên hệ!
        </h3>
        <p className="max-w-[380px] text-[14.5px] leading-relaxed text-body-text">
          Đội ngũ MAX OFFICE đã nhận được thông tin và sẽ liên hệ lại với bạn
          trong vòng 15 phút làm việc. Nếu cần hỗ trợ ngay, hãy gọi hotline{" "}
          <a href="tel:0898082188" className="font-bold text-primary">
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
      className="rounded-2xl border border-line bg-white p-7 sm:p-8"
    >
      <h3 className="mb-1.5 text-[19px] font-bold text-navy">{title}</h3>
      <p className="mb-6 text-[14px] text-body-text">{description}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-navy">
            Họ tên <span className="text-accent">*</span>
          </label>
          <input required type="text" placeholder="Nguyễn Văn A" className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-navy">
            Số điện thoại <span className="text-accent">*</span>
          </label>
          <input required type="tel" placeholder="09xx xxx xxx" className={inputClass} />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-[13px] font-bold text-navy">
          Email
        </label>
        <input type="email" placeholder="ban@congty.com" className={inputClass} />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-[13px] font-bold text-navy">
          Dịch vụ quan tâm
        </label>
        <select defaultValue={defaultService} className={`${inputClass} appearance-none`}>
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

      <div className="mt-4">
        <label className="mb-1.5 block text-[13px] font-bold text-navy">
          Lời nhắn
        </label>
        <textarea
          rows={4}
          placeholder="Cho chúng tôi biết thêm về nhu cầu của bạn..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="mt-6 flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(229,57,53,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-[0_14px_28px_rgba(229,57,53,0.35)]"
      >
        Gửi thông tin
      </button>
      <p className="mt-3 text-center text-[12px] text-body-text">
        Bằng việc gửi thông tin, bạn đồng ý để MAX OFFICE liên hệ tư vấn.
      </p>
    </form>
  );
}
