import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";
import { SERVICES_DATA } from "@/lib/servicesData";
import { LOCATIONS_DATA, AREAS } from "@/lib/locationsData";
import { KNOWLEDGE_CATEGORIES } from "@/lib/knowledgeCenterData";
import { BLOG_POSTS } from "@/lib/blogData";
import { getAllOfferedPlans } from "@/lib/planFinder";

const TOOL_SLUGS = [
  "chon-goi-van-phong",
  "tinh-chi-phi-thanh-lap",
  "tinh-le-phi-mon-bai",
  "so-sanh-thue",
  "tim-goi-phu-hop",
  "checklist-thanh-lap-doanh-nghiep",
  "checklist-mo-chi-nhanh",
  "checklist-thay-doi-giay-phep-kinh-doanh",
  "so-sanh-van-phong-ao-va-tron-goi",
  "so-sanh-tnhh-va-co-phan",
  "quy-trinh-thanh-lap-doanh-nghiep",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/ve-chung-toi`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/bang-gia`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/van-phong-ao-gia-re`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/van-phong-ao/nganh-nghe-phu-hop`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/lien-he`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/dia-diem`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/dich-vu`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/dich-vu/dich-vu-phap-ly-sua-doi`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/tien-ich`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/knowledge-center`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/chinh-sach-bao-mat`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/dieu-khoan-su-dung`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const servicePages: MetadataRoute.Sitemap = Object.keys(SERVICES_DATA).map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const locationPages: MetadataRoute.Sitemap = Object.values(LOCATIONS_DATA)
    .filter((loc) => loc.isActive !== false)
    .map((loc) => ({
      url: `${SITE_URL}/locations/${loc.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    }));

  const areaPages: MetadataRoute.Sitemap = AREAS.map((area) => ({
    url: `${SITE_URL}/dia-diem/${area.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const toolPages: MetadataRoute.Sitemap = TOOL_SLUGS.map((slug) => ({
    url: `${SITE_URL}/tien-ich/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  /** 1 URL cho mỗi gói/chi nhánh đang khả dụng — lấy động từ getAllOfferedPlans() nên tự đồng bộ khi bảng giá/chi nhánh thay đổi. */
  const planDetailPages: MetadataRoute.Sitemap = getAllOfferedPlans().map((p) => ({
    url: `${SITE_URL}/tien-ich/tim-goi-phu-hop/${p.locationSlug}/${p.planKey}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
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
    ...areaPages,
    ...toolPages,
    ...planDetailPages,
    ...knowledgeCategoryPages,
    ...blogPostPages,
  ];
}
