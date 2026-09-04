import type { ComponentType, SVGProps } from "react";
import {
  KeyIcon,
  DocumentCheckIcon,
  BadgePercentIcon,
  ListIcon,
  BuildingIcon,
  ShieldCheckIcon,
  ScaleIcon,
  RouteIcon,
  TagIcon,
} from "@/components/icons";
import { ACTIVE_BRANCH_COUNT } from "./locationsData";

/**
 * Nguồn dữ liệu DUY NHẤT cho danh sách "Tiện ích" — dùng chung cho dropdown
 * desktop (ToolsMegaMenu.tsx) VÀ trang hub /tien-ich (trang mà mục "Tiện
 * ích" trong menu mobile điều hướng tới). Trước đây 2 nơi này tự khai báo 2
 * mảng riêng, dẫn tới thứ tự lệch nhau (sửa thứ tự ở dropdown desktop nhưng
 * quên trang hub, hoặc ngược lại) — gộp về đây để THỨ TỰ và DANH SÁCH luôn
 * đồng bộ, chỉ có phần hiển thị (title ngắn cho dropdown, titleFull/desc dài
 * hơn cho card trang hub) là khác nhau theo bối cảnh.
 */
export type ToolItem = {
  slug: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Nhãn ngắn — dùng trong dropdown desktop (không gian hẹp, 3 cột). */
  title: string;
  /** Nhãn đầy đủ — dùng làm tiêu đề card trên trang hub /tien-ich. */
  titleFull: string;
  /** Mô tả — chỉ trang hub /tien-ich dùng (dropdown không hiển thị). */
  desc: string;
  /** Nhãn CTA cuối card — chỉ trang hub /tien-ich dùng. */
  linkLabel: string;
  /** Tô đỏ (accent) icon của mục này thay vì xanh mặc định, để làm điểm
      nhấn nổi bật hơn các mục khác trong cùng danh sách. */
  highlight?: boolean;
};

export const TOOL_GROUPS: { title: string; description: string; tools: ToolItem[] }[] = [
  {
    title: "Công cụ tính toán",
    description: "Trả lời vài câu hỏi ngắn, nhận kết quả và gợi ý ngay lập tức.",
    tools: [
      // "Tìm VPA theo nhu cầu", "So sánh thuế" và "Soạn hồ sơ doanh nghiệp"
      // cố định 3 vị trí đầu (điểm nhấn, icon tô đỏ) — các mục còn lại giữ
      // nguyên thứ tự tương đối sau đó.
      {
        slug: "tim-goi-phu-hop",
        icon: TagIcon,
        title: "Tìm VPA theo nhu cầu",
        titleFull: "Tìm VPA theo nhu cầu",
        desc: `Chọn khu vực và ngân sách mong muốn, nhận ngay danh sách gói văn phòng ảo phù hợp trong ${ACTIVE_BRANCH_COUNT} chi nhánh MAX OFFICE.`,
        linkLabel: "Dùng công cụ ngay",
        highlight: true,
      },
      {
        slug: "so-sanh-thue",
        icon: ScaleIcon,
        title: "So sánh thuế TNCN vs Hộ KD",
        titleFull: "So sánh thuế: TNCN vs Hộ kinh doanh",
        desc: "Nhập thu nhập theo tháng để so sánh nhanh số thuế phải nộp giữa đóng thuế TNCN và đăng ký hộ kinh doanh, theo biểu thuế 2026.",
        linkLabel: "Dùng công cụ ngay",
        highlight: true,
      },
      {
        slug: "soan-ho-so-doanh-nghiep",
        icon: DocumentCheckIcon,
        title: "Soạn hồ sơ doanh nghiệp",
        titleFull: "Soạn hồ sơ doanh nghiệp tự động",
        desc: "Điền thông tin, nhận ngay bộ hồ sơ soạn sẵn cho thành lập mới, mở chi nhánh, chuyển nhượng vốn, đổi địa chỉ GPKD và Mẫu số 12.",
        linkLabel: "Dùng công cụ ngay",
        highlight: true,
      },
      {
        slug: "chon-goi-van-phong",
        icon: KeyIcon,
        title: "Chọn gói văn phòng",
        titleFull: "Chọn gói văn phòng phù hợp",
        desc: "Trả lời 5 câu hỏi ngắn để nhận gợi ý gói văn phòng tối ưu nhất cho nhu cầu và ngân sách của bạn.",
        linkLabel: "Dùng công cụ ngay",
      },
      {
        slug: "tinh-chi-phi-thanh-lap",
        icon: DocumentCheckIcon,
        title: "Tính chi phí thành lập",
        titleFull: "Tính chi phí thành lập công ty",
        desc: "Ước tính chi phí thành lập theo Gói 1, Gói 2 và các dịch vụ pháp lý sửa đổi theo bảng giá mới nhất.",
        linkLabel: "Dùng công cụ ngay",
      },
      {
        slug: "tinh-le-phi-mon-bai",
        icon: BadgePercentIcon,
        title: "Lệ phí môn bài",
        titleFull: "Lệ phí môn bài đã bãi bỏ",
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
        title: "Checklist thành lập DN",
        titleFull: "Checklist thành lập doanh nghiệp",
        desc: "Các bước và giấy tờ cần chuẩn bị khi thành lập Hộ kinh doanh, Công ty TNHH hoặc Công ty Cổ phần.",
        linkLabel: "Xem checklist",
      },
      {
        slug: "checklist-mo-chi-nhanh",
        icon: BuildingIcon,
        title: "Checklist mở chi nhánh",
        titleFull: "Checklist mở chi nhánh",
        desc: "Các bước và giấy tờ cần chuẩn bị khi mở chi nhánh công ty.",
        linkLabel: "Xem checklist",
      },
      {
        slug: "checklist-thay-doi-giay-phep-kinh-doanh",
        icon: ShieldCheckIcon,
        title: "Checklist thay đổi giấy phép",
        titleFull: "Checklist thay đổi giấy phép kinh doanh",
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
        titleFull: "So sánh Văn phòng ảo & Trọn gói",
        desc: "Bảng so sánh tính năng, chi phí và đối tượng phù hợp giữa hai gói dịch vụ phổ biến nhất.",
        linkLabel: "Xem so sánh",
      },
      {
        slug: "so-sanh-tnhh-va-co-phan",
        icon: ScaleIcon,
        title: "So sánh TNHH & Cổ phần",
        titleFull: "So sánh TNHH & Cổ phần",
        desc: "Vốn điều lệ, cơ cấu quản lý và chi phí thành lập theo đúng bảng giá hiện tại.",
        linkLabel: "Xem so sánh",
      },
      {
        slug: "quy-trinh-thanh-lap-doanh-nghiep",
        icon: RouteIcon,
        title: "Quy trình thành lập DN",
        titleFull: "Quy trình thành lập doanh nghiệp",
        desc: "Timeline tương tác toàn bộ hành trình từ tư vấn loại hình đến khi chính thức vận hành.",
        linkLabel: "Xem timeline",
      },
    ],
  },
];
