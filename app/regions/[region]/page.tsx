import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SITE_NAME } from "@/config/site";
import { REGIONS } from "@/data/regions";
import { getPlacesByRegion, getCities } from "@/data/places";
import RegionView from "@/components/RegionView";

interface RegionPageProps {
  params: {
    region: string;
  };
}

export function generateStaticParams() {
  return [
    { region: "north" },
    { region: "central" },
    { region: "south" },
  ];
}

export function generateMetadata({ params }: RegionPageProps): Metadata {
  const regKey = params.region as "north" | "central" | "south";
  const region = REGIONS[regKey];
  if (!region) return { title: "Region Not Found" };

  return {
    title: `${region.name} Travel Directory`,
    description: `${region.description.slice(0, 155)}...`,
    openGraph: {
      title: `${region.name} — Directory & Highlights | ${SITE_NAME}`,
      description: region.tagline,
      images: [{ url: region.heroImage }],
    },
  };
}

export default function RegionPage({ params }: RegionPageProps) {
  const regKey = params.region as "north" | "central" | "south";
  const region = REGIONS[regKey];
  if (!region) {
    notFound();
  }

  const places = getPlacesByRegion(regKey);
  const cities = getCities().filter((c) => c.region === regKey);

  return <RegionView region={region} cities={cities} places={places} />;
}
