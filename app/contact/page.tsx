import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { Mail, MessageSquare, Camera, Sparkles, HelpCircle, MapPin, ExternalLink } from "lucide-react";
import { CONTACT_EMAIL, getPhotoSubmissionUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact & Editorial Support",
  description:
    "Get in touch with Vietnam Atlas: submit editorial corrections, feedback, photography inquiries, or travel questions.",
};

export default function ContactPage() {
  const photoFormUrl = getPhotoSubmissionUrl();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumb items={[{ label: "Contact" }]} />

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
          <Mail className="w-3.5 h-3.5" />
          <span>Reader Communication &amp; Support</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-travel-text tracking-tight">
          Contact Us
        </h1>
        <p className="text-base sm:text-lg text-travel-subtext leading-relaxed">
          We welcome reader feedback, editorial corrections, local travel updates, and photo contributions to keep Vietnam Atlas accurate and helpful.
        </p>
      </div>

      {/* Primary Contact Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">
            Get in Touch
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Whether you spotted an outdated ticket price, want to recommend an off-the-beaten-path destination, or have a question about travelling through Vietnam, we would love to hear from you.
          </p>
        </div>

        {/* Email Box */}
        <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-amber-200/80 space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Official Editorial Email
          </span>
          {CONTACT_EMAIL && CONTACT_EMAIL.trim() !== "" ? (
            <div>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 font-mono text-lg sm:text-xl font-bold text-teal-800 hover:text-teal-900 underline underline-offset-4 break-all"
              >
                <Mail className="w-5 h-5 text-teal-600 shrink-0" />
                <span>{CONTACT_EMAIL}</span>
              </a>
              <p className="text-xs text-slate-500 mt-2">
                We typically reply within 24–48 business hours.
              </p>
            </div>
          ) : (
            <div className="py-2">
              <p className="text-sm font-medium text-slate-600 italic">
                Contact details are being updated.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Please check back soon, or use our community photo form below for contributions.
              </p>
            </div>
          )}
        </div>

        {/* What can you contact us about? */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            How we can help:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-sm text-slate-900">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <span>Editorial Corrections</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Notice a closed trail, changed opening hours, or new ticket pricing? Send us an update and we will verify it immediately.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-sm text-slate-900">
                <Camera className="w-4 h-4 text-amber-600" />
                <span>Photo Licensing &amp; Credits</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                If you are a photographer wishing to update your attribution or submit higher resolution travel photos, let us know.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-sm text-slate-900">
                <MapPin className="w-4 h-4 text-terracotta-600" />
                <span>Suggest a Destination</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Know an authentic local destination that international travellers should experience? Share your recommendations with us.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-sm text-slate-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Partnerships &amp; Inquiries</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                For media inquiries, ethical partnerships, or technical questions about our open data directory.
              </p>
            </div>
          </div>
        </div>

        {/* Community Photos Quick Link */}
        {photoFormUrl && (
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-teal-50/60 p-5 rounded-2xl border border-teal-100">
            <div>
              <h4 className="font-semibold text-sm text-teal-900">
                Want to share your travel photos with readers?
              </h4>
              <p className="text-xs text-teal-700 mt-0.5">
                Submit your photography directly to be featured across Vietnam Atlas.
              </p>
            </div>
            <a
              href={photoFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>Submit Photos Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Helpful links */}
      <div className="text-center text-xs text-slate-500">
        Looking for project background? Read our{" "}
        <Link href="/about" className="text-teal-700 hover:underline font-semibold">
          About page
        </Link>{" "}
        or learn about our partner commissions on our{" "}
        <Link href="/affiliate-disclosure" className="text-teal-700 hover:underline font-semibold">
          Affiliate Disclosure
        </Link>.
      </div>
    </div>
  );
}
