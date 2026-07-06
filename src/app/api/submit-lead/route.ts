import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export type LeadRequestBody = {
  formType?: string;
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  branch?: string;
  date?: string;
  time?: string;
  note?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type LeadPayload = {
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

async function sendToGoogleSheet(payload: LeadPayload) {
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

async function sendEmailNotification(payload: LeadPayload) {
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

  const rows: [string, string | undefined][] = [
    ["Nguồn", payload.formType],
    ["Họ tên", payload.name],
    ["Số điện thoại", payload.phone],
    ["Email", payload.email],
    ["Dịch vụ quan tâm", payload.service],
    ["Chi nhánh", payload.branch],
    ["Ngày mong muốn", payload.date],
    ["Giờ mong muốn", payload.time],
    ["Ghi chú", payload.note],
  ];

  const html = `
    <h2>Lead mới từ website MAX OFFICE</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="font-weight:bold;vertical-align:top">${escapeHtml(label)}</td>
          <td>${escapeHtml(value || "-")}</td>
        </tr>`
        )
        .join("")}
    </table>
  `;

  await transporter.sendMail({
    from: ZOHO_EMAIL,
    to: "cskh@maxoffice.vn",
    subject: `[Website] Lead mới - ${payload.name} - ${payload.service || "Chưa rõ dịch vụ"}`,
    html,
  });
}

export async function POST(request: Request) {
  let body: LeadRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  if (!name || !phone) {
    return NextResponse.json(
      { error: "Thiếu họ tên hoặc số điện thoại" },
      { status: 400 }
    );
  }

  const payload = {
    formType: (body.formType || "Không xác định").trim(),
    name,
    phone,
    email: body.email?.trim() || undefined,
    service: body.service?.trim() || undefined,
    branch: body.branch?.trim() || undefined,
    date: body.date?.trim() || undefined,
    time: body.time?.trim() || undefined,
    note: body.note?.trim() || undefined,
  };

  const [sheetResult, emailResult] = await Promise.allSettled([
    sendToGoogleSheet(payload),
    sendEmailNotification(payload),
  ]);

  const sheetOk = sheetResult.status === "fulfilled";
  const emailOk = emailResult.status === "fulfilled";

  if (!sheetOk) {
    console.error(
      "[submit-lead] Google Sheet webhook failed:",
      sheetResult.status === "rejected" ? sheetResult.reason : undefined
    );
  }
  if (!emailOk) {
    console.error(
      "[submit-lead] Zoho email send failed:",
      emailResult.status === "rejected" ? emailResult.reason : undefined
    );
  }

  if (!sheetOk && !emailOk) {
    return NextResponse.json(
      { error: "Không thể gửi thông tin, cả 2 kênh xử lý đều thất bại" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, sheet: sheetOk, email: emailOk });
}
