import Link from "next/link";
import Image from "next/image";
import { Place } from "@/data/places";
import { MapPin, ExternalLink, Compass } from "lucide-react";

interface PlaceCardProps {
  place: Place;
  priority?: boolean;
}

export default function PlaceCard({ place, priority = false }: PlaceCardProps) {
  const isPhotoMissing = place.photo_status !== "ok" || !place.photo_url;

  return (
    <article className="group bg-white rounded-2xl border border-travel-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col h-full">
      {/* Photo Container (4:3 Aspect Ratio) */}
      <div className="relative aspect-[4/3] w-full bg-travel-muted overflow-hidden">
        {!isPhotoMissing ? (
          <>
            <Image
              src={place.photo_url}
              alt={place.name_en}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient overlay for text readability of credit */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2.5 pt-6 pointer-events-none" />
            
            {/* LAW 2: Mandatory Photo Credit Line */}
            <div className="absolute bottom-1.5 left-2 right-2 text-[10px] text-white/90 truncate flex items-center justify-between pointer-events-auto z-10">
              <span className="truncate">
                Photo: {place.photo_credit || "Wikimedia"} — {place.photo_license || "CC"}
              </span>
              {place.photo_page && (
                <a
                  href={place.photo_page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 hover:text-white underline ml-1 shrink-0"
                  title="View photo source on Wikimedia Commons"
                >
                  source <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </>
        ) : (
          /* LAW 3: Elegant placeholder for missing photos - never fake stock */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-teal-50 via-travel-muted to-slate-100 text-center border-b border-travel-border">
            <div className="w-12 h-12 rounded-full bg-teal-100/80 text-teal-600 flex items-center justify-center mb-2 shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-1">
              {place.category_en}
            </span>
            <p className="font-serif text-sm font-semibold text-travel-text line-clamp-2 px-2">
              {place.name_en}
            </p>
            <span className="text-[10px] text-travel-subtext mt-1">Photo pending community update</span>
          </div>
        )}

        {/* Category Badge on top left */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-teal-700 shadow-sm border border-black/5">
            {place.category_en}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* City and Region */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-travel-subtext mb-1.5">
          <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
          <span className="truncate">{place.city}</span>
          <span className="text-travel-border">•</span>
          <span className="capitalize">{place.region}</span>
        </div>

        {/* Place English Name */}
        <h3 className="font-serif text-lg font-bold text-travel-text group-hover:text-teal-600 transition-colors line-clamp-1 mb-2">
          <Link href={`/places/${place.slug}`} className="hover:underline">
            {place.name_en}
          </Link>
        </h3>

        {/* English Description (2 lines clamp) */}
        <p className="text-xs sm:text-sm text-travel-subtext line-clamp-2 leading-relaxed mb-4 flex-1">
          {place.desc_en}
        </p>

        {/* Bottom Action Link */}
        <div className="pt-3 border-t border-travel-border/80 flex items-center justify-between text-xs font-semibold text-teal-600 group-hover:text-teal-700">
          <span>Explore details</span>
          <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
        </div>
      </div>
    </article>
  );
}
