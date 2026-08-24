import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["nguyen-thong"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/nguyen-thong" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function NguyenThongPage() {
  return <LocationPageTemplate data={data} />;
}
