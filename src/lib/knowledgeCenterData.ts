import type { ComponentType } from "react";
import {
  DocumentCheckIcon,
  CalculatorIcon,
  BuildingIcon,
  ShieldCheckIcon,
  ScaleIcon,
  RocketIcon,
  WalletIcon,
  TrendingUpIcon,
} from "@/components/icons";

export type KnowledgeCategory = {
  slug: string;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

export const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  {
    slug: "thanh-lap-doanh-nghiep",
    name: "Thành Lập Doanh Nghiệp",
    description:
      "Quy trình, hồ sơ và kinh nghiệm thành lập hộ kinh doanh, công ty TNHH, công ty cổ phần.",
    icon: DocumentCheckIcon,
  },
  {
    slug: "ke-toan-thue",
    name: "Kế Toán & Thuế",
    description:
      "Kê khai thuế, sổ sách kế toán và các nghĩa vụ tài chính doanh nghiệp cần nắm rõ.",
    icon: CalculatorIcon,
  },
  {
    slug: "van-phong-dia-diem",
    name: "Văn Phòng & Địa Điểm",
    description:
      "Kinh nghiệm chọn văn phòng, địa chỉ đăng ký kinh doanh phù hợp với từng mô hình.",
    icon: BuildingIcon,
  },
  {
    slug: "giay-phep-kinh-doanh",
    name: "Giấy Phép Kinh Doanh",
    description:
      "Điều kiện, thủ tục xin giấy phép con cho các ngành nghề kinh doanh có điều kiện.",
    icon: ShieldCheckIcon,
  },
  {
    slug: "phap-ly-doanh-nghiep",
    name: "Pháp Lý Doanh Nghiệp",
    description:
      "Quy định pháp luật, hợp đồng và rủi ro pháp lý doanh nghiệp cần lưu ý khi vận hành.",
    icon: ScaleIcon,
  },
  {
    slug: "startup-khoi-nghiep",
    name: "Startup & Khởi Nghiệp",
    description:
      "Kinh nghiệm khởi nghiệp, gọi vốn và xây dựng đội ngũ trong giai đoạn đầu.",
    icon: RocketIcon,
  },
  {
    slug: "quan-ly-tai-chinh",
    name: "Quản Lý Tài Chính",
    description:
      "Dòng tiền, ngân sách và kiểm soát tài chính doanh nghiệp hiệu quả.",
    icon: WalletIcon,
  },
  {
    slug: "mo-rong-kinh-doanh",
    name: "Mở Rộng Kinh Doanh",
    description:
      "Chiến lược mở chi nhánh, mở rộng quy mô và phát triển thị trường mới.",
    icon: TrendingUpIcon,
  },
];

export function getKnowledgeCategory(slug: string) {
  return KNOWLEDGE_CATEGORIES.find((c) => c.slug === slug);
}

/** Slugs of BlogPost entries (see blogData.ts) to feature on the /knowledge-center hub. */
export const FEATURED_ARTICLE_SLUGS: string[] = [
  "ho-kinh-doanh-vs-tnhh-vs-co-phan",
  "khi-nao-can-thay-doi-giay-phep-kinh-doanh",
  "checklist-khoi-nghiep-tu-y-tuong-den-van-hanh",
];
