import Reveal from "./Reveal";
import StatNumber from "./StatNumber";
import { BuildingIcon, UsersIcon, CalendarIcon, TagIcon, StarIcon } from "./icons";
import { GOOGLE_MAPS_REVIEW_URL } from "@/lib/siteConfig";

// Static, not auto-fetched — see GoogleReviews component history: the Places API
// key on this project is blocked from Places API (New) (API_KEY_SERVICE_BLOCKED,
// an API-restriction setting in Google Cloud Console). Set to null to hide this
// tile entirely (falls back to the original 4-tile layout) if the numbers below
// go stale and there's no verified current rating to show.
const GOOGLE_RATING: { rating: number; reviewCount: number } | null = { rating: 5.0, reviewCount: 5 };

const STATS = [
  { icon: BuildingIcon, value: "12", label: "Chi nhánh tại TP.HCM" },
  { icon: UsersIcon, value: "500", suffix: "+", label: "Doanh nghiệp tin dùng" },
  { icon: CalendarIcon, value: "2022", label: "Năm thành lập" },
  { icon: TagIcon, value: "6", label: "Dịch vụ cốt lõi" },
];

// Border classes per tile. With the Google tile present, the grid runs
// 2-col (mobile: rows [0,1] [2,3] [google, full-width]) -> 3-col (tablet,
// md: rows [0,1,2] [3, google spanning 2 cols]) -> 5-col (desktop, lg: a
// single row) — each tile's right/bottom divider depends on which row and
// column it lands in at that breakpoint.
const BORDERS_WITH_GOOGLE = [
  "border-r border-b border-line lg:border-b-0",
  "border-b border-line md:border-r lg:border-b-0",
  "border-r border-b border-line md:border-r-0 lg:border-r lg:border-b-0",
  "border-b border-line md:border-r md:border-b-0",
];
const BORDERS_WITHOUT_GOOGLE = [
  "border-r border-b border-line sm:border-b-0 sm:border-r sm:border-line",
  "border-b border-line sm:border-b-0 sm:border-r sm:border-line",
  "border-r border-line sm:border-r sm:border-line",
  "",
];

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

function GoogleStarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-[#FBBC04]" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative inline-block h-3.5 w-3.5">
            <StarIcon className="absolute inset-0 h-3.5 w-3.5 text-line" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <StarIcon className="h-3.5 w-3.5" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function StatsFloat() {
  const hasGoogleRating = GOOGLE_RATING !== null;
  const borders = hasGoogleRating ? BORDERS_WITH_GOOGLE : BORDERS_WITHOUT_GOOGLE;

  return (
    <div className="relative z-20 mx-auto -mt-20 max-w-[1240px] px-5 sm:-mt-24 sm:px-8 lg:-mt-28">
      <Reveal
        className={`grid grid-cols-2 rounded-2xl bg-white shadow-float ${hasGoogleRating ? "md:grid-cols-3 lg:grid-cols-5" : "sm:grid-cols-4"}`}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`group flex items-center gap-3 px-4 py-6 text-left transition-colors duration-300 hover:bg-bg-tint sm:gap-4 sm:px-7 sm:py-8 ${borders[i]}`}
          >
            <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white sm:flex">
              <stat.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="mb-1 flex items-baseline gap-0.5 font-mono text-[24px] font-bold text-primary sm:text-[28px] lg:text-[34px]">
                <StatNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[12.5px] font-medium text-body-text sm:text-[13.5px]">{stat.label}</div>
            </div>
          </div>
        ))}
        {hasGoogleRating && (
          <a
            href={GOOGLE_MAPS_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group col-span-2 flex items-center justify-center gap-3 px-4 py-6 text-left transition-colors duration-300 hover:bg-bg-tint sm:gap-4 sm:px-7 sm:py-8 lg:col-span-1 lg:justify-start"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-tint sm:h-11 sm:w-11">
              <GoogleGIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <div className="min-w-0">
              <div className="mb-1">
                <GoogleStarRow rating={GOOGLE_RATING.rating} />
              </div>
              <div className="text-[12.5px] leading-snug font-medium text-body-text sm:text-[13.5px]">
                {GOOGLE_RATING.rating.toFixed(1)}/5 — Google Reviews
              </div>
            </div>
          </a>
        )}
      </Reveal>
    </div>
  );
}
