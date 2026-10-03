import { dateKey, parseVnDate, todayVnKey } from "./vnDate";

/**
 * Nơi cấp CCCD gợi ý theo NGÀY CẤP — hàm thuần, tách riêng để test.
 *
 * Quy tắc (so theo ngày, không theo giờ):
 * - Ngày cấp từ 01/07/2024 trở đi (kể cả đúng 01/07/2024) -> "Bộ Công an".
 * - Ngày cấp trước 01/07/2024 -> "Cục Cảnh sát quản lý hành chính về trật tự xã hội".
 * - Ngày cấp chưa nhập / không hợp lệ (31/02), ở tương lai, hoặc không sau ngày sinh
 *   -> "" (không gợi ý), cùng các quy tắc kiểm tra ngày của form.
 */
export const ISSUE_PLACE_BCA = "Bộ Công an";
export const ISSUE_PLACE_CSQLHC = "Cục Cảnh sát quản lý hành chính về trật tự xã hội";
export const ISSUE_PLACE_CUTOFF_KEY = 20240701;

export function suggestIssuePlace(ngayCap: string, ngaySinh = "", todayKey: number = todayVnKey()): string {
  const issue = parseVnDate(ngayCap);
  if (!issue) return "";
  const k = dateKey(issue);
  if (k > todayKey) return "";
  const birth = parseVnDate(ngaySinh);
  if (birth && k <= dateKey(birth)) return "";
  return k >= ISSUE_PLACE_CUTOFF_KEY ? ISSUE_PLACE_BCA : ISSUE_PLACE_CSQLHC;
}

/** 3 lựa chọn của ô chọn "Nơi cấp" ("" = chưa chọn). */
export type PlaceChoice = "" | "bca" | "csqlhc" | "khac";

export function choiceFromPlace(place: string): PlaceChoice {
  if (place === ISSUE_PLACE_BCA) return "bca";
  if (place === ISSUE_PLACE_CSQLHC) return "csqlhc";
  return "";
}

export function placeFromChoice(choice: PlaceChoice, other: string): string {
  if (choice === "bca") return ISSUE_PLACE_BCA;
  if (choice === "csqlhc") return ISSUE_PLACE_CSQLHC;
  if (choice === "khac") return other.trim();
  return "";
}
