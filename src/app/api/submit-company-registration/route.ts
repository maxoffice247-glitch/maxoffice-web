import { NextResponse } from "next/server";
import {
  escapeHtml,
  sendToGoogleSheet,
  createZohoMailer,
  LEAD_INBOX,
  type LeadPayload,
} from "@/lib/leadDelivery";
import {
  REGISTRATION_CONFIG,
  buildRegistrationSummary,
  validateRegistration,
  type RegistrationClean,
} from "@/lib/companyRegistration";
import { getRedis } from "@/lib/portal/redisClient";
import { getClientIp } from "@/lib/portal/requestIp";

/**
 * Nhận form "Hồ sơ thành lập doanh nghiệp" (checklist-thanh-lap) — dùng ĐÚNG
 * cơ chế gửi lead của api/submit-lead (cùng webhook Google Sheet + Zoho SMTP,
 * xem lib/leadDelivery.ts), chỉ khác: validate riêng theo loại hình, email
 * dựng riêng từng mục, thêm honeypot + giới hạn theo IP.
 *
 * QUYỀN RIÊNG TƯ: KHÔNG ghi nội dung form vào log server. Nội dung chỉ đi tới
 * đúng 2 nơi: email cskh@maxoffice.vn và sheet lead hiện có. Các console.error
 * bên dưới chỉ ghi tên/mã lỗi, không ghi payload.
 */
export const runtime = "nodejs";

const LEAD_SOURCE = "checklist-thanh-lap";
const MAX_BODY_BYTES = 20_000;
/** Tối đa 5 lượt gửi hợp lệ / 10 phút / IP. */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;

function oneLine(v: string): string {
  return v.replace(/[\r\n]+/g, " ").trim();
}

function errorTag(err: unknown): string {
  if (err && typeof err === "object") {
    const e = err as { name?: string; code?: string };
    return [e.name, e.code].filter(Boolean).join(":") || "Error";
  }
  return "Error";
}

/** Đếm lượt gửi theo IP bằng Redis (INCR + EXPIRE ở lượt đầu). Nếu Redis
 * lỗi/chưa cấu hình thì cho qua (không chặn khách thật chỉ vì hạ tầng chống
 * spam trục trặc) — honeypot + validate vẫn còn hiệu lực. */
async function isRateLimited(ip: string): Promise<boolean> {
  try {
    const redis = getRedis();
    const key = `checklist-thanh-lap:ratelimit:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS);
    return count > RATE_LIMIT_MAX;
  } catch (err) {
    console.error("[submit-company-registration] rate limit unavailable:", errorTag(err));
    return false;
  }
}

function buildEmail(d: RegistrationClean) {
  const cfg = REGISTRATION_CONFIG[d.loai];
  const display = oneLine(d.tenDonVi) || oneLine(d.tenLienHe);
  const subject = `[Hồ sơ thành lập] ${cfg.label} - ${display}`;

  const rows: [string, string][] = [
    ["Loại hình", cfg.label],
    ["Họ tên người liên hệ", d.tenLienHe],
    ["SĐT đăng ký", d.sdt],
    ["Email", d.email],
  ];
  if (cfg.hasWebsite) rows.push(["Website", d.website]);
  rows.push(
    [cfg.nameLabel, d.tenDonVi],
    ["Địa chỉ", d.diaChi],
    ["Ngành nghề kinh doanh", d.nganhNghe],
    [cfg.industryMainLabel, d.nganhChinh],
    [cfg.capitalLabel, d.von ? `${Number(d.von).toLocaleString("vi-VN")} đồng` : ""]
  );
  if (cfg.membersLabel) rows.push([cfg.membersLabel, d.thanhVien]);

  const cell = (v: string) => escapeHtml(v || "-").replace(/\n/g, "<br>");
  const html = `
    <h2>Hồ sơ thành lập doanh nghiệp mới từ website MAX OFFICE</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="font-weight:bold;vertical-align:top">${escapeHtml(label)}</td>
          <td>${cell(value)}</td>
        </tr>`
        )
        .join("")}
    </table>
    <p><b>Ảnh VNeID:</b> khách sẽ gửi qua Zalo (${escapeHtml(cfg.vneidNote.split(":")[0])}).</p>
  `;
  return { subject, html, text: buildRegistrationSummary(d) };
}

async function sendEmail(d: RegistrationClean) {
  const { transporter, from } = createZohoMailer();
  const { subject, html, text } = buildEmail(d);
  await transporter.sendMail({ from, to: LEAD_INBOX, subject, html, text });
}

/** Cùng định dạng payload như submit-lead để Apps Script của sheet lead chạy
 * không cần sửa: thông tin chi tiết gom vào cột "Ghi chú". */
function buildSheetPayload(d: RegistrationClean): LeadPayload {
  const cfg = REGISTRATION_CONFIG[d.loai];
  const note = buildRegistrationSummary(d).split("\n").slice(2).join("\n");
  return {
    formType: LEAD_SOURCE,
    name: d.tenLienHe,
    phone: d.sdt,
    email: d.email || undefined,
    service: `Thành lập doanh nghiệp - ${cfg.label}`,
    note,
  };
}

export async function POST(request: Request) {
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json({ error: "Không đọc được dữ liệu gửi lên." }, { status: 400 });
  }
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Nội dung gửi lên quá lớn." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  // Honeypot: ô "fax" bị ẩn với người thật. Bot điền vào thì trả "thành công"
  // giả ngay, KHÔNG validate/gửi gì — để bot không biết bị phát hiện.
  const fax = body && typeof body === "object" ? (body as Record<string, unknown>).fax : undefined;
  if (typeof fax === "string" && fax.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const result = validateRegistration(body);
  if (!result.ok) {
    return NextResponse.json({ error: "Thông tin chưa hợp lệ.", fields: result.errors }, { status: 400 });
  }

  if (await isRateLimited(getClientIp(request))) {
    return NextResponse.json(
      { error: "Bạn gửi quá nhiều lần trong thời gian ngắn. Vui lòng thử lại sau ít phút hoặc gửi qua Zalo." },
      { status: 429 }
    );
  }

  const [sheetResult, emailResult] = await Promise.allSettled([
    sendToGoogleSheet(buildSheetPayload(result.data)),
    sendEmail(result.data),
  ]);
  const sheetOk = sheetResult.status === "fulfilled";
  const emailOk = emailResult.status === "fulfilled";

  if (!sheetOk) {
    console.error("[submit-company-registration] sheet failed:", errorTag(sheetResult.status === "rejected" ? sheetResult.reason : undefined));
  }
  if (!emailOk) {
    console.error("[submit-company-registration] email failed:", errorTag(emailResult.status === "rejected" ? emailResult.reason : undefined));
  }

  if (!sheetOk && !emailOk) {
    return NextResponse.json({ error: "Không thể gửi hồ sơ lúc này." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, sheet: sheetOk, email: emailOk });
}
