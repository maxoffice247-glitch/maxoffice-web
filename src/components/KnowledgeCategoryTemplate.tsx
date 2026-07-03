import Link from "next/link";
import PageHero from "./PageHero";
import Breadcrumb from "./Breadcrumb";
import SectionHead from "./SectionHead";
import BlogCard from "./BlogCard";
import Button from "./Button";
import NewsletterForm from "./NewsletterForm";
import { RevealGroup, RevealItem } from "./Reveal";
import { KNOWLEDGE_CATEGORIES, type KnowledgeCategory } from "@/lib/knowledgeCenterData";
import { BLOG_POSTS } from "@/lib/blogData";

export default function KnowledgeCategoryTemplate({ category }: { category: KnowledgeCategory }) {
  const posts = BLOG_POSTS.filter((p) => p.categorySlug === category.slug);
  const otherCategories = KNOWLEDGE_CATEGORIES.filter((c) => c.slug !== category.slug);

  return (
    <main>
      <PageHero
        image="/images/khong-gian-lam-viec.png"
        eyebrow="Kiến thức"
        title={category.name}
        description={category.description}
      />
      <Breadcrumb
        items={[{ label: "Kiến thức", href: "/knowledge-center" }, { label: category.name }]}
      />

      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHead
            align="left"
            eyebrow={category.name}
            title="Bài viết trong chuyên mục"
            description={`Nội dung về ${category.name.toLowerCase()} đang được đội ngũ MAX OFFICE biên soạn và sẽ lần lượt được đăng tải tại đây.`}
          />

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center">
              <p className="text-[15px] font-bold text-navy">Chuyên mục này chưa có bài viết</p>
              <p className="mx-auto mt-2 max-w-[440px] text-[13.5px] text-body-text">
                Bài viết đầu tiên sẽ sớm được đăng tải. Trong lúc chờ đợi, bạn có thể
                liên hệ trực tiếp để được tư vấn.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button href="/blog" variant="ghost">
                  Xem tất cả bài viết
                </Button>
                <Button href="tel:0898082188" variant="primary">
                  Gọi ngay tư vấn
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-bg-tint py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHead align="left" eyebrow="Khám phá thêm" title="Chuyên mục khác" />
          <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {otherCategories.map((c) => (
              <RevealItem key={c.slug}>
                <Link
                  href={`/knowledge-center/${c.slug}`}
                  className="group flex h-full flex-col items-start rounded-2xl border border-line bg-white p-5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card"
                >
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-tint text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <span className="text-[13.5px] font-bold text-navy">{c.name}</span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="py-9">
        <div className="mx-auto max-w-[640px] px-5 sm:px-8">
          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
