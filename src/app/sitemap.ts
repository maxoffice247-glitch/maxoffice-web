import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";
import { SERVICES_DATA } from "@/lib/servicesData";
import { LOCATIONS_DATA } from "@/lib/locationsData";
import { KNOWLEDGE_CATEGORIES } from "@/lib/knowledgeCenterData";
import { BLOG_POSTS } from "@/lib/blogData";

const TOOL_SLUGS = [
  "chon-goi-van-phong",
  "tinh-chi-phi-thanh-lap",
  "tinh-le-phi-mon-bai",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/ve-chung-toi`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/bang-gia`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/lien-he`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/dia-diem`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/dich-vu`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/tien-ich`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/knowledge-center`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  const servicePages: MetadataRoute.Sitemap = Object.keys(SERVICES_DATA).map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const locationPages: MetadataRoute.Sitemap = Object.keys(LOCATIONS_DATA).map((slug) => ({
    url: `${SITE_URL}/locations/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const toolPages: MetadataRoute.Sitemap = TOOL_SLUGS.map((slug) => ({
    url: `${SITE_URL}/tien-ich/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const knowledgeCategoryPages: MetadataRoute.Sitemap = KNOWLEDGE_CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/knowledge-center/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const blogPostPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...servicePages,
    ...locationPages,
    ...toolPages,
    ...knowledgeCategoryPages,
    ...blogPostPages,
  ];
}
