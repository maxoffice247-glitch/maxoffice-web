import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, ClockIcon, UserIcon, ArrowRightSmallIcon } from "./icons";
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
      <div className="relative aspect-[16/10] overflow-hidden bg-bg-tint">
        <Image
          src={post.thumbnailImage ?? post.heroImage}
          alt={post.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-transform duration-400 ease-out group-hover:scale-105 ${
            post.thumbnailPosition === "right"
              ? "object-right"
              : post.thumbnailPosition === "left"
                ? "object-left"
                : "object-center"
          }`}
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold tracking-wide text-primary uppercase shadow-soft">
          {getCategoryName(post.categorySlug)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-[16px] leading-snug font-bold text-navy transition-colors duration-200 group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mb-4 flex-1 text-[13.5px] leading-relaxed text-body-text">{post.excerpt}</p>
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-body-text">
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
