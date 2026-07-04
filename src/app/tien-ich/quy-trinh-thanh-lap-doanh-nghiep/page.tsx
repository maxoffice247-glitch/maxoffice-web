import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import SectionHead from "@/components/SectionHead";
import ProcessTimeline, { type TimelineStep } from "@/components/ProcessTimeline";
import {
  HeadsetIcon,
  DocumentCheckIcon,
  CheckCircleIcon,
  KeyIcon,
  CalculatorIcon,
  BuildingIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Quy Trình Thành Lập Doanh Nghiệp — Timeline Tương Tác | MAX OFFICE",
  description:
    "Timeline tương tác toàn bộ hành trình thành lập doanh nghiệp: từ tư vấn loại hình đến khi chính thức vận hành — thời gian dự kiến và hỗ trợ của MAX OFFICE ở từng bước.",
};

const STEPS: TimelineStep[] = [
  {
    title: "Tư vấn loại hình",
    duration: "Trong ngày",
    icon: <HeadsetIcon className="h-6 w-6" />,
    detail:
      "Xác định loại hình phù hợp — Hộ kinh doanh, Công ty TNHH hay Công ty Cổ phần — dựa trên ngành nghề, số lượng thành viên và kế hoạch phát triển.",
    support: "MAX OFFICE tư vấn miễn phí, giúp bạn chọn đúng loại hình ngay từ đầu, tránh phải chuyển đổi tốn kém về sau.",
  },
  {
    title: "Chuẩn bị hồ sơ",
    duration: "1-2 ngày làm việc",
    icon: <DocumentCheckIcon className="h-6 w-6" />,
    detail:
      "Chuẩn bị thông tin tên doanh nghiệp, địa chỉ trụ sở, ngành nghề, vốn điều lệ và giấy tờ tuỳ thân của thành viên/cổ đông sáng lập.",
    support: "MAX OFFICE hỗ trợ soạn thảo điều lệ công ty, giấy đề nghị đăng ký và toàn bộ giấy tờ cần thiết.",
  },
  {
    title: "Nộp hồ sơ & nhận giấy phép",
    duration: "Theo thời gian xử lý của cơ quan đăng ký kinh doanh",
    icon: <CheckCircleIcon className="h-6 w-6" />,
    detail:
      "Nộp hồ sơ đăng ký doanh nghiệp tại cơ quan đăng ký kinh doanh có thẩm quyền và nhận Giấy chứng nhận đăng ký doanh nghiệp.",
    support: "MAX OFFICE đại diện nộp hồ sơ, theo dõi tiến độ xử lý và thông báo kết quả ngay khi có.",
  },
  {
    title: "Khắc dấu & mở tài khoản ngân hàng",
    duration: "1-2 ngày làm việc",
    icon: <KeyIcon className="h-6 w-6" />,
    detail: "Khắc dấu doanh nghiệp và mở tài khoản ngân hàng để phục vụ giao dịch, nộp thuế điện tử.",
    support: "MAX OFFICE giới thiệu đơn vị khắc dấu uy tín và hỗ trợ thủ tục mở tài khoản ngân hàng doanh nghiệp.",
  },
  {
    title: "Đăng ký thuế ban đầu",
    duration: "Ngay sau khi có giấy phép",
    icon: <CalculatorIcon className="h-6 w-6" />,
    detail: "Hoàn tất thủ tục đăng ký thuế ban đầu và các nghĩa vụ thuế liên quan trước khi chính thức hoạt động.",
    support: "MAX OFFICE hỗ trợ kê khai thuế ban đầu và tư vấn nghĩa vụ thuế phù hợp với loại hình doanh nghiệp của bạn.",
  },
  {
    title: "Bắt đầu vận hành",
    duration: "Ngay sau khi hoàn tất các bước trên",
    icon: <BuildingIcon className="h-6 w-6" />,
    detail: "Doanh nghiệp chính thức đi vào hoạt động — treo bảng hiệu, phát hành hoá đơn và bắt đầu kinh doanh.",
    support: "MAX OFFICE đồng hành lâu dài với dịch vụ văn phòng, kế toán thuế và tư vấn các thủ tục phát sinh sau này.",
  },
];

const BENEFITS = [
  { icon: CheckCircleIcon, title: "Hình dung rõ toàn bộ hành trình", desc: "Nắm được thứ tự và thời gian dự kiến của từng bước trước khi bắt đầu." },
  { icon: HeadsetIcon, title: "Biết MAX OFFICE hỗ trợ gì", desc: "Mỗi bước đều có ghi chú cụ thể về sự hỗ trợ của đội ngũ MAX OFFICE." },
  { icon: DocumentCheckIcon, title: "Chuẩn bị chủ động", desc: "Chuẩn bị hồ sơ, giấy tờ đúng lúc, tránh chậm trễ không đáng có." },
];

const RELATED_SERVICES = [
  { slug: "thanh-lap-doanh-nghiep", name: "Thành lập doanh nghiệp", desc: "Từ 800.000đ kèm Văn phòng ảo" },
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
  { slug: "ke-toan-thue", name: "Kế toán & thuế", desc: "Từ 800.000đ/tháng" },
];

const FAQS = [
  { q: "Toàn bộ quy trình thành lập doanh nghiệp mất bao lâu?", a: "Tuỳ loại hình và hồ sơ cụ thể, thường hoàn tất trong vài ngày làm việc. MAX OFFICE sẽ hỗ trợ theo dõi tiến độ và thông báo kết quả từng bước." },
  { q: "Tôi có cần thực hiện tất cả các bước cùng lúc không?", a: "Không nhất thiết, nhưng nên thực hiện theo đúng thứ tự trên để tránh phát sinh vướng mắc, đặc biệt là khắc dấu và đăng ký thuế cần thực hiện sau khi có giấy phép." },
  { q: "Tôi có thể chỉ thuê MAX OFFICE hỗ trợ một vài bước không?", a: "Có. Bạn có thể chọn hỗ trợ trọn gói toàn bộ quy trình hoặc chỉ một vài bước cụ thể tuỳ nhu cầu." },
  { q: "Sau khi bắt đầu vận hành, tôi cần lưu ý gì?", a: "Doanh nghiệp cần duy trì kê khai thuế định kỳ, sổ sách kế toán minh bạch — MAX OFFICE có dịch vụ kế toán thuế hàng tháng hỗ trợ việc này." },
];

export default function QuyTrinhThanhLapDoanhNghiepPage() {
  return (
    <ToolPageTemplate
      heroTitle="Quy trình thành lập doanh nghiệp"
      heroDescription="Timeline tương tác toàn bộ hành trình từ lúc tư vấn loại hình đến khi chính thức vận hành — bấm vào từng bước để xem chi tiết."
      breadcrumbLabel="Quy trình thành lập doanh nghiệp"
      benefitsTitle="Vì sao nên xem qua timeline này"
      benefits={BENEFITS}
      relatedServices={RELATED_SERVICES}
      faqTopic="quy trình thành lập doanh nghiệp"
      faqs={FAQS}
      defaultService="Thành lập doanh nghiệp"
    >
      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Timeline tương tác"
            title="Hành trình thành lập doanh nghiệp"
            description="Bấm vào từng bước để xem chi tiết, thời gian dự kiến và MAX OFFICE hỗ trợ gì."
          />
          <ProcessTimeline steps={STEPS} />
        </div>
      </section>
    </ToolPageTemplate>
  );
}
