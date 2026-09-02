import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHead from "@/components/SectionHead";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import CtaBanner from "@/components/CtaBanner";
import { ArrowRightSmallIcon } from "@/components/icons";
import { TOOL_GROUPS } from "@/lib/toolsData";

export const metadata: Metadata = {
  alternates: { canonical: "/tien-ich" },
  title: "Tiện Ích Miễn Phí - Công Cụ, Checklist, So Sánh | MAX OFFICE",
  description:
    "11 tiện ích miễn phí: công cụ tính toán, checklist tải PDF, bảng so sánh dịch vụ/loại hình doanh nghiệp và timeline quy trình thành lập — hỗ trợ ra quyết định nhanh chóng.",
  openGraph: {
    images: [{ url: "/images/og/khong-gian-lam-viec.jpg", width: 1200, height: 630 }],
  },
};

export default function TienIchPage() {
  return (
    <main>
      <PageHero
        image="/images/khong-gian-lam-viec.jpg"
        eyebrow="Tiện ích"
        title="Công cụ miễn phí hỗ trợ doanh nghiệp"
        description="11 tiện ích miễn phí giúp bạn ra quyết định nhanh chóng — từ công cụ tính toán, checklist tải PDF, đến bảng so sánh và lộ trình thành lập doanh nghiệp."
      />
      <Breadcrumb items={[{ label: "Tiện ích" }]} />

      {TOOL_GROUPS.map((group, gi) => (
        <section key={group.title} className={`py-9 ${gi % 2 === 1 ? "bg-bg-tint" : ""}`}>
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
            <SectionHead eyebrow="Tất cả tiện ích" title={group.title} description={group.description} />
            <RevealGroup className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {group.tools.map((tool) => (
                <RevealItem key={tool.slug} className="h-full">
                  <Link
                    href={`/tien-ich/${tool.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-white p-7 transition-all duration-400 ease-out hover:-translate-y-2 hover:border-transparent hover:shadow-card"
                  >
                    {/* highlight (Tìm VPA theo nhu cầu, So sánh thuế): icon
                        tô đỏ (accent) thay vì xanh mặc định để làm điểm
                        nhấn nổi bật hơn các mục còn lại — đồng bộ với
                        dropdown desktop (ToolsMegaMenu.tsx). */}
                    <span
                      className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300 ${
                        tool.highlight
                          ? "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white"
                          : "bg-primary-tint text-primary group-hover:bg-primary group-hover:text-white"
                      }`}
                    >
                      <tool.icon className="h-6 w-6" />
                    </span>
                    <h3 className="mb-2.5 text-[19px] font-bold text-navy">{tool.titleFull}</h3>
                    <p className="mb-6 flex-1 text-[14.5px] leading-relaxed text-body-text">
                      {tool.desc}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[14.5px] font-bold text-accent transition-all duration-300 ease-out group-hover:gap-2.5">
                      {tool.linkLabel}
                      <ArrowRightSmallIcon />
                    </span>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      ))}

      <CtaBanner />
    </main>
  );
}
