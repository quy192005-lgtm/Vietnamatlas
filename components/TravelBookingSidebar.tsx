"use client";

import { useState } from "react";
import Link from "next/link";
import { AFFILIATES } from "@/config/affiliates";
import { SITE_NAME } from "@/config/site";
import {
  Hotel,
  Train,
  Bus,
  Ticket,
  Smartphone,
  Heart,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface TravelBookingSidebarProps {
  currentCity?: string;
  className?: string;
}

export default function TravelBookingSidebar({
  currentCity,
  className = "",
}: TravelBookingSidebarProps) {
  const [activeTab, setActiveTab] = useState<"stays" | "trains" | "buses" | "tours" | "esim">("stays");

  // Form states
  const [city, setCity] = useState(currentCity || "Hanoi");
  const [originCity, setOriginCity] = useState("Hanoi");
  const [destCity, setDestCity] = useState(currentCity || "Da Nang");
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [nights, setNights] = useState("2 nights");
  const [partner, setPartner] = useState("Booking.com");

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let targetUrl = "#";

    if (activeTab === "stays") {
      targetUrl = AFFILIATES.booking;
    } else if (activeTab === "trains" || activeTab === "buses") {
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
        stays: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city + ", Vietnam")}`,
        trains: `https://12go.asia/en/travel/${encodeURIComponent(originCity.toLowerCase())}/${encodeURIComponent(destCity.toLowerCase())}`,
        buses: `https://12go.asia/en/travel/${encodeURIComponent(originCity.toLowerCase())}/${encodeURIComponent(destCity.toLowerCase())}`,
        tours: `https://www.klook.com/en-US/search/result/?query=${encodeURIComponent(city + " Vietnam")}`,
        esim: "https://www.airalo.com/vietnam-esim",
      };
      window.open(fallbackUrls[activeTab], "_blank", "noopener,noreferrer,nofollow");
    }
  };

  return (
    <aside className={`w-full space-y-6 ${className}`}>
      {/* 1. AUTHOR / CREATOR PROFILE (Exact match to Vietnam Coracle "I'm Tom" card) */}
      <div className="bg-[#12161A] text-white rounded-2xl p-6 shadow-2xl border border-white/5 text-center">
        {/* Circle avatar */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-teal-500/40 p-0.5 shadow-lg bg-slate-800">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-teal-700 via-slate-800 to-indigo-800 flex items-center justify-center text-white font-serif font-bold text-2xl tracking-tight">
            Q
          </div>
        </div>

        <h3 className="font-serif text-xl font-bold tracking-tight text-white mb-2">
          I&apos;m Quy
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed font-normal mb-5 px-1">
          I&apos;m the creator of {SITE_NAME}: a free, independent travel directory for Vietnam. There is no sponsored bias. If you enjoy the site, please support it.{" "}
          <Link href="/about" className="text-teal-400 hover:underline">
            Read more &rsaquo;
          </Link>
        </p>

        {/* Action buttons matching the video's Donate & Patron pills */}
        <div className="space-y-2.5">
          <Link
            href="/about"
            className="w-full py-2.5 px-4 rounded-xl bg-[#363299] hover:bg-[#433cc7] text-white text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-2 min-h-[42px]"
          >
            <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
            <span>Support this Project</span>
          </Link>

          <Link
            href="/affiliate-disclosure"
            className="w-full py-2.5 px-4 rounded-xl bg-[#21262D] hover:bg-[#2b313a] text-slate-200 text-xs font-medium border border-white/10 transition-colors flex items-center justify-center gap-1.5 min-h-[42px]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Affiliate Disclosure</span>
          </Link>
        </div>
      </div>

      {/* 2. BOOK YOUR STAY WIDGET (Exact match to Vietnam Coracle's "Book Your Stay" widget) */}
      <div className="bg-[#12161A] text-white rounded-2xl p-6 shadow-2xl border border-white/5">
        <h4 className="font-serif text-2xl font-bold tracking-tight text-center mb-4">
          Book Your <span className="text-[#6366F1]">Stay</span>
        </h4>

        {/* 5 Tab icons matching the video */}
        <div className="grid grid-cols-5 gap-1 p-1 bg-[#0A0D10] rounded-xl mb-5 border border-white/5">
          {/* Stays */}
          <button
            type="button"
            onClick={() => setActiveTab("stays")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[10px] font-medium transition-all ${
              activeTab === "stays"
                ? "bg-[#4338CA] text-white shadow-md font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Hotel className="w-4 h-4 mb-1" />
            <span>Stays</span>
          </button>

          {/* Trains */}
          <button
            type="button"
            onClick={() => setActiveTab("trains")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[10px] font-medium transition-all ${
              activeTab === "trains"
                ? "bg-[#4338CA] text-white shadow-md font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Train className="w-4 h-4 mb-1" />
            <span>Trains</span>
          </button>

          {/* Buses */}
          <button
            type="button"
            onClick={() => setActiveTab("buses")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[10px] font-medium transition-all ${
              activeTab === "buses"
                ? "bg-[#4338CA] text-white shadow-md font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Bus className="w-4 h-4 mb-1" />
            <span>Buses</span>
          </button>

          {/* Tours */}
          <button
            type="button"
            onClick={() => setActiveTab("tours")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[10px] font-medium transition-all ${
              activeTab === "tours"
                ? "bg-[#4338CA] text-white shadow-md font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Ticket className="w-4 h-4 mb-1" />
            <span>Tours</span>
          </button>

          {/* eSIM */}
          <button
            type="button"
            onClick={() => setActiveTab("esim")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[10px] font-medium transition-all ${
              activeTab === "esim"
                ? "bg-[#4338CA] text-white shadow-md font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-4 h-4 mb-1" />
            <span>eSIM</span>
          </button>
        </div>

        {/* Input Form matching the exact layout in the video */}
        <form onSubmit={handleSearchSubmit} className="space-y-3.5">
          {/* TAB: STAYS */}
          {activeTab === "stays" && (
            <>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  City:
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#1A1F26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {citiesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Check-in:
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-[#1A1F26] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Nights:
                  </label>
                  <select
                    value={nights}
                    onChange={(e) => setNights(e.target.value)}
                    className="w-full bg-[#1A1F26] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="1 night">1 night</option>
                    <option value="2 nights">2 nights</option>
                    <option value="3 nights">3 nights</option>
                    <option value="5 nights">5 nights</option>
                    <option value="7 nights">7 nights</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  With:
                </label>
                <select
                  value={partner}
                  onChange={(e) => setPartner(e.target.value)}
                  className="w-full bg-[#1A1F26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Agoda">Agoda</option>
                  <option value="Booking.com">Booking.com</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#363299] hover:bg-[#433cc7] text-white font-semibold text-xs sm:text-sm shadow-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Search Hotels &rsaquo;</span>
              </button>
            </>
          )}

          {/* TAB: TRAINS / BUSES */}
          {(activeTab === "trains" || activeTab === "buses") && (
            <>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  From:
                </label>
                <select
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  className="w-full bg-[#1A1F26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {citiesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  To:
                </label>
                <select
                  value={destCity}
                  onChange={(e) => setDestCity(e.target.value)}
                  className="w-full bg-[#1A1F26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {citiesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Departure Date:
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full bg-[#1A1F26] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#363299] hover:bg-[#433cc7] text-white font-semibold text-xs sm:text-sm shadow-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Search {activeTab === "trains" ? "Trains" : "Buses"} on 12Go &rsaquo;</span>
              </button>
            </>
          )}

          {/* TAB: TOURS */}
          {activeTab === "tours" && (
            <>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Destination:
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#1A1F26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {citiesList.map((c) => (
                    <option key={c} value={c}>
                      {c}, Vietnam
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-[#1A1F26] p-3 rounded-xl border border-white/5 text-[11px] text-slate-300">
                Browse day tours, island boat cruises, cooking workshops, and attraction tickets.
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#363299] hover:bg-[#433cc7] text-white font-semibold text-xs sm:text-sm shadow-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Search Tours on Klook &rsaquo;</span>
              </button>
            </>
          )}

          {/* TAB: ESIM */}
          {activeTab === "esim" && (
            <>
              <div className="bg-[#1A1F26] p-3 rounded-xl border border-white/5 text-[11px] text-slate-300 space-y-1.5">
                <span className="font-semibold text-indigo-300 block text-xs">
                  Airalo Vietnam eSIM
                </span>
                <p className="text-[10px] text-slate-400">
                  Instant 4G connection via Viettel/Vinaphone. Ready the second you touch down in Vietnam.
                </p>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#363299] hover:bg-[#433cc7] text-white font-semibold text-xs sm:text-sm shadow-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Get Airalo eSIM &rsaquo;</span>
              </button>
            </>
          )}
        </form>

        <p className="mt-3.5 text-[9px] text-slate-400 text-center leading-normal">
          * Transparent note: When you book via these links, we may earn an affiliate commission at no extra cost to you.
        </p>
      </div>
    </aside>
  );
}
