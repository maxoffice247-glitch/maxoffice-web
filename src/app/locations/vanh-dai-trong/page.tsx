import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["vanh-dai-trong"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/vanh-dai-trong" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function VanhDaiTrongPage() {
  return <LocationPageTemplate data={data} />;
}
