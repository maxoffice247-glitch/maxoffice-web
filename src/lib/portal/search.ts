import { levenshteinDistance } from "./levenshtein";
import { normalizeContractNumber, normalizeMst } from "./normalize";
import type { ContractRecord, SearchOutcome } from "./types";

/** Ngưỡng fuzzy match — đã thống nhất với người dùng:
    - MST: chỉ toàn chữ số (10 ký tự alphabet), ngưỡng lệch RỘNG hơn (2) dễ
      trùng khớp giả giữa các MST khác nhau -> chỉ cho lệch tối đa 1 ký tự.
    - Số hợp đồng: bảng ký tự đa dạng hơn nhiều (chữ+số+"/"), ít rủi ro
      trùng giả hơn ở cùng ngưỡng -> cho lệch tối đa 2 ký tự. */
const MST_FUZZY_THRESHOLD = 1;
const CONTRACT_NUMBER_FUZZY_THRESHOLD = 2;

/** Tra cứu 1 bản ghi theo MST hoặc số hợp đồng khách nhập (`rawQuery`), áp
    dụng đúng thứ tự ưu tiên đã chốt:
      1. Khớp CHÍNH XÁC tuyệt đối (MST hoặc số hợp đồng) — luôn ưu tiên
         trước fuzzy, trả về ngay nếu có.
      2. Khớp gần đúng (Levenshtein, ngưỡng riêng từng loại trường) — CHỈ
         tự nhận là tìm thấy khi có ĐÚNG 1 kết quả duy nhất trong ngưỡng;
         2+ kết quả cùng nằm trong ngưỡng -> coi như "ambiguous" (không tự
         đoán, không phải "not_found" để phân biệt rõ 2 tình huống khi cần
         debug, nhưng cả 2 đều hiển thị cho khách y hệt "không tìm thấy").
    `records`: dữ liệu đã gộp từ cache (Redis) — hàm này THUẦN, không tự
    đọc Redis, để test được không cần I/O. */
/** Khi 1 MST/số hợp đồng khớp CHÍNH XÁC nhiều dòng (VD: hợp đồng gốc +
 * phụ lục gia hạn cùng MST — 1 công ty gia hạn thì trụ sở chính vẫn giữ cả
 * dòng cũ, chỉ thêm dòng mới) — trước đây lấy dòng ĐẦU TIÊN gặp trong mảng
 * (thứ tự đọc Sheets), có thể trả về đúng hợp đồng GỐC ĐÃ HẾT HẠN thay vì
 * bản GIA HẠN còn hiệu lực (lỗi thật, phát hiện qua ECOFEED). Thứ tự ưu
 * tiên đã chốt với người dùng:
 *   1. Có dòng "active" -> CHỈ xét trong nhóm active (bỏ hẳn dòng hết hạn/
 *      chờ thanh toán dù có thể liệt kê trước trong sheet).
 *   2. Trong nhóm đã chọn ở bước 1 (active nếu có, ngược lại TOÀN BỘ các
 *      dòng khớp), lấy dòng có `endDate` XA NHẤT — với nhóm active nghĩa
 *      là "còn hiệu lực lâu nhất" (thường đúng là bản gia hạn mới nhất);
 *      với nhóm toàn bộ đã hết hạn/chờ thanh toán nghĩa là "gần đây nhất"
 *      (mới nhất trong các bản ghi cũ, hợp lý hơn hiện bản quá cũ).
 * Dòng thiếu `endDate` bị xếp sau dòng có ngày (không đoán). Dùng chung
 * cho cả Mức 1 (search) VÀ Mức 3 (verify-otp tra lại bản ghi đầy đủ theo
 * MST) — export để verify-otp/route.ts gọi lại, tránh 2 nơi chọn khác
 * logic nhau. */
export function pickBestRecord(matches: ContractRecord[]): ContractRecord {
  if (matches.length === 1) return matches[0];
  const active = matches.filter((r) => r.status === "active");
  const pool = active.length > 0 ? active : matches;
  return pool.reduce((best, r) => {
    if (r.endDate === null) return best;
    if (best.endDate === null) return r;
    return r.endDate > best.endDate ? r : best;
  });
}

export function searchContract(records: ContractRecord[], rawQuery: string): SearchOutcome {
  const query = rawQuery.trim();
  if (!query) return { type: "not_found" };

  const queryMst = normalizeMst(query);
  const queryContractNo = normalizeContractNumber(query);

  // 1. Khớp chính xác tuyệt đối — có thể có NHIỀU dòng cùng khớp, gộp hết
  // rồi chọn dòng phù hợp nhất bằng pickBestRecord() (xem chú thích trên).
  const exactMatches = records.filter((r) => {
    const mstExact = queryMst.length > 0 && normalizeMst(r.mst) === queryMst;
    const contractExact = normalizeContractNumber(r.contractNumber) === queryContractNo;
    return mstExact || contractExact;
  });
  if (exactMatches.length > 0) return { type: "found", record: pickBestRecord(exactMatches) };

  // 2. Khớp gần đúng — gộp ứng viên theo cả 2 trường, loại trùng theo tham
  // chiếu bản ghi (Set) vì 1 bản ghi có thể vừa gần MST vừa gần số HĐ.
  const candidates = new Set<ContractRecord>();
  // Chỉ thử fuzzy theo MST khi chuỗi số trích ra dài tối thiểu 8 ký tự
  // (MST thật luôn 10 hoặc 13-14 số) — tránh trường hợp khách gõ số hợp
  // đồng (có lẫn vài chữ số ngắn) bị trích nhầm thành 1 chuỗi số ngắn rồi
  // vô tình fuzzy-match trúng 1 MST nào đó không liên quan.
  if (queryMst.length >= 8) {
    for (const r of records) {
      const rMst = normalizeMst(r.mst);
      if (rMst.length === 0) continue;
      if (levenshteinDistance(rMst, queryMst) <= MST_FUZZY_THRESHOLD) candidates.add(r);
    }
  }
  for (const r of records) {
    const rContractNo = normalizeContractNumber(r.contractNumber);
    if (rContractNo.length === 0) continue;
    if (levenshteinDistance(rContractNo, queryContractNo) <= CONTRACT_NUMBER_FUZZY_THRESHOLD) candidates.add(r);
  }

  if (candidates.size === 1) {
    return { type: "found", record: [...candidates][0] };
  }
  if (candidates.size >= 2) {
    return { type: "ambiguous" };
  }
  return { type: "not_found" };
}
