// Chạy: npm test — thanh toán theo đợt (đặt cọc) cho nhóm Dịch vụ MAX OFFICE.
// Đợt 1: Đặt cọc D + Còn lại G - D. Đợt 2 chọn 1 trong 2: 100% tổng báo giá G ("full") hoặc phần còn lại sau cọc G - D ("remaining").
// Ảnh/form KHÔNG nói gì về việc hoàn tiền cọc.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { SRC } = require("./ts-register.cjs");

const quote = require(SRC + "lib/compositeQuote.ts");
const dict = require(SRC + "lib/quoteImageDictionary.ts");

const TOTAL = 4_486_800; // LITE 299.000đ x 12 tháng + bảng hiệu 500.000đ (VAT 10% tiền thuê + 8% bảng hiệu)
const lines = (items) => items.map((it) => quote.resolveCompositeQuoteItem(it, "vi"));
const lite = { type: "van-phong-ao", locationSlug: "song-thao", planKey: "lite", months: 12 };
const cks = { type: "chu-ky-so", tierKey: "1-nam" };
const resolve = (input, tc = TOTAL, tt = 0) => quote.resolveInstallment(input, tc, tt);

test("maxOfficeGroupTotal / thuHoGroupTotal: tách nhóm MAX OFFICE và thu hộ", () => {
  assert.equal(quote.maxOfficeGroupTotal(lines([lite])), TOTAL);
  assert.equal(quote.maxOfficeGroupTotal(lines([lite, cks])), TOTAL);
  assert.equal(quote.maxOfficeGroupTotal(lines([cks])), null);
  assert.equal(quote.maxOfficeGroupTotal([]), null);
  assert.equal(quote.thuHoGroupTotal(lines([lite, cks])), 1_045_000);
  assert.equal(quote.thuHoGroupTotal(lines([lite])), 0);
});

test("không thu hộ (Tc 4.486.800, D 2.000.000): đợt 1 QR 2.000.000, còn lại 2.486.800; đợt 2 '100%' QR 4.486.800; 'còn lại' QR 2.486.800", () => {
  const p1 = resolve({ depositAmount: 2_000_000, installmentStage: "deposit" });
  assert.deepEqual(
    { stage: p1.stage, total: p1.total, deposit: p1.deposit, thuHo: p1.thuHo, grand: p1.grand, balance: p1.balance, qr: p1.qrAmount },
    { stage: "deposit", total: TOTAL, deposit: 2_000_000, thuHo: 0, grand: TOTAL, balance: 2_486_800, qr: 2_000_000 }
  );
  const full = resolve({ depositAmount: 2_000_000, installmentStage: "full" });
  assert.equal(full.qrAmount, 4_486_800);
  const rem = resolve({ depositAmount: 2_000_000, installmentStage: "remaining" });
  assert.deepEqual({ stage: rem.stage, qr: rem.qrAmount, balance: rem.balance }, { stage: "remaining", qr: 2_486_800, balance: 2_486_800 });
});

test('"balance" là bí danh của "full" (client cũ trong bộ nhớ đệm)', () => {
  const a = resolve({ depositAmount: 2_000_000, installmentStage: "balance" }, TOTAL, 1_045_000);
  const b = resolve({ depositAmount: 2_000_000, installmentStage: "full" }, TOTAL, 1_045_000);
  assert.deepEqual(a, b);
  assert.equal(a.stage, "full");
});

test("đợt 2 '100%' không cần số cọc; đợt 1 và 'còn lại' cần số cọc (thiếu/sai kiểu = tắt)", () => {
  const f = resolve({ installmentStage: "full" }, TOTAL, 1_045_000);
  assert.ok(f && !("error" in f));
  assert.equal(f.deposit, 0);
  assert.equal(f.grand, 5_531_800);
  assert.equal(f.qrAmount, TOTAL);
  for (const stage of ["deposit", "remaining"]) {
    assert.equal(resolve({ installmentStage: stage }), null, stage);
    for (const bad of ["2000000", null, true, [], {}, NaN, Infinity]) assert.equal(resolve({ depositAmount: bad, installmentStage: stage }), null, `${stage} ${String(bad)}`);
  }
  // "full" mà D sai kiểu -> bỏ qua D (không lỗi)
  assert.equal(resolve({ depositAmount: "x", installmentStage: "full" }).deposit, 0);
});

test("cọc 0, âm, bằng Tc, lớn hơn Tc, không nguyên -> lỗi ở mọi chế độ (kể cả 'full' khi có gửi số); sát biên hợp lệ", () => {
  for (const d of [0, -1, -2_000_000, TOTAL, TOTAL + 1, 1.5]) {
    for (const stage of ["deposit", "full", "remaining", "balance"]) {
      const r = resolve({ depositAmount: d, installmentStage: stage });
      assert.ok(r && "error" in r, `cọc ${d} / ${stage}`);
    }
  }
  assert.ok(!("error" in resolve({ depositAmount: 1, installmentStage: "deposit" })));
  assert.ok(!("error" in resolve({ depositAmount: TOTAL - 1, installmentStage: "remaining" })));
});

test("installmentStage lạ hoặc thiếu -> TẮT (null), không lỗi", () => {
  for (const bad of ["Deposit", "", 1, null, true, "refund", "pay", "round2"]) assert.equal(resolve({ depositAmount: 2_000_000, installmentStage: bad }), null, String(bad));
  assert.equal(resolve({}), null);
  assert.equal(resolve({ depositAmount: 2_000_000 }), null);
});

test("báo giá không có nhóm MAX OFFICE (chỉ thu hộ) mà bật thanh toán theo đợt -> lỗi", () => {
  const r = quote.resolveInstallment({ depositAmount: 100000, installmentStage: "deposit" }, null);
  assert.ok(r && "error" in r);
  assert.ok("error" in quote.resolveInstallment({ installmentStage: "full" }, null));
  assert.equal(quote.resolveInstallment({}, null), null);
});

test("thời điểm thanh toán phần còn lại: thiếu/sai kiểu = mặc định, rỗng = không ghi, cắt 120 ký tự; tên cũ vẫn đọc được", () => {
  const timing = (extra) => resolve({ depositAmount: 1_000_000, installmentStage: "deposit", ...extra }).timing;
  assert.equal(timing({}), "khi nhận kết quả hồ sơ");
  assert.equal(timing({ balanceTiming: 5 }), "khi nhận kết quả hồ sơ");
  assert.equal(timing({ balanceTiming: "   " }), "");
  assert.equal(timing({ balanceTiming: "  khi bàn giao GPKD " }), "khi bàn giao GPKD");
  assert.equal(timing({ balanceTiming: "x".repeat(500) }).length, dict.BALANCE_TIMING_MAX);
  assert.equal(dict.BALANCE_TIMING_MAX, 120);
  assert.equal(timing({ fullPaymentTiming: "khi ký hợp đồng" }), "khi ký hợp đồng"); // client cũ
  assert.equal(timing({ balanceCondition: "cũ hơn" }), "cũ hơn");
  assert.equal(timing({ balanceCondition: "cũ", fullPaymentTiming: "mới", balanceTiming: "mới nhất" }), "mới nhất");
});

test("trường cũ liên quan hoàn cọc bị bỏ qua, không lỗi", () => {
  const r = resolve({ depositAmount: 2_000_000, installmentStage: "full", refundCondition: "Tiền đặt cọc sẽ được hoàn lại", refund: true });
  assert.ok(r && !("error" in r));
  assert.ok(!JSON.stringify(r).toLowerCase().includes("hoàn"));
  assert.ok(!("refundCondition" in r));
});

test("số tiền khác client gửi kèm bị bỏ qua", () => {
  const r = resolve({ depositAmount: 2_000_000, installmentStage: "deposit", qrAmount: 1, total: 1, grand: 1, balance: 1, amountDue: 1 });
  assert.equal(r.qrAmount, 2_000_000);
  assert.equal(r.grand, TOTAL);
  assert.equal(r.balance, 2_486_800);
});

test("DEPOSIT_LABEL đổi một chỗ là đổi cả khung câu (vi/en); không còn nhãn hoàn cọc/Balance due cũ", () => {
  assert.equal(dict.DEPOSIT_LABEL.vi, "Đặt cọc");
  const vi = dict.paymentScheduleText("vi");
  const en = dict.paymentScheduleText("en");
  assert.equal(vi.depositStage1, "Đặt cọc (đợt 1)");
  assert.equal(vi.balanceTiming("khi bàn giao"), "Còn lại (khi bàn giao)");
  assert.equal(vi.balance, "Còn lại");
  assert.equal(vi.payment2, "Thanh toán đợt 2");
  assert.equal(vi.depositPaid, "Đã đặt cọc");
  assert.equal(vi.amountDue, "Còn phải thanh toán");
  assert.equal(en.depositStage1, "Deposit (installment 1)");
  assert.equal(en.balanceTiming("upon X"), "Remaining balance (upon X)");
  assert.equal(en.payment2, "Payment, installment 2");
  assert.equal(en.depositPaid, "Deposit paid");
  assert.equal(en.amountDue, "Balance due");
  assert.equal(dict.defaultAwareText("khi nhận kết quả hồ sơ", dict.DEFAULT_BALANCE_TIMING, "en"), "upon receipt of the application results");
  assert.equal(dict.defaultAwareText("khi bàn giao", dict.DEFAULT_BALANCE_TIMING, "en"), "khi bàn giao");
  for (const lang of ["vi", "en"]) {
    for (const [k, v] of Object.entries(dict.paymentScheduleText(lang))) {
      const text = typeof v === "function" ? v("x", "y") : v;
      assert.ok(!/hoàn|refund/i.test(text), `${lang}.${k}: ${text}`);
    }
  }
  assert.equal(dict.REFUND_CONDITION_MAX, undefined);
  assert.equal(dict.DEFAULT_REFUND_CONDITION, undefined);
});

test("tên file: -COC (đợt 1), -DOT2 (đợt 2 100%), -CON-LAI (đợt 2 phần còn lại); tắt giữ nguyên", () => {
  const d = new Date(2026, 9, 5);
  const c = { companyName: "Công ty TNHH ABC" };
  const base = quote.buildCompositeQuoteFilename(c, d);
  for (const [stage, suffix] of [["deposit", "-COC"], ["full", "-DOT2"], ["remaining", "-CON-LAI"]]) {
    assert.equal(quote.buildCompositeQuoteFilename(c, d, undefined, stage), base.replace(".png", `${suffix}.png`));
  }
  assert.ok(!base.includes("-COC") && !base.includes("-DOT2") && !base.includes("-CON-LAI"));
});

test("nội dung chuyển khoản: đợt 1 ' dat coc', đợt 2 'còn lại' ' thanh toan con lai' (rút gọn tên để hậu tố còn trong 40 ký tự); đợt 2 '100%' không hậu tố", () => {
  const vq = require(SRC + "lib/vietQr.ts");
  const sfx = quote.INSTALLMENT_QR_SUFFIX;
  assert.deepEqual(Object.keys(sfx), ["deposit", "remaining"]);
  assert.equal(sfx.deposit, " dat coc");
  assert.equal(sfx.remaining, " thanh toan con lai");
  assert.equal(vq.buildInstallmentQrNote({ companyName: "ABC" }, sfx.deposit), "ABC thanh toan phi dich vu dat coc");
  for (const company of ["Công ty TNHH Giải Pháp Doanh Nghiệp Max", "Công ty Cổ phần Đầu tư Phát triển Công nghệ Việt"]) {
    for (const suffix of Object.values(sfx)) {
      const note = vq.buildInstallmentQrNote({ companyName: company }, suffix);
      assert.ok(note.endsWith(suffix), note);
      assert.ok(note.length <= vq.VIETQR_NOTE_MAX_CHARS, `${note} (${note.length})`);
    }
  }
});

/* ---------------- Có nhóm thu hộ: Tc, Tt, G, D ---------------- */
const TC = 5_889_720; // nhóm MAX OFFICE (LITE có bảng hiệu + Thành lập DN Gói 1)
const TT = 1_045_000; // nhóm thu hộ
const G = TC + TT; // 6.934.720
const D = 2_000_000;
const plan = (stage, o = {}) => resolve({ depositAmount: D, installmentStage: stage, ...o }, TC, TT);

test("số tay: Tc 5.889.720, Tt 1.045.000, G 6.934.720, D 2.000.000", () => {
  const p1 = plan("deposit");
  assert.deepEqual(
    { grand: p1.grand, balance: p1.balance, companyBalance: p1.companyBalance, qr: p1.qrAmount },
    { grand: 6_934_720, balance: 4_934_720, companyBalance: 3_889_720, qr: D }
  ); // đợt 1: chỉ QR công ty = D; còn lại 4.934.720 = 3.889.720 + 1.045.000
  assert.equal(p1.companyBalance + p1.thuHo, p1.balance);
  const full = plan("full");
  assert.equal(full.qrAmount, 5_889_720); // QR công ty = Tc
  assert.equal(full.qrAmount + full.thuHo, 6_934_720); // tổng 2 QR = G
  const rem = plan("remaining");
  assert.equal(rem.qrAmount, 3_889_720); // QR công ty = Tc - D
  assert.equal(rem.qrAmount + rem.thuHo, 4_934_720); // tổng 2 QR = G - D
});

test("tự động: 'full' tổng QR = G; 'remaining' tổng QR = G - D; đợt 1 QR = D; ràng buộc 0 < D < Tc", () => {
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
    const full = quote.resolveInstallment({ depositAmount: d, installmentStage: "full" }, tc, tt);
    const rem = quote.resolveInstallment({ depositAmount: d, installmentStage: "remaining" }, tc, tt);
    assert.equal(p1.qrAmount, d);
    assert.equal(p1.balance, tc + tt - d);
    assert.equal(full.qrAmount + full.thuHo, tc + tt, `full tc=${tc} tt=${tt} d=${d}`);
    assert.equal(rem.qrAmount + rem.thuHo, tc + tt - d, `remaining tc=${tc} tt=${tt} d=${d}`);
  }
  assert.ok("error" in quote.resolveInstallment({ depositAmount: TC, installmentStage: "deposit" }, TC, TT)); // phải < Tc, không phải < G
  assert.ok("error" in quote.resolveInstallment({ depositAmount: TC + 1, installmentStage: "remaining" }, TC, TT));
  assert.ok(!("error" in quote.resolveInstallment({ depositAmount: TC - 1, installmentStage: "deposit" }, TC, TT)));
});

test("hàng Lịch thanh toán đợt 1: Đặt cọc (đợt 1): D / Còn lại (<thời điểm>): G - D (+ chú thích tách (Tc - D) và Tt)", () => {
  const rows = quote.installmentScheduleRows(plan("deposit"), "vi");
  assert.deepEqual(rows.map((r) => [r.label, r.amount, r.emphasis]), [
    ["Đặt cọc (đợt 1)", D, true],
    ["Còn lại (khi nhận kết quả hồ sơ)", 4_934_720, false],
  ]);
  assert.equal(rows[0].note, undefined);
  assert.equal(rows[1].note, "gồm tài khoản công ty (3.889.720đ) và tài khoản thu hộ (1.045.000đ)");
  // thời điểm rỗng -> chỉ "Còn lại"
  assert.equal(quote.installmentScheduleRows(plan("deposit", { balanceTiming: "" }), "vi")[1].label, "Còn lại");
});

test("hàng Lịch thanh toán đợt 2 '100%': chỉ 'Thanh toán đợt 2: G' (+ chú thích tách Tc/Tt), không nhắc cọc", () => {
  const rows = quote.installmentScheduleRows(plan("full"), "vi");
  assert.deepEqual(rows.map((r) => [r.label, r.amount, r.emphasis]), [["Thanh toán đợt 2", G, true]]);
  assert.equal(rows[0].note, "gồm tài khoản công ty (5.889.720đ) và tài khoản thu hộ (1.045.000đ)");
  const text = JSON.stringify(rows).toLowerCase();
  assert.ok(!text.includes("cọc"), text);
  // không có thu hộ: không chú thích, và không cần số cọc
  const noThuHo = quote.installmentScheduleRows(resolve({ installmentStage: "full" }), "vi");
  assert.deepEqual(noThuHo.map((r) => [r.label, r.amount, r.note]), [["Thanh toán đợt 2", TOTAL, undefined]]);
});

test("hàng Lịch thanh toán đợt 2 'phần còn lại': Đã đặt cọc: D / Còn phải thanh toán: G - D (+ chú thích tách (Tc - D) và Tt)", () => {
  const rows = quote.installmentScheduleRows(plan("remaining"), "vi");
  assert.deepEqual(rows.map((r) => [r.label, r.amount, r.emphasis]), [
    ["Đã đặt cọc", D, false],
    ["Còn phải thanh toán", 4_934_720, true],
  ]);
  assert.equal(rows[1].note, "gồm tài khoản công ty (3.889.720đ) và tài khoản thu hộ (1.045.000đ)");
  // không thu hộ
  const noThuHo = quote.installmentScheduleRows(resolve({ depositAmount: D, installmentStage: "remaining" }), "vi");
  assert.deepEqual(noThuHo.map((r) => [r.label, r.amount, r.note]), [["Đã đặt cọc", D, undefined], ["Còn phải thanh toán", 2_486_800, undefined]]);
});

test("không hàng nào (ảnh lẫn form, vi lẫn en, mọi chế độ) có chữ về hoàn tiền", () => {
  for (const stage of ["deposit", "full", "remaining"]) {
    for (const p of [plan(stage), resolve({ depositAmount: D, installmentStage: stage })]) {
      for (const lang of ["vi", "en"]) {
        for (const r of quote.installmentScheduleRows(p, lang)) assert.ok(!/hoàn|refund/i.test(`${r.label} ${r.note ?? ""}`), `${stage} ${lang}: ${r.label} ${r.note}`);
      }
      for (const r of quote.installmentSummaryRows(p)) assert.ok(!/hoàn|refund/i.test(r.label), r.label);
    }
  }
});

test("tiếng Anh: câu của khối Lịch thanh toán", () => {
  const dep = quote.installmentScheduleRows(plan("deposit"), "en");
  assert.deepEqual(dep.map((r) => r.label), ["Deposit (installment 1)", "Remaining balance (upon receipt of the application results)"]);
  assert.equal(dep[1].note, "incl. company account (3,889,720 VND) and collection account (1,045,000 VND)");
  assert.deepEqual(quote.installmentScheduleRows(plan("full"), "en").map((r) => r.label), ["Payment, installment 2"]);
  assert.deepEqual(quote.installmentScheduleRows(plan("remaining"), "en").map((r) => r.label), ["Deposit paid", "Balance due"]);
  assert.equal(quote.installmentScheduleRows(plan("deposit", { balanceTiming: "khi bàn giao" }), "en")[1].label, "Remaining balance (khi bàn giao)");
});

test("tóm tắt form: Tổng toàn bộ (G) / Đặt cọc (D) / Còn lại (G - D); đợt 2 thêm số thanh toán theo lựa chọn", () => {
  assert.deepEqual(quote.installmentSummaryRows(plan("deposit")).map((r) => [r.label, r.amount]), [
    ["Tổng toàn bộ (đã gồm VAT)", G],
    ["Đặt cọc", D],
    ["Còn lại", 4_934_720],
  ]);
  assert.deepEqual(quote.installmentSummaryRows(plan("full")).map((r) => [r.label, r.amount]).slice(-1), [["Thanh toán đợt 2 (100% tổng báo giá)", G]]);
  assert.deepEqual(quote.installmentSummaryRows(plan("remaining")).map((r) => [r.label, r.amount]).slice(-1), [["Thanh toán đợt 2 (phần còn lại sau cọc)", 4_934_720]]);
  // đợt 2 '100%' chưa nhập cọc: chỉ Tổng + dòng thanh toán
  assert.deepEqual(quote.installmentSummaryRows(resolve({ installmentStage: "full" })).map((r) => r.amount), [TOTAL, TOTAL]);
});

test("mã nguồn không còn chữ hoàn lại/hoàn cọc/refund cho tính năng này (form, route ảnh, dictionary, FAQ, thư viện)", () => {
  const files = [
    "components/tools/CompositeQuoteTool.tsx",
    "app/api/quote-image/tong-hop/route.tsx",
    "lib/quoteImageDictionary.ts",
    "lib/compositeQuote.ts",
    "lib/vietQr.ts",
    "app/tien-ich/tao-bao-gia-tong-hop/page.tsx",
  ];
  for (const f of files) {
    const text = fs.readFileSync(path.join(SRC, f), "utf8");
    assert.ok(!/hoàn lại|hoàn cọc|refund/i.test(text), `${f} còn chữ hoàn lại/hoàn cọc/refund`);
  }
});
