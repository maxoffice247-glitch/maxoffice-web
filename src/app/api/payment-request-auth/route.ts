import { NextResponse } from "next/server";
import {
  isPaymentRequestPasswordCorrect,
  paymentRequestSessionToken,
  PAYMENT_REQUEST_AUTH_COOKIE,
  PAYMENT_REQUEST_SESSION_MAX_AGE,
} from "@/lib/paymentRequestAuth";

/**
 * Endpoint đăng nhập cho lớp mật khẩu công cụ "Đề nghị thanh toán" — xem chú
 * thích đầy đủ ở paymentRequestAuth.ts. Thành công thì set 1 cookie
 * HttpOnly (JS phía trình duyệt không đọc được) chứa hash mật khẩu, path
 * "/" để route ảnh (api/payment-request-image) cũng nhận được cookie này.
 */
export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Dữ liệu không hợp lệ.", { status: 400 });
  }
  const password = typeof (body as Record<string, unknown>)?.password === "string" ? (body as { password: string }).password : "";

  if (!isPaymentRequestPasswordCorrect(password)) {
    return new Response("Sai mật khẩu.", { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PAYMENT_REQUEST_AUTH_COOKIE, paymentRequestSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: PAYMENT_REQUEST_SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}
