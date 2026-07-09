import { NextResponse } from "next/server";
import { getGoogleRating } from "@/lib/googleReviews";

export const dynamic = "force-static";
// Next's route segment config must be a static literal (can't reference an
// imported constant) — kept in sync with GOOGLE_REVIEWS_REVALIDATE_SECONDS
// in lib/googleReviews.ts, which drives the actual upstream fetch caching.
export const revalidate = 2592000; // 30 days

export async function GET() {
  const result = await getGoogleRating();
  return NextResponse.json(result);
}
