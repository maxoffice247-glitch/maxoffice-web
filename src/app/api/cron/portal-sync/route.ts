import { NextResponse } from "next/server";
import { getRedis } from "@/lib/portal/redisClient";
import { fetchAllContractRecords } from "@/lib/portal/sheetsSource";
import { writeContractRecordsCache } from "@/lib/portal/recordsCache";
import { listPaidOrders, deleteOrder } from "@/lib/portal/order";
import { findMatchingOrders } from "@/lib/portal/orderMatching";

/** Cron làm mới cache 3 sheet nguồn vào Redis — cấu hình chạy 10-15
    phút/lần qua Vercel Cron (vercel.json, thêm khi deploy thật). Bảo vệ
    bằng CRON_SECRET (Vercel tự gửi header "Authorization: Bearer
    {CRON_SECRET}" cho cron job của chính nó) — chặn người ngoài gọi tuỳ ý
    làm hao quota Sheets API.

    GỘP LUÔN bước khớp đơn hàng mới (Phase 2, Luồng B) vào CÙNG lượt chạy
    này thay vì tạo cron riêng — đã có sẵn `records` mới nhất trong bộ nhớ
    ngay sau khi đọc Sheets, không cần đọc lại lần 2 chỉ để khớp MST. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const redis = getRedis();
    const records = await fetchAllContractRecords();
    await writeContractRecordsCache(redis, records);

    const paidOrders = await listPaidOrders(redis);
    const matches = findMatchingOrders(records, paidOrders);
    for (const { order } of matches) {
      await deleteOrder(redis, order.orderCode);
    }

    return NextResponse.json({
      ok: true,
      count: records.length,
      paidOrdersPending: paidOrders.length,
      matched: matches.map((m) => ({ orderCode: m.order.orderCode, mst: m.order.mst, companyName: m.record.companyName })),
    });
  } catch (err) {
    console.error("[portal-sync] failed:", err);
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}
