import type { Metadata } from "next";
import KnowledgeCategoryTemplate from "@/components/KnowledgeCategoryTemplate";
import { KNOWLEDGE_CATEGORIES } from "@/lib/knowledgeCenterData";

const category = KNOWLEDGE_CATEGORIES.find((c) => c.slug === "thanh-lap-doanh-nghiep")!;

export const metadata: Metadata = {
  title: `${category.name} — Kiến Thức MAX OFFICE`,
  description: category.description,
};

export default function Page() {
  return <KnowledgeCategoryTemplate category={category} />;
}
