# Kiểm tra ảnh báo giá chi nhánh (`npm run check:quote-images`)

Ảnh báo giá do Satori (`next/og`) vẽ cần **chiều cao cố định**, nên mỗi route ước lượng chiều cao theo nội dung (số gói, số quyền lợi, độ dài chữ). Khi dữ liệu đổi mà ước lượng thiếu, phần cuối ảnh (footer/chữ) bị đẩy ra ngoài và **bị cắt** mà không báo lỗi. Script này đo khoảng trắng ở đáy mọi ảnh để bắt sớm.

## Khi nào chạy

Sau khi sửa **dữ liệu chi nhánh, bảng giá, quyền lợi, ưu đãi** (`src/lib/locationsData.ts`, `src/lib/planFinder.ts`, v.v.) hoặc thêm chi nhánh/gói mới, **trước khi push**.

## Cách chạy

Cần một server đang chạy bản mới nhất (nên là bản build để giống production):

```bash
npm run build && npx next start -p 3100
```

Ở cửa sổ khác:

```bash
BASE_URL=http://localhost:3100 npm run check:quote-images
```

(`BASE_URL` mặc định `http://localhost:3000`, dùng được cả với `npm run dev`.) Tuỳ chọn: `MIN_GAP` (mặc định 20), `MAX_HEIGHT` (mặc định 2400), `CONCURRENCY` (mặc định 4).

## Script kiểm tra gì

- Ảnh từng gói `/api/quote-image/{slug}/{plan}`, ảnh nhóm gói `/api/quote-image/goi/{groupKey}`, ảnh tất cả gói `/api/quote-image/{slug}/tat-ca` (chi nhánh chỉ có 1 gói phải trả 404). Danh sách lấy tự động từ dữ liệu nên chi nhánh mới được kiểm tra luôn.
- **Không** kiểm tra ảnh báo giá tổng hợp (`POST /api/quote-image/tong-hop`, cần dữ liệu nhập).
- Với mỗi ảnh in: kích thước, **khoảng trắng đáy** (số hàng pixel trắng liên tiếp ở đáy ảnh).

## Cách đọc kết quả

| Kết quả | Ý nghĩa |
| --- | --- |
| `OK` | Khoảng trắng đáy >= 20px |
| `NGUY CƠ CẮT` | Khoảng trắng đáy < 20px — ước lượng chiều cao đang sát/thiếu, nội dung có thể bị cắt. **Script thoát mã 1.** |
| `QUÁ CAO` | Ảnh cao hơn 2400px (chỉ cảnh báo) |
| `LỖI` | HTTP lỗi, không đọc được PNG, hoặc chi nhánh 1 gói không trả 404. **Script thoát mã 1.** |

Khi gặp `NGUY CƠ CẮT`: mở ảnh đó xem có bị cắt thật không (đáy trắng nhỏ không phải lúc nào cũng là cắt, vì mỗi loại ảnh có độ dư đáy riêng), rồi tăng phần dư ở công thức chiều cao của route tương ứng (`src/app/api/quote-image/...`). Với ảnh tất cả gói, phần dư nằm ở `BOTTOM_SLACK` trong `[slug]/tat-ca/route.tsx`.

## Ghi chú về mốc hiện tại

Mốc khoảng trắng đáy khác nhau theo loại ảnh (đo ngày 6/10/2026): ảnh tất cả gói 40px trở lên, ảnh từng gói 34px trở lên, ảnh nhóm gói từ 19px (`goi/silver-379k`, sát ngưỡng nhưng không bị cắt).
