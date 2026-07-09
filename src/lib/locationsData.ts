import {
  BuildingIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  HeadsetIcon,
  BadgePercentIcon,
  MapPinIcon,
  CheckCircleIcon,
  KeyIcon,
  WifiIcon,
} from "@/components/icons";
import type { BenefitItem } from "@/components/ServiceBenefits";
import type { NearbyItem } from "@/components/LocationNearby";
import type { TransportItem } from "@/components/LocationAccess";
import type { DiningItem } from "@/components/LocationDining";
import type { FaqItem } from "@/components/Faq";
import type { Testimonial } from "@/components/Testimonials";

export type LocationListItem = {
  slug: string;
  name: string;
  shortAddress: string;
  tag?: string;
};

export const LOCATIONS_LIST: LocationListItem[] = [
  {
    slug: "dien-bien-phu",
    name: "Điện Biên Phủ, Quận 1",
    shortAddress: "Số 95 Điện Biên Phủ, P. Tân Định",
    tag: "Vị trí VIP",
  },
  {
    slug: "song-thao",
    name: "Sông Thao, Tân Bình",
    shortAddress: "Số 10 Sông Thao, P. Tân Sơn Hoà",
    tag: "Trụ sở chính",
  },
  {
    slug: "nguyen-oanh",
    name: "Nguyễn Oanh, Gò Vấp",
    shortAddress: "238-240-242 Nguyễn Oanh, P. Gò Vấp",
  },
  {
    slug: "yen-the",
    name: "Yên Thế, Tân Bình",
    shortAddress: "92 Yên Thế, P. Tân Sơn Hòa",
  },
  {
    slug: "cong-hoa",
    name: "Cộng Hoà, Tân Bình",
    shortAddress: "123 Cộng Hoà, P. Bảy Hiền",
  },
  {
    slug: "tan-thang",
    name: "Tân Thắng, Tân Phú",
    shortAddress: "121A-123-125 Tân Thắng, P. Tân Sơn Nhì",
  },
  {
    slug: "cuu-long",
    name: "Cửu Long, Tân Bình",
    shortAddress: "06-08-10 Cửu Long, P. Tân Sơn Hòa",
  },
  {
    slug: "hoang-viet",
    name: "Hoàng Việt, Tân Bình",
    shortAddress: "1/12 Hoàng Việt, P. Tân Sơn Nhất",
  },
  {
    slug: "bau-cat",
    name: "Bàu Cát 2, Tân Bình",
    shortAddress: "24A Bàu Cát 2, P. Tân Bình",
  },
  {
    slug: "lam-son",
    name: "Lam Sơn, Tân Bình",
    shortAddress: "2-2B Lam Sơn, P. Tân Sơn Hòa",
  },
  {
    slug: "hoang-ke-viem",
    name: "Hoàng Kế Viêm, Tân Bình",
    shortAddress: "26 Hoàng Kế Viêm, P. Bảy Hiền",
  },
  {
    slug: "cmt8",
    name: "CMT8, Quận 10",
    shortAddress: "283/26-28 CMT8, P. Hoà Hưng",
  },
];

export type LocationData = {
  slug: string;
  name: string;
  tag?: string;
  address: string;
  heroTitle: string;
  heroDescription: string;
  metaTitle: string;
  metaDescription: string;
  image: string;
  /** Tỉ lệ thật (W/H) của ảnh mặt tiền — khung ảnh trong LocationFacade khớp đúng tỉ lệ này để không cắt mất góc/đỉnh toà nhà. */
  facadeAspectRatio: string;
  /** Bên đặt ảnh mặt tiền trong section 2 cột đầu trang — so le giữa các chi nhánh để tạo cảm giác đa dạng. */
  facadeImageSide: "left" | "right";
  /** "cover" thay vì mặc định "contain" — chỉ dùng khi cố ý giới hạn chiều cao khung và chấp nhận cắt bớt ảnh (vd. Yên Thế). */
  facadeFit?: "cover";
  /** CSS object-position cho ảnh mặt tiền — chỉ cần khi dùng facadeFit "cover". */
  facadeObjectPosition?: string;
  /** Giới hạn chiều rộng khung ảnh mặt tiền — chỉ dùng khi tỉ lệ ảnh quá dọc khiến chiều cao render vượt hẳn cột text bên cạnh. */
  facadeMaxWidth?: string;
  /** Ảnh nội thất (lễ tân, phòng họp, chỗ ngồi...) hiển thị dạng gallery cạnh ảnh mặt tiền — chỉ một số chi nhánh có sẵn. */
  interiorImages?: {
    src: string;
    alt: string;
    caption?: string;
    objectPosition?: string;
    aspectRatio?: string;
  }[];
  intro: string[];
  benefitsTitle: string;
  benefits: BenefitItem[];
  nearbyItems: NearbyItem[];
  transportItems: TransportItem[];
  parkingInfo: string[];
  diningItems: DiningItem[];
  faqs: FaqItem[];
  testimonials: Testimonial[];
  /** Chi nhánh khác có gói văn phòng ảo giá thấp hơn (Gói LITE/START), hiển thị khi chi nhánh này chỉ bán gói cao cấp. */
  lowerTierAlternatives?: { slug: string; name: string }[];
};

const IMAGE = "/images/khong-gian-lam-viec.jpg";

/* ---------------------------------------------------------------------- */
/* Shared generic content reused across the 9 template-only branches       */
/* ---------------------------------------------------------------------- */

const GENERIC_BENEFITS: BenefitItem[] = [
  { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ", desc: "Đủ điều kiện đăng ký kinh doanh, đăng ký thuế." },
  { icon: ClockIcon, title: "Linh hoạt hợp đồng", desc: "Không ràng buộc dài hạn, dễ điều chỉnh theo nhu cầu." },
  { icon: UsersIcon, title: "Lễ tân chuyên nghiệp", desc: "Hỗ trợ tiếp khách, nhận thư từ khi cần." },
  { icon: HeadsetIcon, title: "Hỗ trợ tận tâm", desc: "Đội ngũ MAX OFFICE luôn sẵn sàng hỗ trợ." },
  { icon: BadgePercentIcon, title: "Giá minh bạch", desc: "Không phát sinh phí ẩn trong quá trình sử dụng." },
  { icon: KeyIcon, title: "Nâng cấp dễ dàng", desc: "Chuyển đổi linh hoạt giữa các gói dịch vụ." },
];

function genericIntro(name: string, address: string): string[] {
  return [
    `Văn phòng ${name} là một trong 12 địa điểm của MAX OFFICE tại TP.HCM, toạ lạc tại ${address}. Đây là lựa chọn phù hợp cho doanh nghiệp cần địa chỉ đăng ký kinh doanh hợp lệ hoặc không gian làm việc chuyên nghiệp trong khu vực.`,
    `Tại chi nhánh này, khách hàng có thể sử dụng đầy đủ các dịch vụ cốt lõi của MAX OFFICE gồm văn phòng ảo, văn phòng trọn gói, chỗ ngồi linh động, phòng họp theo giờ, thành lập doanh nghiệp và kế toán thuế — với cùng tiêu chuẩn chất lượng như tại trụ sở chính.`,
    `Nội dung chi tiết về khu vực lân cận, phương tiện di chuyển và tiện ích xung quanh của chi nhánh ${name} sẽ tiếp tục được MAX OFFICE cập nhật đầy đủ hơn trong thời gian tới. Quý khách có thể liên hệ hotline để được tư vấn cụ thể trước khi đến tham quan trực tiếp.`,
  ];
}

function genericFaqs(name: string): FaqItem[] {
  return [
    {
      q: `Địa chỉ tại ${name} có được dùng để đăng ký kinh doanh không?`,
      a: "Có. Đây là địa chỉ hợp lệ để đăng ký kinh doanh, đăng ký thuế và các thủ tục pháp lý liên quan.",
    },
    {
      q: "Chi nhánh này cung cấp những dịch vụ gì?",
      a: "Đầy đủ 6 dịch vụ cốt lõi: văn phòng ảo, văn phòng trọn gói, chỗ ngồi linh động, phòng họp theo giờ, thành lập doanh nghiệp và kế toán thuế.",
    },
    {
      q: "Tôi có thể đến tham quan trực tiếp trước khi đăng ký không?",
      a: "Có. Bạn có thể đặt lịch tham quan miễn phí qua form hoặc hotline, đội ngũ sẽ sắp xếp lịch phù hợp.",
    },
    {
      q: "Chi nhánh có chỗ đỗ xe không?",
      a: "Có khu vực gửi xe máy và ô tô, chi tiết được cung cấp khi bạn xác nhận lịch tham quan.",
    },
    {
      q: "Hợp đồng thuê tại chi nhánh này có ràng buộc dài hạn không?",
      a: "Không. Hợp đồng linh hoạt theo tháng hoặc theo năm tuỳ nhu cầu sử dụng thực tế.",
    },
    {
      q: "Nếu cần đổi sang chi nhánh khác thì có được hỗ trợ không?",
      a: "Có. MAX OFFICE hỗ trợ chuyển đổi giữa 12 chi nhánh khi bạn cần thay đổi vị trí phù hợp hơn.",
    },
  ];
}

function genericTestimonials(name: string): Testimonial[] {
  return [
    {
      quote: `MAX OFFICE tại ${name} giúp công ty mình có địa chỉ đăng ký kinh doanh nhanh chóng, thủ tục rõ ràng.`,
      initial: "H",
      name: "Thanh Hà",
      role: "Chủ doanh nghiệp",
    },
    {
      quote: `Vị trí chi nhánh ${name} khá thuận tiện cho đội ngũ mình di chuyển, đội ngũ hỗ trợ nhiệt tình.`,
      initial: "M",
      name: "Minh Quân",
      role: "Founder startup",
    },
  ];
}

function tanBinhBlock(name: string, address: string) {
  const nearbyItems: NearbyItem[] = [
    { name: "Sân bay Tân Sơn Nhất", desc: "Khu vực Tân Bình nằm gần sân bay quốc tế, thuận tiện đón tiếp đối tác." },
    { name: "Công viên Hoàng Văn Thụ", desc: "Không gian xanh gần khu vực, phù hợp nghỉ ngơi giữa giờ làm việc." },
    { name: "Khu dân cư Tân Bình", desc: "Khu vực dân cư sầm uất, nhiều tiện ích sinh hoạt xung quanh." },
    { name: "Trục đường Cộng Hoà — Trường Sơn", desc: "Kết nối nhanh đến trung tâm thành phố và các quận lân cận." },
  ];
  const transportItems: TransportItem[] = [
    { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt hoạt động qua khu vực Tân Bình." },
    { icon: ClockIcon, title: "Taxi & Grab", desc: "Dễ dàng đặt xe, thời gian chờ trung bình ngắn." },
    { icon: CheckCircleIcon, title: "Trục đường chính", desc: "Gần các trục đường lớn kết nối sân bay và trung tâm thành phố." },
    { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Đội ngũ lễ tân hỗ trợ hướng dẫn khi bạn đến lần đầu." },
  ];
  const parkingInfo = [
    "Khu vực giữ xe máy ngay tại toà nhà.",
    "Hỗ trợ chỗ đỗ ô tô theo giờ hoặc theo tháng tuỳ chi nhánh.",
    "Bảo vệ trực gác, an ninh đảm bảo trong giờ làm việc.",
  ];
  const diningItems: DiningItem[] = [
    { name: "Quán cà phê gần văn phòng", desc: "Nhiều lựa chọn quán cà phê phù hợp tiếp khách hoặc làm việc." },
    { name: "Nhà hàng khu vực Tân Bình", desc: "Đa dạng quán ăn phục vụ bữa trưa cho nhân viên và đối tác." },
    { name: "Cửa hàng tiện lợi", desc: "Thuận tiện cho nhu cầu mua sắm nhanh trong giờ làm việc." },
  ];
  return {
    intro: genericIntro(name, address),
    benefits: GENERIC_BENEFITS,
    nearbyItems,
    transportItems,
    parkingInfo,
    diningItems,
    faqs: genericFaqs(name),
    testimonials: genericTestimonials(name),
  };
}

function tanPhuBlock(name: string, address: string) {
  const nearbyItems: NearbyItem[] = [
    { name: "Khu dân cư Tân Sơn Nhì", desc: "Khu vực dân cư đông đúc, nhiều tiện ích xung quanh." },
    { name: "Chợ và trung tâm mua sắm Tân Phú", desc: "Thuận tiện cho sinh hoạt và nghỉ ngơi giữa giờ làm việc." },
    { name: "Trục đường Tân Thắng", desc: "Kết nối thuận tiện đến khu vực Tân Bình và trung tâm thành phố." },
    { name: "Các toà văn phòng lân cận", desc: "Khu vực có nhiều doanh nghiệp hoạt động, thuận tiện kết nối kinh doanh." },
  ];
  const transportItems: TransportItem[] = [
    { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Các tuyến xe buýt hoạt động qua khu vực Tân Phú." },
    { icon: ClockIcon, title: "Taxi & Grab", desc: "Dễ dàng đặt xe di chuyển trong khu vực." },
    { icon: CheckCircleIcon, title: "Trục đường chính", desc: "Gần các tuyến đường kết nối Tân Bình và Tân Phú." },
    { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Đội ngũ lễ tân hỗ trợ hướng dẫn khi bạn đến lần đầu." },
  ];
  const parkingInfo = [
    "Khu vực giữ xe máy ngay tại toà nhà.",
    "Hỗ trợ chỗ đỗ ô tô theo giờ hoặc theo tháng.",
    "Bảo vệ trực gác trong giờ làm việc.",
  ];
  const diningItems: DiningItem[] = [
    { name: "Quán cà phê khu vực Tân Phú", desc: "Nhiều lựa chọn phù hợp tiếp khách hoặc làm việc." },
    { name: "Nhà hàng lân cận", desc: "Đa dạng quán ăn phục vụ bữa trưa." },
    { name: "Cửa hàng tiện lợi", desc: "Thuận tiện cho nhu cầu mua sắm nhanh." },
  ];
  return {
    intro: genericIntro(name, address),
    benefits: GENERIC_BENEFITS,
    nearbyItems,
    transportItems,
    parkingInfo,
    diningItems,
    faqs: genericFaqs(name),
    testimonials: genericTestimonials(name),
  };
}

function quan10Block(name: string, address: string) {
  const nearbyItems: NearbyItem[] = [
    { name: "Khu vực Hoà Hưng", desc: "Khu dân cư sầm uất tại Quận 10, gần nhiều tiện ích." },
    { name: "Bệnh viện & trường học lân cận", desc: "Khu vực tập trung nhiều cơ sở y tế, giáo dục lớn." },
    { name: "Trục đường Cách Mạng Tháng 8", desc: "Kết nối nhanh đến trung tâm Quận 1, Quận 3." },
    { name: "Các toà văn phòng lân cận", desc: "Khu vực có nhiều doanh nghiệp hoạt động sôi nổi." },
  ];
  const transportItems: TransportItem[] = [
    { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt hoạt động qua trục CMT8." },
    { icon: ClockIcon, title: "Taxi & Grab", desc: "Dễ dàng đặt xe di chuyển đến trung tâm thành phố." },
    { icon: CheckCircleIcon, title: "Trục đường chính", desc: "Gần trục Cách Mạng Tháng 8 kết nối Quận 1, Quận 3." },
    { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Đội ngũ lễ tân hỗ trợ hướng dẫn khi bạn đến lần đầu." },
  ];
  const parkingInfo = [
    "Khu vực giữ xe máy ngay tại toà nhà.",
    "Hỗ trợ chỗ đỗ ô tô theo giờ hoặc theo tháng.",
    "Bảo vệ trực gác trong giờ làm việc.",
  ];
  const diningItems: DiningItem[] = [
    { name: "Quán cà phê khu vực Quận 10", desc: "Nhiều lựa chọn phù hợp tiếp khách hoặc làm việc." },
    { name: "Nhà hàng lân cận", desc: "Đa dạng quán ăn phục vụ bữa trưa." },
    { name: "Cửa hàng tiện lợi", desc: "Thuận tiện cho nhu cầu mua sắm nhanh." },
  ];
  return {
    intro: genericIntro(name, address),
    benefits: GENERIC_BENEFITS,
    nearbyItems,
    transportItems,
    parkingInfo,
    diningItems,
    faqs: genericFaqs(name),
    testimonials: genericTestimonials(name),
  };
}

/* ---------------------------------------------------------------------- */
/* Full location data                                                      */
/* ---------------------------------------------------------------------- */

export const LOCATIONS_DATA: Record<string, LocationData> = {
  /* ===================== PRIORITY 1 — SÔNG THAO ===================== */
  "song-thao": {
    slug: "song-thao",
    name: "Sông Thao, Tân Bình",
    tag: "Trụ sở chính",
    address: "Số 10 Sông Thao, Phường Tân Sơn Hoà, Quận Tân Bình, TP.HCM",
    heroTitle: "Văn Phòng Cho Thuê Sông Thao Tân Bình",
    heroDescription:
      "Trụ sở chính của MAX OFFICE — đầy đủ toàn bộ dịch vụ văn phòng ảo, văn phòng trọn gói, phòng họp và kế toán thuế, ngay gần sân bay Tân Sơn Nhất.",
    metaTitle: "Văn Phòng Ảo & Trọn Gói Tại Sông Thao, Tân Bình | Từ 350K/Tháng",
    metaDescription:
      "Thuê văn phòng ảo, văn phòng trọn gói tại Sông Thao, Tân Bình — trụ sở chính MAX OFFICE, đầy đủ dịch vụ, văn phòng ảo từ 350.000đ/tháng (gói START, BASE), gần sân bay Tân Sơn Nhất.",
    image: IMAGE,
    // Cropped to 905x1407 (see /images/originals for the uncropped source).
    facadeAspectRatio: "905 / 1407",
    facadeImageSide: "right",
    interiorImages: [
      { src: "/images/dia-diem-song-thao-khong-gian-cowrorking.jpg", alt: "Khu vực làm việc chung văn phòng Sông Thao", caption: "Không gian làm việc chung" },
      { src: "/images/dia-diem-song-thao-le-tan.jpg", alt: "Khu vực lễ tân văn phòng Sông Thao", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-song-thao-phong-hop.jpg", alt: "Phòng họp văn phòng Sông Thao", caption: "Phòng họp" },
      { src: "/images/dia-diem-song-thao-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng Sông Thao", caption: "Bảng tên công ty tại toà nhà" },
    ],
    intro: [
      "Văn phòng Sông Thao là trụ sở chính của MAX OFFICE, toạ lạc tại số 10 Sông Thao, Phường Tân Sơn Hoà, Quận Tân Bình — nơi công ty bắt đầu hoạt động từ năm 2022 và phát triển thành hệ thống 12 địa điểm tại TP.HCM như hiện nay. Đây là chi nhánh có quy mô lớn nhất, cung cấp đầy đủ toàn bộ dịch vụ của MAX OFFICE dưới một mái nhà.",
      "Với vai trò trụ sở chính, văn phòng Sông Thao là nơi đội ngũ vận hành cốt lõi làm việc trực tiếp, từ bộ phận tư vấn, kế toán, pháp lý đến chăm sóc khách hàng. Khách hàng lựa chọn chi nhánh này không chỉ được sử dụng địa chỉ đăng ký kinh doanh hợp lệ mà còn được tiếp cận nhanh chóng với đội ngũ chuyên môn giàu kinh nghiệm nhất của công ty.",
      "Vị trí tại Phường Tân Sơn Hoà giúp văn phòng Sông Thao nằm gần sân bay quốc tế Tân Sơn Nhất — lợi thế lớn cho các doanh nghiệp thường xuyên đón tiếp đối tác từ tỉnh khác hoặc nước ngoài. Khu vực xung quanh cũng tập trung nhiều toà nhà văn phòng và khu dân cư, tạo môi trường kinh doanh sôi động thuận tiện cho việc kết nối, giao dịch.",
      "Từ văn phòng ảo (gói START, BASE) với chi phí khởi điểm 350.000đ/tháng đến văn phòng trọn gói sẵn sàng sử dụng ngay, chi nhánh Sông Thao đáp ứng linh hoạt nhu cầu của mọi giai đoạn phát triển doanh nghiệp — từ công ty mới thành lập đến doanh nghiệp đang mở rộng quy mô đội ngũ.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Sông Thao",
    benefits: [
      { icon: BuildingIcon, title: "Trụ sở chính đầy đủ dịch vụ", desc: "Cung cấp toàn bộ 6 dịch vụ cốt lõi của MAX OFFICE tại một địa điểm." },
      { icon: MapPinIcon, title: "Gần sân bay Tân Sơn Nhất", desc: "Thuận tiện đón tiếp đối tác, khách hàng từ tỉnh khác hoặc nước ngoài." },
      { icon: UsersIcon, title: "Đội ngũ vận hành trực tiếp", desc: "Tiếp cận nhanh với bộ phận tư vấn, kế toán, pháp lý giàu kinh nghiệm." },
      { icon: ShieldCheckIcon, title: "Không gian rộng rãi, hiện đại", desc: "Cơ sở vật chất đầy đủ, phù hợp tiếp khách và làm việc lâu dài." },
      { icon: ClockIcon, title: "Giao thông thuận tiện", desc: "Kết nối nhanh đến trung tâm thành phố qua trục Cộng Hoà — Trường Sơn." },
      { icon: HeadsetIcon, title: "Ưu tiên hỗ trợ nhanh", desc: "Là trụ sở chính nên thời gian xử lý yêu cầu thường nhanh nhất hệ thống." },
    ],
    nearbyItems: [
      { name: "Sân bay quốc tế Tân Sơn Nhất", desc: "Nằm trong khu vực Tân Sơn Hoà, thuận tiện đón khách từ sân bay." },
      { name: "Công viên Hoàng Văn Thụ", desc: "Không gian xanh lớn của Tân Bình, phù hợp nghỉ ngơi giữa giờ làm việc." },
      { name: "Khu dân cư Tân Sơn Hoà", desc: "Khu vực dân cư sầm uất, nhiều tiện ích sinh hoạt xung quanh." },
      { name: "Các toà văn phòng lân cận", desc: "Khu vực tập trung nhiều doanh nghiệp, thuận tiện kết nối kinh doanh." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt hoạt động qua khu vực Tân Bình, gần trạm dừng." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Dễ dàng đặt xe, thời gian chờ trung bình ngắn nhờ vị trí trung tâm." },
      { icon: CheckCircleIcon, title: "Trục đường Cộng Hoà — Trường Sơn", desc: "Kết nối nhanh đến sân bay và trung tâm thành phố." },
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Đội ngũ lễ tân hỗ trợ hướng dẫn tận tình khi bạn đến lần đầu." },
    ],
    parkingInfo: [
      "Khu vực giữ xe máy rộng rãi ngay tại toà nhà.",
      "Hỗ trợ chỗ đỗ ô tô cho khách đến làm việc, tham quan.",
      "Bảo vệ trực gác 24/7, an ninh đảm bảo cho phương tiện.",
    ],
    diningItems: [
      { name: "Quán cà phê khu Tân Sơn Hoà", desc: "Nhiều lựa chọn không gian yên tĩnh, phù hợp tiếp khách hoặc làm việc." },
      { name: "Nhà hàng khu vực Tân Bình", desc: "Đa dạng quán ăn phục vụ bữa trưa cho nhân viên và đối tác." },
      { name: "Food court gần sân bay", desc: "Thuận tiện cho các buổi gặp gỡ nhanh với khách vừa đến từ sân bay." },
    ],
    faqs: [
      { q: "Văn phòng Sông Thao có phải trụ sở chính của MAX OFFICE không?", a: "Đúng vậy. Đây là trụ sở chính, nơi đội ngũ vận hành cốt lõi của MAX OFFICE làm việc trực tiếp và cung cấp đầy đủ toàn bộ dịch vụ." },
      { q: "Địa chỉ tại Sông Thao có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý để đăng ký kinh doanh, đăng ký thuế và các thủ tục liên quan." },
      { q: "Văn phòng có gần sân bay Tân Sơn Nhất không?", a: "Có. Chi nhánh nằm tại Phường Tân Sơn Hoà, rất gần sân bay quốc tế Tân Sơn Nhất, thuận tiện đón tiếp đối tác." },
      { q: "Tôi có thể sử dụng tất cả dịch vụ của MAX OFFICE tại đây không?", a: "Có. Đây là chi nhánh duy nhất cung cấp đầy đủ toàn bộ 6 dịch vụ cốt lõi cùng lúc." },
      { q: "Có chỗ đỗ xe ô tô cho khách đến tham quan không?", a: "Có. Chi nhánh hỗ trợ chỗ đỗ ô tô cho khách đến làm việc hoặc tham quan văn phòng." },
      { q: "Thời gian xử lý hồ sơ tại trụ sở chính có nhanh hơn các chi nhánh khác không?", a: "Có xu hướng nhanh hơn vì đây là nơi đội ngũ chuyên môn làm việc trực tiếp, giảm thời gian trung chuyển hồ sơ." },
      { q: "Tôi có thể đặt lịch tham quan văn phòng Sông Thao không?", a: "Có. Bạn có thể đặt lịch tham quan miễn phí qua form trên trang này hoặc gọi hotline 089 8082 188." },
      { q: "Ngoài văn phòng ảo, tôi có thể thuê văn phòng trọn gói tại đây không?", a: "Có. Chi nhánh Sông Thao có văn phòng trọn gói sẵn sàng sử dụng ngay với đầy đủ nội thất và tiện ích." },
    ],
    testimonials: [
      { quote: "Trụ sở chính MAX OFFICE tại Sông Thao có đội ngũ hỗ trợ rất chuyên nghiệp, giải quyết hồ sơ của mình nhanh gọn.", initial: "H", name: "Thanh Hà", role: "Giám đốc, ABC Logistics" },
      { quote: "Vị trí gần sân bay rất tiện cho công ty mình khi đối tác nước ngoài ghé thăm văn phòng.", initial: "Q", name: "Minh Quân", role: "Founder, TechNova Studio" },
      { quote: "Không gian văn phòng trọn gói tại đây rộng rãi, hiện đại hơn mình mong đợi.", initial: "P", name: "Thu Phương", role: "COO, Greenfield Agency" },
    ],
  },

  /* ================= PRIORITY 2 — ĐIỆN BIÊN PHỦ (VIP) ================= */
  "dien-bien-phu": {
    slug: "dien-bien-phu",
    name: "Điện Biên Phủ, Quận 1",
    tag: "Vị trí VIP",
    address: "Số 95 Điện Biên Phủ, Phường Tân Định, Quận 1, TP.HCM",
    heroTitle: "Văn Phòng Cho Thuê Điện Biên Phủ Quận 1",
    heroDescription:
      "Chi nhánh VIP nhất của MAX OFFICE — địa chỉ Quận 1 uy tín, giúp doanh nghiệp của bạn tạo ấn tượng chuyên nghiệp ngay từ địa chỉ đăng ký kinh doanh.",
    metaTitle: "Văn Phòng Ảo & Trọn Gói Quận 1 Điện Biên Phủ | Địa Chỉ Uy Tín",
    metaDescription:
      "Văn phòng ảo, văn phòng trọn gói tại Điện Biên Phủ, Phường Tân Định, Quận 1 — địa chỉ đăng ký kinh doanh uy tín, đẳng cấp cho doanh nghiệp tại trung tâm TP.HCM.",
    image: IMAGE,
    // Cropped to 934x1232 — bottom lands at the motorbike wheel touching the road (see /images/originals for the source).
    facadeAspectRatio: "934 / 1232",
    facadeImageSide: "left",
    interiorImages: [
      {
        src: "/images/dia-diem-dien-bien-phu-coworking.jpg",
        alt: "Khu vực làm việc chung văn phòng Điện Biên Phủ",
        caption: "Không gian làm việc chung",
        // Tall portrait shot — a plain center crop leans on the wall art
        // above the desks; bias down slightly to keep the desks and chairs
        // (the actual coworking setup) fully in frame.
        objectPosition: "center 62%",
      },
      { src: "/images/dia-diem-dien-bien-phu-le-tan.jpg", alt: "Khu vực lễ tân văn phòng Điện Biên Phủ", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-dien-bien-phu-phong-hop.jpg", alt: "Phòng họp văn phòng Điện Biên Phủ", caption: "Phòng họp" },
      { src: "/images/dia-diem-dien-bien-phu-phong-rieng.jpg", alt: "Phòng riêng văn phòng Điện Biên Phủ", caption: "Phòng riêng" },
      { src: "/images/dia-diem-dien-bien-phu-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng Điện Biên Phủ", caption: "Bảng tên công ty tại toà nhà" },
    ],
    intro: [
      "Văn phòng Điện Biên Phủ là chi nhánh đắc địa nhất trong hệ thống 12 địa điểm của MAX OFFICE, toạ lạc tại số 95 Điện Biên Phủ, Phường Tân Định, Quận 1 — khu vực trung tâm hành chính, tài chính và thương mại sầm uất bậc nhất TP.HCM. Đây là lựa chọn hàng đầu cho doanh nghiệp muốn khẳng định vị thế ngay từ địa chỉ đăng ký kinh doanh.",
      "Sở hữu địa chỉ Quận 1 mang lại lợi thế lớn về mặt hình ảnh và uy tín khi giao dịch với đối tác, nhà đầu tư hoặc khách hàng — đặc biệt quan trọng với các ngành nghề như tư vấn, tài chính, pháp lý hay công nghệ, nơi địa chỉ trụ sở góp phần thể hiện quy mô và độ tin cậy của doanh nghiệp.",
      "Phường Tân Định là khu vực gắn liền với nhiều địa danh quen thuộc của Sài Gòn như Nhà thờ Tân Định, chợ Tân Định và khu Đa Kao — mang đến không gian vừa cổ kính vừa hiện đại, thuận tiện di chuyển đến các quận trung tâm lân cận như Quận 3, Bình Thạnh chỉ trong vài phút.",
      "Tại chi nhánh Điện Biên Phủ, MAX OFFICE cung cấp đầy đủ dịch vụ văn phòng ảo, văn phòng trọn gói, phòng họp theo giờ, chỗ ngồi linh động cùng dịch vụ thành lập doanh nghiệp và kế toán thuế — giúp doanh nghiệp vận hành trọn vẹn ngay tại một trong những địa chỉ uy tín nhất thành phố.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Điện Biên Phủ Quận 1",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ Quận 1 uy tín", desc: "Nâng tầm hình ảnh doanh nghiệp ngay từ địa chỉ đăng ký kinh doanh." },
      { icon: MapPinIcon, title: "Vị trí trung tâm đắc địa", desc: "Gần khu Đa Kao, Tân Định — kết nối nhanh các quận trung tâm." },
      { icon: BadgePercentIcon, title: "Tăng độ tin cậy với đối tác", desc: "Địa chỉ Quận 1 tạo lợi thế khi giao dịch, gọi vốn hoặc ký hợp đồng lớn." },
      { icon: UsersIcon, title: "Phù hợp nhiều loại hình", desc: "Lý tưởng cho công ty tư vấn, tài chính, công nghệ, thương mại." },
      { icon: ClockIcon, title: "Giao thông thuận tiện", desc: "Di chuyển nhanh đến Quận 3, Bình Thạnh và trung tâm Quận 1." },
      { icon: HeadsetIcon, title: "Dịch vụ trọn gói tại chỗ", desc: "Đầy đủ văn phòng, phòng họp và hỗ trợ pháp lý ngay tại chi nhánh." },
    ],
    nearbyItems: [
      { name: "Nhà thờ Tân Định", desc: "Địa danh nổi tiếng của Sài Gòn, nằm ngay trong khu vực Phường Tân Định." },
      { name: "Chợ Tân Định", desc: "Khu chợ truyền thống sầm uất, thuận tiện sinh hoạt hàng ngày." },
      { name: "Khu Đa Kao", desc: "Khu vực trung tâm sát cạnh, tập trung nhiều văn phòng và cửa hàng." },
      { name: "Trung tâm Quận 1", desc: "Chỉ vài phút di chuyển đến khu vực trung tâm hành chính, tài chính TP.HCM." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt trung tâm hoạt động qua trục Điện Biên Phủ." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Mật độ xe cao tại khu trung tâm, thời gian chờ rất ngắn." },
      { icon: CheckCircleIcon, title: "Trục đường Điện Biên Phủ", desc: "Tuyến đường huyết mạch kết nối Quận 1, Quận 3 và Bình Thạnh." },
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Đội ngũ lễ tân hỗ trợ hướng dẫn tận tình khi bạn đến lần đầu." },
    ],
    parkingInfo: [
      "Khu vực giữ xe máy ngay tại toà nhà, thuận tiện cho khách đến làm việc.",
      "Hỗ trợ thông tin bãi đỗ ô tô gần khu vực do mật độ giao thông trung tâm Quận 1.",
      "Bảo vệ trực gác, an ninh đảm bảo trong giờ làm việc.",
    ],
    diningItems: [
      { name: "Quán cà phê khu Tân Định — Đa Kao", desc: "Nhiều quán cà phê phong cách hiện đại, phù hợp tiếp khách." },
      { name: "Nhà hàng trung tâm Quận 1", desc: "Đa dạng lựa chọn ẩm thực từ bình dân đến cao cấp." },
      { name: "Chợ Tân Định", desc: "Thuận tiện cho bữa trưa nhanh hoặc mua sắm thực phẩm." },
    ],
    faqs: [
      { q: "Vì sao địa chỉ Điện Biên Phủ Quận 1 được xem là chi nhánh VIP?", a: "Vì đây là khu vực trung tâm Quận 1 — nơi tập trung nhiều doanh nghiệp lớn, mang lại uy tín và hình ảnh chuyên nghiệp cho địa chỉ đăng ký kinh doanh." },
      { q: "Địa chỉ tại Điện Biên Phủ có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý, phù hợp đăng ký kinh doanh, đăng ký thuế cho mọi loại hình doanh nghiệp." },
      { q: "Chi phí thuê văn phòng ảo tại Quận 1 có cao hơn các chi nhánh khác không?", a: "Không có phụ phí riêng cho vị trí Quận 1. Chi nhánh này áp dụng gói START và BASE, văn phòng ảo từ 350.000đ/tháng theo đúng bảng giá chung của MAX OFFICE." },
      { q: "Vị trí này có phù hợp cho công ty tư vấn, tài chính không?", a: "Rất phù hợp. Địa chỉ Quận 1 thường được các ngành tư vấn, tài chính, pháp lý ưu tiên lựa chọn để tăng độ tin cậy với khách hàng." },
      { q: "Tôi có thể thuê phòng họp tại đây để tiếp đối tác quan trọng không?", a: "Có. Chi nhánh có phòng họp trang bị hiện đại, phù hợp tiếp đối tác, nhà đầu tư ngay tại trung tâm Quận 1." },
      { q: "Di chuyển đến chi nhánh này từ Quận 3, Bình Thạnh có xa không?", a: "Không xa. Vị trí trung tâm giúp di chuyển từ các quận lân cận chỉ mất vài phút." },
      { q: "Tôi có thể đặt lịch tham quan văn phòng Điện Biên Phủ không?", a: "Có. Bạn có thể đặt lịch tham quan miễn phí qua form trên trang này hoặc gọi hotline 089 8082 188." },
      { q: "MAX OFFICE có hỗ trợ thành lập doanh nghiệp ngay tại chi nhánh này không?", a: "Có. Dịch vụ thành lập doanh nghiệp và kế toán thuế đều được cung cấp đầy đủ tại chi nhánh Điện Biên Phủ." },
    ],
    testimonials: [
      { quote: "Địa chỉ Quận 1 giúp công ty mình tạo ấn tượng chuyên nghiệp hơn hẳn khi làm việc với đối tác nước ngoài.", initial: "V", name: "Đình Long", role: "Co-founder, LongTech JSC" },
      { quote: "Phòng họp tại chi nhánh Điện Biên Phủ rất sang trọng, phù hợp để tiếp nhà đầu tư.", initial: "K", name: "Đức Khoa", role: "Chuyên gia tư vấn độc lập" },
      { quote: "Vị trí trung tâm giúp mình dễ dàng gặp gỡ khách hàng ở khu vực Quận 1, Quận 3.", initial: "N", name: "Ngọc Ánh", role: "Giám đốc, Ánh Dương Retail" },
    ],
  },

  /* ================== PRIORITY 3 — NGUYỄN OANH GÒ VẤP ================== */
  "nguyen-oanh": {
    slug: "nguyen-oanh",
    name: "Nguyễn Oanh, Gò Vấp",
    address: "238-240-242 Nguyễn Oanh, Phường Gò Vấp, TP.HCM",
    heroTitle: "Văn Phòng Cho Thuê Nguyễn Oanh Gò Vấp",
    heroDescription:
      "Văn phòng ảo hạng A tại Gò Vấp — một trong số ít lựa chọn chất lượng cao tại khu vực, mức giá cạnh tranh trực tiếp với thị trường nhưng đi kèm nhiều đặc quyền vượt trội.",
    metaTitle: "Văn Phòng Ảo Hạng A Tại Gò Vấp Nguyễn Oanh | Từ 595K/Tháng",
    metaDescription:
      "Văn phòng ảo tại Nguyễn Oanh, Gò Vấp — toà nhà hạng A, một trong số ít lựa chọn chất lượng cao tại khu vực. Từ 595.000đ/tháng (gói ORIGIN, ORIGIN+, RISE), kèm tư vấn AI, ưu tiên hỗ trợ 24/7, phòng họp.",
    image: IMAGE,
    facadeAspectRatio: "1254 / 1254",
    facadeImageSide: "left",
    interiorImages: [
      { src: "/images/dia-diem-nguyen-oanh-le-tan.jpg", alt: "Khu vực lễ tân văn phòng Nguyễn Oanh", caption: "Quầy lễ tân" },
      {
        src: "/images/dia-diem-nguyen-oanh-bang-ten.jpg",
        alt: "Bảng tên công ty tại toà nhà văn phòng Nguyễn Oanh",
        caption: "Bảng tên công ty tại toà nhà",
        // Tall board (852x1227) in a 4:3 cell — a center crop cuts off the
        // building name at the top, so anchor to the top instead.
        objectPosition: "top",
      },
    ],
    intro: [
      "Văn phòng Nguyễn Oanh nằm tại 238-240-242 Nguyễn Oanh, Phường Gò Vấp, toạ lạc trong một toà nhà hạng A — chất lượng xây dựng và tiện ích vượt trội so với mặt bằng chung khu vực. Đây là lựa chọn phù hợp cho doanh nghiệp đang tăng trưởng, cần địa chỉ uy tín cùng các tiện ích hỗ trợ vận hành thực chất như tư vấn tự động hoá AI, ưu tiên hỗ trợ 24/7 và phòng họp đi kèm.",
      "Khu vực Gò Vấp hiện có rất ít đơn vị khai thác văn phòng ảo đạt chuẩn hạng A — nguồn cung khan hiếm khiến mặt bằng giá chung tại đây thường từ 595.000đ/tháng trở lên. Văn phòng Nguyễn Oanh của MAX OFFICE cung cấp các gói ORIGIN, ORIGIN+ và RISE ở đúng mức giá cạnh tranh này, nhưng đi kèm nhiều đặc quyền mà các lựa chọn khác trong khu vực thường không có.",
      "Trục đường Nguyễn Oanh là một trong những tuyến đường chính của Gò Vấp, kết nối thuận tiện đến các khu vực lân cận như Phú Nhuận, Tân Bình và trung tâm thành phố. Giao thông khu vực khá thuận lợi với nhiều tuyến xe buýt và dễ dàng di chuyển bằng taxi, xe công nghệ.",
      "Tại chi nhánh này, khách hàng có thể sử dụng đầy đủ dịch vụ từ văn phòng ảo, chỗ ngồi linh động, phòng họp theo giờ đến dịch vụ thành lập doanh nghiệp và kế toán thuế — phù hợp với doanh nghiệp tại khu vực Gò Vấp muốn vận hành từ một địa chỉ hạng A mà không phải di chuyển xa vào trung tâm.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Nguyễn Oanh Gò Vấp",
    benefits: [
      { icon: BadgePercentIcon, title: "Chất lượng hạng A, giá cạnh tranh khu vực", desc: "Toà nhà hạng A hiếm có tại Gò Vấp — mức giá từ 595.000đ/tháng ngang bằng mặt bằng chung khu vực, nhưng đi kèm nhiều tiện ích vượt trội." },
      { icon: UsersIcon, title: "Khu vực đông dân cư", desc: "Thuận tiện tiếp cận khách hàng, đối tác trong khu vực Gò Vấp." },
      { icon: ClockIcon, title: "Giao thông thuận tiện", desc: "Kết nối nhanh đến Phú Nhuận, Tân Bình và trung tâm thành phố." },
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ", desc: "Đủ điều kiện đăng ký kinh doanh, đăng ký thuế cho hộ kinh doanh và công ty." },
      { icon: WifiIcon, title: "Hạ tầng đầy đủ", desc: "Wifi tốc độ cao, không gian làm việc hiện đại." },
      { icon: HeadsetIcon, title: "Hỗ trợ tận tâm", desc: "Đội ngũ tư vấn hỗ trợ nhanh chóng cho khách hàng khu vực Gò Vấp." },
    ],
    nearbyItems: [
      { name: "Chợ Gò Vấp", desc: "Khu chợ truyền thống lớn, trung tâm sinh hoạt của khu vực." },
      { name: "Công viên Làng Hoa Gò Vấp", desc: "Không gian xanh lớn, phù hợp nghỉ ngơi giữa giờ làm việc." },
      { name: "Khu dân cư Nguyễn Oanh", desc: "Khu vực dân cư đông đúc, sầm uất, nhiều tiện ích xung quanh." },
      { name: "Trục đường Phan Văn Trị", desc: "Kết nối thuận tiện đến Phú Nhuận và trung tâm thành phố." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt hoạt động qua trục Nguyễn Oanh, Phan Văn Trị." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Dễ dàng đặt xe, mật độ phương tiện cao trong khu vực." },
      { icon: CheckCircleIcon, title: "Trục đường Nguyễn Oanh", desc: "Tuyến đường chính kết nối Gò Vấp với Phú Nhuận, Tân Bình." },
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Đội ngũ lễ tân hỗ trợ hướng dẫn tận tình khi bạn đến lần đầu." },
    ],
    parkingInfo: [
      "Khu vực giữ xe máy rộng rãi ngay tại toà nhà.",
      "Hỗ trợ chỗ đỗ ô tô cho khách đến làm việc, tham quan.",
      "Bảo vệ trực gác, an ninh đảm bảo trong giờ làm việc.",
    ],
    diningItems: [
      { name: "Quán cà phê khu Gò Vấp", desc: "Nhiều lựa chọn quán cà phê bình dân đến hiện đại." },
      { name: "Nhà hàng khu vực Nguyễn Oanh", desc: "Đa dạng quán ăn phục vụ bữa trưa cho nhân viên." },
      { name: "Chợ Gò Vấp", desc: "Thuận tiện mua sắm thực phẩm, ăn uống nhanh." },
    ],
    faqs: [
      { q: "Văn phòng Nguyễn Oanh có phù hợp cho hộ kinh doanh không?", a: "Phù hợp nếu bạn cần địa chỉ tại một toà nhà hạng A cùng các tiện ích đi kèm như tư vấn AI, ưu tiên hỗ trợ 24/7 và phòng họp. Khu vực Gò Vấp hiện có rất ít lựa chọn văn phòng ảo hạng A, nên chi nhánh này áp dụng các gói từ ORIGIN trở lên (595.000đ/tháng) — mức giá cạnh tranh với mặt bằng chung khu vực chứ không phải mức giá thấp nhất hệ thống. Nếu bạn cần gói giá thấp hơn (Gói LITE hoặc START) để tối ưu chi phí ban đầu, MAX OFFICE có sẵn tại các chi nhánh Hoàng Việt, Bàu Cát 2, Lam Sơn, Hoàng Kế Viêm, CMT8, Sông Thao và Điện Biên Phủ." },
      { q: "Địa chỉ tại Nguyễn Oanh có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý để đăng ký kinh doanh, đăng ký thuế." },
      { q: "Giá văn phòng ảo tại đây có khác gì so với các chi nhánh khác không?", a: "Có. Nguyễn Oanh là toà nhà hạng A — phân khúc hiếm tại Gò Vấp, nên chi nhánh này chỉ áp dụng các gói từ ORIGIN trở lên (595.000đ/tháng), không có Gói LITE/START/BASE. Đổi lại, các gói này đi kèm tư vấn AI, ưu tiên hỗ trợ 24/7 và phòng họp mà các lựa chọn giá thấp hơn không có." },
      { q: "Khu vực Gò Vấp có thuận tiện di chuyển đến trung tâm thành phố không?", a: "Có. Trục đường Nguyễn Oanh — Phan Văn Trị kết nối khá nhanh đến Phú Nhuận và trung tâm TP.HCM." },
      { q: "Tôi có thể thuê chỗ ngồi linh động tại chi nhánh này không?", a: "Có. Chi nhánh cung cấp đầy đủ dịch vụ chỗ ngồi linh động, phù hợp freelancer và nhóm nhỏ tại khu vực Gò Vấp." },
      { q: "Chi nhánh có hỗ trợ kế toán thuế cho hộ kinh doanh không?", a: "Có. Dịch vụ kế toán thuế trọn gói từ 500.000đ/tháng được cung cấp đầy đủ tại đây." },
      { q: "Tôi có thể đặt lịch tham quan văn phòng Nguyễn Oanh không?", a: "Có. Bạn có thể đặt lịch tham quan miễn phí qua form trên trang này hoặc gọi hotline 089 8082 188." },
      { q: "Văn phòng có chỗ đỗ xe cho khách vãng lai không?", a: "Có. Khu vực giữ xe máy và hỗ trợ đỗ ô tô ngay tại toà nhà." },
    ],
    testimonials: [
      { quote: "Toà nhà hạng A, cơ sở vật chất tốt hơn hẳn các văn phòng ảo mình từng xem qua ở Gò Vấp — xứng đáng với mức giá.", initial: "L", name: "Ngọc Lan", role: "Giám đốc, Lan's Beauty Group" },
      { quote: "Vị trí gần nhà nên mình chọn chi nhánh này để đăng ký kinh doanh, tiết kiệm thời gian di chuyển.", initial: "T", name: "Anh Tuấn", role: "CEO, Việt Phát Trading" },
      { quote: "Nhân viên tư vấn nhiệt tình, giải thích rõ ràng về chi phí, không phát sinh gì thêm.", initial: "M", name: "Thảo My", role: "Founder, Handmade Corner" },
    ],
    lowerTierAlternatives: [
      { slug: "hoang-viet", name: "Hoàng Việt, Tân Bình" },
      { slug: "bau-cat", name: "Bàu Cát 2, Tân Bình" },
      { slug: "lam-son", name: "Lam Sơn, Tân Bình" },
      { slug: "hoang-ke-viem", name: "Hoàng Kế Viêm, Tân Bình" },
      { slug: "cmt8", name: "CMT8, Quận 10" },
      { slug: "song-thao", name: "Sông Thao, Tân Bình" },
      { slug: "dien-bien-phu", name: "Điện Biên Phủ, Quận 1" },
    ],
  },

  /* ===================== REMAINING 9 — TEMPLATE ONLY ===================== */
  "yen-the": {
    slug: "yen-the",
    name: "Yên Thế, Tân Bình",
    address: "92 Yên Thế, Phường Tân Sơn Hòa, Quận Tân Bình, TP.HCM",
    heroTitle: "Văn Phòng Cho Thuê Yên Thế Tân Bình",
    heroDescription: "Chi nhánh MAX OFFICE tại Yên Thế, Tân Bình — văn phòng ảo từ 500.000đ/tháng (gói BASE, ORIGIN, ORIGIN+), đầy đủ dịch vụ cốt lõi.",
    metaTitle: "Văn Phòng Ảo & Cho Thuê Văn Phòng Yên Thế Tân Bình | Từ 500K/Tháng",
    metaDescription: "Thuê văn phòng ảo, văn phòng trọn gói tại Yên Thế, Phường Tân Sơn Hòa, Tân Bình — văn phòng ảo từ 500.000đ/tháng (gói BASE, ORIGIN, ORIGIN+), đầy đủ dịch vụ MAX OFFICE.",
    image: IMAGE,
    // Real facade shot is landscape (1484x1060), but the composition leaves a
    // lot of foreground street/sidewalk at the bottom — cap the box to a more
    // compact ratio and anchor to the top so the building itself fills more
    // of the frame instead of the street.
    facadeAspectRatio: "4 / 3",
    facadeImageSide: "right",
    facadeFit: "cover",
    facadeObjectPosition: "top",
    interiorImages: [
      { src: "/images/dia-diem-yen-the-le-tan.jpg", alt: "Khu vực lễ tân văn phòng Yên Thế", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-yen-the-phong-hop.jpg", alt: "Phòng họp văn phòng Yên Thế", caption: "Phòng họp" },
      {
        src: "/images/dia-diem-yen-the-phong-opp.jpg",
        alt: "Phòng đào tạo & sự kiện văn phòng Yên Thế",
        caption: "Phòng đào tạo & sự kiện — sức chứa 30-50 người",
      },
      {
        src: "/images/dia-diem-yen-the-bang-ten.jpg",
        alt: "Bảng tên công ty tại toà nhà văn phòng Yên Thế",
        caption: "Bảng tên công ty tại toà nhà",
        // Tall board photo — the MAX OFFICE header and top rows of company
        // plates are what identify it; the lower third is blank panel, so
        // anchor the crop to the top instead of centering.
        objectPosition: "center top",
      },
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Yên Thế",
    ...tanBinhBlock("Yên Thế, Tân Bình", "92 Yên Thế, Phường Tân Sơn Hòa, Quận Tân Bình, TP.HCM"),
  },
  "cong-hoa": {
    slug: "cong-hoa",
    name: "Cộng Hoà, Tân Bình",
    address: "123 Cộng Hoà, Phường Bảy Hiền, Quận Tân Bình, TP.HCM",
    heroTitle: "Văn Phòng Cho Thuê Cộng Hoà Tân Bình",
    heroDescription: "Chi nhánh MAX OFFICE tại Cộng Hoà, Tân Bình — văn phòng ảo từ 500.000đ/tháng (gói BASE, ORIGIN, ORIGIN+), đầy đủ dịch vụ cốt lõi.",
    metaTitle: "Văn Phòng Ảo & Cho Thuê Văn Phòng Cộng Hoà Tân Bình | Từ 500K/Tháng",
    metaDescription: "Thuê văn phòng ảo, văn phòng trọn gói tại Cộng Hoà, Phường Bảy Hiền, Tân Bình — văn phòng ảo từ 500.000đ/tháng (gói BASE, ORIGIN, ORIGIN+), đầy đủ dịch vụ MAX OFFICE.",
    image: IMAGE,
    // Cropped to 934x1074 — widened 40% from the first pass (which was too
    // narrow/tall) and bottom pulled back to the median hedge, not the road
    // (see /images/originals for the source). Ratio is balanced enough now
    // that no maxWidth cap is needed.
    facadeAspectRatio: "934 / 1074",
    facadeImageSide: "right",
    interiorImages: [
      { src: "/images/dia-diem-cong-hoa-le-tan.jpg", alt: "Khu vực lễ tân văn phòng Cộng Hoà", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-cong-hoa-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng Cộng Hoà", caption: "Bảng tên công ty tại toà nhà" },
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Cộng Hoà",
    ...tanBinhBlock("Cộng Hoà, Tân Bình", "123 Cộng Hoà, Phường Bảy Hiền, Quận Tân Bình, TP.HCM"),
  },
  "tan-thang": {
    slug: "tan-thang",
    name: "Tân Thắng, Tân Phú",
    address: "121A-123-125 Tân Thắng, Phường Tân Sơn Nhì, Quận Tân Phú, TP.HCM",
    heroTitle: "Văn Phòng Cho Thuê Tân Thắng Tân Phú",
    heroDescription: "Chi nhánh MAX OFFICE tại Tân Thắng, Tân Phú — văn phòng ảo từ 500.000đ/tháng (gói BASE, ORIGIN, ORIGIN+), đầy đủ dịch vụ cốt lõi.",
    metaTitle: "Văn Phòng Ảo & Cho Thuê Văn Phòng Tân Thắng Tân Phú | Từ 500K/Tháng",
    metaDescription: "Thuê văn phòng ảo, văn phòng trọn gói tại Tân Thắng, Phường Tân Sơn Nhì, Tân Phú — văn phòng ảo từ 500.000đ/tháng (gói BASE, ORIGIN, ORIGIN+), đầy đủ dịch vụ MAX OFFICE.",
    image: IMAGE,
    facadeAspectRatio: "1484 / 1060",
    facadeImageSide: "left",
    interiorImages: [
      { src: "/images/dia-diem-tan-thang-le-tan.jpg", alt: "Khu vực lễ tân văn phòng Tân Thắng", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-tan-thang-phong-hop.jpg", alt: "Phòng họp văn phòng Tân Thắng", caption: "Phòng họp" },
      { src: "/images/dia-diem-tan-thang-cho-ngoi.jpg", alt: "Khu vực chỗ ngồi văn phòng Tân Thắng", caption: "Không gian làm việc chung" },
      { src: "/images/dia-diem-tan-thang-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng Tân Thắng", caption: "Bảng tên công ty tại toà nhà" },
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Tân Thắng",
    ...tanPhuBlock("Tân Thắng, Tân Phú", "121A-123-125 Tân Thắng, Phường Tân Sơn Nhì, Quận Tân Phú, TP.HCM"),
  },
  "cuu-long": {
    slug: "cuu-long",
    name: "Cửu Long, Tân Bình",
    address: "06-08-10 Cửu Long, Phường Tân Sơn Hòa, Quận Tân Bình, TP.HCM",
    heroTitle: "Văn Phòng Cho Thuê Cửu Long Tân Bình",
    heroDescription: "Chi nhánh MAX OFFICE tại Cửu Long, Tân Bình — văn phòng ảo từ 500.000đ/tháng (gói BASE), đầy đủ dịch vụ cốt lõi.",
    metaTitle: "Văn Phòng Ảo & Cho Thuê Văn Phòng Cửu Long Tân Bình | Từ 500K/Tháng",
    metaDescription: "Thuê văn phòng ảo, văn phòng trọn gói tại Cửu Long, Phường Tân Sơn Hòa, Tân Bình — văn phòng ảo từ 500.000đ/tháng (gói BASE), đầy đủ dịch vụ MAX OFFICE.",
    image: IMAGE,
    // Cropped to 1085x1297 (see /images/originals for the uncropped source).
    facadeAspectRatio: "1085 / 1297",
    facadeImageSide: "right",
    interiorImages: [
      { src: "/images/dia-diem-cuu-long-le-tan.jpg", alt: "Khu vực lễ tân văn phòng Cửu Long", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-cuu-long-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng Cửu Long", caption: "Bảng tên công ty tại toà nhà" },
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Cửu Long",
    ...tanBinhBlock("Cửu Long, Tân Bình", "06-08-10 Cửu Long, Phường Tân Sơn Hòa, Quận Tân Bình, TP.HCM"),
  },
  "hoang-viet": {
    slug: "hoang-viet",
    name: "Hoàng Việt, Tân Bình",
    address: "1/12 Hoàng Việt, Phường Tân Sơn Nhất, Quận Tân Bình, TP.HCM",
    heroTitle: "Văn Phòng Cho Thuê Hoàng Việt Tân Bình",
    heroDescription: "Chi nhánh MAX OFFICE tại Hoàng Việt, Tân Bình — văn phòng ảo từ 299.000đ/tháng, đầy đủ dịch vụ cốt lõi.",
    metaTitle: "Văn Phòng Ảo & Cho Thuê Văn Phòng Hoàng Việt Tân Bình | MAX OFFICE",
    metaDescription: "Thuê văn phòng ảo, văn phòng trọn gói tại Hoàng Việt, Phường Tân Sơn Nhất, Tân Bình — giá từ 299.000đ/tháng, đầy đủ dịch vụ MAX OFFICE.",
    image: IMAGE,
    // Cropped to 1122x1394 — bottom extended to the road (see /images/originals for the source).
    facadeAspectRatio: "1122 / 1394",
    facadeImageSide: "left",
    interiorImages: [
      { src: "/images/dia-diem-hoang-viet-le-tan.jpg", alt: "Khu vực lễ tân văn phòng Hoàng Việt", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-hoang-viet-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng Hoàng Việt", caption: "Bảng tên công ty tại toà nhà" },
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Hoàng Việt",
    ...tanBinhBlock("Hoàng Việt, Tân Bình", "1/12 Hoàng Việt, Phường Tân Sơn Nhất, Quận Tân Bình, TP.HCM"),
  },
  "bau-cat": {
    slug: "bau-cat",
    name: "Bàu Cát 2, Tân Bình",
    address: "24A Bàu Cát 2, Phường Tân Bình, TP.HCM",
    heroTitle: "Văn Phòng Cho Thuê Bàu Cát 2 Tân Bình",
    heroDescription: "Chi nhánh MAX OFFICE tại Bàu Cát 2, Tân Bình — văn phòng ảo từ 299.000đ/tháng, đầy đủ dịch vụ cốt lõi.",
    metaTitle: "Văn Phòng Ảo & Cho Thuê Văn Phòng Bàu Cát 2 Tân Bình | MAX OFFICE",
    metaDescription: "Thuê văn phòng ảo, văn phòng trọn gói tại Bàu Cát 2, Phường Tân Bình — giá từ 299.000đ/tháng, đầy đủ dịch vụ MAX OFFICE.",
    image: IMAGE,
    facadeAspectRatio: "1448 / 1086",
    facadeImageSide: "right",
    interiorImages: [
      { src: "/images/dia-diem-bau-cat-coworking.jpg", alt: "Khu vực làm việc chung văn phòng Bàu Cát 2", caption: "Không gian làm việc chung" },
      { src: "/images/dia-diem-bau-cat-le-tan.jpg", alt: "Khu vực lễ tân văn phòng Bàu Cát 2", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-bau-cat-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng Bàu Cát 2", caption: "Bảng tên công ty tại toà nhà" },
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Bàu Cát 2",
    ...tanBinhBlock("Bàu Cát 2, Tân Bình", "24A Bàu Cát 2, Phường Tân Bình, TP.HCM"),
  },
  "lam-son": {
    slug: "lam-son",
    name: "Lam Sơn, Tân Bình",
    address: "2-2B Lam Sơn, Phường Tân Sơn Hòa, Quận Tân Bình, TP.HCM",
    heroTitle: "Văn Phòng Cho Thuê Lam Sơn Tân Bình",
    heroDescription: "Chi nhánh MAX OFFICE tại Lam Sơn, Tân Bình — văn phòng ảo từ 299.000đ/tháng, đầy đủ dịch vụ cốt lõi.",
    metaTitle: "Văn Phòng Ảo & Cho Thuê Văn Phòng Lam Sơn Tân Bình | MAX OFFICE",
    metaDescription: "Thuê văn phòng ảo, văn phòng trọn gói tại Lam Sơn, Phường Tân Sơn Hòa, Tân Bình — giá từ 299.000đ/tháng, đầy đủ dịch vụ MAX OFFICE.",
    image: IMAGE,
    facadeAspectRatio: "1390 / 1132",
    facadeImageSide: "left",
    interiorImages: [
      { src: "/images/dia-diem-lam-son-le-tan.jpg", alt: "Khu vực lễ tân văn phòng Lam Sơn", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-lam-son-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng Lam Sơn", caption: "Bảng tên công ty tại toà nhà" },
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Lam Sơn",
    ...tanBinhBlock("Lam Sơn, Tân Bình", "2-2B Lam Sơn, Phường Tân Sơn Hòa, Quận Tân Bình, TP.HCM"),
  },
  "hoang-ke-viem": {
    slug: "hoang-ke-viem",
    name: "Hoàng Kế Viêm, Tân Bình",
    address: "26 Hoàng Kế Viêm, Phường Bảy Hiền, Quận Tân Bình, TP.HCM",
    heroTitle: "Văn Phòng Cho Thuê Hoàng Kế Viêm Tân Bình",
    heroDescription: "Chi nhánh MAX OFFICE tại Hoàng Kế Viêm, Tân Bình — văn phòng ảo từ 299.000đ/tháng, đầy đủ dịch vụ cốt lõi.",
    metaTitle: "Văn Phòng Ảo & Cho Thuê Văn Phòng Hoàng Kế Viêm Tân Bình | MAX OFFICE",
    metaDescription: "Thuê văn phòng ảo, văn phòng trọn gói tại Hoàng Kế Viêm, Phường Bảy Hiền, Tân Bình — giá từ 299.000đ/tháng, đầy đủ dịch vụ MAX OFFICE.",
    image: IMAGE,
    facadeAspectRatio: "1448 / 1086",
    facadeImageSide: "left",
    interiorImages: [
      {
        src: "/images/dia-diem-hoang-ke-viem-bang-ten.jpg",
        alt: "Bảng tên công ty tại toà nhà văn phòng Hoàng Kế Viêm",
        caption: "Bảng tên công ty tại toà nhà",
        // Square (1024x1024) photo — the generic 3:4 solo box left letterbox
        // gaps above/below; hug the image's real ratio instead.
        aspectRatio: "1 / 1",
      },
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Hoàng Kế Viêm",
    ...tanBinhBlock("Hoàng Kế Viêm, Tân Bình", "26 Hoàng Kế Viêm, Phường Bảy Hiền, Quận Tân Bình, TP.HCM"),
  },
  cmt8: {
    slug: "cmt8",
    name: "CMT8, Quận 10",
    address: "283/26-28 Cách Mạng Tháng 8, Phường Hoà Hưng, Quận 10, TP.HCM",
    heroTitle: "Văn Phòng Cho Thuê CMT8 Quận 10",
    heroDescription: "Chi nhánh MAX OFFICE tại Cách Mạng Tháng 8, Quận 10 — văn phòng ảo từ 299.000đ/tháng, đầy đủ dịch vụ cốt lõi.",
    metaTitle: "Văn Phòng Ảo & Cho Thuê Văn Phòng CMT8 Quận 10 | MAX OFFICE",
    metaDescription: "Thuê văn phòng ảo, văn phòng trọn gói tại Cách Mạng Tháng 8, Phường Hoà Hưng, Quận 10 — giá từ 299.000đ/tháng, đầy đủ dịch vụ MAX OFFICE.",
    image: IMAGE,
    // Cropped to 1086x1206 — bottom lands at the sidewalk/road curb line (see /images/originals for the source).
    facadeAspectRatio: "1086 / 1206",
    facadeImageSide: "right",
    interiorImages: [
      { src: "/images/dia-diem-cmt8-le-tan.jpg", alt: "Khu vực lễ tân văn phòng CMT8", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-cmt8-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng CMT8", caption: "Bảng tên công ty tại toà nhà" },
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng CMT8",
    ...quan10Block("CMT8, Quận 10", "283/26-28 Cách Mạng Tháng 8, Phường Hoà Hưng, Quận 10, TP.HCM"),
  },
};

export function getLocationBySlug(slug: string): LocationData | undefined {
  return LOCATIONS_DATA[slug];
}

export function getAllLocationSlugs(): string[] {
  return Object.keys(LOCATIONS_DATA);
}
