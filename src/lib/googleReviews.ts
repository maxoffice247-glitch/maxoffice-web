import { GOOGLE_MAPS_REVIEW_URL } from "./siteConfig";

export const GOOGLE_REVIEWS_REVALIDATE_SECONDS = 2592000; // 30 days

export type GoogleRatingResult =
  | { ok: true; rating: number; reviewCount: number; mapsUrl: string }
  | { ok: false; mapsUrl: string };

async function resolvePlaceId(apiKey: string): Promise<string> {
  const configured = process.env.GOOGLE_PLACES_PLACE_ID?.trim();
  if (configured) return configured;

  const address = process.env.GOOGLE_PLACES_ADDRESS?.trim();
  if (!address) throw new Error("Missing GOOGLE_PLACES_PLACE_ID and GOOGLE_PLACES_ADDRESS");

  const url = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json");
  url.searchParams.set("input", address);
  url.searchParams.set("inputtype", "textquery");
  url.searchParams.set("fields", "place_id,name");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url, { next: { revalidate: GOOGLE_REVIEWS_REVALIDATE_SECONDS } });
  const data = await res.json();
  if (data.status !== "OK" || !data.candidates?.[0]?.place_id) {
    throw new Error(`Find Place failed: ${data.status} ${data.error_message ?? ""}`);
  }
  return data.candidates[0].place_id as string;
}

async function fetchPlaceDetails(
  apiKey: string,
  placeId: string
): Promise<{ rating: number; reviewCount: number }> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "rating,user_ratings_total");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url, { next: { revalidate: GOOGLE_REVIEWS_REVALIDATE_SECONDS } });
  const data = await res.json();
  if (data.status !== "OK" || typeof data.result?.rating !== "number") {
    throw new Error(`Place Details failed: ${data.status} ${data.error_message ?? ""}`);
  }
  return { rating: data.result.rating, reviewCount: data.result.user_ratings_total ?? 0 };
}

/** Cached (30 days via Next's fetch cache) Google Business rating lookup — never throws, falls back to ok:false. */
export async function getGoogleRating(): Promise<GoogleRatingResult> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return { ok: false, mapsUrl: GOOGLE_MAPS_REVIEW_URL };

  try {
    const placeId = await resolvePlaceId(apiKey);
    const { rating, reviewCount } = await fetchPlaceDetails(apiKey, placeId);
    return { ok: true, rating, reviewCount, mapsUrl: GOOGLE_MAPS_REVIEW_URL };
  } catch (err) {
    console.error("[google-reviews] Failed to fetch Google rating:", err);
    return { ok: false, mapsUrl: GOOGLE_MAPS_REVIEW_URL };
  }
}
