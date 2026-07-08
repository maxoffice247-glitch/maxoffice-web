import Link from "next/link";
import { CalendarIcon, ClockIcon, UserIcon, ImageIcon, ArrowRightSmallIcon } from "./icons";
import { getCategoryName, type BlogPost } from "@/lib/blogData";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-400 ease-out hover:-translate-y-2 hover:border-transparent hover:shadow-card"
    >
      <div className="relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-primary-tint to-bg-tint text-primary/40">
        <ImageIcon className="h-10 w-10" />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold tracking-wide text-primary uppercase shadow-soft">
          {getCategoryName(post.categorySlug)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-[16px] leading-snug font-bold text-navy transition-colors duration-200 group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mb-4 flex-1 text-[13.5px] leading-relaxed text-body-text">{post.excerpt}</p>
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-body-text/80">
          <span className="flex items-center gap-1.5">
            <UserIcon className="h-3.5 w-3.5" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5" />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <ClockIcon className="h-3.5 w-3.5" />
            {post.readingTime} phút đọc
          </span>
        </div>
        <span className="mt-auto inline-flex items-center gap-1.5 text-[13.5px] font-bold text-accent transition-all duration-200 group-hover:gap-2.5">
          Đọc thêm
          <ArrowRightSmallIcon />
        </span>
      </div>
    </Link>
  );
}
