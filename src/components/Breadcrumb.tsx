import Link from "next/link";
import { HomeIcon, ChevronRightIcon } from "./icons";
import { SITE_URL } from "@/lib/siteConfig";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${SITE_URL}/` },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.label,
        ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
      })),
    ],
  };

  return (
    <nav aria-label="Breadcrumb" className="border-b border-line bg-bg-tint">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="mx-auto max-w-[1240px] px-5 py-3.5 sm:px-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-body-text">
          <li className="flex items-center gap-1.5">
            <Link
              href="/"
              className="flex items-center gap-1.5 font-medium transition-colors duration-200 hover:text-primary"
            >
              <HomeIcon />
              Trang chủ
            </Link>
          </li>
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-1.5">
                <ChevronRightIcon className="shrink-0 text-line" />
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="font-medium transition-colors duration-200 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-navy" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
