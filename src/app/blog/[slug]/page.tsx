import type { Metadata } from "next";
import Link from "next/link";
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
import CtaBanner from "@/components/CtaBanner";
import Button from "@/components/Button";
import { ArrowRightSmallIcon } from "@/components/icons";
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
  return {
    title: post.metaTitle,
    description: post.metaDescription,
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

  const hasContent = post.sections.length > 0;
  const related = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.categorySlug === post.categorySlug
  ).slice(0, 3);
  const tocItems = post.sections.map((s) => ({ id: s.id, label: s.heading }));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}${post.heroImage}`,
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
        image={post.heroImage}
        eyebrow={getCategoryName(post.categorySlug)}
        title={post.title}
        description={post.excerpt}
      />
      <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
            <div>
              <TableOfContents items={tocItems} />

              {hasContent ? (
                <article className="text-justify-vn text-[15.5px] leading-relaxed text-body-text">
                  {post.sections.map((section) => (
                    <section key={section.id} id={section.id} className="mb-8 scroll-mt-24 last:mb-0">
                      <h2 className="mb-3 text-[21px] font-bold text-navy sm:text-[23px]">
                        {section.heading}
                      </h2>
                      {section.paragraphs.map((p, i) => (
                        <p key={i} className="mb-4 last:mb-0">
                          {p}
                        </p>
                      ))}
                      {section.bullets && (
                        <ul className="mt-4 space-y-2.5">
                          {section.bullets.map((b, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  ))}

                  {post.relatedLinks.length > 0 && (
                    <div className="mt-10 rounded-2xl border border-line bg-bg-tint p-6">
                      <p className="mb-3 text-[13px] font-bold tracking-wide text-navy uppercase">
                        Liên kết hữu ích
                      </p>
                      <ul className="space-y-2">
                        {post.relatedLinks.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                            >
                              {link.label}
                              <ArrowRightSmallIcon className="h-3.5 w-3.5" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ) : (
                <article className="text-justify-vn text-[15.5px] leading-relaxed text-body-text">
                  <p>
                    Nội dung bài viết đang được đội ngũ MAX OFFICE biên soạn và sẽ
                    sớm được cập nhật tại đây. Vui lòng quay lại sau hoặc liên hệ
                    hotline 089 8082 188 nếu bạn cần tư vấn ngay.
                  </p>
                </article>
              )}

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

      {post.faqs.length > 0 && (
        <Faq
          id="faq"
          eyebrow="Câu hỏi thường gặp"
          title="Câu hỏi liên quan đến bài viết"
          items={post.faqs}
        />
      )}

      {hasContent && (
        <section className="pb-4">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
            <div className="flex justify-center">
              <Button href={post.cta.serviceHref} variant="primary">
                {post.cta.serviceLabel}
              </Button>
            </div>
          </div>
        </section>
      )}

      <CtaBanner
        title={post.cta.title}
        description={post.cta.description}
        service={post.cta.service}
        secondaryLabel="Nhận tư vấn miễn phí"
      />

      <section className="py-9">
        <div className="mx-auto max-w-[640px] px-5 sm:px-8">
          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
