"use client";

import { useState } from "react";
import { Camera, ExternalLink, X, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";

interface SharePhotoButtonProps {
  formUrl?: string | null;
  placeNameEn?: string;
  className?: string;
  label?: string;
}

export default function SharePhotoButton({
  formUrl,
  placeNameEn,
  className = "",
  label = "Share your photo",
}: SharePhotoButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const isConfigured = Boolean(formUrl && formUrl.trim() !== "#" && formUrl.trim() !== "");

  const handleClick = (e: React.MouseEvent) => {
    if (isConfigured && formUrl) {
      // Form URL is live, open directly in new tab
      window.open(formUrl, "_blank", "noopener,noreferrer");
    } else {
      // Not yet configured with live Google Form URL -> open helpful interactive modal
      e.preventDefault();
      setModalOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={
          className ||
          "inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold rounded-2xl text-base transition-all shadow-md hover:shadow-lg min-h-[48px] cursor-pointer"
        }
      >
        <Camera className="w-5 h-5" />
        <span>{label}</span>
        <ExternalLink className="w-4 h-4 opacity-80" />
      </button>

      {/* Interactive Modal when clicked before form URL is linked */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600">
                  Community Submissions
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                  Share Your Travel Photo
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                {placeNameEn ? (
                  <>
                    Have a great shot of <strong>{placeNameEn}</strong>?
                  </>
                ) : (
                  "Have you captured a memorable moment in Vietnam?"
                )}{" "}
                We love publishing authentic travel photography taken by real visitors, reviewed by hand and permanently credited with your name.
              </p>

              {/* Guidelines Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Submission Guidelines</span>
                </div>
                <ul className="space-y-1.5 text-slate-600 pl-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                    <span><strong>Original work:</strong> Only submit photos you took yourself.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                    <span><strong>Authentic views:</strong> Landscapes, cultural landmarks, local street scenes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                    <span><strong>Hand-reviewed:</strong> Reviewed by the curator before publishing.</span>
                  </li>
                </ul>
              </div>

              {/* Webmaster Instruction Callout */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <div className="font-semibold flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Webmaster Configuration:</span>
                </div>
                <p className="leading-relaxed text-[11px] text-amber-800">
                  This button opens a Google Form where visitors submit photos directly into your private Google Drive. To activate your live submission form, add your Google Form URL to <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">PHOTO_FORM_URL</code> in <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">config/site.ts</code>.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
              <a
                href="https://docs.google.com/forms"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs sm:text-sm transition-colors inline-flex items-center gap-1.5"
              >
                <span>Create Google Form</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-xs sm:text-sm transition-colors shadow-sm"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
