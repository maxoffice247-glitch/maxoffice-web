import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["pham-van-dong"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/pham-van-dong" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function PhamVanDongPage() {
  return <LocationPageTemplate data={data} />;
}
