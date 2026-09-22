import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["nguyen-van-thu"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/nguyen-van-thu" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function NguyenVanThuPage() {
  return <LocationPageTemplate data={data} />;
}
