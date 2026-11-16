import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SITE_NAME } from "@/config/site";
import { getCities, getPlacesByCity } from "@/data/places";
import { CITIES_DATA } from "@/data/cities";
import CityView from "@/components/CityView";

interface CityPageProps {
  params: {
    city_slug: string;
  };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const cities = await getCities();
  return cities.map((c) => ({
    city_slug: c.city_slug,
  }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const places = await getPlacesByCity(params.city_slug);
  if (places.length === 0) return { title: "City Not Found" };

  const cityName = places[0].city;
  const cityDetails = CITIES_DATA[params.city_slug];

  return {
    title: `${cityName} Travel Directory`,
    description: cityDetails
      ? cityDetails.description
      : `Explore curated places, landmarks, and practical travel information in ${cityName}, Vietnam.`,
    openGraph: {
      title: `${cityName} Travel Guide & Places | ${SITE_NAME}`,
      description: `Browse ${places.length} top places in ${cityName}, Vietnam.`,
      images: places[0]?.photo_url ? [{ url: places[0].photo_url }] : [],
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const places = await getPlacesByCity(params.city_slug);
  if (places.length === 0) {
    notFound();
  }

  const firstPlace = places[0];
  const cityName = firstPlace.city;
  const region = firstPlace.region;
  const cityDetails = CITIES_DATA[params.city_slug];

  return (
    <CityView
      cityName={cityName}
      citySlug={params.city_slug}
      region={region}
      cityDetails={cityDetails}
      places={places}
    />
  );
}
