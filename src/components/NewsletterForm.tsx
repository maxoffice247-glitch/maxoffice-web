"use client";

import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircleIcon, MailIcon } from "./icons";
import { useLeadSubmit } from "@/lib/useLeadSubmit";

export default function NewsletterForm({
  title = "Đăng ký nhận bản tin",
  description = "Nhận thông báo khi có bài viết mới về pháp lý, thuế và vận hành doanh nghiệp.",
  compact = false,
}: {
  title?: string;
  description?: string;
  compact?: boolean;
}) {
  const { status, submit, reset } = useLeadSubmit();
  const [email, setEmail] = useState("");
  const uid = useId();

  const doSubmit = async () => {
    await submit({ formType: "newsletter", email });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    doSubmit();
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (status === "error") reset();
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-white p-6 text-center">
        <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-tint text-primary">
          <CheckCircleIcon className="h-6 w-6" />
        </span>
        <p className="text-[14.5px] font-bold text-navy">Đăng ký thành công!</p>
        <p className="mt-1 text-[13px] text-body-text">
          Cảm ơn bạn đã đăng ký nhận bản tin từ MAX OFFICE.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-line bg-white ${compact ? "p-6" : "p-7 sm:p-8"}`}>
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary-tint text-primary">
        <MailIcon className="h-5 w-5" />
      </span>
      <h3 className="mb-1.5 text-[17px] font-bold text-navy">{title}</h3>
      <p className="mb-5 text-[13.5px] leading-relaxed text-body-text">{description}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor={`${uid}-email`} className="sr-only">
          Email
        </label>
        <input
          id={`${uid}-email`}
          required
          type="email"
          placeholder="Email của bạn"
          value={email}
          onChange={handleEmailChange}
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink placeholder:text-body-text/60 transition-colors duration-200 focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-xl bg-accent px-5 py-3 text-[14.5px] font-bold whitespace-nowrap text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark disabled:pointer-events-none disabled:opacity-60"
        >
          {status === "loading" ? "Đang gửi..." : "Đăng ký"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-[12.5px] leading-relaxed text-accent">
          Có lỗi xảy ra, vui lòng thử lại sau.
        </p>
      )}
    </div>
  );
}
