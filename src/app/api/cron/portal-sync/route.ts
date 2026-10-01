import { NextResponse } from "next/server";
import { getRedis } from "@/lib/portal/redisClient";
import { fetchAllContractRecords } from "@/lib/portal/sheetsSource";
import { writeContractRecordsCache } from "@/lib/portal/recordsCache";
import { listPaidOrders, deleteOrder } from "@/lib/portal/order";
import { findMatchingOrders } from "@/lib/portal/orderMatching";

/** Cron làm mới cache 3 sheet nguồn vào Redis — đăng ký qua vercel.json.

    PHÁT HIỆN THẬT (không phải giả thuyết): vercel.json CHƯA TỪNG tồn tại
    trong repo trước đây (kiểm tra `git log --all -- vercel.json` ra rỗng)
    — nghĩa là cron này CHƯA BAO GIỜ tự chạy trên Vercel kể từ khi viết, dù
    comment cũ ở đây ghi "thêm khi deploy thật" (việc đó bị bỏ sót). Hệ quả
    thực tế: 2 công ty mới thêm vào Sheets không tra cứu được vì cache
    Redis chỉ được làm mới MỖI KHI có người gọi tay endpoint này — gọi tay
    xác nhận đọc Sheets/Redis hoàn toàn đúng, không phải lỗi dữ liệu.

    Lịch hiện tại trong vercel.json: "0 19 * * *" (19:00 UTC = 02:00 giờ VN
    hôm sau) — CHẠY 1 LẦN/NGÀY, theo đúng giới hạn gói Vercel Hobby (đã xác
    nhận với người dùng) — KHÔNG đạt tần suất 10-15 phút/lần như thiết kế
    gốc. Khách tra cứu 1 hợp đồng vừa thêm vào Sheets có thể phải đợi tới
    24h mới thấy — đã xác nhận với người dùng, chấp nhận đánh đổi này thay
    vì nâng cấp Pro hoặc dùng cron ngoài (cron-job.org/Upstash QStash). Nếu
    sau này cần tần suất cao hơn, tăng bằng cách nâng vercel.json lên gói
    Pro hoặc gọi route này từ 1 dịch vụ cron bên ngoài — không cần sửa code
    ở đây.

    Bảo vệ bằng CRON_SECRET (Vercel tự gửi header "Authorization: Bearer
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
