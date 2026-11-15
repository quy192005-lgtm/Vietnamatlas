"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE_NAME } from "@/config/site";
import { Search, Menu, X, ChevronDown, Compass, MapPin, BookOpen, Info, Camera } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-travel-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group py-2">
            <span className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm group-hover:bg-teal-600 transition-colors">
              V
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-travel-text group-hover:text-teal-500 transition-colors">
                {SITE_NAME}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {/* Destinations Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDestDropdownOpen(true)}
              onMouseLeave={() => setDestDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-travel-text hover:text-teal-500 hover:bg-teal-50 transition-colors min-h-[44px]"
                aria-expanded={destDropdownOpen}
              >
                <Compass className="w-4 h-4 text-teal-500" />
                Destinations
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {destDropdownOpen && (
                <div className="absolute top-full left-0 w-64 pt-1 shadow-card-hover rounded-2xl bg-white border border-travel-border overflow-hidden animate-fadeIn">
                  <div className="py-2">
                    <Link
                      href="/destinations"
                      className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-teal-600 hover:bg-teal-50"
                      onClick={() => setDestDropdownOpen(false)}
                    >
                      Browse All Destinations &rarr;
                    </Link>
                    <div className="h-px bg-travel-border my-1" />
                    <Link
                      href="/regions/north"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-travel-text hover:bg-teal-50 hover:text-teal-600 transition-colors"
                      onClick={() => setDestDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-teal-500" />
                      North Vietnam
                    </Link>
                    <Link
                      href="/regions/central"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-travel-text hover:bg-teal-50 hover:text-teal-600 transition-colors"
                      onClick={() => setDestDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Central Vietnam
                    </Link>
                    <Link
                      href="/regions/south"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-travel-text hover:bg-teal-50 hover:text-teal-600 transition-colors"
                      onClick={() => setDestDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      South Vietnam
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/guides"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-travel-text hover:text-teal-500 hover:bg-teal-50 transition-colors min-h-[44px]"
            >
              <BookOpen className="w-4 h-4 text-teal-500" />
              Guides
            </Link>

            <Link
              href="/map"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-travel-text hover:text-teal-500 hover:bg-teal-50 transition-colors min-h-[44px]"
            >
              <MapPin className="w-4 h-4 text-teal-500" />
              Map
            </Link>

            <Link
              href="/traveller-photos"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-travel-text hover:text-teal-500 hover:bg-teal-50 transition-colors min-h-[44px]"
            >
              <Camera className="w-4 h-4 text-teal-500" />
              Traveller Photos
            </Link>

            <Link
              href="/about"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-travel-text hover:text-teal-500 hover:bg-teal-50 transition-colors min-h-[44px]"
            >
              <Info className="w-4 h-4 text-teal-500" />
              About
            </Link>
          </nav>

          {/* Right Action: Search Button */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              aria-label="Search places"
              className="flex items-center justify-center w-11 h-11 rounded-full text-travel-text hover:text-teal-500 hover:bg-teal-50 border border-transparent hover:border-travel-border transition-colors min-w-[44px] min-h-[44px]"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg text-travel-text hover:bg-teal-50 min-w-[44px] min-h-[44px]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-travel-border bg-white px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          <Link
            href="/destinations"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-3 rounded-xl text-base font-medium text-travel-text hover:bg-teal-50 min-h-[44px]"
          >
            <span className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-500" />
              All Destinations
            </span>
          </Link>
          <div className="pl-6 space-y-1">
            <Link
              href="/regions/north"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-travel-subtext hover:text-teal-600 min-h-[44px] flex items-center"
            >
              • North Vietnam
            </Link>
            <Link
              href="/regions/central"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-travel-subtext hover:text-teal-600 min-h-[44px] flex items-center"
            >
              • Central Vietnam
            </Link>
            <Link
              href="/regions/south"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-travel-subtext hover:text-teal-600 min-h-[44px] flex items-center"
            >
              • South Vietnam
            </Link>
          </div>
          <Link
            href="/guides"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-3 rounded-xl text-base font-medium text-travel-text hover:bg-teal-50 min-h-[44px]"
          >
            <BookOpen className="w-5 h-5 text-teal-500" />
            Practical Guides
          </Link>
          <Link
            href="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-3 rounded-xl text-base font-medium text-travel-text hover:bg-teal-50 min-h-[44px]"
          >
            <MapPin className="w-5 h-5 text-teal-500" />
            Interactive Map
          </Link>
          <Link
            href="/traveller-photos"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-3 rounded-xl text-base font-medium text-travel-text hover:bg-teal-50 min-h-[44px]"
          >
            <Camera className="w-5 h-5 text-teal-500" />
            Traveller Photos
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-3 rounded-xl text-base font-medium text-travel-text hover:bg-teal-50 min-h-[44px]"
          >
            <Info className="w-5 h-5 text-teal-500" />
            About This Site
          </Link>
          <div className="pt-2">
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-teal-500 text-white rounded-xl font-medium min-h-[44px]"
            >
              <Search className="w-4 h-4" />
              Search Places
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
