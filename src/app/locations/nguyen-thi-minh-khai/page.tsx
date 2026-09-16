import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["nguyen-thi-minh-khai"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/nguyen-thi-minh-khai" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function NguyenThiMinhKhaiPage() {
  return <LocationPageTemplate data={data} />;
}
