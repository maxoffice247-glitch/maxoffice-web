import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["nguyen-truong-to"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/nguyen-truong-to" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function NguyenTruongToPage() {
  return <LocationPageTemplate data={data} />;
}
