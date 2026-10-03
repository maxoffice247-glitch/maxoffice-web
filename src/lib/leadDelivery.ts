import nodemailer from "nodemailer";

/**
 * Cơ chế gửi lead DÙNG CHUNG (trước đây nằm trọn trong api/submit-lead/route.ts):
 * ghi 1 dòng vào Google Sheet qua webhook + gửi email qua Zoho SMTP tới
 * cskh@maxoffice.vn. Tách ra để route form hồ sơ thành lập
 * (api/submit-company-registration) dùng đúng cùng cơ chế, cùng biến môi
 * trường, cùng định dạng payload gửi sheet — không tạo kênh gửi thứ hai.
 */

export type LeadPayload = {
  formType: string;
  name: string;
  phone: string;
  email?: string;
  service?: string;
  branch?: string;
  date?: string;
  time?: string;
  note?: string;
};

export const LEAD_INBOX = "cskh@maxoffice.vn";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendToGoogleSheet(payload: LeadPayload) {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) throw new Error("Missing GOOGLE_SHEET_WEBHOOK_URL env var");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Google Sheet webhook responded ${res.status}`);
  }
}

/** Trả về transporter Zoho + địa chỉ gửi đi; ném lỗi rõ ràng nếu thiếu cấu hình. */
export function createZohoMailer() {
  const { ZOHO_EMAIL, ZOHO_APP_PASSWORD, ZOHO_SMTP_HOST, ZOHO_SMTP_PORT } = process.env;
  if (!ZOHO_EMAIL || !ZOHO_APP_PASSWORD || !ZOHO_SMTP_HOST || !ZOHO_SMTP_PORT) {
    throw new Error("Missing Zoho SMTP env vars");
  }
  const transporter = nodemailer.createTransport({
    host: ZOHO_SMTP_HOST,
    port: Number(ZOHO_SMTP_PORT),
    secure: Number(ZOHO_SMTP_PORT) === 465,
    auth: { user: ZOHO_EMAIL, pass: ZOHO_APP_PASSWORD },
  });
  return { transporter, from: ZOHO_EMAIL };
}
