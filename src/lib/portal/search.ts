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
export function searchContract(records: ContractRecord[], rawQuery: string): SearchOutcome {
  const query = rawQuery.trim();
  if (!query) return { type: "not_found" };

  const queryMst = normalizeMst(query);
  const queryContractNo = normalizeContractNumber(query);

  // 1. Khớp chính xác tuyệt đối
  const exactMatch = records.find((r) => {
    const mstExact = queryMst.length > 0 && normalizeMst(r.mst) === queryMst;
    const contractExact = normalizeContractNumber(r.contractNumber) === queryContractNo;
    return mstExact || contractExact;
  });
  if (exactMatch) return { type: "found", record: exactMatch };

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
