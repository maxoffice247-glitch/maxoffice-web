// Chạy: npm test — đặt cọc cho nhóm Dịch vụ MAX OFFICE.
// QUY TRÌNH THẬT: khách đặt cọc D (đợt 1); khi hoàn tất chuyển ĐỦ 100% tổng báo giá G (đợt 2); sau đó MAX OFFICE hoàn lại D. Cọc KHÔNG trừ vào tổng.
const test = require("node:test");
const assert = require("node:assert/strict");
const { SRC } = require("./ts-register.cjs");

const quote = require(SRC + "lib/compositeQuote.ts");
const dict = require(SRC + "lib/quoteImageDictionary.ts");

const TOTAL = 4_486_800; // LITE 299.000đ x 12 tháng + bảng hiệu 500.000đ, VAT 10% tiền thuê + 8% bảng hiệu
const lines = (items) => items.map((it) => quote.resolveCompositeQuoteItem(it, "vi"));
const lite = { type: "van-phong-ao", locationSlug: "song-thao", planKey: "lite", months: 12 };
const cks = { type: "chu-ky-so", tierKey: "1-nam" };

test("maxOfficeGroupTotal / thuHoGroupTotal: tách nhóm MAX OFFICE và thu hộ", () => {
  assert.equal(quote.maxOfficeGroupTotal(lines([lite])), TOTAL);
  assert.equal(quote.maxOfficeGroupTotal(lines([lite, cks])), TOTAL);
  assert.equal(quote.maxOfficeGroupTotal(lines([cks])), null);
  assert.equal(quote.maxOfficeGroupTotal([]), null);
  assert.equal(quote.thuHoGroupTotal(lines([lite, cks])), 1_045_000);
  assert.equal(quote.thuHoGroupTotal(lines([lite])), 0);
});

test("không có thu hộ (Tc 4.486.800, D 2.000.000): đợt 1 QR = D; đợt 2 một QR = Tc, tổng G = Tc", () => {
  const p1 = quote.resolveInstallment({ depositAmount: 2_000_000, installmentStage: "deposit" }, TOTAL);
  assert.deepEqual(
    { stage: p1.stage, total: p1.total, deposit: p1.deposit, thuHo: p1.thuHo, grand: p1.grand, qr: p1.qrAmount },
    { stage: "deposit", total: TOTAL, deposit: 2_000_000, thuHo: 0, grand: TOTAL, qr: 2_000_000 }
  );
  const p2 = quote.resolveInstallment({ depositAmount: 2_000_000, installmentStage: "full" }, TOTAL);
  assert.deepEqual({ stage: p2.stage, qr: p2.qrAmount, grand: p2.grand }, { stage: "full", qr: TOTAL, grand: TOTAL });
});

test('"balance" là bí danh của "full" (client cũ trong bộ nhớ đệm)', () => {
  const a = quote.resolveInstallment({ depositAmount: 2_000_000, installmentStage: "balance" }, TOTAL, 1_045_000);
  const b = quote.resolveInstallment({ depositAmount: 2_000_000, installmentStage: "full" }, TOTAL, 1_045_000);
  assert.deepEqual(a, b);
  assert.equal(a.stage, "full");
});

test("cọc 0, âm, bằng Tc, lớn hơn Tc, không nguyên -> lỗi; sát biên hợp lệ", () => {
  for (const d of [0, -1, -2_000_000, TOTAL, TOTAL + 1, 1.5]) {
    for (const stage of ["deposit", "full", "balance"]) {
      const r = quote.resolveInstallment({ depositAmount: d, installmentStage: stage }, TOTAL);
      assert.ok(r && "error" in r, `cọc ${d} / ${stage}`);
    }
  }
  assert.ok(!("error" in quote.resolveInstallment({ depositAmount: 1, installmentStage: "deposit" }, TOTAL)));
  assert.ok(!("error" in quote.resolveInstallment({ depositAmount: TOTAL - 1, installmentStage: "full" }, TOTAL)));
});

test("thiếu hoặc sai kiểu depositAmount/installmentStage -> TẮT (null), không lỗi", () => {
  const off = (input) => assert.equal(quote.resolveInstallment(input, TOTAL), null, JSON.stringify(input));
  off({});
  off({ depositAmount: 2_000_000 });
  off({ installmentStage: "deposit" });
  for (const bad of ["2000000", null, true, [], {}, NaN, Infinity]) off({ depositAmount: bad, installmentStage: "deposit" });
  for (const bad of ["Deposit", "", 1, null, true, "remaining", "pay"]) off({ depositAmount: 2_000_000, installmentStage: bad });
});

test("báo giá không có nhóm MAX OFFICE (chỉ thu hộ) mà bật đặt cọc -> lỗi", () => {
  const r = quote.resolveInstallment({ depositAmount: 100000, installmentStage: "deposit" }, null);
  assert.ok(r && "error" in r);
  assert.equal(quote.resolveInstallment({}, null), null);
});

test("thời điểm thanh toán đủ: thiếu/sai kiểu = mặc định, rỗng = không ghi, cắt 120 ký tự; tên cũ balanceCondition vẫn đọc được", () => {
  const timing = (extra) =>
    quote.resolveInstallment({ depositAmount: 1_000_000, installmentStage: "deposit", ...extra }, TOTAL).timing;
  assert.equal(timing({}), "khi nhận kết quả hồ sơ");
  assert.equal(timing({ fullPaymentTiming: 5 }), "khi nhận kết quả hồ sơ");
  assert.equal(timing({ fullPaymentTiming: "   " }), "");
  assert.equal(timing({ fullPaymentTiming: "  khi bàn giao GPKD " }), "khi bàn giao GPKD");
  assert.equal(timing({ fullPaymentTiming: "x".repeat(500) }).length, dict.FULL_PAYMENT_TIMING_MAX);
  assert.equal(dict.FULL_PAYMENT_TIMING_MAX, 120);
  assert.equal(timing({ balanceCondition: "khi ký hợp đồng" }), "khi ký hợp đồng"); // client cũ
  assert.equal(timing({ balanceCondition: "cũ", fullPaymentTiming: "mới" }), "mới");
});

test("điều kiện hoàn cọc: thiếu/sai kiểu = mặc định, rỗng = không ghi, cắt 200 ký tự", () => {
  const refund = (extra) =>
    quote.resolveInstallment({ depositAmount: 1_000_000, installmentStage: "full", ...extra }, TOTAL).refundCondition;
  assert.equal(refund({}), "Tiền đặt cọc sẽ được MAX OFFICE hoàn lại vào tài khoản cá nhân của bạn sau khi bạn thanh toán đủ");
  assert.equal(refund({ refundCondition: 3 }), dict.DEFAULT_REFUND_CONDITION.vi);
  assert.equal(refund({ refundCondition: "" }), "");
  assert.equal(refund({ refundCondition: "x".repeat(900) }).length, dict.REFUND_CONDITION_MAX);
  assert.equal(dict.REFUND_CONDITION_MAX, 200);
});

test("số tiền khác client gửi kèm bị bỏ qua", () => {
  const r = quote.resolveInstallment(
    { depositAmount: 2_000_000, installmentStage: "deposit", qrAmount: 1, total: 1, grand: 1, balance: 1, amountDue: 1 },
    TOTAL
  );
  assert.equal(r.qrAmount, 2_000_000);
  assert.equal(r.grand, TOTAL);
});

test("DEPOSIT_LABEL đổi một chỗ là đổi cả khung câu (vi/en)", () => {
  assert.equal(dict.DEPOSIT_LABEL.vi, "Đặt cọc");
  const vi = dict.paymentScheduleText("vi");
  const en = dict.paymentScheduleText("en");
  assert.equal(vi.depositStage1Company, "Đặt cọc (đợt 1) — chuyển tài khoản công ty");
  assert.equal(vi.refundDeposit, "Hoàn lại tiền đặt cọc");
  assert.equal(vi.depositPaid, "Đã đặt cọc");
  assert.equal(vi.amountDue, "Cần thanh toán");
  assert.equal(vi.fullPaymentTiming("khi bàn giao"), "Thanh toán đủ (khi bàn giao)");
  assert.equal(en.depositStage1Company, "Deposit (installment 1) — transfer to company account");
  assert.equal(en.fullPaymentTiming("upon X"), "Full payment (upon X)");
  assert.equal(en.refundDeposit, "Deposit refund");
  assert.equal(en.depositPaid, "Deposit paid");
  assert.equal(en.amountDue, "Amount due");
  assert.equal(dict.defaultAwareText("khi nhận kết quả hồ sơ", dict.DEFAULT_FULL_PAYMENT_TIMING, "en"), "upon receipt of the application results");
  assert.equal(dict.defaultAwareText("khi bàn giao", dict.DEFAULT_FULL_PAYMENT_TIMING, "en"), "khi bàn giao");
  assert.equal(dict.DEFAULT_REFUND_CONDITION.en, "The deposit will be refunded to your personal account after you complete the full payment");
});

test("tên file: -COC (đợt 1), -DA-COC (đợt 2); tắt đặt cọc giữ nguyên", () => {
  const d = new Date(2026, 9, 5);
  const c = { companyName: "Công ty TNHH ABC" };
  const base = quote.buildCompositeQuoteFilename(c, d);
  assert.equal(quote.buildCompositeQuoteFilename(c, d, undefined, "deposit"), base.replace(".png", "-COC.png"));
  assert.equal(quote.buildCompositeQuoteFilename(c, d, undefined, "full"), base.replace(".png", "-DA-COC.png"));
  assert.ok(!base.includes("-COC"));
});

test("nội dung chuyển khoản đợt 1: hậu tố ' dat coc' (rút gọn tên để hậu tố còn trong 40 ký tự); đợt 2 không có hậu tố", () => {
  const vq = require(SRC + "lib/vietQr.ts");
  const sfx = quote.INSTALLMENT_QR_SUFFIX;
  assert.deepEqual(Object.keys(sfx), ["deposit"]);
  assert.equal(sfx.deposit, " dat coc");
  assert.equal(vq.buildInstallmentQrNote({ companyName: "ABC" }, sfx.deposit), "ABC thanh toan phi dich vu dat coc");
  for (const company of ["Công ty TNHH Giải Pháp Doanh Nghiệp Max", "Công ty Cổ phần Đầu tư Phát triển Công nghệ Việt"]) {
    const note = vq.buildInstallmentQrNote({ companyName: company }, sfx.deposit);
    assert.ok(note.endsWith(sfx.deposit), note);
    assert.ok(note.length <= vq.VIETQR_NOTE_MAX_CHARS, `${note} (${note.length})`);
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
    { total: p1.total, thuHo: p1.thuHo, grand: p1.grand, deposit: p1.deposit, qr: p1.qrAmount },
    { total: TC, thuHo: TT, grand: 6_944_720, deposit: D, qr: D }
  ); // đợt 1: chỉ QR công ty = D, không QR thu hộ
  const p2 = plan("full");
  assert.equal(p2.qrAmount, 5_899_720); // QR công ty = Tc
  assert.equal(p2.thuHo, 1_045_000); // QR thu hộ = Tt
  assert.equal(p2.qrAmount + p2.thuHo, 6_944_720); // tổng hai QR = G
});

test("tự động: đợt 2 tổng các QR luôn = G; đợt 1 QR luôn = D; ràng buộc 0 < D < Tc", () => {
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
    const p2 = quote.resolveInstallment({ depositAmount: d, installmentStage: "full" }, tc, tt);
    assert.equal(p1.qrAmount, d);
    assert.equal(p1.grand, tc + tt);
    assert.equal(p2.qrAmount + p2.thuHo, tc + tt, `tc=${tc} tt=${tt} d=${d}`);
    assert.equal(p2.grand, tc + tt);
  }
  assert.ok("error" in quote.resolveInstallment({ depositAmount: TC, installmentStage: "deposit" }, TC, TT)); // phải < Tc, không phải < G
  assert.ok("error" in quote.resolveInstallment({ depositAmount: TC + 1, installmentStage: "full" }, TC, TT));
  assert.ok(!("error" in quote.resolveInstallment({ depositAmount: TC - 1, installmentStage: "deposit" }, TC, TT)));
});

test("hàng Lịch thanh toán đợt 1 (có thu hộ): Đặt cọc D / Thanh toán đủ G + chú thích tách / Hoàn lại cọc D + điều kiện", () => {
  const rows = quote.installmentScheduleRows(plan("deposit"), "vi");
  assert.deepEqual(rows.map((r) => [r.label, r.amount, r.emphasis]), [
    ["Đặt cọc (đợt 1) — chuyển tài khoản công ty", D, true],
    ["Thanh toán đủ (khi nhận kết quả hồ sơ)", G, false],
    ["Hoàn lại tiền đặt cọc", D, false],
  ]);
  assert.equal(rows[1].note, "gồm tài khoản công ty (5.899.720đ) và tài khoản thu hộ (1.045.000đ)");
  assert.equal(rows[2].note, dict.DEFAULT_REFUND_CONDITION.vi);
  assert.equal(rows[0].note, undefined);
});

test("hàng Lịch thanh toán đợt 2 (có thu hộ): Đã đặt cọc D + điều kiện hoàn / Cần thanh toán G (nhấn) + chú thích tách", () => {
  const rows = quote.installmentScheduleRows(plan("full"), "vi");
  assert.deepEqual(rows.map((r) => [r.label, r.amount, r.emphasis]), [
    ["Đã đặt cọc", D, false],
    ["Cần thanh toán", G, true],
  ]);
  assert.equal(rows[0].note, dict.DEFAULT_REFUND_CONDITION.vi);
  assert.equal(rows[1].note, "gồm tài khoản công ty (5.899.720đ) và tài khoản thu hộ (1.045.000đ)");
});

test("không có thu hộ: không chú thích tách; điều kiện rỗng thì không có chú thích hoàn cọc", () => {
  const p = quote.resolveInstallment({ depositAmount: D, installmentStage: "deposit", refundCondition: "", fullPaymentTiming: "" }, TOTAL);
  const rows = quote.installmentScheduleRows(p, "vi");
  assert.deepEqual(rows.map((r) => [r.label, r.amount, r.note]), [
    ["Đặt cọc (đợt 1) — chuyển tài khoản công ty", D, undefined],
    ["Thanh toán đủ", TOTAL, undefined],
    ["Hoàn lại tiền đặt cọc", D, undefined],
  ]);
});

test("KHÔNG BAO GIỜ có số G - D (cọc không trừ vào tổng) ở các hàng ảnh lẫn tóm tắt form, mọi tổ hợp", () => {
  for (const [tc, tt] of [[TC, TT], [TOTAL, 0], [10_000_000, 3_000_000]]) {
    for (const d of [1, 2_000_000, tc - 1]) {
      for (const stage of ["deposit", "full"]) {
        const p = quote.resolveInstallment({ depositAmount: d, installmentStage: stage }, tc, tt);
        const banned = new Set([p.grand - d, tc - d].filter((n) => n !== d && n !== p.grand && n !== tc && n !== tt));
        const amounts = [
          ...quote.installmentScheduleRows(p, "vi").map((r) => r.amount),
          ...quote.installmentSummaryRows(p).map((r) => r.amount),
        ];
        for (const a of amounts) assert.ok(!banned.has(a), `${stage} tc=${tc} tt=${tt} d=${d}: xuất hiện ${a}`);
        for (const r of quote.installmentScheduleRows(p, "vi")) {
          for (const n of banned) {
            const re = new RegExp(`(?<![\\d.])${n.toLocaleString("vi-VN").replace(/\./g, "\\.")}đ`);
            assert.ok(!re.test(r.note || ""), `${stage}: note ${r.note}`);
          }
        }
      }
    }
  }
});

test("tiếng Anh: câu của khối Lịch thanh toán", () => {
  const rows1 = quote.installmentScheduleRows(plan("deposit"), "en");
  assert.deepEqual(rows1.map((r) => r.label), [
    "Deposit (installment 1) — transfer to company account",
    "Full payment (upon receipt of the application results)",
    "Deposit refund",
  ]);
  assert.equal(rows1[1].note, "incl. company account (5,899,720 VND) and collection account (1,045,000 VND)");
  assert.equal(rows1[2].note, "The deposit will be refunded to your personal account after you complete the full payment");
  const rows2 = quote.installmentScheduleRows(plan("full"), "en");
  assert.deepEqual(rows2.map((r) => r.label), ["Deposit paid", "Amount due"]);
  // câu tự gõ giữ nguyên
  const custom = quote.installmentScheduleRows(plan("deposit", { fullPaymentTiming: "khi bàn giao" }), "en");
  assert.equal(custom[1].label, "Full payment (khi bàn giao)");
});

test("tóm tắt form: Tổng toàn bộ G / Đặt cọc D / Thanh toán đủ khi hoàn tất G / Hoàn lại cọc D", () => {
  assert.deepEqual(quote.installmentSummaryRows(plan("deposit")).map((r) => [r.label, r.amount]), [
    ["Tổng toàn bộ (đã gồm VAT)", G],
    ["Đặt cọc", D],
    ["Thanh toán đủ khi hoàn tất", G],
    ["Hoàn lại cọc sau khi thanh toán đủ", D],
  ]);
  assert.equal(quote.installmentSummaryRows(plan("full"))[1].label, "Đã đặt cọc");
});
