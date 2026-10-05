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

/* ---------------- Có nhóm thu hộ: Tc, Tt, G, D ---------------- */
const TC = 5_899_720; // nhóm MAX OFFICE
const TT = 1_045_000; // nhóm thu hộ
const G = TC + TT; // 6.944.720
const D = 2_000_000;
const plan = (stage, o = {}) => quote.resolveInstallment({ depositAmount: D, installmentStage: stage, ...o }, TC, TT);

test("số tay: Tc 5.899.720, Tt 1.045.000, G 6.944.720, D 2.000.000", () => {
  const p1 = plan("deposit");
  assert.deepEqual(
    { total: p1.total, thuHo: p1.thuHo, grand: p1.grand, deposit: p1.deposit, balance: p1.balance, balanceAll: p1.balanceAll, qr: p1.qrAmount },
    { total: TC, thuHo: TT, grand: 6_944_720, deposit: D, balance: 3_899_720, balanceAll: 4_944_720, qr: D }
  );
  const p2 = plan("balance");
  assert.equal(p2.qrAmount, 3_899_720); // QR công ty đợt 2
  assert.equal(p2.thuHo, TT); // QR thu hộ đợt 2 = Tt
  assert.equal(p2.qrAmount + p2.thuHo, 4_944_720); // tổng hai QR = G - D
});

test("tự động: đợt 2 luôn có tổng các QR = G - D; đợt 1 chỉ QR công ty = D; ràng buộc 0 < D < Tc không đổi", () => {
  let seed = 12345;
  const rnd = (n) => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed % n;
  };
  for (let i = 0; i < 2000; i++) {
    const tc = 1000 + rnd(50_000_000);
    const tt = rnd(3) === 0 ? 0 : 1 + rnd(5_000_000);
    const d = 1 + rnd(tc - 1);
    const p1 = quote.resolveInstallment({ depositAmount: d, installmentStage: "deposit" }, tc, tt);
    const p2 = quote.resolveInstallment({ depositAmount: d, installmentStage: "balance" }, tc, tt);
    assert.equal(p1.qrAmount, d);
    assert.equal(p1.balanceAll, tc + tt - d);
    assert.equal(p2.qrAmount + p2.thuHo, tc + tt - d, `tc=${tc} tt=${tt} d=${d}`);
    assert.equal(p2.grand, tc + tt);
  }
  // cọc phải nhỏ hơn Tc (không phải G)
  assert.ok("error" in quote.resolveInstallment({ depositAmount: TC, installmentStage: "deposit" }, TC, TT));
  assert.ok("error" in quote.resolveInstallment({ depositAmount: TC + 1, installmentStage: "deposit" }, TC, TT));
  assert.ok(!("error" in quote.resolveInstallment({ depositAmount: TC - 1, installmentStage: "deposit" }, TC, TT)));
});

test("hàng của khối Lịch thanh toán: có thu hộ tính theo G, bỏ hàng Tổng trên ảnh, kèm chú thích tách đôi", () => {
  const rows1 = quote.installmentScheduleRows(plan("deposit"), "vi", { withTotal: false, includeCondition: true });
  assert.deepEqual(rows1.map((r) => [r.label, r.amount]), [
    ["Đặt cọc (đợt 1) — chuyển tài khoản công ty", D],
    ["Còn lại sau đặt cọc (khi nhận kết quả hồ sơ)", 4_944_720],
  ]);
  assert.equal(rows1[1].note, "gồm tài khoản công ty (3.899.720đ) và tài khoản thu hộ (1.045.000đ)");
  const rows2 = quote.installmentScheduleRows(plan("balance"), "vi", { withTotal: false, includeCondition: true });
  assert.deepEqual(rows2.map((r) => [r.label, r.amount, r.emphasis]), [
    ["Đã đặt cọc", D, false],
    ["Còn phải thanh toán", 4_944_720, true],
  ]);
  assert.equal(rows2[1].note, rows1[1].note);
  // form: có hàng Tổng toàn bộ = G
  const form = quote.installmentScheduleRows(plan("deposit"), "vi", { withTotal: true, includeCondition: false });
  assert.deepEqual([form[0].label, form[0].amount], ["Tổng cộng toàn bộ (đã gồm VAT)", G]);
  assert.equal(form[2].label, "Còn lại sau đặt cọc");
  // tiếng Anh
  const en = quote.installmentScheduleRows(plan("balance"), "en", { withTotal: false, includeCondition: true });
  assert.equal(en[1].label, "Balance due");
  assert.equal(en[1].note, "incl. company account (3,899,720 VND) and collection account (1,045,000 VND)");
  assert.equal(quote.installmentScheduleRows(plan("deposit"), "en", { withTotal: false, includeCondition: true })[1].label, "Remaining balance after deposit (upon receipt of the application results)");
});

test("không có nhóm thu hộ: các hàng y hệt cũ (Tổng / Đặt cọc / Còn lại, điều kiện trong nhãn)", () => {
  const p = quote.resolveInstallment({ depositAmount: D, installmentStage: "deposit" }, 4_496_800);
  assert.equal(p.thuHo, 0);
  const rows = quote.installmentScheduleRows(p, "vi", { withTotal: true, includeCondition: true });
  assert.deepEqual(rows.map((r) => [r.label, r.amount, r.note]), [
    ["Tổng cộng (đã gồm VAT)", 4_496_800, undefined],
    ["Đặt cọc (đợt 1)", D, undefined],
    ["Còn lại (khi nhận kết quả hồ sơ)", 2_496_800, undefined],
  ]);
});

test("thuHoGroupTotal: tổng nhóm thu hộ", () => {
  const ls = [lite, cks].map((it) => quote.resolveCompositeQuoteItem(it, "vi"));
  assert.equal(quote.thuHoGroupTotal(ls), 1_045_000);
  assert.equal(quote.thuHoGroupTotal([ls[0]]), 0);
});
