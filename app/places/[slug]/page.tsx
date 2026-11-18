import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/config/site";
import { AFFILIATES } from "@/config/affiliates";
import { getPublishedPlaces, getPlaceBySlug, getNearbyPlaces } from "@/data/places";
import Breadcrumb from "@/components/Breadcrumb";
import PlaceCard from "@/components/PlaceCard";
import AdSlot from "@/components/AdSlot";
import SharePhotoCard from "@/components/SharePhotoCard";
import PlaceGallery from "@/components/PlaceGallery";
import {
  MapPin,
  ExternalLink,
  Compass,
  Navigation,
  Hotel,
  Ticket,
  Train,
  Camera,
} from "lucide-react";

interface PlacePageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const published = await getPublishedPlaces();
  return published.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const place = await getPlaceBySlug(params.slug);
  if (!place) return { title: "Place Not Found" };

  const metaDesc =
    place.desc_en.length > 155
      ? `${place.desc_en.slice(0, 152)}...`
      : place.desc_en;

  return {
    title: `${place.name_en} — ${place.city}`,
    description: metaDesc,
    openGraph: {
      title: `${place.name_en} — ${place.city} | ${SITE_NAME}`,
      description: metaDesc,
      type: "article",
      images: place.photo_status === "ok" && place.photo_url ? [{ url: place.photo_url }] : [],
    },
  };
}

export default async function PlaceDetailPage({ params }: PlacePageProps) {
  const place = await getPlaceBySlug(params.slug);
  if (!place) {
    notFound();
  }

  const nearbyPlaces = await getNearbyPlaces(place, 4);
  const isPhotoMissing = place.photo_status !== "ok" || !place.photo_url;
  const regionLabel = `${place.region.charAt(0).toUpperCase() + place.region.slice(1)} Vietnam`;

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. BREADCRUMB */}
      <Breadcrumb
        items={[
          { label: "Destinations", href: "/destinations" },
          { label: regionLabel, href: `/regions/${place.region}` },
          { label: place.city, href: `/cities/${place.city_slug}` },
          { label: place.name_en },
        ]}
      />

      {/* 2. LARGE HERO PHOTO (or elegant placeholder) + LAW 2 MANDATORY CREDIT */}
      <div className="relative rounded-3xl overflow-hidden bg-travel-muted border border-travel-border shadow-card aspect-[16/10] sm:aspect-[21/9]">
        {!isPhotoMissing ? (
          <>
            <Image
              src={place.photo_url}
              alt={place.name_en}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

            {/* LAW 2: Photo credit bottom line */}
            <div className="absolute bottom-3 left-4 right-4 text-xs text-white/90 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
              <span className="truncate">
                Photo: {place.photo_credit || "Wikimedia"} — {place.photo_license || "CC"}, via Wikimedia Commons
              </span>
              {place.photo_page && (
                <a
                  href={place.photo_page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-teal-300 hover:text-white underline font-medium"
                >
                  View source page <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </>
        ) : (
          /* LAW 3: Placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-teal-50 via-travel-muted to-slate-100 text-center">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-3 shadow-sm">
              <Compass className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-600 mb-1">
              {place.category_en}
            </span>
            <h2 className="font-serif text-2xl font-bold text-travel-text max-w-md">
              {place.name_en}
            </h2>
            <p className="text-xs text-travel-subtext mt-2">
              Photo placeholder — authentic photo will be updated as Wikimedia licensing confirms.
            </p>
          </div>
        )}
      </div>

      {/* 3. HEADER & TITLE */}
      <div className="border-b border-travel-border pb-8">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Link
            href={`/cities/${place.city_slug}`}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors"
          >
            <MapPin className="w-3 h-3 text-teal-600" />
            {place.city}
          </Link>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-travel-muted text-travel-text border border-travel-border">
            {place.category_en}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-travel-subtext bg-travel-muted">
            {regionLabel}
          </span>
        </div>

        {/* English Title */}
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-travel-text tracking-tight mb-2">
          {place.name_en}
        </h1>

        {/* LAW 1: Secondary Vietnamese local name */}
        <p className="text-sm sm:text-base text-travel-subtext font-normal italic">
          Local name: <span className="not-italic font-medium text-travel-text">{place.name}</span>
        </p>
      </div>

      {/* 4. MAIN DESCRIPTION */}
      <div className="prose prose-slate max-w-none">
        <p className="font-sans text-lg sm:text-xl text-travel-text leading-relaxed font-normal">
          {place.desc_en}
        </p>
      </div>

      {/* NV-16B: SUPPLEMENTARY WIKIMEDIA PHOTO GALLERY */}
      <PlaceGallery
        placeName={place.name_en}
        photos={place.gallery_photos}
      />

      {/* NV-12 & NV-13: PHOTOS FROM TRAVELLERS (COMMUNITY GALLERY) */}
      {place.extra_photos && place.extra_photos.length > 0 && (
        <section className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-teal-600" />
            <h2 className="font-serif text-2xl font-bold text-travel-text">
              Photos from travellers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {place.extra_photos.map((photo, idx) => (
              <figure
                key={idx}
                className="group rounded-2xl overflow-hidden border border-travel-border bg-white shadow-sm flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={`${place.name_en} — photo by ${photo.credit_name}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <figcaption className="p-3 bg-white text-xs text-travel-subtext border-t border-slate-100">
                  <span className="font-medium text-slate-700">
                    Photo: {photo.credit_name}
                  </span>{" "}
                  <span className="text-slate-400">— traveller contribution</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* 5. GOOD TO KNOW (TABLE / INFO GRID) */}
      <section className="bg-travel-muted rounded-3xl border border-travel-border p-6 sm:p-8">
        <h2 className="font-serif text-xl font-bold text-travel-text mb-4 flex items-center gap-2">
          <Compass className="w-5 h-5 text-teal-600" />
          Good to Know
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
          <div className="bg-white p-4 rounded-2xl border border-travel-border flex flex-col">
            <span className="text-xs text-travel-subtext uppercase tracking-wider mb-1">
              Location
            </span>
            <span className="font-medium text-travel-text">
              {place.city}, {regionLabel}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-travel-border flex flex-col">
            <span className="text-xs text-travel-subtext uppercase tracking-wider mb-1">
              Category
            </span>
            <span className="font-medium text-travel-text">
              {place.category_en}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-travel-border flex flex-col">
            <span className="text-xs text-travel-subtext uppercase tracking-wider mb-1">
              Coordinates
            </span>
            <span className="font-medium text-travel-text font-mono text-xs">
              {place.lat !== null && place.lng !== null
                ? `${place.lat.toFixed(6)}, ${place.lng.toFixed(6)}`
                : "Not geocoded"}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-travel-border flex flex-col">
            <span className="text-xs text-travel-subtext uppercase tracking-wider mb-1">
              Curated Status
            </span>
            <span className="font-medium text-teal-700 flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              Published Directory Listing
            </span>
          </div>
        </div>

        {/* Open in Google Maps button */}
        {place.maps_url && (
          <a
            href={place.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl text-sm transition-colors shadow-sm min-h-[44px]"
          >
            <Navigation className="w-4 h-4" />
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        )}
      </section>

      {/* 6. GETTING THERE / PLAN YOUR VISIT (AFFILIATE CTA - LAW 4) */}
      <section className="bg-white rounded-3xl border border-travel-border p-6 sm:p-8 shadow-card">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-600 mb-1 block">
            Plan Your Visit
          </span>
          <h2 className="font-serif text-2xl font-bold text-travel-text">
            Getting to & Staying in {place.city}
          </h2>
          <p className="text-xs sm:text-sm text-travel-subtext mt-1">
            Book transport and accommodation through verified travel partners.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {/* Hotels */}
          <a
            href={AFFILIATES.booking}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="flex items-center gap-3 p-4 rounded-2xl bg-travel-muted hover:bg-blue-50 border border-travel-border hover:border-blue-200 transition-all group min-h-[44px]"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Hotel className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs text-travel-subtext block">Hotels near</span>
              <span className="font-semibold text-xs sm:text-sm text-travel-text group-hover:text-blue-700 truncate block">
                {place.city}
              </span>
            </div>
          </a>

          {/* Tours / Activities */}
          <a
            href={AFFILIATES.klook}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="flex items-center gap-3 p-4 rounded-2xl bg-travel-muted hover:bg-amber-50 border border-travel-border hover:border-amber-200 transition-all group min-h-[44px]"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs text-travel-subtext block">Tours & Tickets</span>
              <span className="font-semibold text-xs sm:text-sm text-travel-text group-hover:text-amber-700 truncate block">
                in {place.city}
              </span>
            </div>
          </a>

          {/* Trains & Buses */}
          <a
            href={AFFILIATES.twelveGo}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="flex items-center gap-3 p-4 rounded-2xl bg-travel-muted hover:bg-terracotta-50 border border-travel-border hover:border-terracotta-200 transition-all group min-h-[44px]"
          >
            <div className="w-10 h-10 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shrink-0">
              <Train className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs text-travel-subtext block">Trains & Buses</span>
              <span className="font-semibold text-xs sm:text-sm text-travel-text group-hover:text-terracotta-700 truncate block">
                to {place.city}
              </span>
            </div>
          </a>
        </div>

        {/* Transparency note */}
        <p className="text-[11px] text-travel-subtext italic">
          * Transparent disclosure: We may earn a small referral commission if you complete a booking through these partner links, at no additional cost to you.
        </p>
      </section>

      {/* NV-12 & NV-13: SHARE YOUR PHOTO CALLOUT */}
      <SharePhotoCard placeNameEn={place.name_en} />

      {/* 7. NV-10: AdSlot before Nearby places */}
      <AdSlot format="horizontal" />

      {/* 8. NEARBY PLACES */}
      {nearbyPlaces.length > 0 && (
        <section className="pt-6 border-t border-travel-border">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-1 block">
              More to Explore
            </span>
            <h2 className="font-serif text-2xl font-bold text-travel-text">
              Nearby Places in {place.city} & {regionLabel}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nearbyPlaces.map((np) => (
              <PlaceCard key={np.slug} place={np} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
