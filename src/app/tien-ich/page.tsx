import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHead from "@/components/SectionHead";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import CtaBanner from "@/components/CtaBanner";
import {
  KeyIcon,
  DocumentCheckIcon,
  BadgePercentIcon,
  ListIcon,
  BuildingIcon,
  ShieldCheckIcon,
  ScaleIcon,
  RouteIcon,
  ArrowRightSmallIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Tiện Ích Miễn Phí - Công Cụ, Checklist, So Sánh | MAX OFFICE",
  description:
    "9 tiện ích miễn phí: công cụ tính toán, checklist tải PDF, bảng so sánh dịch vụ/loại hình doanh nghiệp và timeline quy trình thành lập — hỗ trợ ra quyết định nhanh chóng.",
  openGraph: {
    images: [{ url: "/images/og/khong-gian-lam-viec.jpg", width: 1200, height: 630 }],
  },
};

const TOOL_GROUPS = [
  {
    title: "Công cụ tính toán",
    description: "Trả lời vài câu hỏi ngắn, nhận kết quả và gợi ý ngay lập tức.",
    tools: [
      {
        slug: "chon-goi-van-phong",
        icon: KeyIcon,
        title: "Chọn gói văn phòng phù hợp",
        desc: "Trả lời 5 câu hỏi ngắn để nhận gợi ý gói văn phòng tối ưu nhất cho nhu cầu và ngân sách của bạn.",
        linkLabel: "Dùng công cụ ngay",
      },
      {
        slug: "tinh-chi-phi-thanh-lap",
        icon: DocumentCheckIcon,
        title: "Tính chi phí thành lập công ty",
        desc: "Ước tính chi phí thành lập theo Gói 1, Gói 2 và các dịch vụ pháp lý sửa đổi theo bảng giá mới nhất.",
        linkLabel: "Dùng công cụ ngay",
      },
      {
        slug: "tinh-le-phi-mon-bai",
        icon: BadgePercentIcon,
        title: "Lệ phí môn bài đã bãi bỏ",
        desc: "Cập nhật quy định mới nhất: từ 01/01/2026, lệ phí môn bài đã chính thức bãi bỏ theo Nghị quyết 198/2025/QH15.",
        linkLabel: "Xem quy định mới",
      },
    ],
  },
  {
    title: "Checklist tải về",
    description: "Danh sách các bước cần làm, tick từng mục hoặc tải PDF để lưu lại.",
    tools: [
      {
        slug: "checklist-thanh-lap-doanh-nghiep",
        icon: ListIcon,
        title: "Checklist thành lập doanh nghiệp",
        desc: "Các bước và giấy tờ cần chuẩn bị khi thành lập Hộ kinh doanh, Công ty TNHH hoặc Công ty Cổ phần.",
        linkLabel: "Xem checklist",
      },
      {
        slug: "checklist-mo-chi-nhanh",
        icon: BuildingIcon,
        title: "Checklist mở chi nhánh",
        desc: "Các bước và giấy tờ cần chuẩn bị khi mở chi nhánh công ty.",
        linkLabel: "Xem checklist",
      },
      {
        slug: "checklist-thay-doi-giay-phep-kinh-doanh",
        icon: ShieldCheckIcon,
        title: "Checklist thay đổi giấy phép kinh doanh",
        desc: "Các bước khi thay đổi tên, địa chỉ, ngành nghề hoặc vốn điều lệ.",
        linkLabel: "Xem checklist",
      },
    ],
  },
  {
    title: "So sánh & lộ trình",
    description: "Đối chiếu trực quan để chọn đúng gói dịch vụ hoặc loại hình doanh nghiệp.",
    tools: [
      {
        slug: "so-sanh-van-phong-ao-va-tron-goi",
        icon: ScaleIcon,
        title: "So sánh Văn phòng ảo & Trọn gói",
        desc: "Bảng so sánh tính năng, chi phí và đối tượng phù hợp giữa hai gói dịch vụ phổ biến nhất.",
        linkLabel: "Xem so sánh",
      },
      {
        slug: "so-sanh-tnhh-va-co-phan",
        icon: ScaleIcon,
        title: "So sánh TNHH & Cổ phần",
        desc: "Vốn điều lệ, cơ cấu quản lý và chi phí thành lập theo đúng bảng giá hiện tại.",
        linkLabel: "Xem so sánh",
      },
      {
        slug: "quy-trinh-thanh-lap-doanh-nghiep",
        icon: RouteIcon,
        title: "Quy trình thành lập doanh nghiệp",
        desc: "Timeline tương tác toàn bộ hành trình từ tư vấn loại hình đến khi chính thức vận hành.",
        linkLabel: "Xem timeline",
      },
    ],
  },
];

export default function TienIchPage() {
  return (
    <main>
      <PageHero
        image="/images/khong-gian-lam-viec.jpg"
        eyebrow="Tiện ích"
        title="Công cụ miễn phí hỗ trợ doanh nghiệp"
        description="9 tiện ích miễn phí giúp bạn ra quyết định nhanh chóng — từ công cụ tính toán, checklist tải PDF, đến bảng so sánh và lộ trình thành lập doanh nghiệp."
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
                    <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-tint text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                      <tool.icon className="h-6 w-6" />
                    </span>
                    <h3 className="mb-2.5 text-[19px] font-bold text-navy">{tool.title}</h3>
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
