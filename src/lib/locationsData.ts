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
  HeartHandshakeIcon,
  CarIcon,
} from "@/components/icons";
import type { BenefitItem } from "@/components/ServiceBenefits";
import type { NearbyItem } from "@/components/LocationNearby";
import type { TransportItem } from "@/components/LocationAccess";
import type { DiningItem } from "@/components/LocationDining";
import type { FaqItem } from "@/components/Faq";
import type { Testimonial } from "@/components/Testimonials";
import { PHAM_VAN_DONG_VO_PROMOS } from "./virtualOfficePlans";

/**
 * Một PHIÊN BẢN nội dung khuyến mãi, có hiệu lực từ 1 mốc thời gian cụ thể.
 * Dùng khi khuyến mãi của 1 chi nhánh có THỜI HẠN đã biết trước (VD: chính
 * sách áp dụng đến hết 1 ngày nào đó, sau đó tự động đổi sang chính sách
 * mới) — khai báo sẵn tất cả các phiên bản ở đây, KHÔNG cần sửa code thủ
 * công đúng ngày chuyển giao. `resolveTimedPromotions()` tự chọn đúng bản áp
 * dụng dựa trên so sánh `effectiveFrom` với thời điểm render (`new Date()`).
 */
export type TimedPromoVersion = {
  /** Ngày bắt đầu áp dụng phiên bản này, dạng ISO string (VD: "2027-01-01"). Bỏ trống = phiên bản GỐC/mặc định, dùng khi chưa tới ngày hiệu lực của bất kỳ phiên bản nào khác. */
  effectiveFrom?: string;
  promotions: string[];
};

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
  {
    slug: "quan-3-cu",
    name: "Quận 3 (cũ)",
    description: "Khu vực trung tâm, gần Quận 1, nổi tiếng với các tuyến phố yên tĩnh và nhiều toà nhà văn phòng lâu năm.",
  },
  {
    slug: "binh-thanh-cu",
    name: "Bình Thạnh (cũ)",
    description: "Khu vực cửa ngõ Đông Bắc trung tâm thành phố, gần cầu Sài Gòn, kênh Nhiêu Lộc - Thị Nghè và nhiều toà nhà văn phòng dọc trục Ung Văn Khiêm.",
  },
  {
    slug: "phu-nhuan-cu",
    name: "Phú Nhuận (cũ)",
    description: "Khu vực trung tâm giáp Quận 1, Quận 3, Tân Bình và Bình Thạnh, gần chợ Phú Nhuận và sân bay Tân Sơn Nhất.",
  },
  {
    slug: "quan-4-cu",
    name: "Quận 4 (cũ)",
    description: "Khu vực chỉ cách trung tâm Quận 1 một nhịp cầu, nổi tiếng với phố ẩm thực Vĩnh Khánh và Bến Nhà Rồng lịch sử.",
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
const AREA_QUAN_3 = { slug: "quan-3-cu", name: "Quận 3 (cũ)" };
const AREA_BINH_THANH = { slug: "binh-thanh-cu", name: "Bình Thạnh (cũ)" };
const AREA_PHU_NHUAN = { slug: "phu-nhuan-cu", name: "Phú Nhuận (cũ)" };
const AREA_QUAN_4 = { slug: "quan-4-cu", name: "Quận 4 (cũ)" };

export type LocationListItem = {
  slug: string;
  name: string;
  shortAddress: string;
  tag?: string;
  area: { slug: string; name: string };
  /** Tạm ẩn chi nhánh khỏi mọi nơi hiển thị công khai (dropdown, /dia-diem, sitemap, cross-links) mà KHÔNG xoá dữ liệu — bỏ trường này hoặc đặt lại `true` để hiển thị lại. Mặc định `true` khi không khai báo. */
  isActive?: boolean;
};

/** Danh sách đầy đủ mọi chi nhánh, kể cả chi nhánh đang tạm ẩn (isActive: false) — dùng nội bộ, không export trực tiếp để tránh vô tình hiển thị chi nhánh đã ẩn. */
const ALL_LOCATIONS_LIST: LocationListItem[] = [
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
    slug: "ba-thang-hai",
    name: "618 Ba Tháng Hai, Quận 10 (cũ)",
    shortAddress: "614-616-618 Ba Tháng Hai, P. Diên Hồng",
    area: AREA_QUAN_10,
  },
  {
    slug: "vuon-lai",
    name: "314/6 Điện Biên Phủ, Quận 10 (cũ)",
    shortAddress: "314/6 Điện Biên Phủ, P. Vườn Lài",
    area: AREA_QUAN_10,
    // TẠM ẨN — không xoá dữ liệu, chỉ ẩn khỏi hiển thị công khai. Đặt lại
    // `isActive: true` (hoặc xoá dòng này) để bật lại chi nhánh.
    isActive: false,
  },
  {
    slug: "pham-van-dong",
    name: "Phạm Văn Đồng, Thủ Đức",
    shortAddress: "1148A Phạm Văn Đồng, P. Thủ Đức",
    area: AREA_THU_DUC,
  },
  {
    slug: "quoc-huong",
    name: "27C Quốc Hương, TP. Thủ Đức (cũ)",
    shortAddress: "27C Quốc Hương, P. An Khánh",
    area: AREA_THU_DUC,
  },
  {
    slug: "quan-7",
    name: "Bùi Văn Ba, Quận 7",
    shortAddress: "210 Bùi Văn Ba, P. Tân Thuận",
    area: AREA_QUAN_7,
  },
  {
    slug: "nguyen-thong",
    name: "60 Nguyễn Thông, Quận 3 (cũ)",
    shortAddress: "60 Nguyễn Thông, P. Nhiêu Lộc",
    area: AREA_QUAN_3,
  },
  {
    slug: "cach-mang-thang-8",
    name: "520 Cách Mạng Tháng 8, Quận 3 (cũ)",
    shortAddress: "520 CMT8, P. Nhiêu Lộc",
    area: AREA_QUAN_3,
  },
  {
    slug: "ung-van-khiem",
    name: "161 Ung Văn Khiêm, Bình Thạnh (cũ)",
    shortAddress: "161 Ung Văn Khiêm, P. Thạnh Mỹ Tây",
    area: AREA_BINH_THANH,
  },
  {
    slug: "tan-cang",
    name: "23 Tân Cảng, Bình Thạnh (cũ)",
    shortAddress: "23 Tân Cảng, P. Thạnh Mỹ Tây",
    area: AREA_BINH_THANH,
  },
  {
    slug: "n1-dien-bien-phu",
    name: "N1 Điện Biên Phủ, Bình Thạnh (cũ)",
    shortAddress: "N1 Điện Biên Phủ, P. Thạnh Mỹ Tây",
    area: AREA_BINH_THANH,
  },
  {
    slug: "phan-dinh-phung",
    name: "89 Phan Đình Phùng, Phú Nhuận (cũ)",
    shortAddress: "89 Phan Đình Phùng, P. Phú Nhuận",
    area: AREA_PHU_NHUAN,
  },
  {
    slug: "nguyen-truong-to",
    name: "84-86 Nguyễn Trường Tộ, Quận 4 (cũ)",
    shortAddress: "84-86 Nguyễn Trường Tộ, P. Xóm Chiếu",
    area: AREA_QUAN_4,
  },
  {
    slug: "le-quoc-hung",
    name: "54-56 Lê Quốc Hưng, Quận 4 (cũ)",
    shortAddress: "54-56 Lê Quốc Hưng, P. Xóm Chiếu",
    area: AREA_QUAN_4,
  },
  {
    slug: "mac-dinh-chi",
    name: "36 Mạc Đĩnh Chi, Quận 1 (cũ)",
    shortAddress: "36 Mạc Đĩnh Chi, P. Tân Định",
    area: AREA_QUAN_1,
  },
  {
    slug: "pasteur",
    name: "28-34 Pasteur, Quận 1 (cũ)",
    shortAddress: "28-34 Pasteur, P. Sài Gòn",
    area: AREA_QUAN_1,
  },
];

/**
 * Danh sách chi nhánh ĐANG HIỂN THỊ CÔNG KHAI — lọc bỏ các chi nhánh có
 * `isActive: false` (tạm ẩn). Dùng cho dropdown, /dia-diem, cross-links —
 * mọi nơi hiển thị công khai nên import từ đây thay vì ALL_LOCATIONS_LIST.
 */
export const LOCATIONS_LIST: LocationListItem[] = ALL_LOCATIONS_LIST.filter(
  (loc) => loc.isActive !== false
);

/**
 * Số chi nhánh ĐANG hoạt động — nguồn DUY NHẤT cho mọi nơi hiển thị con số
 * này trên site (metadata, hero, stats, FAQ, OG image...). Luôn import hằng
 * số này thay vì gõ tay "25" — khi thêm/ẩn chi nhánh (sửa ALL_LOCATIONS_LIST
 * ở trên), mọi nơi dùng hằng số này tự cập nhật theo, tránh tình trạng lệch
 * số giữa các trang như từng gặp (một số nơi vẫn ghi "22" dù đã lên 25 chi
 * nhánh). Nội dung bài blog đã xuất bản (blogData.ts) là ngoại lệ CÓ CHỦ Ý —
 * giữ nguyên số liệu tại thời điểm đăng bài, không tự động đổi theo.
 */
export const ACTIVE_BRANCH_COUNT = LOCATIONS_LIST.length;

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
  /** Ảnh banner đầu trang (PageHero) — MỘT ảnh hero wide-format chọn từ
      pool ~12 ảnh hero dùng chung trên site (trang chủ, dịch vụ, chi
      nhánh hub...), KHÔNG phải ảnh mặt tiền của chính chi nhánh này (ảnh
      mặt tiền dọc crop xấu khi ép vào banner ngang full-width). Phân bổ
      đa dạng thủ công giữa các chi nhánh — không lặp lại ở 2 chi nhánh kề
      nhau hoặc cùng khu vực (area). Ảnh mặt tiền thật vẫn dùng riêng ở
      LocationImagesSection (gallery), PlanQuoteCard, và localBusinessSchema
      (xem LocationPageTemplate.tsx). */
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
  /** Khuyến mãi có thời hạn/điều kiện riêng của chi nhánh — hiển thị trên trang chi nhánh (qua LocationServicesList/component riêng) và trên card báo giá PNG (PlanQuoteCard/PlanGroupQuoteCard). Khác với `benefits` (đặc điểm cố định), đây là ưu đãi có thể hết hạn nên tách riêng field, không gộp vào benefits. Có thể là `string[]` đơn giản (không đổi theo thời gian) hoặc `TimedPromoVersion[]` (nhiều phiên bản theo mốc ngày, VD chính sách hiện tại + chính sách mới từ 1 ngày trong tương lai) — LUÔN đọc qua `resolveTimedPromotions()` ở nơi hiển thị, không đọc trực tiếp field này. Bỏ trống/undefined => ẩn hẳn khối khuyến mãi. */
  promotions?: string[] | TimedPromoVersion[];
  /** Tạm ẩn chi nhánh khỏi mọi nơi hiển thị công khai (KHÔNG xoá dữ liệu) — trang /locations/[slug] trả về 404, loại khỏi sitemap. Mặc định `true` khi không khai báo. */
  isActive?: boolean;
};

/**
 * Chọn đúng danh sách khuyến mãi áp dụng tại thời điểm `now` (mặc định là
 * lúc gọi hàm) từ field `promotions` của `LocationData` — hỗ trợ cả dạng đơn
 * giản (`string[]`, không đổi theo thời gian) lẫn dạng nhiều phiên bản theo
 * mốc ngày (`TimedPromoVersion[]`).
 *
 * Logic: lấy phiên bản có `effectiveFrom` MỚI NHẤT mà đã tới ngày áp dụng
 * (`effectiveFrom <= now`); nếu chưa phiên bản có ngày nào tới hạn, dùng
 * phiên bản KHÔNG khai báo `effectiveFrom` (phiên bản gốc/mặc định) làm dự
 * phòng. Dùng CHUNG được cho mọi chi nhánh/khuyến mãi có thời hạn tương tự
 * trong tương lai — chỉ cần khai báo `TimedPromoVersion[]` ở `LocationData`,
 * không cần sửa hàm này.
 */
export function resolveTimedPromotions(
  promotions: LocationData["promotions"],
  now: Date = new Date()
): string[] | undefined {
  if (!promotions || promotions.length === 0) return undefined;
  // Dạng đơn giản — không có phiên bản theo thời gian, dùng nguyên trạng.
  if (typeof promotions[0] === "string") return promotions as string[];
  const versions = promotions as TimedPromoVersion[];
  const applicable = versions
    .filter((v) => !v.effectiveFrom || new Date(v.effectiveFrom).getTime() <= now.getTime())
    .sort((a, b) => {
      const aTime = a.effectiveFrom ? new Date(a.effectiveFrom).getTime() : -Infinity;
      const bTime = b.effectiveFrom ? new Date(b.effectiveFrom).getTime() : -Infinity;
      return bTime - aTime; // Mới nhất trước.
    });
  return applicable[0]?.promotions;
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
    area: AREA_TAN_BINH,
    address: "Số 10 Sông Thao, Phường Tân Sơn Hoà, Quận Tân Bình, TP.HCM",
    heroTitle: "Văn Phòng Cho Thuê Sông Thao Tân Bình",
    heroDescription:
      "Trụ sở chính của MAX OFFICE — đầy đủ toàn bộ dịch vụ văn phòng ảo, văn phòng trọn gói, phòng họp và kế toán thuế, ngay gần sân bay Tân Sơn Nhất.",
    metaTitle: "Văn Phòng Ảo & Trọn Gói Tại Sông Thao, Tân Bình | Từ 350K/Tháng",
    metaDescription:
      "Thuê văn phòng ảo, văn phòng trọn gói tại Sông Thao, Tân Bình — trụ sở chính MAX OFFICE, đầy đủ dịch vụ, văn phòng ảo từ 350.000đ/tháng (gói START, BASE), gần sân bay Tân Sơn Nhất.",
    image: "/images/hero.jpg",
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
      `Văn phòng Sông Thao là trụ sở chính của MAX OFFICE, toạ lạc tại số 10 Sông Thao, Phường Tân Sơn Hoà, Quận Tân Bình — nơi công ty bắt đầu hoạt động từ năm 2022 và phát triển thành hệ thống ${ACTIVE_BRANCH_COUNT} địa điểm tại TP.HCM như hiện nay. Đây là chi nhánh có quy mô lớn nhất, cung cấp đầy đủ toàn bộ dịch vụ của MAX OFFICE dưới một mái nhà.`,
      "Với vai trò trụ sở chính, văn phòng Sông Thao là nơi đội ngũ vận hành cốt lõi làm việc trực tiếp, từ bộ phận tư vấn, kế toán, pháp lý đến chăm sóc khách hàng. Khách hàng lựa chọn chi nhánh này không chỉ được sử dụng địa chỉ đăng ký kinh doanh hợp lệ mà còn được tiếp cận nhanh chóng với đội ngũ chuyên môn giàu kinh nghiệm nhất của công ty.",
      "Vị trí tại Phường Tân Sơn Hoà giúp văn phòng Sông Thao nằm gần sân bay quốc tế Tân Sơn Nhất — lợi thế lớn cho các doanh nghiệp thường xuyên đón tiếp đối tác từ tỉnh khác hoặc nước ngoài. Khu vực xung quanh cũng tập trung nhiều toà nhà văn phòng và khu dân cư, tạo môi trường kinh doanh sôi động thuận tiện cho việc kết nối, giao dịch.",
      "Từ văn phòng ảo (gói START, BASE) với chi phí khởi điểm 350.000đ/tháng đến văn phòng trọn gói sẵn sàng sử dụng ngay, chi nhánh Sông Thao đáp ứng linh hoạt nhu cầu của mọi giai đoạn phát triển doanh nghiệp — từ công ty mới thành lập đến doanh nghiệp đang mở rộng quy mô đội ngũ.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Sông Thao",
    benefits: [
      { icon: BuildingIcon, title: "Trụ sở chính đầy đủ dịch vụ", desc: "Cung cấp toàn bộ 6 dịch vụ cốt lõi của MAX OFFICE tại một địa điểm." },
      { icon: CarIcon, title: "Bãi đậu ô tô miễn phí", desc: "Khu vực đỗ ô tô riêng dành cho khách đến làm việc, họp hoặc tham quan trụ sở, không phát sinh phí." },
      { icon: MapPinIcon, title: "Gần sân bay Tân Sơn Nhất", desc: "Thuận tiện đón tiếp đối tác, khách hàng từ tỉnh khác hoặc nước ngoài." },
      { icon: UsersIcon, title: "Đội ngũ vận hành trực tiếp", desc: "Tiếp cận nhanh với bộ phận tư vấn, kế toán, pháp lý giàu kinh nghiệm." },
      { icon: ShieldCheckIcon, title: "Không gian rộng rãi, hiện đại", desc: "Cơ sở vật chất đầy đủ, phù hợp tiếp khách và làm việc lâu dài." },
      { icon: ClockIcon, title: "Giao thông thuận tiện", desc: "Kết nối nhanh đến trung tâm thành phố qua trục Cộng Hoà — Trường Sơn." },
      { icon: HeadsetIcon, title: "Ưu tiên hỗ trợ nhanh", desc: "Là trụ sở chính nên thời gian xử lý yêu cầu thường nhanh nhất hệ thống." },
    ],
    // 2 giai đoạn khuyến mãi theo thời hạn — xem TimedPromoVersion/
    // resolveTimedPromotions() ở đầu file. Giai đoạn hiện tại (không khai
    // báo effectiveFrom = phiên bản gốc) áp dụng đến hết 31/12/2026; từ
    // 01/01/2027 tự động chuyển sang giai đoạn mới, không cần sửa code.
    promotions: [
      {
        // Giai đoạn hiện tại, áp dụng đến hết 31/12/2026: 2 ưu đãi cùng lúc,
        // không điều kiện GPKD.
        promotions: [
          "Ký hợp đồng 12 tháng: tặng 2 tháng miễn phí",
          "Ký hợp đồng 24 tháng: tặng 6 tháng miễn phí + tặng dịch vụ thành lập doanh nghiệp (GPKD)",
        ],
      },
      {
        // Giai đoạn mới, từ 01/01/2027: gói 24 tháng đổi thành 2 lựa chọn
        // tuỳ tình trạng GPKD của khách (giống cấu trúc VUON_LAI_VO_PROMOS).
        effectiveFrom: "2027-01-01",
        promotions: [
          "Ký hợp đồng 12 tháng: tặng 2 tháng miễn phí",
          "Ký hợp đồng 24 tháng — khách CHƯA có GPKD: tặng 3 tháng miễn phí + tặng dịch vụ thành lập doanh nghiệp (GPKD)",
          "Ký hợp đồng 24 tháng — khách ĐÃ CÓ SẴN GPKD: tặng 6 tháng miễn phí (thay cho lựa chọn tặng 3 tháng + GPKD ở trên)",
        ],
      },
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
    image: "/images/hero-chi-nhanh.png",
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
      `Văn phòng Điện Biên Phủ là chi nhánh đắc địa nhất trong hệ thống ${ACTIVE_BRANCH_COUNT} địa điểm của MAX OFFICE, toạ lạc tại số 95 Điện Biên Phủ, Phường Tân Định, Quận 1 — khu vực trung tâm hành chính, tài chính và thương mại sầm uất bậc nhất TP.HCM. Đây là lựa chọn hàng đầu cho doanh nghiệp muốn khẳng định vị thế ngay từ địa chỉ đăng ký kinh doanh.`,
      "Sở hữu địa chỉ Quận 1 mang lại lợi thế lớn về mặt hình ảnh và uy tín khi giao dịch với đối tác, nhà đầu tư hoặc khách hàng — đặc biệt quan trọng với các ngành nghề như tư vấn, tài chính, pháp lý hay công nghệ, nơi địa chỉ trụ sở góp phần thể hiện quy mô và độ tin cậy của doanh nghiệp.",
      "Phường Tân Định là khu vực gắn liền với nhiều địa danh quen thuộc của Sài Gòn như Nhà thờ Tân Định, chợ Tân Định và khu Đa Kao — mang đến không gian vừa cổ kính vừa hiện đại, thuận tiện di chuyển đến các quận trung tâm lân cận như Quận 3, Bình Thạnh chỉ trong vài phút.",
      "Tại chi nhánh Điện Biên Phủ, MAX OFFICE cung cấp đầy đủ dịch vụ văn phòng ảo, văn phòng trọn gói, phòng họp theo giờ, chỗ ngồi linh động cùng dịch vụ thành lập doanh nghiệp và kế toán thuế — giúp doanh nghiệp vận hành trọn vẹn ngay tại một trong những địa chỉ uy tín nhất thành phố.",
      "Chi nhánh cũng đang áp dụng chính sách ưu đãi cho khách ký hợp đồng dài hạn: tặng 2 tháng sử dụng miễn phí khi ký 12 tháng, tặng 6 tháng miễn phí kèm dịch vụ thành lập doanh nghiệp khi ký 24 tháng — áp dụng đến hết năm 2026.",
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
    // 2 giai đoạn khuyến mãi theo thời hạn — CÙNG cấu trúc/cơ chế đã dùng
    // cho Sông Thao (xem TimedPromoVersion/resolveTimedPromotions() ở đầu
    // file), áp dụng riêng cho Điện Biên Phủ Quận 1, không sửa lại dữ liệu
    // của Sông Thao. Giai đoạn hiện tại (không khai báo effectiveFrom =
    // phiên bản gốc) áp dụng đến hết 31/12/2026; từ 01/01/2027 tự động
    // chuyển sang giai đoạn mới, không cần sửa code.
    promotions: [
      {
        // Giai đoạn hiện tại, áp dụng đến hết 31/12/2026: 2 ưu đãi cùng lúc,
        // không điều kiện GPKD.
        promotions: [
          "Ký hợp đồng 12 tháng: tặng 2 tháng miễn phí",
          "Ký hợp đồng 24 tháng: tặng 6 tháng miễn phí + tặng dịch vụ thành lập doanh nghiệp (GPKD)",
        ],
      },
      {
        // Giai đoạn mới, từ 01/01/2027: gói 24 tháng đổi thành 2 lựa chọn
        // tuỳ tình trạng GPKD của khách (giống cấu trúc VUON_LAI_VO_PROMOS).
        effectiveFrom: "2027-01-01",
        promotions: [
          "Ký hợp đồng 12 tháng: tặng 2 tháng miễn phí",
          "Ký hợp đồng 24 tháng — khách CHƯA có GPKD: tặng 3 tháng miễn phí + tặng dịch vụ thành lập doanh nghiệp (GPKD)",
          "Ký hợp đồng 24 tháng — khách ĐÃ CÓ SẴN GPKD: tặng 6 tháng miễn phí (thay cho lựa chọn tặng 3 tháng + GPKD ở trên)",
        ],
      },
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
      { q: "Ký hợp đồng dài hạn tại Điện Biên Phủ Quận 1 có ưu đãi gì không?", a: "Có. Ký hợp đồng 12 tháng được tặng 2 tháng sử dụng miễn phí; ký hợp đồng 24 tháng được tặng 6 tháng sử dụng miễn phí kèm dịch vụ thành lập doanh nghiệp (GPKD) — áp dụng đến hết 31/12/2026. Từ 01/01/2027, chính sách 24 tháng điều chỉnh theo tình trạng GPKD của khách: nếu chưa có GPKD, được tặng 3 tháng cộng thêm dịch vụ thành lập doanh nghiệp; nếu đã có sẵn GPKD, được tặng 6 tháng thay cho lựa chọn trên." },
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
      "Văn phòng ảo hạng A tại Gò Vấp — một trong số ít lựa chọn chất lượng cao tại khu vực, mức giá thấp hơn mặt bằng chung thị trường nhưng đi kèm nhiều đặc quyền vượt trội.",
    metaTitle: "Văn Phòng Ảo Hạng A Tại Gò Vấp Nguyễn Oanh | Từ 499K/Tháng",
    metaDescription:
      "Văn phòng ảo tại Nguyễn Oanh, Gò Vấp — toà nhà hạng A, một trong số ít lựa chọn chất lượng cao tại khu vực. Từ 499.000đ/tháng (gói ORIGIN, ORIGIN+, RISE), kèm tư vấn AI, ưu tiên hỗ trợ 24/7, phòng họp.",
    image: "/images/hero-dia-diem.jpg",
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
      "Khu vực Gò Vấp hiện có rất ít đơn vị khai thác văn phòng ảo đạt chuẩn hạng A — nguồn cung khan hiếm khiến mặt bằng giá chung tại đây thường từ 595.000đ/tháng trở lên. Văn phòng Nguyễn Oanh của MAX OFFICE cung cấp các gói ORIGIN, ORIGIN+ và RISE chỉ từ 499.000đ/tháng — thấp hơn mặt bằng chung khu vực, nhưng vẫn đi kèm nhiều đặc quyền mà các lựa chọn khác trong khu vực thường không có.",
      "Trục đường Nguyễn Oanh là một trong những tuyến đường chính của Gò Vấp, kết nối thuận tiện đến các khu vực lân cận như Phú Nhuận, Tân Bình và trung tâm thành phố. Giao thông khu vực khá thuận lợi với nhiều tuyến xe buýt và dễ dàng di chuyển bằng taxi, xe công nghệ.",
      "Tại chi nhánh này, khách hàng có thể sử dụng đầy đủ dịch vụ từ văn phòng ảo, chỗ ngồi linh động, phòng họp theo giờ đến dịch vụ thành lập doanh nghiệp và kế toán thuế — phù hợp với doanh nghiệp tại khu vực Gò Vấp muốn vận hành từ một địa chỉ hạng A mà không phải di chuyển xa vào trung tâm. Chi nhánh cũng đang áp dụng ưu đãi ký hợp đồng dài hạn, mức tặng khác nhau tuỳ bạn chuyển địa chỉ công ty đã có sẵn về đây hay thành lập công ty mới tại chi nhánh — xem chi tiết trong phần Câu hỏi thường gặp bên dưới.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Nguyễn Oanh Gò Vấp",
    benefits: [
      { icon: BadgePercentIcon, title: "Chất lượng hạng A, giá thấp hơn mặt bằng khu vực", desc: "Toà nhà hạng A hiếm có tại Gò Vấp — mức giá chỉ từ 499.000đ/tháng, thấp hơn mặt bằng chung khu vực, nhưng đi kèm nhiều tiện ích vượt trội." },
      { icon: UsersIcon, title: "Khu vực đông dân cư", desc: "Thuận tiện tiếp cận khách hàng, đối tác trong khu vực Gò Vấp." },
      { icon: ClockIcon, title: "Giao thông thuận tiện", desc: "Kết nối nhanh đến Phú Nhuận, Tân Bình và trung tâm thành phố." },
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ", desc: "Đủ điều kiện đăng ký kinh doanh, đăng ký thuế cho hộ kinh doanh và công ty." },
      { icon: WifiIcon, title: "Hạ tầng đầy đủ", desc: "Wifi tốc độ cao, không gian làm việc hiện đại." },
      { icon: HeadsetIcon, title: "Hỗ trợ tận tâm", desc: "Đội ngũ tư vấn hỗ trợ nhanh chóng cho khách hàng khu vực Gò Vấp." },
    ],
    promotions: [
      "Khách đã có GPKD: ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng + tặng dịch vụ đổi GPKD",
      "Thành lập công ty mới tại đây: ký 12 tháng tặng 2 tháng, ký 24 tháng tặng 4 tháng + tặng GPKD",
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
      { q: "Văn phòng Nguyễn Oanh có phù hợp cho hộ kinh doanh không?", a: "Phù hợp nếu bạn cần địa chỉ tại một toà nhà hạng A cùng các tiện ích đi kèm như tư vấn AI, ưu tiên hỗ trợ 24/7 và phòng họp. Khu vực Gò Vấp hiện có rất ít lựa chọn văn phòng ảo hạng A, nên chi nhánh này áp dụng các gói từ ORIGIN trở lên (499.000đ/tháng) — mức giá thấp hơn mặt bằng chung khu vực, dù chưa phải mức giá thấp nhất hệ thống. Nếu bạn cần gói giá thấp hơn (Gói LITE hoặc START) để tối ưu chi phí ban đầu, MAX OFFICE có sẵn tại các chi nhánh Hoàng Việt, Bàu Cát 2, Lam Sơn, Hoàng Kế Viêm, CMT8, Sông Thao và Điện Biên Phủ." },
      { q: "Địa chỉ tại Nguyễn Oanh có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý để đăng ký kinh doanh, đăng ký thuế." },
      { q: "Giá văn phòng ảo tại đây có khác gì so với các chi nhánh khác không?", a: "Có. Nguyễn Oanh là toà nhà hạng A — phân khúc hiếm tại Gò Vấp, nên chi nhánh này chỉ áp dụng các gói từ ORIGIN trở lên (499.000đ/tháng), không có Gói LITE/START/BASE. Đổi lại, các gói này đi kèm tư vấn AI, ưu tiên hỗ trợ 24/7 và phòng họp mà các lựa chọn giá thấp hơn không có." },
      { q: "Khu vực Gò Vấp có thuận tiện di chuyển đến trung tâm thành phố không?", a: "Có. Trục đường Nguyễn Oanh — Phan Văn Trị kết nối khá nhanh đến Phú Nhuận và trung tâm TP.HCM." },
      { q: "Tôi có thể thuê chỗ ngồi linh động tại chi nhánh này không?", a: "Có. Chi nhánh cung cấp đầy đủ dịch vụ chỗ ngồi linh động, phù hợp freelancer và nhóm nhỏ tại khu vực Gò Vấp." },
      { q: "Chi nhánh có hỗ trợ kế toán thuế cho hộ kinh doanh không?", a: "Có. Dịch vụ kế toán thuế trọn gói từ 500.000đ/tháng được cung cấp đầy đủ tại đây." },
      { q: "Tôi có thể đặt lịch tham quan văn phòng Nguyễn Oanh không?", a: "Có. Bạn để lại thông tin qua form trên trang này hoặc gọi hotline 089 8082 188, đội ngũ tại Gò Vấp sẽ liên hệ xác nhận lịch tham quan phù hợp." },
      { q: "Văn phòng có chỗ đỗ xe cho khách vãng lai không?", a: "Có. Khu vực giữ xe máy và hỗ trợ đỗ ô tô ngay tại toà nhà." },
      { q: "Ký hợp đồng dài hạn tại Nguyễn Oanh có khuyến mãi gì không?", a: "Có, và mức ưu đãi khác nhau tuỳ tình trạng công ty của bạn. Nếu bạn ĐÃ CÓ công ty và chỉ cần chuyển địa chỉ đăng ký kinh doanh về chi nhánh này, ký hợp đồng 12 tháng được tặng 1 tháng sử dụng miễn phí, ký 24 tháng được tặng 2 tháng, và với hợp đồng từ 12 tháng trở lên còn được tặng thêm dịch vụ làm thủ tục đổi giấy phép kinh doanh (GPKD) sang địa chỉ mới. Nếu bạn THÀNH LẬP CÔNG TY MỚI tại đây, mức ưu đãi cao hơn: ký 12 tháng được tặng 2 tháng, ký 24 tháng được tặng 4 tháng — 4 tháng này cũng có thể quy đổi thành dịch vụ thành lập doanh nghiệp nếu bạn cần MAX OFFICE hỗ trợ luôn thủ tục thành lập." },
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
    image: "/images/anh-hero-moi.jpg",
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
      `Chi nhánh Yên Thế là một trong số ít văn phòng của MAX OFFICE có phòng đào tạo & sự kiện riêng biệt, sức chứa 30-50 người — phù hợp cho doanh nghiệp cần tổ chức workshop, buổi đào tạo nội bộ hoặc ra mắt sản phẩm mà không phải thuê thêm địa điểm bên ngoài. Khách hàng có thể lựa chọn từ gói văn phòng ảo BASE (500.000đ/tháng) đến ORIGIN, ORIGIN+ và cả gói RISE cao cấp nhất — đầy đủ hơn hẳn nhiều chi nhánh khác trong hệ thống ${ACTIVE_BRANCH_COUNT} địa điểm.`,
      "Ngoài văn phòng ảo, chi nhánh còn cung cấp văn phòng trọn gói, phòng họp theo giờ, chỗ ngồi linh động cùng dịch vụ thành lập doanh nghiệp và kế toán thuế — vận hành theo cùng tiêu chuẩn chất lượng như tại trụ sở chính Sông Thao. Chi nhánh cũng đang áp dụng ưu đãi ký hợp đồng dài hạn, mức tặng khác nhau tuỳ bạn chuyển địa chỉ công ty đã có sẵn về đây hay thành lập công ty mới tại chi nhánh — xem chi tiết trong phần Câu hỏi thường gặp bên dưới.",
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
    promotions: [
      "Khách đã có GPKD: ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng + tặng dịch vụ đổi GPKD",
      "Thành lập công ty mới tại đây: ký 12 tháng tặng 2 tháng, ký 24 tháng tặng 4 tháng + tặng GPKD",
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
      { q: "Ký hợp đồng dài hạn tại Yên Thế có khuyến mãi gì không?", a: "Có, và mức ưu đãi khác nhau tuỳ tình trạng công ty của bạn. Nếu bạn ĐÃ CÓ công ty và chỉ cần chuyển địa chỉ đăng ký kinh doanh về chi nhánh này, ký hợp đồng 12 tháng được tặng 1 tháng sử dụng miễn phí, ký 24 tháng được tặng 2 tháng, và với hợp đồng từ 12 tháng trở lên còn được tặng thêm dịch vụ làm thủ tục đổi giấy phép kinh doanh (GPKD) sang địa chỉ mới. Nếu bạn THÀNH LẬP CÔNG TY MỚI tại đây, mức ưu đãi cao hơn: ký 12 tháng được tặng 2 tháng, ký 24 tháng được tặng 4 tháng — 4 tháng này cũng có thể quy đổi thành dịch vụ thành lập doanh nghiệp nếu bạn cần MAX OFFICE hỗ trợ luôn thủ tục thành lập." },
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
    image: "/images/khong-gian-lam-viec.jpg",
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
      "Với vị trí mặt tiền đường Cộng Hoà, chi nhánh phù hợp cho các doanh nghiệp hoạt động trong lĩnh vực thương mại, may mặc, phân phối hoặc dịch vụ — những ngành vốn có truyền thống lâu đời tại khu vực này. MAX OFFICE cung cấp tại đây các gói văn phòng ảo BASE, ORIGIN và ORIGIN+ (từ 500.000đ/tháng), cùng đầy đủ dịch vụ văn phòng trọn gói, phòng họp theo giờ, thành lập doanh nghiệp và kế toán thuế. Chi nhánh cũng đang áp dụng ưu đãi ký hợp đồng dài hạn, mức tặng khác nhau tuỳ bạn chuyển địa chỉ công ty đã có sẵn về đây hay thành lập công ty mới tại chi nhánh — xem chi tiết trong phần Câu hỏi thường gặp bên dưới.",
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
    promotions: [
      "Khách đã có GPKD: ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng + tặng dịch vụ đổi GPKD",
      "Thành lập công ty mới tại đây: ký 12 tháng tặng 2 tháng, ký 24 tháng tặng 4 tháng + tặng GPKD",
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
      { q: "Ký hợp đồng dài hạn tại Cộng Hoà có khuyến mãi gì không?", a: "Có, và mức ưu đãi khác nhau tuỳ tình trạng công ty của bạn. Nếu bạn ĐÃ CÓ công ty và chỉ cần chuyển địa chỉ đăng ký kinh doanh về chi nhánh này, ký hợp đồng 12 tháng được tặng 1 tháng sử dụng miễn phí, ký 24 tháng được tặng 2 tháng, và với hợp đồng từ 12 tháng trở lên còn được tặng thêm dịch vụ làm thủ tục đổi giấy phép kinh doanh (GPKD) sang địa chỉ mới. Nếu bạn THÀNH LẬP CÔNG TY MỚI tại đây, mức ưu đãi cao hơn: ký 12 tháng được tặng 2 tháng, ký 24 tháng được tặng 4 tháng — 4 tháng này cũng có thể quy đổi thành dịch vụ thành lập doanh nghiệp nếu bạn cần MAX OFFICE hỗ trợ luôn thủ tục thành lập." },
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
    image: "/images/coworking.jpg",
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
      "Đường Tân Thắng kết nối thuận tiện với trục Tân Sơn Nhì và các tuyến đường lớn của Tân Phú, giúp việc di chuyển sang khu vực Tân Bình hoặc trung tâm thành phố không quá xa. Chi nhánh cung cấp các gói văn phòng ảo BASE, ORIGIN, ORIGIN+ (từ 500.000đ/tháng), cùng văn phòng trọn gói, phòng họp theo giờ, không gian làm việc chung, thành lập doanh nghiệp và kế toán thuế. Chi nhánh cũng đang áp dụng ưu đãi ký hợp đồng dài hạn, mức tặng khác nhau tuỳ bạn chuyển địa chỉ công ty đã có sẵn về đây hay thành lập công ty mới tại chi nhánh — xem chi tiết trong phần Câu hỏi thường gặp bên dưới.",
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
    promotions: [
      "Khách đã có GPKD: ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng + tặng dịch vụ đổi GPKD",
      "Thành lập công ty mới tại đây: ký 12 tháng tặng 2 tháng, ký 24 tháng tặng 4 tháng + tặng GPKD",
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
      { q: "Ký hợp đồng dài hạn tại Tân Thắng có khuyến mãi gì không?", a: "Có, và mức ưu đãi khác nhau tuỳ tình trạng công ty của bạn. Nếu bạn ĐÃ CÓ công ty và chỉ cần chuyển địa chỉ đăng ký kinh doanh về chi nhánh này, ký hợp đồng 12 tháng được tặng 1 tháng sử dụng miễn phí, ký 24 tháng được tặng 2 tháng, và với hợp đồng từ 12 tháng trở lên còn được tặng thêm dịch vụ làm thủ tục đổi giấy phép kinh doanh (GPKD) sang địa chỉ mới. Nếu bạn THÀNH LẬP CÔNG TY MỚI tại đây, mức ưu đãi cao hơn: ký 12 tháng được tặng 2 tháng, ký 24 tháng được tặng 4 tháng — 4 tháng này cũng có thể quy đổi thành dịch vụ thành lập doanh nghiệp nếu bạn cần MAX OFFICE hỗ trợ luôn thủ tục thành lập." },
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
    image: "/images/anh-hero-trang-chu.jpg",
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
      "Chi nhánh Cửu Long hiện tập trung vào gói văn phòng ảo BASE (500.000đ/tháng) — gói tiêu chuẩn bao gồm đầy đủ địa chỉ đăng ký kinh doanh, lễ tân, wifi, không gian tiếp khách (Guest Lounge), tư vấn pháp lý & thuế. Khách hàng có nhu cầu sử dụng các gói cao hơn (ORIGIN, ORIGIN+, RISE) có thể được tư vấn chuyển sang các chi nhánh lân cận như Yên Thế hoặc Sông Thao trong cùng khu vực Tân Bình. Chi nhánh cũng đang áp dụng ưu đãi ký hợp đồng dài hạn, mức tặng khác nhau tuỳ bạn chuyển địa chỉ công ty đã có sẵn về đây hay thành lập công ty mới tại chi nhánh — xem chi tiết trong phần Câu hỏi thường gặp bên dưới.",
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
    promotions: [
      "Khách đã có GPKD: ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng + tặng dịch vụ đổi GPKD",
      "Thành lập công ty mới tại đây: ký 12 tháng tặng 2 tháng, ký 24 tháng tặng 4 tháng + tặng GPKD",
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
      { q: "Ký hợp đồng dài hạn tại Cửu Long có khuyến mãi gì không?", a: "Có, và mức ưu đãi khác nhau tuỳ tình trạng công ty của bạn. Nếu bạn ĐÃ CÓ công ty và chỉ cần chuyển địa chỉ đăng ký kinh doanh về chi nhánh này, ký hợp đồng 12 tháng được tặng 1 tháng sử dụng miễn phí, ký 24 tháng được tặng 2 tháng, và với hợp đồng từ 12 tháng trở lên còn được tặng thêm dịch vụ làm thủ tục đổi giấy phép kinh doanh (GPKD) sang địa chỉ mới. Nếu bạn THÀNH LẬP CÔNG TY MỚI tại đây, mức ưu đãi cao hơn: ký 12 tháng được tặng 2 tháng, ký 24 tháng được tặng 4 tháng — 4 tháng này cũng có thể quy đổi thành dịch vụ thành lập doanh nghiệp nếu bạn cần MAX OFFICE hỗ trợ luôn thủ tục thành lập." },
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
    image: "/images/hero-bang-gia-2.png",
    // Cropped to 1122x1394 — bottom extended to the road (see /images/originals for the source).
    facadeAspectRatio: "1122 / 1394",
    facadeImageSide: "left",
    interiorImages: [
      { src: "/images/dia-diem-hoang-viet-le-tan.jpg", alt: "Khu vực lễ tân văn phòng Hoàng Việt", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-hoang-viet-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng Hoàng Việt", caption: "Bảng tên công ty tại toà nhà" },
    ],
    intro: [
      `Văn phòng Hoàng Việt toạ lạc tại 1/12 Hoàng Việt, Phường Tân Sơn Nhất, Quận Tân Bình — con đường chạy dọc theo ranh giới sân bay Tân Sơn Nhất, một trong những vị trí gần cổng sân bay nhất trong toàn hệ thống ${ACTIVE_BRANCH_COUNT} chi nhánh của MAX OFFICE. Đây là lựa chọn lý tưởng cho doanh nghiệp mới thành lập cần địa chỉ đăng ký kinh doanh với chi phí hợp lý nhưng vẫn ở vị trí thuận tiện.`,
      "Khu vực Phường Tân Sơn Nhất không chỉ gần sân bay mà còn cách Công viên Gia Định — một trong những công viên lớn của thành phố — chỉ vài phút di chuyển, mang lại không gian thoáng đãng hiếm có so với nhiều khu vực nội thành khác. Đường Hoàng Việt và các tuyến lân cận như Phan Thúc Duyện, Hồng Hà tạo thành mạng lưới giao thông thuận tiện, kết nối nhanh sang Phú Nhuận và trung tâm thành phố.",
      "Chi nhánh Hoàng Việt cung cấp các gói văn phòng ảo giá tốt nhất trong hệ thống: LITE (299.000đ/tháng), START (350.000đ/tháng) và BASE (500.000đ/tháng) — phù hợp cho startup, hộ kinh doanh cá thể hoặc doanh nghiệp mới cần tối ưu chi phí vận hành trong giai đoạn đầu. Chi nhánh cũng đang áp dụng ưu đãi ký hợp đồng dài hạn — mức tặng khác nhau tuỳ bạn chuyển địa chỉ công ty đã có sẵn hay thành lập công ty mới, và tuỳ gói LITE/START/BASE bạn chọn (xem chi tiết trong phần Câu hỏi thường gặp bên dưới).",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Hoàng Việt",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ, gần sân bay", desc: "Đủ điều kiện đăng ký kinh doanh, sát cổng sân bay Tân Sơn Nhất." },
      { icon: BadgePercentIcon, title: "Giá khởi điểm chỉ 299.000đ/tháng", desc: "Gói LITE, START, BASE — phù hợp doanh nghiệp mới, tối ưu chi phí." },
      { icon: MapPinIcon, title: "Gần Công viên Gia Định", desc: "Không gian xanh thoáng đãng, chỉ vài phút di chuyển." },
      { icon: UsersIcon, title: "Phù hợp startup, hộ kinh doanh", desc: "Chi phí hợp lý cho doanh nghiệp giai đoạn đầu." },
      { icon: ClockIcon, title: "Giao thông thuận tiện", desc: "Kết nối nhanh sang Phú Nhuận và trung tâm thành phố." },
      { icon: HeadsetIcon, title: "Lễ tân trực tiếp tại quầy", desc: "Đội ngũ lễ tân MAX OFFICE tiếp nhận thư từ, bưu phẩm và đón tiếp khách ngay tại quầy khi đối tác ghé chi nhánh." },
      { icon: HeartHandshakeIcon, title: "Khu vực tiếp khách riêng", desc: "Không gian tiếp khách riêng biệt với sofa, bàn tiếp khách — phù hợp trao đổi công việc với đối tác ngay tại văn phòng." },
    ],
    promotions: [
      "Khách đã có GPKD: ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng; riêng gói BASE, hợp đồng từ 12 tháng tặng thêm dịch vụ đổi GPKD",
      "Thành lập công ty mới — gói LITE: ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng",
      "Thành lập công ty mới — gói START/BASE: ký 12 tháng tặng 2 tháng, ký 24 tháng tặng 4 tháng + tặng GPKD",
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
      { q: "Ký hợp đồng dài hạn tại Hoàng Việt có khuyến mãi gì không?", a: "Có, và mức ưu đãi phụ thuộc cả tình trạng công ty lẫn gói bạn chọn. Nếu bạn ĐÃ CÓ công ty và chuyển địa chỉ đăng ký kinh doanh về chi nhánh này, ký hợp đồng 12 tháng được tặng 1 tháng sử dụng miễn phí, ký 24 tháng được tặng 2 tháng; riêng gói BASE, hợp đồng từ 12 tháng trở lên còn được tặng thêm dịch vụ làm thủ tục đổi giấy phép kinh doanh (GPKD). Nếu bạn THÀNH LẬP CÔNG TY MỚI tại đây, mức ưu đãi cao hơn và khác nhau theo gói: gói LITE ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng; gói START hoặc BASE ký 12 tháng tặng 2 tháng, ký 24 tháng tặng 4 tháng — 4 tháng này cũng có thể quy đổi thành dịch vụ thành lập doanh nghiệp nếu bạn cần." },
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
    image: "/images/hero-ve-chung-toi-2.png",
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
      "Chi nhánh Bàu Cát 2 cung cấp các gói văn phòng ảo LITE (299.000đ/tháng), START (350.000đ/tháng) và BASE (500.000đ/tháng) cùng không gian làm việc chung (coworking) thoáng đãng — phù hợp cho các cá nhân kinh doanh online, xưởng may nhỏ hoặc startup thời trang cần địa chỉ đăng ký kinh doanh hợp lệ với chi phí tối ưu. Chi nhánh cũng đang áp dụng ưu đãi ký hợp đồng dài hạn — mức tặng khác nhau tuỳ bạn chuyển địa chỉ công ty đã có sẵn hay thành lập công ty mới, và tuỳ gói LITE/START/BASE bạn chọn (xem chi tiết trong phần Câu hỏi thường gặp bên dưới).",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Bàu Cát 2",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ khu Bàu Cát", desc: "Đủ điều kiện đăng ký kinh doanh, gần khu thời trang, may mặc nổi tiếng." },
      { icon: BadgePercentIcon, title: "Giá khởi điểm chỉ 299.000đ/tháng", desc: "Gói LITE, START, BASE — tối ưu chi phí cho doanh nghiệp nhỏ." },
      { icon: BuildingIcon, title: "Không gian làm việc chung", desc: "Khu coworking thoáng đãng, phù hợp làm việc tập trung." },
      { icon: UsersIcon, title: "Phù hợp ngành thời trang, may mặc", desc: "Gần nguồn hàng, xưởng may, showroom thời trang trong khu vực." },
      { icon: MapPinIcon, title: "Gần chợ Bàu Cát", desc: "Thuận tiện sinh hoạt, giao thương hàng ngày." },
      { icon: HeadsetIcon, title: "Lễ tân tiếp nhận thư từ, bưu phẩm", desc: "Quầy lễ tân MAX OFFICE hoạt động thường xuyên, hỗ trợ nhận thư, bưu phẩm và tiếp đón khách đến giao dịch trực tiếp." },
      { icon: HeartHandshakeIcon, title: "Khu vực tiếp khách riêng", desc: "Khu vực tiếp khách riêng biệt, có sofa và bàn tiếp khách — thuận tiện gặp gỡ khách hàng, đối tác ghé xem mẫu." },
    ],
    promotions: [
      "Khách đã có GPKD: ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng; riêng gói BASE, hợp đồng từ 12 tháng tặng thêm dịch vụ đổi GPKD",
      "Thành lập công ty mới — gói LITE: ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng",
      "Thành lập công ty mới — gói START/BASE: ký 12 tháng tặng 2 tháng, ký 24 tháng tặng 4 tháng + tặng GPKD",
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
      { q: "Ký hợp đồng dài hạn tại Bàu Cát 2 có khuyến mãi gì không?", a: "Có, và mức ưu đãi phụ thuộc cả tình trạng công ty lẫn gói bạn chọn. Nếu bạn ĐÃ CÓ công ty và chuyển địa chỉ đăng ký kinh doanh về chi nhánh này, ký hợp đồng 12 tháng được tặng 1 tháng sử dụng miễn phí, ký 24 tháng được tặng 2 tháng; riêng gói BASE, hợp đồng từ 12 tháng trở lên còn được tặng thêm dịch vụ làm thủ tục đổi giấy phép kinh doanh (GPKD). Nếu bạn THÀNH LẬP CÔNG TY MỚI tại đây, mức ưu đãi cao hơn và khác nhau theo gói: gói LITE ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng; gói START hoặc BASE ký 12 tháng tặng 2 tháng, ký 24 tháng tặng 4 tháng — 4 tháng này cũng có thể quy đổi thành dịch vụ thành lập doanh nghiệp nếu bạn cần." },
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
    image: "/images/hero-dich-vu.png",
    facadeAspectRatio: "1390 / 1132",
    facadeImageSide: "left",
    interiorImages: [
      { src: "/images/dia-diem-lam-son-le-tan.jpg", alt: "Khu vực lễ tân văn phòng Lam Sơn", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-lam-son-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng Lam Sơn", caption: "Bảng tên công ty tại toà nhà" },
    ],
    intro: [
      "Văn phòng Lam Sơn toạ lạc tại 2-2B Lam Sơn, Phường Tân Sơn Hòa, Quận Tân Bình — khu vực nằm gần trục đường Lê Văn Sỹ, một trong những tuyến phố ẩm thực và mua sắm sầm uất nối liền Tân Bình với Quận 3. Đây là lựa chọn thuận tiện cho doanh nghiệp cần địa chỉ vừa gần trung tâm vừa giữ được chi phí hợp lý.",
      "Khác với các chi nhánh khác trong cùng Phường Tân Sơn Hòa, Lam Sơn có lợi thế lớn về khả năng kết nối trực tiếp vào trục Lê Văn Sỹ — Cách Mạng Tháng 8, giúp việc di chuyển đến trung tâm Quận 3, Quận 1 nhanh hơn nhiều so với việc phải vòng qua các trục lớn khác của Tân Bình. Khu vực xung quanh có nhiều quán ăn, cà phê phục vụ dân văn phòng, phù hợp cho các buổi gặp gỡ đối tác không quá trang trọng.",
      "Chi nhánh Lam Sơn cung cấp các gói văn phòng ảo LITE (299.000đ/tháng), START (350.000đ/tháng) và BASE (500.000đ/tháng) — phù hợp cho doanh nghiệp nhỏ, hộ kinh doanh hoặc văn phòng đại diện cần vị trí gần trung tâm với ngân sách tối ưu. Chi nhánh cũng đang áp dụng ưu đãi ký hợp đồng dài hạn — mức tặng khác nhau tuỳ bạn chuyển địa chỉ công ty đã có sẵn hay thành lập công ty mới, và tuỳ gói LITE/START/BASE bạn chọn (xem chi tiết trong phần Câu hỏi thường gặp bên dưới).",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Lam Sơn",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ gần trung tâm", desc: "Đủ điều kiện đăng ký kinh doanh, gần trục Lê Văn Sỹ nối Quận 3." },
      { icon: BadgePercentIcon, title: "Giá khởi điểm chỉ 299.000đ/tháng", desc: "Gói LITE, START, BASE — tối ưu chi phí, gần trung tâm." },
      { icon: MapPinIcon, title: "Gần trục Lê Văn Sỹ", desc: "Kết nối nhanh đến Quận 3, Quận 1 qua tuyến phố ẩm thực sầm uất." },
      { icon: ClockIcon, title: "Di chuyển thuận tiện", desc: "Không phải vòng qua các trục lớn khác của Tân Bình." },
      { icon: UsersIcon, title: "Phù hợp văn phòng đại diện", desc: "Vị trí cân bằng giữa chi phí và khả năng tiếp cận trung tâm." },
      { icon: HeadsetIcon, title: "Hỗ trợ tiếp nhận thư từ", desc: "Nhân viên toà nhà tiếp nhận thư từ, bưu phẩm hàng ngày; đội ngũ MAX OFFICE hỗ trợ vận hành và tư vấn từ xa qua điện thoại, Zalo." },
    ],
    promotions: [
      "Khách đã có GPKD: ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng; riêng gói BASE, hợp đồng từ 12 tháng tặng thêm dịch vụ đổi GPKD",
      "Thành lập công ty mới — gói LITE: ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng",
      "Thành lập công ty mới — gói START/BASE: ký 12 tháng tặng 2 tháng, ký 24 tháng tặng 4 tháng + tặng GPKD",
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
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Đội ngũ MAX OFFICE hướng dẫn đường qua điện thoại trước khi bạn đến; nhân viên toà nhà hỗ trợ tại chỗ." },
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
      { q: "Ký hợp đồng dài hạn tại Lam Sơn có khuyến mãi gì không?", a: "Có, và mức ưu đãi phụ thuộc cả tình trạng công ty lẫn gói bạn chọn. Nếu bạn ĐÃ CÓ công ty và chuyển địa chỉ đăng ký kinh doanh về chi nhánh này, ký hợp đồng 12 tháng được tặng 1 tháng sử dụng miễn phí, ký 24 tháng được tặng 2 tháng; riêng gói BASE, hợp đồng từ 12 tháng trở lên còn được tặng thêm dịch vụ làm thủ tục đổi giấy phép kinh doanh (GPKD). Nếu bạn THÀNH LẬP CÔNG TY MỚI tại đây, mức ưu đãi cao hơn và khác nhau theo gói: gói LITE ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng; gói START hoặc BASE ký 12 tháng tặng 2 tháng, ký 24 tháng tặng 4 tháng — 4 tháng này cũng có thể quy đổi thành dịch vụ thành lập doanh nghiệp nếu bạn cần." },
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
    image: "/images/hero-lien-he-2.png",
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
      "Chi nhánh Hoàng Kế Viêm cung cấp các gói văn phòng ảo LITE (299.000đ/tháng), START (350.000đ/tháng) và BASE (500.000đ/tháng) — phù hợp cho doanh nghiệp nhỏ, hộ kinh doanh cần địa chỉ hợp lệ với chi phí tiết kiệm nhất trong hệ thống MAX OFFICE. Chi nhánh cũng đang áp dụng ưu đãi ký hợp đồng dài hạn — mức tặng khác nhau tuỳ bạn chuyển địa chỉ công ty đã có sẵn hay thành lập công ty mới, và tuỳ gói LITE/START/BASE bạn chọn (xem chi tiết trong phần Câu hỏi thường gặp bên dưới).",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng Hoàng Kế Viêm",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ khu Bảy Hiền", desc: "Đủ điều kiện đăng ký kinh doanh, gần trục Trường Chinh." },
      { icon: BadgePercentIcon, title: "Giá khởi điểm chỉ 299.000đ/tháng", desc: "Gói LITE, START, BASE — tiết kiệm chi phí cho doanh nghiệp nhỏ." },
      { icon: MapPinIcon, title: "Gần trục Trường Chinh", desc: "Kết nối nhanh về hướng Quận 12, Hóc Môn và sân bay." },
      { icon: UsersIcon, title: "Khu dân cư ổn định", desc: "Môi trường yên tĩnh, xen kẽ trường học, phù hợp làm việc lâu dài." },
      { icon: ClockIcon, title: "Giao thông thuận tiện", desc: "Dễ dàng di chuyển ra các trục lớn khi cần." },
      { icon: HeadsetIcon, title: "Hỗ trợ tiếp nhận thư từ", desc: "Nhân viên toà nhà tiếp nhận thư từ, bưu phẩm hàng ngày; đội ngũ MAX OFFICE hỗ trợ tư vấn, xử lý thủ tục qua điện thoại." },
      { icon: HeartHandshakeIcon, title: "Khu vực tiếp khách riêng", desc: "Có khu vực tiếp khách riêng với sofa, bàn tiếp khách — phù hợp cho các buổi trao đổi ngắn với đối tác, khách hàng." },
    ],
    promotions: [
      "Khách đã có GPKD: ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng; riêng gói BASE, hợp đồng từ 12 tháng tặng thêm dịch vụ đổi GPKD",
      "Thành lập công ty mới — gói LITE: ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng",
      "Thành lập công ty mới — gói START/BASE: ký 12 tháng tặng 2 tháng, ký 24 tháng tặng 4 tháng + tặng GPKD",
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
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Đội ngũ MAX OFFICE hỗ trợ chỉ đường qua điện thoại hoặc Zalo trước khi bạn ghé chi nhánh lần đầu." },
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
      { q: "Ký hợp đồng dài hạn tại Hoàng Kế Viêm có khuyến mãi gì không?", a: "Có, và mức ưu đãi phụ thuộc cả tình trạng công ty lẫn gói bạn chọn. Nếu bạn ĐÃ CÓ công ty và chuyển địa chỉ đăng ký kinh doanh về chi nhánh này, ký hợp đồng 12 tháng được tặng 1 tháng sử dụng miễn phí, ký 24 tháng được tặng 2 tháng; riêng gói BASE, hợp đồng từ 12 tháng trở lên còn được tặng thêm dịch vụ làm thủ tục đổi giấy phép kinh doanh (GPKD). Nếu bạn THÀNH LẬP CÔNG TY MỚI tại đây, mức ưu đãi cao hơn và khác nhau theo gói: gói LITE ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng; gói START hoặc BASE ký 12 tháng tặng 2 tháng, ký 24 tháng tặng 4 tháng — 4 tháng này cũng có thể quy đổi thành dịch vụ thành lập doanh nghiệp nếu bạn cần." },
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
    image: "/images/anh-hero-trang-chu-1.jpg",
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
      "Chi nhánh CMT8 cung cấp các gói văn phòng ảo LITE (299.000đ/tháng), START (350.000đ/tháng) và BASE (500.000đ/tháng) — là lựa chọn kinh tế cho doanh nghiệp cần địa chỉ Quận 10 gần trung tâm mà không phải trả mức phí cao như khu vực Quận 1. Chi nhánh cũng đang áp dụng ưu đãi ký hợp đồng dài hạn — mức tặng khác nhau tuỳ bạn chuyển địa chỉ công ty đã có sẵn hay thành lập công ty mới, và tuỳ gói LITE/START/BASE bạn chọn (xem chi tiết trong phần Câu hỏi thường gặp bên dưới).",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng CMT8",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ mặt tiền CMT8", desc: "Đủ điều kiện đăng ký kinh doanh, mặt tiền trục đường lớn." },
      { icon: MapPinIcon, title: "Gần Ga Sài Gòn", desc: "Thuận tiện di chuyển bằng đường sắt, gần trung tâm thành phố." },
      { icon: BadgePercentIcon, title: "Giá khởi điểm chỉ 299.000đ/tháng", desc: "Gói LITE, START, BASE — kinh tế hơn so với khu vực Quận 1." },
      { icon: UsersIcon, title: "Gần bệnh viện, trường đại học", desc: "Khu vực sôi động, phù hợp nhiều loại hình doanh nghiệp." },
      { icon: ClockIcon, title: "Giao thông thuận tiện", desc: "Kết nối nhanh đến Quận 1, Quận 3, Tân Bình qua trục CMT8." },
      { icon: HeadsetIcon, title: "Hỗ trợ tiếp nhận thư từ", desc: "Nhân viên toà nhà tiếp nhận thư từ, bưu phẩm tại quầy chung; đội ngũ MAX OFFICE hỗ trợ tư vấn, xử lý hồ sơ qua điện thoại hoặc Zalo." },
    ],
    promotions: [
      "Khách đã có GPKD: ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng; riêng gói BASE, hợp đồng từ 12 tháng tặng thêm dịch vụ đổi GPKD",
      "Thành lập công ty mới — gói LITE: ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng",
      "Thành lập công ty mới — gói START/BASE: ký 12 tháng tặng 2 tháng, ký 24 tháng tặng 4 tháng + tặng GPKD",
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
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Đội ngũ MAX OFFICE hỗ trợ chỉ dẫn qua điện thoại nếu bạn chưa quen đường đến chi nhánh." },
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
      { q: "Văn phòng CMT8 có phải chi nhánh duy nhất của MAX OFFICE tại khu vực Quận 10 (cũ) không?", a: "Đúng vậy. Đây là chi nhánh duy nhất của MAX OFFICE hiện đang hoạt động tại khu vực Quận 10 (cũ)." },
      { q: "Chi nhánh CMT8 có những gói văn phòng ảo nào?", a: "Chi nhánh cung cấp 3 mức giá: LITE (299.000đ/tháng), START (350.000đ/tháng) và BASE (500.000đ/tháng) — đều đã bao gồm địa chỉ đăng ký kinh doanh hợp lệ." },
      { q: "Địa chỉ 283/26-28 Cách Mạng Tháng 8 có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Hoà Hưng, Quận 10, phù hợp đăng ký kinh doanh và đăng ký thuế." },
      { q: "Văn phòng CMT8 có gần Ga Sài Gòn không?", a: "Có. Chi nhánh nằm khá gần Ga Sài Gòn, thuận tiện nếu bạn hoặc đối tác di chuyển bằng đường sắt." },
      { q: "Từ văn phòng CMT8 đến trung tâm Quận 1 mất bao lâu?", a: "Khoảng 10-15 phút di chuyển qua trục Cách Mạng Tháng 8, tuỳ thời điểm giao thông." },
      { q: "Chi phí thuê văn phòng ảo tại CMT8 có rẻ hơn khu vực Quận 1 không?", a: "Có. Mức giá tại CMT8 áp dụng theo bảng giá chung của MAX OFFICE, không có phụ phí trung tâm như khu vực Quận 1, phù hợp cho doanh nghiệp muốn tối ưu chi phí mà vẫn gần trung tâm." },
      { q: "Ký hợp đồng dài hạn tại CMT8 có khuyến mãi gì không?", a: "Có, và mức ưu đãi phụ thuộc cả tình trạng công ty lẫn gói bạn chọn. Nếu bạn ĐÃ CÓ công ty và chuyển địa chỉ đăng ký kinh doanh về chi nhánh này, ký hợp đồng 12 tháng được tặng 1 tháng sử dụng miễn phí, ký 24 tháng được tặng 2 tháng; riêng gói BASE, hợp đồng từ 12 tháng trở lên còn được tặng thêm dịch vụ làm thủ tục đổi giấy phép kinh doanh (GPKD). Nếu bạn THÀNH LẬP CÔNG TY MỚI tại đây, mức ưu đãi cao hơn và khác nhau theo gói: gói LITE ký 12 tháng tặng 1 tháng, ký 24 tháng tặng 2 tháng; gói START hoặc BASE ký 12 tháng tặng 2 tháng, ký 24 tháng tặng 4 tháng — 4 tháng này cũng có thể quy đổi thành dịch vụ thành lập doanh nghiệp nếu bạn cần." },
    ],
    testimonials: [
      { quote: "Văn phòng ngay mặt tiền CMT8 nên khách hàng dễ tìm, công ty mình trông chuyên nghiệp hơn hẳn.", initial: "B", name: "Anh Bình", role: "Giám đốc công ty dịch vụ" },
      { quote: "Gần Ga Sài Gòn nên đối tác ở tỉnh ra công tác ghé văn phòng mình rất tiện.", initial: "X", name: "Thanh Xuân", role: "Trưởng phòng kinh doanh" },
    ],
  },

  /* ============== 614-616-618 BA THÁNG HAI (KHU VỰC QUẬN 10 MỚI) ============== */
  "ba-thang-hai": {
    slug: "ba-thang-hai",
    name: "618 Ba Tháng Hai, Quận 10 (cũ)",
    area: AREA_QUAN_10,
    address: "614-616-618 Đường Ba Tháng Hai, Phường Diên Hồng, Thành phố Hồ Chí Minh",
    heroTitle: "Văn Phòng Cho Thuê 618 Ba Tháng Hai, Quận 10 (cũ)",
    heroDescription:
      "Chi nhánh mới của MAX OFFICE tại khu vực Quận 10 (cũ) — văn phòng ảo 3 gói riêng biệt từ 379.000đ/tháng, ngay gần vòng xoay Ngã Bảy và Đại học Bách Khoa TP.HCM.",
    metaTitle: "Văn Phòng Ảo 618 Ba Tháng Hai, Quận 10 (cũ) | Từ 379K/Tháng",
    metaDescription:
      "Thuê văn phòng ảo tại 614-616-618 Ba Tháng Hai, Phường Diên Hồng — chi nhánh mới MAX OFFICE tại Quận 10 (cũ), 3 gói SILVER/GOLD/PREMIUM từ 379.000đ/tháng (chưa VAT), gần Đại học Bách Khoa TP.HCM.",
    image: "/images/hero-chi-nhanh.png",
    // Ảnh mặt tiền gốc 1023x1537, không chỉnh sửa.
    facadeAspectRatio: "1023 / 1537",
    facadeImageSide: "left",
    interiorImages: [
      { src: "/images/dia-diem-ba-thang-hai-sanh.jpg", alt: "Sảnh chính văn phòng 614-616-618 Ba Tháng Hai", caption: "Sảnh chính toà nhà" },
      {
        src: "/images/dia-diem-ba-thang-hai-bang-ten.jpg",
        alt: "Bảng tên công ty tại toà nhà văn phòng 614-616-618 Ba Tháng Hai",
        caption: "Bảng tên công ty tại toà nhà",
        // Ảnh gốc 1376x768 (~16:9), rộng hơn khung ô 4:3 — bảng tên chính
        // nằm lệch trái, crop "left" để không cắt mất bảng tên chính.
        objectPosition: "left",
      },
      { src: "/images/dia-diem-ba-thang-hai-wc.jpg", alt: "Tiện ích toà nhà văn phòng 614-616-618 Ba Tháng Hai", caption: "Tiện ích toà nhà" },
    ],
    intro: [
      "Văn phòng 614-616-618 Ba Tháng Hai là chi nhánh mới nhất của MAX OFFICE, toạ lạc tại Phường Diên Hồng — trên trục đường Ba Tháng Hai, một trong những tuyến đường huyết mạch dài và sầm uất bậc nhất TP.HCM, nối từ khu vực Quận 5 qua Quận 10, Quận 11. Đây là chi nhánh thứ hai MAX OFFICE mở tại khu vực Quận 10 (cũ), bên cạnh chi nhánh CMT8 hiện có, mang đến thêm một lựa chọn địa chỉ đăng ký kinh doanh cho doanh nghiệp tại khu vực này.",
      "Toà nhà nơi đặt chi nhánh là một cao ốc văn phòng nhiều tầng với mặt tiền kính xanh hiện đại, nổi bật trên trục đường Ba Tháng Hai. Sảnh chính được lát nền đá granite hoa văn trang trí công phu, dẫn lên khu vực lễ tân qua bậc thang đá rộng — tạo ấn tượng chuyên nghiệp ngay từ lối vào. Bảng tên công ty được bố trí ngay tại sảnh, giúp khách hàng và đối tác dễ dàng xác định đúng văn phòng khi đến làm việc.",
      "Khu vực Phường Diên Hồng nằm gần vòng xoay Ngã Bảy — giao lộ giữa Ba Tháng Hai, Lý Thái Tổ và Nguyễn Tri Phương, một trong những nút giao thông quen thuộc bậc nhất Quận 10 (cũ). Xung quanh còn có Đại học Bách Khoa TP.HCM (cơ sở Lý Thường Kiệt), Bệnh viện Nhi Đồng 1 và chợ Nhật Tảo — khu chợ chuyên đồ điện tử nổi tiếng, tạo nên mật độ dân cư và hoạt động kinh doanh sôi động suốt cả ngày.",
      "Chi nhánh 614-616-618 Ba Tháng Hai cung cấp 3 gói văn phòng ảo riêng biệt — SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng), giá chưa bao gồm VAT 10% — cùng bảng giá đang áp dụng tại các chi nhánh khu vực Bình Thạnh, Phú Nhuận, Quận 4 và Thủ Đức (cũ). Chi nhánh cũng đang áp dụng ưu đãi ký hợp đồng dài hạn: tặng 2 tháng miễn phí khi ký 12 tháng, tặng 6 tháng miễn phí khi ký 24 tháng — áp dụng cho mọi gói văn phòng ảo tại đây.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng 618 Ba Tháng Hai",
    benefits: [
      { icon: BuildingIcon, title: "Chi nhánh thứ 2 tại Quận 10 (cũ)", desc: "Mở rộng hệ thống MAX OFFICE tại khu vực Quận 10 (cũ), bên cạnh chi nhánh CMT8." },
      { icon: MapPinIcon, title: "Gần vòng xoay Ngã Bảy", desc: "Giao lộ Ba Tháng Hai — Lý Thái Tổ — Nguyễn Tri Phương, kết nối nhanh nhiều hướng." },
      { icon: BadgePercentIcon, title: "3 gói giá linh hoạt", desc: "SILVER, GOLD, PREMIUM — từ 379.000đ/tháng." },
      { icon: UsersIcon, title: "Gần Đại học Bách Khoa TP.HCM", desc: "Thuận tiện tuyển dụng, hợp tác với sinh viên, giảng viên khu vực." },
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ", desc: "Đủ điều kiện đăng ký kinh doanh, đăng ký thuế cho mọi loại hình doanh nghiệp." },
      { icon: ClockIcon, title: "Giao thông thuận tiện", desc: "Kết nối nhanh đến Quận 5, Quận 11 và trung tâm thành phố." },
    ],
    promotions: [
      "Ký hợp đồng 12 tháng: tặng 2 tháng miễn phí",
      "Ký hợp đồng 24 tháng: tặng 6 tháng miễn phí",
    ],
    nearbyItems: [
      { name: "Vòng xoay Ngã Bảy", desc: "Giao lộ Ba Tháng Hai — Lý Thái Tổ — Nguyễn Tri Phương, nút giao quen thuộc của Quận 10 (cũ)." },
      { name: "Đại học Bách Khoa TP.HCM", desc: "Cơ sở Lý Thường Kiệt, tạo nguồn nhân lực trẻ dồi dào cho khu vực." },
      { name: "Bệnh viện Nhi Đồng 1", desc: "Bệnh viện lớn gần khu vực, góp phần vào mật độ hoạt động sôi động." },
      { name: "Chợ Nhật Tảo", desc: "Khu chợ chuyên đồ điện tử nổi tiếng, sầm uất bậc nhất thành phố." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt hoạt động qua trục đường Ba Tháng Hai." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Mật độ xe cao tại khu vực mặt tiền đường lớn, dễ dàng đặt xe." },
      { icon: CheckCircleIcon, title: "Trục Ba Tháng Hai — Lý Thái Tổ", desc: "Kết nối nhanh đến Quận 5, Quận 11 và trung tâm thành phố." },
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Đội ngũ MAX OFFICE hỗ trợ chỉ dẫn qua điện thoại nếu bạn chưa quen khu vực Ngã Bảy." },
    ],
    parkingInfo: [
      "Khu vực giữ xe máy ngay tại toà nhà mặt tiền Ba Tháng Hai.",
      "Hỗ trợ thông tin bãi đỗ ô tô gần khu vực vòng xoay Ngã Bảy.",
      "Có nhân viên bảo vệ trực để đảm bảo an toàn cho xe trong giờ làm việc.",
    ],
    diningItems: [
      { name: "Quán ăn khu chợ Nhật Tảo", desc: "Đa dạng lựa chọn ẩm thực phục vụ khu vực chợ sầm uất." },
      { name: "Cà phê dọc Ba Tháng Hai", desc: "Nhiều quán cà phê phù hợp gặp gỡ đối tác hoặc làm việc ngoài giờ." },
      { name: "Nhà hàng khu vực Diên Hồng", desc: "Đa dạng phong cách phục vụ, phù hợp cả bữa ăn nhanh lẫn buổi tiếp khách." },
    ],
    faqs: [
      { q: "Chi nhánh 614-616-618 Ba Tháng Hai có phải là chi nhánh mới nhất của MAX OFFICE tại Quận 10 (cũ) không?", a: "Đúng vậy. Đây là chi nhánh thứ hai MAX OFFICE mở tại khu vực Quận 10 (cũ), bên cạnh chi nhánh CMT8 hiện có, toạ lạc tại Phường Diên Hồng." },
      { q: "Chi nhánh 618 Ba Tháng Hai áp dụng bảng giá văn phòng ảo nào?", a: "Chi nhánh áp dụng 3 gói: SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng) — giá chưa bao gồm VAT 10%, cùng bảng giá đang áp dụng tại các chi nhánh khu vực Bình Thạnh, Phú Nhuận, Quận 4 và Thủ Đức (cũ)." },
      { q: "Địa chỉ 614-616-618 Ba Tháng Hai có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Diên Hồng, đủ điều kiện đăng ký kinh doanh và đăng ký thuế cho công ty TNHH, công ty cổ phần lẫn hộ kinh doanh cá thể." },
      { q: "Chi nhánh có gần Đại học Bách Khoa hoặc Bệnh viện Nhi Đồng 1 không?", a: "Có. Chi nhánh nằm gần vòng xoay Ngã Bảy, không xa Đại học Bách Khoa TP.HCM (cơ sở Lý Thường Kiệt) và Bệnh viện Nhi Đồng 1." },
      { q: "Sau khi ký hợp đồng, đổi địa chỉ giấy phép kinh doanh hoặc khắc dấu công ty tính phí ra sao?", a: "Đây là 2 khoản phát sinh tính riêng ngoài phí gói văn phòng ảo hàng tháng: đổi địa chỉ trên giấy phép kinh doanh giá 1.296.000đ (đã bao gồm VAT), và khắc con dấu tròn công ty, dấu chi nhánh hoặc dấu văn phòng đại diện giá 480.000đ mỗi con dấu." },
      { q: "Ký hợp đồng dài hạn tại 618 Ba Tháng Hai có được khuyến mãi gì không?", a: "Có. Ký hợp đồng 12 tháng được tặng 2 tháng sử dụng miễn phí; ký hợp đồng 24 tháng được tặng 6 tháng sử dụng miễn phí — áp dụng cho mọi gói văn phòng ảo tại chi nhánh này." },
    ],
    testimonials: [
      { quote: "Toà nhà mặt tiền Ba Tháng Hai khá nổi bật, khách hàng dễ nhận ra ngay từ xa.", initial: "T", name: "Anh Trung", role: "Giám đốc công ty thương mại" },
      { quote: "Gần Đại học Bách Khoa nên công ty mình tuyển sinh viên thực tập khá thuận tiện.", initial: "L", name: "Chị Linh", role: "Trưởng phòng nhân sự" },
      { quote: "Sảnh toà nhà đẹp, rộng rãi, lần đầu đối tác ghé thăm cũng khen không gian chuyên nghiệp.", initial: "D", name: "Anh Duy", role: "Founder công ty công nghệ" },
    ],
  },

  /* ===================== 314/6 ĐIỆN BIÊN PHỦ (VƯỜN LÀI) — GÓI GIÁ RIÊNG ===================== */
  "vuon-lai": {
    slug: "vuon-lai",
    name: "314/6 Điện Biên Phủ, Quận 10 (cũ)",
    area: AREA_QUAN_10,
    // TẠM ẨN — không xoá dữ liệu, chỉ ẩn khỏi hiển thị công khai (trang
    // /locations/vuon-lai trả về 404, loại khỏi sitemap). Đặt lại
    // `isActive: true` (hoặc xoá dòng này) để bật lại chi nhánh.
    isActive: false,
    address: "314/6 Điện Biên Phủ, Phường Vườn Lài, Thành phố Hồ Chí Minh",
    heroTitle: "Văn Phòng Cho Thuê 314/6 Điện Biên Phủ, Phường Vườn Lài",
    heroDescription: "Chi nhánh MAX OFFICE tại 314/6 Điện Biên Phủ, Phường Vườn Lài, khu vực Quận 10 (cũ) — văn phòng ảo gói V-START từ 380.000đ/tháng, toà nhà mặt tiền hiện đại có tiệm bánh & cà phê tầng trệt.",
    metaTitle: "Văn Phòng Ảo 314/6 Điện Biên Phủ, Quận 10 (cũ) | Từ 380K/Tháng",
    metaDescription: "Thuê văn phòng ảo tại 314/6 Điện Biên Phủ, Phường Vườn Lài — gói V-START riêng biệt từ 380.000đ/tháng, toà nhà mặt tiền hiện đại, gần chi nhánh CMT8 cùng khu vực Quận 10 (cũ).",
    image: "/images/coworking.jpg",
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
    image: "/images/hero-dia-diem.jpg",
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
    // Đồng bộ với PHAM_VAN_DONG_VO_PROMOS (đã hiển thị trên chính trang chi
    // nhánh qua PhamVanDongServices.tsx) để công cụ "Tìm VPA theo nhu cầu"
    // cũng xuất đúng khuyến mãi này trên ảnh báo giá PNG.
    promotions: PHAM_VAN_DONG_VO_PROMOS,
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
    image: "/images/khong-gian-lam-viec.jpg",
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

  /* ===================== 60 NGUYỄN THÔNG, QUẬN 3 (CŨ) — GÓI GIÁ RIÊNG ===================== */
  "nguyen-thong": {
    slug: "nguyen-thong",
    name: "60 Nguyễn Thông, Quận 3 (cũ)",
    area: AREA_QUAN_3,
    address: "60 Nguyễn Thông, Phường Nhiêu Lộc, Thành phố Hồ Chí Minh",
    heroTitle: "Văn Phòng Cho Thuê 60 Nguyễn Thông, Quận 3 (cũ)",
    heroDescription: "Chi nhánh MAX OFFICE tại 60 Nguyễn Thông, Phường Nhiêu Lộc — chi nhánh đầu tiên tại khu vực Quận 3 (cũ), văn phòng ảo 4 gói riêng biệt từ 379.000đ/tháng, toà nhà văn phòng cao tầng hiện đại.",
    metaTitle: "Văn Phòng Ảo 60 Nguyễn Thông, Quận 3 (cũ) | Từ 379K/Tháng",
    metaDescription: "Thuê văn phòng ảo tại 60 Nguyễn Thông, Phường Nhiêu Lộc — 4 gói riêng SAVE/SILVER/GOLD/PREMIUM từ 379.000đ/tháng (chưa VAT), chi nhánh đầu tiên MAX OFFICE tại khu vực Quận 3 (cũ).",
    image: "/images/coworking.jpg",
    // Cropped street-front shot, không chỉnh sửa — 1122x1402 gốc.
    facadeAspectRatio: "1122 / 1402",
    facadeImageSide: "right",
    interiorImages: [
      { src: "/images/dia-diem-nguyen-thong-le-tan.jpg", alt: "Sảnh lễ tân và tiếp khách văn phòng 60 Nguyễn Thông", caption: "Sảnh lễ tân & tiếp khách" },
      { src: "/images/dia-diem-nguyen-thong-phong-hop.jpg", alt: "Phòng họp văn phòng 60 Nguyễn Thông", caption: "Phòng họp" },
      { src: "/images/dia-diem-nguyen-thong-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng 60 Nguyễn Thông", caption: "Bảng tên công ty tại toà nhà" },
      { src: "/images/dia-diem-nguyen-thong-wc.jpg", alt: "Khu vực vệ sinh văn phòng 60 Nguyễn Thông", caption: "Khu vực vệ sinh" },
    ],
    intro: [
      "Văn phòng 60 Nguyễn Thông toạ lạc tại Phường Nhiêu Lộc, khu vực Quận 3 (cũ) — chi nhánh đầu tiên MAX OFFICE mở tại khu vực này, mở rộng mạng lưới về phía trung tâm thành phố, chỉ cách ranh giới Quận 1 (cũ) một đoạn ngắn. Đây là lựa chọn dành cho doanh nghiệp muốn có địa chỉ đăng ký kinh doanh ở khu vực trung tâm, gần các cơ quan hành chính, mà không phải chịu mức giá cao nhất của khu lõi Quận 1.",
      "Toà nhà đặt chi nhánh là một cao ốc văn phòng nhiều tầng, mặt tiền kính hiện đại, sảnh lễ tân ốp đá cao cấp với khu vực tiếp khách riêng biệt. Đường Nguyễn Thông là một trong những tuyến phố yên tĩnh, ít kẹt xe của Quận 3 (cũ), quy tụ nhiều toà nhà văn phòng và trụ sở doanh nghiệp vừa và nhỏ lâu năm — phù hợp cho doanh nghiệp muốn một môi trường làm việc ổn định, chuyên nghiệp.",
      "Khu vực Phường Nhiêu Lộc nằm dọc kênh Nhiêu Lộc - Thị Nghè, gần Bệnh viện Da Liễu Thành phố Hồ Chí Minh ngay trên cùng trục đường Nguyễn Thông, cùng nhiều trường học, cơ quan hành chính của Quận 3 (cũ). Mật độ dân cư ổn định và hạ tầng dịch vụ đầy đủ giúp khu vực này luôn có nhu cầu văn phòng, địa chỉ đăng ký kinh doanh cao từ các doanh nghiệp vừa và nhỏ.",
      "Chi nhánh cung cấp 4 gói văn phòng ảo riêng biệt — SAVE (379.000đ/tháng), SILVER (479.000đ/tháng), GOLD (639.000đ/tháng) và PREMIUM (990.000đ/tháng), giá chưa bao gồm VAT 10% — phân hoá theo nhu cầu sử dụng phòng họp, sảnh tiếp khách và các dịch vụ pháp lý đi kèm, phù hợp cho cả doanh nghiệp mới thành lập lẫn doanh nghiệp cần nâng cấp hình ảnh chuyên nghiệp hơn.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng 60 Nguyễn Thông",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ, gần trung tâm", desc: "Đủ điều kiện đăng ký kinh doanh, cách ranh giới Quận 1 (cũ) một đoạn ngắn." },
      { icon: MapPinIcon, title: "Khu vực Quận 3 (cũ) yên tĩnh", desc: "Chi nhánh đầu tiên MAX OFFICE tại khu vực này, tuyến phố ít kẹt xe." },
      { icon: BadgePercentIcon, title: "4 gói giá linh hoạt", desc: "SAVE, SILVER, GOLD, PREMIUM — từ 379.000đ/tháng, tuỳ nhu cầu sử dụng." },
      { icon: HeartHandshakeIcon, title: "Sảnh tiếp khách riêng biệt", desc: "Sảnh lễ tân ốp đá cao cấp, có khu vực tiếp khách miễn phí theo từng gói." },
      { icon: UsersIcon, title: "Tiếp tân hành chính chuyên nghiệp", desc: "Tiếp nhận, chuyển tiếp thư từ, bưu phẩm; hỗ trợ đón khách khi ghé chi nhánh." },
      { icon: ClockIcon, title: "Gần kênh Nhiêu Lộc - Thị Nghè", desc: "Không gian thoáng đãng, thuận tiện di chuyển về trung tâm thành phố." },
    ],
    promotions: [
      "Ký hợp đồng 12 tháng: tặng 2 tháng miễn phí",
      "Ký hợp đồng 24 tháng: tặng 6 tháng miễn phí",
    ],
    nearbyItems: [
      { name: "Kênh Nhiêu Lộc - Thị Nghè", desc: "Tuyến kênh cảnh quan chạy dọc khu vực, không gian đi bộ thoáng đãng." },
      { name: "Bệnh viện Da Liễu Thành phố Hồ Chí Minh", desc: "Nằm ngay trên trục đường Nguyễn Thông, cách chi nhánh vài phút đi bộ." },
      { name: "Khu hành chính Quận 3 (cũ)", desc: "Gần các cơ quan hành chính, thuận tiện cho thủ tục pháp lý doanh nghiệp." },
      { name: "Ranh giới Quận 1 (cũ)", desc: "Chỉ cách trung tâm hành chính, tài chính của thành phố một đoạn ngắn." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt hoạt động qua khu vực Nguyễn Thông, Nhiêu Lộc." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Khu vực trung tâm, mặt tiền đường lớn, dễ dàng đặt xe mọi thời điểm." },
      { icon: CheckCircleIcon, title: "Kết nối nhanh về Quận 1", desc: "Di chuyển đến trung tâm hành chính, tài chính thành phố chỉ vài phút." },
      { icon: HeadsetIcon, title: "Tiếp tân hỗ trợ đón khách", desc: "Đội ngũ tiếp tân tại sảnh hỗ trợ đón tiếp và hướng dẫn khách đến lần đầu." },
    ],
    parkingInfo: [
      "Toà nhà có khu vực gửi xe máy dành riêng cho khách đến làm việc.",
      "Hỗ trợ thông tin bãi đỗ ô tô gần khu vực khi cần đón đối tác.",
      "Bảo vệ toà nhà trực thường xuyên, đảm bảo an toàn cho xe cộ trong giờ hành chính.",
    ],
    diningItems: [
      { name: "Quán cà phê khu Nguyễn Thông", desc: "Nhiều quán cà phê yên tĩnh, phù hợp làm việc hoặc gặp gỡ đối tác nhẹ nhàng." },
      { name: "Nhà hàng khu vực Quận 3 (cũ)", desc: "Đa dạng lựa chọn từ cơm văn phòng đến nhà hàng phục vụ tiếp khách trang trọng." },
      { name: "Khu ẩm thực gần kênh Nhiêu Lộc", desc: "Không gian thoáng đãng ven kênh, thích hợp cho bữa trưa hoặc họp nhóm ngoài văn phòng." },
    ],
    faqs: [
      { q: "Chi nhánh 60 Nguyễn Thông có những gói văn phòng ảo nào?", a: "Chi nhánh cung cấp 4 gói riêng biệt: SAVE (379.000đ/tháng), SILVER (479.000đ/tháng), GOLD (639.000đ/tháng) và PREMIUM (990.000đ/tháng) — giá chưa bao gồm VAT 10%." },
      { q: "4 gói SAVE, SILVER, GOLD, PREMIUM khác nhau ở điểm nào?", a: "Cả 4 gói đều có địa chỉ ĐKKD, bảng tên điện tử, tiếp tân và tư vấn miễn phí. Khác biệt nằm ở: SAVE không có bảng tên vật lý (mica); từ SILVER trở lên có bảng tên mica; thời lượng miễn phí phòng họp và sảnh tiếp khách tăng dần qua từng gói; riêng GOLD và PREMIUM có thêm hỗ trợ chuyển đổi địa chỉ trên GPKD, và chỉ PREMIUM có thêm bộ hồ sơ pháp lý toà nhà." },
      { q: "Giá gói văn phòng ảo tại đây đã bao gồm VAT chưa?", a: "Chưa. Toàn bộ mức giá niêm yết (379.000đ - 990.000đ/tháng tuỳ gói) là giá chưa bao gồm VAT 10%, sẽ được thể hiện rõ trong báo giá chính thức trước khi ký hợp đồng." },
      { q: "Địa chỉ 60 Nguyễn Thông có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Nhiêu Lộc, phù hợp đăng ký kinh doanh và đăng ký thuế cho mọi loại hình doanh nghiệp." },
      { q: "Nếu cần đổi địa chỉ đăng ký kinh doanh hoặc khắc dấu công ty thì tính phí thế nào?", a: "Đây là các dịch vụ bổ sung phát sinh riêng ngoài gói văn phòng ảo: thay đổi địa chỉ đăng ký kinh doanh 1.296.000đ (đã bao gồm VAT), khắc dấu tròn doanh nghiệp/dấu chi nhánh/VPĐD 480.000đ." },
      { q: "Ký hợp đồng dài hạn tại 60 Nguyễn Thông có được khuyến mãi gì không?", a: "Có. Ký hợp đồng 12 tháng được tặng 2 tháng sử dụng miễn phí; ký hợp đồng 24 tháng được tặng 6 tháng sử dụng miễn phí — áp dụng cho mọi gói văn phòng ảo tại chi nhánh này." },
      { q: "Tôi có thể đến tham quan văn phòng 60 Nguyễn Thông trước khi ký hợp đồng không?", a: "Có. Bạn để lại thông tin qua form trên trang này hoặc gọi hotline 089 8082 188 để được sắp xếp lịch tham quan miễn phí." },
    ],
    testimonials: [
      { quote: "Sảnh lễ tân sang trọng nên mỗi lần mời đối tác ghé văn phòng đều để lại ấn tượng tốt.", initial: "T", name: "Anh Tuấn", role: "Giám đốc công ty tư vấn" },
      { quote: "Mình chọn gói GOLD vì có hỗ trợ đổi địa chỉ GPKD, thủ tục xử lý nhanh mà không phải tự lo giấy tờ.", initial: "M", name: "Chị Mai", role: "Chủ doanh nghiệp thương mại" },
    ],
  },

  /* ===================== 520 CÁCH MẠNG THÁNG 8, QUẬN 3 (CŨ) ===================== */
  "cach-mang-thang-8": {
    slug: "cach-mang-thang-8",
    name: "520 Cách Mạng Tháng 8, Quận 3 (cũ)",
    area: AREA_QUAN_3,
    address: "520 Cách Mạng Tháng 8, Phường Nhiêu Lộc, Thành phố Hồ Chí Minh",
    heroTitle: "Văn Phòng Cho Thuê 520 Cách Mạng Tháng 8, Quận 3 (cũ)",
    heroDescription: "Chi nhánh MAX OFFICE tại 520 Cách Mạng Tháng 8, Phường Nhiêu Lộc — chi nhánh thứ hai tại khu vực Quận 3 (cũ), văn phòng ảo 4 gói riêng biệt từ 379.000đ/tháng, mặt tiền trục đường lớn.",
    metaTitle: "Văn Phòng Ảo 520 Cách Mạng Tháng 8, Quận 3 (cũ) | Từ 379K/Tháng",
    metaDescription: "Thuê văn phòng ảo tại 520 Cách Mạng Tháng 8, Phường Nhiêu Lộc (Quận 3 cũ) — 4 gói riêng SAVE/SILVER/GOLD/PREMIUM từ 379.000đ/tháng (chưa VAT). Lưu ý: khác hoàn toàn chi nhánh CMT8 tại Quận 10 (cũ).",
    image: "/images/anh-hero-trang-chu.jpg",
    // Cropped street-front shot, không chỉnh sửa — 873x1122 gốc.
    facadeAspectRatio: "873 / 1122",
    facadeImageSide: "left",
    interiorImages: [
      { src: "/images/dia-diem-cach-mang-thang-8-le-tan.jpg", alt: "Quầy lễ tân văn phòng 520 Cách Mạng Tháng 8", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-cach-mang-thang-8-tiep-khach.jpg", alt: "Khu vực tiếp khách văn phòng 520 Cách Mạng Tháng 8", caption: "Khu vực tiếp khách" },
      { src: "/images/dia-diem-cach-mang-thang-8-phong-hop.jpg", alt: "Phòng họp văn phòng 520 Cách Mạng Tháng 8", caption: "Phòng họp" },
      { src: "/images/dia-diem-cach-mang-thang-8-tien-ich.jpg", alt: "Tiện ích toà nhà văn phòng 520 Cách Mạng Tháng 8", caption: "Tiện ích toà nhà" },
    ],
    intro: [
      "Văn phòng 520 Cách Mạng Tháng 8 toạ lạc tại Phường Nhiêu Lộc, khu vực Quận 3 (cũ) — chi nhánh thứ hai MAX OFFICE mở tại khu vực này, bên cạnh chi nhánh 60 Nguyễn Thông đã hoạt động từ trước. Lưu ý quan trọng: đây KHÔNG phải cùng một chi nhánh với văn phòng \"CMT8, Quận 10 (cũ)\" trên trục Cách Mạng Tháng 8 đoạn Phường Hoà Hưng gần Ga Sài Gòn — hai địa chỉ nằm trên cùng con đường nhưng ở hai đoạn, hai khu vực hoàn toàn khác nhau của thành phố.",
      "Khác với 60 Nguyễn Thông nằm trên một tuyến phố nội bộ yên tĩnh, chi nhánh 520 Cách Mạng Tháng 8 có lợi thế mặt tiền ngay trên trục đường lớn, nhiều làn xe, dễ tìm và dễ nhận diện biển hiệu công ty từ xa. Đây là lựa chọn phù hợp cho doanh nghiệp muốn có địa chỉ đăng ký kinh doanh dễ tra cứu, thuận tiện cho đối tác hoặc khách hàng lần đầu ghé thăm mà không cần chỉ dẫn qua hẻm nhỏ.",
      "Khu vực Phường Nhiêu Lộc quanh đoạn Cách Mạng Tháng 8 này gần giao lộ với Nguyễn Thị Minh Khai, kết nối nhanh về trung tâm Quận 1, Quận 3 (cũ) và cả hướng Quận 10, Tân Bình mà không phải đi vòng. Sảnh lễ tân của toà nhà có khu vực tiếp khách riêng biệt, phù hợp cho doanh nghiệp thường xuyên đón đối tác đến làm việc trực tiếp.",
      "Cũng như chi nhánh 60 Nguyễn Thông, 520 Cách Mạng Tháng 8 cung cấp 4 gói văn phòng ảo riêng biệt — SAVE (379.000đ/tháng), SILVER (479.000đ/tháng), GOLD (639.000đ/tháng) và PREMIUM (990.000đ/tháng), giá chưa bao gồm VAT 10% — dùng chung bảng giá của khu vực Quận 3 (cũ), phân hoá theo nhu cầu sử dụng phòng họp, sảnh tiếp khách và dịch vụ pháp lý đi kèm.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng 520 Cách Mạng Tháng 8",
    benefits: [
      { icon: ShieldCheckIcon, title: "Địa chỉ hợp lệ, mặt tiền lớn", desc: "Đủ điều kiện đăng ký kinh doanh, mặt tiền trục Cách Mạng Tháng 8 nhiều làn xe." },
      { icon: MapPinIcon, title: "Khu vực Quận 3 (cũ)", desc: "Chi nhánh thứ hai MAX OFFICE tại khu vực này, bên cạnh 60 Nguyễn Thông." },
      { icon: BadgePercentIcon, title: "4 gói giá linh hoạt", desc: "SAVE, SILVER, GOLD, PREMIUM — từ 379.000đ/tháng, tuỳ nhu cầu sử dụng." },
      { icon: HeartHandshakeIcon, title: "Khu vực tiếp khách riêng", desc: "Sảnh lễ tân có khu tiếp khách riêng biệt, phù hợp đón đối tác trực tiếp." },
      { icon: UsersIcon, title: "Dễ tìm, dễ nhận diện", desc: "Mặt tiền đường lớn, không cần chỉ dẫn qua hẻm như nhiều văn phòng khác." },
      { icon: ClockIcon, title: "Gần giao lộ Nguyễn Thị Minh Khai", desc: "Kết nối nhanh về trung tâm Quận 1, Quận 3 (cũ) và hướng Quận 10, Tân Bình." },
    ],
    promotions: [
      "Ký hợp đồng 12 tháng: tặng 2 tháng miễn phí",
      "Ký hợp đồng 24 tháng: tặng 6 tháng miễn phí",
    ],
    nearbyItems: [
      { name: "Trục Cách Mạng Tháng 8", desc: "Mặt tiền đường lớn, nhiều làn xe, dễ tìm và dễ nhận diện biển hiệu." },
      { name: "Giao lộ Nguyễn Thị Minh Khai", desc: "Kết nối nhanh về trung tâm Quận 1, Quận 3 (cũ)." },
      { name: "Chi nhánh 60 Nguyễn Thông", desc: "Chi nhánh MAX OFFICE khác trong cùng khu vực Quận 3 (cũ), cách không xa." },
      { name: "Khu dân cư Phường Nhiêu Lộc", desc: "Xen kẽ nhiều cửa hàng, dịch vụ mặt tiền dọc trục đường lớn." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt hoạt động dọc trục Cách Mạng Tháng 8." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Mặt tiền đường lớn, dễ dàng đặt xe và tìm điểm đón mọi thời điểm." },
      { icon: CheckCircleIcon, title: "Kết nối đa hướng", desc: "Từ trục Cách Mạng Tháng 8 có thể đi nhanh về Quận 1, Quận 10 hoặc Tân Bình." },
      { icon: HeadsetIcon, title: "Tiếp tân hỗ trợ đón khách", desc: "Đội ngũ tiếp tân tại sảnh hỗ trợ đón tiếp khách ngay khi vừa đến." },
    ],
    parkingInfo: [
      "Toà nhà có khu vực gửi xe máy dành cho khách đến làm việc.",
      "Mặt tiền đường lớn nên khá dễ tìm chỗ đỗ ô tô tạm thời khi cần đón đối tác.",
      "Có nhân viên bảo vệ hỗ trợ trông giữ xe trong suốt giờ làm việc.",
    ],
    diningItems: [
      { name: "Quán ăn dọc Cách Mạng Tháng 8", desc: "Đa dạng lựa chọn từ cơm văn phòng đến quán ăn nhanh phục vụ giờ trưa." },
      { name: "Cà phê khu Nhiêu Lộc", desc: "Nhiều quán cà phê mặt tiền, thuận tiện gặp gỡ đối tác trước hoặc sau giờ làm." },
      { name: "Nhà hàng khu vực Quận 3 (cũ)", desc: "Lựa chọn nhà hàng phù hợp cho các buổi tiếp khách trang trọng hơn." },
    ],
    faqs: [
      { q: "Chi nhánh 520 Cách Mạng Tháng 8 có phải là chi nhánh CMT8 ở Quận 10 (cũ) không?", a: "Không. Đây là hai chi nhánh hoàn toàn khác nhau, chỉ trùng tên đường. 520 Cách Mạng Tháng 8 thuộc Phường Nhiêu Lộc, khu vực Quận 3 (cũ); còn chi nhánh CMT8 (283/26-28 Cách Mạng Tháng 8) thuộc Phường Hoà Hưng, khu vực Quận 10 (cũ), gần Ga Sài Gòn — cách nhau khá xa về vị trí thực tế." },
      { q: "Chi nhánh 520 Cách Mạng Tháng 8 áp dụng bảng giá nào?", a: "Chi nhánh dùng chung bảng giá với 60 Nguyễn Thông trong cùng khu vực Quận 3 (cũ), gồm 4 gói: SAVE (379.000đ/tháng), SILVER (479.000đ/tháng), GOLD (639.000đ/tháng) và PREMIUM (990.000đ/tháng) — giá chưa bao gồm VAT 10%." },
      { q: "Địa chỉ 520 Cách Mạng Tháng 8 có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ hợp lệ tại Phường Nhiêu Lộc, đủ điều kiện đăng ký kinh doanh và đăng ký thuế theo quy định hiện hành, áp dụng cho mọi loại hình doanh nghiệp." },
      { q: "So với chi nhánh 60 Nguyễn Thông, nên chọn 520 Cách Mạng Tháng 8 khi nào?", a: "Nếu bạn ưu tiên địa chỉ dễ tìm, mặt tiền đường lớn, thuận tiện cho đối tác lần đầu ghé thăm mà không cần chỉ dẫn qua hẻm, 520 Cách Mạng Tháng 8 là lựa chọn phù hợp. Nếu ưu tiên không gian yên tĩnh hơn, có thể tham khảo thêm chi nhánh 60 Nguyễn Thông cùng khu vực." },
      { q: "Chi nhánh có hỗ trợ đổi địa chỉ ĐKKD hoặc khắc dấu công ty không, chi phí bao nhiêu?", a: "Có, đây là 2 dịch vụ bổ sung tính riêng ngoài gói văn phòng ảo hàng tháng: thay đổi địa chỉ đăng ký kinh doanh giá 1.296.000đ (đã bao gồm VAT); khắc dấu tròn doanh nghiệp, dấu chi nhánh hoặc dấu văn phòng đại diện giá 480.000đ mỗi con dấu." },
      { q: "Ký hợp đồng dài hạn tại 520 Cách Mạng Tháng 8 có được khuyến mãi gì không?", a: "Có. Ký hợp đồng 12 tháng được tặng 2 tháng sử dụng miễn phí; ký hợp đồng 24 tháng được tặng 6 tháng sử dụng miễn phí — áp dụng cho mọi gói văn phòng ảo tại chi nhánh này." },
      { q: "Tôi có thể đến tham quan văn phòng 520 Cách Mạng Tháng 8 trước khi ký hợp đồng không?", a: "Có. Bạn để lại thông tin qua form trên trang này hoặc gọi hotline 089 8082 188 để được sắp xếp lịch tham quan miễn phí, đội ngũ sẽ hướng dẫn cụ thể để tránh nhầm với chi nhánh CMT8 Quận 10." },
    ],
    testimonials: [
      { quote: "Văn phòng mặt tiền đường lớn nên đối tác dễ tìm, không phải hướng dẫn qua hẻm như chỗ cũ mình từng thuê.", initial: "H", name: "Anh Hùng", role: "Giám đốc công ty xây dựng" },
      { quote: "Lúc đầu mình nhầm với chi nhánh CMT8 bên Quận 10, may mà gọi hotline xác nhận địa chỉ trước khi đi.", initial: "Y", name: "Chị Yến", role: "Chủ hộ kinh doanh cá thể" },
    ],
  },

  /* =============== UNG VĂN KHIÊM (KHU VỰC BÌNH THẠNH MỚI) =============== */
  "ung-van-khiem": {
    slug: "ung-van-khiem",
    name: "161 Ung Văn Khiêm, Bình Thạnh (cũ)",
    area: AREA_BINH_THANH,
    address: "161 Ung Văn Khiêm, Phường Thạnh Mỹ Tây, Thành phố Hồ Chí Minh",
    heroTitle: "Văn Phòng Cho Thuê 161 Ung Văn Khiêm, Bình Thạnh (cũ)",
    heroDescription:
      "Chi nhánh đầu tiên của MAX OFFICE tại khu vực Bình Thạnh (cũ) — văn phòng ảo 3 gói riêng biệt từ 379.000đ/tháng, toà nhà văn phòng cao tầng hiện đại ngay trục Ung Văn Khiêm.",
    metaTitle: "Văn Phòng Ảo 161 Ung Văn Khiêm, Bình Thạnh (cũ) | Từ 379K/Tháng",
    metaDescription:
      "Thuê văn phòng ảo tại 161 Ung Văn Khiêm, Phường Thạnh Mỹ Tây (Bình Thạnh cũ) — chi nhánh đầu tiên MAX OFFICE tại khu vực này, 3 gói SILVER/GOLD/PREMIUM từ 379.000đ/tháng (chưa VAT), gần giao lộ Hàng Xanh.",
    image: "/images/hero-bang-gia-2.png",
    // Ảnh mặt tiền gốc 813x1086, không chỉnh sửa.
    facadeAspectRatio: "813 / 1086",
    facadeImageSide: "right",
    interiorImages: [
      { src: "/images/dia-diem-ung-van-khiem-le-tan.jpg", alt: "Quầy lễ tân văn phòng 161 Ung Văn Khiêm", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-ung-van-khiem-tiep-khach.jpg", alt: "Sảnh tiếp khách văn phòng 161 Ung Văn Khiêm", caption: "Sảnh tiếp khách" },
      { src: "/images/dia-diem-ung-van-khiem-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng 161 Ung Văn Khiêm", caption: "Bảng tên công ty tại toà nhà" },
      { src: "/images/dia-diem-ung-van-khiem-phong-hop.jpg", alt: "Phòng họp văn phòng 161 Ung Văn Khiêm", caption: "Phòng họp" },
    ],
    intro: [
      "Văn phòng 161 Ung Văn Khiêm là chi nhánh đầu tiên MAX OFFICE mở tại khu vực Bình Thạnh (cũ), toạ lạc tại Phường Thạnh Mỹ Tây — khu vực cửa ngõ Đông Bắc trung tâm thành phố, không xa giao lộ Hàng Xanh và kênh Nhiêu Lộc - Thị Nghè. Sự xuất hiện của chi nhánh này mở rộng thêm một lựa chọn địa chỉ đăng ký kinh doanh cho doanh nghiệp muốn đặt trụ sở ở khu vực trung chuyển giữa trung tâm Quận 1 và phía Đông thành phố.",
      "Toà nhà nơi đặt chi nhánh là một cao ốc văn phòng nhiều tầng với mặt tiền kính hiện đại, sảnh lễ tân được thiết kế theo phong cách tối giản, ốp gỗ và có khu vực tiếp khách riêng ngay lối vào. Bên trong toà nhà hiện đã có nhiều doanh nghiệp thuộc các lĩnh vực khác nhau đặt văn phòng, cho thấy đây là địa chỉ được nhiều công ty tin chọn làm nơi đăng ký hoạt động.",
      "Chi nhánh cung cấp 3 gói văn phòng ảo riêng biệt — SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng), giá chưa bao gồm VAT 10%. Đây là bảng giá được thiết kế dùng chung cho các chi nhánh MAX OFFICE tại khu vực Bình Thạnh, phân hoá theo thời lượng sử dụng phòng họp, sảnh tiếp khách và các hỗ trợ pháp lý đi kèm như đổi địa chỉ trên giấy phép kinh doanh hay hồ sơ pháp lý toà nhà.",
      "Với vị trí gần giao lộ Hàng Xanh và trục Điện Biên Phủ nối dài, doanh nghiệp đặt văn phòng tại 161 Ung Văn Khiêm có thể di chuyển nhanh về trung tâm Quận 1 hoặc qua cầu Sài Gòn sang khu vực phía Đông thành phố. Đây là lựa chọn phù hợp cho các công ty thương mại, dịch vụ cần một địa chỉ đăng ký kinh doanh thuận tiện kết nối nhiều hướng mà không phải đặt văn phòng ngay khu trung tâm với chi phí cao hơn.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng 161 Ung Văn Khiêm",
    benefits: [
      { icon: BuildingIcon, title: "Chi nhánh đầu tiên tại Bình Thạnh", desc: "Mở rộng hệ thống MAX OFFICE sang khu vực Bình Thạnh (cũ), toà cao ốc văn phòng hiện đại." },
      { icon: MapPinIcon, title: "Gần giao lộ Hàng Xanh", desc: "Kết nối nhanh về trung tâm Quận 1 và nhiều trục đường lớn của thành phố." },
      { icon: BadgePercentIcon, title: "3 gói giá linh hoạt", desc: "SILVER, GOLD, PREMIUM — từ 379.000đ/tháng, tuỳ nhu cầu sử dụng phòng họp và sảnh tiếp khách." },
      { icon: HeartHandshakeIcon, title: "Sảnh tiếp khách riêng", desc: "Khu vực tiếp khách thiết kế riêng ngay lối vào, phù hợp đón đối tác trực tiếp." },
      { icon: UsersIcon, title: "Toà nhà nhiều doanh nghiệp tin chọn", desc: "Cao ốc văn phòng đã có nhiều công ty đặt trụ sở, môi trường kinh doanh sôi động." },
      { icon: ClockIcon, title: "Gần kênh Nhiêu Lộc - Thị Nghè", desc: "Không gian xanh dọc kênh, thuận tiện di chuyển sang nhiều khu vực lân cận." },
    ],
    promotions: [
      "Ký hợp đồng 12 tháng: tặng 2 tháng miễn phí",
      "Ký hợp đồng 24 tháng: tặng 6 tháng miễn phí",
    ],
    nearbyItems: [
      { name: "Giao lộ Hàng Xanh", desc: "Nút giao trọng điểm của khu vực Bình Thạnh, thuận tiện di chuyển nhiều hướng trong thành phố." },
      { name: "Kênh Nhiêu Lộc - Thị Nghè", desc: "Không gian xanh dọc kênh, phù hợp đi bộ thư giãn ngoài giờ làm việc." },
      { name: "Cầu Sài Gòn", desc: "Lối kết nối nhanh sang khu vực phía Đông thành phố khi cần di chuyển liên quận." },
      { name: "Khu dân cư Phường Thạnh Mỹ Tây", desc: "Khu vực dân cư và văn phòng xen kẽ, tập trung nhiều tiện ích sinh hoạt xung quanh." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Có các tuyến xe buýt chạy ngang khu vực Bình Thạnh, điểm dừng gần trục Ung Văn Khiêm." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Vị trí gần giao lộ Hàng Xanh giúp việc gọi xe công nghệ nhanh chóng vào giờ cao điểm." },
      { icon: CheckCircleIcon, title: "Trục Ung Văn Khiêm — Điện Biên Phủ", desc: "Từ chi nhánh có thể di chuyển nhanh về trung tâm Quận 1 hoặc qua cầu Sài Gòn sang khu Đông thành phố." },
      { icon: HeadsetIcon, title: "Tiếp tân hỗ trợ đón khách", desc: "Lễ tân tại toà nhà hướng dẫn khách tận nơi ngay khi vừa đến." },
    ],
    parkingInfo: [
      "Khu vực để xe máy nằm ngay trong khuôn viên toà nhà, thuận tiện cho khách ra vào làm việc mỗi ngày.",
      "Sảnh trước toà nhà đủ rộng để tài xế dừng đỗ ngắn hạn khi đưa đón đối tác.",
      "Có bảo vệ toà nhà theo dõi an ninh khu vực để xe trong suốt giờ hành chính.",
    ],
    diningItems: [
      { name: "Quán ăn khu vực Ung Văn Khiêm", desc: "Nhiều quán cơm, quán ăn trưa phục vụ nhanh cho dân văn phòng trong bán kính đi bộ." },
      { name: "Cà phê trục Điện Biên Phủ nối dài", desc: "Không gian cà phê phù hợp trao đổi công việc hoặc gặp gỡ khách hàng ngoài giờ họp chính thức." },
      { name: "Nhà hàng khu Bình Thạnh", desc: "Có các nhà hàng quy mô vừa, thích hợp cho bữa tiếp đối tác cần không gian trang trọng hơn quán ăn thường." },
    ],
    faqs: [
      { q: "Chi nhánh 161 Ung Văn Khiêm có phải là chi nhánh đầu tiên của MAX OFFICE tại Bình Thạnh không?", a: "Đúng vậy. Đây là chi nhánh đầu tiên MAX OFFICE mở tại khu vực Bình Thạnh (cũ), toạ lạc tại Phường Thạnh Mỹ Tây, mở rộng thêm lựa chọn địa chỉ đăng ký kinh doanh cho doanh nghiệp ở khu vực cửa ngõ Đông Bắc trung tâm thành phố." },
      { q: "Chi nhánh 161 Ung Văn Khiêm áp dụng bảng giá văn phòng ảo nào?", a: "Chi nhánh áp dụng 3 gói riêng biệt: SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng) — giá chưa bao gồm VAT 10%, khác với hệ thống LITE-RISE chung của các chi nhánh khác trong hệ thống." },
      { q: "Địa chỉ 161 Ung Văn Khiêm có hợp lệ để mở công ty mới không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Thạnh Mỹ Tây, đủ điều kiện đăng ký kinh doanh và đăng ký thuế, áp dụng cho công ty TNHH, công ty cổ phần lẫn hộ kinh doanh cá thể." },
      { q: "Gói SILVER, GOLD và PREMIUM tại chi nhánh này khác nhau ở điểm nào?", a: "Cả 3 gói đều có bảng tên vật lý và bảng tên điện tử tại toà nhà; điểm khác biệt nằm ở thời lượng miễn phí phòng họp, sảnh tiếp khách, cùng việc có hỗ trợ đổi địa chỉ trên giấy phép kinh doanh hay bộ hồ sơ pháp lý toà nhà hay không — xem chi tiết trong bảng giá phía trên." },
      { q: "Chi nhánh có hỗ trợ đổi địa chỉ giấy phép kinh doanh hoặc khắc dấu công ty không?", a: "Có. Đây là 2 dịch vụ phát sinh riêng, tính thêm ngoài phí gói văn phòng ảo hàng tháng: thay đổi địa chỉ trên giấy phép kinh doanh giá 1.296.000đ (đã gồm VAT), và khắc dấu tròn công ty, dấu chi nhánh hoặc dấu văn phòng đại diện với giá 480.000đ cho mỗi con dấu." },
      { q: "Ký hợp đồng dài hạn tại 161 Ung Văn Khiêm có được khuyến mãi gì không?", a: "Có. Ký hợp đồng 12 tháng được tặng 2 tháng sử dụng miễn phí; ký hợp đồng 24 tháng được tặng 6 tháng sử dụng miễn phí — áp dụng cho mọi gói văn phòng ảo tại chi nhánh này." },
      { q: "Làm sao để đặt lịch xem văn phòng tại 161 Ung Văn Khiêm trước khi ký hợp đồng?", a: "Bạn có thể để lại thông tin qua form trên trang này hoặc gọi hotline 089 8082 188, đội ngũ MAX OFFICE sẽ liên hệ sắp xếp lịch tham quan miễn phí trong thời gian sớm nhất." },
    ],
    testimonials: [
      { quote: "Ban đầu mình hơi ngại vì đây là chi nhánh mới bên Bình Thạnh, nhưng toà nhà rất chuyên nghiệp và đội ngũ hỗ trợ nhiệt tình.", initial: "T", name: "Anh Tuấn", role: "Giám đốc công ty thương mại" },
      { quote: "Vị trí gần Hàng Xanh nên đối tác từ Quận 1 hay khu Đông thành phố ghé văn phòng đều khá thuận tiện.", initial: "L", name: "Chị Linh", role: "Chủ hộ kinh doanh dịch vụ" },
    ],
  },

  /* =============== TÂN CẢNG (CHI NHÁNH THỨ 2 KHU VỰC BÌNH THẠNH) =============== */
  "tan-cang": {
    slug: "tan-cang",
    name: "23 Tân Cảng, Bình Thạnh (cũ)",
    area: AREA_BINH_THANH,
    address: "23 Tân Cảng, Phường Thạnh Mỹ Tây, Thành phố Hồ Chí Minh",
    heroTitle: "Văn Phòng Cho Thuê 23 Tân Cảng, Bình Thạnh (cũ)",
    heroDescription:
      "Chi nhánh thứ hai của MAX OFFICE tại khu vực Bình Thạnh (cũ) — văn phòng ảo 3 gói riêng biệt từ 379.000đ/tháng, toạ lạc tại DHT Building gần ga Metro Tân Cảng.",
    metaTitle: "Văn Phòng Ảo 23 Tân Cảng, Bình Thạnh (cũ) | Từ 379K/Tháng",
    metaDescription:
      "Thuê văn phòng ảo tại 23 Tân Cảng, Phường Thạnh Mỹ Tây (Bình Thạnh cũ) — DHT Building, 3 gói SILVER/GOLD/PREMIUM từ 379.000đ/tháng (chưa VAT), gần ga Metro Tân Cảng và Landmark 81.",
    image: "/images/hero-ve-chung-toi-2.png",
    // Ảnh mặt tiền gốc 1086x1448, không chỉnh sửa.
    facadeAspectRatio: "1086 / 1448",
    facadeImageSide: "left",
    interiorImages: [
      { src: "/images/dia-diem-tan-cang-le-tan.jpg", alt: "Sảnh lễ tân & tiếp khách văn phòng 23 Tân Cảng", caption: "Sảnh lễ tân & tiếp khách" },
      { src: "/images/dia-diem-tan-cang-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng 23 Tân Cảng", caption: "Bảng tên công ty tại toà nhà" },
      { src: "/images/dia-diem-tan-cang-tien-ich.jpg", alt: "Tiện ích toà nhà văn phòng 23 Tân Cảng", caption: "Tiện ích toà nhà" },
    ],
    intro: [
      "Văn phòng 23 Tân Cảng là chi nhánh thứ hai MAX OFFICE mở tại khu vực Bình Thạnh (cũ), toạ lạc tại DHT Building trên đường Tân Cảng, Phường Thạnh Mỹ Tây. Dù cùng phường với chi nhánh 161 Ung Văn Khiêm, đây là hai địa chỉ hoàn toàn khác nhau — Tân Cảng là con đường riêng biệt, gần khu vực Cảng Sài Gòn cũ và ga Metro Tân Cảng, khác hẳn trục Ung Văn Khiêm gần giao lộ Hàng Xanh.",
      "DHT Building là một cao ốc văn phòng nhiều tầng với mặt tiền kính hiện đại, điểm nhấn khung nhôm màu cam nổi bật, sảnh lễ tân ốp gỗ ấm áp có khu vực tiếp khách ngay lối vào. Toà nhà hiện có nhiều doanh nghiệp thuộc nhiều lĩnh vực khác nhau thuê văn phòng, cho thấy đây là địa chỉ được thị trường tin chọn để đặt trụ sở lâu dài.",
      "Chi nhánh áp dụng đúng bảng giá văn phòng ảo dùng chung của khu vực Bình Thạnh — 3 gói SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng), giá chưa bao gồm VAT 10% — cùng cấu trúc tính năng như chi nhánh 161 Ung Văn Khiêm, giúp khách hàng dễ dàng so sánh và lựa chọn chi nhánh phù hợp hơn về vị trí trong cùng khu vực.",
      "Điểm mạnh của 23 Tân Cảng nằm ở vị trí gần ga Metro Tân Cảng thuộc tuyến Metro số 1 (Bến Thành - Suối Tiên), không xa khu phức hợp Landmark 81 và Vinhomes Central Park. Đây là lựa chọn phù hợp cho doanh nghiệp muốn có địa chỉ đăng ký kinh doanh gần khu vực phát triển hiện đại, thuận tiện di chuyển bằng cả đường bộ lẫn tuyến Metro khi mở rộng đội ngũ.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng 23 Tân Cảng",
    benefits: [
      { icon: BuildingIcon, title: "Toạ lạc tại DHT Building", desc: "Cao ốc văn phòng hiện đại, nhiều doanh nghiệp đang thuê văn phòng lâu dài." },
      { icon: MapPinIcon, title: "Gần ga Metro Tân Cảng", desc: "Thuộc tuyến Metro số 1 (Bến Thành - Suối Tiên), thuận tiện di chuyển bằng Metro." },
      { icon: BadgePercentIcon, title: "3 gói giá linh hoạt", desc: "SILVER, GOLD, PREMIUM — từ 379.000đ/tháng, dùng chung bảng giá khu vực Bình Thạnh." },
      { icon: HeartHandshakeIcon, title: "Sảnh tiếp khách ốp gỗ", desc: "Không gian tiếp khách ấm áp ngay lối vào, phù hợp đón đối tác trực tiếp." },
      { icon: UsersIcon, title: "Gần Landmark 81, Vinhomes Central Park", desc: "Khu vực phát triển hiện đại, phù hợp doanh nghiệp muốn định vị hình ảnh cao cấp." },
      { icon: ClockIcon, title: "Khác biệt rõ với 161 Ung Văn Khiêm", desc: "Cùng khu vực Bình Thạnh nhưng khác hẳn con đường, dễ chọn theo vị trí phù hợp." },
    ],
    promotions: [
      "Ký hợp đồng 12 tháng: tặng 2 tháng miễn phí",
      "Ký hợp đồng 24 tháng: tặng 6 tháng miễn phí",
    ],
    nearbyItems: [
      { name: "Ga Metro Tân Cảng", desc: "Ga thuộc tuyến Metro số 1 (Bến Thành - Suối Tiên), cách toà nhà không xa." },
      { name: "Landmark 81", desc: "Toà tháp biểu tượng của thành phố, nằm trong khu phức hợp Vinhomes Central Park." },
      { name: "Khu vực Cảng Sài Gòn cũ", desc: "Vị trí gắn liền với tên gọi Tân Cảng, gần sông Sài Gòn." },
      { name: "Chi nhánh 161 Ung Văn Khiêm", desc: "Chi nhánh MAX OFFICE khác cùng khu vực Bình Thạnh (cũ), khác con đường." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Metro số 1 (Bến Thành - Suối Tiên)", desc: "Ga Tân Cảng nằm gần khu vực, thêm lựa chọn di chuyển ngoài đường bộ." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Khu vực đông đúc dân cư và văn phòng nên dễ dàng đặt xe mọi thời điểm." },
      { icon: CheckCircleIcon, title: "Trục đường Tân Cảng — Điện Biên Phủ", desc: "Kết nối thuận tiện về trung tâm Quận 1 và khu vực Vinhomes Central Park." },
      { icon: HeadsetIcon, title: "Bảo vệ toà nhà hỗ trợ chỉ dẫn", desc: "Đội ngũ bảo vệ tại sảnh DHT Building hỗ trợ khách tìm đúng văn phòng khi mới đến." },
    ],
    parkingInfo: [
      "DHT Building có hầm/khu vực để xe riêng phục vụ khách đến làm việc tại toà nhà.",
      "Có thể tấp xe tạm trước sảnh toà nhà khi cần đưa đón đối tác trong thời gian ngắn.",
      "Bảo vệ toà nhà trực 24/7, hỗ trợ an ninh khu vực để xe cho khách ra vào.",
    ],
    diningItems: [
      { name: "Quán ăn khu vực Tân Cảng", desc: "Nhiều lựa chọn quán ăn trưa gần toà nhà, phù hợp bữa ăn nhanh của dân văn phòng." },
      { name: "Nhà hàng khu Vinhomes Central Park", desc: "Không xa khu phức hợp Landmark 81, có nhiều nhà hàng phù hợp tiếp đối tác cao cấp." },
      { name: "Cà phê dọc trục Điện Biên Phủ", desc: "Không gian phù hợp trao đổi công việc nhanh trước hoặc sau cuộc họp." },
    ],
    faqs: [
      { q: "Chi nhánh 23 Tân Cảng có phải cùng địa chỉ với 161 Ung Văn Khiêm không?", a: "Không. Đây là hai chi nhánh khác nhau cùng thuộc khu vực Bình Thạnh (cũ) và cùng Phường Thạnh Mỹ Tây, nhưng nằm trên hai con đường riêng biệt — 23 Tân Cảng gần khu vực Cảng Sài Gòn cũ và ga Metro Tân Cảng, còn 161 Ung Văn Khiêm gần giao lộ Hàng Xanh." },
      { q: "DHT Building là toà nhà của MAX OFFICE hay của bên khác quản lý?", a: "DHT Building là tên toà nhà văn phòng nơi MAX OFFICE thuê và vận hành chi nhánh 23 Tân Cảng, tương tự cách các chi nhánh khác của hệ thống đặt tại các toà nhà văn phòng khác nhau trong thành phố." },
      { q: "Chi nhánh 23 Tân Cảng áp dụng bảng giá văn phòng ảo nào?", a: "Chi nhánh dùng chung bảng giá với 161 Ung Văn Khiêm trong cùng khu vực Bình Thạnh, gồm 3 gói: SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng) — giá chưa bao gồm VAT 10%." },
      { q: "Địa chỉ 23 Tân Cảng có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Thạnh Mỹ Tây, đủ điều kiện đăng ký kinh doanh, đăng ký thuế cho công ty TNHH, công ty cổ phần và hộ kinh doanh cá thể." },
      { q: "Ngoài phí gói văn phòng ảo hàng tháng, chi nhánh còn dịch vụ phát sinh nào khác không?", a: "Có 2 khoản phát sinh tính riêng khi cần: đổi địa chỉ trên giấy phép kinh doanh, giá 1.296.000đ đã bao gồm VAT; và khắc con dấu — dấu tròn công ty, dấu chi nhánh hoặc dấu văn phòng đại diện — mỗi con dấu 480.000đ." },
      { q: "Ký hợp đồng dài hạn tại 23 Tân Cảng có được khuyến mãi gì không?", a: "Có. Ký hợp đồng 12 tháng được tặng 2 tháng sử dụng miễn phí; ký hợp đồng 24 tháng được tặng 6 tháng sử dụng miễn phí — áp dụng cho mọi gói văn phòng ảo tại chi nhánh này." },
      { q: "Nên chọn 23 Tân Cảng hay 161 Ung Văn Khiêm khi cả hai cùng khu vực Bình Thạnh?", a: "Nếu bạn ưu tiên vị trí gần ga Metro và khu vực Landmark 81, Vinhomes Central Park, 23 Tân Cảng là lựa chọn phù hợp. Nếu ưu tiên gần giao lộ Hàng Xanh và trục Điện Biên Phủ, có thể tham khảo thêm chi nhánh 161 Ung Văn Khiêm — cả hai đều dùng chung một bảng giá nên bạn có thể chọn theo vị trí thuận tiện nhất." },
    ],
    testimonials: [
      { quote: "Công ty mình chọn DHT Building vì gần ga Metro Tân Cảng, nhân viên đi làm bằng Metro rất tiện.", initial: "K", name: "Chị Khánh", role: "Trưởng phòng nhân sự, công ty dịch vụ" },
      { quote: "Sảnh lễ tân toà nhà khá sang trọng, phù hợp cho những buổi hẹn gặp đối tác quan trọng.", initial: "B", name: "Anh Bảo", role: "Giám đốc công ty tư vấn" },
    ],
  },

  /* =============== N1 ĐIỆN BIÊN PHỦ (CHI NHÁNH THỨ 3 KHU VỰC BÌNH THẠNH) =============== */
  "n1-dien-bien-phu": {
    slug: "n1-dien-bien-phu",
    name: "N1 Điện Biên Phủ, Bình Thạnh (cũ)",
    area: AREA_BINH_THANH,
    address: "N1 Điện Biên Phủ, Phường Thạnh Mỹ Tây, Thành phố Hồ Chí Minh",
    heroTitle: "Văn Phòng Cho Thuê N1 Điện Biên Phủ, Bình Thạnh (cũ)",
    heroDescription:
      "Chi nhánh thứ ba của MAX OFFICE tại khu vực Bình Thạnh (cũ) — văn phòng ảo 3 gói riêng biệt từ 379.000đ/tháng, cao ốc văn phòng mặt tiền ngay trục Điện Biên Phủ đoạn Bình Thạnh.",
    metaTitle: "Văn Phòng Ảo N1 Điện Biên Phủ, Bình Thạnh (cũ) | Từ 379K/Tháng",
    metaDescription:
      "Thuê văn phòng ảo tại N1 Điện Biên Phủ, Phường Thạnh Mỹ Tây (Bình Thạnh cũ) — 3 gói SILVER/GOLD/PREMIUM từ 379.000đ/tháng (chưa VAT). Lưu ý: khác hoàn toàn chi nhánh Điện Biên Phủ tại Quận 1 (cũ).",
    image: "/images/hero-dich-vu.png",
    // Ảnh mặt tiền gốc 1086x1448, không chỉnh sửa.
    facadeAspectRatio: "1086 / 1448",
    facadeImageSide: "right",
    interiorImages: [
      { src: "/images/dia-diem-n1-dien-bien-phu-le-tan.jpg", alt: "Sảnh lễ tân & tiếp khách văn phòng N1 Điện Biên Phủ", caption: "Sảnh lễ tân & tiếp khách" },
      { src: "/images/dia-diem-n1-dien-bien-phu-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng N1 Điện Biên Phủ", caption: "Bảng tên công ty tại toà nhà" },
      { src: "/images/dia-diem-n1-dien-bien-phu-san-trong.jpg", alt: "Không gian trống văn phòng N1 Điện Biên Phủ", caption: "Không gian trống" },
    ],
    intro: [
      "Văn phòng N1 Điện Biên Phủ là chi nhánh thứ ba MAX OFFICE mở tại khu vực Bình Thạnh (cũ), toạ lạc tại Phường Thạnh Mỹ Tây, ngay trên trục đường Điện Biên Phủ. Lưu ý quan trọng: đây là chi nhánh hoàn toàn khác với chi nhánh 95 Điện Biên Phủ thuộc Phường Tân Định, Quận 1 (cũ) — hai địa chỉ chỉ trùng tên đường, khách hàng cần kiểm tra kỹ địa chỉ đầy đủ trước khi đặt lịch tham quan.",
      "Khác với 161 Ung Văn Khiêm và 23 Tân Cảng nằm trên các con đường nhánh riêng, N1 Điện Biên Phủ có lợi thế mặt tiền trực tiếp trên trục đường lớn, nhiều làn xe — dễ tìm và dễ nhận diện hơn khi đối tác lần đầu ghé thăm. Toà nhà là một cao ốc văn phòng nhiều tầng, sảnh lễ tân có khu vực tiếp khách riêng, hiện đã có nhiều doanh nghiệp thuộc các lĩnh vực khác nhau đặt trụ sở lâu dài.",
      "Chi nhánh áp dụng đúng bảng giá văn phòng ảo dùng chung của khu vực Bình Thạnh — 3 gói SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng), giá chưa bao gồm VAT 10% — cùng cấu trúc tính năng như 2 chi nhánh Bình Thạnh còn lại, giúp khách hàng dễ dàng so sánh và chọn vị trí phù hợp nhất trong cùng khu vực.",
      "Nhờ mặt tiền ngay trục Điện Biên Phủ, từ chi nhánh có thể di chuyển nhanh về trung tâm Quận 1, Quận 3 hoặc qua giao lộ Hàng Xanh sang các hướng khác của thành phố. Đây là lựa chọn phù hợp cho doanh nghiệp cần một địa chỉ đăng ký kinh doanh dễ tra cứu, mặt tiền rõ ràng, không phải chỉ dẫn qua đường nhánh hay hẻm nhỏ.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng N1 Điện Biên Phủ",
    benefits: [
      { icon: BuildingIcon, title: "Chi nhánh thứ ba tại Bình Thạnh", desc: "Mở rộng thêm lựa chọn vị trí trong khu vực Bình Thạnh (cũ)." },
      { icon: MapPinIcon, title: "Mặt tiền trục Điện Biên Phủ", desc: "Nằm trực tiếp trên trục đường lớn, dễ tìm hơn các chi nhánh trên đường nhánh." },
      { icon: BadgePercentIcon, title: "3 gói giá linh hoạt", desc: "SILVER, GOLD, PREMIUM — từ 379.000đ/tháng, dùng chung bảng giá khu vực Bình Thạnh." },
      { icon: HeartHandshakeIcon, title: "Toà nhà nhiều doanh nghiệp thuê", desc: "Cao ốc văn phòng có nhiều công ty đặt trụ sở lâu dài." },
      { icon: UsersIcon, title: "Không gian sàn rộng rãi", desc: "Có khu vực sàn trống thoáng đãng, phù hợp bố trí văn phòng theo nhu cầu." },
      { icon: ClockIcon, title: "Gần 2 chi nhánh Bình Thạnh khác", desc: "Thuận tiện tham khảo thêm 161 Ung Văn Khiêm hoặc 23 Tân Cảng cùng khu vực." },
    ],
    promotions: [
      "Ký hợp đồng 12 tháng: tặng 2 tháng miễn phí",
      "Ký hợp đồng 24 tháng: tặng 6 tháng miễn phí",
    ],
    nearbyItems: [
      { name: "Trục Điện Biên Phủ (đoạn Bình Thạnh)", desc: "Mặt tiền đường lớn, khác hẳn đoạn Điện Biên Phủ tại Quận 1 hay Quận 10 (cũ)." },
      { name: "Giao lộ Hàng Xanh", desc: "Cách không xa, thuận tiện kết nối sang khu vực trung tâm và các trục đường lớn khác." },
      { name: "Chi nhánh 23 Tân Cảng", desc: "Chi nhánh MAX OFFICE khác trong cùng khu vực Bình Thạnh (cũ), gần ga Metro Tân Cảng." },
      { name: "Khu dân cư Phường Thạnh Mỹ Tây", desc: "Khu vực dân cư và văn phòng xen kẽ, tiện ích sinh hoạt đầy đủ xung quanh." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt chạy dọc trục Điện Biên Phủ đoạn qua Bình Thạnh." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Mặt tiền đường lớn nên dễ dàng bắt xe hoặc tìm điểm đón vào mọi khung giờ." },
      { icon: CheckCircleIcon, title: "Kết nối nhanh về Quận 1, Quận 3", desc: "Trục Điện Biên Phủ là tuyến huyết mạch nối thẳng về trung tâm thành phố." },
      { icon: HeadsetIcon, title: "Lễ tân hỗ trợ phân biệt địa chỉ", desc: "Đội ngũ tại chi nhánh lưu ý hướng dẫn khách để tránh nhầm với chi nhánh Điện Biên Phủ Quận 1." },
    ],
    parkingInfo: [
      "Toà nhà có khu vực để xe máy riêng cho khách đến làm việc mỗi ngày.",
      "Mặt tiền đường lớn nên có thể tấp xe tạm thời khi cần đón đối tác trong thời gian ngắn.",
      "Bảo vệ toà nhà trực thường xuyên, hỗ trợ an ninh khu vực để xe.",
    ],
    diningItems: [
      { name: "Quán ăn dọc Điện Biên Phủ đoạn Bình Thạnh", desc: "Nhiều lựa chọn quán ăn trưa gần toà nhà, phục vụ nhanh cho dân văn phòng." },
      { name: "Cà phê khu vực Thạnh Mỹ Tây", desc: "Không gian phù hợp trao đổi công việc hoặc gặp gỡ khách hàng ngắn hạn." },
      { name: "Nhà hàng gần giao lộ Hàng Xanh", desc: "Lựa chọn phù hợp cho bữa tiếp đối tác cần không gian trang trọng hơn." },
    ],
    faqs: [
      { q: "Chi nhánh N1 Điện Biên Phủ có phải cùng địa chỉ với chi nhánh Điện Biên Phủ, Quận 1 không?", a: "Không. Đây là hai chi nhánh hoàn toàn khác nhau: N1 Điện Biên Phủ thuộc Phường Thạnh Mỹ Tây, khu vực Bình Thạnh (cũ); còn chi nhánh 95 Điện Biên Phủ thuộc Phường Tân Định, Quận 1 (cũ). Hai địa chỉ chỉ trùng tên đường, khách hàng cần kiểm tra kỹ địa chỉ đầy đủ khi đặt lịch tham quan." },
      { q: "Chi nhánh N1 Điện Biên Phủ áp dụng bảng giá văn phòng ảo nào?", a: "Chi nhánh dùng chung bảng giá với 161 Ung Văn Khiêm và 23 Tân Cảng trong khu vực Bình Thạnh, gồm 3 gói: SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng) — giá chưa bao gồm VAT 10%." },
      { q: "Địa chỉ N1 Điện Biên Phủ có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Thạnh Mỹ Tây, đủ điều kiện đăng ký kinh doanh và đăng ký thuế cho công ty TNHH, công ty cổ phần lẫn hộ kinh doanh cá thể." },
      { q: "Nên chọn chi nhánh nào trong 3 chi nhánh Bình Thạnh — N1 Điện Biên Phủ, 161 Ung Văn Khiêm hay 23 Tân Cảng?", a: "Nếu ưu tiên mặt tiền đường lớn, dễ tìm ngay trên trục Điện Biên Phủ, chọn N1 Điện Biên Phủ. Nếu ưu tiên gần giao lộ Hàng Xanh, tham khảo 161 Ung Văn Khiêm. Nếu ưu tiên gần ga Metro và khu Landmark 81, chọn 23 Tân Cảng — cả 3 đều dùng chung một bảng giá nên bạn có thể chọn theo vị trí thuận tiện nhất." },
      { q: "Nếu cần đổi địa chỉ giấy phép kinh doanh hoặc khắc dấu công ty sau khi ký hợp đồng thì tính phí thế nào?", a: "Có. Ngoài phí gói văn phòng ảo hàng tháng, chi nhánh còn 2 dịch vụ tính riêng khi phát sinh: đổi địa chỉ trên giấy phép kinh doanh, giá 1.296.000đ đã bao gồm VAT; và khắc con dấu tròn công ty, dấu chi nhánh hoặc dấu văn phòng đại diện, giá 480.000đ mỗi con dấu." },
      { q: "Ký hợp đồng dài hạn tại N1 Điện Biên Phủ có được khuyến mãi gì không?", a: "Có. Ký hợp đồng 12 tháng được tặng 2 tháng sử dụng miễn phí; ký hợp đồng 24 tháng được tặng 6 tháng sử dụng miễn phí — áp dụng cho mọi gói văn phòng ảo tại chi nhánh này." },
      { q: "Làm sao để chắc chắn không đi nhầm sang chi nhánh Điện Biên Phủ Quận 1 khi đến tham quan?", a: "Khi để lại thông tin qua form trên trang này hoặc gọi hotline 089 8082 188, bạn nên ghi rõ 'N1 Điện Biên Phủ, Bình Thạnh' — đội ngũ MAX OFFICE sẽ xác nhận lại địa chỉ Phường Thạnh Mỹ Tây và hướng dẫn cụ thể trước khi sắp xếp lịch tham quan." },
    ],
    testimonials: [
      { quote: "Lúc đầu mình gõ 'Điện Biên Phủ' lên Google Maps thì ra tận Quận 1, phải gọi hotline hỏi lại mới biết chi nhánh này ở Bình Thạnh.", initial: "D", name: "Anh Duy", role: "Giám đốc công ty công nghệ" },
      { quote: "Toà nhà mặt tiền lớn nên rất dễ tìm, đối tác của mình không bị lạc như một số văn phòng trong hẻm mình từng thuê trước đây.", initial: "M", name: "Chị Minh", role: "Trưởng phòng kinh doanh" },
    ],
  },

  /* =============== 27C QUỐC HƯƠNG (CHI NHÁNH THỨ 2 KHU VỰC THỦ ĐỨC) =============== */
  "quoc-huong": {
    slug: "quoc-huong",
    name: "27C Quốc Hương, TP. Thủ Đức (cũ)",
    area: AREA_THU_DUC,
    address: "27C Quốc Hương, Phường An Khánh, Thành phố Hồ Chí Minh",
    heroTitle: "Văn Phòng Cho Thuê 27C Quốc Hương, TP. Thủ Đức (cũ)",
    heroDescription:
      "Chi nhánh thứ hai của MAX OFFICE tại khu vực Thủ Đức (cũ) — văn phòng ảo 3 gói riêng biệt từ 379.000đ/tháng, toạ lạc tại Bảo Thiện Building ngay khu Thảo Điền.",
    metaTitle: "Văn Phòng Ảo 27C Quốc Hương, TP. Thủ Đức (cũ) | Từ 379K/Tháng",
    metaDescription:
      "Thuê văn phòng ảo tại 27C Quốc Hương, Phường An Khánh (TP. Thủ Đức cũ) — 3 gói SILVER/GOLD/PREMIUM từ 379.000đ/tháng (chưa VAT), khu vực Thảo Điền sầm uất, gần cầu Sài Gòn.",
    image: "/images/anh-hero-moi.jpg",
    // Ảnh mặt tiền gốc 1086x1448, không chỉnh sửa.
    facadeAspectRatio: "1086 / 1448",
    facadeImageSide: "left",
    interiorImages: [
      { src: "/images/dia-diem-quoc-huong-le-tan.jpg", alt: "Sảnh lễ tân & tiếp khách văn phòng 27C Quốc Hương", caption: "Sảnh lễ tân & tiếp khách" },
      { src: "/images/dia-diem-quoc-huong-phong-hop.jpg", alt: "Phòng họp văn phòng 27C Quốc Hương", caption: "Phòng họp" },
      { src: "/images/dia-diem-quoc-huong-san-trong.jpg", alt: "Không gian trống văn phòng 27C Quốc Hương", caption: "Không gian trống" },
      { src: "/images/dia-diem-quoc-huong-tien-ich.jpg", alt: "Tiện ích toà nhà văn phòng 27C Quốc Hương", caption: "Tiện ích toà nhà" },
    ],
    intro: [
      "Văn phòng 27C Quốc Hương là chi nhánh thứ hai MAX OFFICE mở tại khu vực Thủ Đức (cũ), bên cạnh chi nhánh Phạm Văn Đồng đã hoạt động từ trước, toạ lạc tại Bảo Thiện Building, Phường An Khánh. Khu vực An Khánh vốn thuộc Quận 2 trước đây, nhưng đã chính thức sáp nhập vào TP. Thủ Đức từ năm 2021 — trước cả đợt sáp nhập phường toàn TP.HCM năm 2025 — nên về mặt địa giới lịch sử, đây vẫn thuộc khu vực Thủ Đức (cũ) trong hệ thống chi nhánh MAX OFFICE, không tách thành khu vực riêng.",
      "Bảo Thiện Building là một toà nhà kiến trúc tân cổ điển, mặt tiền màu trắng nổi bật với các chi tiết phào chỉ tinh xảo, sảnh lễ tân sang trọng với đèn chùm và sàn đá hoa văn. Toà nhà nằm ngay khu Thảo Điền — khu vực nổi tiếng sầm uất, tập trung nhiều chuyên gia nước ngoài, nhà hàng và quán cà phê phong cách quốc tế.",
      "Chi nhánh áp dụng bảng giá văn phòng ảo 3 gói SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng), giá chưa bao gồm VAT 10% — cùng bảng giá đang áp dụng tại các chi nhánh khu vực Bình Thạnh, phân hoá theo thời lượng sử dụng phòng họp, sảnh tiếp khách và các hỗ trợ pháp lý đi kèm.",
      "Nhờ vị trí gần cầu Sài Gòn, từ chi nhánh có thể di chuyển nhanh sang khu vực Bình Thạnh hoặc về trung tâm Quận 1. Đây là lựa chọn phù hợp cho doanh nghiệp hoạt động trong lĩnh vực có yếu tố nước ngoài, muốn có địa chỉ đăng ký kinh doanh tại khu vực quốc tế hoá, gần đối tác và khách hàng đến từ nhiều quốc gia.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng 27C Quốc Hương",
    benefits: [
      { icon: BuildingIcon, title: "Chi nhánh thứ hai tại Thủ Đức", desc: "Mở rộng thêm lựa chọn vị trí, bên cạnh chi nhánh Phạm Văn Đồng." },
      { icon: MapPinIcon, title: "Toạ lạc tại Bảo Thiện Building", desc: "Toà nhà kiến trúc tân cổ điển ngay khu Thảo Điền, Phường An Khánh." },
      { icon: BadgePercentIcon, title: "3 gói giá linh hoạt", desc: "SILVER, GOLD, PREMIUM — từ 379.000đ/tháng." },
      { icon: HeartHandshakeIcon, title: "Khu vực quốc tế, sầm uất", desc: "Thảo Điền tập trung nhiều chuyên gia nước ngoài và doanh nghiệp quốc tế." },
      { icon: UsersIcon, title: "Không gian sàn rộng rãi", desc: "Có khu vực sàn trống thoáng đãng, phù hợp bố trí văn phòng theo nhu cầu." },
      { icon: ClockIcon, title: "Gần cầu Sài Gòn", desc: "Kết nối nhanh sang khu vực Bình Thạnh và trung tâm Quận 1." },
    ],
    promotions: [
      "Ký hợp đồng 12 tháng: tặng 2 tháng miễn phí",
      "Ký hợp đồng 24 tháng: tặng 6 tháng miễn phí",
    ],
    nearbyItems: [
      { name: "Khu Thảo Điền", desc: "Khu vực sầm uất, nhiều nhà hàng, quán cà phê phong cách quốc tế." },
      { name: "Cầu Sài Gòn", desc: "Kết nối nhanh sang khu vực Bình Thạnh và trung tâm Quận 1." },
      { name: "Chi nhánh Phạm Văn Đồng", desc: "Chi nhánh MAX OFFICE khác trong cùng khu vực Thủ Đức (cũ), cách không xa." },
      { name: "Khu dân cư Phường An Khánh", desc: "Khu vực dân cư cao cấp, nhiều tiện ích sinh hoạt xung quanh." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Có tuyến xe buýt hoạt động qua khu vực An Khánh, Thảo Điền." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Khu vực đông dân cư quốc tế nên dễ dàng đặt xe vào mọi khung giờ." },
      { icon: CheckCircleIcon, title: "Trục Quốc Hương — Xa lộ Hà Nội", desc: "Kết nối nhanh về trung tâm Quận 1 và các khu vực lân cận." },
      { icon: HeadsetIcon, title: "Lễ tân hỗ trợ đón khách", desc: "Đội ngũ tại chi nhánh hỗ trợ chỉ dẫn tận tình cho khách lần đầu ghé thăm." },
    ],
    parkingInfo: [
      "Khu vực gửi xe máy nằm ngay trong khuôn viên toà nhà, phục vụ khách đến làm việc hằng ngày.",
      "Có thể tấp xe tạm thời trước toà nhà khi cần đón đối tác trong thời gian ngắn.",
      "Nhân viên bảo vệ túc trực tại sảnh, hỗ trợ trông xe cho khách trong giờ hành chính.",
    ],
    diningItems: [
      { name: "Nhà hàng khu Thảo Điền", desc: "Đa dạng phong cách ẩm thực quốc tế, phù hợp tiếp đối tác nước ngoài." },
      { name: "Cà phê khu vực An Khánh", desc: "Nhiều quán cà phê không gian hiện đại, thuận tiện gặp gỡ khách hàng." },
      { name: "Quán ăn dọc Quốc Hương", desc: "Lựa chọn quán ăn trưa nhanh gọn cho dân văn phòng." },
    ],
    faqs: [
      { q: "Chi nhánh 27C Quốc Hương có phải là chi nhánh thứ hai của MAX OFFICE tại khu vực Thủ Đức không?", a: "Đúng vậy. Bên cạnh chi nhánh Phạm Văn Đồng đã hoạt động từ trước, 27C Quốc Hương là chi nhánh thứ hai MAX OFFICE mở tại khu vực Thủ Đức (cũ), toạ lạc tại Phường An Khánh." },
      { q: "Vì sao 27C Quốc Hương thuộc khu vực Thủ Đức (cũ) mà không phải Quận 2 (cũ)?", a: "Vì Quận 2 (cũ) đã chính thức sáp nhập vào TP. Thủ Đức từ năm 2021 — trước cả đợt sáp nhập phường toàn TP.HCM năm 2025 — nên khu vực An Khánh về mặt địa giới lịch sử thuộc TP. Thủ Đức, không tách thành khu vực riêng trên hệ thống MAX OFFICE." },
      { q: "Chi nhánh 27C Quốc Hương áp dụng bảng giá văn phòng ảo nào?", a: "Chi nhánh áp dụng 3 gói: SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng) — giá chưa bao gồm VAT 10%, cùng bảng giá đang áp dụng tại các chi nhánh khu vực Bình Thạnh." },
      { q: "Địa chỉ 27C Quốc Hương có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường An Khánh, đủ điều kiện đăng ký kinh doanh và đăng ký thuế cho công ty TNHH, công ty cổ phần lẫn hộ kinh doanh cá thể." },
      { q: "Ngoài phí gói văn phòng ảo hàng tháng, chi nhánh còn khoản phí phát sinh nào khác không?", a: "Có 2 dịch vụ tính riêng khi phát sinh nhu cầu: đổi địa chỉ trên giấy phép kinh doanh giá 1.296.000đ (đã bao gồm VAT), và khắc con dấu tròn công ty, dấu chi nhánh hoặc dấu văn phòng đại diện giá 480.000đ mỗi con dấu." },
      { q: "Ký hợp đồng dài hạn tại 27C Quốc Hương có được khuyến mãi gì không?", a: "Có. Ký hợp đồng 12 tháng được tặng 2 tháng sử dụng miễn phí; ký hợp đồng 24 tháng được tặng 6 tháng sử dụng miễn phí — áp dụng cho mọi gói văn phòng ảo tại chi nhánh này." },
      { q: "Tôi có thể đến tham quan văn phòng 27C Quốc Hương trước khi ký hợp đồng không?", a: "Có. Bạn để lại thông tin qua form trên trang này hoặc gọi hotline 089 8082 188 để được sắp xếp lịch tham quan miễn phí, đội ngũ sẽ hướng dẫn cụ thể đường vào Bảo Thiện Building." },
    ],
    testimonials: [
      { quote: "Khu Thảo Điền có nhiều đối tác nước ngoài nên đặt văn phòng gần đây rất thuận tiện cho công ty mình.", initial: "V", name: "Chị Vy", role: "Giám đốc công ty xuất nhập khẩu" },
      { quote: "Toà nhà kiến trúc đẹp, sảnh lễ tân sang trọng, phù hợp tiếp đối tác quốc tế.", initial: "A", name: "Anh An", role: "Founder công ty tư vấn" },
    ],
  },

  /* =============== 89 PHAN ĐÌNH PHÙNG (KHU VỰC PHÚ NHUẬN MỚI) =============== */
  "phan-dinh-phung": {
    slug: "phan-dinh-phung",
    name: "89 Phan Đình Phùng, Phú Nhuận (cũ)",
    area: AREA_PHU_NHUAN,
    address: "89 Phan Đình Phùng, Phường Phú Nhuận, Thành phố Hồ Chí Minh",
    heroTitle: "Văn Phòng Cho Thuê 89 Phan Đình Phùng, Phú Nhuận (cũ)",
    heroDescription:
      "Chi nhánh đầu tiên của MAX OFFICE tại khu vực Phú Nhuận (cũ) — văn phòng ảo 3 gói riêng biệt từ 379.000đ/tháng, cao ốc văn phòng hiện đại ngay trục Phan Đình Phùng.",
    metaTitle: "Văn Phòng Ảo 89 Phan Đình Phùng, Phú Nhuận (cũ) | Từ 379K/Tháng",
    metaDescription:
      "Thuê văn phòng ảo tại 89 Phan Đình Phùng, Phường Phú Nhuận — chi nhánh đầu tiên MAX OFFICE tại khu vực này, 3 gói SILVER/GOLD/PREMIUM từ 379.000đ/tháng (chưa VAT), gần chợ Phú Nhuận.",
    image: "/images/hero-lien-he-2.png",
    // Ảnh mặt tiền gốc 1024x1536, không chỉnh sửa.
    facadeAspectRatio: "1024 / 1536",
    facadeImageSide: "right",
    interiorImages: [
      { src: "/images/dia-diem-phan-dinh-phung-le-tan.jpg", alt: "Quầy lễ tân văn phòng 89 Phan Đình Phùng", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-phan-dinh-phung-tiep-khach.jpg", alt: "Sảnh tiếp khách văn phòng 89 Phan Đình Phùng", caption: "Sảnh tiếp khách" },
      { src: "/images/dia-diem-phan-dinh-phung-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng 89 Phan Đình Phùng", caption: "Bảng tên công ty tại toà nhà" },
      { src: "/images/dia-diem-phan-dinh-phung-phong-hop.jpg", alt: "Phòng họp văn phòng 89 Phan Đình Phùng", caption: "Phòng họp" },
    ],
    intro: [
      "Văn phòng 89 Phan Đình Phùng là chi nhánh đầu tiên MAX OFFICE mở tại khu vực Phú Nhuận (cũ), toạ lạc tại Phường Phú Nhuận — khu vực trung tâm giáp ranh Quận 1, Quận 3, Bình Thạnh và Tân Bình. Sự xuất hiện của chi nhánh này mở rộng thêm một lựa chọn địa chỉ đăng ký kinh doanh cho doanh nghiệp muốn đặt trụ sở ở vị trí trung chuyển thuận tiện giữa nhiều khu vực trung tâm thành phố.",
      "Toà nhà nơi đặt chi nhánh là một cao ốc văn phòng nhiều tầng với mặt tiền kính hiện đại, sảnh lễ tân ốp đá sang trọng và khu vực tiếp khách riêng ngay lối vào. Bên trong toà nhà hiện đã có nhiều doanh nghiệp thuộc các lĩnh vực khác nhau đặt văn phòng, cho thấy đây là địa chỉ được nhiều công ty tin chọn để hoạt động lâu dài.",
      "Chi nhánh cung cấp 3 gói văn phòng ảo riêng biệt — SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng), giá chưa bao gồm VAT 10%, cùng bảng giá đang áp dụng tại các chi nhánh khu vực Bình Thạnh và Thủ Đức — phân hoá theo thời lượng sử dụng phòng họp, sảnh tiếp khách và các hỗ trợ pháp lý đi kèm.",
      "Với vị trí gần chợ Phú Nhuận và không xa sân bay Tân Sơn Nhất, doanh nghiệp đặt văn phòng tại 89 Phan Đình Phùng có thể di chuyển nhanh sang nhiều hướng của thành phố hoặc đón đối tác, khách hàng từ tỉnh khác và nước ngoài một cách thuận tiện. Đây là lựa chọn phù hợp cho các công ty thương mại, dịch vụ cần một địa chỉ đăng ký kinh doanh ở vị trí trung tâm mà không phải đặt văn phòng ngay khu lõi với chi phí cao hơn.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng 89 Phan Đình Phùng",
    benefits: [
      { icon: BuildingIcon, title: "Chi nhánh đầu tiên tại Phú Nhuận", desc: "Mở rộng hệ thống MAX OFFICE sang khu vực Phú Nhuận (cũ), cao ốc văn phòng hiện đại." },
      { icon: MapPinIcon, title: "Gần chợ Phú Nhuận", desc: "Vị trí trung tâm, dễ tìm, quen thuộc với người dân khu vực." },
      { icon: BadgePercentIcon, title: "3 gói giá linh hoạt", desc: "SILVER, GOLD, PREMIUM — từ 379.000đ/tháng." },
      { icon: HeartHandshakeIcon, title: "Giáp ranh nhiều quận trung tâm", desc: "Kết nối nhanh sang Quận 1, Quận 3, Bình Thạnh và Tân Bình." },
      { icon: UsersIcon, title: "Toà nhà nhiều doanh nghiệp thuê", desc: "Cao ốc văn phòng có nhiều công ty đặt trụ sở lâu dài." },
      { icon: ClockIcon, title: "Gần sân bay Tân Sơn Nhất", desc: "Thuận tiện đón đối tác, khách hàng từ tỉnh khác hoặc nước ngoài." },
    ],
    promotions: [
      "Ký hợp đồng 12 tháng: tặng 2 tháng miễn phí",
      "Ký hợp đồng 24 tháng: tặng 6 tháng miễn phí",
    ],
    nearbyItems: [
      { name: "Chợ Phú Nhuận", desc: "Khu chợ truyền thống sầm uất, trung tâm sinh hoạt của khu vực." },
      { name: "Cầu Kiệu", desc: "Kết nối nhanh sang Quận 1, Quận 3 qua kênh Nhiêu Lộc - Thị Nghè." },
      { name: "Sân bay Tân Sơn Nhất", desc: "Cách không xa, thuận tiện đón đối tác từ tỉnh khác hoặc nước ngoài." },
      { name: "Khu dân cư Phường Phú Nhuận", desc: "Khu vực dân cư lâu đời, nhiều tiện ích sinh hoạt xung quanh." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt hoạt động qua khu vực Phú Nhuận." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Vị trí trung tâm nên dễ dàng đặt xe vào mọi khung giờ." },
      { icon: CheckCircleIcon, title: "Trục Phan Đình Phùng — Cầu Kiệu", desc: "Kết nối nhanh về trung tâm Quận 1, Quận 3 và Bình Thạnh." },
      { icon: HeadsetIcon, title: "Lễ tân hỗ trợ đón khách", desc: "Nhân sự tại sảnh sẵn sàng hướng dẫn khách ngay khi vừa bước vào toà nhà." },
    ],
    parkingInfo: [
      "Toà nhà bố trí riêng khu vực gửi xe máy phục vụ khách đến làm việc mỗi ngày.",
      "Sảnh trước toà nhà có thể tấp xe trong ít phút khi tài xế đưa đón đối tác.",
      "Bảo vệ toà nhà hỗ trợ trông giữ xe trong suốt giờ làm việc.",
    ],
    diningItems: [
      { name: "Quán ăn khu chợ Phú Nhuận", desc: "Đa dạng lựa chọn ẩm thực phục vụ khu vực chợ truyền thống sầm uất." },
      { name: "Cà phê dọc Phan Đình Phùng", desc: "Nhiều quán cà phê phù hợp gặp gỡ đối tác hoặc làm việc ngoài giờ." },
      { name: "Nhà hàng khu vực Phú Nhuận", desc: "Đa dạng phong cách phục vụ, phù hợp cả bữa ăn nhanh lẫn buổi tiếp khách trang trọng." },
    ],
    faqs: [
      { q: "Chi nhánh 89 Phan Đình Phùng có phải là chi nhánh đầu tiên của MAX OFFICE tại Phú Nhuận không?", a: "Đúng vậy. Đây là chi nhánh đầu tiên MAX OFFICE mở tại khu vực Phú Nhuận (cũ), toạ lạc tại Phường Phú Nhuận, mở rộng thêm lựa chọn địa chỉ đăng ký kinh doanh cho doanh nghiệp ở khu vực trung tâm giáp nhiều quận." },
      { q: "Chi nhánh 89 Phan Đình Phùng áp dụng bảng giá văn phòng ảo nào?", a: "Chi nhánh áp dụng 3 gói: SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng) — giá chưa bao gồm VAT 10%, cùng bảng giá đang áp dụng tại các chi nhánh khu vực Bình Thạnh và Thủ Đức." },
      { q: "Địa chỉ 89 Phan Đình Phùng có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Phú Nhuận, đủ điều kiện đăng ký kinh doanh và đăng ký thuế cho công ty TNHH, công ty cổ phần lẫn hộ kinh doanh cá thể." },
      { q: "Chi nhánh có gần sân bay Tân Sơn Nhất không?", a: "Có. Chi nhánh nằm không xa sân bay Tân Sơn Nhất, thuận tiện cho doanh nghiệp cần đón đối tác hoặc khách hàng từ tỉnh khác, nước ngoài." },
      { q: "Sau khi ký hợp đồng, đổi địa chỉ giấy phép kinh doanh hoặc khắc dấu công ty tính phí ra sao?", a: "Đây là 2 khoản phát sinh tính riêng ngoài phí gói văn phòng ảo hàng tháng: đổi địa chỉ trên giấy phép kinh doanh giá 1.296.000đ (đã bao gồm VAT), và khắc con dấu tròn công ty, dấu chi nhánh hoặc dấu văn phòng đại diện giá 480.000đ mỗi con dấu." },
      { q: "Ký hợp đồng dài hạn tại 89 Phan Đình Phùng có được khuyến mãi gì không?", a: "Có. Ký hợp đồng 12 tháng được tặng 2 tháng sử dụng miễn phí; ký hợp đồng 24 tháng được tặng 6 tháng sử dụng miễn phí — áp dụng cho mọi gói văn phòng ảo tại chi nhánh này." },
      { q: "Tôi có thể đến tham quan văn phòng 89 Phan Đình Phùng trước khi ký hợp đồng không?", a: "Có. Bạn để lại thông tin qua form trên trang này hoặc gọi hotline 089 8082 188 để được sắp xếp lịch tham quan miễn phí trong thời gian sớm nhất." },
    ],
    testimonials: [
      { quote: "Văn phòng nằm ngay khu chợ Phú Nhuận nên khách hàng lớn tuổi của công ty mình cũng dễ tìm.", initial: "H", name: "Chị Hoa", role: "Chủ hộ kinh doanh" },
      { quote: "Gần sân bay nên đối tác nước ngoài ghé văn phòng khá thuận tiện, không mất nhiều thời gian di chuyển.", initial: "T", name: "Anh Tài", role: "Giám đốc công ty xuất nhập khẩu" },
    ],
  },

  /* =============== 84-86 NGUYỄN TRƯỜNG TỘ (KHU VỰC QUẬN 4 MỚI) =============== */
  "nguyen-truong-to": {
    slug: "nguyen-truong-to",
    name: "84-86 Nguyễn Trường Tộ, Quận 4 (cũ)",
    area: AREA_QUAN_4,
    address: "84-86 Nguyễn Trường Tộ, Phường Xóm Chiếu, Thành phố Hồ Chí Minh",
    heroTitle: "Văn Phòng Cho Thuê 84-86 Nguyễn Trường Tộ, Quận 4 (cũ)",
    heroDescription:
      "Chi nhánh đầu tiên của MAX OFFICE tại khu vực Quận 4 (cũ) — văn phòng ảo 3 gói riêng biệt từ 379.000đ/tháng, cao ốc văn phòng kính hiện đại chỉ cách trung tâm Quận 1 một nhịp cầu.",
    metaTitle: "Văn Phòng Ảo 84-86 Nguyễn Trường Tộ, Quận 4 (cũ) | Từ 379K/Tháng",
    metaDescription:
      "Thuê văn phòng ảo tại 84-86 Nguyễn Trường Tộ, Phường Xóm Chiếu — chi nhánh đầu tiên MAX OFFICE tại Quận 4 (cũ), 3 gói SILVER/GOLD/PREMIUM từ 379.000đ/tháng (chưa VAT), gần trung tâm Quận 1.",
    image: "/images/anh-hero-trang-chu-1.jpg",
    // Ảnh mặt tiền gốc 1023x1537, không chỉnh sửa.
    facadeAspectRatio: "1023 / 1537",
    facadeImageSide: "left",
    interiorImages: [
      { src: "/images/dia-diem-nguyen-truong-to-le-tan.jpg", alt: "Quầy lễ tân văn phòng 84-86 Nguyễn Trường Tộ", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-nguyen-truong-to-san-trong.jpg", alt: "Không gian trống văn phòng 84-86 Nguyễn Trường Tộ", caption: "Không gian trống" },
    ],
    intro: [
      "Văn phòng 84-86 Nguyễn Trường Tộ là chi nhánh đầu tiên MAX OFFICE mở tại khu vực Quận 4 (cũ), toạ lạc tại Phường Xóm Chiếu — khu vực chỉ cách trung tâm Quận 1 một nhịp cầu qua cầu Ông Lãnh hoặc cầu Calmette. Sự xuất hiện của chi nhánh này mở rộng thêm một lựa chọn địa chỉ đăng ký kinh doanh cho doanh nghiệp muốn đặt trụ sở sát trung tâm thành phố với chi phí hợp lý hơn.",
      "Toà nhà nơi đặt chi nhánh là một cao ốc văn phòng nhiều tầng với mặt tiền kính xanh hiện đại, sảnh lễ tân ốp đá cẩm thạch trang nhã ngay lối vào. Các tầng văn phòng có view thoáng đãng hướng ra khu vực trung tâm thành phố, phù hợp cho doanh nghiệp muốn có không gian làm việc rộng rãi, nhiều ánh sáng tự nhiên.",
      "Chi nhánh cung cấp 3 gói văn phòng ảo riêng biệt — SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng), giá chưa bao gồm VAT 10% — cùng bảng giá đang áp dụng tại các chi nhánh khu vực Bình Thạnh, Phú Nhuận và Thủ Đức, phân hoá theo thời lượng sử dụng phòng họp, sảnh tiếp khách và các hỗ trợ pháp lý đi kèm.",
      "Với vị trí gần phố ẩm thực Vĩnh Khánh và Bến Nhà Rồng, doanh nghiệp đặt văn phòng tại 84-86 Nguyễn Trường Tộ vừa thuận tiện làm việc vừa dễ dàng tiếp đối tác ngoài giờ hành chính. Đây là lựa chọn phù hợp cho các công ty thương mại, dịch vụ cần một địa chỉ đăng ký kinh doanh sát trung tâm mà không phải trả chi phí như đặt văn phòng ngay trong lõi Quận 1.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng 84-86 Nguyễn Trường Tộ",
    benefits: [
      { icon: BuildingIcon, title: "Chi nhánh đầu tiên tại Quận 4", desc: "Mở rộng hệ thống MAX OFFICE sang khu vực Quận 4 (cũ), cao ốc văn phòng kính hiện đại." },
      { icon: MapPinIcon, title: "Chỉ cách Quận 1 một nhịp cầu", desc: "Kết nối nhanh sang trung tâm Quận 1 qua cầu Ông Lãnh, cầu Calmette." },
      { icon: BadgePercentIcon, title: "3 gói giá linh hoạt", desc: "SILVER, GOLD, PREMIUM — từ 379.000đ/tháng." },
      { icon: HeartHandshakeIcon, title: "Gần phố ẩm thực Vĩnh Khánh", desc: "Thuận tiện tiếp đối tác, khách hàng ngoài giờ làm việc." },
      { icon: UsersIcon, title: "Tầm nhìn thoáng đãng", desc: "Sàn văn phòng tầng cao, view hướng trung tâm thành phố." },
      { icon: ClockIcon, title: "Gần Bến Nhà Rồng", desc: "Khu vực giàu giá trị lịch sử, không xa bờ sông Sài Gòn." },
    ],
    promotions: [
      "Ký hợp đồng 12 tháng: tặng 2 tháng miễn phí",
      "Ký hợp đồng 24 tháng: tặng 6 tháng miễn phí",
    ],
    nearbyItems: [
      { name: "Phố ẩm thực Vĩnh Khánh", desc: "Khu ẩm thực hải sản nổi tiếng, sầm uất về đêm." },
      { name: "Cầu Ông Lãnh", desc: "Kết nối nhanh sang trung tâm Quận 1." },
      { name: "Bến Nhà Rồng", desc: "Địa danh lịch sử ven sông Sài Gòn, không xa chi nhánh." },
      { name: "Khu dân cư Phường Xóm Chiếu", desc: "Khu dân cư gắn liền với sông nước, xen kẽ nhiều hàng quán và dịch vụ đời sống." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt hoạt động qua khu vực Quận 4." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Gần trung tâm nên dễ dàng đặt xe vào mọi khung giờ." },
      { icon: CheckCircleIcon, title: "Trục Nguyễn Trường Tộ — Cầu Ông Lãnh", desc: "Kết nối nhanh về trung tâm Quận 1 chỉ trong vài phút." },
      { icon: HeadsetIcon, title: "Lễ tân hỗ trợ đón khách", desc: "Đội ngũ tại sảnh sẵn sàng hướng dẫn khách ngay khi vừa đến." },
    ],
    parkingInfo: [
      "Khách gửi xe máy ngay tại tầng trệt toà nhà, thuận tiện khi đến làm việc mỗi ngày.",
      "Có thể dừng đỗ ngắn hạn trước toà nhà khi cần đưa đón đối tác.",
      "Bảo vệ toà nhà hỗ trợ trông giữ xe trong suốt giờ hành chính.",
    ],
    diningItems: [
      { name: "Phố ẩm thực Vĩnh Khánh", desc: "Khu ẩm thực hải sản nổi tiếng, nhiều lựa chọn buổi tối." },
      { name: "Quán ăn khu Xóm Chiếu", desc: "Đa dạng quán ăn trưa phục vụ nhanh cho dân văn phòng." },
      { name: "Nhà hàng khu vực Quận 4", desc: "Lựa chọn phù hợp cho các buổi tiếp đối tác cần không gian trang trọng hơn." },
    ],
    faqs: [
      { q: "Chi nhánh 84-86 Nguyễn Trường Tộ có phải là chi nhánh đầu tiên của MAX OFFICE tại Quận 4 không?", a: "Đúng vậy. Đây là chi nhánh đầu tiên MAX OFFICE mở tại khu vực Quận 4 (cũ), toạ lạc tại Phường Xóm Chiếu, chỉ cách trung tâm Quận 1 một nhịp cầu." },
      { q: "Chi nhánh 84-86 Nguyễn Trường Tộ áp dụng bảng giá văn phòng ảo nào?", a: "Chi nhánh áp dụng 3 gói: SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng) — giá chưa bao gồm VAT 10%, cùng bảng giá đang áp dụng tại các chi nhánh khu vực Bình Thạnh, Phú Nhuận và Thủ Đức." },
      { q: "Địa chỉ 84-86 Nguyễn Trường Tộ có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Xóm Chiếu, đủ điều kiện đăng ký kinh doanh và đăng ký thuế cho công ty TNHH, công ty cổ phần lẫn hộ kinh doanh cá thể." },
      { q: "Chi nhánh có gần trung tâm Quận 1 không?", a: "Có. Chi nhánh chỉ cách trung tâm Quận 1 một nhịp cầu qua cầu Ông Lãnh hoặc cầu Calmette, thuận tiện cho doanh nghiệp cần di chuyển thường xuyên vào khu trung tâm." },
      { q: "Đổi địa chỉ giấy phép kinh doanh hoặc khắc dấu công ty sau khi ký hợp đồng có tốn thêm phí không?", a: "Có. Đây là 2 dịch vụ tính riêng khi phát sinh, ngoài phí gói văn phòng ảo hàng tháng: đổi địa chỉ trên giấy phép kinh doanh giá 1.296.000đ (đã bao gồm VAT), và khắc con dấu tròn công ty, dấu chi nhánh hoặc dấu văn phòng đại diện giá 480.000đ mỗi con dấu." },
      { q: "Ký hợp đồng dài hạn tại 84-86 Nguyễn Trường Tộ có được khuyến mãi gì không?", a: "Có. Ký hợp đồng 12 tháng được tặng 2 tháng sử dụng miễn phí; ký hợp đồng 24 tháng được tặng 6 tháng sử dụng miễn phí — áp dụng cho mọi gói văn phòng ảo tại chi nhánh này." },
      { q: "Tôi có thể đến tham quan văn phòng 84-86 Nguyễn Trường Tộ trước khi ký hợp đồng không?", a: "Có. Hãy để lại thông tin qua form trên trang này hoặc gọi hotline 089 8082 188, đội ngũ MAX OFFICE sẽ liên hệ sắp xếp lịch tham quan miễn phí phù hợp với thời gian của bạn." },
    ],
    testimonials: [
      { quote: "Văn phòng chỉ cách Quận 1 một cây cầu nên đối tác của mình di chuyển qua lại rất nhanh.", initial: "K", name: "Anh Khoa", role: "Giám đốc công ty logistics" },
      { quote: "Tối đi ăn hải sản khu Vĩnh Khánh với đối tác xong quay lại văn phòng ký hợp đồng luôn, khá tiện.", initial: "L", name: "Chị Lan", role: "Chủ hộ kinh doanh" },
    ],
  },

  /* =============== 54-56 LÊ QUỐC HƯNG (KHU VỰC QUẬN 4, CHI NHÁNH THỨ 2) =============== */
  "le-quoc-hung": {
    slug: "le-quoc-hung",
    name: "54-56 Lê Quốc Hưng, Quận 4 (cũ)",
    area: AREA_QUAN_4,
    address: "54-56 Lê Quốc Hưng, Phường Xóm Chiếu, Thành phố Hồ Chí Minh",
    heroTitle: "Văn Phòng Cho Thuê 54-56 Lê Quốc Hưng, Quận 4 (cũ)",
    heroDescription:
      "Chi nhánh thứ 2 của MAX OFFICE tại khu vực Quận 4 (cũ) — văn phòng ảo 3 gói riêng biệt từ 379.000đ/tháng, đặt tại toà nhà văn phòng The Vintage 54 hiện đại, gần trục Nguyễn Tất Thành và cầu Tân Thuận.",
    metaTitle: "Văn Phòng Ảo 54-56 Lê Quốc Hưng, Quận 4 (cũ) | Từ 379K/Tháng",
    metaDescription:
      "Thuê văn phòng ảo tại 54-56 Lê Quốc Hưng, Phường Xóm Chiếu — chi nhánh thứ 2 MAX OFFICE tại Quận 4 (cũ), 3 gói SILVER/GOLD/PREMIUM từ 379.000đ/tháng (chưa VAT), gần cầu Tân Thuận và Quận 7.",
    image: "/images/hero.jpg",
    // Ảnh mặt tiền gốc 1448x1086, không chỉnh sửa.
    facadeAspectRatio: "1448 / 1086",
    facadeImageSide: "right",
    interiorImages: [
      { src: "/images/dia-diem-le-quoc-hung-le-tan.jpg", alt: "Quầy lễ tân văn phòng 54-56 Lê Quốc Hưng", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-le-quoc-hung-sanh-tiep-khach.jpg", alt: "Sảnh tiếp khách văn phòng 54-56 Lê Quốc Hưng", caption: "Sảnh tiếp khách" },
      { src: "/images/dia-diem-le-quoc-hung-san-trong.jpg", alt: "Không gian trống văn phòng 54-56 Lê Quốc Hưng", caption: "Không gian trống" },
    ],
    intro: [
      "Văn phòng 54-56 Lê Quốc Hưng là chi nhánh thứ 2 của MAX OFFICE tại khu vực Quận 4 (cũ), cùng thuộc Phường Xóm Chiếu với chi nhánh 84-86 Nguyễn Trường Tộ nhưng nằm trên một trục đường khác, gần phía cầu Tân Thuận và trục Nguyễn Tất Thành hướng về Quận 7. Sự xuất hiện của chi nhánh thứ 2 giúp doanh nghiệp tại khu vực Quận 4 có thêm lựa chọn địa chỉ đăng ký kinh doanh mà không phải phụ thuộc vào một địa điểm duy nhất.",
      "Chi nhánh đặt tại toà nhà văn phòng The Vintage 54 — công trình 2 tầng mặt tiền kính hiện đại, sảnh lễ tân ốp gỗ và đá kết hợp, tầng trệt là không gian sảnh trống thông thoáng với hệ cửa kính lớn đón nhiều ánh sáng tự nhiên. Khuôn viên có hàng cây xanh phía trước, tạo mặt tiền dễ nhận diện trên tuyến đường Lê Quốc Hưng.",
      "Chi nhánh cung cấp 3 gói văn phòng ảo riêng biệt — SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng), giá chưa bao gồm VAT 10% — cùng bảng giá đang áp dụng tại các chi nhánh khu vực Bình Thạnh, Phú Nhuận, Thủ Đức và chi nhánh Nguyễn Trường Tộ, phân hoá theo thời lượng sử dụng phòng họp, sảnh tiếp khách và các hỗ trợ pháp lý đi kèm.",
      "Với vị trí gần trục Nguyễn Tất Thành và cầu Tân Thuận, doanh nghiệp đặt văn phòng tại 54-56 Lê Quốc Hưng thuận tiện di chuyển sang khu vực Quận 7, Phú Mỹ Hưng lẫn vào trung tâm Quận 1. Đây là lựa chọn phù hợp cho các công ty thương mại, xuất nhập khẩu hoặc dịch vụ logistics cần một địa chỉ đăng ký kinh doanh gần khu vực cảng và tuyến giao thương Quận 4 — Quận 7.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng 54-56 Lê Quốc Hưng",
    benefits: [
      { icon: BuildingIcon, title: "Chi nhánh thứ 2 tại Quận 4", desc: "Thêm lựa chọn địa chỉ đăng ký kinh doanh tại khu vực Quận 4 (cũ), toà nhà The Vintage 54 hiện đại." },
      { icon: MapPinIcon, title: "Gần cầu Tân Thuận", desc: "Kết nối nhanh sang Quận 7, Phú Mỹ Hưng qua trục Nguyễn Tất Thành." },
      { icon: BadgePercentIcon, title: "3 gói giá linh hoạt", desc: "SILVER, GOLD, PREMIUM — từ 379.000đ/tháng." },
      { icon: ShieldCheckIcon, title: "Toà nhà văn phòng riêng biệt", desc: "The Vintage 54 — mặt tiền kính hiện đại, sảnh lễ tân và không gian làm việc thoáng đãng." },
      { icon: UsersIcon, title: "Không gian trệt rộng rãi", desc: "Tầng trệt sảnh trống nhiều cửa kính, phù hợp tiếp khách hoặc bố trí không gian làm việc chung." },
      { icon: ClockIcon, title: "Gần chợ Xóm Chiếu", desc: "Khu vực dân cư, thương mại lâu đời của Quận 4, thuận tiện sinh hoạt hàng ngày." },
    ],
    promotions: [
      "Ký hợp đồng 12 tháng: tặng 2 tháng miễn phí",
      "Ký hợp đồng 24 tháng: tặng 6 tháng miễn phí",
    ],
    nearbyItems: [
      { name: "Chợ Xóm Chiếu", desc: "Khu chợ truyền thống lâu đời của Quận 4, sầm uất hàng ngày." },
      { name: "Cầu Tân Thuận", desc: "Kết nối nhanh sang khu vực Quận 7, Phú Mỹ Hưng." },
      { name: "Trục Nguyễn Tất Thành", desc: "Tuyến đường chính chạy dọc Quận 4, kết nối khu vực cảng Sài Gòn." },
      { name: "Khu dân cư đường Lê Quốc Hưng", desc: "Tuyến đường nội bộ yên tĩnh hơn so với trục chính, xen kẽ nhà phố và văn phòng nhỏ." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt hoạt động qua khu vực Quận 4." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Gần trục Nguyễn Tất Thành nên dễ dàng đặt xe vào mọi khung giờ." },
      { icon: CheckCircleIcon, title: "Trục Nguyễn Tất Thành — Cầu Tân Thuận", desc: "Kết nối nhanh sang Quận 7 và trung tâm Quận 1 chỉ trong ít phút." },
      { icon: HeadsetIcon, title: "Lễ tân hỗ trợ đón khách", desc: "Đội ngũ tại sảnh sẵn sàng hướng dẫn khách ngay khi vừa đến." },
    ],
    parkingInfo: [
      "Khách gửi xe máy ngay tại khuôn viên toà nhà, thuận tiện khi đến làm việc mỗi ngày.",
      "Có thể dừng đỗ ngắn hạn trước toà nhà khi cần đưa đón đối tác.",
      "Bảo vệ toà nhà hỗ trợ trông giữ xe trong suốt giờ hành chính.",
    ],
    diningItems: [
      { name: "Chợ Xóm Chiếu", desc: "Khu ẩm thực đường phố quen thuộc, nhiều lựa chọn ăn trưa nhanh gọn." },
      { name: "Quán ăn khu Lê Quốc Hưng", desc: "Đa dạng quán ăn phục vụ dân văn phòng quanh khu vực." },
      { name: "Nhà hàng khu vực Quận 4", desc: "Lựa chọn phù hợp cho các buổi tiếp đối tác cần không gian trang trọng hơn." },
    ],
    faqs: [
      { q: "Chi nhánh 54-56 Lê Quốc Hưng có phải là chi nhánh thứ 2 của MAX OFFICE tại Quận 4 không?", a: "Đúng vậy. Đây là chi nhánh thứ 2 MAX OFFICE mở tại khu vực Quận 4 (cũ), sau chi nhánh 84-86 Nguyễn Trường Tộ — cả hai cùng thuộc Phường Xóm Chiếu." },
      { q: "Chi nhánh 54-56 Lê Quốc Hưng khác gì so với chi nhánh 84-86 Nguyễn Trường Tộ cũng ở Quận 4?", a: "Cả hai cùng thuộc Phường Xóm Chiếu nhưng nằm trên 2 trục đường khác nhau: Nguyễn Trường Tộ gần phía cầu Ông Lãnh, hướng về trung tâm Quận 1, còn Lê Quốc Hưng gần phía cầu Tân Thuận, hướng về Quận 7 và Phú Mỹ Hưng — bạn có thể chọn chi nhánh gần đối tác hoặc khách hàng của mình hơn." },
      { q: "Chi nhánh 54-56 Lê Quốc Hưng áp dụng bảng giá văn phòng ảo nào?", a: "Chi nhánh áp dụng 3 gói: SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng) — giá chưa bao gồm VAT 10%, cùng bảng giá đang áp dụng tại các chi nhánh khu vực Bình Thạnh, Phú Nhuận, Thủ Đức và chi nhánh Nguyễn Trường Tộ." },
      { q: "Địa chỉ 54-56 Lê Quốc Hưng có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Xóm Chiếu, đủ điều kiện đăng ký kinh doanh và đăng ký thuế cho công ty TNHH, công ty cổ phần lẫn hộ kinh doanh cá thể." },
      { q: "Sau khi ký hợp đồng, đổi địa chỉ giấy phép kinh doanh hoặc khắc dấu công ty tính phí ra sao?", a: "Đây là 2 khoản phát sinh tính riêng ngoài phí gói văn phòng ảo hàng tháng: đổi địa chỉ trên giấy phép kinh doanh giá 1.296.000đ (đã bao gồm VAT), và khắc con dấu tròn công ty, dấu chi nhánh hoặc dấu văn phòng đại diện giá 480.000đ mỗi con dấu." },
      { q: "Ký hợp đồng dài hạn tại 54-56 Lê Quốc Hưng có được khuyến mãi gì không?", a: "Có. Ký hợp đồng 12 tháng được tặng 2 tháng sử dụng miễn phí; ký hợp đồng 24 tháng được tặng 6 tháng sử dụng miễn phí — áp dụng cho mọi gói văn phòng ảo tại chi nhánh này." },
      { q: "Tôi có thể đến tham quan văn phòng 54-56 Lê Quốc Hưng trước khi ký hợp đồng không?", a: "Có. Hãy để lại thông tin qua form trên trang này hoặc gọi hotline 089 8082 188, đội ngũ MAX OFFICE sẽ liên hệ sắp xếp lịch tham quan miễn phí phù hợp với thời gian của bạn." },
    ],
    testimonials: [
      { quote: "Văn phòng gần cầu Tân Thuận nên mình chạy qua gặp đối tác bên Quận 7 rất nhanh, không mất nhiều thời gian.", initial: "M", name: "Anh Minh", role: "Giám đốc công ty xuất nhập khẩu" },
      { quote: "Toà nhà mới, sảnh tiếp khách sạch đẹp nên mình khá yên tâm khi mời đối tác đến làm việc.", initial: "N", name: "Chị Ngọc", role: "Chủ hộ kinh doanh" },
    ],
  },

  /* =============== 36 MẠC ĐĨNH CHI (KHU VỰC QUẬN 1, CHI NHÁNH THỨ 2) =============== */
  "mac-dinh-chi": {
    slug: "mac-dinh-chi",
    name: "36 Mạc Đĩnh Chi, Quận 1 (cũ)",
    area: AREA_QUAN_1,
    address: "36 Mạc Đĩnh Chi, Phường Tân Định, Thành phố Hồ Chí Minh",
    heroTitle: "Văn Phòng Cho Thuê 36 Mạc Đĩnh Chi, Quận 1 (cũ)",
    heroDescription:
      "Chi nhánh thứ 2 của MAX OFFICE tại Quận 1 (cũ) — văn phòng ảo 4 gói riêng biệt từ 379.000đ/tháng, đặt tại cao ốc văn phòng nhiều tầng trên trục Mạc Đĩnh Chi, gần Thảo Cầm Viên và khu vực nhiều lãnh sự quán.",
    metaTitle: "Văn Phòng Ảo 36 Mạc Đĩnh Chi, Quận 1 (cũ) | Từ 379K/Tháng",
    metaDescription:
      "Thuê văn phòng ảo tại 36 Mạc Đĩnh Chi, Phường Tân Định — chi nhánh thứ 2 MAX OFFICE tại Quận 1 (cũ), 4 gói SAVE/SILVER/GOLD/PREMIUM từ 379.000đ/tháng (chưa VAT), gần Thảo Cầm Viên Sài Gòn.",
    image: "/images/khong-gian-lam-viec.jpg",
    // Ảnh mặt tiền gốc 1145x1374, không chỉnh sửa.
    facadeAspectRatio: "1145 / 1374",
    facadeImageSide: "right",
    interiorImages: [
      { src: "/images/dia-diem-mac-dinh-chi-le-tan.jpg", alt: "Quầy lễ tân văn phòng 36 Mạc Đĩnh Chi", caption: "Quầy lễ tân" },
      { src: "/images/dia-diem-mac-dinh-chi-tiep-khach.jpg", alt: "Khu vực tiếp khách văn phòng 36 Mạc Đĩnh Chi", caption: "Khu vực tiếp khách" },
      { src: "/images/dia-diem-mac-dinh-chi-bang-ten.jpg", alt: "Bảng tên công ty tại toà nhà văn phòng 36 Mạc Đĩnh Chi", caption: "Bảng tên công ty tại toà nhà" },
    ],
    intro: [
      "Văn phòng 36 Mạc Đĩnh Chi là chi nhánh thứ 2 của MAX OFFICE tại khu vực Quận 1 (cũ), cùng thuộc Phường Tân Định với chi nhánh Điện Biên Phủ nhưng nằm trên một trục đường khác — gần Thảo Cầm Viên Sài Gòn và khu vực tập trung nhiều lãnh sự quán, văn phòng đại diện nước ngoài. Sự xuất hiện của chi nhánh thứ 2 giúp doanh nghiệp tại Quận 1 có thêm lựa chọn địa chỉ đăng ký kinh doanh mà không phải phụ thuộc vào một địa điểm duy nhất.",
      "Chi nhánh đặt tại một cao ốc văn phòng nhiều tầng, mặt tiền kính hiện đại với hệ lam che nắng màu cam đặc trưng, đã quy tụ sẵn nhiều công ty trong lĩnh vực truyền thông, thương mại và dịch vụ. Sảnh lễ tân ốp gỗ ấm áp, khu vực tiếp khách được thiết kế hiện đại, tạo không gian chuyên nghiệp ngay từ lối vào toà nhà.",
      "Chi nhánh cung cấp 4 gói văn phòng ảo riêng biệt — SAVE (379.000đ/tháng), SILVER (479.000đ/tháng), GOLD (639.000đ/tháng) và PREMIUM (990.000đ/tháng), giá chưa bao gồm VAT 10% — cùng bảng giá đang áp dụng tại 2 chi nhánh khu vực Quận 3 (cũ) là 60 Nguyễn Thông và 520 Cách Mạng Tháng 8, phân hoá theo thời lượng sử dụng phòng họp, sảnh tiếp khách và các hỗ trợ pháp lý đi kèm. Đây là hệ giá HOÀN TOÀN KHÁC với gói START/BASE (hệ LITE-RISE) đang áp dụng tại chi nhánh Điện Biên Phủ cùng khu vực Quận 1.",
      "Với vị trí gần Thảo Cầm Viên và khu vực nhiều lãnh sự quán, doanh nghiệp đặt văn phòng tại 36 Mạc Đĩnh Chi có lợi thế về hình ảnh khi làm việc với đối tác nước ngoài, đồng thời thuận tiện di chuyển vào trung tâm hành chính Quận 1. Đây là lựa chọn phù hợp cho các công ty tư vấn, thương mại quốc tế hoặc dịch vụ chuyên nghiệp cần một địa chỉ đăng ký kinh doanh tại khu vực trung tâm, gần các cơ quan đại diện nước ngoài.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng 36 Mạc Đĩnh Chi",
    benefits: [
      { icon: BuildingIcon, title: "Chi nhánh thứ 2 tại Quận 1", desc: "Thêm lựa chọn địa chỉ đăng ký kinh doanh tại Quận 1 (cũ), cao ốc văn phòng nhiều tầng hiện đại." },
      { icon: MapPinIcon, title: "Gần Thảo Cầm Viên", desc: "Khu vực xanh mát, gần nhiều lãnh sự quán và văn phòng đại diện nước ngoài." },
      { icon: BadgePercentIcon, title: "4 gói giá linh hoạt", desc: "SAVE, SILVER, GOLD, PREMIUM — từ 379.000đ/tháng." },
      { icon: ShieldCheckIcon, title: "Toà nhà nhiều công ty đang hoạt động", desc: "Cao ốc văn phòng đã quy tụ sẵn nhiều doanh nghiệp truyền thông, thương mại, dịch vụ." },
      { icon: UsersIcon, title: "Sảnh tiếp khách hiện đại", desc: "Không gian lễ tân, tiếp khách thiết kế chuyên nghiệp ngay từ lối vào." },
      { icon: ClockIcon, title: "Gần trung tâm hành chính Quận 1", desc: "Di chuyển nhanh vào khu trung tâm, thuận tiện giao dịch với đối tác." },
    ],
    promotions: [
      "Ký hợp đồng 12 tháng: tặng 2 tháng miễn phí",
      "Ký hợp đồng 24 tháng: tặng 6 tháng miễn phí",
    ],
    nearbyItems: [
      { name: "Thảo Cầm Viên Sài Gòn", desc: "Công viên, sở thú lâu đời của thành phố, không gian xanh mát gần chi nhánh." },
      { name: "Khu vực lãnh sự quán", desc: "Tập trung nhiều lãnh sự quán, văn phòng đại diện nước ngoài." },
      { name: "Dinh Độc Lập", desc: "Di tích lịch sử nổi tiếng, không xa khu vực Mạc Đĩnh Chi." },
      { name: "Trung tâm Quận 1", desc: "Chỉ vài phút di chuyển đến khu vực trung tâm hành chính, tài chính TP.HCM." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt trung tâm hoạt động qua khu vực Mạc Đĩnh Chi." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Mật độ xe cao tại khu trung tâm, thời gian chờ rất ngắn." },
      { icon: CheckCircleIcon, title: "Trục đường Mạc Đĩnh Chi", desc: "Kết nối nhanh đến trung tâm Quận 1 và khu vực Thảo Cầm Viên." },
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Lễ tân hướng dẫn tận tình cho khách lần đầu ghé khu vực, đảm bảo không lạc đường." },
    ],
    parkingInfo: [
      "Khu vực giữ xe máy ngay tại toà nhà, thuận tiện cho khách đến làm việc.",
      "Hỗ trợ thông tin bãi đỗ ô tô gần khu vực do mật độ giao thông trung tâm Quận 1.",
      "Bảo vệ trực gác thường xuyên, đảm bảo an ninh cho phương tiện ngay tại khu trung tâm Quận 1.",
    ],
    diningItems: [
      { name: "Quán cà phê khu Mạc Đĩnh Chi", desc: "Nhiều quán cà phê phong cách hiện đại, phù hợp tiếp khách hoặc làm việc ngoài giờ." },
      { name: "Nhà hàng trung tâm Quận 1", desc: "Đa dạng lựa chọn ẩm thực từ bình dân đến cao cấp." },
      { name: "Khu ẩm thực gần Thảo Cầm Viên", desc: "Thuận tiện cho bữa trưa nhanh hoặc gặp gỡ đối tác ngoài giờ hành chính." },
    ],
    faqs: [
      { q: "Chi nhánh 36 Mạc Đĩnh Chi có phải là chi nhánh thứ 2 của MAX OFFICE tại Quận 1 không?", a: "Đúng vậy. Đây là chi nhánh thứ 2 MAX OFFICE mở tại khu vực Quận 1 (cũ), sau chi nhánh Điện Biên Phủ — cả hai cùng thuộc Phường Tân Định." },
      { q: "Chi nhánh 36 Mạc Đĩnh Chi khác gì so với chi nhánh Điện Biên Phủ cũng ở Quận 1?", a: "Cả hai cùng thuộc Phường Tân Định nhưng nằm trên 2 trục đường khác nhau và áp dụng 2 bảng giá HOÀN TOÀN KHÁC NHAU: Điện Biên Phủ dùng gói START/BASE thuộc hệ LITE-RISE chung của MAX OFFICE, còn 36 Mạc Đĩnh Chi dùng 4 gói SAVE/SILVER/GOLD/PREMIUM riêng — cùng bảng giá đang áp dụng tại 2 chi nhánh khu vực Quận 3 (cũ)." },
      { q: "Chi nhánh 36 Mạc Đĩnh Chi áp dụng bảng giá văn phòng ảo nào?", a: "Chi nhánh áp dụng 4 gói: SAVE (379.000đ/tháng), SILVER (479.000đ/tháng), GOLD (639.000đ/tháng) và PREMIUM (990.000đ/tháng) — giá chưa bao gồm VAT 10%, cùng bảng giá đang áp dụng tại 60 Nguyễn Thông và 520 Cách Mạng Tháng 8 (Quận 3 cũ)." },
      { q: "Địa chỉ 36 Mạc Đĩnh Chi có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Tân Định, đủ điều kiện đăng ký kinh doanh và đăng ký thuế cho công ty TNHH, công ty cổ phần lẫn hộ kinh doanh cá thể." },
      { q: "Sau khi ký hợp đồng, đổi địa chỉ giấy phép kinh doanh hoặc khắc dấu công ty tính phí ra sao?", a: "Đây là 2 khoản phát sinh tính riêng ngoài phí gói văn phòng ảo hàng tháng: đổi địa chỉ trên giấy phép kinh doanh giá 1.296.000đ (đã bao gồm VAT), và khắc con dấu tròn công ty, dấu chi nhánh hoặc dấu văn phòng đại diện giá 480.000đ mỗi con dấu." },
      { q: "Ký hợp đồng dài hạn tại 36 Mạc Đĩnh Chi có được khuyến mãi gì không?", a: "Có. Ký hợp đồng 12 tháng được tặng 2 tháng sử dụng miễn phí; ký hợp đồng 24 tháng được tặng 6 tháng sử dụng miễn phí — áp dụng cho mọi gói văn phòng ảo tại chi nhánh này." },
      { q: "Tôi có thể đến tham quan văn phòng 36 Mạc Đĩnh Chi trước khi ký hợp đồng không?", a: "Có. Hãy để lại thông tin qua form trên trang này hoặc gọi hotline 089 8082 188, đội ngũ MAX OFFICE sẽ liên hệ sắp xếp lịch tham quan miễn phí phù hợp với thời gian của bạn." },
    ],
    testimonials: [
      { quote: "Toà nhà đã có nhiều công ty truyền thông, thương mại hoạt động sẵn nên khá yên tâm về mức độ chuyên nghiệp.", initial: "H", name: "Chị Hà", role: "Giám đốc công ty truyền thông" },
      { quote: "Gần Thảo Cầm Viên nên mỗi lần đối tác nước ngoài ghé thăm đều để lại ấn tượng tốt về khu vực.", initial: "P", name: "Anh Phúc", role: "Chủ doanh nghiệp thương mại quốc tế" },
    ],
  },

  /* =============== 28-34 PASTEUR (KHU VỰC QUẬN 1, CHI NHÁNH THỨ 3) =============== */
  "pasteur": {
    slug: "pasteur",
    name: "28-34 Pasteur, Quận 1 (cũ)",
    area: AREA_QUAN_1,
    address: "28-34 Pasteur, Phường Sài Gòn, Thành phố Hồ Chí Minh",
    heroTitle: "Văn Phòng Cho Thuê 28-34 Pasteur, Quận 1 (cũ)",
    heroDescription:
      "Chi nhánh thứ 3 của MAX OFFICE tại Quận 1 (cũ) — văn phòng ảo 4 gói riêng biệt từ 379.000đ/tháng, đặt tại toà nhà văn phòng trên trục Pasteur, gần chợ Bến Thành và phố đi bộ Nguyễn Huệ.",
    metaTitle: "Văn Phòng Ảo 28-34 Pasteur, Quận 1 (cũ) | Từ 379K/Tháng",
    metaDescription:
      "Thuê văn phòng ảo tại 28-34 Pasteur, Phường Sài Gòn — chi nhánh thứ 3 MAX OFFICE tại Quận 1 (cũ), 4 gói SAVE/SILVER/GOLD/PREMIUM từ 379.000đ/tháng (chưa VAT), gần chợ Bến Thành.",
    image: "/images/hero-dia-diem.jpg",
    // Ảnh mặt tiền gốc 1024x1536, không chỉnh sửa.
    facadeAspectRatio: "1024 / 1536",
    facadeImageSide: "left",
    interiorImages: [
      { src: "/images/dia-diem-pasteur-le-tan-sanh-tiep-khach.jpg", alt: "Sảnh lễ tân và tiếp khách văn phòng 28-34 Pasteur", caption: "Sảnh lễ tân & tiếp khách" },
      { src: "/images/dia-diem-pasteur-ban-hop.jpg", alt: "Phòng họp văn phòng 28-34 Pasteur", caption: "Phòng họp" },
      { src: "/images/dia-diem-pasteur-san-trong.jpg", alt: "Không gian trống văn phòng 28-34 Pasteur", caption: "Không gian trống" },
      { src: "/images/dia-diem-pasteur-wc.jpg", alt: "Tiện ích toà nhà văn phòng 28-34 Pasteur", caption: "Tiện ích toà nhà" },
    ],
    intro: [
      "Văn phòng 28-34 Pasteur là chi nhánh thứ 3 của MAX OFFICE tại khu vực Quận 1 (cũ), thuộc Phường Sài Gòn — khác phường với 2 chi nhánh Điện Biên Phủ và 36 Mạc Đĩnh Chi (cùng thuộc Phường Tân Định). Đây là khu vực trung tâm nhất trong lõi trung tâm thành phố, gần chợ Bến Thành và phố đi bộ Nguyễn Huệ — biểu tượng thương mại, du lịch của Sài Gòn. Sự xuất hiện của chi nhánh thứ 3 giúp doanh nghiệp tại Quận 1 có thêm một lựa chọn địa chỉ đăng ký kinh doanh ngay sát khu lõi trung tâm.",
      "Chi nhánh đặt tại một toà nhà văn phòng nhiều tầng trên trục đường Pasteur, sảnh lễ tân và khu vực tiếp khách được thiết kế hiện đại với hệ đèn led âm trần, ghế sofa êm ái — tạo không gian đón khách chuyên nghiệp. Toà nhà có phòng họp riêng trang bị bảng trắng, máy lạnh, phù hợp các buổi trao đổi công việc quy mô nhỏ, cùng tầng văn phòng trống rộng rãi nhiều cửa kính đón ánh sáng tự nhiên.",
      "Chi nhánh cung cấp 4 gói văn phòng ảo riêng biệt — SAVE (379.000đ/tháng), SILVER (479.000đ/tháng), GOLD (639.000đ/tháng) và PREMIUM (990.000đ/tháng), giá chưa bao gồm VAT 10% — cùng bảng giá đang áp dụng tại 2 chi nhánh khu vực Quận 3 (cũ) và chi nhánh 36 Mạc Đĩnh Chi. Đây là hệ giá HOÀN TOÀN KHÁC với gói START/BASE (hệ LITE-RISE) đang áp dụng tại chi nhánh Điện Biên Phủ cùng khu vực Quận 1.",
      "Với vị trí gần chợ Bến Thành và phố đi bộ Nguyễn Huệ, doanh nghiệp đặt văn phòng tại 28-34 Pasteur vừa thuận tiện tiếp đối tác, khách hàng ngay tại khu trung tâm sầm uất nhất thành phố, vừa dễ dàng di chuyển đến các khu vực lân cận. Đây là lựa chọn phù hợp cho các công ty thương mại, dịch vụ, du lịch hoặc bán lẻ cần một địa chỉ đăng ký kinh doanh ngay tại lõi trung tâm Quận 1.",
    ],
    benefitsTitle: "Vì sao nên chọn văn phòng 28-34 Pasteur",
    benefits: [
      { icon: BuildingIcon, title: "Chi nhánh thứ 3 tại Quận 1", desc: "Thêm lựa chọn địa chỉ đăng ký kinh doanh ngay lõi trung tâm Quận 1 (cũ)." },
      { icon: MapPinIcon, title: "Gần chợ Bến Thành", desc: "Biểu tượng thương mại, du lịch của Sài Gòn, chỉ vài phút di chuyển." },
      { icon: BadgePercentIcon, title: "4 gói giá linh hoạt", desc: "SAVE, SILVER, GOLD, PREMIUM — từ 379.000đ/tháng." },
      { icon: UsersIcon, title: "Phòng họp riêng biệt", desc: "Trang bị bảng trắng, máy lạnh, phù hợp trao đổi công việc kín đáo." },
      { icon: ShieldCheckIcon, title: "Sảnh tiếp khách hiện đại", desc: "Không gian lễ tân, tiếp khách thiết kế chuyên nghiệp ngay lối vào." },
      { icon: ClockIcon, title: "Gần phố đi bộ Nguyễn Huệ", desc: "Thuận tiện tiếp đối tác, khách hàng tại khu trung tâm sầm uất nhất TP.HCM." },
    ],
    promotions: [
      "Ký hợp đồng 12 tháng: tặng 2 tháng miễn phí",
      "Ký hợp đồng 24 tháng: tặng 6 tháng miễn phí",
    ],
    nearbyItems: [
      { name: "Chợ Bến Thành", desc: "Biểu tượng thương mại, du lịch nổi tiếng của Sài Gòn." },
      { name: "Phố đi bộ Nguyễn Huệ", desc: "Không gian đi bộ sầm uất, nhiều sự kiện thương mại, giải trí." },
      { name: "Nhà hát Thành phố", desc: "Công trình kiến trúc lịch sử, không xa khu vực Pasteur." },
      { name: "Trung tâm thương mại Quận 1", desc: "Tập trung nhiều toà nhà văn phòng, trung tâm mua sắm lớn." },
    ],
    transportItems: [
      { icon: MapPinIcon, title: "Xe buýt nội thành", desc: "Nhiều tuyến xe buýt trung tâm hoạt động qua khu vực Pasteur." },
      { icon: ClockIcon, title: "Taxi & Grab", desc: "Mật độ xe cao tại khu trung tâm, thời gian chờ rất ngắn." },
      { icon: CheckCircleIcon, title: "Trục đường Pasteur", desc: "Kết nối nhanh đến chợ Bến Thành và phố đi bộ Nguyễn Huệ." },
      { icon: HeadsetIcon, title: "Hỗ trợ chỉ đường", desc: "Lễ tân hướng dẫn tận tình cho khách lần đầu ghé khu vực trung tâm." },
    ],
    parkingInfo: [
      "Toà nhà bố trí khu vực đậu xe máy riêng cho khách đến làm việc, không thu thêm phí gửi xe trong giờ hành chính.",
      "Với ô tô, do nằm ngay khu lõi trung tâm nên lễ tân sẽ hỗ trợ tư vấn các bãi giữ xe gần nhất khi khách cần.",
      "Camera an ninh và bảo vệ toà nhà trực suốt ngày, khách có thể yên tâm để xe trong lúc làm việc.",
    ],
    diningItems: [
      { name: "Ẩm thực chợ Bến Thành", desc: "Đa dạng món ăn đường phố, phù hợp bữa trưa nhanh gọn." },
      { name: "Nhà hàng khu Nguyễn Huệ", desc: "Nhiều lựa chọn từ bình dân đến cao cấp, phù hợp tiếp đối tác." },
      { name: "Quán cà phê khu Pasteur", desc: "Không gian hiện đại, phù hợp làm việc hoặc gặp gỡ khách hàng ngoài giờ." },
    ],
    faqs: [
      { q: "Chi nhánh 28-34 Pasteur có phải là chi nhánh thứ 3 của MAX OFFICE tại Quận 1 không?", a: "Đúng vậy. Đây là chi nhánh thứ 3 MAX OFFICE mở tại khu vực Quận 1 (cũ), sau chi nhánh Điện Biên Phủ và 36 Mạc Đĩnh Chi." },
      { q: "Chi nhánh 28-34 Pasteur khác gì so với 2 chi nhánh Điện Biên Phủ và 36 Mạc Đĩnh Chi cũng ở Quận 1?", a: "Cả 3 chi nhánh đều ở Quận 1 (cũ) nhưng khác phường và khác bảng giá: Điện Biên Phủ và 36 Mạc Đĩnh Chi cùng thuộc Phường Tân Định, còn 28-34 Pasteur thuộc Phường Sài Gòn. Về giá, Điện Biên Phủ dùng gói START/BASE thuộc hệ LITE-RISE chung, trong khi 36 Mạc Đĩnh Chi và 28-34 Pasteur cùng dùng 4 gói SAVE/SILVER/GOLD/PREMIUM — bảng giá riêng, giống hệt nhau giữa 2 chi nhánh này." },
      { q: "Chi nhánh 28-34 Pasteur áp dụng bảng giá văn phòng ảo nào?", a: "Chi nhánh áp dụng 4 gói: SAVE (379.000đ/tháng), SILVER (479.000đ/tháng), GOLD (639.000đ/tháng) và PREMIUM (990.000đ/tháng) — giá chưa bao gồm VAT 10%, cùng bảng giá đang áp dụng tại 60 Nguyễn Thông, 520 Cách Mạng Tháng 8 (Quận 3 cũ) và 36 Mạc Đĩnh Chi (Quận 1 cũ)." },
      { q: "Địa chỉ 28-34 Pasteur có hợp lệ để đăng ký kinh doanh không?", a: "Có. Đây là địa chỉ đầy đủ pháp lý tại Phường Sài Gòn, đủ điều kiện đăng ký kinh doanh và đăng ký thuế cho công ty TNHH, công ty cổ phần lẫn hộ kinh doanh cá thể." },
      { q: "Sau khi ký hợp đồng, đổi địa chỉ giấy phép kinh doanh hoặc khắc dấu công ty tính phí ra sao?", a: "Đây là 2 khoản phát sinh tính riêng ngoài phí gói văn phòng ảo hàng tháng: đổi địa chỉ trên giấy phép kinh doanh giá 1.296.000đ (đã bao gồm VAT), và khắc con dấu tròn công ty, dấu chi nhánh hoặc dấu văn phòng đại diện giá 480.000đ mỗi con dấu." },
      { q: "Ký hợp đồng dài hạn tại 28-34 Pasteur có được khuyến mãi gì không?", a: "Có. Ký hợp đồng 12 tháng được tặng 2 tháng sử dụng miễn phí; ký hợp đồng 24 tháng được tặng 6 tháng sử dụng miễn phí — áp dụng cho mọi gói văn phòng ảo tại chi nhánh này." },
      { q: "Tôi có thể đến tham quan văn phòng 28-34 Pasteur trước khi ký hợp đồng không?", a: "Có. Hãy để lại thông tin qua form trên trang này hoặc gọi hotline 089 8082 188, đội ngũ MAX OFFICE sẽ liên hệ sắp xếp lịch tham quan miễn phí phù hợp với thời gian của bạn." },
    ],
    testimonials: [
      { quote: "Văn phòng gần chợ Bến Thành nên đối tác nước ngoài của mình rất dễ tìm, lại tiện ghé phố đi bộ sau giờ làm.", initial: "T", name: "Chị Thu", role: "Giám đốc công ty du lịch" },
      { quote: "Phòng họp riêng khá kín đáo, phù hợp những buổi trao đổi cần sự tập trung với khách hàng.", initial: "D", name: "Anh Duy", role: "Chủ doanh nghiệp dịch vụ" },
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

/**
 * Bỏ hậu tố "(cũ)"/"(Cũ)" ở cuối tên khu vực khi dùng làm TIÊU ĐỀ NHÓM
 * (dropdown mega menu, /dia-diem) — tên riêng từng chi nhánh hiển thị
 * ngay bên dưới đã tự ghi rõ "(cũ)" trong tên (VD "36 Mạc Đĩnh Chi, Quận
 * 1 (cũ)"), lặp lại ở tiêu đề nhóm phía trên gây thừa 2 lần "(cũ)" liền
 * nhau. CHỈ đổi cách HIỂN THỊ ở nơi gọi hàm này — KHÔNG đổi field
 * `area.name`/`AreaInfo.name` gốc (vẫn dùng nguyên cho breadcrumb, meta
 * title, URL /dia-diem/[area-slug] — những chỗ đó có lý do SEO riêng,
 * không gọi hàm này).
 */
export function stripCuSuffix(name: string): string {
  return name.replace(/\s*\((?:cũ|Cũ)\)\s*$/, "").trim();
}

export type GroupedLocations = {
  /** Khu vực có từ 2 chi nhánh trở lên — hiển thị thành khối riêng, lưới 3
      cột. Khu vực đúng 2 chi nhánh có thể đã được GHÉP thêm 1 chi nhánh từ
      1 khu vực khác chỉ có đúng 1 chi nhánh (xem MERGED_AREA_PAIRS) để lấp
      đủ hàng — khi đó `subGroups` có 2 phần tử (khu vực 2 chi nhánh trước,
      khu vực 1 chi nhánh sau), mỗi phần tử nên hiển thị trong 1 khung nhẹ
      TÁCH BIỆT trong cùng hàng (không gộp chung 1 khối) để người xem phân
      biệt rõ 2 khu vực khác nhau; `area`/`locations` ở cấp ngoài vẫn có đủ
      (area là tên gộp, VD "Quận 4 (cũ) & Quận 7 (cũ)") cho nơi nào chưa
      cần tách khung. KHÔNG đổi khu vực địa lý gốc của từng chi nhánh (vẫn
      đọc từ `LOCATIONS_LIST`/`loc.area`), chỉ đổi cách TRÌNH BÀY. */
  multiBranchGroups: {
    area: { slug: string; name: string };
    locations: LocationListItem[];
    subGroups?: { area: { slug: string; name: string }; locations: LocationListItem[] }[];
  }[];
  /** Chi nhánh thuộc các khu vực chỉ có 1 chi nhánh VÀ chưa được ghép vào
      1 khu vực 2-chi-nhánh nào (xem MERGED_AREA_PAIRS) — gộp chung 1 danh
      sách, mỗi thẻ tự hiện area riêng qua `areaBadge`. */
  singleBranchLocations: LocationListItem[];
};

/**
 * Khu vực ĐÚNG 2 chi nhánh (`twoSlug`) được ghép chung 1 hàng hiển thị (đủ
 * 3 cột, tránh trống 1/3 cột) với 1 khu vực ĐÚNG 1 chi nhánh (`oneSlug`) —
 * ưu tiên ghép các khu vực gần nhau về địa lý thực tế. Đây chỉ là cách
 * TRÌNH BÀY (xem `GroupedLocations`), tên mỗi chi nhánh đã tự ghi rõ khu
 * vực (VD "27C Quốc Hương, TP. Thủ Đức (cũ)") nên không gây hiểu lầm dù
 * nằm chung hàng với khu vực khác. Một cặp chỉ thực sự được ghép khi ĐÚNG
 * lúc đó `twoSlug` có đúng 2 chi nhánh và `oneSlug` có đúng 1 — nếu số
 * chi nhánh 2 khu vực đó thay đổi (thêm/bớt chi nhánh), cặp tự động KHÔNG
 * ghép nữa (getGroupedLocations() rơi về hiển thị tách riêng như cũ),
 * không lỗi, nhưng nên rà soát lại danh sách cặp này khi đó.
 */
const MERGED_AREA_PAIRS: { twoSlug: string; oneSlug: string }[] = [
  { twoSlug: "quan-4-cu", oneSlug: "quan-7-cu" }, // Quận 4 - Quận 7: liền kề địa lý thật
  { twoSlug: "quan-3-cu", oneSlug: "phu-nhuan-cu" }, // Quận 3 - Phú Nhuận: liền kề địa lý thật
  { twoSlug: "quan-10-cu", oneSlug: "quan-tan-phu-cu" }, // Quận 10 - Tân Phú: gần qua trục Quận 11
  { twoSlug: "thu-duc-cu", oneSlug: "quan-go-vap-cu" }, // Thủ Đức - Gò Vấp: cặp còn lại duy nhất
];

/** Khu vực ưu tiên hiển thị lên đầu, theo đúng thứ tự — Quận 1 (cũ) trước
    tiên, kế đến Tân Bình (cũ). Khu vực không có trong danh sách này giữ
    nguyên thứ tự tương đối như khai báo trong `AREAS`. */
const AREA_DISPLAY_PRIORITY = ["quan-1-cu", "quan-tan-binh-cu"];

/**
 * Nhóm các chi nhánh ĐANG HIỂN THỊ CÔNG KHAI (26/27, 1 chi nhánh đang tạm
 * ẩn) theo khu vực, tách khu vực nhiều chi nhánh (khối riêng, có ghép cặp
 * 2+1 theo MERGED_AREA_PAIRS) và khu vực 1 chi nhánh còn lại chưa ghép
 * được (gộp chung) — dùng chung cho /dia-diem và mega menu để 2 nơi luôn
 * nhất quán, không cần sửa tay khi thêm chi nhánh/khu vực mới.
 */
export function getGroupedLocations(): GroupedLocations {
  const areaGroups = AREAS.map((area) => ({
    area,
    locations: getLocationsForArea(area.slug),
  })).filter((g) => g.locations.length > 0);
  const bySlug = new Map(areaGroups.map((g) => [g.area.slug, g]));
  const areaOrderIndex = new Map(AREAS.map((a, i) => [a.slug, i]));

  const consumedOneSlugs = new Set<string>();
  const consumedTwoSlugs = new Set<string>();
  type Group = {
    area: { slug: string; name: string };
    locations: LocationListItem[];
    subGroups?: { area: { slug: string; name: string }; locations: LocationListItem[] }[];
    sortSlug: string;
  };
  const merged: Group[] = [];
  for (const { twoSlug, oneSlug } of MERGED_AREA_PAIRS) {
    const twoGroup = bySlug.get(twoSlug);
    const oneGroup = bySlug.get(oneSlug);
    if (twoGroup?.locations.length !== 2 || oneGroup?.locations.length !== 1) continue;
    merged.push({
      area: { slug: `${twoSlug}+${oneSlug}`, name: `${twoGroup.area.name} & ${oneGroup.area.name}` },
      locations: [...twoGroup.locations, ...oneGroup.locations],
      // Khung nhẹ TÁCH BIỆT 2 khu vực trong cùng hàng — xem GroupedLocations.
      subGroups: [
        { area: { slug: twoGroup.area.slug, name: twoGroup.area.name }, locations: twoGroup.locations },
        { area: { slug: oneGroup.area.slug, name: oneGroup.area.name }, locations: oneGroup.locations },
      ],
      sortSlug: twoSlug,
    });
    consumedTwoSlugs.add(twoSlug);
    consumedOneSlugs.add(oneSlug);
  }

  const unmergedMulti: Group[] = areaGroups
    .filter((g) => g.locations.length >= 2 && !consumedTwoSlugs.has(g.area.slug))
    .map((g) => ({ area: g.area, locations: g.locations, sortSlug: g.area.slug }));

  const multiBranchGroups = [...unmergedMulti, ...merged].sort((a, b) => {
    const rank = (slug: string) => {
      const priority = AREA_DISPLAY_PRIORITY.indexOf(slug);
      return priority !== -1 ? priority - AREA_DISPLAY_PRIORITY.length : (areaOrderIndex.get(slug) ?? 0);
    };
    return rank(a.sortSlug) - rank(b.sortSlug);
  });

  return {
    multiBranchGroups: multiBranchGroups.map(({ area, locations, subGroups }) => ({ area, locations, subGroups })),
    singleBranchLocations: areaGroups
      .filter((g) => g.locations.length === 1 && !consumedOneSlugs.has(g.area.slug))
      .flatMap((g) => g.locations),
  };
}
