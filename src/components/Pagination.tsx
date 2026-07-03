import Link from "next/link";
import { ChevronRightIcon } from "./icons";

function buildHref(
  basePath: string,
  params: { category?: string; q?: string },
  page: number
) {
  const sp = new URLSearchParams();
  if (params.category) sp.set("category", params.category);
  if (params.q) sp.set("q", params.q);
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default function Pagination({
  basePath,
  currentPage,
  totalPages,
  category,
  q,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  category?: string;
  q?: string;
}) {
  if (totalPages <= 1) return null;

  const params = { category, q };
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Phân trang" className="mt-10 flex items-center justify-center gap-2">
      <Link
        href={buildHref(basePath, params, Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors duration-200 ${
          currentPage === 1
            ? "pointer-events-none opacity-40"
            : "hover:border-primary hover:text-primary"
        }`}
      >
        <ChevronRightIcon className="rotate-180" />
      </Link>
      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(basePath, params, p)}
          className={`flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-bold transition-colors duration-200 ${
            p === currentPage
              ? "bg-accent text-white"
              : "border border-line text-navy hover:border-primary hover:text-primary"
          }`}
        >
          {p}
        </Link>
      ))}
      <Link
        href={buildHref(basePath, params, Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors duration-200 ${
          currentPage === totalPages
            ? "pointer-events-none opacity-40"
            : "hover:border-primary hover:text-primary"
        }`}
      >
        <ChevronRightIcon />
      </Link>
    </nav>
  );
}
