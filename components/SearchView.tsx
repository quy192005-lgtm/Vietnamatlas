"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Place, CityInfo } from "@/data/places";
import PlaceCard from "@/components/PlaceCard";
import Breadcrumb from "@/components/Breadcrumb";
import { Search as SearchIcon, X, Sparkles } from "lucide-react";

interface SearchViewProps {
  places: Place[];
  cities: CityInfo[];
}

export default function SearchView({ places, cities }: SearchViewProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setQuery(q);
    }
  }, [searchParams]);

  // 14 Category groups
  const categories = useMemo(() => {
    const set = new Set<string>();
    places.forEach((p) => set.add(p.category_en));
    return ["all", ...Array.from(set).sort()];
  }, [places]);

  // Cities filtered by region if region selected
  const availableCities = useMemo(() => {
    if (selectedRegion === "all") return cities;
    return cities.filter((c) => c.region === selectedRegion);
  }, [cities, selectedRegion]);

  // Search logic
  const filteredPlaces = useMemo(() => {
    const qLower = query.toLowerCase().trim();

    return places.filter((p) => {
      // Keyword match in name_en, name (local Vietnamese), city, or category_en
      const matchQuery =
        !qLower ||
        p.name_en.toLowerCase().includes(qLower) ||
        p.name.toLowerCase().includes(qLower) ||
        p.city.toLowerCase().includes(qLower) ||
        p.category_en.toLowerCase().includes(qLower) ||
        p.desc_en.toLowerCase().includes(qLower);

      // Region filter
      const matchRegion = selectedRegion === "all" || p.region === selectedRegion;

      // City filter
      const matchCity = selectedCity === "all" || p.city_slug === selectedCity;

      // Category filter
      const matchCategory = selectedCategory === "all" || p.category_en === selectedCategory;

      return matchQuery && matchRegion && matchCity && matchCategory;
    });
  }, [places, query, selectedRegion, selectedCity, selectedCategory]);

  const handleResetFilters = () => {
    setQuery("");
    setSelectedRegion("all");
    setSelectedCity("all");
    setSelectedCategory("all");
  };

  const featuredRecommendations = places.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[{ label: "Search" }]} />

      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-2 block">
          Instant Search
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-travel-text tracking-tight mb-3">
          Search Vietnam Places
        </h1>
        <p className="text-sm sm:text-base text-travel-subtext">
          Search by English landmark name, Vietnamese local name, city, or category across {places.length} published places.
        </p>
      </div>

      {/* Search Input and Filters Box */}
      <div className="bg-white rounded-3xl border border-travel-border p-6 shadow-card space-y-4">
        {/* Keyword input */}
        <div className="relative flex items-center">
          <SearchIcon className="w-5 h-5 text-teal-600 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a place name (e.g., Hoan Kiem, Dragon Bridge, Hoi An, Ben Thanh)..."
            className="w-full pl-12 pr-10 py-3.5 bg-travel-muted border border-travel-border rounded-2xl text-sm sm:text-base text-travel-text placeholder-travel-subtext focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all min-h-[44px]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3.5 p-1 text-travel-subtext hover:text-travel-text rounded-full"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Region Filter */}
          <div>
            <label className="block text-xs font-medium text-travel-subtext mb-1">
              Region:
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedCity("all"); // reset city when region changes
              }}
              className="w-full px-3 py-2.5 bg-travel-muted border border-travel-border rounded-xl text-xs sm:text-sm text-travel-text focus:outline-none focus:border-teal-500 min-h-[44px]"
            >
              <option value="all">All Regions</option>
              <option value="north">North Vietnam</option>
              <option value="central">Central Vietnam</option>
              <option value="south">South Vietnam</option>
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-xs font-medium text-travel-subtext mb-1">
              City / Province:
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2.5 bg-travel-muted border border-travel-border rounded-xl text-xs sm:text-sm text-travel-text focus:outline-none focus:border-teal-500 min-h-[44px]"
            >
              <option value="all">All Cities</option>
              {availableCities.map((c) => (
                <option key={c.city_slug} value={c.city_slug}>
                  {c.city} ({c.count})
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-medium text-travel-subtext mb-1">
              Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-travel-muted border border-travel-border rounded-xl text-xs sm:text-sm text-travel-text focus:outline-none focus:border-teal-500 min-h-[44px]"
            >
              <option value="all">All Categories</option>
              {categories
                .filter((c) => c !== "all")
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Results count & reset */}
        <div className="flex items-center justify-between pt-2 text-xs text-travel-subtext">
          <span>
            Found <strong>{filteredPlaces.length}</strong> matching results
          </span>
          {(query || selectedRegion !== "all" || selectedCity !== "all" || selectedCategory !== "all") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-teal-600 hover:text-teal-700 font-semibold underline underline-offset-2"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPlaces.map((place) => (
            <PlaceCard key={place.slug} place={place} />
          ))}
        </div>
      ) : (
        /* Empty State: Friendly advice + 6 featured suggestions */
        <div className="space-y-12">
          <div className="bg-travel-muted rounded-3xl border border-travel-border p-10 text-center max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-travel-text mb-2">
              No places found matching your search
            </h2>
            <p className="text-sm text-travel-subtext mb-6">
              Try checking your spelling, using broader search terms, or resetting the regional filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl text-sm transition-colors min-h-[44px]"
            >
              Clear filters and show all
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-serif text-2xl font-bold text-travel-text">
                Recommended places to explore instead:
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredRecommendations.map((place) => (
                <PlaceCard key={place.slug} place={place} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
