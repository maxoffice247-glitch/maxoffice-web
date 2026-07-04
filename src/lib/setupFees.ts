export type EntityType = "ho-kinh-doanh" | "tnhh-1tv" | "tnhh-2tv" | "co-phan";

// Updated pricing (supersedes the outdated figures in the original prompt).
// Kept in a plain (non "use client") module so both SetupCostTool.tsx and
// server-rendered pages (e.g. the TNHH vs Cổ phần comparison page) can import
// the exact same figures without re-typing them.
export const SETUP_FEES: Record<EntityType, { included: number; standalone: number; label: string }> = {
  "ho-kinh-doanh": { included: 800000, standalone: 1000000, label: "Hộ kinh doanh" },
  "tnhh-1tv": { included: 1299000, standalone: 1500000, label: "Công ty TNHH 1 thành viên" },
  "tnhh-2tv": { included: 1299000, standalone: 1500000, label: "Công ty TNHH 2 thành viên trở lên" },
  "co-phan": { included: 1500000, standalone: 2000000, label: "Công ty Cổ phần" },
};
