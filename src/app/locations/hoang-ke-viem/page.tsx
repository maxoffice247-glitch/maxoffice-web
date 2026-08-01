import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["hoang-ke-viem"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/hoang-ke-viem" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function HoangKeViemPage() {
  return <LocationPageTemplate data={data} />;
}
