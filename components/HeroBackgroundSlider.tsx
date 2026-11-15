"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export interface HeroSlide {
  title: string;
  url: string;
  credit: string;
  license: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    title: "Hoi An Ancient Town",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-06.jpg/1920px-H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-06.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    credit: "Steffen Schmitz",
    license: "CC BY-SA 4.0",
  },
  {
    title: "Golden Bridge, Ba Na Hills, Da Nang",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Aerial_view_of_the_Golden_Bridge%2C_Ba_Na_Hills%2C_Da_Nang%2C_Vietnam.jpg/1920px-Aerial_view_of_the_Golden_Bridge%2C_Ba_Na_Hills%2C_Da_Nang%2C_Vietnam.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    credit: "Vivu Vietnam",
    license: "CC BY-SA 4.0",
  },
  {
    title: "Trang An Scenic Landscape, Ninh Binh",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Trang_An_Landscape_Complex%2C_Ninh_Binh_Province%2C_Vietnam%2C_20240202_1433_5283.jpg/1920px-Trang_An_Landscape_Complex%2C_Ninh_Binh_Province%2C_Vietnam%2C_20240202_1433_5283.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    credit: "Jakub Hałun",
    license: "CC BY 4.0",
  },
  {
    title: "Hoan Kiem Lake, Hanoi",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Hoan_Kiem_Lake_-_Hanoi%2C_Vietnam_-_DSC03687.JPG/1920px-Hoan_Kiem_Lake_-_Hanoi%2C_Vietnam_-_DSC03687.JPG",
    credit: "Daderot",
    license: "CC0",
  },
  {
    title: "Saigon Central Post Office, Ho Chi Minh City",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Saigon_Central_Post_Office_20190922.jpg/1920px-Saigon_Central_Post_Office_20190922.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    credit: "Suicasmo",
    license: "CC BY-SA 4.0",
  },
  {
    title: "Hue Imperial City",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/Vietnam%2C_Hue%2C_Imperial_City_of_Hue%2C_Enclosure.jpg/1920px-Vietnam%2C_Hue%2C_Imperial_City_of_Hue%2C_Enclosure.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    credit: "Vyacheslav Argenberg",
    license: "CC BY 4.0",
  },
];

export default function HeroBackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto transition every 4 seconds (4000ms) as requested by user
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const currentSlide = HERO_SLIDES[currentIndex];

  return (
    <>
      {/* Background Images with smooth crossfade */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.url}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.url}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover opacity-50 brightness-95 transform scale-105 transition-transform duration-[4000ms]"
              sizes="100vw"
            />
          </div>
        ))}

        {/* Gradient Overlay to keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60 z-10" />
      </div>

      {/* Slide indicators / dots (Bottom Left) */}
      <div className="absolute bottom-4 left-6 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => setCurrentIndex(index)}
            aria-label={`Jump to ${slide.title}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-6 bg-teal-400 shadow-sm"
                : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Dynamic Photo Credit (Bottom Right - LAW 2 compliant) */}
      <div className="absolute bottom-3 right-4 z-20 text-[10px] text-white/80 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10 transition-all duration-500">
        <span>
          Photo: <strong className="text-white font-medium">{currentSlide.credit}</strong> — {currentSlide.license}, via Wikimedia Commons
        </span>
      </div>
    </>
  );
}
