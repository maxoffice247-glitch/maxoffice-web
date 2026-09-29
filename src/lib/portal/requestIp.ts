/** Lấy IP khách từ header Vercel đặt sẵn (`x-forwarded-for`, IP đầu tiên
    trong danh sách là IP thật của client, các IP sau là proxy trung gian).
    Rơi về 1 giá trị cố định khi chạy local (không có header này) — CHỈ ảnh
    hưởng dev local, không phải lỗ hổng thật vì Vercel luôn set header này
    ở production. */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown-local-ip";
}
