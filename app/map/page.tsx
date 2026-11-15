import { Metadata } from "next";
import dynamic from "next/dynamic";
import { getPublishedPlaces } from "@/data/places";
import Breadcrumb from "@/components/Breadcrumb";
import { MapPin, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Interactive Travel Map of Vietnam",
  description:
    "Explore published places and landmarks across Vietnam on an interactive OpenStreetMap. Filter by region and category.",
};

const MapLeaflet = dynamic(() => import("@/components/MapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[75vh] bg-travel-muted rounded-3xl border border-travel-border flex flex-col items-center justify-center p-6 text-center animate-pulse">
      <Compass className="w-10 h-10 text-teal-600 animate-spin mb-3" />
      <span className="font-serif text-lg font-bold text-travel-text">
        Loading Interactive Vietnam Map...
      </span>
      <span className="text-xs text-travel-subtext mt-1">
        Preparing landmarks and OpenStreetMap tiles
      </span>
    </div>
  ),
});

export default function MapPage() {
  const publishedPlaces = getPublishedPlaces();
  const geoPlacesCount = publishedPlaces.filter((p) => p.lat !== null && p.lng !== null).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumb items={[{ label: "Interactive Map" }]} />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-1 block">
            Geographic Explorer
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-travel-text tracking-tight">
            Vietnam Interactive Map
          </h1>
          <p className="text-xs sm:text-sm text-travel-subtext mt-1 max-w-2xl">
            Explore {geoPlacesCount} geocoded locations across Vietnam. Filter by geographic region or category, and click any pin to inspect summary details.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold self-start sm:self-auto">
          <MapPin className="w-3.5 h-3.5" />
          <span>{geoPlacesCount} Map Pins Active</span>
        </div>
      </div>

      <MapLeaflet
        places={publishedPlaces}
        initialCenter={[16.0544, 107.5]}
        initialZoom={6}
        height="75vh"
        showFilters={true}
      />
    </div>
  );
}
