import { NextResponse } from "next/server";
import { getRedis } from "@/lib/portal/redisClient";
import { getOrder } from "@/lib/portal/order";

/** Luồng B, bước 2 — frontend gọi LẶP LẠI (polling) để hỏi đơn đã thanh
    toán chưa, tương đương `kiemTraThanhToan` của GPKD. */
export async function GET(_request: Request, { params }: { params: Promise<{ orderCode: string }> }) {
  const { orderCode } = await params;
  const redis = getRedis();
  const order = await getOrder(redis, orderCode);
  if (!order) {
    return NextResponse.json({ status: "expired" });
  }
  return NextResponse.json({ status: order.status, orderCode: order.orderCode });
}
