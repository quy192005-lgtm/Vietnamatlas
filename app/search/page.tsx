import { Suspense } from "react";
import { Metadata } from "next";
import { getPublishedPlaces, getCities } from "@/data/places";
import SearchView from "@/components/SearchView";

export const metadata: Metadata = {
  title: "Search Places in Vietnam",
  description: "Search Vietnam travel directory by English or local Vietnamese name, region, city, or category.",
};

export default function SearchPage() {
  const places = getPublishedPlaces();
  const cities = getCities();

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-travel-subtext">
          Loading search directory...
        </div>
      }
    >
      <SearchView places={places} cities={cities} />
    </Suspense>
  );
}
