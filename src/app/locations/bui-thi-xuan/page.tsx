import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["bui-thi-xuan"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/bui-thi-xuan" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function BuiThiXuanPage() {
  return <LocationPageTemplate data={data} />;
}
