import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["cach-mang-thang-8"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/cach-mang-thang-8" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function CachMangThang8Page() {
  return <LocationPageTemplate data={data} />;
}
