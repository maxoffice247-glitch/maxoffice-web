// Chạy: npm test — tài khoản công ty mặc định của công cụ Báo giá tổng hợp.
const test = require("node:test");
const assert = require("node:assert/strict");
const { SRC } = require("./ts-register.cjs");

const vq = require(SRC + "lib/vietQr.ts");

test("Báo giá tổng hợp: mặc định tài khoản 16868889 (Techcombank, CÔNG TY TNHH MAX OFFICE), đứng đầu danh sách chọn, tài khoản cũ vẫn chọn được", () => {
  assert.equal(vq.COMPOSITE_QUOTE_DEFAULT_ACCOUNT_KEY, "16868889");
  assert.deepEqual(vq.COMPOSITE_QUOTE_ACCOUNT_KEYS, ["16868889", "1117777888"]);
  assert.equal(vq.COMPOSITE_QUOTE_ACCOUNT_KEYS[0], vq.COMPOSITE_QUOTE_DEFAULT_ACCOUNT_KEY);
  assert.deepEqual(vq.VIETQR_ACCOUNTS["16868889"], { bankCode: "TCB", accountNumber: "16868889", accountName: "CÔNG TY TNHH MAX OFFICE" });
  assert.equal(vq.isVietQrAccountKey("1117777888"), true);
  for (const key of vq.COMPOSITE_QUOTE_ACCOUNT_KEYS) assert.ok(vq.isVietQrAccountKey(key));
});

test("công cụ Đề nghị thanh toán KHÔNG đổi: DEFAULT_VIETQR_ACCOUNT_KEY vẫn là 1117777888, thứ tự nút chung giữ nguyên", () => {
  assert.equal(vq.DEFAULT_VIETQR_ACCOUNT_KEY, "1117777888");
  assert.deepEqual(vq.VIETQR_ACCOUNT_KEYS, ["1117777888", "16868889"]);
});
