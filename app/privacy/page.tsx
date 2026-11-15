import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { ShieldCheck, Lock, Cookie, DollarSign, ExternalLink, Mail } from "lucide-react";
import { CONTACT_EMAIL } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Vietnam Atlas: information collection, Google advertising cookies, affiliate partners, and user data rights.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumb items={[{ label: "Privacy Policy" }]} />

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>User Privacy &amp; Data Transparency</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-travel-text tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-travel-subtext leading-relaxed">
          Last updated: November 2026. This Privacy Policy explains how Vietnam Atlas collects, uses, and safeguards your information when you browse our travel directory.
        </p>
      </div>

      {/* Core Summary Callout */}
      <div className="bg-[#FAF7F2] border-l-4 border-teal-600 rounded-2xl p-6 sm:p-8 space-y-2 border border-slate-200/60 shadow-xs">
        <div className="flex items-center gap-2 text-teal-800 font-bold text-sm uppercase tracking-wide">
          <Lock className="w-4 h-4 text-teal-600" />
          <span>Summary: Pure Static Directory</span>
        </div>
        <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
          Vietnam Atlas is an open, static travel directory. We do not operate user accounts, do not require user registration, do not run paywalls, and will never sell, rent, or trade your personal data.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8 text-sm sm:text-base text-slate-800 leading-relaxed">
        {/* Section 1: Introduction */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>1. Introduction</span>
          </h2>
          <p>
            Welcome to Vietnam Atlas (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). This Privacy Policy informs visitors of our policies regarding the collection, use, and disclosure of personal information received from users of this website.
          </p>
          <p>
            By using Vietnam Atlas, you agree to the collection and use of information in accordance with this policy. We are committed to maintaining the trust and confidence of our visitors by keeping data collection minimal, transparent, and respectful.
          </p>
        </section>

        {/* Section 2: Information We Collect */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
            2. Information We Collect
          </h2>
          <p>
            Because Vietnam Atlas is an open information platform, you can browse all directory pages, itineraries, destination guides, and maps without providing any personal information or signing up for an account.
          </p>
          <p>The only instances where we may receive information directly from you are:</p>
          <ul className="list-disc list-inside space-y-2 pl-2 text-slate-700">
            <li>
              <strong>Community Photo Submissions:</strong> If you voluntarily contribute travel photography via our submission form, you may provide your name or social handle for photo attribution, an optional email address for verification, and image files.
            </li>
            <li>
              <strong>Direct Inquiries:</strong> If you send us an editorial correction, suggestion, or partnership inquiry via email, we receive your email address and any details included in your correspondence.
            </li>
          </ul>
        </section>

        {/* Section 3: Cookies and Web Beacons */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Cookie className="w-5 h-5 text-amber-600" />
            <span>3. Cookies and Tracking Technologies</span>
          </h2>
          <p>
            Cookies are small data files stored on your device that help web services remember preferences, analyze website traffic, and facilitate external service interactions.
          </p>
          <p>
            Vietnam Atlas and our trusted third-party service providers (such as web analytics and advertising networks) may use cookies, web beacons, and similar tracking technologies to monitor aggregate site performance, measure navigation flow, and deliver relevant content.
          </p>
          <p>
            You have full control over cookies through your web browser settings. You can instruct your browser to decline all cookies or to indicate when a cookie is being sent. However, declining cookies will not prevent you from accessing any travel guide on Vietnam Atlas.
          </p>
        </section>

        {/* Section 4: Google Advertising Cookies (AdSense Compliance) */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span>4. Google Advertising Cookies</span>
          </h2>
          <p>
            Google is a third-party vendor on our website. Google uses cookies, including the DoubleClick DART cookie, to serve advertisements to visitors based on their visit to Vietnam Atlas and other websites across the Internet.
          </p>
          <p>
            The DART cookie enables Google and its partner advertising networks to deliver targeted, personalized ads based on your browsing interests and history.
          </p>
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-950 space-y-1.5">
            <p className="font-bold flex items-center gap-1.5">
              <span>How to Opt Out of Personalized Advertising:</span>
            </p>
            <p>
              Visitors may opt out of the use of the DART cookie and personalized advertising at any time by visiting Google&rsquo;s official Ad Settings page:
            </p>
            <p className="pt-1">
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-teal-800 hover:text-teal-900 underline underline-offset-4"
              >
                <span>https://adssettings.google.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </p>
            <p className="text-[11px] text-amber-800 pt-1">
              Alternatively, you can opt out of third-party vendor cookies for interest-based advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="underline">aboutads.info</a>.
            </p>
          </div>
        </section>

        {/* Section 5: Affiliate Partnerships */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
            5. Affiliate Links and Partner Platforms
          </h2>
          <p>
            Some outbound links on Vietnam Atlas are affiliate links connected to verified travel service providers, including Booking.com, 12Go Asia, Klook, and Airalo (managed directly or via Travelpayouts).
          </p>
          <p>
            When you click an affiliate link and complete a booking or purchase, the partner platform sets an affiliate tracking cookie to credit our referral commission. <strong>Vietnam Atlas never handles, sees, or stores your credit card details, financial transactions, or personal travel booking data</strong>; all transactions take place securely on the partner platform&rsquo;s encrypted servers.
          </p>
          <p>
            For full disclosures regarding partner commissions, please review our dedicated{" "}
            <Link
              href="/affiliate-disclosure"
              className="text-teal-700 hover:text-teal-800 font-semibold underline underline-offset-2"
            >
              Affiliate Disclosure page
            </Link>.
          </p>
        </section>

        {/* Section 6: External Links & Photo Licensing */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
            6. External Links &amp; Photo Licensing
          </h2>
          <p>
            Our website contains links to external websites, including official government portals (such as the official Vietnam National E-Visa portal at <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">evisa.gov.vn</code>), transportation schedules, and mapping tools. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
          </p>
          <p>
            All destination photos displayed across our directory are sourced from Wikimedia Commons and credited to their respective photographers alongside specific Creative Commons or Public Domain licenses on each page. Community photos submitted by readers are credited strictly according to the consent provided in the submission form.
          </p>
        </section>

        {/* Section 7: Changes & Contact */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-teal-600" />
            <span>7. Changes to This Privacy Policy &amp; Contact Us</span>
          </h2>
          <p>
            We may update our Privacy Policy periodically to reflect technological, operational, or legal changes. Any modifications will be posted directly on this page with an updated revision date. Your continued use of the website following the posting of changes constitutes your acceptance of such revisions.
          </p>
          <p>
            If you have any questions or privacy inquiries regarding this policy, please reach out to us via our{" "}
            <Link
              href="/contact"
              className="text-teal-700 hover:text-teal-800 font-semibold underline underline-offset-2"
            >
              Contact page
            </Link>
            {CONTACT_EMAIL && (
              <>
                {" "}or directly by email at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-mono text-teal-700 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </>
            )}.
          </p>
        </section>
      </div>
    </div>
  );
}
