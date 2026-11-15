"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Place, CityInfo } from "@/data/places";
import { RegionInfo } from "@/data/regions";
import PlaceCard from "@/components/PlaceCard";
import Breadcrumb from "@/components/Breadcrumb";
import AdSlot from "@/components/AdSlot";
import TravelBookingSidebar from "@/components/TravelBookingSidebar";
import { MapPin, Filter, Sun, Calendar } from "lucide-react";

interface RegionViewProps {
  region: RegionInfo;
  cities: CityInfo[];
  places: Place[];
}

export default function RegionView({ region, cities, places }: RegionViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Extract unique categories in this region
  const categories = useMemo(() => {
    const set = new Set<string>();
    places.forEach((p) => set.add(p.category_en));
    return ["All", ...Array.from(set).sort()];
  }, [places]);

  // Filtered places
  const filteredPlaces = useMemo(() => {
    if (selectedCategory === "All") return places;
    return places.filter((p) => p.category_en === selectedCategory);
  }, [places, selectedCategory]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumb
        items={[
          { label: "Destinations", href: "/destinations" },
          { label: region.name },
        ]}
      />

      {/* Main 2-column layout: Left Expansive + Right Sticky 330px */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left main content */}
        <div className="flex-1 min-w-0 space-y-10">
          {/* Hero Banner for Region */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[340px] flex items-end p-6 sm:p-8 shadow-xl">
            <Image
              src={region.heroImage}
              alt={region.name}
              fill
              priority
              className="object-cover opacity-45"
              sizes="(max-width: 1024px) 100vw, 900px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Photo Credit */}
            <div className="absolute top-4 right-4 z-20 text-[10px] text-white/80 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
              <span>
                Photo: {region.photoCredit} — {region.photoLicense}
              </span>
              {region.photoPage && (
                <a
                  href={region.photoPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline ml-1"
                >
                  source
                </a>
              )}
            </div>

            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-300 mb-1.5 block">
                Regional Guide • {places.length} Places Published
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
                {region.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                {region.description}
              </p>

              {/* Climate & Best Time Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-white/20 text-xs">
                <div className="flex items-start gap-2 bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
                  <Sun className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white text-[11px]">Climate:</span>
                    <span className="text-slate-300 text-[11px]">{region.climate}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
                  <Calendar className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white text-[11px]">Best Season:</span>
                    <span className="text-slate-300 text-[11px]">{region.bestTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cities in this Region */}
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-travel-text mb-3">
              Cities & Hubs in {region.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {cities.map((city) => (
                <Link
                  key={city.city_slug}
                  href={`/cities/${city.city_slug}`}
                  className="group bg-white rounded-2xl border border-travel-border overflow-hidden hover:shadow-card-hover transition-all flex flex-col"
                >
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    {city.photo_url ? (
                      <Image
                        src={city.photo_url}
                        alt={city.city}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-teal-600 bg-teal-50">
                        <MapPin className="w-6 h-6" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3 text-white">
                      <h3 className="font-serif text-sm sm:text-base font-bold leading-tight">
                        {city.city}
                      </h3>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between text-xs text-travel-subtext">
                    <span>{city.count} places</span>
                    <span className="text-teal-600 font-medium">Explore &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Places in this Region with Category Filter */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-travel-border">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-travel-text">
                  All Places in {region.name}
                </h2>
                <p className="text-xs text-travel-subtext mt-0.5">
                  Showing {filteredPlaces.length} of {places.length} published landmarks
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-travel-subtext">
                <Filter className="w-4 h-4 text-teal-500" />
                <span>Filter by Category:</span>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[38px] flex items-center ${
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
                  No places found in this category for {region.name}.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className="mt-3 px-4 py-2 bg-teal-500 text-white text-xs font-semibold rounded-xl min-h-[44px]"
                >
                  Reset Category Filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Sidebar */}
        <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0">
          <TravelBookingSidebar currentCity={region.name} className="sticky top-20" />
        </div>
      </div>
    </div>
  );
}
