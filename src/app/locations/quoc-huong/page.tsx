import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["quoc-huong"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/quoc-huong" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function QuocHuongPage() {
  return <LocationPageTemplate data={data} />;
}
