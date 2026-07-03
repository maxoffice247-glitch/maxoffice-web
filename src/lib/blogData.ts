import { KNOWLEDGE_CATEGORIES } from "./knowledgeCenterData";

export type BlogCategory = { slug: string; name: string };

export const BLOG_CATEGORIES: BlogCategory[] = KNOWLEDGE_CATEGORIES.map((c) => ({
  slug: c.slug,
  name: c.name,
}));

export function getCategoryName(slug: string) {
  return BLOG_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  author: string;
  date: string;
  readingTime: number;
};

// Placeholder posts only — real articles will be added gradually after launch.
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "bai-viet-sap-ra-mat-1",
    title: "Bài viết sắp ra mắt",
    excerpt:
      "Nội dung bài viết đang được đội ngũ MAX OFFICE biên soạn và sẽ sớm được đăng tải tại đây.",
    categorySlug: "thanh-lap-doanh-nghiep",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-03",
    readingTime: 5,
  },
  {
    slug: "bai-viet-sap-ra-mat-2",
    title: "Bài viết sắp ra mắt",
    excerpt:
      "Nội dung bài viết đang được đội ngũ MAX OFFICE biên soạn và sẽ sớm được đăng tải tại đây.",
    categorySlug: "ke-toan-thue",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-03",
    readingTime: 5,
  },
  {
    slug: "bai-viet-sap-ra-mat-3",
    title: "Bài viết sắp ra mắt",
    excerpt:
      "Nội dung bài viết đang được đội ngũ MAX OFFICE biên soạn và sẽ sớm được đăng tải tại đây.",
    categorySlug: "van-phong-dia-diem",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-03",
    readingTime: 5,
  },
];

export const BLOG_PAGE_SIZE = 9;

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
