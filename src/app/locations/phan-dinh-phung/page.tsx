import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["phan-dinh-phung"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/phan-dinh-phung" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function PhanDinhPhungPage() {
  return <LocationPageTemplate data={data} />;
}
