/**
 * Hàm ngày THUẦN (không thư viện, không phụ thuộc React/Next) dùng chung client + server
 * và tách riêng để test: định dạng dd/mm/yyyy, so sánh theo NGÀY (không theo giờ) bằng
 * khoá số yyyymmdd.
 */

/** dd/mm/yyyy (cho phép 1 chữ số ngày/tháng) → ngày có THẬT hay không (31/02 → null). */
export function parseVnDate(raw: string): { d: number; m: number; y: number; text: string } | null {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(raw.trim());
  if (!m) return null;
  const d = Number(m[1]);
  const mo = Number(m[2]);
  const y = Number(m[3]);
  if (y < 1900) return null;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  return { d, m: mo, y, text: `${String(d).padStart(2, "0")}/${String(mo).padStart(2, "0")}/${y}` };
}

export const dateKey = (x: { d: number; m: number; y: number }) => x.y * 10000 + x.m * 100 + x.d;

/** Ngày hôm nay theo giờ Việt Nam (UTC+7) — server chạy UTC nên không dùng ngày UTC thô
 * (khách ở VN lúc rạng sáng sẽ bị coi nhầm là "ngày mai"). */
export function todayVnKey(): number {
  const t = new Date(Date.now() + 7 * 3600 * 1000);
  return t.getUTCFullYear() * 10000 + (t.getUTCMonth() + 1) * 100 + t.getUTCDate();
}
