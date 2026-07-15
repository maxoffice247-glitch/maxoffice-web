import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["cmt8"];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  openGraph: {
    images: [
      { url: `/images/og/dia-diem-${data.slug}.jpg`, width: 1200, height: 630 },
    ],
  },
};

export default function Cmt8Page() {
  return <LocationPageTemplate data={data} />;
}
