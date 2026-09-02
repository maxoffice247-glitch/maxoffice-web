import { renderOgImage, size, contentType } from "@/lib/og";
import { getBlogPost } from "@/lib/blogData";

export { size, contentType };

// Trước đây bài blog KHÔNG có opengraph-image riêng — generateMetadata()
// trong page.tsx cùng thư mục trỏ thẳng openGraph.images tới ảnh hero GỐC
// (post.heroImage), một ảnh nền trơn không qua renderOgImage() nên share
// link (Zalo/Facebook/Messenger) hiện ảnh trống, không logo/tiêu đề/
// overlay. Route này dùng ĐÚNG ảnh hero đó (post.heroImage, đổi
// /images/ -> /images/og/ để lấy bản đã crop sẵn 1200x630 — mọi giá trị
// heroImage hiện có trong blogData.ts đều đã có bản crop tương ứng) —
// nhưng render qua template chuẩn chung, đồng bộ với mọi nhóm trang khác.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return renderOgImage({
    title: post?.metaTitle ?? "Blog MAX OFFICE",
    backgroundImagePath: (post?.heroImage ?? "/images/coworking.jpg").replace(
      "/images/",
      "/images/og/"
    ),
  });
}
