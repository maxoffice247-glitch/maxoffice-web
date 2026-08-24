import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["tan-cang"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/tan-cang" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function TanCangPage() {
  return <LocationPageTemplate data={data} />;
}
