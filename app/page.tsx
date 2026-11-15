import Link from "next/link";
import Image from "next/image";
import { SITE_NAME, SITE_TAGLINE } from "@/config/site";
import { AFFILIATES } from "@/config/affiliates";
import { getPublishedPlaces, getCities, getPlacesByRegion } from "@/data/places";
import { REGIONS } from "@/data/regions";
import { getAllGuides } from "@/data/guides";
import PlaceCard from "@/components/PlaceCard";
import SectionHeading from "@/components/SectionHeading";
import AdSlot from "@/components/AdSlot";
import TravelBookingSidebar from "@/components/TravelBookingSidebar";
import {
  Search,
  Train,
  Hotel,
  Ticket,
  Smartphone,
  Compass,
  ArrowRight,
  MapPin,
  ExternalLink,
} from "lucide-react";

export default function HomePage() {
  const publishedPlaces = getPublishedPlaces();
  const topCities = getCities().slice(0, 8);
  const featuredPlaces = publishedPlaces.slice(0, 12);
  const guides = getAllGuides();

  // Region stats
  const northCount = getPlacesByRegion("north").length;
  const centralCount = getPlacesByRegion("central").length;
  const southCount = getPlacesByRegion("south").length;

  return (
    <div className="flex flex-col gap-10 sm:gap-14 pb-16">
      {/* 1. HERO SECTION (Full Width Cinematic Banner) */}
      <section className="relative min-h-[540px] sm:min-h-[600px] flex items-center justify-center bg-slate-900 text-white overflow-hidden">
        {/* Real photo background (Hoi An Ancient Town - Steffen Schmitz, CC BY-SA 4.0) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-06.jpg/1920px-H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-06.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail"
            alt="Hoi An Ancient Town by night"
            fill
            priority
            className="object-cover opacity-45 brightness-90"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60" />
        </div>

        {/* Hero Photo Credit (LAW 2) */}
        <div className="absolute bottom-3 right-4 z-20 text-[10px] text-white/70 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
          <span>Photo: Steffen Schmitz — CC BY-SA 4.0, via Wikimedia Commons</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-16 sm:py-20">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-teal-500/20 text-teal-300 border border-teal-400/30 backdrop-blur-md mb-6">
            <Compass className="w-3.5 h-3.5" />
            Vietnam Directory &amp; Practical Guides
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            {SITE_NAME}
          </h1>

          <p className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
            {SITE_TAGLINE}. Browse curated landmarks, scenic trails, and transparent travel advice.
          </p>

          {/* Large Search Bar */}
          <form
            action="/search"
            method="GET"
            className="max-w-2xl mx-auto mb-8 relative flex items-center bg-white rounded-2xl p-2 shadow-2xl border border-white/20"
          >
            <div className="pl-4 pr-2 text-teal-600">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              name="q"
              placeholder="Search places by English or local name (e.g. Hoan Kiem, Dragon Bridge)..."
              className="w-full py-2.5 text-sm sm:text-base text-travel-text placeholder-travel-subtext/70 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl text-sm transition-colors shadow-sm shrink-0 min-h-[44px]"
            >
              Search
            </button>
          </form>

          {/* Quick Region Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <span className="text-slate-300 font-medium mr-1">Quick explore:</span>
            <Link
              href="/regions/north"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-colors min-h-[44px] inline-flex items-center"
            >
              North Vietnam
            </Link>
            <Link
              href="/regions/central"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-colors min-h-[44px] inline-flex items-center"
            >
              Central Vietnam
            </Link>
            <Link
              href="/regions/south"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-colors min-h-[44px] inline-flex items-center"
            >
              South Vietnam
            </Link>
          </div>
        </div>
      </section>

      {/* 2-COLUMN MAIN LAYOUT (Left: Content, Right: Vietnam Coracle Style Sticky Sidebar) */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-10 items-start">
          {/* LEFT MAIN AREA */}
          <div className="flex-1 min-w-0 space-y-16">
            {/* 2. THREE REGIONAL CARDS */}
            <section className="w-full">
              <SectionHeading
                tag="Geographic Regions"
                title="Explore Vietnam by Region"
                subtitle="Three distinct worlds of cuisine, climate, and heritage stretching over 1,650 kilometers."
                viewAllHref="/destinations"
                viewAllText="View all regions"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* North */}
                <Link
                  href="/regions/north"
                  className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover border border-travel-border flex flex-col min-h-[380px] bg-slate-900"
                >
                  <Image
                    src={REGIONS.north.heroImage}
                    alt={REGIONS.north.name}
                    fill
                    className="object-cover opacity-65 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white">
                    <span className="text-xs uppercase tracking-wider text-teal-400 font-semibold mb-1">
                      {northCount} places published
                    </span>
                    <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-teal-300 transition-colors">
                      {REGIONS.north.name}
                    </h3>
                    <p className="text-xs text-slate-200 line-clamp-2 mb-4 leading-relaxed">
                      {REGIONS.north.tagline}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
                      <span>Explore North</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>

                {/* Central */}
                <Link
                  href="/regions/central"
                  className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover border border-travel-border flex flex-col min-h-[380px] bg-slate-900"
                >
                  <Image
                    src={REGIONS.central.heroImage}
                    alt={REGIONS.central.name}
                    fill
                    className="object-cover opacity-65 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white">
                    <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1">
                      {centralCount} places published
                    </span>
                    <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-amber-300 transition-colors">
                      {REGIONS.central.name}
                    </h3>
                    <p className="text-xs text-slate-200 line-clamp-2 mb-4 leading-relaxed">
                      {REGIONS.central.tagline}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                      <span>Explore Central</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>

                {/* South */}
                <Link
                  href="/regions/south"
                  className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover border border-travel-border flex flex-col min-h-[380px] bg-slate-900"
                >
                  <Image
                    src={REGIONS.south.heroImage}
                    alt={REGIONS.south.name}
                    fill
                    className="object-cover opacity-65 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white">
                    <span className="text-xs uppercase tracking-wider text-rose-400 font-semibold mb-1">
                      {southCount} places published
                    </span>
                    <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-rose-300 transition-colors">
                      {REGIONS.south.name}
                    </h3>
                    <p className="text-xs text-slate-200 line-clamp-2 mb-4 leading-relaxed">
                      {REGIONS.south.tagline}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                      <span>Explore South</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            </section>

            {/* 3. TOP DESTINATIONS (8 CITIES GRID) */}
            <section className="bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-travel-border">
              <SectionHeading
                tag="Key Hubs"
                title="Top Destinations"
                subtitle="The most popular gateway cities and cultural centers across Vietnam."
                viewAllHref="/destinations"
                viewAllText="All destinations"
              />

              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                {topCities.map((city) => (
                  <Link
                    key={city.city_slug}
                    href={`/cities/${city.city_slug}`}
                    className="group bg-white rounded-2xl border border-travel-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                      {city.photo_url ? (
                        <Image
                          src={city.photo_url}
                          alt={city.city}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-teal-50 flex items-center justify-center text-teal-600">
                          <MapPin className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2.5 left-3 right-3 text-white">
                        <span className="text-[10px] uppercase tracking-wider text-teal-300 font-semibold block">
                          {city.region}
                        </span>
                        <h4 className="font-serif text-base sm:text-lg font-bold leading-tight">
                          {city.city}
                        </h4>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 flex items-center justify-between text-xs text-travel-subtext">
                      <span>{city.count} places listed</span>
                      <span className="text-teal-600 font-medium group-hover:translate-x-1 transition-transform">
                        View &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 4. FEATURED PLACES (12 PLACES - CINEMATIC CARDS) */}
            <section className="w-full">
              <SectionHeading
                tag="Curated Directory"
                title="Featured Places in Vietnam"
                subtitle="A handpicked selection of iconic temples, historic landmarks, emerald waters, and natural wonders."
                viewAllHref="/destinations"
                viewAllText="See all places"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {featuredPlaces.map((place) => (
                  <PlaceCard key={place.slug} place={place} />
                ))}
              </div>

              <div className="mt-10 text-center">
                <Link
                  href="/destinations"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl text-sm shadow-sm transition-colors min-h-[44px]"
                >
                  <span>Explore All Published Places</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>

            {/* 5. PRACTICAL GUIDES (4 ARTICLES) */}
            <section className="bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-travel-border">
              <SectionHeading
                tag="Field Advice"
                title="Practical Travel Guides"
                subtitle="Essential guides written by locals to navigate trains, mobile data, e-visas, and airport arrivals safely."
                viewAllHref="/guides"
                viewAllText="All guides"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {guides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group bg-white rounded-2xl border border-travel-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                      <Image
                        src={guide.heroImage}
                        alt={guide.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-md text-teal-700 shadow-sm">
                          {guide.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <span className="text-[11px] text-travel-subtext mb-1">
                        {guide.readingTime}
                      </span>
                      <h3 className="font-serif text-sm font-bold text-travel-text group-hover:text-teal-600 transition-colors line-clamp-2 mb-2">
                        {guide.title}
                      </h3>
                      <p className="text-xs text-travel-subtext line-clamp-2 leading-relaxed mb-4 flex-1">
                        {guide.subtitle}
                      </p>
                      <div className="pt-3 border-t border-travel-border text-xs font-semibold text-teal-600 flex items-center justify-between">
                        <span>Read guide</span>
                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 6. PLAN YOUR TRIP STRIP (AFFILIATE PARTNERS - LAW 4) */}
            <section className="w-full">
              <div className="bg-gradient-to-br from-teal-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-3xl mb-8">
                  <span className="text-xs font-semibold uppercase tracking-wider text-teal-300 mb-2 block">
                    Trip Preparation
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                    Plan Your Trip Across Vietnam
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    We recommend verified services we use ourselves. Book early for holidays and secure high-speed mobile data before boarding your flight.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 relative z-10">
                  {/* 12Go: Trains & Buses */}
                  <a
                    href={AFFILIATES.twelveGo}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md transition-all group min-h-[44px]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Train className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-slate-300 block">Trains &amp; Buses</span>
                      <span className="font-semibold text-xs text-white group-hover:text-teal-300 transition-colors flex items-center gap-1">
                        Book on 12Go <ExternalLink className="w-3 h-3 opacity-60" />
                      </span>
                    </div>
                  </a>

                  {/* Booking: Hotels */}
                  <a
                    href={AFFILIATES.booking}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md transition-all group min-h-[44px]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Hotel className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-slate-300 block">Accommodations</span>
                      <span className="font-semibold text-xs text-white group-hover:text-teal-300 transition-colors flex items-center gap-1">
                        Booking.com <ExternalLink className="w-3 h-3 opacity-60" />
                      </span>
                    </div>
                  </a>

                  {/* Klook: Tours & Tickets */}
                  <a
                    href={AFFILIATES.klook}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md transition-all group min-h-[44px]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-slate-300 block">Tours &amp; Tickets</span>
                      <span className="font-semibold text-xs text-white group-hover:text-teal-300 transition-colors flex items-center gap-1">
                        Klook Activities <ExternalLink className="w-3 h-3 opacity-60" />
                      </span>
                    </div>
                  </a>

                  {/* Airalo: eSIM */}
                  <a
                    href={AFFILIATES.airalo}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md transition-all group min-h-[44px]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-slate-300 block">Vietnam eSIM</span>
                      <span className="font-semibold text-xs text-white group-hover:text-teal-300 transition-colors flex items-center gap-1">
                        Get Airalo Data <ExternalLink className="w-3 h-3 opacity-60" />
                      </span>
                    </div>
                  </a>
                </div>

                <p className="mt-5 text-[10px] text-slate-400 relative z-10">
                  * We earn an affiliate commission on qualifying bookings at no extra cost to you.
                </p>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: STICKY SIDEBAR (Matching Vietnam Coracle video) */}
          <div className="w-full lg:w-[330px] xl:w-[350px] shrink-0">
            <TravelBookingSidebar className="sticky top-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
