"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

export interface GalleryPhoto {
  src: string;
  credit_name: string;
  license: string;
  source_url: string;
}

interface PlaceGalleryProps {
  placeName: string;
  photos?: GalleryPhoto[];
}

export default function PlaceGallery({ placeName, photos }: PlaceGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const isOpen = selectedIndex !== null;
  const currentPhoto = isOpen && photos ? photos[selectedIndex] : null;

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    if (!photos || photos.length === 0) return;
    setSelectedIndex((prev) => (prev === null ? 0 : (prev - 1 + photos.length) % photos.length));
  }, [photos]);

  const handleNext = useCallback(() => {
    if (!photos || photos.length === 0) return;
    setSelectedIndex((prev) => (prev === null ? 0 : (prev + 1) % photos.length));
  }, [photos]);

  // Keyboard navigation (Esc to close, Left/Right arrows to browse)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling while lightbox is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleClose, handlePrev, handleNext]);

  // Requirement: Only render if gallery_photos has >= 1 photo
  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 pt-4 border-t border-travel-border/60">
      {/* Title */}
      <div className="flex items-center gap-2">
        <Camera className="w-5 h-5 text-teal-600" />
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-travel-text">
          More photos of {placeName}
        </h2>
      </div>

      {/* Grid: Mobile 2 columns, Desktop 3 columns */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
        {photos.map((photo, index) => (
          <figure
            key={index}
            className="group rounded-2xl overflow-hidden border border-travel-border bg-white shadow-sm flex flex-col hover:shadow-card-hover transition-all duration-300"
          >
            {/* 4:3 Ratio Image container */}
            <div
              onClick={() => setSelectedIndex(index)}
              className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden cursor-pointer"
            >
              <Image
                src={photo.src}
                alt={`${placeName} photo ${index + 1}`}
                fill
                loading="lazy"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors pointer-events-none" />
            </div>

            {/* Compact Credit Line under each grid photo */}
            <figcaption className="p-2.5 sm:p-3 bg-white text-[11px] sm:text-xs text-travel-subtext border-t border-slate-100 flex flex-col justify-between gap-1 flex-1">
              <span className="line-clamp-1 font-medium text-slate-700">
                Photo: {photo.credit_name || "Wikimedia"} — {photo.license || "CC"}
              </span>
              {photo.source_url && (
                <a
                  href={photo.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800 text-[10px] sm:text-[11px] underline font-medium self-start mt-0.5"
                >
                  <span>via Wikimedia Commons</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && currentPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-sm flex flex-col items-center justify-between p-3 sm:p-6 transition-opacity"
          onClick={handleClose}
        >
          {/* Top Bar: Counter & Close Button */}
          <div
            className="w-full max-w-5xl flex items-center justify-between text-white/90 py-2 px-1 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs sm:text-sm font-medium tracking-wide bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
              {selectedIndex + 1} / {photos.length}
            </span>

            <button
              onClick={handleClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close photo gallery"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Stage: Photo + Navigation */}
          <div
            className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-2 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Button */}
            {photos.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-1 sm:left-4 z-20 p-2 sm:p-3 text-white/80 hover:text-white bg-black/40 hover:bg-black/70 rounded-full backdrop-blur-md transition-all min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}

            {/* Active Image */}
            <div className="relative max-h-[72vh] sm:max-h-[78vh] w-full h-full flex items-center justify-center">
              <Image
                src={currentPhoto.src}
                alt={`${placeName} photo ${selectedIndex + 1}`}
                fill
                priority
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 1024px) 95vw, 1200px"
              />
            </div>

            {/* Next Button */}
            {photos.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-1 sm:right-4 z-20 p-2 sm:p-3 text-white/80 hover:text-white bg-black/40 hover:bg-black/70 rounded-full backdrop-blur-md transition-all min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}
          </div>

          {/* Bottom Bar: Full Attribution & Source Link */}
          <div
            className="w-full max-w-5xl bg-black/60 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-xs sm:text-sm text-white/90 border border-white/10 flex flex-wrap items-center justify-between gap-3 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 min-w-[200px]">
              <p className="font-normal text-slate-200">
                Photo: <span className="font-semibold text-white">{currentPhoto.credit_name || "Wikimedia"}</span> —{" "}
                <span className="text-teal-300 font-medium">{currentPhoto.license || "CC"}</span>, via Wikimedia Commons
              </p>
            </div>

            {currentPhoto.source_url && (
              <a
                href={currentPhoto.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/40 text-teal-200 hover:text-white border border-teal-400/30 transition-colors text-xs font-medium shrink-0 min-h-[36px]"
              >
                <span>View source page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
