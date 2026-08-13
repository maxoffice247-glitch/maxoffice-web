import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["quan-7"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/quan-7" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function QuanBaPage() {
  return <LocationPageTemplate data={data} />;
}
