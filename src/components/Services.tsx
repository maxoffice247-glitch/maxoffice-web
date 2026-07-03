import Image from "next/image";
import SectionHead from "./SectionHead";
import { RevealGroup, RevealItem } from "./Reveal";
import Button from "./Button";
import { ArrowRightSmallIcon } from "./icons";

type ServiceItem = {
  slug: string;
  image: string;
  title: string;
  price: string;
  desc: string;
  featured?: boolean;
  note?: string;
};

const SERVICES: ServiceItem[] = [
  {
    slug: "van-phong-ao",
    image: "/images/van-phong-ao.png",
    title: "Văn phòng ảo",
    price: "Từ 299.000đ/tháng",
    desc: "Địa chỉ đăng ký kinh doanh hợp lệ, lễ tân chuyên nghiệp, nhận thư hộ — không cần thuê mặt bằng vật lý.",
  },
  {
    slug: "van-phong-tron-goi",
    image: "/images/van-phong-tron-goi.png",
    title: "Văn phòng trọn gói",
    price: "Từ 4.500.000đ/tháng",
    desc: "Không gian riêng, sẵn sàng làm việc ngay với đầy đủ nội thất, internet và tiện ích văn phòng.",
    featured: true,
  },
  {
    slug: "phong-hop",
    image: "/images/phong-hop.png",
    title: "Phòng họp theo giờ",
    price: "Từ 150.000đ/giờ",
    desc: "Phòng họp trang bị màn hình, âm thanh hiện đại — đặt lịch linh hoạt theo nhu cầu sử dụng.",
  },
  {
    slug: "cho-ngoi-linh-dong",
    image: "/images/coworking.png",
    title: "Chỗ ngồi linh động",
    price: "Từ 2.000.000đ/tháng",
    desc: "Không gian coworking năng động, phù hợp cho freelancer và đội nhóm nhỏ 1-3 người.",
  },
  {
    slug: "thanh-lap-doanh-nghiep",
    image: "/images/thanh-lap-doanh-nghiep.png",
    title: "Thành lập doanh nghiệp",
    price: "Từ 800.000đ*",
    desc: "Tư vấn loại hình phù hợp — Hộ kinh doanh, Công ty TNHH hay Công ty Cổ phần — soạn hồ sơ và hoàn tất thủ tục đúng luật.",
    note: "*Áp dụng khi đăng ký kèm Văn phòng ảo tại MAX OFFICE.",
  },
  {
    slug: "ke-toan-thue",
    image: "/images/ke-toan-thue.png",
    title: "Kế toán & thuế",
    price: "Từ 800.000đ/tháng",
    desc: "Kê khai thuế đúng hạn, sổ sách minh bạch, báo cáo rõ ràng mỗi tháng — an tâm vận hành, tập trung phát triển kinh doanh.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-bg-tint py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Dịch vụ"
          title="Giải pháp cho từng giai đoạn phát triển"
          description="Từ văn phòng, thành lập doanh nghiệp đến kế toán thuế — chọn đúng dịch vụ cho nhu cầu hiện tại, sẵn sàng mở rộng khi doanh nghiệp bạn tăng trưởng."
        />
        <RevealGroup className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((svc) => (
            <RevealItem key={svc.title} className="h-full">
              <div
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-400 ease-out hover:-translate-y-2 hover:shadow-card ${
                  svc.featured ? "border-2 border-accent" : "border-line"
                }`}
              >
                {svc.featured && (
                  <span className="absolute top-4 left-4 z-10 rounded-full bg-accent px-3 py-1.5 text-[11.5px] font-bold tracking-wide text-white shadow-[0_6px_16px_rgba(229,57,53,0.35)]">
                    Phổ biến nhất
                  </span>
                )}
                <div className="relative h-[230px] w-full overflow-hidden sm:h-[210px] lg:h-[230px]">
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(11,19,35,0.4)]" />
                  <div className="absolute bottom-3 left-4 font-mono text-[13.5px] font-bold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                    {svc.price}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="mb-2.5 text-[19.5px] font-bold text-navy">
                    {svc.title}
                  </h3>
                  <p className="mb-5 flex-1 text-[14.5px] leading-relaxed text-body-text">
                    {svc.desc}
                  </p>
                  {svc.note && (
                    <p className="-mt-3 mb-4 text-[11.5px] text-body-text/70">{svc.note}</p>
                  )}
                  <Button
                    href={`/services/${svc.slug}`}
                    variant="link"
                    icon={<ArrowRightSmallIcon />}
                    className="group-hover:gap-2.5"
                  >
                    Xem thêm
                  </Button>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
