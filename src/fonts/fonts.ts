import localFont from "next/font/local";

/* FILE SINH TỰ ĐỘNG bởi scripts/gen-fonts.py — không sửa tay, sửa script
   rồi chạy lại. Weight preload hiện tại: 700,800.
   Xem giải thích thiết kế trong scripts/gen-fonts.py. */

const viPre = localFont({
  src: [
    { path: "./be-vietnam-pro/be-vietnam-pro-700-vietnamese.woff2", weight: "700", style: "normal" },
    { path: "./be-vietnam-pro/be-vietnam-pro-800-vietnamese.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  preload: true,
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "'Be Vietnam Pro'" },
    { prop: "unicode-range", value: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB" },
  ],
});

const viRest = localFont({
  src: [
    { path: "./be-vietnam-pro/be-vietnam-pro-400-vietnamese.woff2", weight: "400", style: "normal" },
    { path: "./be-vietnam-pro/be-vietnam-pro-500-vietnamese.woff2", weight: "500", style: "normal" },
    { path: "./be-vietnam-pro/be-vietnam-pro-600-vietnamese.woff2", weight: "600", style: "normal" },
    { path: "./be-vietnam-pro/be-vietnam-pro-900-vietnamese.woff2", weight: "900", style: "normal" },
  ],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "'Be Vietnam Pro'" },
    { prop: "unicode-range", value: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB" },
  ],
});

const leAll = localFont({
  src: [
    { path: "./be-vietnam-pro/be-vietnam-pro-400-latin-ext.woff2", weight: "400", style: "normal" },
    { path: "./be-vietnam-pro/be-vietnam-pro-500-latin-ext.woff2", weight: "500", style: "normal" },
    { path: "./be-vietnam-pro/be-vietnam-pro-600-latin-ext.woff2", weight: "600", style: "normal" },
    { path: "./be-vietnam-pro/be-vietnam-pro-700-latin-ext.woff2", weight: "700", style: "normal" },
    { path: "./be-vietnam-pro/be-vietnam-pro-800-latin-ext.woff2", weight: "800", style: "normal" },
    { path: "./be-vietnam-pro/be-vietnam-pro-900-latin-ext.woff2", weight: "900", style: "normal" },
  ],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "'Be Vietnam Pro'" },
    { prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF" },
  ],
});

const latPre = localFont({
  src: [
    { path: "./be-vietnam-pro/be-vietnam-pro-700-latin.woff2", weight: "700", style: "normal" },
    { path: "./be-vietnam-pro/be-vietnam-pro-800-latin.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  preload: true,
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "'Be Vietnam Pro'" },
    { prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" },
  ],
});

const latRest = localFont({
  src: [
    { path: "./be-vietnam-pro/be-vietnam-pro-400-latin.woff2", weight: "400", style: "normal" },
    { path: "./be-vietnam-pro/be-vietnam-pro-500-latin.woff2", weight: "500", style: "normal" },
    { path: "./be-vietnam-pro/be-vietnam-pro-600-latin.woff2", weight: "600", style: "normal" },
    { path: "./be-vietnam-pro/be-vietnam-pro-900-latin.woff2", weight: "900", style: "normal" },
  ],
  display: "swap",
  preload: false,
  variable: "--font-be-vietnam-pro-metrics",
  adjustFontFallback: "Arial",
  declarations: [
    { prop: "font-family", value: "'Be Vietnam Pro'" },
    { prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" },
  ],
});

/** Class CSS cần gắn lên <html>: chỉ khai báo biến chứa tên font fallback
    (size-adjust so với Arial) — các call còn lại chỉ đóng góp @font-face. */
export const beVietnamProVariable = latRest.variable;

/** Giữ tham chiếu tới mọi lần gọi loader (mỗi lần gọi thêm 1 nhóm @font-face
    vào CSS) — tránh bị coi là biến không dùng. */
export const beVietnamProFaceGroups = [viPre, viRest, leAll, latPre, latRest];
