"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { RevealGroup } from "./Reveal";
import LocationCard from "./LocationCard";
import { SearchIcon } from "./icons";
import { stripCuSuffix, type LocationListItem } from "@/lib/locationsData";

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

/**
 * Ô tìm kiếm nhanh theo khu vực (quận cũ hoặc phường) + toàn bộ lưới chi
 * nhánh nhóm theo khu vực bên dưới — gộp chung 1 Client Component vì input
 * cần lọc trực tiếp danh sách hiển thị (state chia sẻ), nhưng khối CTA
 * "Tìm nhanh VPA phù hợp" nằm CHEN GIỮA input và lưới kết quả vẫn do
 * Server Component (page.tsx) dựng sẵn và truyền vào qua prop `cta` — không
 * cần client-side gì nên không phải chuyển thành Client Component.
 *
 * Khớp theo: tên khu vực (quận cũ, VD "Quận 1") → hiện TRỌN khu vực đó;
 * hoặc tên/địa chỉ chi nhánh (chứa tên phường, VD "P. Tân Định") → chỉ hiện
 * đúng (các) chi nhánh khớp. Rỗng → hiện đủ toàn bộ như cũ.
 */
export default function LocationsAreaBrowser({
  areaGroups,
  cta,
}: {
  areaGroups: AreaGroup[];
  cta: ReactNode;
}) {
  const [query, setQuery] = useState("");

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
      {/* Kiểu dáng đồng nhất với ô tìm kiếm ở header (SearchOverlay.tsx) —
          viền bo tròn, icon kính lúp bên trái, viền chuyển màu primary khi
          focus. Lọc trực tiếp (onChange), không cần nút submit. */}
      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-3.5 transition-colors duration-200 focus-within:border-primary">
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

      {cta}

      {totalMatches === 0 ? (
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
        filteredGroups.map((group) => (
          <div key={group.area.slug} className="mb-10 rounded-3xl border border-primary/15 bg-primary-tint/40 p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-[18px] font-bold text-navy sm:text-[20px]">{stripCuSuffix(group.area.name)}</h3>
              <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11.5px] font-bold whitespace-nowrap text-primary">
                {group.locations.length} chi nhánh
              </span>
            </div>
            <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.locations.map((loc, i) => (
                <LocationCard key={loc.slug} loc={loc} index={i} />
              ))}
            </RevealGroup>
          </div>
        ))
      )}
    </>
  );
}
