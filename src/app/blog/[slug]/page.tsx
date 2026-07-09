import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHead from "@/components/SectionHead";
import BlogCard from "@/components/BlogCard";
import TableOfContents from "@/components/TableOfContents";
import AuthorBio from "@/components/AuthorBio";
import ShareButtons from "@/components/ShareButtons";
import NewsletterForm from "@/components/NewsletterForm";
import Faq from "@/components/Faq";
import { BLOG_POSTS, getBlogPost, getCategoryName } from "@/lib/blogData";
import { SITE_URL, SITE_NAME } from "@/lib/siteConfig";

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  const categoryName = getCategoryName(post.categorySlug);
  return {
    title: `${post.title} — ${categoryName} | Blog MAX OFFICE`,
    description: `${post.excerpt} Chuyên mục: ${categoryName}.`,
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo-blue.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <PageHero
        image="/images/coworking.jpg"
        eyebrow={getCategoryName(post.categorySlug)}
        title={post.title}
        description={post.excerpt}
      />
      <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
            <div>
              <TableOfContents items={[]} />

              <article className="text-justify-vn text-[15.5px] leading-relaxed text-body-text">
                <p>
                  Nội dung bài viết đang được đội ngũ MAX OFFICE biên soạn và sẽ
                  sớm được cập nhật tại đây. Vui lòng quay lại sau hoặc liên hệ
                  hotline 089 8082 188 nếu bạn cần tư vấn ngay.
                </p>
              </article>

              <ShareButtons title={post.title} />
              <AuthorBio author={post.author} />
            </div>

            <aside>
              <NewsletterForm compact />
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-bg-tint py-9">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
            <SectionHead eyebrow="Xem thêm" title="Bài viết liên quan" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Faq
        id="faq"
        eyebrow="Câu hỏi thường gặp"
        title="Câu hỏi liên quan đến bài viết"
        description="Nội dung hỏi đáp sẽ được cập nhật cùng bài viết."
        items={[]}
      />

      <section className="py-9">
        <div className="mx-auto max-w-[640px] px-5 sm:px-8">
          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
