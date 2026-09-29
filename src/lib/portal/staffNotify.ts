import nodemailer from "nodemailer";
import type { PendingOrder } from "./types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Gửi email nhân viên khi có đơn đăng ký mới "paid" — TÁI DÙNG đúng cấu
    hình Zoho SMTP đã có (submit-lead/route.ts, otp.ts), gửi tới CHÍNH
    email đó (cskh@maxoffice.vn) — không cần thêm biến env người nhận
    riêng, nhất quán với cách lead thường đang hoạt động. */
export async function sendStaffNewOrderEmail(order: PendingOrder): Promise<void> {
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

  const rows: [string, string][] = [
    ["Mã đơn hàng", order.orderCode],
    ["Khách hàng", order.customerName],
    ["MST", order.mst || "(chưa có — công ty/hộ kinh doanh mới lập)"],
    ["SĐT", order.phone],
    ["Email", order.email || "(không có)"],
    ["Chi nhánh", order.locationName],
    ["Gói dịch vụ", order.planName],
    ["Số tiền đã thanh toán", order.price.toLocaleString("vi-VN") + "đ"],
    ["Thời điểm thanh toán", order.paidAt ? new Date(order.paidAt).toLocaleString("vi-VN") : "-"],
  ];

  const html = `
    <h2>Đơn đăng ký mới ĐÃ THANH TOÁN qua portal — cần tạo hợp đồng thật</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="font-weight:bold;vertical-align:top">${escapeHtml(label)}</td>
          <td>${escapeHtml(value)}</td>
        </tr>`
        )
        .join("")}
    </table>
    <p>Vui lòng tạo hợp đồng thật theo đúng quy trình hiện tại (sheet DANH SÁCH KHÁCH HÀNG hoặc DU_LIEU tuỳ chi nhánh). Hệ thống sẽ TỰ ĐỘNG nhận diện và khớp hợp đồng này với đơn hàng trên nếu điền đúng MST — nếu khách chưa có MST lúc đăng ký, cần bổ sung thủ công sau khi có.</p>
  `;

  await transporter.sendMail({
    from: ZOHO_EMAIL,
    to: "cskh@maxoffice.vn",
    subject: `[Portal] Đơn mới đã thanh toán - ${order.orderCode} - ${order.customerName}`,
    html,
  });
}
