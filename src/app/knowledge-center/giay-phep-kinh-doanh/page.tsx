import type { Metadata } from "next";
import KnowledgeCategoryTemplate from "@/components/KnowledgeCategoryTemplate";
import { KNOWLEDGE_CATEGORIES } from "@/lib/knowledgeCenterData";

const category = KNOWLEDGE_CATEGORIES.find((c) => c.slug === "giay-phep-kinh-doanh")!;

export const metadata: Metadata = {
  title: `${category.name} — Kiến Thức MAX OFFICE`,
  description: category.description,
};

export default function Page() {
  return <KnowledgeCategoryTemplate category={category} />;
}
