"use client";

import { useState } from "react";
import { trackEvent } from "./gtag";

export type LeadSubmitStatus = "idle" | "loading" | "success" | "error";

export type LeadPayload = {
  formType: string;
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  branch?: string;
  date?: string;
  time?: string;
  note?: string;
};

export function useLeadSubmit() {
  const [status, setStatus] = useState<LeadSubmitStatus>("idle");

  /** `extraEventParams`: tham số GA4 bổ sung (chỉ giá trị KHÔNG định danh, VD nhãn dịch vụ — tuyệt đối không SĐT/tên). */
  async function submit(payload: LeadPayload, extraEventParams?: Record<string, string>) {
    setStatus("loading");
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`submit-lead responded ${res.status}`);
      setStatus("success");
      trackEvent("form_submit", { form_type: payload.formType, service: payload.service, ...extraEventParams });
    } catch (err) {
      console.error("Lead submission failed:", err);
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
  }

  return { status, submit, reset };
}
