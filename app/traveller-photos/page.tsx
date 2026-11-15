import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, PHOTO_FORM_URL } from "@/config/site";
import { getAllCommunityPhotos } from "@/data/places";
import Breadcrumb from "@/components/Breadcrumb";
import SharePhotoButton from "@/components/SharePhotoButton";
import {
  Camera,
  UploadCloud,
  CheckCircle2,
  Award,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: `Traveller Photos | ${SITE_NAME}`,
  description:
    "Real photos from people who have actually been there. Browse authentic community photos of Vietnam destinations shared by fellow travellers.",
};

export default function TravellerPhotosPage() {
  const communityPhotos = getAllCommunityPhotos();
  const hasFormUrl = Boolean(PHOTO_FORM_URL && PHOTO_FORM_URL.trim() !== "#");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* 1. BREADCRUMB */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Traveller Photos" },
        ]}
      />

      {/* 2. PAGE HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold uppercase tracking-wider">
          <Camera className="w-4 h-4 text-teal-600" />
          <span>Community Gallery</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-travel-text tracking-tight">
          Photos from Travellers
        </h1>

        <p className="font-sans text-base sm:text-lg text-travel-subtext leading-relaxed">
          Real photos from people who have actually been there. Every picture below was shared by a traveller, reviewed by hand, and published with their name credited.
        </p>

        {/* CTA Button */}
        <div className="pt-2 flex flex-col items-center justify-center gap-2">
          <SharePhotoButton formUrl={PHOTO_FORM_URL} />
          {!hasFormUrl && (
            <span className="text-[11px] text-slate-400">
              * Click to view submission guide or connect Google Form
            </span>
          )}
        </div>
      </div>

      {/* 3. HOW IT WORKS (3 horizontal steps on desktop, stacked on mobile) */}
      <section className="bg-white rounded-3xl border border-travel-border p-6 sm:p-10 shadow-card">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-1 block">
            Simple & Transparent
          </span>
          <h2 className="font-serif text-2xl font-bold text-travel-text">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-travel-muted/60 border border-travel-border/60">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4 font-bold text-lg shadow-xs">
              <UploadCloud className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-serif text-lg font-bold text-travel-text mb-2">
              1. Send your photo
            </h3>
            <p className="text-xs sm:text-sm text-travel-subtext leading-relaxed">
              Submit your best shot through our quick Google Form — it takes less than 1 minute, no account registration on this website needed.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-travel-muted/60 border border-travel-border/60">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 font-bold text-lg shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-serif text-lg font-bold text-travel-text mb-2">
              2. We review it by hand
            </h3>
            <p className="text-xs sm:text-sm text-travel-subtext leading-relaxed">
              Every photo is personally verified by the site curator to ensure authentic travel perspectives and legitimate copyright ownership.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-travel-muted/60 border border-travel-border/60">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 font-bold text-lg shadow-xs">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-serif text-lg font-bold text-travel-text mb-2">
              3. Published with your name
            </h3>
            <p className="text-xs sm:text-sm text-travel-subtext leading-relaxed">
              Approved pictures appear on the respective place page and here in this community gallery, permanently credited with your name.
            </p>
          </div>
        </div>
      </section>

      {/* 4. COMMUNITY PHOTO GALLERY (or Empty State) */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-travel-border pb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-travel-text">
              Community Contributions
            </h2>
            <p className="text-xs sm:text-sm text-travel-subtext mt-1">
              {communityPhotos.length > 0
                ? `Showing ${communityPhotos.length} traveller ${
                    communityPhotos.length === 1 ? "photo" : "photos"
                  } across Vietnam`
                : "Photos submitted by international visitors and local explorers"}
            </p>
          </div>
        </div>

        {communityPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityPhotos.map((photo, idx) => (
              <figure
                key={idx}
                className="group rounded-3xl overflow-hidden border border-travel-border bg-white shadow-card hover:shadow-card-hover transition-all flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={`${photo.place_name_en} — photo by ${photo.credit_name}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <Link
                      href={`/places/${photo.place_slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white text-xs font-medium shadow-sm transition-colors"
                    >
                      <MapPin className="w-3 h-3 text-teal-400" />
                      <span>{photo.place_name_en}</span>
                    </Link>
                  </div>
                </div>

                <figcaption className="p-4 bg-white flex flex-col gap-2 border-t border-slate-100">
                  <div className="text-xs text-travel-subtext">
                    <span className="font-semibold text-slate-800">
                      Photo: {photo.credit_name}
                    </span>{" "}
                    <span className="text-slate-400">— traveller contribution</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {photo.place_city}
                    </span>
                    <Link
                      href={`/places/${photo.place_slug}`}
                      className="text-teal-600 hover:text-teal-700 font-semibold inline-flex items-center gap-1 text-xs"
                    >
                      <span>View place guide</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          /* EMPTY STATE (Exact wording required by NV-13) */
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-travel-border shadow-card max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-2 border border-teal-100">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-travel-text">
              No traveller photos yet — be the first to share yours.
            </h3>
            <p className="text-xs sm:text-sm text-travel-subtext max-w-md mx-auto">
              Have you recently explored a temple, bay, mountain pass, or street food alley in Vietnam? Send us your shot and get featured!
            </p>
            <div className="pt-2">
              <SharePhotoButton formUrl={PHOTO_FORM_URL} />
            </div>
          </div>
        )}
      </section>

      {/* 5. RULES & PERMISSION STATEMENT (Exact wording required by NV-13) */}
      <div className="border-t border-travel-border pt-8 text-center max-w-2xl mx-auto">
        <p className="text-xs text-travel-subtext leading-relaxed italic">
          Only share photos you took yourself. By sending a photo, you give this website permission to publish it with credit to your name.
        </p>
      </div>
    </div>
  );
}
