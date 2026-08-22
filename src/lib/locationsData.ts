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

export type AreaInfo = {
  slug: string;
  /** Tên đầy đủ dùng cho breadcrumb, tiêu đề trang, meta — mô tả khu vực địa lý thông thường, không phải đơn vị hành chính chính thức (TP.HCM đã bỏ cấp Quận từ 1/7/2025). */
  name: string;
  description: string;
};

export const AREAS: AreaInfo[] = [
  {
    slug: "quan-tan-binh-cu",
    name: "Quận Tân Bình (cũ)",
    description:
      "Khu vực tập trung nhiều chi nhánh MAX OFFICE nhất, gần sân bay Tân Sơn Nhất, trải khắp các phường Tân Sơn Hoà, Tân Sơn Nhất, Bảy Hiền và Tân Bình.",
  },
  {
    slug: "quan-1-cu",
    name: "Quận 1 (cũ)",
    description:
      "Khu vực trung tâm hành chính, tài chính và thương mại sầm uất bậc nhất TP.HCM, thuộc phường Tân Định.",
  },
  {
    slug: "quan-go-vap-cu",
    name: "Quận Gò Vấp (cũ)",
    description: "Khu vực dân cư đông đúc phía Bắc thành phố, không xa sân bay Tân Sơn Nhất.",
  },
  {
    slug: "quan-tan-phu-cu",
    name: "Quận Tân Phú (cũ)",
    description: "Khu vực phát triển nhanh phía Tây thành phố, gần Aeon Mall Tân Phú Celadon.",
  },
  {
    slug: "quan-10-cu",
    name: "Quận 10 (cũ)",
    description: "Khu vực gần Ga Sài Gòn, kết nối thuận tiện đến Quận 1 và Quận 3.",
  },
  {
    slug: "thu-duc-cu",
    name: "Tp. Thủ Đức (Cũ)",
    description: "Khu vực cửa ngõ Đông Bắc thành phố, gần các trường đại học lớn và sông Sài Gòn.",
  },
  {
    slug: "quan-7-cu",
    name: "Quận 7 (cũ)",
    description: "Khu vực Nam Sài Gòn, gần Khu chế xuất Tân Thuận và khu đô thị Phú Mỹ Hưng.",
  },
];

export function getAreaBySlug(slug: string): AreaInfo | undefined {
  return AREAS.find((a) => a.slug === slug);
}

const AREA_TAN_BINH = { slug: "quan-tan-binh-cu", name: "Quận Tân Bình (cũ)" };
const AREA_QUAN_1 = { slug: "quan-1-cu", name: "Quận 1 (cũ)" };
const AREA_GO_VAP = { slug: "quan-go-vap-cu", name: "Quận Gò Vấp (cũ)" };
const AREA_TAN_PHU = { slug: "quan-tan-phu-cu", name: "Quận Tân Phú (cũ)" };
const AREA_QUAN_10 = { slug: "quan-10-cu", name: "Quận 10 (cũ)" };
const AREA_THU_DUC = { slug: "thu-duc-cu", name: "Tp. Thủ Đức (Cũ)" };
const AREA_QUAN_7 = { slug: "quan-7-cu", name: "Quận 7 (cũ)" };

export type LocationListItem = {
  slug: string;
  name: string;
  shortAddress: string;
  tag?: string;
  area: { slug: string; name: string };
};

export const LOCATIONS_LIST: LocationListItem[] = [
  {
    slug: "dien-bien-phu",
    name: "Điện Biên Phủ, Quận 1",
    shortAddress: "Số 95 Điện Biên Phủ, P. Tân Định",
    tag: "Vị trí VIP",
    area: AREA_QUAN_1,
  },
  {
    slug: "song-thao",
    name: "Sông Thao, Tân Bình",
    shortAddress: "Số 10 Sông Thao, P. Tân Sơn Hoà",
    tag: "Trụ sở chính",
    area: AREA_TAN_BINH,
  },
  {
    slug: "nguyen-oanh",
    name: "Nguyễn Oanh, Gò Vấp",
    shortAddress: "238-240-242 Nguyễn Oanh, P. Gò Vấp",
    area: AREA_GO_VAP,
  },
  {
    slug: "yen-the",
    name: "Yên Thế, Tân Bình",
    shortAddress: "92 Yên Thế, P. Tân Sơn Hòa",
    area: AREA_TAN_BINH,
  },
  {
    slug: "cong-hoa",
    name: "Cộng Hoà, Tân Bình",
    shortAddress: "123 Cộng Hoà, P. Bảy Hiền",
    area: AREA_TAN_BINH,
  },
  {
    slug: "tan-thang",
    name: "Tân Thắng, Tân Phú",
    shortAddress: "121A-123-125 Tân Thắng, P. Tân Sơn Nhì",
    area: AREA_TAN_PHU,
  },
  {
    slug: "cuu-long",
    name: "Cửu Long, Tân Bình",
    shortAddress: "06-08-10 Cửu Long, P. Tân Sơn Hòa",
    area: AREA_TAN_BINH,
  },
  {
    slug: "hoang-viet",
    name: "Hoàng Việt, Tân Bình",
    shortAddress: "1/12 Hoàng Việt, P. Tân Sơn Nhất",
    area: AREA_TAN_BINH,
  },
  {
    slug: "bau-cat",
    name: "Bàu Cát 2, Tân Bình",
    shortAddress: "24A Bàu Cát 2, P. Tân Bình",
    area: AREA_TAN_BINH,
  },
  {
    slug: "lam-son",
    name: "Lam Sơn, Tân Bình",
    shortAddress: "2-2B Lam Sơn, P. Tân Sơn Hòa",
    area: AREA_TAN_BINH,
  },
  {
    slug: "hoang-ke-viem",
    name: "Hoàng Kế Viêm, Tân Bình",
    shortAddress: "26 Hoàng Kế Viêm, P. Bảy Hiền",
    area: AREA_TAN_BINH,
  },
  {
    slug: "cmt8",
    name: "CMT8, Quận 10",
    shortAddress: "283/26-28 CMT8, P. Hoà Hưng",
    area: AREA_QUAN_10,
  },
  {
    slug: "vuon-lai",
    name: "314/6 Điện Biên Phủ, Quận 10 (cũ)",
    shortAddress: "314/6 Điện Biên Phủ, P. Vườn Lài",
    area: AREA_QUAN_10,
  },
  {
    slug: "pham-van-dong",
    name: "Phạm Văn Đồng, Thủ Đức",
    shortAddress: "1148A Phạm Văn Đồng, P. Thủ Đức",
    area: AREA_THU_DUC,
  },
  {
    slug: "quan-7",
    name: "Bùi Văn Ba, Quận 7",
    shortAddress: "210 Bùi Văn Ba, P. Tân Thuận",
    area: AREA_QUAN_7,
  },
];

export type LocationData = {
  slug: string;
  name: string;
  tag?: string;
  /** Khu vực (quận cũ) dùng cho breadcrumb Tier 2 và trang /dia-diem/[khu-vuc] — mô tả địa lý thông thường, không phải đơn vị hành chính chính thức. */
  area: { slug: string; name: string };
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
/* Full location data                                                      */
/* ---------------------------------------------------------------------- */

export const LOCATIONS_DATA: Record<string, LocationData> = {
  /* ===================== PRIORITY 1 — SÔNG THAO ===================== */
  "song-thao": {
    slug: "song-thao",
    name: "Sông Thao, Tân Bình",
    tag: "Trụ sở chính",
    area: AREA_TAN_BINH,
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
      "Văn phòng Sông Thao là trụ sở chính của MAX OFFICE, toạ lạc tại số 10 Sông Thao, Phường Tân Sơn Hoà, Quận Tân Bình — nơi công ty bắt đầu hoạt động từ năm 2022 và phát triển thành hệ thống 15 địa điểm tại TP.HCM như hiện nay. Đây là chi nhánh có quy mô lớn nhất, cung cấp đầy đủ toàn bộ dịch vụ của MAX OFFICE dưới một mái nhà.",
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
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Lễ tân tại trụ sở chính hỗ trợ chỉ dẫn tận tình, kể cả khi bạn chưa quen khu vực Tân Sơn Hoà." },
    ],
    parkingInfo: [
      "Bãi giữ xe máy rộng rãi ngay tại trụ sở chính, đủ sức chứa cho lượng khách ra vào đông đảo mỗi ngày.",
      "Khu vực đỗ ô tô riêng dành cho khách đến làm việc, họp hoặc tham quan trụ sở.",
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
      { q: "Tôi có thể đặt lịch tham quan văn phòng Sông Thao không?", a: "Có. Vì đây là trụ sở chính với đội ngũ vận hành đông đảo nhất hệ thống, bạn có thể đặt lịch tham quan miễn phí qua form trên trang này hoặc gọi hotline 089 8082 188 để được sắp xếp khung giờ phù hợp." },
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
    area: AREA_QUAN_1,
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
      "Văn phòng Điện Biên Phủ là chi nhánh đắc địa nhất trong hệ thống 15 địa điểm của MAX OFFICE, toạ lạc tại số 95 Điện Biên Phủ, Phường Tân Định, Quận 1 — khu vực trung tâm hành chính, tài chính và thương mại sầm uất bậc nhất TP.HCM. Đây là lựa chọn hàng đầu cho doanh nghiệp muốn khẳng định vị thế ngay từ địa chỉ đăng ký kinh doanh.",
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
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Lễ tân hướng dẫn tận tình cho khách lần đầu ghé khu Tân Định — Đa Kao, đảm bảo không lạc đường." },
    ],
    parkingInfo: [
      "Khu vực giữ xe máy ngay tại toà nhà, thuận tiện cho khách đến làm việc.",
      "Hỗ trợ thông tin bãi đỗ ô tô gần khu vực do mật độ giao thông trung tâm Quận 1.",
      "Bảo vệ trực gác thường xuyên, đảm bảo an ninh cho phương tiện ngay tại khu trung tâm Quận 1.",
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
      { q: "Tôi có thể đặt lịch tham quan văn phòng Điện Biên Phủ không?", a: "Có. Đội ngũ lễ tân tại chi nhánh Quận 1 sẽ sắp xếp lịch tham quan miễn phí ngay khi bạn để lại thông tin qua form hoặc gọi hotline 089 8082 188." },
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
    area: AREA_GO_VAP,
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
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Lễ tân tại chi nhánh hỗ trợ nhiệt tình, chỉ dẫn cụ thể tuyến đường Nguyễn Oanh cho khách đến lần đầu." },
    ],
    parkingInfo: [
      "Khu vực gửi xe máy thoáng rộng ngay tại toà nhà, thuận tiện cho khách ở khu vực Gò Vấp.",
      "Có chỗ đỗ ô tô riêng phục vụ khách đến tham quan hoặc làm việc tại chi nhánh.",
      "Đội bảo vệ túc trực, hỗ trợ an ninh cho xe của khách trong suốt giờ làm việc.",
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
      { q: "Tôi có thể đặt lịch tham quan văn phòng Nguyễn Oanh không?", a: "Có. Bạn để lại thông tin qua form trên trang này hoặc gọi hotline 089 8082 188, đội ngũ tại Gò Vấp sẽ liên hệ xác nhận lịch tham quan phù hợp." },
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
    area: AREA_TAN_BINH,
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
    intro: [
      "Văn phòng Yên Thế toạ lạc tại số 92 Yên Thế, Phường Tân Sơn Hòa, Quận Tân Bình — con đường nhỏ nối giữa hai trục lớn Trường Sơn và Cộng Hoà, chỉ cách cổng sân bay quốc tế Tân Sơn Nhất khoảng 5-10 phút di chuyển. Đây là một trong những chi nhánh có vị trí thuận lợi nhất cho các doanh nghiệp thường xuyên đón đối tác từ sân bay hoặc hoạt động trong lĩnh vực logistics, xuất nhập khẩu, du lịch — lữ hành.",
      "Khu vực Tân Sơn Hòa quanh Yên Thế là nơi giao thoa giữa không gian dân cư yên tĩnh và các trục giao thông sầm uất, gần vòng xoay Lăng Cha Cả — một trong những nút giao quan trọng bậc nhất cửa ngõ Tân Bình. Nhờ vậy, việc di chuyển từ văn phòng đến trung tâm Quận 1, Quận 3 hay sang Phú Nhuận đều khá thuận tiện, không phải đi vòng qua nhiều tuyến nhỏ.",
      "Chi nhánh Yên Thế là một trong số ít văn phòng của MAX OFFICE có phòng đào tạo & sự kiện riêng biệt, sức chứa 30-50 người — phù hợp cho doanh nghiệp cần tổ chức workshop, buổi đào tạo nội bộ hoặc ra mắt sản phẩm mà không phải thuê thêm địa điểm bên ngoài. Khách hàng có thể lựa chọn từ gói văn phòng ảo BASE (500.000đ/tháng) đến ORIGIN, ORIGIN+ và cả gói RISE cao cấp nhất — đầy đủ hơn hẳn nhiều chi nhánh khác trong hệ thống 15 địa điểm.",
      "Ngoài văn phòng ảo, chi nhánh còn cung cấp văn phòng trọn gói, phòng họp theo giờ, chỗ ngồi linh động cùng dịch vụ thành lập doanh nghiệp và kế toán thuế — vận hành theo cùng tiêu chuẩn chất lượng như tại trụ sở chính Sông Thao.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Yên Thế",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ, gần sân bay", desc: "Đủ điều kiện đăng ký kinh doanh, chỉ 5-10 phút đến sân bay Tân Sơn Nhất." },
      { icon: BuildingIcon, title: "Có phòng đào tạo & sự kiện", desc: "Sức chứa 30-50 người, phù hợp workshop, ra mắt sản phẩm ngay tại chi nhánh." },
      { icon: BadgePercentIcon, title: "Đa dạng gói văn phòng ảo", desc: "Từ BASE đến RISE — nhiều lựa chọn nhất trong các chi nhánh Tân Bình." },
      { icon: MapPinIcon, title: "Gần vòng xoay Lăng Cha Cả", desc: "Kết nối nhanh đến Quận 1, Quận 3, Phú Nhuận qua trục Cộng Hoà — Trường Sơn." },
      { icon: UsersIcon, title: "Phù hợp ngành logistics, du lịch", desc: "Vị trí lý tưởng cho doanh nghiệp thường xuyên đón đối tác từ sân bay." },
      { icon: HeadsetIcon, title: "Hỗ trợ tận tâm", desc: "Đội ngũ lễ tân, vận hành luôn sẵn sàng hỗ trợ khách hàng." },
    ],
    nearbyItems: [
      { name: "Sân bay quốc tế Tân Sơn Nhất", desc: "Chỉ 5-10 phút di chuyển, thuận tiện đón đối tác, khách hàng quốc tế." },
      { name: "Vòng xoay Lăng Cha Cả", desc: "Nút giao quan trọng cửa ngõ Tân Bình, kết nối nhanh về trung tâm thành phố." },
      { name: "Khu dân cư Tân Sơn Hòa", desc: "Không gian yên tĩnh, xen kẽ nhiều toà văn phòng và nhà phố kinh doanh." },
      { name: "Trục Trường Sơn — Cộng Hoà", desc: "Hai tuyến đường huyết mạch bao quanh khu vực, thuận tiện di chuyển mọi hướng." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt sân bay và nội thành hoạt động qua khu vực Lăng Cha Cả." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Mật độ xe cao do gần sân bay, thời gian chờ trung bình rất ngắn." },
      { icon: CheckCircleIcon, title: "Trục Trường Sơn — Cộng Hoà", desc: "Kết nối trực tiếp sân bay Tân Sơn Nhất với trung tâm Quận 1, Quận 3." },
      { icon: HeadsetIcon, title: "Hỗ trợ đón tiếp đối tác", desc: "Lễ tân hỗ trợ hướng dẫn đường đi cho khách từ sân bay đến văn phòng." },
    ],
    parkingInfo: [
      "Khu vực giữ xe máy ngay tại toà nhà, thuận tiện cho nhân viên và khách đến làm việc.",
      "Hỗ trợ thông tin bãi đỗ ô tô gần khu vực Lăng Cha Cả khi cần tiếp đối tác bằng xe hơi.",
      "Có nhân viên bảo vệ hỗ trợ hướng dẫn xe ra vào trong giờ làm việc.",
    ],
    diningItems: [
      { name: "Quán cà phê khu Lăng Cha Cả", desc: "Nhiều quán cà phê phong cách hiện đại, phù hợp tiếp khách hoặc làm việc nhóm." },
      { name: "Nhà hàng khu vực Tân Sơn Hòa", desc: "Đa dạng lựa chọn từ cơm văn phòng đến nhà hàng phục vụ khách quốc tế." },
      { name: "Food court gần sân bay", desc: "Thuận tiện cho bữa ăn nhanh khi đối tác di chuyển từ sân bay đến văn phòng." },
    ],
    faqs: [
      { q: "Văn phòng Yên Thế cách sân bay Tân Sơn Nhất bao xa?", a: "Chỉ khoảng 5-10 phút di chuyển bằng xe máy hoặc ô tô, rất thuận tiện nếu doanh nghiệp bạn thường xuyên đón đối tác, khách hàng từ sân bay." },
      { q: "Chi nhánh Yên Thế có những gói văn phòng ảo nào?", a: "Chi nhánh cung cấp 4 gói: BASE (500.000đ/tháng), ORIGIN (595.000đ/tháng), ORIGIN+ (699.000đ/tháng) và RISE (1.199.000đ/tháng) — đây là một trong số ít chi nhánh có đủ dải gói từ BASE đến RISE cao cấp nhất." },
      { q: "Phòng đào tạo & sự kiện tại Yên Thế có sức chứa bao nhiêu người?", a: "Phòng đào tạo & sự kiện tại chi nhánh này sức chứa 30-50 người, phù hợp tổ chức workshop, đào tạo nội bộ hoặc sự kiện ra mắt sản phẩm ngay tại văn phòng." },
      { q: "Địa chỉ 92 Yên Thế có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý, phù hợp đăng ký kinh doanh, đăng ký thuế cho mọi loại hình doanh nghiệp, kể cả doanh nghiệp có yếu tố nước ngoài." },
      { q: "Từ văn phòng Yên Thế di chuyển đến trung tâm Quận 1 mất bao lâu?", a: "Khoảng 15-20 phút qua trục Cộng Hoà — Trường Sơn hoặc qua vòng xoay Lăng Cha Cả, tuỳ thời điểm giao thông." },
      { q: "Tôi có thể nâng cấp từ gói BASE lên RISE sau khi ký hợp đồng không?", a: "Có. Bạn có thể nâng cấp gói bất kỳ lúc nào trong quá trình sử dụng để phù hợp với nhu cầu phát triển của doanh nghiệp." },
    ],
    testimonials: [
      { quote: "Chi nhánh Yên Thế gần sân bay nên mình hay hẹn đối tác nước ngoài ở đây, rất tiện.", initial: "T", name: "Anh Tuấn", role: "Giám đốc, công ty logistics" },
      { quote: "Phòng đào tạo sức chứa 30-50 người giúp mình tổ chức workshop ngay tại văn phòng mà không cần thuê thêm chỗ khác.", initial: "L", name: "Thu Lan", role: "Trưởng phòng đào tạo" },
    ],
  },
  "cong-hoa": {
    slug: "cong-hoa",
    name: "Cộng Hoà, Tân Bình",
    area: AREA_TAN_BINH,
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
    intro: [
      "Văn phòng Cộng Hoà toạ lạc tại số 123 Cộng Hoà, Phường Bảy Hiền, Quận Tân Bình — ngay trên một trong những trục đường lớn và sầm uất bậc nhất khu vực Tân Bình. Bảy Hiền từ lâu được biết đến là khu vực gắn liền với nghề dệt may truyền thống của người Quảng Nam di cư vào Sài Gòn, nay đã phát triển thành khu dân cư — thương mại sôi động với mật độ doanh nghiệp vừa và nhỏ dày đặc.",
      "Giao lộ Bảy Hiền — nơi giao nhau giữa các trục Cách Mạng Tháng 8, Trường Chinh và Lý Thường Kiệt — là một trong những điểm trung chuyển giao thông quan trọng của cửa ngõ Tây Bắc thành phố, giúp việc di chuyển từ văn phòng đến Quận 10, Quận 11 hay sân bay Tân Sơn Nhất đều nhanh chóng, không mất nhiều thời gian.",
      "Với vị trí mặt tiền đường Cộng Hoà, chi nhánh phù hợp cho các doanh nghiệp hoạt động trong lĩnh vực thương mại, may mặc, phân phối hoặc dịch vụ — những ngành vốn có truyền thống lâu đời tại khu vực này. MAX OFFICE cung cấp tại đây các gói văn phòng ảo BASE, ORIGIN và ORIGIN+ (từ 500.000đ/tháng), cùng đầy đủ dịch vụ văn phòng trọn gói, phòng họp theo giờ, thành lập doanh nghiệp và kế toán thuế.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Cộng Hoà",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ mặt tiền Cộng Hoà", desc: "Đủ điều kiện đăng ký kinh doanh, vị trí mặt tiền đường lớn dễ tìm." },
      { icon: MapPinIcon, title: "Gần giao lộ Bảy Hiền", desc: "Kết nối nhanh đến Quận 10, Quận 11 và sân bay Tân Sơn Nhất." },
      { icon: UsersIcon, title: "Phù hợp ngành thương mại, may mặc", desc: "Khu vực có truyền thống lâu đời về dệt may, phân phối, thương mại." },
      { icon: BadgePercentIcon, title: "3 gói văn phòng ảo linh hoạt", desc: "BASE, ORIGIN, ORIGIN+ — từ 500.000đ/tháng, dễ nâng cấp theo nhu cầu." },
      { icon: ClockIcon, title: "Giao thông thuận tiện", desc: "Mặt tiền đường Cộng Hoà, dễ di chuyển vào giờ cao điểm." },
      { icon: HeadsetIcon, title: "Hỗ trợ tận tâm", desc: "Đội ngũ lễ tân, vận hành luôn sẵn sàng hỗ trợ khách hàng." },
    ],
    nearbyItems: [
      { name: "Giao lộ Bảy Hiền", desc: "Nút giao thông quan trọng, kết nối Cách Mạng Tháng 8, Trường Chinh, Lý Thường Kiệt." },
      { name: "Khu vực dệt may Bảy Hiền", desc: "Khu dân cư — thương mại lâu đời, mật độ doanh nghiệp vừa và nhỏ dày đặc." },
      { name: "Chợ Bảy Hiền", desc: "Chợ truyền thống sầm uất, thuận tiện sinh hoạt hàng ngày." },
      { name: "Sân bay Tân Sơn Nhất", desc: "Khoảng 10-15 phút di chuyển từ chi nhánh." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt lớn đi qua giao lộ Bảy Hiền." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Mật độ xe cao tại khu vực mặt tiền đường lớn." },
      { icon: CheckCircleIcon, title: "Trục Cộng Hoà — Trường Chinh", desc: "Kết nối nhanh đến Quận 10, Quận 11, sân bay Tân Sơn Nhất." },
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Lễ tân sẵn sàng hướng dẫn cụ thể nếu bạn chưa quen khu vực Bảy Hiền." },
    ],
    parkingInfo: [
      "Khu vực giữ xe máy ngay tại toà nhà mặt tiền đường Cộng Hoà.",
      "Hỗ trợ thông tin bãi đỗ ô tô gần khu vực giao lộ Bảy Hiền.",
      "Có bảo vệ hỗ trợ trông giữ xe trong suốt giờ làm việc.",
    ],
    diningItems: [
      { name: "Quán ăn khu Bảy Hiền", desc: "Nhiều quán ăn lâu đời, đặc trưng ẩm thực miền Trung của cộng đồng Quảng Nam." },
      { name: "Nhà hàng trục Cộng Hoà", desc: "Đa dạng lựa chọn từ cơm văn phòng đến nhà hàng phục vụ tiếp khách." },
      { name: "Chợ Bảy Hiền", desc: "Thuận tiện mua sắm thực phẩm, ăn uống nhanh giữa giờ làm việc." },
    ],
    faqs: [
      { q: "Văn phòng Cộng Hoà có vị trí mặt tiền hay trong hẻm?", a: "Văn phòng nằm mặt tiền đường Cộng Hoà, Phường Bảy Hiền — dễ tìm, thuận tiện cho khách hàng và đối tác đến giao dịch trực tiếp." },
      { q: "Chi nhánh Cộng Hoà cung cấp những gói văn phòng ảo nào?", a: "Chi nhánh cung cấp 3 gói: BASE (500.000đ/tháng), ORIGIN (595.000đ/tháng) và ORIGIN+ (699.000đ/tháng), phù hợp cho doanh nghiệp cần nâng cấp dần theo quy mô." },
      { q: "Khu vực Bảy Hiền có phù hợp cho doanh nghiệp ngành may mặc, thương mại không?", a: "Rất phù hợp. Bảy Hiền là khu vực có truyền thống lâu đời về dệt may và thương mại, tập trung nhiều doanh nghiệp vừa và nhỏ hoạt động trong lĩnh vực này." },
      { q: "Từ văn phòng Cộng Hoà đến sân bay Tân Sơn Nhất mất bao lâu?", a: "Khoảng 10-15 phút di chuyển qua trục Trường Chinh hoặc Cộng Hoà, tuỳ thời điểm giao thông." },
      { q: "Địa chỉ 123 Cộng Hoà có hợp lệ để đăng ký kinh doanh không?", a: "Có. Địa chỉ này đáp ứng đầy đủ điều kiện pháp lý tại Phường Bảy Hiền, Quận Tân Bình, phù hợp đăng ký kinh doanh và đăng ký thuế cho mọi loại hình doanh nghiệp." },
      { q: "Tôi có thể thuê phòng họp theo giờ tại chi nhánh này không?", a: "Có. Chi nhánh Cộng Hoà cung cấp phòng họp theo giờ, phù hợp tiếp đối tác hoặc tổ chức họp nhóm nhỏ." },
    ],
    testimonials: [
      { quote: "Vị trí mặt tiền Cộng Hoà rất dễ tìm, đối tác đến lần đầu cũng không bị lạc.", initial: "P", name: "Hoài Phương", role: "Chủ xưởng may gia công" },
      { quote: "Gần giao lộ Bảy Hiền nên mình di chuyển đi giao hàng khắp thành phố đều thuận tiện.", initial: "D", name: "Anh Duy", role: "Giám đốc, công ty phân phối" },
    ],
  },
  "tan-thang": {
    slug: "tan-thang",
    name: "Tân Thắng, Tân Phú",
    area: AREA_TAN_PHU,
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
    intro: [
      "Văn phòng Tân Thắng toạ lạc tại 121A-123-125 Tân Thắng, Phường Tân Sơn Nhì, Quận Tân Phú — khu vực phát triển nhanh trong những năm gần đây nhờ sự xuất hiện của các trung tâm thương mại và khu dân cư mới. Đây là lựa chọn phù hợp cho doanh nghiệp muốn có địa chỉ tại Tân Phú với môi trường xung quanh hiện đại, quy hoạch bài bản.",
      "Khu vực Tân Sơn Nhì nằm không xa Aeon Mall Tân Phú Celadon — một trong những trung tâm thương mại lớn phía Tây thành phố — cùng nhiều khu dân cư mới, trường học và tiện ích đi kèm. Nhờ vậy, nhân viên và đối tác đến làm việc tại chi nhánh có thể kết hợp mua sắm, ăn uống hoặc giải trí ngay sau giờ làm.",
      "Đường Tân Thắng kết nối thuận tiện với trục Tân Sơn Nhì và các tuyến đường lớn của Tân Phú, giúp việc di chuyển sang khu vực Tân Bình hoặc trung tâm thành phố không quá xa. Chi nhánh cung cấp các gói văn phòng ảo BASE, ORIGIN, ORIGIN+ (từ 500.000đ/tháng), cùng văn phòng trọn gói, phòng họp theo giờ, không gian làm việc chung, thành lập doanh nghiệp và kế toán thuế.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Tân Thắng",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ tại Tân Phú", desc: "Đủ điều kiện đăng ký kinh doanh, khu vực quy hoạch hiện đại." },
      { icon: MapPinIcon, title: "Gần Aeon Mall Tân Phú", desc: "Thuận tiện tiếp khách, ăn uống, mua sắm sau giờ làm việc." },
      { icon: BuildingIcon, title: "Không gian làm việc chung", desc: "Khu vực coworking thoáng đãng, phù hợp làm việc tập trung." },
      { icon: BadgePercentIcon, title: "3 gói văn phòng ảo linh hoạt", desc: "BASE, ORIGIN, ORIGIN+ — từ 500.000đ/tháng." },
      { icon: UsersIcon, title: "Khu dân cư mới phát triển", desc: "Môi trường xung quanh hiện đại, an ninh tốt." },
      { icon: HeadsetIcon, title: "Hỗ trợ tận tâm", desc: "Đội ngũ lễ tân, vận hành luôn sẵn sàng hỗ trợ khách hàng." },
    ],
    nearbyItems: [
      { name: "Aeon Mall Tân Phú Celadon", desc: "Trung tâm thương mại lớn, thuận tiện tiếp khách và giải trí sau giờ làm." },
      { name: "Khu dân cư Tân Sơn Nhì", desc: "Khu dân cư mới, quy hoạch hiện đại, nhiều tiện ích xung quanh." },
      { name: "Trường học lân cận", desc: "Khu vực tập trung nhiều trường học, dân cư ổn định." },
      { name: "Trục đường Tân Sơn Nhì", desc: "Kết nối thuận tiện sang Tân Bình và trung tâm thành phố." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Các tuyến xe buýt hoạt động qua khu vực Tân Sơn Nhì, Tân Phú." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Dễ dàng đặt xe, khu vực dân cư đông đúc nên mật độ xe ổn định." },
      { icon: CheckCircleIcon, title: "Trục Tân Sơn Nhì — Tân Thắng", desc: "Kết nối nhanh sang Tân Bình, thuận tiện di chuyển liên quận." },
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Lễ tân hỗ trợ chỉ dẫn tận nơi nếu đây là lần đầu bạn đến khu Tân Sơn Nhì." },
    ],
    parkingInfo: [
      "Có khu vực gửi xe máy ngay tại toà nhà văn phòng.",
      "Bãi đỗ ô tô tại Aeon Mall gần đó, thuận tiện khi cần đón đối tác bằng xe hơi.",
      "An ninh được đảm bảo suốt giờ làm việc nhờ đội bảo vệ toà nhà.",
    ],
    diningItems: [
      { name: "Food court Aeon Mall Tân Phú", desc: "Đa dạng lựa chọn ẩm thực, phù hợp tiếp khách hoặc ăn trưa nhóm." },
      { name: "Quán cà phê khu Tân Sơn Nhì", desc: "Nhiều quán cà phê phong cách hiện đại gần khu dân cư mới." },
      { name: "Cửa hàng tiện lợi", desc: "Có sẵn trong khu dân cư gần đó, tiện ghé mua đồ dùng nhanh." },
    ],
    faqs: [
      { q: "Văn phòng Tân Thắng có gần Aeon Mall Tân Phú không?", a: "Có. Chi nhánh nằm khá gần Aeon Mall Tân Phú Celadon, thuận tiện cho việc tiếp khách, ăn uống hoặc mua sắm sau giờ làm việc." },
      { q: "Chi nhánh Tân Thắng cung cấp những gói văn phòng ảo nào?", a: "Chi nhánh cung cấp 3 gói: BASE (500.000đ/tháng), ORIGIN (595.000đ/tháng) và ORIGIN+ (699.000đ/tháng)." },
      { q: "Địa chỉ 121A-123-125 Tân Thắng có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Tân Sơn Nhì, Quận Tân Phú, phù hợp đăng ký kinh doanh và đăng ký thuế." },
      { q: "Từ văn phòng Tân Thắng di chuyển sang Tân Bình có xa không?", a: "Không xa. Trục Tân Sơn Nhì kết nối trực tiếp sang khu vực Tân Bình, thời gian di chuyển khoảng 10-15 phút." },
      { q: "Chi nhánh có không gian làm việc chung (coworking) không?", a: "Có. Chi nhánh Tân Thắng có khu vực chỗ ngồi làm việc chung, phù hợp cho freelancer hoặc đội nhóm nhỏ." },
      { q: "Tôi có thể đặt lịch tham quan văn phòng Tân Thắng trước khi ký hợp đồng không?", a: "Có. Đội ngũ MAX OFFICE tại Tân Thắng sẵn sàng sắp xếp lịch tham quan miễn phí theo thời gian thuận tiện của bạn — chỉ cần để lại thông tin qua form hoặc gọi hotline 089 8082 188." },
    ],
    testimonials: [
      { quote: "Văn phòng gần Aeon Mall nên mình hay hẹn khách ăn trưa luôn, rất tiện.", initial: "H", name: "Thanh Hằng", role: "Chủ shop online" },
      { quote: "Khu vực Tân Sơn Nhì yên tĩnh, phù hợp cho đội ngũ mình tập trung làm việc.", initial: "K", name: "Anh Khoa", role: "Trưởng nhóm phát triển phần mềm" },
    ],
  },
  "cuu-long": {
    slug: "cuu-long",
    name: "Cửu Long, Tân Bình",
    area: AREA_TAN_BINH,
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
    intro: [
      "Văn phòng Cửu Long toạ lạc tại 06-08-10 Cửu Long, Phường Tân Sơn Hòa, Quận Tân Bình — con đường nhỏ, yên tĩnh nằm gần Công viên Hoàng Văn Thụ, một trong những mảng xanh lớn hiếm hoi của khu vực Tân Bình. Đây là lựa chọn phù hợp cho doanh nghiệp muốn có địa chỉ đăng ký kinh doanh trong khu dân cư ổn định, tránh sự ồn ào của các trục đường lớn.",
      "Khác với một số chi nhánh khác trong khu vực Tân Sơn Hòa nằm sát các giao lộ lớn, Cửu Long mang không khí trầm lắng hơn, phù hợp cho các công ty tư vấn, thiết kế hoặc dịch vụ chuyên môn cần không gian làm việc tập trung. Từ đây di chuyển ra Công viên Hoàng Văn Thụ chỉ mất vài phút — nhiều khách hàng của MAX OFFICE tại chi nhánh này chọn nơi đây để hẹn gặp đối tác ngoài trời hoặc nghỉ ngơi giữa giờ làm việc.",
      "Chi nhánh Cửu Long hiện tập trung vào gói văn phòng ảo BASE (500.000đ/tháng) — gói tiêu chuẩn bao gồm đầy đủ địa chỉ đăng ký kinh doanh, lễ tân, wifi, không gian tiếp khách (Guest Lounge), tư vấn pháp lý & thuế. Khách hàng có nhu cầu sử dụng các gói cao hơn (ORIGIN, ORIGIN+, RISE) có thể được tư vấn chuyển sang các chi nhánh lân cận như Yên Thế hoặc Sông Thao trong cùng khu vực Tân Bình.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Cửu Long",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ, khu dân cư yên tĩnh", desc: "Đủ điều kiện đăng ký kinh doanh, tránh ồn ào trục đường lớn." },
      { icon: MapPinIcon, title: "Gần Công viên Hoàng Văn Thụ", desc: "Không gian xanh gần kề, phù hợp nghỉ ngơi hoặc gặp gỡ ngoài trời." },
      { icon: UsersIcon, title: "Phù hợp công ty tư vấn, thiết kế", desc: "Không gian trầm lắng, thích hợp cho công việc cần tập trung cao." },
      { icon: BadgePercentIcon, title: "Gói BASE trọn vẹn tiện ích", desc: "Bao gồm Guest Lounge, tư vấn pháp lý & thuế, đánh giá sức khoẻ doanh nghiệp AI." },
      { icon: KeyIcon, title: "Dễ nâng cấp khi cần", desc: "Hỗ trợ chuyển sang chi nhánh khác nếu cần gói cao hơn BASE." },
      { icon: HeadsetIcon, title: "Hỗ trợ tận tâm", desc: "Đội ngũ lễ tân, vận hành luôn sẵn sàng hỗ trợ khách hàng." },
    ],
    nearbyItems: [
      { name: "Công viên Hoàng Văn Thụ", desc: "Mảng xanh lớn của khu vực, chỉ vài phút di chuyển từ văn phòng." },
      { name: "Khu dân cư Tân Sơn Hòa", desc: "Không gian yên tĩnh, ổn định, ít xe cộ qua lại hơn khu vực trục chính." },
      { name: "Các toà văn phòng lân cận", desc: "Khu vực có một số doanh nghiệp nhỏ hoạt động, không quá đông đúc." },
      { name: "Sân bay Tân Sơn Nhất", desc: "Khoảng 10 phút di chuyển, thuận tiện khi cần đón đối tác." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Các tuyến xe buýt hoạt động qua khu vực gần Công viên Hoàng Văn Thụ." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Dễ đặt xe dù nằm trong khu vực yên tĩnh, thời gian chờ ngắn." },
      { icon: CheckCircleIcon, title: "Trục Trường Chinh — Cộng Hoà", desc: "Cách không xa, thuận tiện kết nối trung tâm khi cần." },
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Lễ tân tại chi nhánh luôn hỗ trợ chỉ dẫn đường đi khi bạn ghé lần đầu." },
    ],
    parkingInfo: [
      "Toà nhà có khu vực gửi xe máy riêng cho khách đến làm việc.",
      "Khu dân cư yên tĩnh nên việc tìm chỗ đỗ ô tô gần đó khá dễ dàng.",
      "Đội bảo vệ trực gác thường xuyên, đảm bảo an toàn cho xe cộ.",
    ],
    diningItems: [
      { name: "Quán cà phê gần Công viên Hoàng Văn Thụ", desc: "Không gian yên tĩnh, phù hợp làm việc hoặc gặp gỡ đối tác nhẹ nhàng." },
      { name: "Quán ăn khu dân cư Tân Sơn Hòa", desc: "Nhiều quán ăn nhỏ mang phong cách gia đình, giá cả bình dân." },
      { name: "Cửa hàng tiện lợi", desc: "Nằm ngay trong khu dân cư, tiện ghé mua đồ nhanh giữa giờ." },
    ],
    faqs: [
      { q: "Chi nhánh Cửu Long có những gói văn phòng ảo nào?", a: "Hiện tại chi nhánh Cửu Long chỉ áp dụng gói BASE (500.000đ/tháng) — bao gồm đầy đủ địa chỉ đăng ký kinh doanh, lễ tân, wifi, Guest Lounge và tư vấn pháp lý & thuế. Nếu bạn cần các gói cao hơn (ORIGIN, ORIGIN+, RISE), đội ngũ tư vấn sẽ hỗ trợ chuyển sang chi nhánh Yên Thế hoặc Sông Thao gần đó." },
      { q: "Vì sao chi nhánh Cửu Long chỉ có một gói duy nhất?", a: "MAX OFFICE bố trí các gói dịch vụ theo quy mô và đặc điểm từng chi nhánh. Cửu Long tập trung phục vụ tốt nhất gói BASE — phù hợp với phần lớn doanh nghiệp vừa và nhỏ cần địa chỉ hợp lệ và tiện ích cơ bản đầy đủ." },
      { q: "Văn phòng Cửu Long có gần công viên không?", a: "Có. Chi nhánh nằm gần Công viên Hoàng Văn Thụ, thuận tiện cho việc nghỉ ngơi hoặc gặp gỡ đối tác ngoài trời." },
      { q: "Địa chỉ 06-08-10 Cửu Long có hợp lệ để đăng ký kinh doanh không?", a: "Có. Địa chỉ này đáp ứng đầy đủ điều kiện pháp lý để đăng ký kinh doanh, đăng ký thuế theo quy định hiện hành." },
      { q: "Khu vực xung quanh văn phòng Cửu Long có ồn ào không?", a: "Không. Đây là khu dân cư tương đối yên tĩnh, tách biệt với các trục đường lớn, phù hợp cho công việc cần sự tập trung." },
      { q: "Tôi có thể đến tham quan văn phòng Cửu Long trước khi ký hợp đồng không?", a: "Có. Bạn chỉ cần để lại thông tin qua form trên trang này hoặc gọi hotline 089 8082 188, đội ngũ sẽ sắp xếp lịch tham quan phù hợp." },
    ],
    testimonials: [
      { quote: "Khu vực yên tĩnh, gần công viên nên mình thích ra đó ngồi làm việc buổi sáng trước khi vào văn phòng.", initial: "N", name: "Bảo Ngọc", role: "Freelancer thiết kế đồ hoạ" },
      { quote: "Gói BASE tại đây đủ dùng cho công ty mới thành lập của mình, giá hợp lý mà vẫn đầy đủ tiện ích.", initial: "S", name: "Anh Sơn", role: "Giám đốc công ty tư vấn" },
    ],
  },
  "hoang-viet": {
    slug: "hoang-viet",
    name: "Hoàng Việt, Tân Bình",
    area: AREA_TAN_BINH,
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
    intro: [
      "Văn phòng Hoàng Việt toạ lạc tại 1/12 Hoàng Việt, Phường Tân Sơn Nhất, Quận Tân Bình — con đường chạy dọc theo ranh giới sân bay Tân Sơn Nhất, một trong những vị trí gần cổng sân bay nhất trong toàn hệ thống 15 chi nhánh của MAX OFFICE. Đây là lựa chọn lý tưởng cho doanh nghiệp mới thành lập cần địa chỉ đăng ký kinh doanh với chi phí hợp lý nhưng vẫn ở vị trí thuận tiện.",
      "Khu vực Phường Tân Sơn Nhất không chỉ gần sân bay mà còn cách Công viên Gia Định — một trong những công viên lớn của thành phố — chỉ vài phút di chuyển, mang lại không gian thoáng đãng hiếm có so với nhiều khu vực nội thành khác. Đường Hoàng Việt và các tuyến lân cận như Phan Thúc Duyện, Hồng Hà tạo thành mạng lưới giao thông thuận tiện, kết nối nhanh sang Phú Nhuận và trung tâm thành phố.",
      "Chi nhánh Hoàng Việt cung cấp các gói văn phòng ảo giá tốt nhất trong hệ thống: LITE (299.000đ/tháng), START (350.000đ/tháng) và BASE (500.000đ/tháng) — phù hợp cho startup, hộ kinh doanh cá thể hoặc doanh nghiệp mới cần tối ưu chi phí vận hành trong giai đoạn đầu.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Hoàng Việt",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ, gần sân bay", desc: "Đủ điều kiện đăng ký kinh doanh, sát cổng sân bay Tân Sơn Nhất." },
      { icon: BadgePercentIcon, title: "Giá khởi điểm chỉ 299.000đ/tháng", desc: "Gói LITE, START, BASE — phù hợp doanh nghiệp mới, tối ưu chi phí." },
      { icon: MapPinIcon, title: "Gần Công viên Gia Định", desc: "Không gian xanh thoáng đãng, chỉ vài phút di chuyển." },
      { icon: UsersIcon, title: "Phù hợp startup, hộ kinh doanh", desc: "Chi phí hợp lý cho doanh nghiệp giai đoạn đầu." },
      { icon: ClockIcon, title: "Giao thông thuận tiện", desc: "Kết nối nhanh sang Phú Nhuận và trung tâm thành phố." },
      { icon: HeadsetIcon, title: "Hỗ trợ tận tâm", desc: "Đội ngũ lễ tân, vận hành luôn sẵn sàng hỗ trợ khách hàng." },
    ],
    nearbyItems: [
      { name: "Sân bay quốc tế Tân Sơn Nhất", desc: "Văn phòng nằm sát ranh giới sân bay, thuận tiện đón khách quốc tế." },
      { name: "Công viên Gia Định", desc: "Công viên lớn, không gian xanh thoáng đãng gần chi nhánh." },
      { name: "Khu dân cư Tân Sơn Nhất", desc: "Khu vực dân cư lâu năm, gần sân bay nhưng vẫn giữ được nhịp sống yên bình." },
      { name: "Trục Hoàng Việt — Phan Thúc Duyện", desc: "Kết nối thuận tiện sang Phú Nhuận và trung tâm thành phố." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt sân bay hoạt động qua khu vực." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Mật độ xe cao do gần sân bay, dễ dàng đặt xe mọi thời điểm." },
      { icon: CheckCircleIcon, title: "Trục Hoàng Việt — Hồng Hà", desc: "Kết nối nhanh sang Phú Nhuận, Quận 1 qua đường Hồng Hà." },
      { icon: HeadsetIcon, title: "Hỗ trợ đón khách quốc tế", desc: "Lễ tân hỗ trợ hướng dẫn cho khách vừa đến từ sân bay." },
    ],
    parkingInfo: [
      "Toà nhà bố trí khu vực gửi xe máy thuận tiện ngay lối vào.",
      "Hỗ trợ thông tin bãi đỗ ô tô gần khu vực sân bay khi cần đón đối tác.",
      "Có bảo vệ trực để đảm bảo an ninh cho xe cộ trong giờ làm việc.",
    ],
    diningItems: [
      { name: "Quán cà phê khu Tân Sơn Nhất", desc: "Nhiều quán cà phê phù hợp tiếp khách vừa đến từ sân bay." },
      { name: "Nhà hàng gần Công viên Gia Định", desc: "Không gian thoáng đãng, phù hợp tiếp đối tác vào buổi trưa." },
      { name: "Food court gần sân bay", desc: "Thuận tiện cho bữa ăn nhanh khi lịch trình dày đặc." },
    ],
    faqs: [
      { q: "Văn phòng Hoàng Việt cách sân bay Tân Sơn Nhất bao xa?", a: "Rất gần — đường Hoàng Việt chạy dọc theo ranh giới sân bay, chỉ mất vài phút di chuyển từ cổng sân bay đến văn phòng." },
      { q: "Chi nhánh Hoàng Việt có những gói văn phòng ảo nào?", a: "Chi nhánh cung cấp 3 gói giá tốt: LITE (299.000đ/tháng), START (350.000đ/tháng) và BASE (500.000đ/tháng), phù hợp cho doanh nghiệp mới tối ưu chi phí." },
      { q: "Gói LITE 299.000đ/tháng bao gồm những gì?", a: "Gói LITE bao gồm địa chỉ đăng ký kinh doanh hợp lệ, lễ tân tiếp nhận thư từ, wifi và quyền tham gia các buổi workshop của MAX OFFICE." },
      { q: "Địa chỉ 1/12 Hoàng Việt có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Tân Sơn Nhất, Quận Tân Bình, phù hợp đăng ký kinh doanh và đăng ký thuế." },
      { q: "Chi nhánh có gần công viên để nghỉ ngơi giữa giờ làm không?", a: "Có. Công viên Gia Định nằm rất gần chi nhánh, phù hợp để nghỉ ngơi hoặc đi bộ giữa giờ làm việc." },
      { q: "Tôi có thể nâng cấp từ gói LITE lên START hoặc BASE sau này không?", a: "Có. Bạn có thể nâng cấp gói bất kỳ lúc nào để phù hợp với nhu cầu phát triển của doanh nghiệp." },
    ],
    testimonials: [
      { quote: "Mình mới mở công ty nên chọn gói LITE ở đây, giá rẻ mà vẫn đủ điều kiện đăng ký kinh doanh.", initial: "V", name: "Anh Vinh", role: "Founder công ty mới thành lập" },
      { quote: "Văn phòng sát sân bay nên đối tác nước ngoài của mình ghé qua rất tiện, không mất nhiều thời gian di chuyển.", initial: "C", name: "Mỹ Châu", role: "Quản lý xuất nhập khẩu" },
    ],
  },
  "bau-cat": {
    slug: "bau-cat",
    name: "Bàu Cát 2, Tân Bình",
    area: AREA_TAN_BINH,
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
    intro: [
      "Văn phòng Bàu Cát 2 toạ lạc tại 24A Bàu Cát 2, Phường Tân Bình — khu vực từ lâu được biết đến như một trong những 'thủ phủ' may mặc, thời trang thiết kế của Sài Gòn, nơi tập trung hàng trăm xưởng may, showroom và cửa hàng thời trang nhỏ lẻ. Đây là lựa chọn phù hợp cho doanh nghiệp hoạt động trong ngành thời trang, may mặc, thương mại điện tử muốn có địa chỉ gần nguồn hàng.",
      "Khu Bàu Cát có mạng lưới hẻm nhỏ đan xen nhưng khá thuận tiện di chuyển nhờ hệ thống đường nội bộ kết nối trực tiếp ra các trục lớn như Đồng Đen, Trường Chinh. Chợ Bàu Cát ngay gần đó cũng là nơi giao thương sầm uất, phục vụ nhu cầu sinh hoạt hàng ngày cho cả khu vực.",
      "Chi nhánh Bàu Cát 2 cung cấp các gói văn phòng ảo LITE (299.000đ/tháng), START (350.000đ/tháng) và BASE (500.000đ/tháng) cùng không gian làm việc chung (coworking) thoáng đãng — phù hợp cho các cá nhân kinh doanh online, xưởng may nhỏ hoặc startup thời trang cần địa chỉ đăng ký kinh doanh hợp lệ với chi phí tối ưu.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Bàu Cát 2",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ khu Bàu Cát", desc: "Đủ điều kiện đăng ký kinh doanh, gần khu thời trang, may mặc nổi tiếng." },
      { icon: BadgePercentIcon, title: "Giá khởi điểm chỉ 299.000đ/tháng", desc: "Gói LITE, START, BASE — tối ưu chi phí cho doanh nghiệp nhỏ." },
      { icon: BuildingIcon, title: "Không gian làm việc chung", desc: "Khu coworking thoáng đãng, phù hợp làm việc tập trung." },
      { icon: UsersIcon, title: "Phù hợp ngành thời trang, may mặc", desc: "Gần nguồn hàng, xưởng may, showroom thời trang trong khu vực." },
      { icon: MapPinIcon, title: "Gần chợ Bàu Cát", desc: "Thuận tiện sinh hoạt, giao thương hàng ngày." },
      { icon: HeadsetIcon, title: "Hỗ trợ tận tâm", desc: "Đội ngũ lễ tân, vận hành luôn sẵn sàng hỗ trợ khách hàng." },
    ],
    nearbyItems: [
      { name: "Khu thời trang, may mặc Bàu Cát", desc: "Tập trung nhiều xưởng may, showroom thời trang thiết kế nổi tiếng." },
      { name: "Chợ Bàu Cát", desc: "Chợ truyền thống sầm uất, thuận tiện sinh hoạt và giao thương." },
      { name: "Khu dân cư Bàu Cát", desc: "Khu dân cư đông đúc, nhiều hẻm nhỏ kết nối ra trục lớn." },
      { name: "Trục Đồng Đen — Trường Chinh", desc: "Kết nối thuận tiện sang các khu vực khác của Tân Bình." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt chạy ngang khu vực Bàu Cát, kết nối ra trục Trường Chinh." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Dễ đặt xe dù trong hẻm, tài xế khu vực khá quen đường." },
      { icon: CheckCircleIcon, title: "Trục Đồng Đen — Trường Chinh", desc: "Kết nối nhanh ra các trục lớn của Tân Bình." },
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Đội ngũ lễ tân hỗ trợ hướng dẫn khi bạn đến lần đầu, đặc biệt qua khu hẻm." },
    ],
    parkingInfo: [
      "Có khu vực gửi xe máy ngay tại toà nhà cho khách đến làm việc.",
      "Hỗ trợ thông tin bãi đỗ ô tô gần khu vực do đường trong khu Bàu Cát khá nhỏ.",
      "Bảo vệ hỗ trợ trông xe trong suốt giờ hoạt động của văn phòng.",
    ],
    diningItems: [
      { name: "Quán ăn khu Bàu Cát", desc: "Nhiều quán ăn bình dân phục vụ công nhân, nhân viên xưởng may trong khu vực." },
      { name: "Chợ Bàu Cát", desc: "Thuận tiện mua sắm thực phẩm, ăn sáng, ăn trưa nhanh." },
      { name: "Cửa hàng tiện lợi", desc: "Có vài cửa hàng tiện lợi trong khu vực, phù hợp ghé mua đồ nhanh." },
    ],
    faqs: [
      { q: "Khu vực Bàu Cát 2 có phù hợp cho doanh nghiệp ngành thời trang không?", a: "Rất phù hợp. Bàu Cát là khu vực nổi tiếng với nhiều xưởng may, showroom thời trang thiết kế, thuận tiện cho doanh nghiệp cần gần nguồn hàng, thợ may." },
      { q: "Chi nhánh Bàu Cát 2 có những gói văn phòng ảo nào?", a: "Chi nhánh hiện có 3 lựa chọn: LITE (299.000đ/tháng), START (350.000đ/tháng) và BASE (500.000đ/tháng), phù hợp cho cá nhân kinh doanh và doanh nghiệp nhỏ ngành thời trang." },
      { q: "Địa chỉ 24A Bàu Cát 2 có nằm trong hẻm không, có khó tìm không?", a: "Văn phòng nằm trong khu vực đường Bàu Cát 2, hệ thống đường nội bộ khá rõ ràng và kết nối thuận tiện ra trục Đồng Đen — Trường Chinh, đội ngũ lễ tân sẽ hỗ trợ chỉ đường nếu bạn đến lần đầu." },
      { q: "Địa chỉ này có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Tân Bình, phù hợp đăng ký kinh doanh và đăng ký thuế cho mọi loại hình doanh nghiệp." },
      { q: "Chi nhánh có không gian coworking không?", a: "Có. Chi nhánh Bàu Cát 2 có khu vực làm việc chung thoáng đãng, phù hợp cho freelancer hoặc đội nhóm nhỏ." },
      { q: "Tôi có thể đến tham quan văn phòng Bàu Cát 2 trước khi ký hợp đồng không?", a: "Có. Bạn có thể để lại thông tin qua form hoặc gọi trực tiếp hotline 089 8082 188 để được sắp xếp lịch tham quan miễn phí phù hợp." },
    ],
    testimonials: [
      { quote: "Mình mở xưởng may nhỏ gần đây nên đặt địa chỉ công ty luôn ở Bàu Cát cho tiện quản lý.", initial: "T", name: "Chị Thảo", role: "Chủ xưởng may thời trang" },
      { quote: "Giá gói LITE rất hợp với ngân sách công ty mới mở của mình, thủ tục lại nhanh gọn.", initial: "Đ", name: "Minh Đức", role: "Founder thương hiệu thời trang online" },
    ],
  },
  "lam-son": {
    slug: "lam-son",
    name: "Lam Sơn, Tân Bình",
    area: AREA_TAN_BINH,
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
    intro: [
      "Văn phòng Lam Sơn toạ lạc tại 2-2B Lam Sơn, Phường Tân Sơn Hòa, Quận Tân Bình — khu vực nằm gần trục đường Lê Văn Sỹ, một trong những tuyến phố ẩm thực và mua sắm sầm uất nối liền Tân Bình với Quận 3. Đây là lựa chọn thuận tiện cho doanh nghiệp cần địa chỉ vừa gần trung tâm vừa giữ được chi phí hợp lý.",
      "Khác với các chi nhánh khác trong cùng Phường Tân Sơn Hòa, Lam Sơn có lợi thế lớn về khả năng kết nối trực tiếp vào trục Lê Văn Sỹ — Cách Mạng Tháng 8, giúp việc di chuyển đến trung tâm Quận 3, Quận 1 nhanh hơn nhiều so với việc phải vòng qua các trục lớn khác của Tân Bình. Khu vực xung quanh có nhiều quán ăn, cà phê phục vụ dân văn phòng, phù hợp cho các buổi gặp gỡ đối tác không quá trang trọng.",
      "Chi nhánh Lam Sơn cung cấp các gói văn phòng ảo LITE (299.000đ/tháng), START (350.000đ/tháng) và BASE (500.000đ/tháng) — phù hợp cho doanh nghiệp nhỏ, hộ kinh doanh hoặc văn phòng đại diện cần vị trí gần trung tâm với ngân sách tối ưu.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Lam Sơn",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ gần trung tâm", desc: "Đủ điều kiện đăng ký kinh doanh, gần trục Lê Văn Sỹ nối Quận 3." },
      { icon: BadgePercentIcon, title: "Giá khởi điểm chỉ 299.000đ/tháng", desc: "Gói LITE, START, BASE — tối ưu chi phí, gần trung tâm." },
      { icon: MapPinIcon, title: "Gần trục Lê Văn Sỹ", desc: "Kết nối nhanh đến Quận 3, Quận 1 qua tuyến phố ẩm thực sầm uất." },
      { icon: ClockIcon, title: "Di chuyển thuận tiện", desc: "Không phải vòng qua các trục lớn khác của Tân Bình." },
      { icon: UsersIcon, title: "Phù hợp văn phòng đại diện", desc: "Vị trí cân bằng giữa chi phí và khả năng tiếp cận trung tâm." },
      { icon: HeadsetIcon, title: "Hỗ trợ tận tâm", desc: "Đội ngũ lễ tân, vận hành luôn sẵn sàng hỗ trợ khách hàng." },
    ],
    nearbyItems: [
      { name: "Trục Lê Văn Sỹ", desc: "Tuyến phố ẩm thực, mua sắm sầm uất nối Tân Bình với Quận 3." },
      { name: "Khu dân cư Tân Sơn Hòa", desc: "Khu dân cư lâu đời, mật độ vừa phải, không quá ồn ào." },
      { name: "Trục Cách Mạng Tháng 8", desc: "Kết nối nhanh đến trung tâm Quận 3, Quận 1." },
      { name: "Các quán ăn, cà phê văn phòng", desc: "Khu vực tập trung nhiều quán phục vụ dân văn phòng xung quanh." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt hoạt động qua trục Lê Văn Sỹ, Cách Mạng Tháng 8." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Dễ dàng đặt xe, khu vực gần trung tâm nên mật độ xe ổn định." },
      { icon: CheckCircleIcon, title: "Trục Lê Văn Sỹ — CMT8", desc: "Kết nối trực tiếp đến Quận 3, Quận 1 mà không cần vòng xa." },
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Lễ tân nhiệt tình hướng dẫn đường đi cho khách ghé thăm lần đầu." },
    ],
    parkingInfo: [
      "Văn phòng có khu vực gửi xe máy riêng ngay tại toà nhà.",
      "Hỗ trợ thông tin bãi đỗ ô tô gần khu vực trục Lê Văn Sỹ.",
      "Có bảo vệ trực gác thường xuyên, đảm bảo an toàn cho xe của khách.",
    ],
    diningItems: [
      { name: "Phố ẩm thực Lê Văn Sỹ", desc: "Đa dạng quán ăn, cà phê phục vụ dân văn phòng, phù hợp tiếp khách nhẹ nhàng." },
      { name: "Quán cà phê khu Tân Sơn Hòa", desc: "Nhiều lựa chọn quán cà phê làm việc hoặc gặp gỡ đối tác." },
      { name: "Cửa hàng tiện lợi", desc: "Vài cửa hàng nhỏ gần đó phục vụ nhu cầu mua sắm nhanh." },
    ],
    faqs: [
      { q: "Văn phòng Lam Sơn có gần trung tâm Quận 3 không?", a: "Có. Chi nhánh kết nối trực tiếp vào trục Lê Văn Sỹ — Cách Mạng Tháng 8, di chuyển đến trung tâm Quận 3 chỉ mất khoảng 10-15 phút." },
      { q: "Chi nhánh Lam Sơn có những gói văn phòng ảo nào?", a: "Hiện chi nhánh có 3 gói: LITE (299.000đ/tháng), START (350.000đ/tháng) và BASE (500.000đ/tháng) — phù hợp cho văn phòng đại diện quy mô nhỏ." },
      { q: "Địa chỉ 2-2B Lam Sơn có hợp lệ để đăng ký kinh doanh không?", a: "Có. Địa chỉ này đủ điều kiện pháp lý để đăng ký kinh doanh và đăng ký thuế theo quy định hiện hành." },
      { q: "Khu vực xung quanh văn phòng Lam Sơn có quán ăn tiếp khách không?", a: "Có. Khu vực gần trục Lê Văn Sỹ tập trung nhiều quán ăn, cà phê phù hợp cho các buổi gặp gỡ đối tác không quá trang trọng." },
      { q: "Lam Sơn khác gì so với các chi nhánh khác cùng Phường Tân Sơn Hòa?", a: "Lam Sơn có lợi thế kết nối trực tiếp vào trục Lê Văn Sỹ — Cách Mạng Tháng 8, giúp di chuyển đến Quận 3, Quận 1 nhanh hơn mà không cần vòng qua các trục lớn khác." },
      { q: "Tôi có thể nâng cấp gói dịch vụ sau khi ký hợp đồng tại Lam Sơn không?", a: "Có. Bạn có thể nâng cấp từ LITE lên START hoặc BASE bất kỳ lúc nào để phù hợp với nhu cầu phát triển của doanh nghiệp." },
    ],
    testimonials: [
      { quote: "Văn phòng gần Lê Văn Sỹ nên mình hay hẹn khách ở mấy quán cà phê gần đó, không khí thoải mái hơn phòng họp.", initial: "A", name: "Gia An", role: "Chủ agency marketing nhỏ" },
      { quote: "Di chuyển từ đây qua Quận 3 làm việc với đối tác khá nhanh, mình tiết kiệm được nhiều thời gian.", initial: "Q", name: "Bảo Quốc", role: "Đại diện văn phòng khu vực" },
    ],
  },
  "hoang-ke-viem": {
    slug: "hoang-ke-viem",
    name: "Hoàng Kế Viêm, Tân Bình",
    area: AREA_TAN_BINH,
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
    intro: [
      "Văn phòng Hoàng Kế Viêm toạ lạc tại 26 Hoàng Kế Viêm, Phường Bảy Hiền, Quận Tân Bình — nằm sâu về phía trục Trường Chinh, cửa ngõ Tây Bắc của thành phố nối liền với Quận 12, Hóc Môn. Đây là lựa chọn phù hợp cho doanh nghiệp có nhu cầu kết nối với khu vực ngoại thành phía Tây Bắc TP.HCM.",
      "Khu vực quanh đường Hoàng Kế Viêm chủ yếu là dân cư sinh sống lâu năm, xen kẽ một số trường học và cơ sở giáo dục nhỏ, tạo nên không khí ổn định, ít biến động. Từ đây di chuyển ra trục Trường Chinh chỉ mất vài phút, thuận tiện cho các doanh nghiệp thường xuyên di chuyển về hướng Quận 12, sân bay hoặc các khu công nghiệp phía Tây Bắc.",
      "Chi nhánh Hoàng Kế Viêm cung cấp các gói văn phòng ảo LITE (299.000đ/tháng), START (350.000đ/tháng) và BASE (500.000đ/tháng) — phù hợp cho doanh nghiệp nhỏ, hộ kinh doanh cần địa chỉ hợp lệ với chi phí tiết kiệm nhất trong hệ thống MAX OFFICE.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Hoàng Kế Viêm",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ khu Bảy Hiền", desc: "Đủ điều kiện đăng ký kinh doanh, gần trục Trường Chinh." },
      { icon: BadgePercentIcon, title: "Giá khởi điểm chỉ 299.000đ/tháng", desc: "Gói LITE, START, BASE — tiết kiệm chi phí cho doanh nghiệp nhỏ." },
      { icon: MapPinIcon, title: "Gần trục Trường Chinh", desc: "Kết nối nhanh về hướng Quận 12, Hóc Môn và sân bay." },
      { icon: UsersIcon, title: "Khu dân cư ổn định", desc: "Môi trường yên tĩnh, xen kẽ trường học, phù hợp làm việc lâu dài." },
      { icon: ClockIcon, title: "Giao thông thuận tiện", desc: "Dễ dàng di chuyển ra các trục lớn khi cần." },
      { icon: HeadsetIcon, title: "Hỗ trợ tận tâm", desc: "Đội ngũ lễ tân, vận hành luôn sẵn sàng hỗ trợ khách hàng." },
    ],
    nearbyItems: [
      { name: "Trục đường Trường Chinh", desc: "Cửa ngõ Tây Bắc thành phố, kết nối Quận 12, Hóc Môn." },
      { name: "Khu dân cư Bảy Hiền", desc: "Khu dân cư sinh sống lâu năm, ổn định, ít biến động." },
      { name: "Trường học lân cận", desc: "Khu vực có một số trường học, cơ sở giáo dục nhỏ." },
      { name: "Sân bay Tân Sơn Nhất", desc: "Khoảng 15 phút di chuyển qua trục Trường Chinh." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Một số tuyến xe buýt chạy qua khu vực, kết nối ra trục Trường Chinh gần đó." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Dễ dàng đặt xe, khu dân cư ổn định nên tài xế quen đường." },
      { icon: CheckCircleIcon, title: "Trục Trường Chinh", desc: "Kết nối nhanh về hướng Quận 12, Hóc Môn và các khu công nghiệp." },
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Lễ tân sẵn sàng hướng dẫn đường vào chi nhánh cho khách đến lần đầu." },
    ],
    parkingInfo: [
      "Toà nhà có khu vực gửi xe máy thuận tiện cho khách đến làm việc.",
      "Hỗ trợ thông tin bãi đỗ ô tô gần khu vực khi cần.",
      "Đội bảo vệ trực thường xuyên, đảm bảo an toàn cho xe cộ.",
    ],
    diningItems: [
      { name: "Quán ăn khu dân cư Bảy Hiền", desc: "Vài quán cơm bình dân trong khu dân cư, giá hợp lý cho bữa trưa." },
      { name: "Quán cà phê gần trục Trường Chinh", desc: "Không gian phù hợp làm việc hoặc gặp gỡ đối tác nhẹ nhàng." },
      { name: "Cửa hàng tiện lợi", desc: "Có cửa hàng tiện lợi gần đó để ghé mua sắm nhanh khi cần." },
    ],
    faqs: [
      { q: "Văn phòng Hoàng Kế Viêm có gần trục Trường Chinh không?", a: "Có. Chi nhánh nằm gần trục Trường Chinh, cửa ngõ Tây Bắc thành phố, thuận tiện kết nối về hướng Quận 12, Hóc Môn." },
      { q: "Chi nhánh Hoàng Kế Viêm có những gói văn phòng ảo nào?", a: "Chi nhánh hiện áp dụng 3 gói: LITE (299.000đ/tháng), START (350.000đ/tháng) và BASE (500.000đ/tháng), phù hợp ngân sách doanh nghiệp nhỏ." },
      { q: "Địa chỉ 26 Hoàng Kế Viêm có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Bảy Hiền, Quận Tân Bình, phù hợp đăng ký kinh doanh và đăng ký thuế." },
      { q: "Văn phòng Hoàng Kế Viêm phù hợp với loại hình doanh nghiệp nào?", a: "Phù hợp nhất với doanh nghiệp nhỏ, hộ kinh doanh cá thể cần địa chỉ đăng ký hợp lệ với chi phí tiết kiệm, đặc biệt là các đơn vị thường xuyên giao dịch hoặc vận chuyển hàng hoá về hướng Quận 12, Hóc Môn." },
      { q: "Khu vực xung quanh văn phòng có yên tĩnh không?", a: "Có. Đây là khu dân cư sinh sống lâu năm, khá ổn định và yên tĩnh, phù hợp cho công việc cần sự tập trung." },
      { q: "Tôi có thể đến tham quan văn phòng Hoàng Kế Viêm trước khi ký hợp đồng không?", a: "Có. Hãy để lại thông tin qua form hoặc liên hệ hotline 089 8082 188, đội ngũ MAX OFFICE sẽ sắp xếp lịch tham quan miễn phí cho bạn." },
    ],
    testimonials: [
      { quote: "Công ty mình hay giao dịch với đối tác ở Quận 12 nên đặt văn phòng ở đây khá thuận tiện.", initial: "L", name: "Anh Lâm", role: "Giám đốc kinh doanh" },
      { quote: "Khu vực yên tĩnh, giá thuê hợp lý, phù hợp với ngân sách công ty nhỏ của mình.", initial: "H", name: "Ngọc Hiếu", role: "Chủ hộ kinh doanh cá thể" },
    ],
  },
  cmt8: {
    slug: "cmt8",
    name: "CMT8, Quận 10",
    area: AREA_QUAN_10,
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
    intro: [
      "Văn phòng CMT8 toạ lạc tại 283/26-28 Cách Mạng Tháng 8, Phường Hoà Hưng, Quận 10 — một trong những trục đường lớn và huyết mạch bậc nhất khu vực trung tâm TP.HCM, nối liền Quận 1, Quận 3 với Quận 10 và Quận Tân Bình. Đây là chi nhánh đầu tiên MAX OFFICE mở tại khu vực Quận 10 (cũ), phù hợp cho doanh nghiệp muốn có địa chỉ gần trung tâm với chi phí hợp lý hơn so với Quận 1.",
      "Khu vực Phường Hoà Hưng nằm gần Ga Sài Gòn — nhà ga đường sắt trung tâm của thành phố — cùng nhiều bệnh viện, trường đại học lớn như Bệnh viện Nhân dân 115, Đại học Bách Khoa lân cận, tạo nên mật độ dân cư và hoạt động kinh doanh sôi động suốt cả ngày. Trục Cách Mạng Tháng 8 cũng là tuyến đường được nhiều doanh nghiệp lựa chọn đặt văn phòng nhờ khả năng di chuyển thuận tiện đến hầu hết các quận trung tâm.",
      "Chi nhánh CMT8 cung cấp các gói văn phòng ảo LITE (299.000đ/tháng), START (350.000đ/tháng) và BASE (500.000đ/tháng) — là lựa chọn kinh tế cho doanh nghiệp cần địa chỉ Quận 10 gần trung tâm mà không phải trả mức phí cao như khu vực Quận 1.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng CMT8",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ mặt tiền CMT8", desc: "Đủ điều kiện đăng ký kinh doanh, mặt tiền trục đường lớn." },
      { icon: MapPinIcon, title: "Gần Ga Sài Gòn", desc: "Thuận tiện di chuyển bằng đường sắt, gần trung tâm thành phố." },
      { icon: BadgePercentIcon, title: "Giá khởi điểm chỉ 299.000đ/tháng", desc: "Gói LITE, START, BASE — kinh tế hơn so với khu vực Quận 1." },
      { icon: UsersIcon, title: "Gần bệnh viện, trường đại học", desc: "Khu vực sôi động, phù hợp nhiều loại hình doanh nghiệp." },
      { icon: ClockIcon, title: "Giao thông thuận tiện", desc: "Kết nối nhanh đến Quận 1, Quận 3, Tân Bình qua trục CMT8." },
      { icon: HeadsetIcon, title: "Hỗ trợ tận tâm", desc: "Đội ngũ lễ tân, vận hành luôn sẵn sàng hỗ trợ khách hàng." },
    ],
    nearbyItems: [
      { name: "Ga Sài Gòn", desc: "Nhà ga đường sắt trung tâm, chỉ cách chi nhánh vài phút di chuyển." },
      { name: "Bệnh viện Nhân dân 115", desc: "Bệnh viện lớn gần khu vực, góp phần vào mật độ hoạt động sôi động." },
      { name: "Khu vực Hoà Hưng", desc: "Khu dân cư — thương mại sầm uất tại Quận 10." },
      { name: "Trục Cách Mạng Tháng 8", desc: "Kết nối trực tiếp đến Quận 1, Quận 3 và Tân Bình." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt hoạt động qua trục Cách Mạng Tháng 8." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Mật độ xe cao tại khu vực mặt tiền đường lớn, dễ dàng đặt xe." },
      { icon: CheckCircleIcon, title: "Trục Cách Mạng Tháng 8", desc: "Kết nối nhanh đến Quận 1, Quận 3, Quận Tân Bình." },
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Lễ tân hỗ trợ chỉ dẫn tận tình nếu bạn chưa quen đường đến chi nhánh." },
    ],
    parkingInfo: [
      "Khu vực giữ xe máy ngay tại toà nhà mặt tiền CMT8.",
      "Hỗ trợ thông tin bãi đỗ ô tô gần khu vực Ga Sài Gòn.",
      "Có nhân viên bảo vệ trực để đảm bảo an toàn cho xe trong giờ làm việc.",
    ],
    diningItems: [
      { name: "Quán ăn khu Hoà Hưng", desc: "Đa dạng lựa chọn ẩm thực phục vụ khu vực dân cư — bệnh viện sôi động." },
      { name: "Nhà hàng trục CMT8", desc: "Nhiều lựa chọn từ cơm văn phòng đến nhà hàng phục vụ tiếp khách." },
      { name: "Khu vực gần Ga Sài Gòn", desc: "Thuận tiện cho bữa ăn nhanh trước khi di chuyển bằng tàu." },
    ],
    faqs: [
      { q: "Văn phòng CMT8 có phải chi nhánh duy nhất của MAX OFFICE tại khu vực Quận 10 (cũ) không?", a: "Không còn nữa. MAX OFFICE hiện có thêm chi nhánh 314/6 Điện Biên Phủ, Phường Vườn Lài trong cùng khu vực Quận 10 (cũ) — bạn có thể chọn chi nhánh gần đối tác hoặc thuận tiện di chuyển hơn." },
      { q: "Chi nhánh CMT8 có những gói văn phòng ảo nào?", a: "Chi nhánh cung cấp 3 mức giá: LITE (299.000đ/tháng), START (350.000đ/tháng) và BASE (500.000đ/tháng) — đều đã bao gồm địa chỉ đăng ký kinh doanh hợp lệ." },
      { q: "Địa chỉ 283/26-28 Cách Mạng Tháng 8 có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Hoà Hưng, Quận 10, phù hợp đăng ký kinh doanh và đăng ký thuế." },
      { q: "Văn phòng CMT8 có gần Ga Sài Gòn không?", a: "Có. Chi nhánh nằm khá gần Ga Sài Gòn, thuận tiện nếu bạn hoặc đối tác di chuyển bằng đường sắt." },
      { q: "Từ văn phòng CMT8 đến trung tâm Quận 1 mất bao lâu?", a: "Khoảng 10-15 phút di chuyển qua trục Cách Mạng Tháng 8, tuỳ thời điểm giao thông." },
      { q: "Chi phí thuê văn phòng ảo tại CMT8 có rẻ hơn khu vực Quận 1 không?", a: "Có. Mức giá tại CMT8 áp dụng theo bảng giá chung của MAX OFFICE, không có phụ phí trung tâm như khu vực Quận 1, phù hợp cho doanh nghiệp muốn tối ưu chi phí mà vẫn gần trung tâm." },
    ],
    testimonials: [
      { quote: "Văn phòng ngay mặt tiền CMT8 nên khách hàng dễ tìm, công ty mình trông chuyên nghiệp hơn hẳn.", initial: "B", name: "Anh Bình", role: "Giám đốc công ty dịch vụ" },
      { quote: "Gần Ga Sài Gòn nên đối tác ở tỉnh ra công tác ghé văn phòng mình rất tiện.", initial: "X", name: "Thanh Xuân", role: "Trưởng phòng kinh doanh" },
    ],
  },

  /* ===================== 314/6 ĐIỆN BIÊN PHỦ (VƯỜN LÀI) — GÓI GIÁ RIÊNG ===================== */
  "vuon-lai": {
    slug: "vuon-lai",
    name: "314/6 Điện Biên Phủ, Quận 10 (cũ)",
    area: AREA_QUAN_10,
    address: "314/6 Điện Biên Phủ, Phường Vườn Lài, Thành phố Hồ Chí Minh",
    heroTitle: "Văn Phòng Cho Thuê 314/6 Điện Biên Phủ, Phường Vườn Lài",
    heroDescription: "Chi nhánh MAX OFFICE tại 314/6 Điện Biên Phủ, Phường Vườn Lài, khu vực Quận 10 (cũ) — văn phòng ảo gói V-START từ 380.000đ/tháng, toà nhà mặt tiền hiện đại có tiệm bánh & cà phê tầng trệt.",
    metaTitle: "Văn Phòng Ảo 314/6 Điện Biên Phủ, Quận 10 (cũ) | Từ 380K/Tháng",
    metaDescription: "Thuê văn phòng ảo tại 314/6 Điện Biên Phủ, Phường Vườn Lài — gói V-START riêng biệt từ 380.000đ/tháng, toà nhà mặt tiền hiện đại, gần chi nhánh CMT8 cùng khu vực Quận 10 (cũ).",
    image: IMAGE,
    // Portrait street-front shot, không cắt — 1024x1535 gốc.
    facadeAspectRatio: "1024 / 1535",
    facadeImageSide: "left",
    interiorImages: [
      { src: "/images/dia-diem-vuon-lai-lam-viec.jpg", alt: "Không gian làm việc văn phòng 314/6 Điện Biên Phủ", caption: "Không gian làm việc" },
      { src: "/images/dia-diem-vuon-lai-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng 314/6 Điện Biên Phủ", caption: "Bảng tên công ty tại toà nhà" },
      { src: "/images/dia-diem-vuon-lai-cho-ngoi.jpg", alt: "Chỗ ngồi làm việc văn phòng 314/6 Điện Biên Phủ", caption: "Chỗ ngồi làm việc" },
      { src: "/images/dia-diem-vuon-lai-tiep-khach.jpg", alt: "Khu vực tiếp khách văn phòng 314/6 Điện Biên Phủ", caption: "Khu vực tiếp khách" },
      { src: "/images/dia-diem-vuon-lai-tien-ich-tang-tret.jpg", alt: "Tiệm bánh và cà phê tại tầng trệt toà nhà 314/6 Điện Biên Phủ", caption: "Tiện ích: Tiệm bánh & cà phê tại tầng trệt toà nhà" },
      { src: "/images/dia-diem-vuon-lai-khong-gian-trong.jpg", alt: "Không gian trống sẵn sàng bàn giao tại 314/6 Điện Biên Phủ", caption: "Không gian trống" },
    ],
    intro: [
      "Văn phòng 314/6 Điện Biên Phủ toạ lạc tại Phường Vườn Lài, trên đoạn đường Điện Biên Phủ nối dài thuộc khu vực Quận 10 (cũ) — chi nhánh thứ hai MAX OFFICE mở tại khu vực này, bên cạnh chi nhánh CMT8 đã hoạt động từ trước. Lưu ý: đây là chi nhánh khác hoàn toàn với văn phòng \"Điện Biên Phủ, Quận 1\" tại Phường Tân Định — hai địa chỉ trùng tên đường nhưng thuộc hai khu vực khác nhau của thành phố, khách hàng cần phân biệt rõ khi tra cứu hoặc đặt lịch tham quan.",
      "Toà nhà đặt chi nhánh mang phong cách kiến trúc hiện đại, mặt tiền ốp kính và khung thép đen nổi bật trên trục đường. Điểm cộng riêng của toà nhà là tầng trệt có tiệm bánh & cà phê 40&TEXAS Bakery — một tiện ích nhỏ nhưng hữu ích cho khách hàng ghé giao dịch hoặc nhân sự làm việc tại đây muốn nghỉ ngơi, gặp gỡ đối tác ngoài giờ làm việc chính thức mà không cần di chuyển xa.",
      "Chi nhánh cung cấp duy nhất gói văn phòng ảo V-START (380.000đ/tháng, bảng tên 30x10cm) — thiết kế gọn nhẹ với các tiện ích cốt lõi gồm địa chỉ đăng ký kinh doanh, lễ tân, Internet, nước uống và khu vực tiếp khách, phù hợp cho doanh nghiệp mới thành lập cần tối ưu chi phí ban đầu tại khu vực Quận 10 (cũ).",
      "Từ chi nhánh, việc di chuyển đến khu vực trung tâm Quận 1, Quận 3 hay sang chi nhánh CMT8 cùng khu vực đều khá thuận tiện nhờ vị trí nằm trên trục đường nối dài. Nếu doanh nghiệp bạn cần một địa chỉ đăng ký kinh doanh hợp lệ, chi phí thấp và không yêu cầu nhiều tiện ích cao cấp, chi nhánh 314/6 Điện Biên Phủ là lựa chọn kinh tế trong hệ thống MAX OFFICE.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng 314/6 Điện Biên Phủ",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ, toà nhà mặt tiền", desc: "Đủ điều kiện đăng ký kinh doanh, thiết kế hiện đại, khung kính-thép nổi bật." },
      { icon: MapPinIcon, title: "Phường Vườn Lài, Quận 10 (cũ)", desc: "Chi nhánh thứ hai của MAX OFFICE tại khu vực này, bên cạnh CMT8." },
      { icon: BadgePercentIcon, title: "Giá chỉ từ 380.000đ/tháng", desc: "Gói V-START riêng biệt, gọn nhẹ, tối ưu chi phí cho doanh nghiệp mới." },
      { icon: UsersIcon, title: "Tiệm bánh & cà phê tầng trệt", desc: "Tiện ích 40&TEXAS Bakery ngay dưới toà nhà, thuận tiện gặp gỡ đối tác." },
      { icon: ClockIcon, title: "Gần trung tâm Quận 1, Quận 3", desc: "Di chuyển thuận tiện qua trục Điện Biên Phủ nối dài." },
      { icon: HeadsetIcon, title: "Hỗ trợ tận tâm", desc: "Đội ngũ lễ tân, vận hành luôn sẵn sàng hỗ trợ khách hàng." },
    ],
    nearbyItems: [
      { name: "Trục Điện Biên Phủ nối dài", desc: "Đoạn đường kết nối khu vực Vườn Lài với trung tâm Quận 1, Quận 3." },
      { name: "Chi nhánh CMT8", desc: "Chi nhánh MAX OFFICE khác trong cùng khu vực Quận 10 (cũ), cách không xa." },
      { name: "Khu dân cư Phường Vườn Lài", desc: "Khu vực dân cư ổn định, nhiều hàng quán và dịch vụ tiện ích xung quanh." },
      { name: "Tiệm bánh & cà phê 40&TEXAS Bakery", desc: "Tiện ích ngay tầng trệt toà nhà, phù hợp gặp gỡ đối tác không chính thức." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt hoạt động qua khu vực Phường Vườn Lài." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Mặt tiền đường lớn, dễ dàng đặt xe vào mọi khung giờ." },
      { icon: CheckCircleIcon, title: "Trục Điện Biên Phủ nối dài", desc: "Kết nối nhanh đến Quận 1, Quận 3 và khu vực trung tâm." },
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Lễ tân hỗ trợ chỉ dẫn tận tình, đặc biệt lưu ý phân biệt với chi nhánh Điện Biên Phủ Quận 1." },
    ],
    parkingInfo: [
      "Khu vực giữ xe máy ngay tại toà nhà mặt tiền 314/6 Điện Biên Phủ.",
      "Hỗ trợ thông tin bãi đỗ ô tô gần khu vực Phường Vườn Lài.",
      "Bảo vệ toà nhà trực suốt giờ hành chính, hỗ trợ khách ra vào gửi xe.",
    ],
    diningItems: [
      { name: "Tiệm bánh & cà phê 40&TEXAS Bakery", desc: "Ngay tầng trệt toà nhà — tiện lợi cho bữa sáng nhẹ hoặc gặp gỡ đối tác." },
      { name: "Quán ăn khu Vườn Lài", desc: "Đa dạng lựa chọn ẩm thực phục vụ khu dân cư xung quanh." },
      { name: "Nhà hàng trục Điện Biên Phủ", desc: "Thích hợp đặt tiệc nhỏ hoặc mời đối tác dùng bữa sau buổi họp." },
    ],
    faqs: [
      { q: "Chi nhánh 314/6 Điện Biên Phủ có phải cùng địa chỉ với chi nhánh Điện Biên Phủ, Quận 1 không?", a: "Không. Đây là hai chi nhánh hoàn toàn khác nhau — 314/6 Điện Biên Phủ thuộc Phường Vườn Lài, khu vực Quận 10 (cũ), còn chi nhánh còn lại (95 Điện Biên Phủ) thuộc Phường Tân Định, khu vực Quận 1 (cũ). Hai địa chỉ chỉ trùng tên đường, khách hàng cần kiểm tra kỹ khi đặt lịch tham quan." },
      { q: "Chi nhánh này có những gói văn phòng ảo nào?", a: "Chi nhánh cung cấp duy nhất gói V-START với giá 380.000đ/tháng, bao gồm địa chỉ đăng ký kinh doanh, lễ tân, Internet, nước uống và khu vực tiếp khách." },
      { q: "Địa chỉ 314/6 Điện Biên Phủ có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Vườn Lài, phù hợp đăng ký kinh doanh và đăng ký thuế cho mọi loại hình doanh nghiệp." },
      { q: "Ký hợp đồng 24 tháng tại chi nhánh này được khuyến mãi gì?", a: "Có 2 lựa chọn tách biệt tuỳ tình trạng pháp lý của bạn: nếu CHƯA có giấy phép kinh doanh (GPKD), bạn được tặng 3 tháng sử dụng cộng thêm dịch vụ thành lập doanh nghiệp miễn phí; nếu ĐÃ CÓ SẴN GPKD và không cần thành lập mới, bạn được tặng 6 tháng sử dụng thay cho lựa chọn trên. Chỉ chọn 1 trong 2, không cộng dồn." },
      { q: "Toà nhà có tiệm bánh hoặc cà phê nào không?", a: "Có. Tầng trệt toà nhà là tiệm bánh & cà phê 40&TEXAS Bakery — tiện ích thực tế của toà nhà, không phải dịch vụ do MAX OFFICE cung cấp, nhưng khách thuê văn phòng có thể sử dụng như một điểm gặp gỡ đối tác thuận tiện." },
      { q: "Tôi có thể đến tham quan văn phòng 314/6 Điện Biên Phủ trước khi ký hợp đồng không?", a: "Có. Bạn để lại thông tin qua form trên trang này hoặc gọi hotline 089 8082 188 để được sắp xếp lịch tham quan, đội ngũ sẽ hướng dẫn cụ thể đường đến chi nhánh để tránh nhầm với văn phòng Điện Biên Phủ Quận 1." },
    ],
    testimonials: [
      { quote: "Ban đầu mình nhầm với chi nhánh Điện Biên Phủ bên Quận 1, may mà lễ tân gọi điện xác nhận địa chỉ trước, tránh mất công đi lộn chỗ.", initial: "P", name: "Anh Phúc", role: "Chủ hộ kinh doanh cá thể" },
      { quote: "Gói V-START giá hợp lý, đủ dùng cho công ty mới thành lập, lại có tiệm bánh dưới nhà tiện gặp khách.", initial: "N", name: "Chị Ngọc", role: "Giám đốc công ty thương mại" },
    ],
  },

  /* ===================== PHẠM VĂN ĐỒNG — GÓI GIÁ RIÊNG ===================== */
  "pham-van-dong": {
    slug: "pham-van-dong",
    name: "Phạm Văn Đồng, Thủ Đức",
    area: AREA_THU_DUC,
    address: "1148A Phạm Văn Đồng, Phường Thủ Đức, Thành phố Hồ Chí Minh",
    heroTitle: "Văn Phòng Cho Thuê Phạm Văn Đồng Thủ Đức",
    heroDescription: "Chi nhánh MAX OFFICE tại Phạm Văn Đồng, Thủ Đức — văn phòng ảo từ 370.000đ/tháng (gói M-START, M-BASE, M-ORIGIN riêng biệt), toà nhà phong cách biệt thự sang trọng.",
    metaTitle: "Văn Phòng Ảo & Cho Thuê Văn Phòng Phạm Văn Đồng Thủ Đức | Từ 370K/Tháng",
    metaDescription: "Thuê văn phòng ảo, văn phòng trọn gói tại Phạm Văn Đồng, Phường Thủ Đức — văn phòng ảo từ 370.000đ/tháng (gói M-START, M-BASE, M-ORIGIN), đầy đủ dịch vụ MAX OFFICE.",
    image: IMAGE,
    // Full-frame villa facade shot, no crop needed — 1086x1448 native.
    facadeAspectRatio: "1086 / 1448",
    facadeImageSide: "left",
    interiorImages: [
      { src: "/images/dia-diem-pham-van-dong-le-tan.jpg", alt: "Quầy lễ tân văn phòng Phạm Văn Đồng", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-pham-van-dong-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng Phạm Văn Đồng", caption: "Bảng tên công ty tại toà nhà" },
      { src: "/images/dia-diem-pham-van-dong-cho-ngoi-linh-dong.jpg", alt: "Không gian chỗ ngồi linh động văn phòng Phạm Văn Đồng", caption: "Không gian chỗ ngồi linh động" },
      { src: "/images/dia-diem-pham-van-dong-khong-gian-lam-viec.jpg", alt: "Không gian làm việc văn phòng Phạm Văn Đồng", caption: "Không gian làm việc" },
      { src: "/images/dia-diem-pham-van-dong-san-trong.jpg", alt: "Văn phòng trọn gói tại Phạm Văn Đồng", caption: "Văn phòng trọn gói" },
      { src: "/images/dia-diem-pham-van-dong-vi-tri.jpg", alt: "Bảng số nhà 1148 Phạm Văn Đồng", caption: "Bảng số nhà 1148 Phạm Văn Đồng" },
    ],
    intro: [
      "Văn phòng Phạm Văn Đồng toạ lạc tại 1148A Phạm Văn Đồng, Phường Thủ Đức, Thành phố Hồ Chí Minh — mặt tiền một trong những đại lộ hiện đại và rộng rãi bậc nhất thành phố, nối liền khu vực Gò Vấp, Bình Thạnh với cửa ngõ Đông Bắc Thủ Đức. Chi nhánh đặt trong một toà nhà phong cách biệt thự tân cổ điển, không gian sang trọng, tạo ấn tượng chuyên nghiệp ngay từ cổng vào.",
      "Khu vực Phường Thủ Đức quanh trục Phạm Văn Đồng là nơi tập trung nhiều trường đại học lớn của TP.HCM như Đại học Quốc gia TP.HCM, Đại học Nông Lâm, Đại học Sư phạm Kỹ thuật — mang lại nguồn nhân lực trẻ dồi dào cho các doanh nghiệp đặt văn phòng tại đây. Khu vực cũng không xa sông Sài Gòn, giữ được không gian thoáng đãng hơn so với nhiều quận nội thành khác.",
      "Nhờ vị trí trên trục Phạm Văn Đồng, việc di chuyển từ chi nhánh ra Quốc lộ 1A hoặc ngược về trung tâm Gò Vấp, Bình Thạnh đều rất thuận tiện, phù hợp cho doanh nghiệp có nhu cầu giao dịch ở nhiều khu vực khác nhau của thành phố.",
      "Đây cũng là chi nhánh duy nhất trong hệ thống MAX OFFICE áp dụng bảng giá văn phòng ảo riêng biệt, gồm 3 gói M-START (370.000đ/tháng), M-BASE (500.000đ/tháng) và M-ORIGIN (800.000đ/tháng) — thiết kế phù hợp với đặc điểm không gian và tiện ích tại toà nhà này, cùng chính sách khuyến mãi riêng khi ký hợp đồng dài hạn.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Phạm Văn Đồng",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ, toà nhà biệt thự", desc: "Đủ điều kiện đăng ký kinh doanh, không gian sang trọng, chuyên nghiệp." },
      { icon: MapPinIcon, title: "Mặt tiền đại lộ Phạm Văn Đồng", desc: "Một trong những trục đường hiện đại, rộng rãi bậc nhất TP.HCM." },
      { icon: BadgePercentIcon, title: "Gói dịch vụ thiết kế riêng", desc: "M-START, M-BASE, M-ORIGIN — giá và tiện ích riêng biệt cho chi nhánh này." },
      { icon: UsersIcon, title: "Gần các trường đại học lớn", desc: "Đại học Quốc gia, Nông Lâm, Sư phạm Kỹ thuật trong khu vực Thủ Đức." },
      { icon: ClockIcon, title: "Kết nối liên vùng thuận tiện", desc: "Nối nhanh Gò Vấp, Bình Thạnh và cửa ngõ Đông Bắc thành phố." },
      { icon: HeadsetIcon, title: "Hỗ trợ tận tâm", desc: "Đội ngũ lễ tân, vận hành luôn sẵn sàng hỗ trợ khách hàng." },
    ],
    nearbyItems: [
      { name: "Đại lộ Phạm Văn Đồng", desc: "Trục đường lớn hiện đại, kết nối Gò Vấp, Bình Thạnh với khu vực Thủ Đức." },
      { name: "Các trường đại học khu vực Thủ Đức", desc: "Gần Đại học Quốc gia TP.HCM, Đại học Nông Lâm, Đại học Sư phạm Kỹ thuật." },
      { name: "Sông Sài Gòn", desc: "Không gian ven sông thoáng đãng, không xa khu vực chi nhánh." },
      { name: "Khu dân cư Phường Thủ Đức", desc: "Khu vực phát triển nhanh, nhiều tiện ích dân sinh xung quanh." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt hoạt động dọc đại lộ Phạm Văn Đồng." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Mặt tiền đường lớn, dễ dàng đặt xe mọi thời điểm." },
      { icon: CheckCircleIcon, title: "Trục Phạm Văn Đồng — Quốc lộ 1A", desc: "Kết nối nhanh về Gò Vấp, Bình Thạnh và các tỉnh lân cận." },
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Lễ tân hỗ trợ hướng dẫn khi bạn đến tham quan lần đầu." },
    ],
    parkingInfo: [
      "Khu vực sân trước rộng rãi, thuận tiện gửi xe máy và ô tô.",
      "Cổng vào biệt thự có không gian đậu xe cho khách đến làm việc.",
      "Có nhân viên hỗ trợ trông giữ xe trong giờ làm việc.",
    ],
    diningItems: [
      { name: "Quán cà phê dọc Phạm Văn Đồng", desc: "Nhiều quán cà phê không gian rộng rãi, phù hợp ngồi làm việc hoặc tiếp đối tác." },
      { name: "Nhà hàng khu vực Thủ Đức", desc: "Đa dạng lựa chọn ẩm thực phục vụ khu vực đông dân cư và sinh viên." },
      { name: "Quán ăn gần các trường đại học", desc: "Giá cả bình dân, thuận tiện cho bữa trưa nhanh." },
    ],
    faqs: [
      { q: "Chi nhánh Phạm Văn Đồng có những gói văn phòng ảo nào?", a: "Chi nhánh áp dụng bảng giá riêng biệt với 3 gói: M-START (370.000đ/tháng), M-BASE (500.000đ/tháng) và M-ORIGIN (800.000đ/tháng) — khác với hệ thống gói chung của các chi nhánh khác." },
      { q: "Địa chỉ 1148A Phạm Văn Đồng có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Thủ Đức, phù hợp đăng ký kinh doanh và đăng ký thuế cho mọi loại hình doanh nghiệp." },
      { q: "Gói M-BASE và M-ORIGIN có gì khác gói M-START?", a: "M-BASE và M-ORIGIN có thêm phòng họp miễn phí (lần lượt 6 giờ/tháng và không giới hạn), chỗ ngồi linh động miễn phí (3 ngày/tháng và 7 ngày/tháng), bảng tên lớn hơn và dịch vụ in ấn/photocopy/scan — trong khi M-START chỉ gồm các tiện ích cơ bản." },
      { q: "Văn phòng Phạm Văn Đồng có gần các trường đại học không?", a: "Có. Chi nhánh nằm trong khu vực Thủ Đức, gần các trường đại học lớn như Đại học Quốc gia TP.HCM, Đại học Nông Lâm, Đại học Sư phạm Kỹ thuật." },
      { q: "Chi nhánh có khuyến mãi gì khi ký hợp đồng dài hạn không?", a: "Có. Khách hàng thanh toán hợp đồng 12 tháng được tặng thêm 3 tháng sử dụng, thanh toán hợp đồng 24 tháng được tặng thêm 7 tháng sử dụng." },
      { q: "Tôi có thể đến tham quan văn phòng Phạm Văn Đồng trước khi ký hợp đồng không?", a: "Có. Bạn để lại thông tin qua form trên trang này hoặc gọi hotline 089 8082 188, đội ngũ sẽ sắp xếp lịch tham quan trực tiếp toà nhà theo giờ thuận tiện cho bạn." },
    ],
    testimonials: [
      { quote: "Toà nhà phong cách biệt thự sang trọng, phù hợp để tiếp đối tác quan trọng.", initial: "H", name: "Anh Huy", role: "Giám đốc công ty xây dựng" },
      { quote: "Gói M-ORIGIN có phòng họp không giới hạn nên đội mình họp thoải mái mà không lo phát sinh phí.", initial: "T", name: "Chị Trang", role: "Trưởng phòng vận hành" },
    ],
  },

  /* ===================== BÙI VĂN BA, QUẬN 7 — GÓI GIÁ RIÊNG ===================== */
  "quan-7": {
    slug: "quan-7",
    name: "Bùi Văn Ba, Quận 7",
    area: AREA_QUAN_7,
    address: "Unit B3.8, Tầng 3, Block B, 210 Bùi Văn Ba, Phường Tân Thuận, Thành phố Hồ Chí Minh",
    heroTitle: "Văn Phòng Cho Thuê Bùi Văn Ba Quận 7",
    heroDescription: "Chi nhánh MAX OFFICE tại Bùi Văn Ba, Quận 7 — văn phòng ảo từ 450.000đ/tháng (gói W-BASE, W-PRO riêng biệt), toà nhà cao tầng hiện đại view sông Sài Gòn.",
    metaTitle: "Văn Phòng Ảo & Cho Thuê Văn Phòng Bùi Văn Ba Quận 7 | Từ 450K/Tháng",
    metaDescription: "Thuê văn phòng ảo, văn phòng trọn gói tại Bùi Văn Ba, Phường Tân Thuận, Quận 7 — văn phòng ảo từ 450.000đ/tháng (gói W-BASE, W-PRO), đầy đủ dịch vụ MAX OFFICE.",
    image: IMAGE,
    // Full-frame square render, no crop needed — 1254x1254 native.
    facadeAspectRatio: "1254 / 1254",
    facadeImageSide: "right",
    interiorImages: [
      { src: "/images/dia-diem-quan-7-le-tan.jpg", alt: "Quầy lễ tân văn phòng Bùi Văn Ba", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-quan-7-khong-gian-lam-viec.jpg", alt: "Không gian làm việc văn phòng Bùi Văn Ba", caption: "Không gian làm việc" },
      { src: "/images/dia-diem-quan-7-pantry.jpg", alt: "Khu vực Pantry văn phòng Bùi Văn Ba", caption: "Khu vực Pantry" },
      { src: "/images/dia-diem-quan-7-phong-hop.jpg", alt: "Phòng họp văn phòng Bùi Văn Ba", caption: "Phòng họp" },
    ],
    intro: [
      "Văn phòng Bùi Văn Ba toạ lạc tại Unit B3.8, Tầng 3, Block B, 210 Bùi Văn Ba, Phường Tân Thuận, Thành phố Hồ Chí Minh — bên trong một khu phức hợp cao tầng hiện đại nhìn ra sông Sài Gòn và cầu Phú Mỹ, một trong những cây cầu dây văng biểu tượng của thành phố. Toà nhà có đầy đủ tiện ích nội khu như hồ bơi, mang lại không gian làm việc thoải mái hơn hẳn văn phòng truyền thống.",
      "Khu vực Phường Tân Thuận gắn liền với Khu chế xuất Tân Thuận — khu chế xuất đầu tiên của Việt Nam, hiện vẫn là nơi tập trung đông đảo doanh nghiệp sản xuất, xuất nhập khẩu và logistics. Đây là lợi thế lớn cho doanh nghiệp hoạt động trong lĩnh vực thương mại quốc tế muốn có địa chỉ gần đối tác, nhà xưởng tại khu vực này.",
      "Từ chi nhánh, việc di chuyển qua cầu Tân Thuận hoặc cầu Phú Mỹ để vào trung tâm Quận 1, Quận 4 hay sang khu đô thị Phú Mỹ Hưng đều khá thuận tiện, phù hợp cho doanh nghiệp cần qua lại thường xuyên giữa khu Nam Sài Gòn và trung tâm thành phố.",
      "Đây cũng là chi nhánh áp dụng bảng giá văn phòng ảo riêng biệt, gồm 2 gói W-BASE (450.000đ/tháng) và W-PRO (750.000đ/tháng, giá chưa bao gồm VAT 10%) — kèm theo nhiều tiện ích bổ sung như phòng họp, chỗ ngồi làm việc linh động và dịch vụ pháp lý trọn gói thiết kế riêng cho toà nhà này.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Bùi Văn Ba",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ, toà nhà hiện đại", desc: "Đủ điều kiện đăng ký kinh doanh, không gian làm việc cao tầng hiện đại." },
      { icon: MapPinIcon, title: "Gần Khu chế xuất Tân Thuận", desc: "Thuận tiện cho doanh nghiệp sản xuất, xuất nhập khẩu, logistics." },
      { icon: BadgePercentIcon, title: "Gói dịch vụ thiết kế riêng", desc: "W-BASE, W-PRO — giá và tiện ích riêng biệt cho chi nhánh này." },
      { icon: UsersIcon, title: "View sông Sài Gòn, tiện ích nội khu", desc: "Toà nhà có hồ bơi, không gian xanh, tầm nhìn thoáng đãng." },
      { icon: ClockIcon, title: "Kết nối Nam Sài Gòn thuận tiện", desc: "Gần cầu Tân Thuận, cầu Phú Mỹ, khu đô thị Phú Mỹ Hưng." },
      { icon: HeadsetIcon, title: "Hỗ trợ tận tâm", desc: "Đội ngũ lễ tân, vận hành luôn sẵn sàng hỗ trợ khách hàng." },
    ],
    nearbyItems: [
      { name: "Khu chế xuất Tân Thuận", desc: "Khu chế xuất đầu tiên của Việt Nam, tập trung đông doanh nghiệp sản xuất, xuất nhập khẩu." },
      { name: "Cầu Phú Mỹ", desc: "Cầu dây văng biểu tượng, kết nối nhanh sang Quận 2 và các khu vực lân cận." },
      { name: "Sông Sài Gòn", desc: "View sông thoáng đãng ngay tại toà nhà văn phòng." },
      { name: "Khu đô thị Phú Mỹ Hưng", desc: "Không xa khu đô thị hiện đại, nhiều tiện ích thương mại, dịch vụ." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt hoạt động qua khu vực Tân Thuận." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Dễ dàng đặt xe, thuận tiện di chuyển trong khu đô thị." },
      { icon: CheckCircleIcon, title: "Cầu Tân Thuận — Cầu Phú Mỹ", desc: "Kết nối nhanh về trung tâm Quận 1, Quận 4 và Quận 2." },
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Lễ tân hỗ trợ hướng dẫn vào toà nhà khi bạn đến lần đầu." },
    ],
    parkingInfo: [
      "Toà nhà có hầm giữ xe máy và ô tô riêng cho khách đến làm việc.",
      "Bảo vệ toà nhà hỗ trợ hướng dẫn xe ra vào.",
      "Thang máy riêng kết nối trực tiếp từ hầm xe lên khu văn phòng.",
    ],
    diningItems: [
      { name: "Khu Pantry nội khu", desc: "Không gian pantry view hồ bơi ngay tại văn phòng, tiện nghỉ ngơi giữa giờ." },
      { name: "Quán ăn khu vực Tân Thuận", desc: "Đa dạng lựa chọn phục vụ khu vực đông người lao động, chuyên gia." },
      { name: "Nhà hàng gần Phú Mỹ Hưng", desc: "Nhiều lựa chọn ẩm thực cao cấp hơn khi cần tiếp đối tác." },
    ],
    faqs: [
      { q: "Chi nhánh Bùi Văn Ba có những gói văn phòng ảo nào?", a: "Chi nhánh áp dụng bảng giá riêng biệt với 2 gói: W-BASE (450.000đ/tháng) và W-PRO (750.000đ/tháng) — giá chưa bao gồm VAT 10%." },
      { q: "Địa chỉ 210 Bùi Văn Ba có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Tân Thuận, phù hợp đăng ký kinh doanh và đăng ký thuế cho mọi loại hình doanh nghiệp." },
      { q: "Gói W-PRO khác gì so với W-BASE?", a: "W-PRO có mức phí cao hơn nhưng đi kèm nhiều tiện ích miễn phí hơn — như phòng họp nhỏ, chỗ ngồi làm việc linh động, tổng đài và máy fax thông minh miễn phí — trong khi W-BASE tính phí theo lượt sử dụng cho các tiện ích này." },
      { q: "Văn phòng Bùi Văn Ba có gần Khu chế xuất Tân Thuận không?", a: "Có. Chi nhánh nằm trong khu vực Phường Tân Thuận, gần Khu chế xuất Tân Thuận — khu chế xuất đầu tiên của Việt Nam." },
      { q: "Giá văn phòng ảo tại đây đã bao gồm VAT chưa?", a: "Chưa. Mức giá 450.000đ/tháng (W-BASE) và 750.000đ/tháng (W-PRO) là giá chưa bao gồm VAT 10%, sẽ được thể hiện rõ trong báo giá chính thức." },
      { q: "Tôi có thể đến tham quan văn phòng Bùi Văn Ba trước khi ký hợp đồng không?", a: "Có. Bạn để lại thông tin qua form trên trang này hoặc gọi hotline 089 8082 188 để được sắp xếp lịch tham quan." },
    ],
    testimonials: [
      { quote: "Văn phòng có view sông và hồ bơi nên không gian làm việc rất thư giãn, khác hẳn văn phòng truyền thống.", initial: "L", name: "Chị Linh", role: "Giám đốc công ty xuất nhập khẩu" },
      { quote: "Gần Khu chế xuất Tân Thuận nên đối tác của mình ghé văn phòng rất thuận tiện.", initial: "K", name: "Anh Khôi", role: "Trưởng phòng logistics" },
    ],
  },
};

export function getLocationBySlug(slug: string): LocationData | undefined {
  return LOCATIONS_DATA[slug];
}

export function getAllLocationSlugs(): string[] {
  return Object.keys(LOCATIONS_DATA);
}

export function getLocationsForArea(areaSlug: string): LocationListItem[] {
  return LOCATIONS_LIST.filter((loc) => loc.area.slug === areaSlug);
}

export type GroupedLocations = {
  /** Khu vực có từ 2 chi nhánh trở lên — hiển thị thành khối riêng. */
  multiBranchGroups: { area: AreaInfo; locations: LocationListItem[] }[];
  /** Chi nhánh thuộc các khu vực chỉ có 1 chi nhánh — gộp chung 1 danh sách. */
  singleBranchLocations: LocationListItem[];
};

/**
 * Nhóm 15 chi nhánh theo khu vực, tách khu vực nhiều chi nhánh (khối riêng)
 * và khu vực 1 chi nhánh (gộp chung) — dùng chung cho /dia-diem và mega menu
 * để 2 nơi luôn nhất quán, không cần sửa tay khi thêm chi nhánh/khu vực mới.
 */
export function getGroupedLocations(): GroupedLocations {
  const areaGroups = AREAS.map((area) => ({
    area,
    locations: getLocationsForArea(area.slug),
  })).filter((g) => g.locations.length > 0);

  return {
    multiBranchGroups: areaGroups.filter((g) => g.locations.length >= 2),
    singleBranchLocations: areaGroups
      .filter((g) => g.locations.length === 1)
      .flatMap((g) => g.locations),
  };
}
