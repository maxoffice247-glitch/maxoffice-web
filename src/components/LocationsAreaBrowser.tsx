"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { RevealGroup } from "./Reveal";
import LocationCard from "./LocationCard";
import { SearchIcon, ArrowRightSmallIcon } from "./icons";
import type { LocationListItem, GroupedLocations } from "@/lib/locationsData";
import { CLUSTER_COLORS } from "@/lib/locationClusterColors";

/** Link "Xem tất cả chi nhánh khu vực này" đặt cạnh MỖI tiêu đề khu vực —
    trỏ tới đúng /dia-diem/{area-slug} (route theo khu vực ĐÃ có sẵn, xem
    AreaPageTemplate.tsx + getLocationsForArea() — chỉ thêm link cho DỄ TÌM/
    DỄ GỬI hơn, không phải route mới). Trước đây route này chỉ tình cờ lộ ra
    qua breadcrumb ở trang chi tiết chi nhánh, không có lối vào trực tiếp từ
    /dia-diem — nhân viên tư vấn muốn gửi link "khu vực X có chi nhánh nào"
    phải tự gõ URL bằng tay. */
function AreaLink({ slug, compact }: { slug: string; compact?: boolean }) {
  return (
    <Link
      href={`/dia-diem/${slug}`}
      className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold text-primary hover:gap-1.5"
    >
      {compact ? "Xem tất cả" : "Xem tất cả chi nhánh khu vực này"}
      <ArrowRightSmallIcon className="h-3 w-3 transition-transform duration-200" />
    </Link>
  );
}

type AreaGroup = {
  area: { slug: string; name: string };
  locations: LocationListItem[];
};

/**
 * Chuẩn hoá chuỗi tiếng Việt để so khớp tìm kiếm không phân biệt hoa/thường
 * và không phân biệt dấu — "Tân Định" và "tan dinh" phải khớp nhau. NFD tách
 * dấu thanh/dấu phụ ra khỏi ký tự gốc rồi xoá, riêng "đ" không tách được bằng
 * NFD (là 1 chữ cái riêng trong bảng mã, không phải "d" + dấu) nên xử lý tay.
 */
function normalizeVN(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function AreaBlock({ area, locations }: AreaGroup) {
  return (
    <div className="mb-10 rounded-3xl border border-primary/15 bg-primary-tint/40 p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[18px] font-bold text-navy sm:text-[20px]">{area.name}</h3>
        <div className="flex shrink-0 items-center gap-3">
          <AreaLink slug={area.slug} />
          <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11.5px] font-bold whitespace-nowrap text-primary">
            {locations.length} chi nhánh
          </span>
        </div>
      </div>
      <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((loc, i) => (
          <LocationCard key={loc.slug} loc={loc} index={i} />
        ))}
      </RevealGroup>
    </div>
  );
}

type SubGroup = { area: { slug: string; name: string }; locations: LocationListItem[]; colorIndex: number };

/**
 * Khu vực >2 chi nhánh (đứng riêng 1 hàng) HOẶC khu vực 2-chi-nhánh ghép
 * thêm 1 khu vực 1-chi-nhánh cho đủ hàng (MERGED_AREA_PAIRS, xem
 * locationsData.ts) — bố cục y hệt bản gốc trước khi có ô tìm kiếm/tô màu
 * (commit 0cbd8f4): khu vực ghép hiện 2 khung nhẹ TÁCH BIỆT trong cùng
 * hàng thay vì gộp phẳng vào 1 lưới. CHỈ THÊM 2 THỨ so với bản gốc: viền
 * (border-line → màu riêng) và chữ tiêu đề (text-navy → màu riêng) theo
 * `colorIndex` — viền/chữ CÙNG 1 tông (locationClusterColors.ts) nên
 * không lệch màu; 2 khu vực trong cùng hàng luôn có colorIndex liên tiếp
 * nên không bao giờ trùng màu. Badge số lượng, layout, cỡ chữ khác GIỮ
 * NGUYÊN như bản gốc, không đổi thêm gì khác.
 */
function MultiBranchGroup({
  area,
  locations,
  subGroups,
}: {
  area: { slug: string; name: string };
  locations: LocationListItem[];
  subGroups?: SubGroup[];
}) {
  return (
    <div className="mb-10 rounded-3xl border border-primary/15 bg-primary-tint/40 p-5 sm:p-7">
      {subGroups ? (
        <div className="flex flex-col gap-4 sm:flex-row">
          {subGroups.map((sub, subIndex) => {
            const color = CLUSTER_COLORS[sub.colorIndex % CLUSTER_COLORS.length];
            const startIndex = subGroups.slice(0, subIndex).reduce((n, s) => n + s.locations.length, 0);
            return (
              <div
                key={sub.area.slug}
                className={`min-w-0 rounded-2xl border bg-white/70 p-3.5 sm:p-4 ${color.border} ${
                  sub.locations.length >= 2 ? "sm:basis-2/3" : "sm:basis-1/3"
                }`}
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h4 className={`text-[13.5px] font-bold ${color.text}`}>{sub.area.name}</h4>
                  <div className="flex shrink-0 items-center gap-2">
                    <AreaLink slug={sub.area.slug} compact />
                    <span className="shrink-0 rounded-full bg-bg-tint px-2 py-0.5 text-[10.5px] font-bold whitespace-nowrap text-primary">
                      {sub.locations.length} chi nhánh
                    </span>
                  </div>
                </div>
                <RevealGroup className={`grid grid-cols-1 gap-3.5 ${sub.locations.length >= 2 ? "sm:grid-cols-2" : ""}`}>
                  {sub.locations.map((loc, i) => (
                    <LocationCard key={loc.slug} loc={loc} index={startIndex + i} />
                  ))}
                </RevealGroup>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[18px] font-bold text-navy sm:text-[20px]">{area.name}</h3>
            <div className="flex shrink-0 items-center gap-3">
              <AreaLink slug={area.slug} />
              <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11.5px] font-bold whitespace-nowrap text-primary">
                {locations.length} chi nhánh
              </span>
            </div>
          </div>
          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc, i) => (
              <LocationCard key={loc.slug} loc={loc} index={i} />
            ))}
          </RevealGroup>
        </>
      )}
    </div>
  );
}

/**
 * Ô tìm kiếm nhanh theo khu vực (quận cũ hoặc phường) + toàn bộ lưới chi
 * nhánh nhóm theo khu vực bên dưới — gộp chung 1 Client Component vì input
 * cần lọc trực tiếp danh sách hiển thị (state chia sẻ). Khối CTA "Tìm nhanh
 * VPA phù hợp" do Server Component (page.tsx) dựng nội dung sẵn, truyền
 * vào qua prop `cta` rồi đặt CHUNG 1 khung viền/nền với ô tìm kiếm — chỉ
 * phần lọc mới cần client-side.
 *
 * Khớp theo: tên khu vực (quận cũ, VD "Quận 1") → hiện TRỌN khu vực đó;
 * hoặc tên/địa chỉ chi nhánh (chứa tên phường, VD "P. Tân Định") → chỉ hiện
 * đúng (các) chi nhánh khớp. Rỗng → hiện đủ toàn bộ theo bố cục gộp hàng
 * gốc (multiBranchGroups + singleBranchLocations, xem locationsData.ts) —
 * lúc ĐANG tìm kiếm thì bỏ qua bố cục ghép hàng, hiện phẳng từng khu vực
 * khớp (số kết quả thường ít, ghép hàng không cần thiết và không ảnh
 * hưởng gì tới logic lọc).
 */
export default function LocationsAreaBrowser({
  areaGroups,
  multiBranchGroups,
  singleBranchLocations,
  cta,
}: {
  areaGroups: AreaGroup[];
  multiBranchGroups: GroupedLocations["multiBranchGroups"];
  singleBranchLocations: LocationListItem[];
  cta: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const isSearching = query.trim().length > 0;

  const { filteredGroups, totalMatches } = useMemo(() => {
    const nq = normalizeVN(query.trim());
    if (!nq) {
      return { filteredGroups: areaGroups, totalMatches: areaGroups.reduce((n, g) => n + g.locations.length, 0) };
    }
    const result = areaGroups
      .map((group) => {
        const areaMatches = normalizeVN(group.area.name).includes(nq);
        const locations = areaMatches
          ? group.locations
          : group.locations.filter(
              (loc) => normalizeVN(loc.name).includes(nq) || normalizeVN(loc.shortAddress).includes(nq)
            );
        return { area: group.area, locations };
      })
      .filter((g) => g.locations.length > 0);
    return { filteredGroups: result, totalMatches: result.reduce((n, g) => n + g.locations.length, 0) };
  }, [areaGroups, query]);

  return (
    <>
      {/* 1 khung chung: ô tìm kiếm (kiểu dáng đồng nhất với SearchOverlay.tsx
          ở header — viền bo tròn, icon kính lúp, viền chuyển primary khi
          focus) và khối CTA "Tìm nhanh VPA phù hợp" nằm CHUNG 1 hàng ngang
          từ lg: (≥1024px) trở lên — divider dọc mỏng phân cách 2 chức năng.
          Dưới lg: (mobile + tablet, ≤1023px) giữ xếp chồng dọc như cũ: đủ
          chỗ ngang để xếp ngang cả input lẫn icon+text+nút CTA chỉ có ở màn
          hình rộng ≥1024px trở lên — ép ngang sớm hơn sẽ làm 1 trong 2 phần
          bị bóp chật (nút CTA dễ vỡ dòng khi cột quá hẹp). */}
      <div className="mb-10 rounded-2xl border border-primary/20 bg-primary-tint/60 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-6">
          <div className="flex items-center gap-3 rounded-xl border border-line bg-white px-5 py-3.5 transition-colors duration-200 focus-within:border-primary lg:flex-1">
            <SearchIcon className="h-5 w-5 shrink-0 text-body-text" />
            <label htmlFor="dia-diem-search-input" className="sr-only">
              Tìm chi nhánh theo quận cũ hoặc phường
            </label>
            <input
              id="dia-diem-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo quận cũ hoặc phường (VD: Quận 1, Tân Định...)"
              className="w-full min-w-0 bg-transparent text-[14.5px] text-ink placeholder:text-body-text/60 focus:outline-none"
            />
          </div>
          {/* Divider: nằm ngang (full-width, cao 1px) khi 2 phần xếp chồng
              dọc; chuyển thành nằm dọc (cao hết hàng, rộng 1px) khi 2 phần
              xếp ngang từ lg: trở lên — cùng 1 phần tử, đổi hướng theo
              breakpoint để không phải render 2 divider ẩn/hiện riêng. */}
          <div className="my-4 h-px shrink-0 bg-primary/15 lg:my-0 lg:h-auto lg:w-px lg:self-stretch" />
          {cta}
        </div>
      </div>

      {isSearching ? (
        totalMatches === 0 ? (
          <div className="rounded-2xl border border-line bg-bg-tint p-6 text-center sm:p-8">
            <p className="mb-2 text-[15px] font-bold text-navy">
              Không tìm thấy khu vực hoặc phường nào khớp với &quot;{query.trim()}&quot;
            </p>
            <p className="mb-4 text-[13.5px] text-body-text">
              Thử lại với tên quận cũ (VD: Quận 1, Bình Thạnh) hoặc tên phường mới (VD: Tân Định, Xóm Chiếu), hoặc
              dùng công cụ tìm gói phù hợp để được gợi ý chi nhánh nhanh hơn.
            </p>
            <Link
              href="/tien-ich/tim-goi-phu-hop"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13.5px] font-bold text-white transition-colors duration-200 hover:bg-primary-dark"
            >
              Tìm nhanh VPA phù hợp
            </Link>
          </div>
        ) : (
          filteredGroups.map((group) => <AreaBlock key={group.area.slug} area={group.area} locations={group.locations} />)
        )
      ) : (
        <>
          {multiBranchGroups.map((group) => (
            <MultiBranchGroup key={group.area.slug} area={group.area} locations={group.locations} subGroups={group.subGroups} />
          ))}
          {singleBranchLocations.length > 0 && (
            <div>
              <h3 className="mb-5 text-[18px] font-bold text-navy sm:text-[20px]">Các chi nhánh khu vực khác</h3>
              <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {singleBranchLocations.map((loc, i) => (
                  <LocationCard key={loc.slug} loc={loc} index={i} areaBadge={loc.area.name} />
                ))}
              </RevealGroup>
            </div>
          )}
        </>
      )}
    </>
  );
}
