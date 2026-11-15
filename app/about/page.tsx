import { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/config/site";
import Breadcrumb from "@/components/Breadcrumb";
import { ShieldCheck, User } from "lucide-react";

export const metadata: Metadata = {
  title: `About ${SITE_NAME}`,
  description:
    `Learn about ${SITE_NAME}, an independent Vietnam travel directory created to help foreign visitors explore authentic places with practical guides.`,
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumb items={[{ label: "About" }]} />

      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
          <User className="w-3.5 h-3.5" />
          Independent Project
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-travel-text tracking-tight">
          About {SITE_NAME}
        </h1>
        <p className="text-base sm:text-lg text-travel-subtext leading-relaxed">
          {SITE_TAGLINE}.
        </p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8 text-sm sm:text-base text-travel-text leading-relaxed">
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-travel-text">
            Why this directory was created
          </h2>
          <p>
            {SITE_NAME} is an independent, non-governmental travel directory built by a Vietnamese developer and travel enthusiast. Vietnam is rich with dramatic karst peaks, vibrant ancient towns, tranquil lakes, and regional street foods — but practical, unfiltered English information for independent foreign travelers can often be fragmented or buried behind commercial sales funnels.
          </p>
          <p>
            The mission of this site is simple: assemble a clean, fast, 100% static directory of 1,000 places across all three regions of Vietnam, paired with practical, field-tested guides on buying train tickets, securing eSIM data, getting airport transport, and completing government visas without being misled by unofficial agencies.
          </p>
        </section>

        <section className="space-y-3 bg-travel-muted p-6 sm:p-8 rounded-3xl border border-travel-border">
          <h2 className="font-serif text-xl font-bold text-travel-text flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            Independent & Unofficial Status
          </h2>
          <p className="text-sm text-travel-subtext">
            <strong>Important disclaimer:</strong> {SITE_NAME} is completely independent. We are <strong>not affiliated with the Vietnam National Administration of Tourism (VNAT), the Vietnamese Government, or any specific commercial airline, hotel chain, or booking corporation</strong>.
          </p>
          <p className="text-sm text-travel-subtext">
            All place data is compiled from public records and verified coordinates. Photography is used under Creative Commons licenses with individual attribution to Wikimedia Commons contributors on each page.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-travel-text">
            How We Make Money
          </h2>
          <p>
            This website is completely free for all readers and does not charge subscription fees or require registration. We sustain hosting, domain maintenance, and continuous editorial curation through two transparent avenues:
          </p>
          <ol className="space-y-3 list-decimal pl-5">
            <li>
              <strong>Affiliate Partnerships:</strong> If you book a train on 12Go, a hotel on Booking.com, a tour on Klook, or an eSIM on Airalo through our links, we may receive a small referral commission at no additional cost to you.
            </li>
            <li>
              <strong>Contextual Advertisements:</strong> When appropriate, non-intrusive banner advertisements may appear to help offset server and content maintenance costs.
            </li>
          </ol>
          <p>
            For complete transparency regarding partner terms and reader protection, please read our full{" "}
            <Link
              href="/affiliate-disclosure"
              className="text-teal-600 font-semibold underline underline-offset-2 hover:text-teal-700"
            >
              Affiliate Disclosure Policy
            </Link>
            .
          </p>
        </section>

        <div className="pt-8 border-t border-travel-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/destinations"
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            Explore Directory &rarr;
          </Link>
          <Link
            href="/guides"
            className="text-sm font-semibold text-teal-600 hover:text-teal-700 underline"
          >
            Read Practical Guides &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
