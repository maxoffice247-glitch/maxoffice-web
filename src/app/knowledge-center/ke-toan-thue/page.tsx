import type { Metadata } from "next";
import KnowledgeCategoryTemplate from "@/components/KnowledgeCategoryTemplate";
import { KNOWLEDGE_CATEGORIES } from "@/lib/knowledgeCenterData";

const category = KNOWLEDGE_CATEGORIES.find((c) => c.slug === "ke-toan-thue")!;

export const metadata: Metadata = {
  alternates: { canonical: "/knowledge-center/ke-toan-thue" },
  title: `${category.name} — Kiến Thức MAX OFFICE`,
  description: category.description,
};

export default function Page() {
  return <KnowledgeCategoryTemplate category={category} />;
}
