export const SITE_URL = "https://www.maxoffice.vn";
export const SITE_NAME = "MAX OFFICE";
/** Số doanh nghiệp đang tin dùng MAX OFFICE — hiển thị dạng "2000+" ở khối
    stats trang chủ/Về chúng tôi, mega menu, OG image mặc định, và nhắc lại
    trong nhiều đoạn mô tả (meta description, Hero FAQ, TrustBar...). NGUỒN
    DUY NHẤT — trước đây hardcode "500"/"500+"/"hơn 500" rải rác ở ~15 file,
    đổi số phải sửa tay từng chỗ, dễ sót (xem git log lúc gộp về hằng số
    này). Không áp dụng cho mốc lịch sử "Vượt mốc 500 doanh nghiệp" ở
    AboutTimeline.tsx — đó là số liệu tại đúng thời điểm 2025 trong dòng
    thời gian, cố ý giữ nguyên số cứng, không đổi theo hằng số hiện tại. */
export const TRUSTED_BUSINESS_COUNT = 2000;
export const COMPANY_LEGAL_NAME = "Công Ty TNHH MAX Office";
export const COMPANY_PHONE = "+84898082188";
export const COMPANY_EMAIL = "cskh@maxoffice.vn";
export const GOOGLE_MAPS_REVIEW_URL =
  "https://www.google.com/maps/place/C%C3%94NG+TY+TNHH+MAX+OFFICE/@10.809349,106.6639282,1835m/data=!3m2!1e3!4b1!4m6!3m5!1s0x317529349fd821dd:0xa8e4e76914c567ee!8m2!3d10.8093437!4d106.6665031!16s%2Fg%2F11jzpmfkx2";
