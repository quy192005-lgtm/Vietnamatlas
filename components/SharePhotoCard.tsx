import { Camera, ExternalLink } from "lucide-react";
import { getPhotoSubmissionUrl } from "@/config/site";

interface SharePhotoCardProps {
  placeNameEn: string;
}

export default function SharePhotoCard({ placeNameEn }: SharePhotoCardProps) {
  const formUrl = getPhotoSubmissionUrl(placeNameEn);

  // If PHOTO_FORM_URL is '#' or not configured, hide completely
  if (!formUrl) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-travel-border/80 bg-white/70 backdrop-blur-xs p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shrink-0 shadow-xs">
          <Camera className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 max-w-xl">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-travel-text">
            Been here? Share your photo
          </h3>
          <p className="text-xs sm:text-sm text-travel-subtext leading-relaxed">
            Travel photos from real visitors make this guide better. Send us your best shot of this place — every photo is reviewed by hand, and published ones are credited with your name.
          </p>
        </div>
      </div>

      <a
        href={formUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-2xl text-sm transition-all shadow-sm hover:shadow shrink-0 w-full sm:w-auto min-h-[44px]"
      >
        <Camera className="w-4 h-4" />
        <span>Share your photo</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
      </a>
    </section>
  );
}

