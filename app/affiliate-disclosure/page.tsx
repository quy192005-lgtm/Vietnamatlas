import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Affiliate Disclosure & Transparency",
  description:
    "Transparency notice regarding partner links, commissions, and photo licensing on Vietnam Atlas.",
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumb items={[{ label: "Affiliate Disclosure" }]} />

      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          Transparency & Reader Trust
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-travel-text tracking-tight">
          Affiliate Disclosure
        </h1>
        <p className="text-base sm:text-lg text-travel-subtext leading-relaxed">
          How we sustain the website and our commitment to honest, independent travel advice.
        </p>
      </div>

      {/* Mandatory exact legal disclosure quote */}
      <div className="bg-travel-muted border-l-4 border-teal-500 rounded-2xl p-6 sm:p-8 space-y-3">
        <h2 className="font-serif text-lg font-bold text-travel-text">
          Our Core Transparency Statement
        </h2>
        <blockquote className="text-base sm:text-lg font-serif italic text-travel-text leading-relaxed">
          &ldquo;Some links on this site are affiliate links. If you book or buy through them, we may earn a small commission at no extra cost to you. This helps us keep the site free and up to date. We only link to services we would use ourselves. Photos on this site come from Wikimedia Commons and are credited on each page.&rdquo;
        </blockquote>
      </div>

      {/* Detailed explanations */}
      <div className="prose prose-slate max-w-none space-y-8 text-sm sm:text-base text-travel-text leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-travel-text">
            What is an affiliate link?
          </h2>
          <p>
            An affiliate link is a special tracking URL containing our unique referral identifier. When you click on one of these partner links (such as to 12Go for train tickets, Booking.com for accommodations, Klook for activities, or Airalo for eSIM data) and complete a booking or purchase, the partner platform pays us a modest referral fee.
          </p>
          <p className="font-medium text-teal-800 bg-teal-50/60 p-4 rounded-xl border border-teal-100">
            Important: You never pay more by clicking our links. In fact, prices remain identical to or occasionally cheaper than standard rates.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-travel-text">
            Our Strict Editorial Principles
          </h2>
          <p>
            Reader trust is our most valuable asset. We adhere to these non-negotiable rules:
          </p>
          <ul className="space-y-2 list-none pl-0">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>No Paid Reviews or Biased Rankings:</strong> Destinations and places are selected purely based on cultural, historic, and geographic merit. No hotel, tour agency, or restaurant can pay for a featured spot.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>Official Channels First:</strong> When official non-commercial routes are the safest option (such as the Vietnamese government e-visa portal at evisa.gov.vn), we direct you straight to the government portal with zero markups or middleman referral fees.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>Clear Disclosure:</strong> Every page with affiliate buttons includes explicit notice of our commercial relationship.
              </span>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-travel-text">
            Image Licensing & Attribution
          </h2>
          <p>
            All destination photography on Vietnam Atlas is sourced from dedicated contributors on <strong>Wikimedia Commons</strong> under Creative Commons licenses (including CC0, CC BY, and CC BY-SA).
          </p>
          <p>
            Under every photograph, we faithfully acknowledge the original photographer, specify the license terms, and provide a direct link to the source Wikimedia page.
          </p>
        </section>

        <div className="pt-6 border-t border-travel-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/about"
            className="text-sm font-semibold text-teal-600 hover:text-teal-700 underline"
          >
            &larr; Read more about who made this site
          </Link>
          <Link
            href="/destinations"
            className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold shadow-sm"
          >
            Start Exploring Places
          </Link>
        </div>
      </div>
    </div>
  );
}
