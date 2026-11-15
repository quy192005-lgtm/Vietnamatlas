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
  Info,
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
  ];

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
    <aside className={`w-full ${className}`}>
      {/* UNIFIED COMPACT CARD: Fits comfortably within standard laptop viewports */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xl border border-slate-800">
        {/* Top: Compact Creator Header (Vietnam Coracle inspired) */}
        <div className="flex items-center gap-3 pb-3 mb-3 border-b border-slate-800/80">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shrink-0 shadow-sm">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-serif text-sm font-bold text-teal-300">
              VA
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif text-sm font-bold text-white truncate">
                {SITE_NAME}
              </h3>
              <span className="text-[10px] text-teal-400 bg-teal-950 px-1.5 py-0.2 rounded border border-teal-800/60 shrink-0">
                Guide
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              Independent Directory • 1,000 Places
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Link
              href="/about"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="About this site"
            >
              <Info className="w-4 h-4" />
            </Link>
            <Link
              href="/affiliate-disclosure"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Affiliate disclosure"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Middle: Booking Header & 4 Tabs */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-serif text-base font-bold text-white tracking-tight">
              Plan & Book Your <span className="text-teal-400">Trip</span>
            </h4>
            <span className="text-[10px] text-slate-400">Direct partners</span>
          </div>

          {/* 4 Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab("stays")}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg text-[10px] font-medium transition-all min-h-[38px] ${
                activeTab === "stays"
                  ? "bg-teal-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Hotel className="w-3.5 h-3.5 mb-0.5" />
              <span>Stays</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("transit")}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg text-[10px] font-medium transition-all min-h-[38px] ${
                activeTab === "transit"
                  ? "bg-teal-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Train className="w-3.5 h-3.5 mb-0.5" />
              <span>Trains</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tours")}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg text-[10px] font-medium transition-all min-h-[38px] ${
                activeTab === "tours"
                  ? "bg-teal-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Ticket className="w-3.5 h-3.5 mb-0.5" />
              <span>Tours</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("esim")}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg text-[10px] font-medium transition-all min-h-[38px] ${
                activeTab === "esim"
                  ? "bg-teal-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 mb-0.5" />
              <span>eSIM</span>
            </button>
          </div>
        </div>

        {/* Compact Form Body */}
        <form onSubmit={handleBookingSubmit} className="space-y-2.5">
          {/* TAB 1: STAYS */}
          {activeTab === "stays" && (
            <>
              <div>
                <label className="block text-[10px] font-medium text-slate-300 mb-1">
                  City in Vietnam:
                </label>
                <select
                  value={stayCity}
                  onChange={(e) => setStayCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  {citiesList.map((c) => (
                    <option key={c} value={c}>
                      {c}, Vietnam
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-medium text-slate-300 mb-1">
                    Check-in:
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-slate-300 mb-1">
                    Duration:
                  </label>
                  <select
                    value={stayNights}
                    onChange={(e) => setStayNights(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
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
                <label className="block text-[10px] font-medium text-slate-300 mb-1">
                  Provider:
                </label>
                <select
                  value={stayPartner}
                  onChange={(e) => setStayPartner(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="booking">Booking.com (Worldwide Hotels)</option>
                  <option value="agoda">Agoda (Southeast Asia)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-1 py-2.5 px-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 min-h-[40px]"
              >
                <span>Search Hotels &rarr;</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* TAB 2: TRANSIT */}
          {activeTab === "transit" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-medium text-slate-300 mb-1">
                    From:
                  </label>
                  <select
                    value={transitOrigin}
                    onChange={(e) => setTransitOrigin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    {citiesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-slate-300 mb-1">
                    To:
                  </label>
                  <select
                    value={transitDest}
                    onChange={(e) => setTransitDest(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    {citiesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-slate-300 mb-1">
                  Travel Date:
                </label>
                <input
                  type="date"
                  value={transitDate}
                  onChange={(e) => setTransitDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-1 py-2.5 px-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 min-h-[40px]"
              >
                <span>Search Trains on 12Go &rarr;</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* TAB 3: TOURS */}
          {activeTab === "tours" && (
            <>
              <div>
                <label className="block text-[10px] font-medium text-slate-300 mb-1">
                  Tour Destination:
                </label>
                <select
                  value={tourCity}
                  onChange={(e) => setTourCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  {citiesList.map((c) => (
                    <option key={c} value={c}>
                      {c}, Vietnam
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                Explore day tours, boat cruises, cooking classes, and attraction tickets verified on Klook.
              </div>

              <button
                type="submit"
                className="w-full mt-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 min-h-[40px]"
              >
                <span>Find Tours on Klook &rarr;</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* TAB 4: ESIM */}
          {activeTab === "esim" && (
            <>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <span className="font-semibold text-teal-400 block text-xs">
                  Vietnam Tourist eSIM
                </span>
                <p className="text-[10px] text-slate-400">
                  Instant QR setup for 4G data on Viettel/Vinaphone. No passport lines at the airport.
                </p>
              </div>

              <button
                type="submit"
                className="w-full mt-1 py-2.5 px-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 min-h-[40px]"
              >
                <span>Get Airalo eSIM &rarr;</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </form>

        <p className="mt-3 text-[9px] text-slate-400 text-center leading-normal">
          * Transparent disclosure: Referral commission may be earned at zero extra cost to you.
        </p>
      </div>
    </aside>
  );
}
