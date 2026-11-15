import Link from "next/link";
import Image from "next/image";
import { SITE_NAME, SITE_TAGLINE, CONTACT_EMAIL } from "@/config/site";
import { Compass, BookOpen, ShieldCheck, Heart, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-travel-muted border-t border-travel-border pt-16 pb-12 mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: About */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm shrink-0 border border-amber-400/40 bg-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/logo-icon.png"
                  alt="Vietnam Atlas Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-brand font-bold text-2xl -tracking-[0.025em] bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent leading-none">
                {SITE_NAME}
              </span>
            </Link>
            <p className="text-sm text-travel-subtext leading-relaxed">
              {SITE_TAGLINE}. An independent, curated travel directory created by a local Vietnamese traveler to help visitors explore authentic destinations across Vietnam.
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 underline underline-offset-4"
              >
                Learn more about this project &rarr;
              </Link>
            </div>
          </div>

          {/* Col 2: Destinations */}
          <div>
            <h3 className="font-serif text-base font-bold text-travel-text mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-500" />
              Destinations
            </h3>
            <ul className="space-y-2 text-sm text-travel-subtext">
              <li>
                <Link href="/regions/north" className="hover:text-teal-600 transition-colors">
                  North Vietnam
                </Link>
              </li>
              <li>
                <Link href="/regions/central" className="hover:text-teal-600 transition-colors">
                  Central Vietnam
                </Link>
              </li>
              <li>
                <Link href="/regions/south" className="hover:text-teal-600 transition-colors">
                  South Vietnam
                </Link>
              </li>
              <li className="pt-2 border-t border-travel-border">
                <Link href="/cities/hanoi" className="hover:text-teal-600 transition-colors">
                  Hanoi Places
                </Link>
              </li>
              <li>
                <Link href="/cities/da-nang" className="hover:text-teal-600 transition-colors">
                  Da Nang Places
                </Link>
              </li>
              <li>
                <Link href="/cities/quang-nam" className="hover:text-teal-600 transition-colors">
                  Hoi An Places
                </Link>
              </li>
              <li>
                <Link href="/cities/hue" className="hover:text-teal-600 transition-colors">
                  Hue Places
                </Link>
              </li>
              <li>
                <Link href="/cities/ho-chi-minh-city" className="hover:text-teal-600 transition-colors">
                  Ho Chi Minh City Places
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Practical Guides */}
          <div>
            <h3 className="font-serif text-base font-bold text-travel-text mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-500" />
              Practical Guides
            </h3>
            <ul className="space-y-2 text-sm text-travel-subtext">
              <li>
                <Link href="/guides/vietnam-train-tickets" className="hover:text-teal-600 transition-colors">
                  How to Book Train Tickets
                </Link>
              </li>
              <li>
                <Link href="/guides/vietnam-esim" className="hover:text-teal-600 transition-colors">
                  Vietnam eSIM & Mobile Data
                </Link>
              </li>
              <li>
                <Link href="/guides/vietnam-evisa" className="hover:text-teal-600 transition-colors">
                  Vietnam E-Visa Step by Step
                </Link>
              </li>
              <li>
                <Link href="/guides/airport-transfers" className="hover:text-teal-600 transition-colors">
                  Airport to City Center Transfers
                </Link>
              </li>
              <li className="pt-2 border-t border-travel-border">
                <Link href="/map" className="hover:text-teal-600 transition-colors">
                  Full Interactive Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Transparency & Legal */}
          <div>
            <h3 className="font-serif text-base font-bold text-travel-text mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-500" />
              Transparency &amp; Legal
            </h3>
            <ul className="space-y-2.5 text-sm text-travel-subtext">
              <li>
                <Link href="/affiliate-disclosure" className="hover:text-teal-600 transition-colors font-medium text-teal-700">
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-teal-600 transition-colors font-medium text-teal-700">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal-600 transition-colors font-medium">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal-600 transition-colors">
                  About Project
                </Link>
              </li>
              <li>
                <Link
                  href="/traveller-photos"
                  className="hover:text-teal-600 transition-colors font-medium text-teal-600 inline-flex items-center gap-1 text-xs"
                >
                  <span>Contribute a photo</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </li>
              {CONTACT_EMAIL && CONTACT_EMAIL.trim() !== "" && (
                <li className="pt-1.5 border-t border-travel-border/60">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-xs font-mono text-teal-700 hover:text-teal-800 break-all inline-flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0 text-teal-600" />
                    <span>{CONTACT_EMAIL}</span>
                  </a>
                </li>
              )}
              <li className="pt-2 text-xs leading-relaxed text-travel-subtext">
                Photos: Wikimedia Commons contributors, licensed as credited on each page.
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure Box (LAW 4 & NV-10) */}
        <div className="bg-white border border-travel-border rounded-2xl p-5 mb-8 text-xs text-travel-subtext leading-relaxed">
          <p className="font-semibold text-travel-text mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Affiliate Disclosure &amp; Transparency Notice
          </p>
          <p>
            Some links on this site are affiliate links. If you book or buy through them, we may earn a small commission at no extra cost to you. This helps us keep the site free and up to date. We only link to services we would use ourselves. Photos on this site come from Wikimedia Commons and are credited on each page.
          </p>
        </div>

        {/* Copyright bottom bar */}
        <div className="border-t border-travel-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-travel-subtext gap-3">
          <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link href="/privacy" className="hover:text-teal-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/affiliate-disclosure" className="hover:text-teal-600 transition-colors">
              Affiliate Disclosure
            </Link>
            <Link href="/contact" className="hover:text-teal-600 transition-colors">
              Contact
            </Link>
            <Link
              href="/admin"
              className="text-slate-400 hover:text-teal-600 transition-colors flex items-center gap-1 text-[11px]"
            >
              <span>⚙️ Owner Admin</span>
            </Link>
            <p className="flex items-center gap-1 text-slate-500">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for travelers exploring Vietnam.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
