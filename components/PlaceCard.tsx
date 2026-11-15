import Link from "next/link";
import Image from "next/image";
import { Place } from "@/data/places";
import { MapPin, ExternalLink, Compass, ArrowRight } from "lucide-react";

interface PlaceCardProps {
  place: Place;
  priority?: boolean;
}

export default function PlaceCard({ place, priority = false }: PlaceCardProps) {
  const isPhotoMissing = place.photo_status !== "ok" || !place.photo_url;

  return (
    <article className="group relative aspect-[3/4] sm:aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-lg border border-travel-border bg-slate-900 flex flex-col justify-end transition-all duration-300 hover:shadow-2xl">
      {/* Background Image / Placeholder */}
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
          {/* Deep dark gradient overlay matching Vietnam Coracle's card style */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />
        </>
      ) : (
        /* LAW 3: Elegant placeholder if missing photo */
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-teal-900 via-slate-900 to-black text-center">
          <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center mb-2 border border-teal-500/30">
            <Compass className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-300 mb-1">
            {place.category_en}
          </span>
          <span className="text-[10px] text-slate-400">Photo pending</span>
        </div>
      )}

      {/* Top badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/50 backdrop-blur-md text-white border border-white/10 shadow-sm">
          {place.category_en}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/50 backdrop-blur-md text-teal-300 border border-white/10 shadow-sm">
          <MapPin className="w-3 h-3" />
          {place.city}
        </span>
      </div>

      {/* Card Content Overlay (At the bottom of the card like Vietnam Coracle) */}
      <div className="relative z-10 p-4 sm:p-5 text-white flex flex-col">
        {/* Title in bold serif font */}
        <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight leading-snug text-white group-hover:text-teal-300 transition-colors mb-2 line-clamp-2">
          <Link href={`/places/${place.slug}`}>
            {place.name_en}
          </Link>
        </h3>

        {/* 2-line Description */}
        <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed mb-3">
          {place.desc_en}
        </p>

        {/* Bottom row: LAW 2 photo credit + action link */}
        <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[10px] text-white/70">
          <span className="truncate max-w-[170px]">
            {place.photo_credit ? `${place.photo_credit} — ${place.photo_license}` : "Wikimedia"}
          </span>

          <Link
            href={`/places/${place.slug}`}
            className="inline-flex items-center gap-1 text-teal-300 group-hover:text-white font-semibold shrink-0"
          >
            <span>Read</span>
            <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
