import type { ComponentType } from "react";
import {
  BuildingIcon,
  KeyIcon,
  ScreenIcon,
  UsersIcon,
  DocumentCheckIcon,
  CalculatorIcon,
  ShieldCheckIcon,
  ClockIcon,
  TagIcon,
  WifiIcon,
  CoffeeIcon,
  HeadsetIcon,
  BadgePercentIcon,
  ZapIcon,
} from "@/components/icons";
import type { BenefitItem } from "@/components/ServiceBenefits";
import type { FeatureItem } from "@/components/ServiceFeatures";
import type { ServicePricing } from "@/components/ServicePricingTable";
import type { ComparisonRow } from "@/components/ServiceComparison";
import type { Testimonial } from "@/components/Testimonials";
import type { FaqItem } from "@/components/Faq";
import { LOCATIONS_LIST } from "@/lib/locationsData";
import {
  VIRTUAL_OFFICE_PLANS,
  VIRTUAL_OFFICE_PLAN_ORDER,
  VO_FEATURE_MATRIX,
  VO_PROMO_NOTES,
  VO_PROMO_EFFECTIVE_DATE,
  getLocationsForPlan,
} from "@/lib/virtualOfficePlans";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function locationNames(slugs: string[]): string[] {
  return slugs.map((slug) => LOCATIONS_LIST.find((l) => l.slug === slug)?.name.split(",")[0] ?? slug);
}

const VO_MATRIX_PRICING: ServicePricing = {
  mode: "matrix",
  plans: VIRTUAL_OFFICE_PLAN_ORDER.map((key) => {
    const plan = VIRTUAL_OFFICE_PLANS[key];
    return {
      key: plan.key,
      name: plan.name,
      price: formatVND(plan.price),
      unit: plan.duration,
      locations: locationNames(getLocationsForPlan(key)),
      featured: key === "base",
    };
  }),
  features: VO_FEATURE_MATRIX.map((row) => ({
    label: row.label,
    values: VIRTUAL_OFFICE_PLAN_ORDER.map((key) => row.values[key]),
  })),
  addonNote:
    "Gói LITE chưa bao gồm Bảng hiệu công ty — phụ phí 500.000đ nếu cần, tính riêng 1 lần.",
  promoNotes: VO_PROMO_NOTES,
  promoEffectiveDate: VO_PROMO_EFFECTIVE_DATE,
};

export type ServiceListItem = {
  slug: string;
  name: string;
  shortDesc: string;
  icon: ComponentType<{ className?: string }>;
  image: string;
};

export const SERVICES_LIST: ServiceListItem[] = [
  {
    slug: "van-phong-ao",
    name: "Văn phòng ảo",
    shortDesc: "Địa chỉ đăng ký kinh doanh hợp lệ",
    icon: BuildingIcon,
    image: "/images/van-phong-ao.jpg",
  },
  {
    slug: "van-phong-tron-goi",
    name: "Văn phòng trọn gói",
    shortDesc: "Sẵn sàng làm việc ngay",
    icon: KeyIcon,
    image: "/images/van-phong-tron-goi.jpg",
  },
  {
    slug: "phong-hop",
    name: "Phòng họp theo giờ",
    shortDesc: "Thiết bị hiện đại, đặt lịch linh hoạt",
    icon: ScreenIcon,
    image: "/images/phong-hop.jpg",
  },
  {
    slug: "cho-ngoi-linh-dong",
    name: "Chỗ ngồi linh động",
    shortDesc: "Coworking năng động",
    icon: UsersIcon,
    image: "/images/coworking.jpg",
  },
  {
    slug: "thanh-lap-doanh-nghiep",
    name: "Thành lập doanh nghiệp",
    shortDesc: "Nhanh chóng, đúng pháp lý",
    icon: DocumentCheckIcon,
    image: "/images/thanh-lap-doanh-nghiep.jpg",
  },
  {
    slug: "ke-toan-thue",
    name: "Kế toán & thuế",
    shortDesc: "Đúng hạn, đúng luật",
    icon: CalculatorIcon,
    image: "/images/ke-toan-thue.jpg",
  },
];

export type ProcessStep = { num: string; title: string; desc: string };

export type InlineImage = {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  /** CSS object-position — only needed when the default "center" crop cuts off something important. */
  objectPosition?: string;
  /** Overrides the shared 16:10 intro box for images whose real proportions differ a lot. */
  aspectRatio?: string;
  /** Caps the box width when using a custom aspectRatio, so the row doesn't grow too tall. */
  maxWidth?: string;
};

export type ServiceData = {
  slug: string;
  name: string;
  heroTitle: string;
  heroDescription: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  /** Ảnh 2 cột cạnh đoạn giới thiệu đầu trang — dùng fit "contain" cho ảnh infographic có chữ ở mọi góc. */
  introImage?: InlineImage;
  benefitsTitle: string;
  benefits: BenefitItem[];
  featuresTitle: string;
  featuresDescription: string;
  features: FeatureItem[];
  /** Overrides the generic hero photo ServiceFeatures falls back to, when a more specific illustrative shot exists. */
  featuresImage?: { src: string; alt: string };
  pricingTitle: string;
  pricingDescription: string;
  pricing: ServicePricing;
  /** Ảnh 2 cột cạnh bảng giá — chỉ áp dụng khi pricing.mode === "single". */
  pricingImage?: InlineImage;
  process: ProcessStep[];
  faqs: FaqItem[];
  testimonials: Testimonial[];
  comparisonTitle: string;
  comparisonAlternative: string;
  comparison: ComparisonRow[];
};

export const SERVICES_DATA: Record<string, ServiceData> = {
  "van-phong-ao": {
    slug: "van-phong-ao",
    name: "Văn phòng ảo",
    heroTitle: "Văn Phòng Ảo TP.HCM",
    heroDescription:
      "Sở hữu địa chỉ đăng ký kinh doanh hợp lệ tại trung tâm TP.HCM chỉ từ 299.000đ/tháng — 6 gói dịch vụ linh hoạt, không cần thuê mặt bằng, không cần đặt cọc lớn.",
    image: "/images/van-phong-ao.jpg",
    metaTitle: "Văn Phòng Ảo TP.HCM Từ 299.000đ/Tháng | MAX OFFICE",
    metaDescription:
      "Thuê văn phòng ảo TP.HCM giá từ 299.000đ/tháng. 6 gói dịch vụ: Gói LITE, START, BASE, ORIGIN, ORIGIN+, RISE. Địa chỉ pháp lý hợp lệ, 12 chi nhánh. Tư vấn miễn phí.",
    intro: [
      "Văn phòng ảo là giải pháp giúp doanh nghiệp và cá nhân kinh doanh sở hữu một địa chỉ đăng ký kinh doanh hợp pháp tại các quận trung tâm TP.HCM mà không cần thuê hay sở hữu văn phòng vật lý. Đây là lựa chọn phổ biến của các startup, công ty mới thành lập, freelancer và doanh nghiệp online muốn tối ưu chi phí vận hành trong giai đoạn đầu.",
      "Tại MAX OFFICE, dịch vụ văn phòng ảo được chia thành 6 gói — Gói LITE, START, BASE, ORIGIN, ORIGIN+ và RISE — mỗi gói bổ sung thêm quyền lợi từ lễ tân, wifi, tư vấn pháp lý & thuế đến phòng họp và chỗ ngồi linh hoạt. Không phải chi nhánh nào cũng cung cấp đủ cả 6 gói, vì vậy gói và mức giá cụ thể sẽ tuỳ theo chi nhánh bạn chọn. Với mức giá từ 299.000đ/tháng, đây là một trong những giải pháp tiết kiệm chi phí nhất để bắt đầu kinh doanh đúng pháp lý ngay từ ngày đầu.",
      "Khác với việc tự thuê văn phòng truyền thống — vốn đòi hỏi đặt cọc nhiều tháng, ký hợp đồng dài hạn và chi phí vận hành cố định — văn phòng ảo tại MAX OFFICE cho phép bạn linh hoạt mở rộng hoặc thu hẹp quy mô mà không bị ràng buộc, đồng thời vẫn đảm bảo đầy đủ tính pháp lý để đăng ký kinh doanh, đăng ký thuế và giao dịch với đối tác.",
    ],
    introImage: {
      src: "/images/dich-vu-van-phong-ao-anh-1.jpg",
      alt: "Infographic dịch vụ văn phòng ảo MAX OFFICE",
      fit: "contain",
    },
    benefitsTitle: "Vì sao nên chọn văn phòng ảo MAX OFFICE",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ pháp lý hợp lệ", desc: "Đủ điều kiện đăng ký kinh doanh, đăng ký thuế tại 12 địa điểm trung tâm TP.HCM." },
      { icon: TagIcon, title: "Tiết kiệm chi phí", desc: "Chỉ từ 299.000đ/tháng, 6 gói dịch vụ để chọn theo đúng nhu cầu." },
      { icon: ClockIcon, title: "Không ràng buộc dài hạn", desc: "Hợp đồng linh hoạt theo tháng hoặc theo năm, dễ điều chỉnh khi doanh nghiệp phát triển." },
      { icon: HeadsetIcon, title: "Lễ tân chuyên nghiệp", desc: "Đại diện tiếp nhận thư từ, cuộc gọi và khách đến liên hệ khi cần." },
      { icon: KeyIcon, title: "Nâng cấp linh hoạt", desc: "Dễ dàng thuê thêm phòng họp hoặc chuyển sang văn phòng trọn gói khi mở rộng." },
      { icon: BadgePercentIcon, title: "Xử lý nhanh chóng", desc: "Hồ sơ địa chỉ sẵn sàng sử dụng ngay để đăng ký kinh doanh trong ngày." },
    ],
    featuresTitle: "Dịch vụ văn phòng ảo bao gồm những gì?",
    featuresDescription:
      "Mọi gói văn phòng ảo tại MAX OFFICE đều được thiết kế để đáp ứng đầy đủ nhu cầu pháp lý và vận hành của doanh nghiệp mới.",
    features: [
      { title: "Địa chỉ đăng ký kinh doanh", desc: "Tại 12 vị trí trung tâm TP.HCM: Tân Bình, Gò Vấp, Tân Phú, Quận 10, Quận 1." },
      { title: "Nhận thư hộ", desc: "Thông báo thư từ, bưu phẩm qua Zalo/email trong ngày làm việc." },
      { title: "Hỗ trợ tiếp khách", desc: "Đại diện ký nhận hàng, tiếp khách khi cần thiết." },
      { title: "Bảng hiệu công ty", desc: "Bao gồm từ gói START trở lên; Gói LITE có thể thêm với phụ phí 500.000đ (1 lần)." },
      { title: "Ưu đãi combo", desc: "Giảm giá khi đăng ký kèm dịch vụ thành lập doanh nghiệp." },
      { title: "Hỗ trợ xác minh địa chỉ", desc: "Cung cấp hồ sơ chứng minh địa chỉ khi cơ quan thuế yêu cầu." },
    ],
    featuresImage: {
      src: "/images/dich-vu-van-phong-ao-bang-ten.jpg",
      alt: "Bảng tên các công ty khách hàng đăng ký địa chỉ văn phòng ảo tại MAX OFFICE",
    },
    pricingTitle: "Bảng giá văn phòng ảo",
    pricingDescription: "6 gói dịch vụ, từ 299.000đ/tháng — gói và mức giá cụ thể tuỳ theo chi nhánh.",
    pricing: VO_MATRIX_PRICING,
    process: [
      { num: "01", title: "Liên hệ tư vấn", desc: "Chia sẻ nhu cầu, chọn địa điểm phù hợp trong 12 chi nhánh." },
      { num: "02", title: "Ký hợp đồng", desc: "Hoàn tất hợp đồng dịch vụ văn phòng ảo, nhận hồ sơ địa chỉ." },
      { num: "03", title: "Đăng ký kinh doanh", desc: "Sử dụng địa chỉ để hoàn tất thủ tục đăng ký kinh doanh, đăng ký thuế." },
      { num: "04", title: "Bắt đầu sử dụng", desc: "Nhận thư từ, hỗ trợ lễ tân ngay khi có nhu cầu." },
    ],
    faqs: [
      { q: "Văn phòng ảo có hợp pháp để đăng ký kinh doanh không?", a: "Có. Địa chỉ văn phòng ảo tại MAX OFFICE hoàn toàn hợp lệ để đăng ký kinh doanh, đăng ký thuế và thực hiện các thủ tục pháp lý liên quan theo quy định hiện hành." },
      { q: "Tôi có thể dùng địa chỉ văn phòng ảo để xuất hoá đơn không?", a: "Có. Bạn có thể sử dụng địa chỉ đăng ký tại MAX OFFICE để xuất hoá đơn giá trị gia tăng và các chứng từ kế toán khác." },
      { q: "Cơ quan thuế có đến kiểm tra địa chỉ này không?", a: "Có thể. MAX OFFICE hỗ trợ đầy đủ hồ sơ chứng minh địa chỉ, hợp đồng thuê và phối hợp xác minh khi cơ quan thuế yêu cầu." },
      { q: "Thư từ, bưu phẩm gửi đến sẽ được xử lý thế nào?", a: "Đội ngũ lễ tân sẽ nhận thư, bưu phẩm và thông báo cho bạn qua Zalo hoặc email trong ngày làm việc." },
      { q: "Tôi có thể đổi địa chỉ chi nhánh trong quá trình sử dụng không?", a: "Có thể. Nếu chuyển đổi giữa các chi nhánh của MAX OFFICE, số tháng còn lại chưa sử dụng hết tại địa chỉ cũ sẽ được BẢO LƯU và tiếp tục sử dụng tại địa chỉ mới, không mất phí. Việc đổi địa chỉ đăng ký kinh doanh cần thực hiện thủ tục thay đổi với cơ quan đăng ký kinh doanh — đội ngũ MAX OFFICE sẽ tư vấn và hỗ trợ hồ sơ." },
      { q: "Hợp đồng văn phòng ảo tối thiểu bao lâu?", a: "Hợp đồng văn phòng ảo tối thiểu 6 tháng. Sau mốc 6 tháng, khách hàng có thể lựa chọn thời hạn 12, 24 hoặc 36 tháng tuỳ nhu cầu — thời hạn càng dài, ưu đãi càng nhiều (xem chi tiết tại mục Khuyến mãi)." },
      { q: "Văn phòng ảo có phù hợp với công ty nước ngoài không?", a: "Phù hợp với văn phòng đại diện hoặc công ty có vốn đầu tư nước ngoài đã hoàn tất thủ tục đầu tư. Ngoài ra, MAX OFFICE còn hỗ trợ tư vấn và thực hiện thủ tục xin giấy phép kinh doanh, giấy phép đầu tư, cũng như mở văn phòng đại diện cho công ty FDI hoặc doanh nghiệp có vốn nước ngoài — liên hệ đội ngũ để được tư vấn cụ thể theo loại hình doanh nghiệp của bạn." },
      { q: "Tôi có được sử dụng phòng họp khi cần gặp khách hàng không?", a: "Tuỳ theo gói văn phòng ảo bạn chọn: một số gói (ORIGIN+, RISE) đã BAO GỒM SẴN thời gian sử dụng phòng họp miễn phí trong bảng giá (xem chi tiết tại bảng ma trận tính năng phía trên). Với các gói không bao gồm sẵn, khách hàng vẫn được ưu đãi giá khi đặt phòng họp theo giờ tại bất kỳ chi nhánh nào của MAX OFFICE." },
      { q: "Vì sao có 6 gói văn phòng ảo với giá khác nhau?", a: "Mỗi gói (Gói LITE, START, BASE, ORIGIN, ORIGIN+, RISE) bổ sung thêm quyền lợi — từ bảng hiệu, tư vấn pháp lý & thuế đến phòng họp và chỗ ngồi linh hoạt. Không phải chi nhánh nào cũng có đủ 6 gói, MAX OFFICE sẽ tư vấn gói phù hợp nhất theo chi nhánh bạn chọn." },
      { q: "Chi phí văn phòng ảo đã bao gồm phí gì?", a: "Tuỳ theo gói: Gói LITE gồm địa chỉ đăng ký kinh doanh, lễ tân, wifi và workshop (chưa gồm bảng hiệu — phụ phí 500.000đ nếu cần); từ gói START trở lên đã bao gồm bảng hiệu và các quyền lợi cao hơn. Giá thuê chưa bao gồm VAT 10%." },
      { q: "Làm sao để bắt đầu sử dụng dịch vụ văn phòng ảo?", a: "Bạn chỉ cần liên hệ đội ngũ tư vấn, chọn chi nhánh phù hợp và ký hợp đồng — địa chỉ sẽ sẵn sàng sử dụng ngay trong ngày." },
      { q: "Nếu tôi ngừng sử dụng dịch vụ, địa chỉ đăng ký kinh doanh có bị ảnh hưởng không?", a: "Bạn cần thực hiện thủ tục thay đổi địa chỉ đăng ký kinh doanh trước khi ngừng hợp đồng để tránh gián đoạn hoạt động — đội ngũ MAX OFFICE sẽ hỗ trợ hướng dẫn quy trình này." },
    ],
    testimonials: [
      { quote: "MAX OFFICE giúp công ty mình có địa chỉ kinh doanh tại Quận 1 chỉ trong vài ngày, thủ tục rõ ràng và đội ngũ hỗ trợ rất nhiệt tình.", initial: "H", name: "Thanh Hà", role: "Giám đốc, ABC Logistics" },
      { quote: "Chỉ mất một buổi sáng để hoàn tất thủ tục, chi phí lại thấp hơn nhiều so với thuê văn phòng truyền thống — rất phù hợp cho công ty mới như mình.", initial: "L", name: "Ngọc Lan", role: "Founder, Lan's Beauty Store" },
      { quote: "Mình dùng văn phòng ảo cho công ty tư vấn độc lập, không cần văn phòng thật nhưng vẫn có địa chỉ chuyên nghiệp để giao dịch với khách hàng.", initial: "K", name: "Đức Khoa", role: "Chuyên gia tư vấn độc lập" },
    ],
    comparisonTitle: "Văn phòng ảo so với đăng ký tại nhà riêng",
    comparisonAlternative: "Đăng ký tại nhà riêng",
    comparison: [
      { criteria: "Chi phí ban đầu", max: "Từ 299.000đ/tháng, không đặt cọc lớn", traditional: "Miễn phí nhưng có thể gặp rủi ro pháp lý nếu không đúng mục đích sử dụng" },
      { criteria: "Hình ảnh chuyên nghiệp", max: "Địa chỉ tại khu vực kinh doanh trung tâm", traditional: "Địa chỉ nhà riêng, thiếu chuyên nghiệp khi giao dịch" },
      { criteria: "Nhận thư từ, bưu phẩm", max: "Lễ tân tiếp nhận, thông báo trong ngày", traditional: "Tự xử lý, dễ thất lạc khi vắng nhà" },
      { criteria: "Khả năng mở rộng", max: "Nâng cấp lên phòng họp, văn phòng trọn gói dễ dàng", traditional: "Phải tìm thuê văn phòng mới khi phát triển" },
      { criteria: "Tính pháp lý", max: "Hồ sơ, hợp đồng đầy đủ hỗ trợ xác minh với cơ quan thuế", traditional: "Có thể bị từ chối nếu địa chỉ không đúng quy hoạch kinh doanh" },
    ],
  },

  "van-phong-tron-goi": {
    slug: "van-phong-tron-goi",
    name: "Văn phòng trọn gói",
    heroTitle: "Văn Phòng Trọn Gói TP.HCM",
    heroDescription:
      "Không gian làm việc riêng tư, sẵn sàng sử dụng ngay với đầy đủ nội thất và tiện ích — chỉ từ 4.500.000đ/tháng tại 12 vị trí trung tâm TP.HCM.",
    image: "/images/van-phong-tron-goi.jpg",
    metaTitle: "Văn Phòng Trọn Gói TP.HCM Từ 4.5 Triệu/Tháng | MAX OFFICE",
    metaDescription:
      "Cho thuê văn phòng trọn gói TP.HCM từ 4.500.000đ/tháng. Sẵn sàng làm việc ngay, đầy đủ tiện ích, 12 vị trí trung tâm.",
    intro: [
      "Văn phòng trọn gói (Serviced Office) là giải pháp văn phòng vật lý đã được trang bị đầy đủ nội thất, hệ thống mạng, điều hoà và các tiện ích văn phòng cần thiết — cho phép doanh nghiệp dọn vào làm việc ngay mà không cần đầu tư ban đầu hay chờ đợi thi công. Đây là lựa chọn lý tưởng cho các công ty đang phát triển, cần không gian làm việc chuyên nghiệp cho đội ngũ nhưng chưa muốn cam kết vốn lớn vào việc thuê và trang bị văn phòng riêng.",
      "Tại MAX OFFICE, mỗi văn phòng trọn gói đều đi kèm lễ tân và bảo vệ 24/7, quyền sử dụng phòng họp chung, internet tốc độ cao và khu vực tiếp khách chuyên nghiệp. Với mức giá từ 4.500.000đ/tháng, doanh nghiệp có thể sở hữu không gian làm việc riêng tại các vị trí trung tâm TP.HCM mà không phải lo về chi phí vận hành, bảo trì hay quản lý cơ sở vật chất.",
      "So với việc tự thuê và trang bị văn phòng riêng — vốn đòi hỏi chi phí đầu tư nội thất, ký quỹ nhiều tháng và hợp đồng dài hạn — văn phòng trọn gói giúp doanh nghiệp tiết kiệm đáng kể thời gian và ngân sách trong khi vẫn đảm bảo hình ảnh chuyên nghiệp trước đối tác và khách hàng.",
      "Dịch vụ này đặc biệt phù hợp với các công ty đã có đội ngũ nhân sự ổn định, doanh nghiệp vừa gọi vốn thành công cần văn phòng xứng tầm để tiếp đối tác, hoặc chi nhánh mới mở tại TP.HCM muốn có mặt bằng hoạt động ngay mà không mất thời gian tìm kiếm, sửa chữa. Với 12 vị trí trải đều tại các quận trung tâm, MAX OFFICE giúp doanh nghiệp dễ dàng chọn địa điểm gần khách hàng, đối tác hoặc thuận tiện di chuyển cho nhân viên, đồng thời có thể đổi hoặc mở rộng sang chi nhánh khác khi quy mô đội ngũ thay đổi.",
    ],
    introImage: { src: "/images/dich-vu-van-phong-tron-goi-anh-1.jpg", alt: "Không gian văn phòng trọn gói MAX OFFICE" },
    benefitsTitle: "Vì sao nên chọn văn phòng trọn gói MAX OFFICE",
    benefits: [
      { icon: ClockIcon, title: "Sẵn sàng sử dụng ngay", desc: "Dọn vào làm việc trong ngày, không cần chờ thi công hay mua sắm nội thất." },
      { icon: TagIcon, title: "Tiết kiệm chi phí đầu tư", desc: "Không tốn vốn ban đầu cho nội thất, hệ thống mạng hay điều hoà." },
      { icon: ShieldCheckIcon, title: "Lễ tân & bảo vệ 24/7", desc: "Đảm bảo an ninh và hình ảnh chuyên nghiệp cho doanh nghiệp." },
      { icon: ScreenIcon, title: "Phòng họp dùng chung", desc: "Quyền sử dụng phòng họp trang bị hiện đại khi cần tiếp khách." },
      { icon: BuildingIcon, title: "Vị trí trung tâm", desc: "Lựa chọn từ 12 địa điểm tại các quận trung tâm TP.HCM." },
      { icon: UsersIcon, title: "Linh hoạt mở rộng", desc: "Dễ dàng nâng cấp diện tích khi đội ngũ phát triển." },
    ],
    featuresTitle: "Văn phòng trọn gói bao gồm những gì?",
    featuresDescription:
      "Mọi tiện ích cần thiết để đội ngũ của bạn làm việc hiệu quả ngay từ ngày đầu tiên.",
    features: [
      { title: "Nội thất đầy đủ", desc: "Bàn ghế làm việc, tủ lưu trữ, khu vực tiếp khách." },
      { title: "Internet tốc độ cao", desc: "Cáp quang ổn định cho cả đội ngũ làm việc đồng thời." },
      { title: "Lễ tân chuyên nghiệp", desc: "Tiếp đón khách hàng và đối tác của bạn." },
      { title: "Bảo vệ 24/7", desc: "Kiểm soát ra vào bằng thẻ từ, an ninh đảm bảo." },
      { title: "Phòng họp dùng chung", desc: "Trang bị màn hình, âm thanh hiện đại." },
      { title: "Khu vực pantry", desc: "Trà, cà phê phục vụ đội ngũ trong giờ làm việc." },
    ],
    pricingTitle: "Bảng giá văn phòng trọn gói",
    pricingDescription: "Giá tham khảo cho văn phòng diện tích tiêu chuẩn.",
    pricing: {
      mode: "single",
      price: "4.500.000đ",
      unit: "/ tháng",
      features: [
        "Không gian riêng sẵn sàng làm việc",
        "Nội thất & internet tốc độ cao",
        "Lễ tân & bảo vệ 24/7",
        "Phòng họp dùng chung",
        "Vị trí tại 12 chi nhánh trung tâm TP.HCM",
      ],
      note: "Giá tham khảo cho văn phòng diện tích tiêu chuẩn. Liên hệ để nhận báo giá theo diện tích và số lượng nhân sự thực tế.",
    },
    pricingImage: { src: "/images/dich-vu-van-phong-tron-goi-anh-2.jpg", alt: "Không gian văn phòng trọn gói MAX OFFICE" },
    process: [
      { num: "01", title: "Liên hệ tư vấn", desc: "Chia sẻ số lượng nhân sự và nhu cầu diện tích." },
      { num: "02", title: "Tham quan văn phòng", desc: "Chọn chi nhánh và không gian phù hợp trong 12 địa điểm." },
      { num: "03", title: "Ký hợp đồng", desc: "Hoàn tất hợp đồng thuê, chuẩn bị bàn giao." },
      { num: "04", title: "Dọn vào làm việc", desc: "Nhận văn phòng sẵn sàng sử dụng ngay." },
    ],
    faqs: [
      { q: "Văn phòng trọn gói có bao gồm nội thất không?", a: "Có, bao gồm đầy đủ bàn ghế làm việc, tủ lưu trữ và khu vực tiếp khách cơ bản." },
      { q: "Tôi có thể tuỳ chỉnh cách bố trí văn phòng không?", a: "Có thể trao đổi với đội ngũ để điều chỉnh bố trí phù hợp với nhu cầu sử dụng thực tế." },
      { q: "Phòng họp dùng chung có tính phí thêm không?", a: "Khách hàng thuê văn phòng trọn gói được ưu đãi số giờ sử dụng phòng họp miễn phí mỗi tháng, phần vượt tính theo bảng giá phòng họp." },
      { q: "Hợp đồng thuê tối thiểu bao lâu?", a: "Linh hoạt theo tháng hoặc theo năm tuỳ nhu cầu, không yêu cầu cam kết dài hạn." },
      { q: "Có giới hạn số lượng nhân sự làm việc không?", a: "Diện tích văn phòng được tư vấn phù hợp với số lượng nhân sự bạn cung cấp khi đăng ký." },
      { q: "Văn phòng có được sử dụng để đăng ký kinh doanh không?", a: "Có, địa chỉ văn phòng trọn gói hoàn toàn hợp lệ để đăng ký kinh doanh và các thủ tục pháp lý liên quan." },
      { q: "Chi phí điện, nước, internet có tính riêng không?", a: "Đã bao gồm trong giá thuê, không phát sinh thêm chi phí vận hành cơ bản." },
      { q: "Tôi có thể chuyển sang chi nhánh khác trong quá trình sử dụng không?", a: "Có thể, tuỳ tình trạng phòng trống tại chi nhánh mong muốn — liên hệ đội ngũ để được hỗ trợ." },
      { q: "Bảo vệ và lễ tân hoạt động theo giờ nào?", a: "Bảo vệ hoạt động 24/7; lễ tân trực trong giờ hành chính các ngày làm việc." },
      { q: "Tôi có thể đặt thêm chỗ ngồi khi cần mở rộng gấp không?", a: "Có, MAX OFFICE hỗ trợ bổ sung chỗ ngồi linh động hoặc nâng cấp diện tích khi bạn cần mở rộng nhanh." },
      { q: "Làm sao để bắt đầu thuê văn phòng trọn gói?", a: "Liên hệ đội ngũ tư vấn, tham quan văn phòng thực tế và ký hợp đồng — bạn có thể dọn vào làm việc ngay sau đó." },
    ],
    testimonials: [
      { quote: "Chuyển từ văn phòng riêng sang văn phòng trọn gói của MAX OFFICE giúp startup của mình tiết kiệm đáng kể chi phí vận hành mỗi tháng.", initial: "M", name: "Minh Quân", role: "Founder, TechNova Studio" },
      { quote: "Đội ngũ mình chuyển vào văn phòng chỉ trong 2 ngày kể từ lúc ký hợp đồng, không phải lo mua sắm gì thêm.", initial: "P", name: "Thu Phương", role: "COO, Greenfield Agency" },
      { quote: "Vị trí trung tâm giúp công ty mình dễ dàng gặp gỡ đối tác, phòng họp cũng rất chuyên nghiệp.", initial: "H", name: "Anh Huy", role: "Giám đốc kinh doanh, VietTech Solutions" },
    ],
    comparisonTitle: "Văn phòng trọn gói so với tự thuê văn phòng riêng",
    comparisonAlternative: "Tự thuê văn phòng riêng",
    comparison: [
      { criteria: "Thời gian sẵn sàng", max: "Dọn vào làm việc trong ngày", traditional: "Thường mất 1-3 tháng thi công, lắp đặt" },
      { criteria: "Chi phí đầu tư ban đầu", max: "Không cần đầu tư nội thất, hạ tầng", traditional: "Tốn kém chi phí nội thất, sửa chữa, lắp đặt mạng" },
      { criteria: "Vận hành & bảo trì", max: "MAX OFFICE quản lý toàn bộ", traditional: "Doanh nghiệp tự quản lý, phát sinh chi phí" },
      { criteria: "Lễ tân, bảo vệ", max: "Có sẵn, chuyên nghiệp 24/7", traditional: "Phải tự tuyển dụng, quản lý nhân sự riêng" },
      { criteria: "Tính linh hoạt hợp đồng", max: "Theo tháng hoặc theo năm, dễ điều chỉnh", traditional: "Thường yêu cầu hợp đồng dài hạn, đặt cọc lớn" },
    ],
  },

  "phong-hop": {
    slug: "phong-hop",
    name: "Phòng họp theo giờ",
    heroTitle: "Cho Thuê Phòng Họp Theo Giờ TP.HCM",
    heroDescription:
      "Phòng họp chuyên nghiệp, trang bị màn hình và âm thanh hiện đại — đặt lịch linh hoạt từ 150.000đ/giờ tại 12 chi nhánh trung tâm TP.HCM.",
    image: "/images/phong-hop.jpg",
    metaTitle: "Cho Thuê Phòng Họp Theo Giờ TP.HCM Từ 150K | MAX OFFICE",
    metaDescription:
      "Phòng họp chuyên nghiệp TP.HCM từ 150.000đ/giờ. Màn hình 4K, âm thanh chuẩn, đặt lịch online 24/7. 12 chi nhánh.",
    intro: [
      "Phòng họp theo giờ là giải pháp lý tưởng cho các cuộc gặp gỡ đối tác, phỏng vấn tuyển dụng, đào tạo nội bộ hay thuyết trình dự án mà không cần duy trì một văn phòng cố định. Dịch vụ này đặc biệt phù hợp với freelancer, doanh nghiệp nhỏ, hoặc các công ty cần không gian họp chuyên nghiệp tại vị trí thuận tiện cho khách hàng.",
      "Tại MAX OFFICE, phòng họp được trang bị màn hình trình chiếu, hệ thống âm thanh hiện đại và kết nối internet tốc độ cao, sẵn sàng phục vụ mọi quy mô cuộc họp từ vài người đến cả nhóm lớn. Với mức giá từ 150.000đ/giờ, bạn có thể đặt lịch linh hoạt theo nhu cầu thực tế mà không phải trả chi phí cố định hàng tháng cho một không gian ít khi sử dụng.",
      "Việc đặt phòng họp theo giờ tại MAX OFFICE giúp doanh nghiệp tạo ấn tượng chuyên nghiệp với đối tác mà không phải đầu tư vào một văn phòng riêng chỉ để phục vụ các buổi họp không thường xuyên — một lựa chọn tối ưu về chi phí và hiệu quả sử dụng.",
      "Dịch vụ phù hợp với nhiều tình huống thực tế: công ty startup cần nơi gặp nhà đầu tư, bộ phận nhân sự cần không gian phỏng vấn ứng viên kín đáo, đội kinh doanh cần phòng thuyết trình dự án cho khách hàng, hoặc đơn giản là một nhóm làm việc từ xa cần họp trực tiếp định kỳ. Với 12 chi nhánh tại các quận trung tâm TP.HCM, bạn luôn có thể tìm được phòng họp gần vị trí thuận tiện nhất, đặt lịch nhanh chóng chỉ với một cuộc gọi hoặc tin nhắn mà không cần khảo sát địa điểm trước. Đội ngũ lễ tân tại mỗi chi nhánh cũng hỗ trợ chuẩn bị phòng sẵn sàng trước giờ hẹn, kiểm tra thiết bị hoạt động ổn định và đón tiếp khách mời chu đáo, giúp buổi họp của bạn diễn ra suôn sẻ từ đầu đến cuối mà không phải lo lắng về khâu hậu cần.",
    ],
    introImage: { src: "/images/dich-vu-phong-hop-anh-1.jpg", alt: "Phòng họp MAX OFFICE" },
    benefitsTitle: "Vì sao nên chọn phòng họp MAX OFFICE",
    benefits: [
      { icon: ClockIcon, title: "Đặt lịch linh hoạt", desc: "Chỉ trả tiền theo giờ sử dụng thực tế, không ràng buộc hợp đồng dài hạn." },
      { icon: ScreenIcon, title: "Trang thiết bị hiện đại", desc: "Màn hình trình chiếu, âm thanh chuẩn, wifi tốc độ cao." },
      { icon: BuildingIcon, title: "Vị trí thuận tiện", desc: "Chọn từ 12 chi nhánh trung tâm TP.HCM gần đối tác, khách hàng." },
      { icon: ShieldCheckIcon, title: "Không gian chuyên nghiệp", desc: "Tạo ấn tượng tốt trong các buổi gặp gỡ quan trọng." },
      { icon: BadgePercentIcon, title: "Đặt lịch nhanh chóng", desc: "Xác nhận đặt phòng trong thời gian ngắn, kể cả gấp." },
      { icon: UsersIcon, title: "Phù hợp nhiều mục đích", desc: "Họp đối tác, phỏng vấn, đào tạo, hội thảo nhỏ." },
    ],
    featuresTitle: "Phòng họp MAX OFFICE được trang bị gì?",
    featuresDescription: "Đầy đủ thiết bị để buổi họp của bạn diễn ra chuyên nghiệp và suôn sẻ.",
    features: [
      { title: "Màn hình trình chiếu", desc: "Độ phân giải cao, hỗ trợ kết nối không dây." },
      { title: "Hệ thống âm thanh", desc: "Chuẩn hội nghị, rõ ràng cho phòng vừa và lớn." },
      { title: "Wifi tốc độ cao", desc: "Ổn định cho toàn bộ người tham dự." },
      { title: "Bàn ghế họp chuyên nghiệp", desc: "Sức chứa linh hoạt theo quy mô cuộc họp." },
      { title: "Nước uống", desc: "Phục vụ miễn phí trong phòng họp." },
      { title: "Lễ tân hỗ trợ", desc: "Đón tiếp khách mời của bạn khi đến đúng lịch hẹn." },
    ],
    pricingTitle: "Bảng giá phòng họp theo giờ",
    pricingDescription: "Giá áp dụng cho phòng họp tiêu chuẩn.",
    pricing: {
      mode: "single",
      price: "150.000đ",
      unit: "/ giờ",
      features: [
        "Màn hình trình chiếu & âm thanh hiện đại",
        "Wifi tốc độ cao",
        "Đặt lịch linh hoạt theo giờ",
        "Lễ tân hỗ trợ đón khách",
        "Vị trí tại 12 chi nhánh trung tâm",
      ],
      note: "Giá áp dụng cho phòng họp tiêu chuẩn. Liên hệ để nhận báo giá phòng họp sức chứa lớn hoặc thuê theo gói nhiều giờ.",
    },
    pricingImage: { src: "/images/dich-vu-phong-hop-anh-2.jpg", alt: "Phòng họp MAX OFFICE" },
    process: [
      { num: "01", title: "Chọn chi nhánh & khung giờ", desc: "Xác định địa điểm và thời gian phù hợp." },
      { num: "02", title: "Đặt lịch", desc: "Liên hệ hoặc gọi hotline để giữ chỗ." },
      { num: "03", title: "Xác nhận đặt phòng", desc: "Nhận xác nhận lịch họp qua Zalo hoặc điện thoại." },
      { num: "04", title: "Sử dụng phòng họp", desc: "Có mặt đúng giờ, phòng đã sẵn sàng thiết bị." },
    ],
    faqs: [
      { q: "Tôi cần đặt phòng họp trước bao lâu?", a: "Nên đặt trước ít nhất 2-3 giờ để đảm bảo phòng trống; MAX OFFICE vẫn cố gắng hỗ trợ đặt gấp khi có phòng." },
      { q: "Phòng họp có sức chứa tối đa bao nhiêu người?", a: "Tuỳ chi nhánh, phòng họp phục vụ từ 4 đến hơn 20 người — liên hệ để được tư vấn phòng phù hợp quy mô cuộc họp của bạn." },
      { q: "Có thể đặt phòng theo nửa ngày hoặc cả ngày không?", a: "Có, liên hệ đội ngũ để nhận báo giá ưu đãi khi thuê theo gói nhiều giờ." },
      { q: "Phòng họp có wifi và ổ cắm điện đầy đủ không?", a: "Có, mỗi phòng đều trang bị wifi tốc độ cao và đủ ổ cắm cho thiết bị của người tham dự." },
      { q: "Tôi có thể huỷ hoặc đổi lịch đặt phòng không?", a: "Có thể, vui lòng liên hệ trước giờ họp để được hỗ trợ đổi lịch phù hợp." },
      { q: "Phòng họp có phục vụ nước uống không?", a: "Có, nước uống cơ bản được phục vụ miễn phí trong phòng họp." },
      { q: "Khách không phải nhân viên công ty tôi có được vào phòng họp không?", a: "Có, lễ tân sẽ hỗ trợ đón tiếp khách mời của bạn khi đến đúng lịch hẹn." },
      { q: "Tôi có cần là khách hàng đang thuê dịch vụ khác của MAX OFFICE mới được đặt phòng họp không?", a: "Không bắt buộc. Bất kỳ ai cũng có thể đặt phòng họp theo giờ tại MAX OFFICE." },
      { q: "Phòng họp có hỗ trợ trình chiếu từ laptop cá nhân không?", a: "Có, màn hình hỗ trợ kết nối HDMI và trình chiếu không dây từ nhiều loại thiết bị." },
      { q: "Giá phòng họp đã bao gồm thuế chưa?", a: "Đội ngũ tư vấn sẽ gửi báo giá chi tiết đầy đủ trước khi bạn xác nhận đặt phòng." },
      { q: "Có ưu đãi gì khi đặt phòng họp thường xuyên không?", a: "Khách hàng đặt phòng họp thường xuyên hoặc đang sử dụng dịch vụ văn phòng khác tại MAX OFFICE được ưu đãi giá — liên hệ để biết chi tiết." },
    ],
    testimonials: [
      { quote: "Phòng họp thiết bị đầy đủ, đặt lịch nhanh, rất tiện khi mình cần gặp đối tác nước ngoài gấp.", initial: "V", name: "Bảo Vy", role: "Giám đốc Marketing, Sunrise Media" },
      { quote: "Không gian chuyên nghiệp, giúp buổi phỏng vấn ứng viên của công ty mình trông nghiêm túc hơn hẳn.", initial: "T", name: "Minh Trí", role: "Trưởng phòng Nhân sự, FastLogix" },
      { quote: "Giá theo giờ rất hợp lý so với việc phải giữ một phòng họp riêng cả tháng mà ít khi dùng tới.", initial: "N", name: "Hoài Nam", role: "Founder, DigitalNest" },
    ],
    comparisonTitle: "Phòng họp MAX OFFICE so với thuê địa điểm ngoài",
    comparisonAlternative: "Thuê địa điểm ngoài / quán cà phê",
    comparison: [
      { criteria: "Tính chuyên nghiệp", max: "Phòng họp kín đáo, trang thiết bị chuẩn doanh nghiệp", traditional: "Ồn ào, thiếu riêng tư, không phù hợp họp quan trọng" },
      { criteria: "Trang thiết bị", max: "Màn hình, âm thanh, wifi sẵn sàng", traditional: "Thường không có sẵn, phải tự mang theo" },
      { criteria: "Đặt lịch", max: "Xác nhận nhanh, đúng giờ mong muốn", traditional: "Phụ thuộc chỗ trống, khó chủ động" },
      { criteria: "Chi phí", max: "Trả đúng theo giờ sử dụng, minh bạch", traditional: "Có thể phát sinh chi phí gọi món, giữ chỗ" },
      { criteria: "Vị trí", max: "12 chi nhánh trung tâm TP.HCM", traditional: "Giới hạn theo địa điểm quán hoặc không gian có sẵn" },
    ],
  },

  "cho-ngoi-linh-dong": {
    slug: "cho-ngoi-linh-dong",
    name: "Chỗ ngồi linh động",
    heroTitle: "Coworking Space TP.HCM",
    heroDescription:
      "Không gian làm việc chung năng động, wifi tốc độ cao và cộng đồng doanh nghiệp sôi động — chỉ từ 2.000.000đ/tháng.",
    image: "/images/coworking.jpg",
    metaTitle: "Coworking Space TP.HCM Từ 2 Triệu/Tháng | MAX OFFICE",
    metaDescription:
      "Chỗ ngồi làm việc linh động TP.HCM từ 2.000.000đ/tháng. WiFi nhanh, không gian chuyên nghiệp, cộng đồng doanh nghiệp.",
    intro: [
      "Chỗ ngồi linh động (coworking) là mô hình không gian làm việc chung, phù hợp với freelancer, đội nhóm nhỏ 1-3 người hoặc các cá nhân cần một nơi làm việc chuyên nghiệp mà không phải cam kết thuê văn phòng riêng. Đây là xu hướng làm việc ngày càng phổ biến tại các thành phố lớn, giúp tiết kiệm chi phí trong khi vẫn có đầy đủ tiện ích cần thiết để làm việc hiệu quả.",
      "Tại MAX OFFICE, không gian coworking được thiết kế mở, thoải mái với wifi tốc độ cao, khu vực pantry phục vụ trà và cà phê miễn phí, cùng cộng đồng doanh nghiệp đa dạng để kết nối và hợp tác. Với mức giá từ 2.000.000đ/tháng, bạn có một chỗ ngồi làm việc chuyên nghiệp tại vị trí trung tâm TP.HCM mà không phải lo về chi phí thuê văn phòng cố định.",
      "So với làm việc tại nhà hay các quán cà phê, coworking tại MAX OFFICE mang lại môi trường tập trung hơn, kết nối mạng ổn định hơn và cơ hội gặp gỡ, hợp tác với cộng đồng doanh nghiệp cùng làm việc tại không gian chung.",
      "Mô hình này phù hợp với nhiều đối tượng khác nhau: lập trình viên làm việc từ xa cho công ty nước ngoài, chủ shop kinh doanh online cần nơi xử lý đơn hàng và gọi điện cho khách, đội nhóm 2-3 người mới thành lập chưa cần văn phòng riêng, hoặc freelancer trong lĩnh vực thiết kế, marketing, tư vấn cần một không gian chuyên nghiệp để làm việc tập trung mỗi ngày. Khi đội nhóm phát triển và cần không gian riêng tư hơn, bạn có thể dễ dàng nâng cấp lên văn phòng trọn gói mà không phải thay đổi địa điểm, giúp việc mở rộng quy mô diễn ra liền mạch, không gián đoạn hoạt động kinh doanh.",
      "Một điểm cộng khác của mô hình coworking là tính linh hoạt về thời gian sử dụng — bạn có thể đến làm việc bất kỳ ngày nào trong tháng mà không bị ràng buộc bởi ca giờ cố định, phù hợp với nhịp làm việc thay đổi liên tục của freelancer hay những người vừa làm công việc chính vừa phát triển dự án riêng. Không gian mở cũng tạo điều kiện để bạn quan sát, học hỏi cách vận hành của các doanh nghiệp khác đang cùng làm việc, một lợi thế mà làm việc một mình tại nhà khó có được.",
    ],
    introImage: { src: "/images/dich-vu-cho-ngoi-linh-dong-1.jpg", alt: "Không gian chỗ ngồi linh động MAX OFFICE" },
    benefitsTitle: "Vì sao nên chọn coworking MAX OFFICE",
    benefits: [
      { icon: TagIcon, title: "Chi phí hợp lý", desc: "Chỉ từ 2.000.000đ/tháng, phù hợp freelancer và nhóm nhỏ." },
      { icon: BuildingIcon, title: "Không gian năng động", desc: "Môi trường làm việc chuyên nghiệp, truyền cảm hứng sáng tạo." },
      { icon: WifiIcon, title: "Wifi tốc độ cao", desc: "Kết nối ổn định cho công việc cần băng thông lớn." },
      { icon: UsersIcon, title: "Cộng đồng doanh nghiệp", desc: "Cơ hội kết nối, hợp tác với các công ty khác cùng không gian." },
      { icon: CoffeeIcon, title: "Trà, cà phê miễn phí", desc: "Tiện ích phục vụ suốt giờ làm việc." },
      { icon: KeyIcon, title: "Linh hoạt chỗ ngồi", desc: "Không cố định bàn, tự do chọn vị trí làm việc mỗi ngày." },
    ],
    featuresTitle: "Không gian coworking bao gồm những gì?",
    featuresDescription: "Mọi tiện ích cần thiết cho một ngày làm việc năng suất.",
    features: [
      { title: "Chỗ ngồi tự do", desc: "Hot desk trong không gian làm việc chung mở." },
      { title: "Wifi tốc độ cao", desc: "Phủ sóng toàn bộ khu vực làm việc." },
      { title: "Khu vực pantry", desc: "Trà, cà phê miễn phí cả ngày." },
      { title: "Không gian yên tĩnh", desc: "Dành cho cuộc gọi hoặc tập trung công việc." },
      { title: "Ưu đãi phòng họp", desc: "Giá tốt khi đặt thêm phòng họp theo giờ." },
      { title: "An ninh đảm bảo", desc: "Kiểm soát ra vào rõ ràng, an toàn." },
    ],
    pricingTitle: "Bảng giá chỗ ngồi linh động",
    pricingDescription: "Phù hợp cho cá nhân làm việc độc lập.",
    pricing: {
      mode: "single",
      price: "2.000.000đ",
      unit: "/ tháng",
      features: [
        "Chỗ ngồi tự do cả tháng",
        "Wifi tốc độ cao",
        "Trà, cà phê miễn phí",
        "Không gian coworking năng động",
        "Ưu đãi khi đặt phòng họp",
      ],
      note: "Giá áp dụng cho 1 người. Liên hệ để nhận báo giá theo nhóm 2-3 người.",
    },
    pricingImage: { src: "/images/dich-vu-cho-ngoi-linh-dong-2.jpg", alt: "Không gian chỗ ngồi linh động MAX OFFICE" },
    process: [
      { num: "01", title: "Liên hệ tư vấn", desc: "Chia sẻ nhu cầu sử dụng và thời gian mong muốn." },
      { num: "02", title: "Tham quan không gian", desc: "Trải nghiệm thực tế không gian coworking." },
      { num: "03", title: "Đăng ký gói", desc: "Hoàn tất đăng ký và thanh toán." },
      { num: "04", title: "Bắt đầu làm việc", desc: "Sử dụng chỗ ngồi ngay từ ngày đăng ký." },
    ],
    faqs: [
      { q: "Tôi có được chọn chỗ ngồi cố định không?", a: "Mô hình coworking sử dụng chỗ ngồi tự do (hot desk), bạn có thể chọn vị trí làm việc bất kỳ còn trống mỗi ngày." },
      { q: "Coworking có phù hợp để đăng ký kinh doanh không?", a: "Dịch vụ chỗ ngồi linh động chủ yếu phục vụ nhu cầu làm việc; nếu cần địa chỉ đăng ký kinh doanh, bạn nên kết hợp thêm dịch vụ văn phòng ảo." },
      { q: "Giờ hoạt động của không gian coworking là khi nào?", a: "Không gian mở cửa trong giờ hành chính các ngày làm việc — liên hệ đội ngũ để biết chi tiết giờ hoạt động từng chi nhánh." },
      { q: "Tôi có thể mang khách đến gặp tại khu vực coworking không?", a: "Khu vực làm việc chung dành cho cá nhân đăng ký; nếu cần tiếp khách, bạn có thể đặt thêm phòng họp theo giờ." },
      { q: "Có giới hạn số ngày sử dụng trong tháng không?", a: "Gói chỗ ngồi linh động cho phép sử dụng không giới hạn ngày trong tháng đã đăng ký." },
      { q: "Wifi có đủ mạnh để họp video call không?", a: "Có, hệ thống wifi tốc độ cao đáp ứng tốt nhu cầu họp trực tuyến và làm việc từ xa." },
      { q: "Tôi có thể đăng ký cho nhóm 2-3 người không?", a: "Có, liên hệ đội ngũ để nhận báo giá ưu đãi theo nhóm nhỏ." },
      { q: "Có tủ đồ cá nhân để lưu trữ vật dụng không?", a: "Tuỳ chi nhánh có thể hỗ trợ tủ lưu trữ — liên hệ để được tư vấn cụ thể." },
      { q: "Tôi có thể nâng cấp lên văn phòng trọn gói sau này không?", a: "Có, bạn có thể nâng cấp bất cứ lúc nào khi đội nhóm phát triển và cần không gian riêng." },
      { q: "Có cần đặt chỗ trước khi đến làm việc không?", a: "Không bắt buộc, nhưng nên thông báo trước nếu bạn cần chỗ ngồi cố định vào giờ cao điểm." },
      { q: "Thanh toán theo tháng hay có thể theo ngày?", a: "Gói tiêu chuẩn tính theo tháng; liên hệ đội ngũ nếu bạn cần sử dụng ngắn hạn theo ngày." },
    ],
    testimonials: [
      { quote: "Không gian thoải mái, wifi mạnh, mình làm việc từ xa cho công ty nước ngoài mà không lo gián đoạn.", initial: "Đ", name: "Gia Đạt", role: "Remote Developer" },
      { quote: "Cộng đồng ở đây khá đa dạng, mình đã kết nối được vài đối tác tiềm năng chỉ qua trò chuyện tại khu pantry.", initial: "M", name: "Thảo My", role: "Founder, Handmade Corner" },
      { quote: "Chi phí hợp lý hơn nhiều so với thuê văn phòng riêng, phù hợp giai đoạn mới bắt đầu của nhóm mình.", initial: "Q", name: "Anh Quốc", role: "Co-founder, AppVenture" },
    ],
    comparisonTitle: "Coworking so với làm việc tại nhà hoặc quán cà phê",
    comparisonAlternative: "Làm việc tại nhà / quán cà phê",
    comparison: [
      { criteria: "Môi trường làm việc", max: "Không gian chuyên nghiệp, tập trung", traditional: "Dễ xao nhãng, thiếu tính chuyên nghiệp" },
      { criteria: "Kết nối mạng", max: "Wifi tốc độ cao, ổn định", traditional: "Phụ thuộc mạng gia đình hoặc quán, dễ chập chờn" },
      { criteria: "Kết nối cộng đồng", max: "Cơ hội gặp gỡ doanh nghiệp khác", traditional: "Làm việc một mình, ít cơ hội kết nối" },
      { criteria: "Chi phí", max: "Từ 2.000.000đ/tháng, rõ ràng", traditional: "Tưởng miễn phí nhưng tốn chi phí đồ uống hàng ngày" },
      { criteria: "Tiện ích đi kèm", max: "Trà, cà phê, phòng họp ưu đãi", traditional: "Không có tiện ích hỗ trợ công việc" },
    ],
  },

  "thanh-lap-doanh-nghiep": {
    slug: "thanh-lap-doanh-nghiep",
    name: "Thành lập doanh nghiệp",
    heroTitle: "Dịch Vụ Thành Lập Công Ty TP.HCM",
    heroDescription:
      "Thành lập Hộ kinh doanh, Công ty TNHH hoặc Công ty Cổ phần nhanh chóng, đúng pháp lý — 2 gói dịch vụ minh bạch, chỉ từ 1.299.000đ khi đăng ký kèm Văn phòng ảo.",
    image: "/images/thanh-lap-doanh-nghiep.jpg",
    metaTitle: "Dịch Vụ Thành Lập Công Ty TP.HCM Từ 1.299.000đ | MAX OFFICE",
    metaDescription:
      "Thành lập công ty TNHH, cổ phần, hộ kinh doanh tại TP.HCM theo 2 gói dịch vụ minh bạch, từ 1.299.000đ khi kèm Văn phòng ảo. Nhanh chóng, đúng pháp lý, tư vấn miễn phí.",
    intro: [
      "Thành lập doanh nghiệp là bước đầu tiên và quan trọng nhất trên hành trình khởi nghiệp. Việc lựa chọn đúng loại hình doanh nghiệp, chuẩn bị hồ sơ chính xác và thực hiện đúng quy trình pháp lý sẽ giúp bạn tránh được những rắc rối và chi phí phát sinh không đáng có về sau. MAX OFFICE cung cấp dịch vụ tư vấn và thực hiện thủ tục thành lập doanh nghiệp trọn gói cho cả ba loại hình phổ biến nhất: Hộ kinh doanh, Công ty TNHH và Công ty Cổ phần — theo 2 gói dịch vụ với mức giá minh bạch, áp dụng chung cho mọi loại hình.",
      "Đội ngũ tư vấn của MAX OFFICE sẽ giúp bạn xác định loại hình phù hợp với quy mô và định hướng phát triển, soạn thảo hồ sơ đầy đủ, đại diện nộp hồ sơ tại cơ quan đăng ký kinh doanh và theo dõi tiến độ cho đến khi bạn nhận được giấy phép. Đặc biệt, khi đăng ký dịch vụ thành lập doanh nghiệp cùng lúc với Văn phòng ảo tại MAX OFFICE, bạn sẽ được áp dụng mức giá ưu đãi thấp hơn cho Gói 1.",
      "Với kinh nghiệm hỗ trợ hơn 500 doanh nghiệp tại TP.HCM, MAX OFFICE cam kết quy trình minh bạch, thời gian xử lý nhanh chóng và tư vấn tận tâm để doanh nghiệp của bạn có thể bắt đầu hoạt động đúng luật ngay từ ngày đầu tiên.",
      "Sau khi thành lập, nếu doanh nghiệp cần thay đổi tên, địa chỉ, ngành nghề, vốn điều lệ hay đại diện pháp luật, MAX OFFICE cũng có nhóm dịch vụ pháp lý sửa đổi riêng với mức giá rõ ràng cho từng nội dung thay đổi.",
    ],
    introImage: {
      src: "/images/dich-vu-thanh-lap-doanh-nghiep.jpg",
      alt: "Infographic dịch vụ thành lập doanh nghiệp MAX OFFICE",
      fit: "contain",
    },
    benefitsTitle: "Vì sao nên thành lập doanh nghiệp cùng MAX OFFICE",
    benefits: [
      { icon: ZapIcon, title: "Hệ thống soạn thảo hồ sơ tự động", desc: "MAX OFFICE sử dụng công nghệ tự động hoá trong soạn thảo hồ sơ thành lập doanh nghiệp, đảm bảo chính xác, nhanh chóng, hạn chế tối đa sai sót so với soạn thảo thủ công truyền thống." },
      { icon: UsersIcon, title: "Tư vấn loại hình phù hợp", desc: "Phân tích ưu, nhược điểm để chọn đúng mô hình ngay từ đầu." },
      { icon: BadgePercentIcon, title: "Giá ưu đãi khi kèm Văn phòng ảo", desc: "Gói 1 chỉ từ 1.299.000đ khi đăng ký kèm Văn phòng ảo." },
      { icon: ShieldCheckIcon, title: "Hồ sơ chính xác, đúng luật", desc: "Giảm thiểu rủi ro bị trả hồ sơ hoặc chậm tiến độ." },
      { icon: ClockIcon, title: "Xử lý nhanh chóng", desc: "Hoàn tất thủ tục thành lập trong 5-7 ngày." },
      { icon: KeyIcon, title: "Hỗ trợ trọn gói sau thành lập", desc: "Có sẵn dịch vụ pháp lý sửa đổi khi doanh nghiệp cần thay đổi thông tin." },
      { icon: DocumentCheckIcon, title: "Đội ngũ giàu kinh nghiệm", desc: "Đã hỗ trợ hơn 500 doanh nghiệp tại TP.HCM." },
    ],
    featuresTitle: "Dịch vụ thành lập doanh nghiệp bao gồm những gì?",
    featuresDescription: "Hỗ trợ trọn gói từ tư vấn đến khi doanh nghiệp chính thức đi vào hoạt động.",
    features: [
      { title: "Tư vấn loại hình", desc: "Hộ kinh doanh, Công ty TNHH hoặc Công ty Cổ phần." },
      { title: "Soạn thảo hồ sơ", desc: "Đầy đủ, đúng quy định pháp luật hiện hành." },
      { title: "Đại diện nộp hồ sơ", desc: "Theo dõi tiến độ tại cơ quan đăng ký kinh doanh." },
      { title: "Khắc dấu & đăng bố cáo", desc: "Hỗ trợ hoàn tất ngay sau khi có giấy phép." },
      { title: "Mở tài khoản ngân hàng", desc: "Hỗ trợ thủ tục mở tài khoản doanh nghiệp." },
      { title: "Khai thuế ban đầu & hoá đơn điện tử", desc: "Có trong Gói 2 — sẵn sàng vận hành và xuất hoá đơn ngay." },
    ],
    pricingTitle: "Bảng giá thành lập doanh nghiệp",
    pricingDescription:
      "2 gói dịch vụ minh bạch, áp dụng chung cho mọi loại hình doanh nghiệp — không phân biệt Hộ kinh doanh, TNHH hay Cổ phần.",
    pricing: {
      mode: "tiers",
      tiers: [
        {
          name: "Gói 1 — Cơ bản",
          price: "1.299.000đ",
          unit: "kèm Văn phòng ảo · giá thường 1.500.000đ · 5-7 ngày",
          desc: "Đầy đủ giấy tờ pháp lý cơ bản để chính thức có giấy phép và bắt đầu hoạt động.",
          features: [
            "Giấy chứng nhận đăng ký doanh nghiệp",
            "Con dấu công ty",
            "Đăng bố cáo",
            "Mở tài khoản ngân hàng",
          ],
        },
        {
          name: "Gói 2 — Đầy đủ",
          price: "2.800.000đ",
          unit: "trọn gói · 5-7 ngày",
          desc: "Tất cả hạng mục Gói 1, cộng thêm thủ tục thuế và hoá đơn điện tử để vận hành ngay.",
          features: [
            "Tất cả hạng mục trong Gói 1",
            "Hồ sơ khai thuế ban đầu",
            "Chữ ký số 1 năm",
            "Hoá đơn điện tử 100 số",
            "Thông báo phát hành hoá đơn",
          ],
          featured: true,
        },
      ],
    },
    process: [
      { num: "01", title: "Tư vấn loại hình & chọn gói", desc: "Xác định mô hình phù hợp và chọn Gói 1 hoặc Gói 2 theo nhu cầu." },
      { num: "02", title: "Soạn hồ sơ", desc: "Chuẩn bị đầy đủ giấy tờ, điều lệ công ty (nếu có)." },
      { num: "03", title: "Nộp hồ sơ & theo dõi", desc: "Đại diện nộp và cập nhật tiến độ xử lý cho bạn." },
      { num: "04", title: "Nhận giấy phép", desc: "Bàn giao giấy phép kinh doanh, hỗ trợ thủ tục sau thành lập." },
    ],
    faqs: [
      { q: "Gói 1 và Gói 2 khác nhau thế nào?", a: "Gói 1 gồm giấy chứng nhận đăng ký doanh nghiệp, con dấu, đăng bố cáo và mở tài khoản ngân hàng — đủ để có giấy phép và bắt đầu hoạt động. Gói 2 bổ sung thêm hồ sơ khai thuế ban đầu, chữ ký số 1 năm, hoá đơn điện tử 100 số và thông báo phát hành hoá đơn — phù hợp nếu bạn muốn xuất hoá đơn và vận hành đầy đủ ngay." },
      { q: "Nên chọn Hộ kinh doanh hay Công ty TNHH?", a: "Hộ kinh doanh phù hợp mô hình nhỏ, thủ tục đơn giản, chịu trách nhiệm vô hạn; Công ty TNHH phù hợp khi cần tư cách pháp nhân, giới hạn trách nhiệm theo vốn góp. Cả hai loại hình đều áp dụng cùng bảng giá Gói 1/Gói 2. Đội ngũ MAX OFFICE sẽ tư vấn miễn phí dựa trên tình hình cụ thể của bạn." },
      { q: "Thời gian hoàn tất thủ tục thành lập mất bao lâu?", a: "Cả hai gói đều xử lý trong khoảng 5-7 ngày làm việc, tuỳ tính đầy đủ của hồ sơ." },
      { q: "Giá ưu đãi thành lập doanh nghiệp kèm Văn phòng ảo áp dụng thế nào?", a: "Ưu đãi áp dụng cụ thể theo từng chi nhánh:\n- Tại Sông Thao: khách ký hợp đồng Văn phòng ảo từ gói START (350.000đ/tháng) trở lên, thời hạn 2 năm, được TẶNG 100% phí dịch vụ thành lập doanh nghiệp, hoặc tặng 100% phí đổi địa chỉ trụ sở về Sông Thao (áp dụng 1 trong 2, tuỳ nhu cầu khách hàng).\n- Tại các chi nhánh còn lại: khách ký hợp đồng Văn phòng ảo từ gói BASE (500.000đ/tháng) trở lên, thời hạn 1 năm, được TẶNG 100% phí dịch vụ thành lập doanh nghiệp, hoặc tặng 100% phí đổi địa chỉ trụ sở về đúng chi nhánh đang thuê (áp dụng 1 trong 2, tuỳ nhu cầu khách hàng).\n\nLiên hệ đội ngũ tư vấn để được hướng dẫn cụ thể theo đúng chi nhánh và gói dịch vụ bạn quan tâm." },
      { q: "Tôi cần chuẩn bị giấy tờ gì để thành lập công ty?", a: "Chỉ cần CCCD hoặc hộ chiếu của người đại diện pháp luật và thông tin ngành nghề, vốn điều lệ dự kiến — đội ngũ MAX OFFICE sẽ soạn thảo toàn bộ hồ sơ còn lại." },
      { q: "Công ty Cổ phần khác Công ty TNHH như thế nào?", a: "Công ty Cổ phần phù hợp khi bạn có kế hoạch huy động vốn từ nhiều cổ đông hoặc phát hành cổ phần; Công ty TNHH phù hợp với cơ cấu sở hữu đơn giản hơn. Chi phí thành lập không đổi theo loại hình, chỉ phụ thuộc vào gói dịch vụ bạn chọn." },
      { q: "Vốn điều lệ tối thiểu là bao nhiêu?", a: "Pháp luật hiện hành không quy định mức vốn điều lệ tối thiểu cho hầu hết ngành nghề — đội ngũ sẽ tư vấn mức vốn phù hợp với ngành nghề đăng ký của bạn." },
      { q: "Sau khi thành lập, nếu tôi cần đổi tên, địa chỉ hoặc vốn điều lệ thì sao?", a: "MAX OFFICE có nhóm dịch vụ pháp lý sửa đổi riêng (đổi tên, địa chỉ, đại diện pháp luật, vốn điều lệ, ngành nghề...) với mức giá rõ ràng cho từng nội dung, kèm ưu đãi khi đặt từ 2 dịch vụ trở lên — xem đầy đủ bảng giá tại trang Dịch vụ pháp lý sửa đổi." },
      { q: "Tôi có thể thay đổi nhiều thông tin cùng lúc không?", a: "Có. Khi bạn đặt từ 2 dịch vụ sửa đổi trở lên cùng lúc (ví dụ vừa đổi tên công ty vừa cập nhật CCCD), dịch vụ có giá trị lớn nhất tính giá đầy đủ theo bảng giá; các dịch vụ còn lại được giảm — nếu giá gốc trên 500.000đ thì giảm còn 500.000đ, nếu giá gốc từ 500.000đ trở xuống thì giảm còn 300.000đ." },
      { q: "Tôi có thể dùng địa chỉ nhà riêng để thành lập công ty không?", a: "Có thể, tuỳ loại hình kinh doanh và quy định địa phương; nếu không có địa chỉ phù hợp, bạn có thể sử dụng dịch vụ Văn phòng ảo của MAX OFFICE." },
      { q: "Tôi có thể chuyển đổi từ Hộ kinh doanh sang Công ty TNHH sau này không?", a: "Có. Đây là một trong các dịch vụ pháp lý sửa đổi MAX OFFICE cung cấp — liên hệ để được tư vấn khi bạn có nhu cầu." },
      { q: "MAX OFFICE có hỗ trợ kế toán thuế sau khi thành lập không?", a: "Có, MAX OFFICE cung cấp dịch vụ kế toán & thuế trọn gói để đồng hành cùng doanh nghiệp ngay sau khi thành lập." },
    ],
    testimonials: [
      { quote: "Nhờ MAX OFFICE tư vấn kỹ mình mới hiểu rõ nên chọn Công ty TNHH thay vì hộ kinh doanh như dự định ban đầu — quyết định đúng đắn cho kế hoạch mở rộng sau này.", initial: "T", name: "Tuấn Kiệt", role: "Giám đốc, KietBuild Construction" },
      { quote: "Thủ tục nhanh, hồ sơ chuẩn ngay từ đầu nên không bị trả lại lần nào. Rất chuyên nghiệp.", initial: "H", name: "Thu Hằng", role: "Founder, Hằng Beauty Academy" },
      { quote: "Chọn Gói 2 nên có luôn chữ ký số với hoá đơn điện tử, không phải chạy thêm thủ tục nào khác để bắt đầu bán hàng.", initial: "L", name: "Đình Long", role: "Co-founder, LongTech JSC" },
    ],
    comparisonTitle: "Dịch vụ MAX OFFICE so với tự làm thủ tục",
    comparisonAlternative: "Tự làm thủ tục",
    comparison: [
      { criteria: "Thời gian xử lý", max: "5-7 ngày làm việc, có người theo dõi tiến độ", traditional: "Có thể kéo dài nếu hồ sơ bị trả lại, thiếu kinh nghiệm" },
      { criteria: "Rủi ro sai sót hồ sơ", max: "Đội ngũ chuyên môn soạn thảo, kiểm tra kỹ", traditional: "Dễ sai sót do không nắm rõ quy định pháp luật" },
      { criteria: "Chi phí", max: "Từ 1.299.000đ khi kèm Văn phòng ảo (Gói 1)", traditional: "Tốn thời gian đi lại, có thể phát sinh chi phí sửa hồ sơ" },
      { criteria: "Tư vấn loại hình", max: "Được tư vấn miễn phí trước khi quyết định", traditional: "Tự tìm hiểu, dễ chọn sai mô hình ban đầu" },
      { criteria: "Hỗ trợ sau thành lập", max: "Có sẵn dịch vụ pháp lý sửa đổi khi cần thay đổi thông tin", traditional: "Phải tự tìm kiếm đơn vị hỗ trợ tiếp theo" },
    ],
  },

  "ke-toan-thue": {
    slug: "ke-toan-thue",
    name: "Kế toán & thuế",
    heroTitle: "Dịch Vụ Kế Toán Thuế Trọn Gói TP.HCM",
    heroDescription:
      "Kê khai đúng hạn, đúng luật, tối ưu chi phí thuế hợp pháp — đồng hành cùng hơn 500 doanh nghiệp tại TP.HCM.",
    image: "/images/ke-toan-thue.jpg",
    metaTitle: "Dịch Vụ Kế Toán Thuế Trọn Gói TP.HCM | MAX OFFICE",
    metaDescription:
      "Dịch vụ kế toán thuế trọn gói từ 500.000đ/tháng, tính theo số hoá đơn/quý và loại hình kinh doanh. Đúng hạn, đúng luật, tối ưu thuế hợp pháp. 500+ doanh nghiệp tin dùng.",
    intro: [
      "Kế toán và thuế là một trong những nghiệp vụ quan trọng nhưng cũng dễ phát sinh rủi ro nhất đối với doanh nghiệp, đặc biệt là các công ty mới thành lập chưa có bộ phận kế toán chuyên trách. Sai sót trong kê khai thuế, chậm nộp báo cáo hay hạch toán không đúng quy định có thể dẫn đến các khoản phạt không đáng có, ảnh hưởng đến uy tín và hoạt động của doanh nghiệp.",
      "Dịch vụ kế toán & thuế trọn gói của MAX OFFICE giúp doanh nghiệp yên tâm về toàn bộ nghiệp vụ sổ sách, từ kê khai thuế định kỳ, lập báo cáo tài chính đến tư vấn tối ưu nghĩa vụ thuế hợp pháp. Đội ngũ kế toán viên giàu kinh nghiệm của chúng tôi luôn cập nhật quy định pháp luật mới nhất, đảm bảo doanh nghiệp bạn kê khai đúng hạn và đúng luật trong mọi kỳ báo cáo.",
      "Chi phí được tính minh bạch theo số lượng hoá đơn/chứng từ phát sinh mỗi quý và loại hình kinh doanh — từ 500.000đ/tháng cho doanh nghiệp chưa phát sinh hoá đơn, đến các mức cao hơn tuỳ khối lượng giao dịch thực tế. Doanh nghiệp thương mại thuần tuý, doanh nghiệp thương mại kết hợp dịch vụ, và doanh nghiệp sản xuất/xây dựng/xây lắp/khai thác được áp mức phí riêng phù hợp với độ phức tạp nghiệp vụ của từng nhóm.",
      "Nhiều doanh nghiệp mới thành lập thường chủ quan trong giai đoạn đầu vì nghĩ chưa có doanh thu thì chưa cần quan tâm đến sổ sách, nhưng thực tế nghĩa vụ kê khai vẫn phát sinh ngay từ khi có mã số thuế. MAX OFFICE giúp doanh nghiệp xây dựng thói quen kế toán đúng chuẩn ngay từ ngày đầu, tránh tích tụ sai sót về sau và luôn sẵn sàng hồ sơ minh bạch khi cần vay vốn, gọi vốn đầu tư hoặc mở rộng hoạt động kinh doanh.",
    ],
    introImage: {
      src: "/images/dich-vu-ke-toan-thue.jpg",
      alt: "Infographic dịch vụ kế toán thuế MAX OFFICE",
      fit: "contain",
    },
    benefitsTitle: "Vì sao nên chọn kế toán thuế MAX OFFICE",
    benefits: [
      { icon: ClockIcon, title: "Kê khai đúng hạn", desc: "Không còn lo trễ hạn nộp báo cáo thuế, tránh bị phạt." },
      { icon: CalculatorIcon, title: "Tối ưu thuế hợp pháp", desc: "Tư vấn các phương án tối ưu nghĩa vụ thuế đúng quy định." },
      { icon: DocumentCheckIcon, title: "Sổ sách minh bạch", desc: "Hạch toán rõ ràng, dễ dàng đối chiếu khi cần thiết." },
      { icon: ShieldCheckIcon, title: "Cập nhật quy định mới nhất", desc: "Đội ngũ luôn theo sát thay đổi luật thuế, kế toán." },
      { icon: TagIcon, title: "Tiết kiệm chi phí nhân sự", desc: "Không cần tuyển dụng và đào tạo kế toán nội bộ." },
      { icon: HeadsetIcon, title: "Đồng hành lâu dài", desc: "Tư vấn xuyên suốt các giai đoạn phát triển của doanh nghiệp." },
    ],
    featuresTitle: "Dịch vụ kế toán thuế bao gồm những gì?",
    featuresDescription: "Đầy đủ nghiệp vụ kế toán, thuế cho doanh nghiệp vận hành an tâm.",
    features: [
      { title: "Kê khai thuế định kỳ", desc: "Thuế giá trị gia tăng, thuế thu nhập doanh nghiệp." },
      { title: "Báo cáo tài chính", desc: "Lập báo cáo, quyết toán thuế cuối năm." },
      { title: "Hạch toán sổ sách", desc: "Theo đúng chuẩn mực kế toán hiện hành." },
      { title: "Tư vấn nghĩa vụ thuế", desc: "Cùng các chính sách ưu đãi áp dụng cho doanh nghiệp." },
      { title: "Chuẩn hoá chứng từ", desc: "Rà soát chứng từ đầu vào, đầu ra." },
      { title: "Hỗ trợ giải trình", desc: "Khi cơ quan thuế có yêu cầu kiểm tra." },
    ],
    pricingTitle: "Bảng giá kế toán & thuế",
    pricingDescription:
      "Mức phí trung bình/tháng theo số hoá đơn/quý, hiển thị đồng thời cả 3 nhóm loại hình để dễ so sánh.",
    pricing: {
      mode: "accounting",
      tableUnit: "Phí trung bình/tháng",
      groups: [
        {
          key: "A",
          label: "Nhóm A — Thương mại",
          desc: "Công ty chỉ có hoá đơn/chứng từ thương mại.",
        },
        {
          key: "B",
          label: "Nhóm B — TM + Dịch vụ",
          desc: "Công ty có hoá đơn/chứng từ thương mại kết hợp dịch vụ.",
        },
        {
          key: "C",
          label: "Nhóm C — SX/XD/Khai thác",
          desc: "Công ty thương mại - dịch vụ sản xuất, xây dựng, xây lắp, khai thác.",
        },
      ],
      tiers: [
        { range: "Không phát sinh", prices: { A: "500.000đ", B: "500.000đ", C: "500.000đ" } },
        { range: "1-30 hoá đơn", prices: { A: "700.000đ", B: "800.000đ", C: "1.000.000đ" } },
        { range: "30-50 hoá đơn", prices: { A: "900.000đ", B: "1.200.000đ", C: "1.500.000đ" } },
        { range: "50-70 hoá đơn", prices: { A: "1.300.000đ", B: "1.500.000đ", C: "2.000.000đ" } },
        { range: "70-100 hoá đơn", prices: { A: "1.700.000đ", B: "2.100.000đ", C: "2.500.000đ" } },
        { range: "100-130 hoá đơn", prices: { A: "2.100.000đ", B: "2.500.000đ", C: "3.000.000đ" } },
        { range: "130-150 hoá đơn", prices: { A: "2.400.000đ", B: "2.800.000đ", C: "3.500.000đ" } },
        { range: "150-180 hoá đơn", prices: { A: "2.700.000đ", B: "3.100.000đ", C: "4.000.000đ" } },
        { range: "180-200 hoá đơn", prices: { A: "3.000.000đ", B: "3.400.000đ", C: "4.500.000đ" } },
      ],
      surcharges: [
        {
          title: "Tờ khai hải quan",
          rows: [
            { label: "Nhóm A", value: "100 trang + 1.000.000đ" },
            { label: "Nhóm B & C: 1-100 trang", value: "1.000.000đ" },
            { label: "Nhóm B & C: 100-200 trang", value: "2.000.000đ" },
          ],
        },
        {
          title: "Xuất hoá đơn hộ",
          note: "Áp dụng chung cả 3 nhóm loại hình.",
          rows: [
            { label: "1-30 hoá đơn", value: "500.000đ/tháng" },
            { label: "31-60 hoá đơn", value: "800.000đ/tháng" },
            { label: "61-100 hoá đơn", value: "1.000.000đ/tháng" },
          ],
        },
        {
          title: "Báo cáo tài chính",
          note: "Áp dụng chung cả 3 nhóm loại hình.",
          rows: [
            { label: "Không phát sinh (KPS)", value: "800.000đ/năm" },
            { label: "Doanh thu dưới 3 tỷ", value: "1.500.000đ/năm" },
            { label: "Doanh thu trên 3 tỷ", value: "2.000.000đ/năm" },
          ],
        },
      ],
    },
    process: [
      { num: "01", title: "Liên hệ tư vấn", desc: "Chia sẻ loại hình kinh doanh và số hoá đơn phát sinh mỗi quý." },
      { num: "02", title: "Xác định mức phí", desc: "Xếp đúng nhóm loại hình và mức phí theo số lượng hoá đơn/quý." },
      { num: "03", title: "Bàn giao chứng từ", desc: "Cung cấp hoá đơn, chứng từ để đội ngũ xử lý." },
      { num: "04", title: "Vận hành định kỳ", desc: "Nhận báo cáo, kê khai đúng hạn mỗi kỳ." },
    ],
    faqs: [
      { q: "Chi phí kế toán thuế đã bao gồm những gì?", a: "Bao gồm kê khai thuế định kỳ, sổ sách kế toán và tư vấn nghĩa vụ thuế hàng tháng, đúng quy định pháp luật hiện hành theo mức phí đã xác định." },
      { q: "Làm sao biết doanh nghiệp mình thuộc nhóm loại hình A, B hay C?", a: "Nhóm A dành cho công ty chỉ có hoá đơn/chứng từ thương mại; Nhóm B dành cho công ty có cả hoá đơn thương mại và dịch vụ; Nhóm C dành cho công ty thương mại - dịch vụ sản xuất, xây dựng, xây lắp, khai thác. Đội ngũ tư vấn sẽ xác nhận lại khi bạn đăng ký." },
      { q: "Số lượng hoá đơn/quý được tính như thế nào?", a: "Tính theo tổng số hoá đơn ra, hoá đơn vào và chứng từ phát sinh trong một quý — mức phí trung bình/tháng được xác định dựa trên tổng số này." },
      { q: "Nếu doanh nghiệp tôi có khối lượng hoá đơn trên 200/quý thì sao?", a: "MAX OFFICE sẵn sàng tư vấn và báo giá riêng theo khối lượng nghiệp vụ thực tế của doanh nghiệp." },
      { q: "Tờ khai hải quan, xuất hoá đơn hộ và báo cáo tài chính có tính riêng không?", a: "Có. Đây là 3 khoản phí phát sinh thêm, chỉ tính khi doanh nghiệp thực sự có nhu cầu — mức phí cụ thể xem tại bảng phụ phí." },
      { q: "Tôi cần cung cấp chứng từ gì hàng tháng?", a: "Hoá đơn đầu vào, đầu ra và các chứng từ liên quan đến giao dịch phát sinh trong kỳ — đội ngũ sẽ hướng dẫn cụ thể khi bắt đầu hợp tác." },
      { q: "Nếu doanh nghiệp chưa phát sinh hoá đơn có cần kê khai không?", a: "Có, doanh nghiệp vẫn cần kê khai thuế định kỳ theo quy định ngay cả khi chưa phát sinh hoá đơn — mức phí áp dụng là mức 'Không phát sinh'." },
      { q: "MAX OFFICE có hỗ trợ quyết toán thuế cuối năm không?", a: "Có, dịch vụ báo cáo tài chính bao gồm lập báo cáo và hỗ trợ quyết toán thuế cuối năm cho doanh nghiệp." },
      { q: "Có bị phạt nếu chậm nộp báo cáo thuế không?", a: "Có, việc chậm nộp có thể bị xử phạt theo quy định — đây là lý do MAX OFFICE cam kết kê khai đúng hạn cho mọi kỳ báo cáo." },
      { q: "Mức phí có thể thay đổi theo từng quý không?", a: "Có, mức phí được xác định lại mỗi quý dựa trên số lượng hoá đơn/chứng từ thực tế phát sinh trong quý đó." },
      { q: "Đội ngũ kế toán có hỗ trợ khi cơ quan thuế kiểm tra không?", a: "Có, MAX OFFICE hỗ trợ chuẩn bị hồ sơ và giải trình khi doanh nghiệp có yêu cầu kiểm tra từ cơ quan thuế." },
    ],
    testimonials: [
      { quote: "Dịch vụ kế toán thuế trọn gói giúp mình yên tâm về sổ sách, không còn lo trễ hạn kê khai như trước đây.", initial: "T", name: "Anh Tuấn", role: "CEO, Việt Phát Trading" },
      { quote: "Từ ngày dùng dịch vụ, mình không còn phải nhớ deadline nộp thuế nữa — đội ngũ luôn nhắc và xử lý đúng hạn.", initial: "N", name: "Ngọc Ánh", role: "Giám đốc, Ánh Dương Retail" },
      { quote: "Mức phí tính theo đúng số hoá đơn phát sinh mỗi quý nên rất minh bạch, không lo trả thừa khi ít giao dịch.", initial: "P", name: "Hoàng Phúc", role: "CEO, Phuc Thinh Logistics" },
    ],
    comparisonTitle: "Kế toán thuê ngoài so với kế toán nội bộ",
    comparisonAlternative: "Thuê kế toán nội bộ",
    comparison: [
      { criteria: "Chi phí hàng tháng", max: "Từ 500.000đ/tháng, tính theo số hoá đơn/quý, không phát sinh lương thưởng", traditional: "Chi phí lương, bảo hiểm, phúc lợi cao hơn nhiều" },
      { criteria: "Chuyên môn", max: "Đội ngũ nhiều kế toán viên, luôn cập nhật luật mới", traditional: "Phụ thuộc vào 1 người, rủi ro khi nghỉ việc" },
      { criteria: "Tính liên tục", max: "Vận hành ổn định, không gián đoạn khi thay đổi nhân sự", traditional: "Gián đoạn khi kế toán nghỉ, phải tuyển và đào tạo lại" },
      { criteria: "Rủi ro sai sót", max: "Được kiểm tra chéo bởi nhiều chuyên viên", traditional: "Rủi ro cao hơn nếu chỉ một người phụ trách" },
      { criteria: "Chi phí quản lý", max: "Không cần quản lý nhân sự, thiết bị làm việc", traditional: "Phát sinh chi phí máy tính, phần mềm, chỗ ngồi" },
    ],
  },
};

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return SERVICES_DATA[slug];
}

export function getAllServiceSlugs(): string[] {
  return Object.keys(SERVICES_DATA);
}
