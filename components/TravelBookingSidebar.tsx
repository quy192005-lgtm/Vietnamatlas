"use client";

import { useState } from "react";
import { AFFILIATES } from "@/config/affiliates";
import {
  Hotel,
  Train,
  Bus,
  Ticket,
  Smartphone,
  MapPin,
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

  const tabLabels = {
    stays: "Stay",
    trains: "Trains",
    buses: "Buses",
    tours: "Tours",
    esim: "eSIM",
  };

  return (
    <aside className={`w-full ${className}`}>
      {/* POP-OUT REDESIGNED TRAVEL BOOKING WIDGET */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)] hover:shadow-[0_30px_60px_-15px_rgba(13,148,136,0.25)] border border-slate-200/90 ring-1 ring-amber-500/15 transition-all duration-300">
        
        {/* 1. Header: PLAN & RESERVE + Book Your [Gold Metallic] Stay */}
        <div className="text-center mb-6">
          <span className="block text-[12px] font-extrabold uppercase tracking-[2px] text-[#0F5132] mb-1.5">
            PLAN &amp; RESERVE
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A202C]">
            Book Your{" "}
            <span className="text-[#B59410] drop-shadow-sm font-black transition-colors">
              {tabLabels[activeTab]}
            </span>
          </h3>
        </div>

        {/* 2. 5 Tabs Bar: Emerald Green active accent */}
        <div className="grid grid-cols-5 gap-1.5 p-1.5 bg-[#F8FAFC] rounded-2xl mb-6 border border-slate-200/80 text-center">
          {/* Stays */}
          <button
            type="button"
            onClick={() => setActiveTab("stays")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] sm:text-[11px] transition-all min-h-[46px] ${
              activeTab === "stays"
                ? "bg-[#0D9488] text-white font-bold shadow-[0_4px_12px_rgba(13,148,136,0.35)]"
                : "text-slate-500 hover:text-slate-900 hover:bg-white font-medium"
            }`}
          >
            <Hotel className="w-4 h-4 mb-1" />
            <span>Stays</span>
          </button>

          {/* Trains */}
          <button
            type="button"
            onClick={() => setActiveTab("trains")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] sm:text-[11px] transition-all min-h-[46px] ${
              activeTab === "trains"
                ? "bg-[#0D9488] text-white font-bold shadow-[0_4px_12px_rgba(13,148,136,0.35)]"
                : "text-slate-500 hover:text-slate-900 hover:bg-white font-medium"
            }`}
          >
            <Train className="w-4 h-4 mb-1" />
            <span>Trains</span>
          </button>

          {/* Buses */}
          <button
            type="button"
            onClick={() => setActiveTab("buses")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] sm:text-[11px] transition-all min-h-[46px] ${
              activeTab === "buses"
                ? "bg-[#0D9488] text-white font-bold shadow-[0_4px_12px_rgba(13,148,136,0.35)]"
                : "text-slate-500 hover:text-slate-900 hover:bg-white font-medium"
            }`}
          >
            <Bus className="w-4 h-4 mb-1" />
            <span>Buses</span>
          </button>

          {/* Tours */}
          <button
            type="button"
            onClick={() => setActiveTab("tours")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] sm:text-[11px] transition-all min-h-[46px] ${
              activeTab === "tours"
                ? "bg-[#0D9488] text-white font-bold shadow-[0_4px_12px_rgba(13,148,136,0.35)]"
                : "text-slate-500 hover:text-slate-900 hover:bg-white font-medium"
            }`}
          >
            <Ticket className="w-4 h-4 mb-1" />
            <span>Tours</span>
          </button>

          {/* eSIM */}
          <button
            type="button"
            onClick={() => setActiveTab("esim")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] sm:text-[11px] transition-all min-h-[46px] ${
              activeTab === "esim"
                ? "bg-[#0D9488] text-white font-bold shadow-[0_4px_12px_rgba(13,148,136,0.35)]"
                : "text-slate-500 hover:text-slate-900 hover:bg-white font-medium"
            }`}
          >
            <Smartphone className="w-4 h-4 mb-1" />
            <span>eSIM</span>
          </button>
        </div>

        {/* 3. Input Form with clear hierarchy */}
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          {/* TAB: STAYS */}
          {activeTab === "stays" && (
            <>
              <div>
                <label className="block text-[12px] font-bold text-[#374151] mb-1.5 flex items-center justify-between">
                  <span>City / Destination:</span>
                  <span className="text-[11px] font-semibold text-[#B59410] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#B59410]" /> Vietnam
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] hover:border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#111827] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all appearance-none cursor-pointer"
                  >
                    {citiesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    ▼
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#374151] mb-1.5">
                    Check-in:
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] hover:border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-[#111827] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#374151] mb-1.5">
                    Nights:
                  </label>
                  <div className="relative">
                    <select
                      value={nights}
                      onChange={(e) => setNights(e.target.value)}
                      className="w-full bg-[#F9FAFB] border border-[#E5E7EB] hover:border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-[#111827] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="1 night">1 night</option>
                      <option value="2 nights">2 nights</option>
                      <option value="3 nights">3 nights</option>
                      <option value="5 nights">5 nights</option>
                      <option value="7 nights">7 nights</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                      ▼
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#374151] mb-1.5">
                  Booking Partner:
                </label>
                <div className="relative">
                  <select
                    value={partner}
                    onChange={(e) => setPartner(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] hover:border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#111827] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Booking.com">Booking.com (Guaranteed Best Rate)</option>
                    <option value="Agoda">Agoda (Popular in Asia)</option>
                  </select>
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    ▼
                  </span>
                </div>
              </div>

              {/* 4. High-impact CTA Button with Gold Metallic Border */}
              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-sm sm:text-base border-2 border-[#B59410] shadow-[0_10px_20px_-3px_rgba(13,148,136,0.45)] hover:shadow-[0_14px_28px_-4px_rgba(181,148,16,0.45)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 min-h-[50px] cursor-pointer"
              >
                <span>Search Hotels on {partner}</span>
                <span className="text-[#FDE68A] text-lg font-bold">&rsaquo;</span>
              </button>
            </>
          )}

          {/* TAB: TRAINS / BUSES */}
          {(activeTab === "trains" || activeTab === "buses") && (
            <>
              <div>
                <label className="block text-[12px] font-bold text-[#374151] mb-1.5">
                  From Origin:
                </label>
                <div className="relative">
                  <select
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] hover:border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#111827] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all appearance-none cursor-pointer"
                  >
                    {citiesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    ▼
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#374151] mb-1.5">
                  To Destination:
                </label>
                <div className="relative">
                  <select
                    value={destCity}
                    onChange={(e) => setDestCity(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] hover:border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#111827] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all appearance-none cursor-pointer"
                  >
                    {citiesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    ▼
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#374151] mb-1.5">
                  Departure Date:
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] hover:border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#111827] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all cursor-pointer"
                />
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-sm sm:text-base border-2 border-[#B59410] shadow-[0_10px_20px_-3px_rgba(13,148,136,0.45)] hover:shadow-[0_14px_28px_-4px_rgba(181,148,16,0.45)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 min-h-[50px] cursor-pointer"
              >
                <span>Search {activeTab === "trains" ? "Trains" : "Buses"} on 12Go</span>
                <span className="text-[#FDE68A] text-lg font-bold">&rsaquo;</span>
              </button>
            </>
          )}

          {/* TAB: TOURS */}
          {activeTab === "tours" && (
            <>
              <div>
                <label className="block text-[12px] font-bold text-[#374151] mb-1.5">
                  Destination / Activity:
                </label>
                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] hover:border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#111827] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all appearance-none cursor-pointer"
                  >
                    {citiesList.map((c) => (
                      <option key={c} value={c}>
                        {c}, Vietnam
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    ▼
                  </span>
                </div>
              </div>

              <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200/60 text-xs text-emerald-950 leading-relaxed font-medium">
                ⭐ Browse verified day tours, island boat cruises, cooking workshops, and attraction tickets with instant mobile confirmation.
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-sm sm:text-base border-2 border-[#B59410] shadow-[0_10px_20px_-3px_rgba(13,148,136,0.45)] hover:shadow-[0_14px_28px_-4px_rgba(181,148,16,0.45)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 min-h-[50px] cursor-pointer"
              >
                <span>Search Tours on Klook</span>
                <span className="text-[#FDE68A] text-lg font-bold">&rsaquo;</span>
              </button>
            </>
          )}

          {/* TAB: ESIM */}
          {activeTab === "esim" && (
            <>
              <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200/60 text-xs text-emerald-950 space-y-1.5">
                <span className="font-bold text-[#0F5132] block text-sm flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#B59410]" /> Airalo Vietnam 4G/LTE eSIM
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                  Instant mobile data connection via Viettel/Vinaphone. Ready the second you touch down in Vietnam without queuing for physical SIM cards.
                </p>
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-sm sm:text-base border-2 border-[#B59410] shadow-[0_10px_20px_-3px_rgba(13,148,136,0.45)] hover:shadow-[0_14px_28px_-4px_rgba(181,148,16,0.45)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 min-h-[50px] cursor-pointer"
              >
                <span>Get Airalo eSIM Data</span>
                <span className="text-[#FDE68A] text-lg font-bold">&rsaquo;</span>
              </button>
            </>
          )}
        </form>

        {/* 5. Subtitle & Transparency note */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 leading-relaxed font-normal">
            * Transparent note: When you book via these links, we may earn an affiliate commission at no extra cost to you.
          </p>
        </div>
      </div>
    </aside>
  );
}
