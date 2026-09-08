"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { RevealGroup } from "./Reveal";
import LocationCard from "./LocationCard";
import { SearchIcon } from "./icons";
import { stripCuSuffix, type LocationListItem, type LocationRow } from "@/lib/locationsData";

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

/** Bảng màu xoay vòng cho các khu vực ≤2 chi nhánh ghép chung hàng — 4 tông
    (xanh dương/cam/tím/xanh lá) đủ khác nhau để nhận ra ngay cả khi lướt
    nhanh, nhưng không quá chói (dùng bản "600-700" cho chữ, bản nhạt cho
    nền badge). `colorIndex` do buildLocationRows() cấp TĂNG DẦN LIÊN TỤC
    qua mọi cluster (không mod trước) — 2 khu vực liền kề trong 1 cluster
    luôn có index liên tiếp (n, n+1), nên (n % 4) luôn khác (n+1) % 4 → 2
    khu vực cạnh nhau trong cùng 1 hàng không bao giờ trùng màu. */
const CLUSTER_COLORS = [
  { border: "border-l-primary", text: "text-primary", badge: "bg-primary/10 text-primary" },
  { border: "border-l-amber", text: "text-amber-dark", badge: "bg-amber/12 text-amber-dark" },
  { border: "border-l-violet-500", text: "text-violet-700", badge: "bg-violet-500/10 text-violet-700" },
  { border: "border-l-emerald-600", text: "text-emerald-700", badge: "bg-emerald-600/10 text-emerald-700" },
];

function AreaBlock({ area, locations }: AreaGroup) {
  return (
    <div className="mb-10 rounded-3xl border border-primary/15 bg-primary-tint/40 p-5 sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-[18px] font-bold text-navy sm:text-[20px]">{stripCuSuffix(area.name)}</h3>
        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11.5px] font-bold whitespace-nowrap text-primary">
          {locations.length} chi nhánh
        </span>
      </div>
      <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((loc, i) => (
          <LocationCard key={loc.slug} loc={loc} index={i} />
        ))}
      </RevealGroup>
    </div>
  );
}

/** 1 khu vực nhỏ (≤2 chi nhánh) bên trong 1 hàng ghép — border-left màu +
    tiêu đề màu theo `colorIndex` để mắt vẫn nhận ra ranh giới dù chung
    hàng với khu vực khác. `widthShare` quyết định bề ngang tương đối so
    với (các) khu vực còn lại trong cùng hàng, tỉ lệ theo số chi nhánh của
    chính nó (khu vực 2 chi nhánh rộng gấp đôi khu vực 1 chi nhánh) — mobile
    luôn xếp full-width 1 cột bất kể tỉ lệ này (basis chỉ có hiệu lực từ
    sm: trở lên). */
function ClusterAreaCard({
  area,
  locations,
  colorIndex,
  widthShare,
}: {
  area: { slug: string; name: string };
  locations: LocationListItem[];
  colorIndex: number;
  widthShare: "1/2" | "1/3" | "2/3" | "full";
}) {
  const color = CLUSTER_COLORS[colorIndex % CLUSTER_COLORS.length];
  const basisClass =
    widthShare === "full"
      ? ""
      : widthShare === "1/2"
        ? "sm:basis-1/2"
        : widthShare === "1/3"
          ? "sm:basis-1/3"
          : "sm:basis-2/3";

  return (
    <div className={`min-w-0 rounded-2xl border border-line border-l-4 ${color.border} bg-white p-4 sm:p-5 ${basisClass}`}>
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <h3 className={`text-[15px] font-bold ${color.text}`}>{stripCuSuffix(area.name)}</h3>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold whitespace-nowrap ${color.badge}`}>
          {locations.length} chi nhánh
        </span>
      </div>
      <RevealGroup className={`grid grid-cols-1 gap-3.5 ${locations.length >= 2 ? "sm:grid-cols-2" : ""}`}>
        {locations.map((loc, i) => (
          <LocationCard key={loc.slug} loc={loc} index={i} />
        ))}
      </RevealGroup>
    </div>
  );
}

function ClusterRow({ groups }: { groups: Extract<LocationRow, { kind: "cluster" }>["groups"] }) {
  // Chỉ 2 khu vực/hàng (xem CLUSTER_AREAS_PER_ROW) nên tỉ lệ bề ngang chỉ
  // có 3 trường hợp: 1-1 chia đều, hoặc 1-2/2-1 lệch theo số chi nhánh.
  const widthShares: Array<"1/2" | "1/3" | "2/3" | "full"> =
    groups.length === 1
      ? ["full"]
      : groups[0].locations.length === groups[1].locations.length
        ? ["1/2", "1/2"]
        : groups[0].locations.length > groups[1].locations.length
          ? ["2/3", "1/3"]
          : ["1/3", "2/3"];

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      {groups.map((g, i) => (
        <ClusterAreaCard
          key={g.area.slug}
          area={g.area}
          locations={g.locations}
          colorIndex={g.colorIndex}
          widthShare={widthShares[i]}
        />
      ))}
    </div>
  );
}

/**
 * Ô tìm kiếm nhanh theo khu vực (quận cũ hoặc phường) + toàn bộ lưới chi
 * nhánh nhóm theo khu vực bên dưới — gộp chung 1 Client Component vì input
 * cần lọc trực tiếp danh sách hiển thị (state chia sẻ). Khối CTA "Tìm nhanh
 * VPA phù hợp" do Server Component (page.tsx) dựng nội dung sẵn, truyền
 * vào qua prop `cta` rồi đặt CHUNG 1 khung viền/nền với ô tìm kiếm (không
 * còn 2 khung riêng xếp chồng) — chỉ phần lọc mới cần client-side.
 *
 * Khớp theo: tên khu vực (quận cũ, VD "Quận 1") → hiện TRỌN khu vực đó;
 * hoặc tên/địa chỉ chi nhánh (chứa tên phường, VD "P. Tân Định") → chỉ hiện
 * đúng (các) chi nhánh khớp. Rỗng → hiện đủ toàn bộ, dùng bố cục `rows` đã
 * ghép hàng theo màu (xem locationsData.ts) thay vì 1 khu vực/hàng — lúc
 * ĐANG tìm kiếm thì bỏ qua bố cục ghép hàng, hiện phẳng từng khu vực khớp
 * theo đúng khu vực khớp (số kết quả thường ít, ghép hàng không cần thiết
 * và không ảnh hưởng gì tới logic lọc).
 */
export default function LocationsAreaBrowser({
  areaGroups,
  rows,
  cta,
}: {
  areaGroups: AreaGroup[];
  rows: LocationRow[];
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
        rows.map((row, i) =>
          row.kind === "full" ? (
            <AreaBlock key={row.area.slug} area={row.area} locations={row.locations} />
          ) : (
            <ClusterRow key={`cluster-${i}`} groups={row.groups} />
          )
        )
      )}
    </>
  );
}
