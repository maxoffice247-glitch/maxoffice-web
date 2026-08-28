import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["vuon-lai"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/vuon-lai" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function VuonLaiPage() {
  // TẠM ẨN — chi nhánh này đang isActive: false trong locationsData.ts.
  // Dữ liệu, ảnh và nội dung trang vẫn giữ nguyên; chỉ chặn hiển thị công
  // khai bằng cách trả về 404. Đặt lại isActive: true để bật lại chi nhánh
  // (không cần sửa gì ở file này).
  if (data.isActive === false) {
    notFound();
  }

  return <LocationPageTemplate data={data} />;
}
