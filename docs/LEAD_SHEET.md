# Sheet nhận lead của website

Mọi form liên hệ/lead trên website (đặt lịch tham quan, nhận tư vấn, popup ưu đãi, form Checklist thành lập doanh nghiệp...) ghi 1 dòng vào Google Sheet này qua webhook Apps Script, đồng thời gửi email thông báo tới `cskh@maxoffice.vn`.

## File

- **Tên file:** MAX OFFICE - Form khách hàng
- **Link:** https://docs.google.com/spreadsheets/d/1osAvHDth_gW4i8gy_HHP71WmqxB1xupkywtwqyzKO00

## Webhook

- **Biến môi trường:** `GOOGLE_SHEET_WEBHOOK_URL` (URL Apps Script dạng `.../macros/s/<deployment-id>/exec`). Không ghi giá trị URL vào repo — khai báo trong `.env.local` (máy dev) và Environment Variables trên Vercel.
- **Code đọc biến này:** `src/lib/leadDelivery.ts` (hàm `sendToGoogleSheet`), dùng chung cho `src/app/api/submit-lead/route.ts` và `src/app/api/submit-company-registration/route.ts`.

## Cột của sheet (A–J)

| Cột | Tên cột |
|---|---|
| A | Thời gian |
| B | Loại form |
| C | Họ tên |
| D | SĐT |
| E | Email |
| F | Dịch vụ |
| G | Chi nhánh |
| H | Ngày |
| I | Giờ |
| J | Ghi chú |

## Lưu ý

- **Cột D (SĐT) phải để định dạng văn bản thuần túy (Plain text).** Nếu để định dạng tự động, Google Sheets sẽ coi số điện thoại là số và bỏ mất số 0 đầu (ví dụ `0901234567` thành `901234567`).
- **Form thành lập doanh nghiệp** (Loại form `checklist-thanh-lap`) ghi toàn bộ thông tin chi tiết (địa chỉ, ngành nghề, vốn, người đại diện, cổ đông/thành viên...) vào **cột J (Ghi chú)**, không thêm cột riêng.
