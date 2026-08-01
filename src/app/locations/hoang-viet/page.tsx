import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["hoang-viet"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/hoang-viet" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function HoangVietPage() {
  return <LocationPageTemplate data={data} />;
}
