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
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumb items={[{ label: "Destinations" }]} />

      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-1.5 block">
          Directory Directory
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-travel-text tracking-tight mb-2">
          All Destinations in Vietnam
        </h1>
        <p className="text-sm sm:text-base text-travel-subtext max-w-3xl leading-relaxed">
          Explore curated destinations grouped across Vietnam&apos;s three distinct geographical regions. Browse historical hubs, mountain highlands, and idyllic coastal settlements.
        </p>
      </div>

      {/* 2-Column Layout matching Vietnam Coracle (Left: Content, Right: Sticky Sidebar) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Main Area: Takes all available width */}
        <div className="flex-1 min-w-0 space-y-12">
          {regions.map((regKey) => {
            const regInfo = REGIONS[regKey];
            const regCities = cities.filter((c) => c.region === regKey);
            const regPlacesCount = publishedPlaces.filter((p) => p.region === regKey).length;

            return (
              <section key={regKey} className="space-y-4">
                {/* Section Header like "Northern Routes >" in the video */}
                <div className="flex items-center justify-between pb-3 border-b border-travel-border">
                  <div className="flex items-center gap-3">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-travel-text">
                      <Link href={`/regions/${regKey}`} className="hover:text-teal-600 transition-colors">
                        {regInfo.name} &rsaquo;
                      </Link>
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 font-semibold border border-teal-200">
                      {regPlacesCount} places
                    </span>
                  </div>

                  <Link
                    href={`/regions/${regKey}`}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-teal-600 hover:text-teal-700 group"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <p className="text-xs sm:text-sm text-travel-subtext leading-relaxed">
                  {regInfo.tagline}
                </p>

                {/* 3 Cards per row (Cinematic full-bleed card style from the video) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
                  {regCities.map((city) => (
                    <Link
                      key={city.city_slug}
                      href={`/cities/${city.city_slug}`}
                      className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden shadow-card hover:shadow-2xl transition-all duration-300 flex flex-col justify-end bg-slate-900 border border-travel-border"
                    >
                      {/* Full bleed image */}
                      {city.photo_url ? (
                        <Image
                          src={city.photo_url}
                          alt={city.city}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-teal-400 bg-slate-800">
                          <MapPin className="w-10 h-10 opacity-50" />
                        </div>
                      )}

                      {/* Smooth dark gradient at the bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

                      {/* Top badge */}
                      <div className="absolute top-3 left-3 z-10 pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/50 backdrop-blur-md text-white border border-white/10">
                          {city.count} Places Listed
                        </span>
                      </div>

                      {/* Content overlay on the bottom */}
                      <div className="relative z-10 p-5 text-white">
                        <span className="text-[11px] uppercase tracking-wider text-teal-300 font-semibold block mb-1">
                          {city.region} Vietnam
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-teal-300 transition-colors mb-2">
                          {city.city}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/15">
                          <span>Explore directory</span>
                          <span className="text-teal-300 font-semibold group-hover:translate-x-1 transition-transform">
                            &rarr;
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Right Sidebar: Perfectly sticky & matching Vietnam Coracle */}
        <div className="w-full lg:w-[330px] xl:w-[350px] shrink-0">
          <TravelBookingSidebar className="sticky top-20" />
        </div>
      </div>
    </div>
  );
}
