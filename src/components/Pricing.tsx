import Link from "next/link";
import SectionHead from "./SectionHead";
import { RevealGroup, RevealItem } from "./Reveal";
import Button from "./Button";
import LeadFormButton from "./LeadFormButton";
import { CheckCircleIcon, SearchIcon, ArrowRightSmallIcon } from "./icons";
import {
  VO_PROMO_NOTES,
  VO_PROMO_EFFECTIVE_DATE,
  VO_LONG_TERM_COMBO_NAME,
  VO_LONG_TERM_COMBO_DESC,
  getLocationsForPlan,
  type VirtualOfficePlanKey,
} from "@/lib/virtualOfficePlans";

type Plan = {
  name: string;
  price: string;
  unit: string;
  desc: string;
  features: string[];
  featured?: boolean;
  note?: boolean;
  /** Exact label in the lead form's "Dịch vụ quan tâm" dropdown to pre-select when "Chọn gói này" is clicked. */
  service: string;
  /** Link to the full service detail page for "Xem chi tiết". */
  detailHref: string;
  /** Key trong VIRTUAL_OFFICE_PLANS (hệ LITE-RISE dùng chung 12 chi nhánh)
      — CHỈ set cho 6 gói Văn phòng ảo, để tính số chi nhánh áp dụng qua
      getLocationsForPlan() (dữ liệu có sẵn, không hardcode). Các nhóm gói
      khác (Trọn gói, Thành lập DN, Kế toán) không có khái niệm "chi nhánh
      áp dụng" theo nghĩa này nên không set field này. */
  vpaKey?: VirtualOfficePlanKey;
};

const GROUPS: {
  title: string;
  plans: Plan[];
  cols: string;
  footnote?: string;
  promoNotes?: string[];
  promoEffectiveDate?: string;
  promoComboName?: string;
  promoComboDesc?: string;
}[] = [
  {
    title: "Văn phòng ảo — 6 gói dịch vụ",
    cols: "sm:grid-cols-2 lg:grid-cols-3",
    footnote:
      "*Gói và mức giá cụ thể tuỳ theo chi nhánh — xem chi tiết từng chi nhánh tại trang Văn phòng ảo.",
    promoNotes: VO_PROMO_NOTES,
    promoEffectiveDate: VO_PROMO_EFFECTIVE_DATE,
    promoComboName: VO_LONG_TERM_COMBO_NAME,
    promoComboDesc: VO_LONG_TERM_COMBO_DESC,
    plans: [
      {
        name: "LITE",
        service: "Văn phòng ảo",
        price: "299.000đ",
        unit: "/ tháng",
        desc: "Cạnh tranh nhất — bảng hiệu 500K tính riêng, thu 1 lần duy nhất.",
        features: ["Địa chỉ đăng ký kinh doanh", "Lễ tân, Wifi", "Tham gia Workshop"],
        note: true,
        detailHref: "/van-phong-ao-gia-re",
        vpaKey: "lite",
      },
      {
        name: "START",
        service: "Văn phòng ảo",
        price: "350.000đ",
        unit: "/ tháng",
        desc: "Đầy đủ nhận diện cơ bản cho doanh nghiệp mới.",
        features: ["Bảng tên Mica & bảng hiệu công ty", "Lễ tân, Wifi", "Tham gia Workshop"],
        detailHref: "/services/van-phong-ao#bang-gia",
        vpaKey: "start",
      },
      {
        name: "BASE",
        service: "Văn phòng ảo",
        price: "500.000đ",
        unit: "/ tháng",
        desc: "Thêm tư vấn pháp lý & thuế cùng không gian tiếp khách.",
        features: ["Tất cả mục của START", "Guest Lounge, In-photo 100 tờ/năm", "Tư vấn Pháp lý & Thuế, AI Biz Health"],
        featured: true,
        detailHref: "/services/van-phong-ao#bang-gia",
        vpaKey: "base",
      },
      {
        name: "ORIGIN",
        service: "Văn phòng ảo",
        price: "595.000đ",
        unit: "/ tháng",
        desc: "Thêm tư vấn tự động hoá AI và hỗ trợ ưu tiên.",
        features: ["Tất cả mục của BASE", "Miễn phí tư vấn tự động hoá AI", "Ưu tiên hỗ trợ 24/7"],
        detailHref: "/services/van-phong-ao#bang-gia",
        vpaKey: "origin",
      },
      {
        name: "ORIGIN+",
        service: "Văn phòng ảo",
        price: "699.000đ",
        unit: "/ tháng",
        desc: "Có phòng họp nhỏ đi kèm hàng năm.",
        features: ["Tất cả mục của ORIGIN", "Phòng họp nhỏ 24h/năm", "Ưu tiên hỗ trợ 24/7"],
        detailHref: "/services/van-phong-ao#bang-gia",
        vpaKey: "origin-plus",
      },
      {
        name: "RISE",
        service: "Văn phòng ảo",
        price: "1.199.000đ",
        unit: "/ tháng",
        desc: "Cao cấp nhất — phòng họp lớn, chỗ ngồi linh hoạt hàng tháng.",
        features: ["Tất cả mục của ORIGIN+", "Phòng họp lớn 4h/năm, Flex Desk 4h/tháng", "Giảm 50% phí phòng họp VIP"],
        detailHref: "/services/van-phong-ao#bang-gia",
        vpaKey: "rise",
      },
    ],
  },
  {
    title: "Văn phòng & Coworking khác",
    cols: "sm:grid-cols-2 lg:grid-cols-3",
    plans: [
      {
        name: "Văn phòng trọn gói",
        service: "Văn phòng trọn gói",
        price: "4.500.000đ",
        unit: "/ tháng",
        desc: "Không gian riêng, sẵn sàng làm việc ngay với đầy đủ tiện ích.",
        features: ["Nội thất & internet tốc độ cao", "Lễ tân & bảo vệ 24/7", "Phòng họp dùng chung"],
        featured: true,
        detailHref: "/services/van-phong-tron-goi#bang-gia",
      },
      {
        name: "Chỗ ngồi linh động",
        service: "Chỗ ngồi linh động",
        price: "2.000.000đ",
        unit: "/ tháng",
        desc: "Không gian coworking năng động cho freelancer & nhóm nhỏ.",
        features: ["Chỗ ngồi tự do", "Wifi tốc độ cao", "Trà, cà phê miễn phí"],
        detailHref: "/services/cho-ngoi-linh-dong#bang-gia",
      },
      {
        name: "Phòng họp theo giờ",
        service: "Phòng họp theo giờ",
        price: "150.000đ",
        unit: "/ giờ",
        desc: "Đặt lịch linh hoạt, trang bị đầy đủ thiết bị trình chiếu & âm thanh.",
        features: ["Màn hình trình chiếu", "Đặt lịch theo giờ", "Âm thanh hiện đại"],
        detailHref: "/services/phong-hop#bang-gia",
      },
    ],
  },
  {
    title: "Thành lập doanh nghiệp",
    cols: "sm:grid-cols-2 lg:grid-cols-3",
    footnote:
      "*Giá Gói 1 áp dụng khi đăng ký kèm Văn phòng ảo tại MAX OFFICE (giá thường: 1.500.000đ). Áp dụng chung cho mọi loại hình doanh nghiệp — Hộ kinh doanh, Công ty TNHH, Công ty Cổ phần. Còn nhiều dịch vụ sửa đổi khác (thay đổi tên công ty, đại diện pháp luật, tăng vốn điều lệ, bổ sung ngành nghề...) — xem đầy đủ tại trang Thành lập doanh nghiệp.",
    plans: [
      {
        name: "Gói 1 — Cơ bản",
        service: "Thành lập doanh nghiệp",
        price: "1.299.000đ",
        unit: "trọn gói · 5-7 ngày",
        desc: "Giấy phép, con dấu, đăng bố cáo và mở tài khoản ngân hàng.",
        features: ["Giấy chứng nhận đăng ký doanh nghiệp", "Con dấu công ty", "Đăng bố cáo & mở tài khoản ngân hàng"],
        note: true,
        detailHref: "/services/thanh-lap-doanh-nghiep#bang-gia",
      },
      {
        name: "Gói 2 — Đầy đủ",
        service: "Thành lập doanh nghiệp",
        price: "2.800.000đ",
        unit: "trọn gói · 5-7 ngày",
        desc: "Tất cả hạng mục Gói 1, cộng khai thuế ban đầu, chữ ký số và hoá đơn điện tử.",
        features: ["Tất cả hạng mục Gói 1", "Hồ sơ khai thuế ban đầu", "Chữ ký số & hoá đơn điện tử 100 số"],
        featured: true,
        detailHref: "/services/thanh-lap-doanh-nghiep#bang-gia",
      },
      {
        name: "Thay đổi địa chỉ trụ sở",
        service: "Thành lập doanh nghiệp",
        price: "Từ 700.000đ",
        unit: "trọn gói · 5-7 ngày",
        desc: "Cập nhật địa chỉ trụ sở mới, áp dụng cho cả trường hợp cùng và khác cơ quan thuế quản lý.",
        features: ["Soạn & nộp hồ sơ thay đổi", "Nhận Giấy chứng nhận cập nhật", "Hỗ trợ thủ tục liên quan cơ quan thuế"],
        detailHref: "/services/thanh-lap-doanh-nghiep#dich-vu-phap-ly-sua-doi",
      },
    ],
  },
  {
    title: "Kế toán & Thuế",
    cols: "sm:grid-cols-2 lg:grid-cols-3",
    footnote:
      "*Từ 500.000đ/tháng là mức thấp nhất, áp dụng khi chưa phát sinh hoá đơn. Chi phí cụ thể tính theo số hoá đơn/quý và loại hình kinh doanh, áp dụng chung cho cả 3 nhóm loại hình — xem bảng giá chi tiết đầy đủ tại trang Kế toán & Thuế.",
    plans: [
      {
        name: "Kế toán & Thuế trọn gói",
        service: "Kế toán & thuế",
        price: "500.000đ",
        unit: "/ tháng",
        desc: "Tính theo số hoá đơn/quý và loại hình kinh doanh — xem bảng giá chi tiết đầy đủ 3 nhóm loại hình.",
        features: ["Kê khai thuế định kỳ", "Sổ sách kế toán minh bạch", "Báo cáo tài chính, hỗ trợ giải trình"],
        featured: true,
        note: true,
        detailHref: "/services/ke-toan-thue#bang-gia",
      },
      {
        name: "Báo cáo tài chính",
        service: "Kế toán & thuế",
        price: "Từ 800.000đ",
        unit: "/ năm",
        desc: "Lập báo cáo tài chính cuối năm, mức phí theo doanh thu phát sinh trong năm.",
        features: ["Không phát sinh: 800.000đ/năm", "Doanh thu dưới 3 tỷ: 1.500.000đ/năm", "Doanh thu trên 3 tỷ: 2.000.000đ/năm"],
        detailHref: "/services/ke-toan-thue#phi-phat-sinh-them",
      },
      {
        name: "Xuất hoá đơn hộ",
        service: "Kế toán & thuế",
        price: "Từ 500.000đ",
        unit: "/ tháng",
        desc: "Hỗ trợ xuất hoá đơn điện tử hộ doanh nghiệp, mức phí theo số lượng hoá đơn mỗi tháng.",
        features: ["1-30 hoá đơn: 500.000đ/tháng", "31-60 hoá đơn: 800.000đ/tháng", "61-100 hoá đơn: 1.000.000đ/tháng"],
        detailHref: "/services/ke-toan-thue#phi-phat-sinh-them",
      },
    ],
  },
];

function PricingCard({ plan }: { plan: Plan }) {
  // Lấy động qua getLocationsForPlan() (LOCATION_VO_PLANS) — không hardcode
  // — cùng nguồn dữ liệu + cùng công thức đếm mà GroupCard (chế độ "Xem
  // theo gói" ở /tien-ich/tim-goi-phu-hop) đang dùng.
  const branchCount = plan.vpaKey ? getLocationsForPlan(plan.vpaKey).length : undefined;

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
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <div className={`text-[15.5px] font-bold ${plan.featured ? "text-white" : "text-navy"}`}>
          {plan.name}
        </div>
        {branchCount !== undefined && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${
              plan.featured ? "bg-white/15 text-[#8FC1F5]" : "bg-primary-tint text-primary"
            }`}
          >
            {branchCount} chi nhánh
          </span>
        )}
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
      <div className="flex gap-2">
        <LeadFormButton
          service={plan.service}
          variant="primary"
          size="sm"
          className="min-w-0 flex-1 !whitespace-normal !px-3 text-center"
        >
          Chọn gói này
        </LeadFormButton>
        <Button
          href={plan.detailHref}
          variant={plan.featured ? "outline" : "ghost"}
          size="sm"
          className="min-w-0 flex-1 !whitespace-normal !px-3 text-center"
        >
          Xem chi tiết
        </Button>
      </div>
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
              {group.promoNotes && group.promoNotes.length > 0 && (
                <div className="mx-auto mt-6 max-w-[640px] rounded-2xl border-2 border-accent/25 bg-accent/5 p-5">
                  {group.promoComboName && (
                    <div className="mb-4 border-b border-accent/20 pb-4">
                      <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 text-[11.5px] font-bold tracking-wide text-white">
                        🚀 {group.promoComboName}
                      </span>
                      {group.promoComboDesc && (
                        <p className="text-[13px] leading-relaxed text-navy">{group.promoComboDesc}</p>
                      )}
                    </div>
                  )}
                  <p className="mb-2 text-[13.5px] font-bold text-navy">Khuyến mãi chung (áp dụng mọi gói)</p>
                  <ul className="space-y-1.5">
                    {group.promoNotes.map((note) => (
                      <li key={note} className="flex items-start gap-2 text-[13px] text-body-text">
                        <CheckCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                        {note}
                      </li>
                    ))}
                  </ul>
                  {group.promoEffectiveDate && (
                    <p className="mt-3 text-[11.5px] text-body-text">
                      Áp dụng từ {group.promoEffectiveDate}.
                    </p>
                  )}
                </div>
              )}
              {/* CTA dẫn sang VPA finder — chỉ đặt sau nhóm Văn phòng ảo vì
                  đây là nhóm có tình trạng "trùng giá khác nhóm chi nhánh"
                  (VD SAVE 379K và SILVER 379K) mà 6 gói tiêu biểu ở đây
                  KHÔNG thể hiện hết — 6-8 gói này chủ đích giữ gọn, không mở
                  rộng đủ 15+ gói, nên cần lối tắt rõ ràng sang công cụ tra
                  đúng gói theo khu vực thay vì đoán từ bảng giá rút gọn. */}
              {group.title === "Văn phòng ảo — 6 gói dịch vụ" && (
                <Link
                  href="/tien-ich/tim-goi-phu-hop"
                  className="group mt-8 flex flex-wrap items-center gap-5 rounded-2xl bg-gradient-to-br from-navy to-primary-dark p-7 text-white transition-transform duration-300 ease-out hover:-translate-y-1 sm:flex-nowrap"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
                    <SearchIcon className="h-7 w-7" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="mb-1.5 inline-block rounded-full bg-accent px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
                      Công cụ miễn phí
                    </span>
                    <h3 className="text-[18px] font-bold">
                      Muốn biết chính xác gói nào áp dụng cho khu vực bạn quan tâm?
                    </h3>
                    <p className="mt-1 text-[13.5px] text-white/75">
                      6 gói trên là bảng giá tiêu biểu — một số khu vực còn có gói cùng mức giá
                      nhưng khác tên/tính năng (VD: SAVE và SILVER cùng 379.000đ nhưng áp dụng 2
                      nhóm chi nhánh khác nhau). Dùng công cụ Tìm VPA theo nhu cầu để xem đúng gói
                      theo khu vực bạn chọn.
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-bold text-navy transition-transform duration-200 group-hover:translate-x-1">
                    Tìm VPA theo nhu cầu
                    <ArrowRightSmallIcon />
                  </span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
