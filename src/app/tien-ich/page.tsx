import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHead from "@/components/SectionHead";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import Button from "@/components/Button";
import CtaBanner from "@/components/CtaBanner";
import { KeyIcon, DocumentCheckIcon, BadgePercentIcon, ArrowRightSmallIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Tiện Ích Miễn Phí - Công Cụ Hỗ Trợ Doanh Nghiệp | MAX OFFICE",
  description:
    "3 công cụ miễn phí giúp bạn chọn gói văn phòng phù hợp, tính chi phí thành lập công ty và tính lệ phí môn bài — nhanh chóng, chính xác, không mất phí.",
};

const TOOLS = [
  {
    slug: "chon-goi-van-phong",
    icon: KeyIcon,
    title: "Chọn gói văn phòng phù hợp",
    desc: "Trả lời 5 câu hỏi ngắn để nhận gợi ý gói văn phòng tối ưu nhất cho nhu cầu và ngân sách của bạn.",
  },
  {
    slug: "tinh-chi-phi-thanh-lap",
    icon: DocumentCheckIcon,
    title: "Tính chi phí thành lập công ty",
    desc: "Ước tính chi phí thành lập Hộ kinh doanh, Công ty TNHH hoặc Công ty Cổ phần theo bảng giá mới nhất.",
  },
  {
    slug: "tinh-le-phi-mon-bai",
    icon: BadgePercentIcon,
    title: "Tính lệ phí môn bài",
    desc: "Tính chính xác mức lệ phí môn bài cần đóng theo loại hình doanh nghiệp và vốn điều lệ.",
  },
];

export default function TienIchPage() {
  return (
    <main>
      <PageHero
        image="/images/khong-gian-lam-viec.png"
        eyebrow="Tiện ích"
        title="Công cụ miễn phí hỗ trợ doanh nghiệp"
        description="3 công cụ tính toán miễn phí giúp bạn ra quyết định nhanh chóng — chọn đúng gói văn phòng, ước tính chi phí thành lập và lệ phí môn bài."
      />
      <Breadcrumb items={[{ label: "Tiện ích" }]} />

      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Tất cả công cụ"
            title="Chọn công cụ bạn cần"
            description="Mỗi công cụ chỉ mất khoảng 1 phút để hoàn thành và cho kết quả ngay lập tức."
          />
          <RevealGroup className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <RevealItem key={tool.slug} className="h-full">
                <div className="group flex h-full flex-col rounded-2xl border border-line bg-white p-7 transition-all duration-400 ease-out hover:-translate-y-2 hover:border-transparent hover:shadow-card">
                  <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-tint text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <tool.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mb-2.5 text-[19px] font-bold text-navy">{tool.title}</h3>
                  <p className="mb-6 flex-1 text-[14.5px] leading-relaxed text-body-text">
                    {tool.desc}
                  </p>
                  <Button
                    href={`/tien-ich/${tool.slug}`}
                    variant="link"
                    icon={<ArrowRightSmallIcon />}
                    className="group-hover:gap-2.5"
                  >
                    Dùng công cụ ngay
                  </Button>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
