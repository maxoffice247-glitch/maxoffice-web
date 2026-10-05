// Chạy: npm test — thanh toán theo đợt (đặt cọc) của nhóm Dịch vụ MAX OFFICE.
const test = require("node:test");
const assert = require("node:assert/strict");
const { SRC } = require("./ts-register.cjs");

const quote = require(SRC + "lib/compositeQuote.ts");
const dict = require(SRC + "lib/quoteImageDictionary.ts");

const TOTAL = 4_496_800; // LITE 299.000đ x 12 tháng + bảng hiệu 500.000đ, VAT 10%
const lines = (items) => items.map((it) => quote.resolveCompositeQuoteItem(it, "vi"));
const lite = { type: "van-phong-ao", locationSlug: "song-thao", planKey: "lite", months: 12 };
const cks = { type: "chu-ky-so", tierKey: "1-nam" };

test("maxOfficeGroupTotal: chỉ nhóm MAX OFFICE, loại thu hộ; chỉ thu hộ -> null", () => {
  assert.equal(quote.maxOfficeGroupTotal(lines([lite])), TOTAL);
  assert.equal(quote.maxOfficeGroupTotal(lines([lite, cks])), TOTAL);
  assert.equal(quote.maxOfficeGroupTotal(lines([cks])), null);
  assert.equal(quote.maxOfficeGroupTotal([]), null);
});

test("đợt 1: cọc 2.000.000 -> QR 2.000.000, còn lại 2.496.800", () => {
  const r = quote.resolveInstallment({ depositAmount: 2_000_000, installmentStage: "deposit" }, TOTAL);
  assert.deepEqual(
    { total: r.total, deposit: r.deposit, balance: r.balance, qrAmount: r.qrAmount, stage: r.stage },
    { total: TOTAL, deposit: 2_000_000, balance: 2_496_800, qrAmount: 2_000_000, stage: "deposit" }
  );
});

test("đợt 2: QR = phần còn lại 2.496.800, đã cọc 2.000.000", () => {
  const r = quote.resolveInstallment({ depositAmount: 2_000_000, installmentStage: "balance" }, TOTAL);
  assert.equal(r.qrAmount, 2_496_800);
  assert.equal(r.deposit, 2_000_000);
  assert.equal(r.balance, 2_496_800);
});

test("cọc 0, âm, bằng tổng, lớn hơn tổng, không nguyên -> lỗi", () => {
  for (const d of [0, -1, -2_000_000, TOTAL, TOTAL + 1, 1.5]) {
    for (const stage of ["deposit", "balance"]) {
      const r = quote.resolveInstallment({ depositAmount: d, installmentStage: stage }, TOTAL);
      assert.ok(r && "error" in r, `cọc ${d} / ${stage}`);
    }
  }
  // sát biên hợp lệ
  assert.equal(quote.resolveInstallment({ depositAmount: 1, installmentStage: "deposit" }, TOTAL).balance, TOTAL - 1);
  assert.equal(quote.resolveInstallment({ depositAmount: TOTAL - 1, installmentStage: "deposit" }, TOTAL).balance, 1);
});

test("thiếu hoặc sai kiểu depositAmount/installmentStage -> TẮT (null), không lỗi", () => {
  const off = (input) => assert.equal(quote.resolveInstallment(input, TOTAL), null, JSON.stringify(input));
  off({});
  off({ depositAmount: 2_000_000 });
  off({ installmentStage: "deposit" });
  for (const bad of ["2000000", null, true, [], {}, NaN, Infinity]) off({ depositAmount: bad, installmentStage: "deposit" });
  for (const bad of ["Deposit", "", 1, null, true]) off({ depositAmount: 2_000_000, installmentStage: bad });
});

test("báo giá không có nhóm MAX OFFICE (chỉ thu hộ) mà bật đặt cọc -> lỗi", () => {
  const r = quote.resolveInstallment({ depositAmount: 100000, installmentStage: "deposit" }, null);
  assert.ok(r && "error" in r);
  assert.equal(quote.resolveInstallment({}, null), null);
});

test("điều kiện phần còn lại: thiếu/sai kiểu = mặc định, rỗng = không ghi, cắt tối đa 120 ký tự", () => {
  const cond = (balanceCondition) =>
    quote.resolveInstallment({ depositAmount: 1000000, installmentStage: "deposit", balanceCondition }, TOTAL).condition;
  assert.equal(cond(undefined), "khi nhận kết quả hồ sơ");
  assert.equal(cond(5), "khi nhận kết quả hồ sơ");
  assert.equal(cond("   "), "");
  assert.equal(cond("  khi bàn giao GPKD "), "khi bàn giao GPKD");
  assert.equal(cond("x".repeat(500)).length, dict.BALANCE_CONDITION_MAX);
});

test("số tiền khác client gửi kèm bị bỏ qua", () => {
  const r = quote.resolveInstallment(
    { depositAmount: 2_000_000, installmentStage: "deposit", balanceAmount: 1, qrAmount: 1, total: 1, balance: 1 },
    TOTAL
  );
  assert.equal(r.balance, 2_496_800);
  assert.equal(r.qrAmount, 2_000_000);
});

test("nhãn DEPOSIT_LABEL đổi một chỗ là đổi cả khung câu (vi/en)", () => {
  assert.equal(dict.DEPOSIT_LABEL.vi, "Đặt cọc");
  const vi = dict.paymentScheduleText("vi");
  const en = dict.paymentScheduleText("en");
  assert.equal(vi.depositStage1, "Đặt cọc (đợt 1)");
  assert.equal(vi.depositPaid, "Đã đặt cọc");
  assert.equal(en.depositStage1, "Deposit (installment 1)");
  assert.equal(en.depositPaid, "Deposit paid");
  assert.equal(en.balanceDue, "Balance due");
  assert.equal(dict.balanceConditionText("khi nhận kết quả hồ sơ", "en"), "upon receipt of the application results");
  assert.equal(dict.balanceConditionText("khi bàn giao", "en"), "khi bàn giao");
});

test("tên file: hậu tố -COC / -CON-LAI, tắt đợt giữ nguyên", () => {
  const d = new Date(2026, 9, 5);
  const c = { companyName: "Công ty TNHH ABC" };
  const base = quote.buildCompositeQuoteFilename(c, d);
  assert.equal(quote.buildCompositeQuoteFilename(c, d, undefined, "deposit"), base.replace(".png", "-COC.png"));
  assert.equal(quote.buildCompositeQuoteFilename(c, d, undefined, "balance"), base.replace(".png", "-CON-LAI.png"));
  assert.ok(!base.includes("-COC"));
});

test("hậu tố nội dung chuyển khoản mặc định", () => {
  assert.equal(quote.INSTALLMENT_QR_SUFFIX.deposit, " dat coc");
  assert.equal(quote.INSTALLMENT_QR_SUFFIX.balance, " thanh toan con lai");
});

test("nội dung chuyển khoản mặc định theo đợt luôn giữ hậu tố trong 40 ký tự (giới hạn thật của VietQR)", () => {
  const vq = require(SRC + "lib/vietQr.ts");
  const sfx = quote.INSTALLMENT_QR_SUFFIX;
  // đủ chỗ: giữ nguyên dạng "… thanh toan phi dich vu dat coc"
  assert.equal(vq.buildInstallmentQrNote({ companyName: "ABC" }, sfx.deposit), "ABC thanh toan phi dich vu dat coc");
  // tên dài: rút gọn tên, hậu tố vẫn ở cuối và tổng <= 40
  for (const company of ["Công ty TNHH Giải Pháp Doanh Nghiệp Max", "Công ty Cổ phần Đầu tư Phát triển Công nghệ Việt"]) {
    for (const stage of ["deposit", "balance"]) {
      const note = vq.buildInstallmentQrNote({ companyName: company }, sfx[stage]);
      assert.ok(note.endsWith(sfx[stage]), note);
      assert.ok(note.length <= vq.VIETQR_NOTE_MAX_CHARS, `${note} (${note.length})`);
    }
  }
  assert.equal(vq.VIETQR_NOTE_MAX_CHARS, 40);
});
