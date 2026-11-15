import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPlaces, getCities } from "@/data/places";
import { REGIONS } from "@/data/regions";
import Breadcrumb from "@/components/Breadcrumb";
import TravelBookingSidebar from "@/components/TravelBookingSidebar";
import { MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: `All Destinations in Vietnam`,
  description:
    "Browse travel destinations across North, Central, and South Vietnam. Discover cities, imperial towns, and coastal retreats.",
};

export default function DestinationsPage() {
  const cities = getCities();
  const publishedPlaces = getPublishedPlaces();

  const regions: ("north" | "central" | "south")[] = ["north", "central", "south"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Destinations" }]} />

      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-2 block">
          Directory Directory
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-travel-text tracking-tight mb-4">
          All Destinations in Vietnam
        </h1>
        <p className="text-base text-travel-subtext max-w-3xl leading-relaxed">
          Explore curated destinations grouped across Vietnam&apos;s three distinct geographical regions. Browse historical hubs, mountain highlands, and idyllic coastal settlements.
        </p>
      </div>

      {/* 2-Column Editorial Layout (Main Content + Right Booking Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Main Area: Regional Sections & Cities */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-12">
          {regions.map((regKey) => {
            const regInfo = REGIONS[regKey];
            const regCities = cities.filter((c) => c.region === regKey);
            const regPlacesCount = publishedPlaces.filter((p) => p.region === regKey).length;

            return (
              <section
                key={regKey}
                className="bg-white rounded-3xl border border-travel-border p-6 sm:p-8 shadow-card"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-travel-border gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          regKey === "north"
                            ? "bg-teal-500"
                            : regKey === "central"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                      />
                      <span className="text-xs font-semibold uppercase tracking-wider text-travel-subtext">
                        {regPlacesCount} places published
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-travel-text">
                      {regInfo.name}
                    </h2>
                    <p className="text-sm text-travel-subtext mt-1 max-w-2xl">
                      {regInfo.tagline}
                    </p>
                  </div>

                  <Link
                    href={`/regions/${regKey}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-medium text-xs sm:text-sm transition-colors shrink-0 min-h-[44px]"
                  >
                    <span>Explore {regInfo.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Grid of cities in this region */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {regCities.map((city) => (
                    <Link
                      key={city.city_slug}
                      href={`/cities/${city.city_slug}`}
                      className="group bg-travel-muted rounded-2xl border border-travel-border overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col"
                    >
                      <div className="relative aspect-[16/10] bg-slate-200 overflow-hidden">
                        {city.photo_url ? (
                          <Image
                            src={city.photo_url}
                            alt={city.city}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-teal-600 bg-teal-50">
                            <MapPin className="w-8 h-8" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-2.5 left-3 right-3 text-white">
                          <h3 className="font-serif text-base font-bold leading-tight">
                            {city.city}
                          </h3>
                        </div>
                      </div>

                      <div className="p-3.5 flex items-center justify-between text-xs text-travel-subtext">
                        <span>{city.count} places</span>
                        <span className="text-teal-600 font-semibold group-hover:translate-x-1 transition-transform">
                          Explore &rarr;
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Right Sidebar: Sticky Trip Booking & Creator Card */}
        <div className="lg:col-span-4 xl:col-span-4">
          <TravelBookingSidebar className="sticky top-24" />
        </div>
      </div>
    </div>
  );
}
