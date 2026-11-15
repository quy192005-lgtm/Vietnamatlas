"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Place } from "@/data/places";
import { CityDetails } from "@/data/cities";
import PlaceCard from "@/components/PlaceCard";
import Breadcrumb from "@/components/Breadcrumb";
import AdSlot from "@/components/AdSlot";
import TravelBookingSidebar from "@/components/TravelBookingSidebar";
import { Filter, Info } from "lucide-react";

// Dynamically import MapLeaflet with ssr: false
const MapLeaflet = dynamic(() => import("@/components/MapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 bg-travel-muted rounded-2xl flex items-center justify-center text-travel-subtext text-xs border border-travel-border animate-pulse">
      Loading city interactive map...
    </div>
  ),
});

interface CityViewProps {
  cityName: string;
  citySlug?: string;
  region: "north" | "central" | "south";
  cityDetails?: CityDetails;
  places: Place[];
}

export default function CityView({
  cityName,
  region,
  cityDetails,
  places,
}: CityViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    places.forEach((p) => set.add(p.category_en));
    return ["All", ...Array.from(set).sort()];
  }, [places]);

  const filteredPlaces = useMemo(() => {
    if (selectedCategory === "All") return places;
    return places.filter((p) => p.category_en === selectedCategory);
  }, [places, selectedCategory]);

  // Find average coordinates for city map center
  const geoPlaces = places.filter((p) => p.lat !== null && p.lng !== null);
  const cityCenter: [number, number] = useMemo(() => {
    if (geoPlaces.length === 0) return [16.0544, 107.5];
    const avgLat = geoPlaces.reduce((sum, p) => sum + (p.lat || 0), 0) / geoPlaces.length;
    const avgLng = geoPlaces.reduce((sum, p) => sum + (p.lng || 0), 0) / geoPlaces.length;
    return [avgLat, avgLng];
  }, [geoPlaces]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumb
        items={[
          { label: "Destinations", href: "/destinations" },
          { label: `${region.charAt(0).toUpperCase() + region.slice(1)} Vietnam`, href: `/regions/${region}` },
          { label: cityName },
        ]}
      />

      {/* Main 2-column layout: Left Expansive + Right Always Sticky */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Left main area */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Header section */}
          <div className="bg-white rounded-3xl border border-travel-border p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                {region.toUpperCase()} VIETNAM • {places.length} PLACES PUBLISHED
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-travel-text tracking-tight mb-2">
              {cityName}
            </h1>

            {cityDetails && (
              <div className="space-y-3 max-w-3xl">
                <p className="text-sm sm:text-base text-travel-subtext leading-relaxed">
                  {cityDetails.description}
                </p>
                {cityDetails.travelTips && (
                  <div className="flex items-start gap-2 bg-travel-muted p-3.5 rounded-xl border border-travel-border text-xs text-travel-text">
                    <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-teal-700">Local travel tip:</strong>{" "}
                      {cityDetails.travelTips}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Places and filter */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-travel-border">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-travel-text">
                  Published Places in {cityName}
                </h2>
                <p className="text-xs text-travel-subtext mt-0.5">
                  Showing {filteredPlaces.length} of {places.length} landmarks
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-travel-subtext">
                <Filter className="w-4 h-4 text-teal-500" />
                <span>Category filter:</span>
              </div>
            </div>

            {/* Category chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[38px] flex items-center ${
                    selectedCategory === cat
                      ? "bg-teal-500 text-white shadow-sm"
                      : "bg-travel-muted text-travel-text hover:bg-teal-50 hover:text-teal-600 border border-travel-border"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Places Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPlaces.map((place, index) => (
                <div key={place.slug} className="contents">
                  <PlaceCard place={place} />
                  {/* AdSlot after the 6th card */}
                  {index === 5 && (
                    <div className="col-span-full">
                      <AdSlot format="horizontal" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredPlaces.length === 0 && (
              <div className="p-12 text-center bg-travel-muted rounded-2xl border border-travel-border">
                <p className="text-travel-subtext text-sm">
                  No places in this category currently listed for {cityName}.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className="mt-3 px-4 py-2 bg-teal-500 text-white text-xs font-semibold rounded-xl min-h-[44px]"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>

          {/* Mini Map at the bottom */}
          {geoPlaces.length > 0 && (
            <section className="bg-white rounded-3xl border border-travel-border p-6 sm:p-7 shadow-card">
              <div className="mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-1 block">
                  Geographic Map
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-travel-text">
                  Map of {cityName} Landmarks
                </h3>
                <p className="text-xs text-travel-subtext mt-1">
                  Grounded on OpenStreetMap. Click any pin to view preview details.
                </p>
              </div>

              <MapLeaflet
                places={geoPlaces}
                initialCenter={cityCenter}
                initialZoom={12}
                height="320px"
                showFilters={false}
              />
            </section>
          )}
        </div>

        {/* Right Sticky Sidebar */}
        <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 lg:self-stretch">
          <div className="sticky top-24 z-30">
            <TravelBookingSidebar currentCity={cityName} />
          </div>
        </div>
      </div>
    </div>
  );
}
