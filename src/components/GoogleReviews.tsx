import Reveal from "./Reveal";
import { StarIcon } from "./icons";
import { getGoogleRating } from "@/lib/googleReviews";

function GoogleGIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.8-2.1 5.1-4.4 6.7v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.2z"
      />
      <path
        fill="#34A853"
        d="M24 46c6 0 11-2 14.6-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.7-3.9-12.4-9.1H4.3v5.7C7.9 41.1 15.4 46 24 46z"
      />
      <path fill="#FBBC04" d="M11.6 28.2c-.4-1.3-.7-2.7-.7-4.2s.3-2.9.7-4.2v-5.7H4.3C2.8 17 2 20.4 2 24s.8 7 2.3 9.9l7.3-5.7z" />
      <path
        fill="#EA4335"
        d="M24 10.7c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C35 4.1 30 2 24 2 15.4 2 7.9 6.9 4.3 14.1l7.3 5.7c1.7-5.2 6.6-9.1 12.4-9.1z"
      />
    </svg>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-[#FBBC04]" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative inline-block h-4 w-4">
            <StarIcon className="absolute inset-0 h-4 w-4 text-line" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <StarIcon className="h-4 w-4" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default async function GoogleReviews() {
  const result = await getGoogleRating();

  return (
    <Reveal className="mx-auto max-w-[1240px] px-5 sm:px-8">
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-line bg-white px-6 py-4 shadow-card sm:justify-between">
        <div className="flex items-center gap-3">
          <GoogleGIcon className="h-7 w-7 shrink-0" />
          {result.ok ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[19px] font-bold text-navy">
                  {result.rating.toFixed(1)}/5
                </span>
                <StarRow rating={result.rating} />
              </div>
              <p className="text-[12.5px] text-body-text">
                {result.reviewCount.toLocaleString("vi-VN")} đánh giá trên Google
              </p>
            </div>
          ) : (
            <p className="text-[13.5px] font-medium text-ink">Đánh giá của MAX OFFICE trên Google</p>
          )}
        </div>
        <a
          href={result.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-primary transition-colors duration-200 hover:border-primary/40 hover:bg-primary-tint"
        >
          Xem tất cả đánh giá
        </a>
      </div>
    </Reveal>
  );
}
