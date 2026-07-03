import SectionHead from "./SectionHead";
import { RevealGroup, RevealItem } from "./Reveal";
import Button from "./Button";
import {
  DocumentCheckIcon,
  BuildingIcon,
  CalculatorIcon,
  ShieldCheckIcon,
  ArrowRightSmallIcon,
} from "./icons";

const ARTICLES = [
  {
    icon: DocumentCheckIcon,
    tag: "Thành lập doanh nghiệp",
    title: "Nên chọn Hộ kinh doanh hay Công ty TNHH?",
    desc: "So sánh chi tiết ưu, nhược điểm từng loại hình để chọn đúng mô hình ngay từ đầu, tránh phải chuyển đổi tốn kém về sau.",
  },
  {
    icon: BuildingIcon,
    tag: "Văn phòng ảo",
    title: "5 điều cần biết trước khi thuê văn phòng ảo",
    desc: "Kinh nghiệm thực tế giúp doanh nghiệp chọn đúng địa chỉ đăng ký kinh doanh, tránh rủi ro pháp lý không đáng có.",
  },
  {
    icon: CalculatorIcon,
    tag: "Kế toán & Thuế",
    title: "Lịch nộp thuế doanh nghiệp cần nhớ trong năm",
    desc: "Tổng hợp các mốc kê khai, nộp thuế quan trọng — chủ động lịch trình để không bị phạt trễ hạn.",
  },
  {
    icon: ShieldCheckIcon,
    tag: "Mở rộng kinh doanh",
    title: "Thủ tục mở chi nhánh tại TP.HCM từ A-Z",
    desc: "Hướng dẫn từng bước hồ sơ, quy trình đăng ký chi nhánh đúng quy định pháp luật hiện hành.",
  },
];

export default function KnowledgeCenter() {
  return (
    <section id="kien-thuc" className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Kiến thức"
          title="Cẩm nang cho doanh nghiệp"
          description="Kiến thức pháp lý, thuế và vận hành được đội ngũ MAX OFFICE chọn lọc — giúp bạn ra quyết định đúng ngay từ đầu."
        />
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ARTICLES.map((article) => (
            <RevealItem key={article.title} className="h-full">
              <div className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-all duration-400 ease-out hover:-translate-y-2 hover:border-transparent hover:shadow-card">
                <div className="mb-5 flex h-[48px] w-[48px] items-center justify-center rounded-2xl bg-primary-tint text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <article.icon className="h-5 w-5" />
                </div>
                <span className="mb-2 text-[11.5px] font-bold tracking-wide text-accent uppercase">
                  {article.tag}
                </span>
                <h3 className="mb-2.5 text-[15.5px] leading-snug font-bold text-navy">
                  {article.title}
                </h3>
                <p className="mb-5 flex-1 text-[13.5px] leading-relaxed text-body-text">
                  {article.desc}
                </p>
                <Button
                  href="#"
                  variant="link"
                  icon={<ArrowRightSmallIcon />}
                  className="group-hover:gap-2.5"
                >
                  Đọc thêm
                </Button>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-10 text-center">
          <Button href="/knowledge-center" variant="ghost">
            Xem tất cả bài viết
          </Button>
        </div>
      </div>
    </section>
  );
}
