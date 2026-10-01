import type { PortalRedisClient } from "./redisClient";
import { readContractRecordsCache } from "./recordsCache";
import { pickBestRecord } from "./search";
import { normalizeContractNumber, normalizeMst } from "./normalize";
import { CONTRACT_STATUS_LABEL } from "./contractStatus";

/** Tra lại bản ghi ĐẦY ĐỦ từ cache theo mst/contractNumber đã lưu trong
    phiên, đúng hình dạng response "verified" gửi cho client — dùng CHUNG
    cho 2 nơi: Mức 3 (verify-otp, sau khi khớp OTP) VÀ Mức 2 nhánh mật khẩu
    (confirm, khớp mật khẩu thì vào thẳng Mức 3 luôn, không qua OTP vì
    không có email để gửi) — tránh 2 nơi tự build lại response lệch nhau.
    Dùng pickBestRecord() (không phải .find() lấy dòng đầu) để xử lý đúng
    trường hợp 1 MST khớp nhiều dòng (hợp đồng gốc + phụ lục gia hạn) —
    xem chú thích đầy đủ trong search.ts. Trả null nếu không tìm lại được
    (cache đổi giữa lúc khách đang thao tác).

    LỖI THẬT phát hiện khi test nhánh mật khẩu (contractNumber rỗng ở 1 số
    hợp đồng Mộc Gia): bản gốc (verify-otp/route.ts trước khi tách file
    này) so khớp contractNumber KHÔNG kiểm tra rỗng — 2 chuỗi rỗng vẫn
    "bằng nhau" nên khớp NHẦM sang bất kỳ bản ghi nào khác cũng có
    contractNumber rỗng trong cache (nhiều dòng Mộc Gia chưa điền số hợp
    đồng). Đã sửa: chỉ coi là khớp khi giá trị đã chuẩn hoá của PHIÊN
    không rỗng — cùng nguyên tắc `queryMst.length > 0` đã áp dụng ở
    searchContract() (search.ts). */
export async function loadVerifiedRecordResponse(
  redis: PortalRedisClient,
  session: { mst: string; contractNumber: string }
) {
  const cache = await readContractRecordsCache(redis);
  const sessionMst = normalizeMst(session.mst);
  const sessionContractNo = normalizeContractNumber(session.contractNumber);
  const matches =
    cache?.records.filter((r) => {
      const mstExact = sessionMst.length > 0 && normalizeMst(r.mst) === sessionMst;
      const contractExact = sessionContractNo.length > 0 && normalizeContractNumber(r.contractNumber) === sessionContractNo;
      return mstExact || contractExact;
    }) ?? [];
  if (matches.length === 0) return null;
  const record = pickBestRecord(matches);
  return {
    companyName: record.companyName,
    mst: record.mstDisplay,
    contractNumber: record.contractNumber,
    branch: record.branch,
    startDate: record.startDate,
    endDate: record.endDate,
    totalValue: record.totalValue,
    statusLabel: CONTRACT_STATUS_LABEL[record.status],
    links: record.links,
  };
}
