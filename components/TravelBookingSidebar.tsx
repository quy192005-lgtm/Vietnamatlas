"use client";

import { useState } from "react";
import Link from "next/link";
import { AFFILIATES } from "@/config/affiliates";
import { SITE_NAME } from "@/config/site";
import {
  Hotel,
  Train,
  Ticket,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  Search,
  ArrowRight,
} from "lucide-react";

interface TravelBookingSidebarProps {
  currentCity?: string;
  className?: string;
}

export default function TravelBookingSidebar({
  currentCity,
  className = "",
}: TravelBookingSidebarProps) {
  const [activeTab, setActiveTab] = useState<"stays" | "transit" | "tours" | "esim">("stays");

  // Form states for Stays
  const [stayCity, setStayCity] = useState(currentCity || "Hanoi");
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [stayNights, setStayNights] = useState("2");
  const [stayPartner, setStayPartner] = useState("booking");

  // Form states for Transit
  const [transitOrigin, setTransitOrigin] = useState("Hanoi");
  const [transitDest, setTransitDest] = useState(currentCity || "Da Nang");
  const [transitDate, setTransitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });

  // Form states for Tours
  const [tourCity, setTourCity] = useState(currentCity || "Da Nang");
  const [tourType, setTourType] = useState("all");

  // Quick search query
  const [searchQuery, setSearchQuery] = useState("");

  const citiesList = [
    "Hanoi",
    "Da Nang",
    "Hoi An",
    "Hue",
    "Ho Chi Minh City",
    "Ninh Binh",
    "Ha Long",
    "Da Lat",
    "Sapa",
    "Phu Quoc",
    "Phong Nha",
    "Quy Nhon",
  ];

  // Helper to trigger affiliate outbound navigation
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let targetUrl = "#";

    if (activeTab === "stays") {
      targetUrl = AFFILIATES.booking;
    } else if (activeTab === "transit") {
      targetUrl = AFFILIATES.twelveGo;
    } else if (activeTab === "tours") {
      targetUrl = AFFILIATES.klook;
    } else if (activeTab === "esim") {
      targetUrl = AFFILIATES.airalo;
    }

    if (targetUrl && targetUrl !== "#") {
      window.open(targetUrl, "_blank", "noopener,noreferrer,nofollow");
    } else {
      // Default to partners search or landing page
      const fallbackUrls = {
        stays: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(stayCity + ", Vietnam")}`,
        transit: `https://12go.asia/en/travel/${encodeURIComponent(transitOrigin.toLowerCase())}/${encodeURIComponent(transitDest.toLowerCase())}`,
        tours: `https://www.klook.com/en-US/search/result/?query=${encodeURIComponent(tourCity + " Vietnam")}`,
        esim: "https://www.airalo.com/vietnam-esim",
      };
      window.open(fallbackUrls[activeTab], "_blank", "noopener,noreferrer,nofollow");
    }
  };

  return (
    <aside className={`space-y-6 ${className}`}>
      {/* 1. CREATOR / INDEPENDENT PROJECT PROFILE (Inspired by Vietnam Coracle author card) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-card border border-slate-800 text-center">
        {/* Avatar circle */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 p-1 shadow-md">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-serif text-2xl font-bold text-teal-300">
              VA
            </div>
          </div>
          <span className="absolute bottom-0 right-1 w-5 h-5 rounded-full bg-teal-500 border-2 border-slate-900 flex items-center justify-center text-[10px]">
            ✓
          </span>
        </div>

        <h3 className="font-serif text-lg font-bold tracking-tight mb-1">
          {SITE_NAME}
        </h3>
        <p className="text-xs text-teal-400 font-medium mb-3">
          Independent Local Vietnam Directory
        </p>

        <p className="text-xs text-slate-300 leading-relaxed mb-5 px-1">
          A free, 100% static travel resource covering 1,000 places across Vietnam. Curated with real advice, zero sponsored bias, and open licensing.
        </p>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link
            href="/about"
            className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold transition-colors min-h-[44px]"
          >
            <span>About This Project</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/affiliate-disclosure"
            className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors min-h-[44px]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Affiliate Disclosure</span>
          </Link>
        </div>
      </div>

      {/* 2. BOOK YOUR STAY & TRAVEL WIDGET (Exact match to requested right-side search) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800">
        <div className="mb-5 text-center">
          <span className="text-[10px] uppercase tracking-wider text-teal-400 font-semibold block mb-1">
            Trip Booking Widget
          </span>
          <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
            Plan Your <span className="text-teal-400">Journey</span>
          </h3>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-2xl mb-5 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("stays")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-medium transition-all min-h-[44px] ${
              activeTab === "stays"
                ? "bg-teal-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Hotel className="w-4 h-4 mb-1" />
            <span>Stays</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("transit")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-medium transition-all min-h-[44px] ${
              activeTab === "transit"
                ? "bg-teal-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Train className="w-4 h-4 mb-1" />
            <span>Transit</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tours")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-medium transition-all min-h-[44px] ${
              activeTab === "tours"
                ? "bg-teal-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Ticket className="w-4 h-4 mb-1" />
            <span>Tours</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("esim")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-medium transition-all min-h-[44px] ${
              activeTab === "esim"
                ? "bg-teal-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-4 h-4 mb-1" />
            <span>eSIM</span>
          </button>
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          {/* TAB 1: STAYS (HOTELS) */}
          {activeTab === "stays" && (
            <>
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Destination City:
                </label>
                <div className="relative">
                  <select
                    value={stayCity}
                    onChange={(e) => setStayCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 min-h-[44px]"
                  >
                    {citiesList.map((c) => (
                      <option key={c} value={c}>
                        {c}, Vietnam
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Check-in:
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-teal-500 min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Duration:
                  </label>
                  <select
                    value={stayNights}
                    onChange={(e) => setStayNights(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 min-h-[44px]"
                  >
                    <option value="1">1 night</option>
                    <option value="2">2 nights</option>
                    <option value="3">3 nights</option>
                    <option value="5">5 nights</option>
                    <option value="7">7 nights</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Partner Platform:
                </label>
                <select
                  value={stayPartner}
                  onChange={(e) => setStayPartner(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 min-h-[44px]"
                >
                  <option value="booking">Booking.com (Global Best)</option>
                  <option value="agoda">Agoda (Asia Specialized)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <span>Search Hotels &rarr;</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* TAB 2: TRANSIT (TRAINS & BUSES) */}
          {activeTab === "transit" && (
            <>
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Origin Departure:
                </label>
                <select
                  value={transitOrigin}
                  onChange={(e) => setTransitOrigin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 min-h-[44px]"
                >
                  {citiesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Destination:
                </label>
                <select
                  value={transitDest}
                  onChange={(e) => setTransitDest(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 min-h-[44px]"
                >
                  {citiesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Travel Date:
                </label>
                <input
                  type="date"
                  value={transitDate}
                  onChange={(e) => setTransitDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-teal-500 min-h-[44px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <span>Search Trains on 12Go &rarr;</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* TAB 3: TOURS & ACTIVITIES */}
          {activeTab === "tours" && (
            <>
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  City / Destination:
                </label>
                <select
                  value={tourCity}
                  onChange={(e) => setTourCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 min-h-[44px]"
                >
                  {citiesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Experience Category:
                </label>
                <select
                  value={tourType}
                  onChange={(e) => setTourType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 min-h-[44px]"
                >
                  <option value="all">All Experiences</option>
                  <option value="day-trips">Day Trips & Tours</option>
                  <option value="attraction-tickets">Attraction Tickets & Passes</option>
                  <option value="cruises">Boat & River Cruises</option>
                  <option value="food">Culinary & Cooking Classes</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <span>Find Tours on Klook &rarr;</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* TAB 4: ESIM */}
          {activeTab === "esim" && (
            <>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-teal-400 block">
                  Vietnam Tourist eSIM (Airalo)
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  High-speed 4G data on Viettel and Vinaphone networks. Install via QR code before departure.
                </p>
                <div className="text-[11px] text-slate-400">
                  Plans available: <strong>1 GB to 20 GB</strong> (7 to 30 days).
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <span>Get Airalo eSIM &rarr;</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </form>

        {/* Disclaimer */}
        <p className="mt-4 text-[10px] text-slate-400 text-center leading-normal">
          * Opens partner website in a secure new tab. We may earn an affiliate referral fee at no extra cost to you.
        </p>
      </div>

      {/* 3. QUICK KEYWORD SEARCH CARD */}
      <div className="bg-white rounded-3xl p-5 border border-travel-border shadow-card">
        <h4 className="font-serif text-sm font-bold text-travel-text mb-2 flex items-center gap-1.5">
          <Search className="w-4 h-4 text-teal-600" />
          Quick Search Directory
        </h4>
        <form action="/search" method="GET" className="space-y-2">
          <input
            type="text"
            name="q"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search landmark or city..."
            className="w-full px-3 py-2 bg-travel-muted border border-travel-border rounded-xl text-xs text-travel-text focus:outline-none focus:border-teal-500 min-h-[44px]"
          />
          <button
            type="submit"
            className="w-full py-2 bg-travel-text hover:bg-teal-600 text-white rounded-xl text-xs font-semibold transition-colors min-h-[44px]"
          >
            Search Places
          </button>
        </form>
      </div>
    </aside>
  );
}
