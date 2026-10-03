import { NextResponse } from "next/server";
import { escapeHtml, sendToGoogleSheet, createZohoMailer, LEAD_INBOX, type LeadPayload } from "@/lib/leadDelivery";

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

async function sendEmailNotification(payload: LeadPayload) {
  const { transporter, from } = createZohoMailer();

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
    from,
    to: LEAD_INBOX,
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
  const email = (body.email || "").trim();
  const formType = (body.formType || "Không xác định").trim();
  const isNewsletter = formType.toLowerCase() === "newsletter";

  if (isNewsletter) {
    if (!email) {
      return NextResponse.json({ error: "Thiếu email" }, { status: 400 });
    }
  } else if (!name || !phone) {
    return NextResponse.json(
      { error: "Thiếu họ tên hoặc số điện thoại" },
      { status: 400 }
    );
  }

  const payload = {
    formType,
    name,
    phone,
    email: email || undefined,
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
