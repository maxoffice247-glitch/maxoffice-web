import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHead from "@/components/SectionHead";
import CtaBanner from "@/components/CtaBanner";
import NewsletterForm from "@/components/NewsletterForm";
import Button from "@/components/Button";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { SearchIcon, ArrowRightSmallIcon } from "@/components/icons";
import { KNOWLEDGE_CATEGORIES, FEATURED_ARTICLE_SLUGS, getKnowledgeCategory } from "@/lib/knowledgeCenterData";
import { getBlogPost } from "@/lib/blogData";

export const metadata: Metadata = {
  title: "Kiến Thức Doanh Nghiệp — Cẩm Nang MAX OFFICE",
  description:
    "Kiến thức pháp lý, thuế, văn phòng và vận hành doanh nghiệp theo từng chủ đề — cập nhật bởi đội ngũ MAX OFFICE.",
  openGraph: {
    images: [{ url: "/images/og/khong-gian-lam-viec.jpg", width: 1200, height: 630 }],
  },
};

export default function KnowledgeCenterPage() {
  const featuredArticles = FEATURED_ARTICLE_SLUGS.map((slug) => {
    const post = getBlogPost(slug);
    if (!post) return null;
    const cat = getKnowledgeCategory(post.categorySlug);
    return { post, cat };
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <main>
      <PageHero
        image="/images/khong-gian-lam-viec.jpg"
        eyebrow="Kiến thức"
        title="Cẩm nang kiến thức cho doanh nghiệp"
        description="Kiến thức pháp lý, thuế, văn phòng và vận hành doanh nghiệp được hệ thống theo từng chủ đề — giúp bạn tra cứu nhanh và chính xác."
      />
      <Breadcrumb items={[{ label: "Kiến thức" }]} />

      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <form
            action="/blog"
            method="GET"
            className="mx-auto mb-14 flex max-w-[520px] items-center gap-2 rounded-full border border-line bg-white py-1 pr-1 pl-4 shadow-soft transition-colors duration-200 focus-within:border-primary"
          >
            <SearchIcon className="h-4 w-4 shrink-0 text-body-text" />
            <input
              type="text"
              name="q"
              placeholder="Tìm kiếm kiến thức, chủ đề..."
              className="w-full bg-transparent py-2.5 text-[14px] text-ink outline-none placeholder:text-body-text/60"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-[13.5px] font-bold text-white transition-colors duration-200 hover:bg-accent-dark"
            >
              Tìm
            </button>
          </form>

          <SectionHead
            eyebrow="8 chuyên mục"
            title="Chọn chủ đề bạn quan tâm"
            description="Mỗi chuyên mục tổng hợp kiến thức thực tế, cập nhật liên tục theo quy định mới nhất."
          />
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {KNOWLEDGE_CATEGORIES.map((cat) => (
              <RevealItem key={cat.slug} className="h-full">
                <Link
                  href={`/knowledge-center/${cat.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-all duration-400 ease-out hover:-translate-y-2 hover:border-transparent hover:shadow-card"
                >
                  <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-tint text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <cat.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mb-2 text-[15.5px] font-bold text-navy">{cat.name}</h3>
                  <p className="mb-4 flex-1 text-[13px] leading-relaxed text-body-text">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-accent">
                    Xem bài viết
                    <ArrowRightSmallIcon className="transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-bg-tint py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Nổi bật"
            title="Bài viết nổi bật"
            description="Những bài viết được nhiều doanh nghiệp quan tâm và tra cứu nhiều nhất."
          />
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {featuredArticles.map(({ post, cat }) => (
              <RevealItem key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-all duration-400 ease-out hover:-translate-y-2 hover:border-transparent hover:shadow-card"
                >
                  {cat && (
                    <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-tint px-3 py-1 text-[11px] font-bold tracking-wide text-primary uppercase">
                      {cat.name}
                    </span>
                  )}
                  <h3 className="mb-2 text-[15.5px] leading-snug font-bold text-navy">
                    {post.title}
                  </h3>
                  <p className="text-[13.5px] leading-relaxed text-body-text">
                    {post.excerpt}
                  </p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
          <div className="mt-10 text-center">
            <Button href="/blog" variant="ghost">
              Xem tất cả bài viết
            </Button>
          </div>
        </div>
      </section>

      <section className="py-9">
        <div className="mx-auto max-w-[640px] px-5 sm:px-8">
          <NewsletterForm />
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
