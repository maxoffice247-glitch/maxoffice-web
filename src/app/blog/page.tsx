import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import BlogCard from "@/components/BlogCard";
import BlogSidebar from "@/components/BlogSidebar";
import Pagination from "@/components/Pagination";
import { SearchIcon } from "@/components/icons";
import { BLOG_POSTS, BLOG_CATEGORIES, BLOG_PAGE_SIZE } from "@/lib/blogData";

export const metadata: Metadata = {
  title: "Blog MAX OFFICE — Kiến Thức Vận Hành Doanh Nghiệp",
  description:
    "Cập nhật kiến thức về thành lập doanh nghiệp, kế toán thuế, pháp lý và vận hành văn phòng từ đội ngũ MAX OFFICE.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const { category, q, page } = await searchParams;

  let posts = BLOG_POSTS;
  if (category) posts = posts.filter((p) => p.categorySlug === category);
  if (q) {
    const query = q.toLowerCase();
    posts = posts.filter(
      (p) => p.title.toLowerCase().includes(query) || p.excerpt.toLowerCase().includes(query)
    );
  }

  const totalPages = Math.max(1, Math.ceil(posts.length / BLOG_PAGE_SIZE));
  const currentPage = Math.min(totalPages, Math.max(1, Number(page) || 1));
  const pagePosts = posts.slice((currentPage - 1) * BLOG_PAGE_SIZE, currentPage * BLOG_PAGE_SIZE);

  return (
    <main>
      <PageHero
        image="/images/coworking.jpg"
        eyebrow="Blog MAX OFFICE"
        title="Kiến thức & câu chuyện vận hành doanh nghiệp"
        description="Bài viết về thành lập doanh nghiệp, kế toán thuế, pháp lý và kinh nghiệm vận hành văn phòng — cập nhật liên tục từ đội ngũ MAX OFFICE."
      />
      <Breadcrumb items={[{ label: "Blog" }]} />

      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <form
            action="/blog"
            method="GET"
            className="mb-6 flex max-w-[440px] items-center gap-2 rounded-full border border-line bg-white py-1 pr-1 pl-4 transition-colors duration-200 focus-within:border-primary"
          >
            <SearchIcon className="h-4 w-4 shrink-0 text-body-text" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Tìm kiếm bài viết..."
              className="w-full bg-transparent py-2 text-[14px] text-ink outline-none placeholder:text-body-text/60"
            />
            {category && <input type="hidden" name="category" value={category} />}
            <button
              type="submit"
              className="shrink-0 rounded-full bg-accent px-4 py-2 text-[13px] font-bold text-white transition-colors duration-200 hover:bg-accent-dark"
            >
              Tìm
            </button>
          </form>

          <div className="mb-9 flex flex-wrap gap-2.5">
            <Link
              href="/blog"
              className={`rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors duration-200 ${
                !category
                  ? "border-accent bg-accent text-white"
                  : "border-line text-body-text hover:border-primary hover:text-primary"
              }`}
            >
              Tất cả
            </Link>
            {BLOG_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/blog?category=${c.slug}`}
                className={`rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors duration-200 ${
                  category === c.slug
                    ? "border-accent bg-accent text-white"
                    : "border-line text-body-text hover:border-primary hover:text-primary"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              {pagePosts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center">
                  <p className="text-[15px] font-bold text-navy">Chưa có bài viết phù hợp</p>
                  <p className="mx-auto mt-2 max-w-[420px] text-[13.5px] text-body-text">
                    Nội dung đang được đội ngũ MAX OFFICE biên soạn và sẽ sớm được
                    đăng tải. Quay lại sau nhé!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {pagePosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
              <Pagination
                basePath="/blog"
                currentPage={currentPage}
                totalPages={totalPages}
                category={category}
                q={q}
              />
            </div>
            <BlogSidebar activeCategory={category} />
          </div>
        </div>
      </section>
    </main>
  );
}
