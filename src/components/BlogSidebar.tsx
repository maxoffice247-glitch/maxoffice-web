import Link from "next/link";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blogData";
import NewsletterForm from "./NewsletterForm";
import { ArrowRightSmallIcon } from "./icons";

export default function BlogSidebar({ activeCategory }: { activeCategory?: string }) {
  const popular = BLOG_POSTS.slice(0, 4);

  return (
    <aside className="flex flex-col gap-6">
      <div className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-[15px] font-bold text-navy">Bài viết phổ biến</h3>
        {popular.length === 0 ? (
          <p className="text-[13.5px] text-body-text">Chưa có bài viết nào.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {popular.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex items-start gap-1.5 text-[13.5px] leading-snug font-semibold text-ink transition-colors duration-200 hover:text-primary"
                >
                  <ArrowRightSmallIcon className="mt-1 shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-1" />
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-[15px] font-bold text-navy">Chuyên mục</h3>
        <ul className="flex flex-col gap-2.5">
          {BLOG_CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/blog?category=${c.slug}`}
                className={`text-[13.5px] transition-colors duration-200 hover:text-primary ${
                  activeCategory === c.slug ? "font-bold text-primary" : "text-body-text"
                }`}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <NewsletterForm compact />
    </aside>
  );
}
