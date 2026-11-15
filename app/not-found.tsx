import Link from "next/link";
import { Compass, BookOpen, Map, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100/90 text-amber-800 border border-amber-300/80 shadow-xs">
          <span>Error 404</span>
        </div>

        {/* Large heading */}
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-slate-900 tracking-tight">
          Page Not Found
        </h1>

        {/* Friendly explanation */}
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto">
          The page you are looking for does not exist, has been moved, or is temporarily unavailable. Let&rsquo;s get you back to exploring Vietnam.
        </p>

        {/* Main CTA: Back to Homepage */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-sm shadow-md shadow-teal-700/20 transition-all hover:scale-[1.02]"
          >
            <Home className="w-4 h-4" />
            <span>Back to Homepage</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="pt-8 border-t border-slate-200/80">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Popular Sections
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/destinations"
              className="p-3.5 rounded-2xl bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition-all text-left flex items-center gap-3 group shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Compass className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-slate-900 group-hover:text-teal-700">
                  Destinations
                </span>
                <span className="block text-[11px] text-slate-500 truncate">
                  All 24 regions &amp; cities
                </span>
              </div>
            </Link>

            <Link
              href="/guides"
              className="p-3.5 rounded-2xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 transition-all text-left flex items-center gap-3 group shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-slate-900 group-hover:text-amber-700">
                  Travel Guides
                </span>
                <span className="block text-[11px] text-slate-500 truncate">
                  Trains, eSIM, E-Visa
                </span>
              </div>
            </Link>

            <Link
              href="/map"
              className="p-3.5 rounded-2xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all text-left flex items-center gap-3 group shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Map className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                  Interactive Map
                </span>
                <span className="block text-[11px] text-slate-500 truncate">
                  Explore by coordinates
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
