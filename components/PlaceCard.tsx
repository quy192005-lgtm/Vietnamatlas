import Link from "next/link";
import Image from "next/image";
import { Place } from "@/data/places";
import { MapPin, Compass, ArrowRight } from "lucide-react";

interface PlaceCardProps {
  place: Place;
  priority?: boolean;
}

export default function PlaceCard({ place, priority = false }: PlaceCardProps) {
  const isPhotoMissing = place.photo_status !== "ok" || !place.photo_url;

  return (
    <Link
      href={`/places/${place.slug}`}
      className="group bg-white rounded-2xl border border-travel-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col w-full min-h-[44px]"
    >
      {/* 1. Image on top with fixed aspect ratio (no CLS) */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden shrink-0">
        {!isPhotoMissing ? (
          <Image
            src={place.photo_url}
            alt={place.name_en}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-teal-50/60 text-teal-700 text-center">
            <Compass className="w-8 h-8 mb-1 opacity-70" />
            <span className="text-[11px] font-semibold">{place.category_en}</span>
            <span className="text-[10px] text-teal-600/70">Photo pending</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 text-teal-800 shadow-sm backdrop-blur-sm border border-slate-200/60 truncate">
            {place.category_en}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/60 text-white backdrop-blur-sm shadow-sm truncate">
            <MapPin className="w-3 h-3 text-teal-300 shrink-0" />
            <span className="truncate">{place.city}</span>
          </span>
        </div>
      </div>

      {/* 2. Text Content underneath */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-travel-text group-hover:text-teal-600 transition-colors line-clamp-1 mb-1.5 break-words">
            {place.name_en}
          </h3>
          <p className="text-xs sm:text-sm text-travel-subtext line-clamp-2 leading-relaxed mb-4">
            {place.desc_en}
          </p>
        </div>

        {/* Bottom row: Credit & Read action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-travel-subtext gap-2">
          <span className="truncate max-w-[190px] text-slate-500" title={place.photo_credit || "Wikimedia"}>
            {place.photo_credit ? `${place.photo_credit} — ${place.photo_license}` : "Wikimedia Commons"}
          </span>
          <span className="inline-flex items-center gap-1 text-teal-600 font-semibold group-hover:translate-x-1 transition-transform shrink-0">
            <span>Read</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
