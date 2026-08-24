import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["ung-van-khiem"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/ung-van-khiem" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function UngVanKhiemPage() {
  return <LocationPageTemplate data={data} />;
}
