import type { ReactNode } from "react";
import { CheckCircleIcon, InfoIcon } from "../icons";
import type { PlanGroup } from "@/lib/planFinder";
import { formatVoPrice } from "@/lib/planFinder";

/**
 * Nội dung ảnh báo giá TỔNG HỢP xuất bằng html-to-image (xem
 * PlanGroupDetailActions) — 1 gói áp dụng ở NHIỀU chi nhánh, nên không có 1
 * ảnh mặt tiền đại diện duy nhất như PlanQuoteCard (gói 1 chi nhánh); thay
 * vào đó liệt kê từng chi nhánh kèm ảnh nhỏ (object-contain, không cắt ảnh
 * dù mỗi chi nhánh có tỉ lệ ảnh gốc khác nhau).
 *
 * Chiều rộng cố định 1080px (đúng khung ảnh dọc xem trên điện thoại), chiều
 * cao để TỰ ĐO theo số chi nhánh (1-7+ chi nhánh) thay vì cố định 1350px như
 * ảnh báo giá 1 chi nhánh — số chi nhánh mỗi nhóm chênh lệch quá lớn để dùng
 * chung 1 chiều cao cố định mà không bị trống hoặc tràn.
 */
type PlanGroupLocation = PlanGroup["locations"][number];

/** 1 nhóm chi nhánh có ĐÚNG cùng nội dung khuyến mãi (hoặc 1 chi nhánh lẻ
    không có khuyến mãi nào — `promotions: null`, luôn đứng 1 mình). */
type LocationGroup = {
  locations: PlanGroupLocation[];
  /** null = nhóm này không có khuyến mãi (không hiện khối gì cả). */
  promotions: string[] | null;
};

/**
 * Gom các chi nhánh có ĐÚNG cùng 1 nội dung khuyến mãi thành 1 nhóm, thay vì
 * lặp lại y hệt đoạn khuyến mãi dưới từng chi nhánh riêng lẻ — với gói bán
 * ở nhiều chi nhánh (VD BASE 500K, 11 chi nhánh), phần lớn chi nhánh dùng
 * chung 1-2 chính sách, lặp lại nguyên văn 11 lần vừa dài vừa khó đọc.
 *
 * Giữ ĐÚNG thứ tự xuất hiện gốc: 1 nhóm xuất hiện tại vị trí của chi nhánh
 * ĐẦU TIÊN thuộc nhóm đó, các chi nhánh cùng nhóm xuất hiện sau chỉ được
 * gộp thêm vào, không kéo nhóm lên vị trí khác. Chi nhánh không có khuyến
 * mãi luôn là 1 nhóm riêng 1 thành viên (`promotions: null`) — "giống
 * nhau ở chỗ đều không có gì" không phải là 1 nhóm khuyến mãi thực sự.
 */
function buildLocationGroups(locations: PlanGroupLocation[]): LocationGroup[] {
  const groups: LocationGroup[] = [];
  const keyToGroupIndex = new Map<string, number>();
  for (const loc of locations) {
    if (!loc.promotions || loc.promotions.length === 0) {
      groups.push({ locations: [loc], promotions: null });
      continue;
    }
    const key = JSON.stringify(loc.promotions);
    const existingIndex = keyToGroupIndex.get(key);
    if (existingIndex !== undefined) {
      groups[existingIndex].locations.push(loc);
    } else {
      keyToGroupIndex.set(key, groups.length);
      groups.push({ locations: [loc], promotions: loc.promotions });
    }
  }
  return groups;
}

/** 1 khối trong danh sách chi nhánh — hoặc 1 thẻ chi nhánh (hẹp, xếp 2 cột
    được), hoặc 1 khối cần FULL WIDTH (khuyến mãi chung/riêng — text dài,
    xếp vào 1 trong 2 cột hẹp dễ bị chật/tràn). */
type LocationBlock = { key: string; fullWidth: boolean; node: ReactNode };

/**
 * Chèn thêm Ô ĐỆM rỗng trước 1 khối full-width nếu khối đó đang rơi vào
 * cột thứ 2 của hàng — nếu không, CSS Grid (auto-flow mặc định, không
 * dùng "dense") sẽ đẩy khối full-width xuống hàng tiếp theo và để trống 1
 * ô ở cột 2 của hàng hiện tại, tạo lỗ hổng xấu trong lưới. Không cần gọi
 * hàm này khi useLocationGrid=false (danh sách 1 cột không có khái niệm
 * "cột 2" để lệch).
 */
function withGridFillers(blocks: LocationBlock[]): LocationBlock[] {
  const result: LocationBlock[] = [];
  let atColumn2 = false;
  for (const b of blocks) {
    if (b.fullWidth && atColumn2) {
      result.push({ key: `${b.key}-filler`, fullWidth: false, node: null });
      atColumn2 = false;
    }
    result.push(b);
    atColumn2 = b.fullWidth ? false : !atColumn2;
  }
  return result;
}

export default function PlanGroupQuoteCard({ group }: { group: PlanGroup }) {
  const locationGroups = buildLocationGroups(group.locations);
  // Từ 6 tính năng trở lên chia 2 cột (giống PlanQuoteCard — báo giá 1 chi
  // nhánh) — nhóm càng nhiều chi nhánh thì "Áp dụng tại N chi nhánh" bên
  // dưới càng dài, nên rút ngắn khối "Tính năng đi kèm" theo chiều dọc để
  // đỡ tràn quá dài. Dưới 6 tính năng giữ 1 cột (2 cột ở số lượng ít làm
  // layout trống trải, đồng thời card vốn đã auto-height nên các gói ít
  // chi nhánh + ít tính năng vẫn tự nhiên gọn, không có khoảng trắng thừa
  // trước footer).
  const useFeatureGrid = group.features.length >= 6;
  const featureGridRows = Math.ceil(group.features.length / 2);
  // Cùng ngưỡng >=6 với khối "Tính năng đi kèm" ở trên — nhóm ít chi
  // nhánh chia 2 cột sẽ trống trải/lệch, để 1 cột cho gọn.
  const useLocationGrid = group.locations.length >= 6;

  return (
    <div style={{ width: 1080 }} className="flex flex-col bg-white">
      {/* Header — logo + tiêu đề báo giá */}
      <div className="flex items-center justify-between px-14 pt-12 pb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-red.png" alt="MAX OFFICE" style={{ height: 56 }} />
        <span className="rounded-full bg-navy px-6 py-2.5 text-[22px] font-bold text-white">
          Báo giá tổng hợp
        </span>
      </div>

      {/* Gói + giá */}
      <div className="mx-14 rounded-2xl bg-bg-tint px-8 py-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[16px] font-bold tracking-[0.08em] text-primary uppercase">
              Gói {group.planName}
            </p>
            <p className="mt-1 text-[15px] text-body-text">
              Văn phòng ảo · Áp dụng tại {group.locations.length} chi nhánh
            </p>
          </div>
          <div className="text-right">
            <p className="text-[44px] font-extrabold text-accent">{formatVoPrice(group.price)}</p>
            <p className="text-[15px] text-body-text">/tháng · chưa gồm VAT 10%</p>
          </div>
        </div>
        {/* Phụ phí một lần (vd. bảng hiệu công ty của gói LITE) — tách biệt
            khỏi danh sách "Tính năng đi kèm" bên dưới vì đây KHÔNG phải
            tiện ích đi kèm hàng tháng, mà là 1 khoản thu riêng, 1 lần. */}
        {group.addonNote && (
          <p className="mt-5 flex items-start gap-2 border-t border-line pt-4 text-[14px] leading-relaxed text-amber-dark">
            <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
            {group.addonNote}
          </p>
        )}
      </div>

      {/* Danh sách tính năng */}
      <div className="mx-14 mt-9">
        <p className="mb-5 text-[20px] font-bold text-navy">Tính năng đi kèm</p>
        <div
          className={useFeatureGrid ? "grid gap-x-8 gap-y-4" : "flex flex-col gap-4"}
          style={
            useFeatureGrid
              ? {
                  gridTemplateColumns: "1fr 1fr",
                  gridTemplateRows: `repeat(${featureGridRows}, auto)`,
                  gridAutoFlow: "column",
                }
              : undefined
          }
        >
          {group.features.map((f) => (
            <div key={f} className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                <CheckCircleIcon className="h-4 w-4" />
              </span>
              <span className="text-[19px] leading-snug text-ink">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danh sách chi nhánh áp dụng — gom theo NHÓM khuyến mãi giống hệt
          nhau (buildLocationGroups): nhóm >=2 chi nhánh chung 1 chính sách
          hiện danh sách chi nhánh GỌN (bỏ text khuyến mãi lặp lại ở từng
          dòng) rồi 1 khối "Ưu đãi chung" duy nhất ngay dưới; chi nhánh có
          khuyến mãi RIÊNG (nhóm chỉ 1 thành viên) vẫn hiện khuyến mãi ngay
          dưới tên/địa chỉ như trước; chi nhánh không có khuyến mãi thì
          không có khối gì thêm.

          Từ 6 chi nhánh trở lên chia 2 cột (cùng ngưỡng "Tính năng đi
          kèm") — mỗi thẻ chi nhánh vẫn đủ ảnh + tên + địa chỉ, chỉ hẹp lại
          để vừa 2 thẻ/hàng. Khối khuyến mãi (chung hoặc riêng) LUÔN full
          width (span 2 cột) dù ở layout 2 cột hay 1 cột — text khuyến mãi
          dễ dài, nhét vào 1 trong 2 cột hẹp sẽ chật/tràn xấu. */}
      <div className="mx-14 mt-9">
        <p className="mb-5 text-[20px] font-bold text-navy">
          Áp dụng tại {group.locations.length} chi nhánh
        </p>
        {(() => {
          const blocks: LocationBlock[] = locationGroups.flatMap((grp, grpIndex) => {
            const isSharedGroup = grp.promotions !== null && grp.locations.length >= 2;
            const hasPrivatePromo = grp.promotions !== null && grp.locations.length === 1;
            const locationCards: LocationBlock[] = grp.locations.map((loc) => ({
              key: loc.slug,
              // Khuyến mãi RIÊNG cần full width để đủ chỗ hiển thị — xem
              // giải thích ở comment JSX phía trên.
              fullWidth: hasPrivatePromo,
              node: (
                <div className="flex items-center gap-4 rounded-2xl bg-bg-tint p-3">
                  <div className="relative aspect-[3/4] w-[64px] shrink-0 overflow-hidden rounded-xl bg-white">
                    {/* /images/quote/ — bản đã resize/nén riêng cho xuất ảnh
                        báo giá (xem waitForImages.ts), không phải ảnh gốc
                        full-res: hiển thị ở đây chỉ 64px, ảnh gốc vài trăm KB
                        là dư thừa và làm chậm export trên mobile khi nhóm có
                        nhiều chi nhánh. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/quote/dia-diem-${loc.slug}.jpg`}
                      alt={loc.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[19px] font-bold text-navy">{loc.name}</p>
                    <p className="text-[15px] text-body-text">{loc.shortAddress}</p>
                    {/* Khuyến mãi RIÊNG — chỉ hiện ngay dưới chi nhánh khi
                        nhóm này chỉ có đúng 1 thành viên (không trùng với bất
                        kỳ chi nhánh nào khác trong danh sách). Nhóm >=2 thành
                        viên hiện khuyến mãi 1 lần duy nhất ở khối chung bên
                        dưới thay vì lặp lại ở đây. */}
                    {grp.promotions && grp.locations.length === 1 && (
                      <p className="mt-1 flex items-start gap-1.5 text-[13px] leading-snug text-accent">
                        <span aria-hidden>🎁</span>
                        <span>{grp.promotions.slice(0, 2).join(" · ")}</span>
                      </p>
                    )}
                  </div>
                </div>
              ),
            }));
            if (!isSharedGroup) return locationCards;
            return [
              ...locationCards,
              {
                key: `shared-promo-${grpIndex}`,
                fullWidth: true,
                node: (
                  // Khung thu gọn hết mức (padding/khoảng cách tối thiểu) —
                  // đây là khối THAY THẾ cho N dòng khuyến mãi lặp lại y hệt
                  // nhau, nên phần "chi phí cố định" của khung (viền, nền,
                  // tiêu đề) cần nhỏ nhất có thể để phần tiết kiệm do gom
                  // nhóm không bị overhead của chính cái khung ăn hết.
                  <div className="rounded-xl border border-accent/25 bg-accent/8 px-5 py-3.5">
                    <p className="mb-1 flex items-center gap-1.5 text-[13.5px] font-bold text-accent">
                      <span aria-hidden>🎁</span> Ưu đãi chung cho các chi nhánh trên
                    </p>
                    <ul className="space-y-1">
                      {grp.promotions!.slice(0, 3).map((p) => (
                        <li key={p} className="flex items-start gap-2 text-[13.5px] leading-snug text-ink">
                          <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              },
            ];
          });

          const renderBlocks = useLocationGrid ? withGridFillers(blocks) : blocks;
          return (
            <div
              className={useLocationGrid ? "grid grid-cols-2 gap-4" : "flex flex-col gap-3"}
            >
              {renderBlocks.map((b) =>
                useLocationGrid && b.fullWidth ? (
                  <div key={b.key} className="col-span-2">
                    {b.node}
                  </div>
                ) : (
                  <div key={b.key}>{b.node}</div>
                )
              )}
            </div>
          );
        })()}
      </div>

      {/* Footer */}
      <div className="mx-14 mt-9 mb-12 flex items-center justify-between border-t border-line pt-7">
        <div>
          <p className="text-[22px] font-extrabold text-navy">Hotline: 089 8082 188</p>
          <p className="mt-1 text-[16px] text-body-text">maxoffice.vn</p>
        </div>
        <span className="rounded-full bg-accent px-6 py-3 text-[16px] font-bold text-white">
          Liên hệ tư vấn ngay
        </span>
      </div>
    </div>
  );
}
