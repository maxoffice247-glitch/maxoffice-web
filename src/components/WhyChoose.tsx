import SectionHead from "./SectionHead";
import { RevealGroup, RevealItem } from "./Reveal";
import {
  BuildingIcon,
  CheckCircleIcon,
  TagIcon,
  UsersIcon,
  ClockIcon,
  HeartHandshakeIcon,
} from "./icons";

const REASONS = [
  {
    icon: BuildingIcon,
    title: "12 địa điểm trung tâm",
    desc: "Hiện diện tại các quận trung tâm TP.HCM — chọn địa chỉ phù hợp nhất với khách hàng và đối tác của bạn.",
  },
  {
    icon: CheckCircleIcon,
    title: "Đầy đủ pháp lý",
    desc: "Địa chỉ đăng ký kinh doanh hợp lệ, hồ sơ pháp lý minh bạch, được tư vấn bởi đội ngũ có chuyên môn.",
  },
  {
    icon: TagIcon,
    title: "Giá minh bạch",
    desc: "Bảng giá rõ ràng ngay từ đầu, không phát sinh chi phí ẩn trong suốt quá trình sử dụng dịch vụ.",
  },
  {
    icon: UsersIcon,
    title: "Đội ngũ chuyên nghiệp",
    desc: "Tư vấn viên am hiểu thủ tục pháp lý và kế toán, đồng hành cùng bạn xuyên suốt quá trình.",
  },
  {
    icon: ClockIcon,
    title: "Xử lý nhanh chóng",
    desc: "Quy trình tinh gọn giúp rút ngắn thời gian đăng ký, thành lập và bắt đầu hoạt động kinh doanh.",
  },
  {
    icon: HeartHandshakeIcon,
    title: "Chăm sóc tận tâm",
    desc: "Hỗ trợ liên tục trong suốt quá trình sử dụng dịch vụ, luôn sẵn sàng giải đáp mọi thắc mắc.",
  },
];

export default function WhyChoose() {
  return (
    <section id="why" className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Vì sao doanh nghiệp chọn MAX OFFICE"
          title="Một đối tác — trọn vẹn hành trình vận hành doanh nghiệp"
          description="Không chỉ là nơi làm việc — MAX OFFICE là hệ thống hỗ trợ doanh nghiệp từ ngày đầu thành lập đến khi mở rộng quy mô, với đội ngũ luôn đồng hành ở từng bước quan trọng."
        />
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {REASONS.map((reason) => (
            <RevealItem key={reason.title}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-white p-8 transition-all duration-400 ease-out hover:-translate-y-2 hover:border-transparent hover:shadow-card">
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-primary to-accent transition-transform duration-400 ease-out group-hover:scale-x-100"
                />
                <div className="mb-6 flex h-[54px] w-[54px] items-center justify-center rounded-2xl bg-primary-tint text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <reason.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-[19px] font-bold text-navy">
                  {reason.title}
                </h3>
                <p className="text-[14.5px] leading-relaxed text-body-text">
                  {reason.desc}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
