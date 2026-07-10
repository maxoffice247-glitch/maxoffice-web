import SectionHead from "./SectionHead";
import { RevealGroup, RevealItem } from "./Reveal";
import Button from "./Button";
import { ArrowRightSmallIcon } from "./icons";
import { getKnowledgeCategory } from "@/lib/knowledgeCenterData";
import { getBlogPost } from "@/lib/blogData";

const FEATURED_SLUGS = [
  "ho-kinh-doanh-vs-tnhh-vs-co-phan",
  "van-phong-ao-la-gi-co-hop-phap-khong",
  "bai-bo-le-phi-mon-bai-2026",
  "khi-nao-nen-mo-chi-nhanh-moi",
];

export default function KnowledgeCenter() {
  const articles = FEATURED_SLUGS.map((slug) => {
    const post = getBlogPost(slug);
    if (!post) return null;
    const cat = getKnowledgeCategory(post.categorySlug);
    return { post, cat };
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <section id="kien-thuc" className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Kiến thức"
          title="Cẩm nang cho doanh nghiệp"
          description="Kiến thức pháp lý, thuế và vận hành được đội ngũ MAX OFFICE chọn lọc — giúp bạn ra quyết định đúng ngay từ đầu."
        />
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map(({ post, cat }) => (
            <RevealItem key={post.slug} className="h-full">
              <div className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-all duration-400 ease-out hover:-translate-y-2 hover:border-transparent hover:shadow-card">
                {cat && (
                  <div className="mb-5 flex h-[48px] w-[48px] items-center justify-center rounded-2xl bg-primary-tint text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <cat.icon className="h-5 w-5" />
                  </div>
                )}
                {cat && (
                  <span className="mb-2 text-[11.5px] font-bold tracking-wide text-accent uppercase">
                    {cat.name}
                  </span>
                )}
                <h3 className="mb-2.5 text-[15.5px] leading-snug font-bold text-navy">
                  {post.title}
                </h3>
                <p className="mb-5 flex-1 text-[13.5px] leading-relaxed text-body-text">
                  {post.excerpt}
                </p>
                <Button
                  href={`/blog/${post.slug}`}
                  variant="link"
                  icon={<ArrowRightSmallIcon />}
                  className="group-hover:gap-2.5"
                >
                  Đọc thêm
                </Button>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-10 text-center">
          <Button href="/knowledge-center" variant="ghost">
            Xem tất cả bài viết
          </Button>
        </div>
      </div>
    </section>
  );
}
