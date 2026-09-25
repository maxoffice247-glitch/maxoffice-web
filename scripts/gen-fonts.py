#!/usr/bin/env python3
"""Sinh src/fonts/fonts.ts — khai báo font Be Vietnam Pro bằng next/font/local.

Vì sao không dùng next/font/google như trước: loader Google chỉ cho bật/tắt
`preload` cho CẢ lần gọi (theo subset), không chọn được từng weight — nên
6 weight × 2 subset = 12 file luôn bị preload cùng lúc, tranh băng thông với
ảnh Hero (LCP) trên mạng chậm. next/font/local cho phép khai báo `font-family`
tùy chỉnh trong `declarations` (chính thức hỗ trợ, xem hasCustomFontFamily
trong loader) nên có thể chia các weight thành 2 nhóm cùng MỘT tên family
'Be Vietnam Pro': nhóm PRELOAD (weight thật sự cần ở màn hình đầu) và nhóm
KHÔNG preload (vẫn tải khi trang dùng tới, chỉ không chặn/tranh băng thông
lúc đầu). File woff2 là bản byte-identical với file Next đã phát hành từ
Google (sao chép từ .next/static/media), unicode-range giữ nguyên, nên diện
mạo chữ không đổi.

Cách dùng: python3 scripts/gen-fonts.py 400,700,800   (danh sách weight preload)
"""
import sys

ALL = ["400", "500", "600", "700", "800", "900"]
PRELOAD = sys.argv[1].split(",") if len(sys.argv) > 1 and sys.argv[1] else []
REST = [w for w in ALL if w not in PRELOAD]

# unicode-range gốc của Google (cùng cho mọi weight), giữ nguyên thứ tự khai
# báo vietnamese -> latin-ext -> latin: khi 2 face trùng ký tự (U+0304, U+0308,
# U+0329) face khai báo SAU thắng, đúng như CSS Google.
RANGES = {
    "vietnamese": "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB",
    "latin-ext": "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
    "latin": "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
}


def call(name, subset, weights, preload, fallback_owner=False):
    if not weights:
        return ""
    src = ",\n".join(
        f'    {{ path: "./be-vietnam-pro/be-vietnam-pro-{w}-{subset}.woff2", weight: "{w}", style: "normal" }}'
        for w in weights
    )
    extra = ""
    if fallback_owner:
        extra = '  variable: "--font-be-vietnam-pro-metrics",\n  adjustFontFallback: "Arial",\n'
    else:
        extra = "  adjustFontFallback: false,\n"
    return f"""const {name} = localFont({{
  src: [
{src},
  ],
  display: "swap",
  preload: {"true" if preload else "false"},
{extra}  declarations: [
    {{ prop: "font-family", value: "'Be Vietnam Pro'" }},
    {{ prop: "unicode-range", value: "{RANGES[subset]}" }},
  ],
}});
"""


# Chủ sở hữu fallback (size-adjust so với Arial): call latin chứa weight gần
# 400 nhất — nhóm preload nếu có 400 trong đó, ngược lại nhóm còn lại.
owner_is_pre = "400" in PRELOAD
parts = [
    call("viPre", "vietnamese", PRELOAD, True),
    call("viRest", "vietnamese", REST, False),
    call("leAll", "latin-ext", ALL, False),
    call("latPre", "latin", PRELOAD, True, fallback_owner=owner_is_pre),
    call("latRest", "latin", REST, False, fallback_owner=not owner_is_pre),
]
owner = "latPre" if owner_is_pre else "latRest"
body = "\n".join(p for p in parts if p)
names = [n for n, p in zip(["viPre", "viRest", "leAll", "latPre", "latRest"], parts) if p]
header = f'''import localFont from "next/font/local";

/* FILE SINH TỰ ĐỘNG bởi scripts/gen-fonts.py — không sửa tay, sửa script
   rồi chạy lại. Weight preload hiện tại: {",".join(PRELOAD) or "(không có)"}.
   Xem giải thích thiết kế trong scripts/gen-fonts.py. */

'''
footer = f"""
/** Class CSS cần gắn lên <html>: chỉ khai báo biến chứa tên font fallback
    (size-adjust so với Arial) — các call còn lại chỉ đóng góp @font-face. */
export const beVietnamProVariable = {owner}.variable;

/** Giữ tham chiếu tới mọi lần gọi loader (mỗi lần gọi thêm 1 nhóm @font-face
    vào CSS) — tránh bị coi là biến không dùng. */
export const beVietnamProFaceGroups = [{", ".join(names)}];
"""
open("src/fonts/fonts.ts", "w").write(header + body + footer)
print("preload:", PRELOAD, "| rest:", REST, "| fallback owner:", owner)
