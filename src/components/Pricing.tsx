import SectionHead from "./SectionHead";
import { RevealGroup, RevealItem } from "./Reveal";
import Button from "./Button";
import { CheckCircleIcon } from "./icons";

type Plan = {
  name: string;
  price: string;
  unit: string;
  desc: string;
  features: string[];
  featured?: boolean;
  note?: boolean;
};

const GROUPS: { title: string; plans: Plan[]; cols: string; footnote?: string }[] = [
  {
    title: "Văn phòng & Coworking",
    cols: "sm:grid-cols-2 lg:grid-cols-3",
    plans: [
      {
        name: "Văn phòng ảo",
        price: "299.000đ",
        unit: "/ tháng",
        desc: "Địa chỉ đăng ký kinh doanh hợp lệ, phù hợp cá nhân & doanh nghiệp mới.",
        features: ["Địa chỉ đăng ký kinh doanh", "Nhận thư hộ", "Lễ tân chuyên nghiệp"],
      },
      {
        name: "Văn phòng trọn gói",
        price: "4.500.000đ",
        unit: "/ tháng",
        desc: "Không gian riêng, sẵn sàng làm việc ngay với đầy đủ tiện ích.",
        features: ["Nội thất & internet tốc độ cao", "Lễ tân & bảo vệ 24/7", "Phòng họp dùng chung"],
        featured: true,
      },
      {
        name: "Chỗ ngồi linh động",
        price: "2.000.000đ",
        unit: "/ tháng",
        desc: "Không gian coworking năng động cho freelancer & nhóm nhỏ.",
        features: ["Chỗ ngồi tự do", "Wifi tốc độ cao", "Trà, cà phê miễn phí"],
      },
      {
        name: "Phòng họp theo giờ",
        price: "150.000đ",
        unit: "/ giờ",
        desc: "Đặt lịch linh hoạt, trang bị đầy đủ thiết bị trình chiếu & âm thanh.",
        features: ["Màn hình trình chiếu", "Đặt lịch theo giờ", "Âm thanh hiện đại"],
      },
      {
        name: "Coworking theo ngày",
        price: "150.000đ",
        unit: "/ ngày",
        desc: "Chỗ ngồi làm việc trọn ngày, không cần cam kết dài hạn.",
        features: ["Chỗ ngồi cả ngày", "Không ràng buộc hợp đồng", "Phù hợp khách vãng lai"],
      },
    ],
  },
  {
    title: "Thành lập doanh nghiệp",
    cols: "sm:grid-cols-2 lg:grid-cols-3",
    footnote:
      "*Áp dụng khi đăng ký kèm Văn phòng ảo tại MAX OFFICE. Không kèm văn phòng ảo, giá thông thường: Hộ kinh doanh 1.000.000đ · Công ty TNHH 1.500.000đ · Công ty Cổ phần 2.000.000đ.",
    plans: [
      {
        name: "Hộ kinh doanh",
        price: "800.000đ",
        unit: "trọn gói",
        desc: "Phù hợp mô hình kinh doanh nhỏ, hộ gia đình, cá nhân khởi nghiệp.",
        features: ["Tư vấn ngành nghề kinh doanh", "Soạn hồ sơ đăng ký", "Nhận giấy phép nhanh chóng"],
        note: true,
      },
      {
        name: "Công ty TNHH",
        price: "1.299.000đ",
        unit: "trọn gói",
        desc: "Loại hình phổ biến nhất, phù hợp phần lớn doanh nghiệp vừa và nhỏ.",
        features: ["Tư vấn cơ cấu vốn góp", "Soạn điều lệ công ty", "Hỗ trợ khắc dấu & mã số thuế"],
        note: true,
      },
      {
        name: "Công ty Cổ phần",
        price: "1.500.000đ",
        unit: "trọn gói",
        desc: "Phù hợp doanh nghiệp có kế hoạch huy động vốn, mở rộng cổ đông.",
        features: ["Tư vấn cơ cấu cổ đông", "Soạn hồ sơ phát hành cổ phần", "Hỗ trợ thủ tục sau thành lập"],
        note: true,
      },
    ],
  },
  {
    title: "Kế toán & Thuế",
    cols: "sm:grid-cols-2 lg:grid-cols-2 max-w-[820px] mx-auto",
    plans: [
      {
        name: "Kế toán thuế Startup",
        price: "800.000đ",
        unit: "/ tháng",
        desc: "Dành cho doanh nghiệp mới thành lập, phát sinh giao dịch chưa nhiều.",
        features: ["Kê khai thuế định kỳ", "Sổ sách kế toán cơ bản", "Tư vấn nghĩa vụ thuế"],
      },
      {
        name: "Kế toán thuế Business",
        price: "1.500.000đ",
        unit: "/ tháng",
        desc: "Dành cho doanh nghiệp đang tăng trưởng, khối lượng giao dịch lớn hơn.",
        features: ["Kê khai thuế đầy đủ", "Báo cáo tài chính định kỳ", "Tư vấn thuế chuyên sâu"],
      },
    ],
  },
];

function PricingCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border p-7 text-left transition-all duration-400 ease-out hover:-translate-y-2 ${
        plan.featured
          ? "border-navy bg-navy shadow-[0_20px_50px_rgba(11,31,58,0.3)] hover:shadow-[0_28px_64px_rgba(11,31,58,0.4)]"
          : "border-line bg-white hover:border-primary/30 hover:shadow-card"
      }`}
    >
      {plan.featured && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1.5 text-[11.5px] font-bold tracking-wide whitespace-nowrap text-white shadow-[0_6px_16px_rgba(229,57,53,0.35)]">
          Phổ biến nhất
        </span>
      )}
      <div className={`mb-1.5 text-[15.5px] font-bold ${plan.featured ? "text-white" : "text-navy"}`}>
        {plan.name}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`font-mono text-[28px] font-bold ${plan.featured ? "text-[#8FC1F5]" : "text-primary"}`}>
          {plan.price}
          {plan.note && "*"}
        </span>
      </div>
      <span className={`mb-5 block text-[12.5px] ${plan.featured ? "text-white/70" : "text-body-text"}`}>
        {plan.unit}
      </span>
      <p className={`mb-4 text-[13px] leading-relaxed ${plan.featured ? "text-white/70" : "text-body-text"}`}>
        {plan.desc}
      </p>
      <ul className="mb-6 flex-1 space-y-2.5">
        {plan.features.map((f) => (
          <li
            key={f}
            className={`flex items-start gap-2 text-[13.5px] ${plan.featured ? "text-white/80" : "text-body-text"}`}
          >
            <CheckCircleIcon className={`mt-0.5 h-4 w-4 shrink-0 ${plan.featured ? "text-[#8FC1F5]" : "text-primary"}`} />
            {f}
          </li>
        ))}
      </ul>
      <Button href="#lead" variant={plan.featured ? "primary" : "ghost"} className="w-full">
        Chọn gói này
      </Button>
    </div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="bg-bg-tint py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Bảng giá"
          title="Mức giá minh bạch, phù hợp mọi quy mô"
          description="Không phát sinh chi phí ẩn — chọn gói phù hợp với giai đoạn phát triển hiện tại của bạn, từ văn phòng, thành lập doanh nghiệp đến kế toán thuế."
        />
        <div className="space-y-14">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="mb-6 text-[17px] font-bold text-navy">{group.title}</h3>
              <RevealGroup className={`grid grid-cols-1 gap-6 ${group.cols}`}>
                {group.plans.map((plan) => (
                  <RevealItem key={plan.name} className="h-full">
                    <PricingCard plan={plan} />
                  </RevealItem>
                ))}
              </RevealGroup>
              {group.footnote && (
                <p className="mt-5 text-[12.5px] text-body-text">{group.footnote}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
