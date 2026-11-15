"use client";

import { useState } from "react";
import { AFFILIATES } from "@/config/affiliates";
import {
  Hotel,
  Train,
  Bus,
  Ticket,
  Smartphone,
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
      {/* BOOK YOUR STAY WIDGET */}
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
