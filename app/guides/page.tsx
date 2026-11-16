import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllGuides } from "@/data/guides";
import Breadcrumb from "@/components/Breadcrumb";
import { Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Practical Vietnam Travel Guides",
  description:
    "Essential, honest travel advice for Vietnam: booking train tickets, choosing eSIMs, official e-visas, and airport transfers without scams.",
};

export const revalidate = 60;

export default async function GuidesIndexPage() {
  const guides = await getAllGuides();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumb items={[{ label: "Guides" }]} />

      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-2 block">
          Honest Field Advice
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-travel-text tracking-tight mb-4">
          Practical Travel Guides
        </h1>
        <p className="text-base text-travel-subtext leading-relaxed">
          Written by locals to solve real logistical friction points: purchasing sleeper train berths with international cards, securing mobile data upon touchdown, avoiding visa scams, and airport transport.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {guides.map((guide) => (
          <article
            key={guide.slug}
            className="group bg-white rounded-3xl border border-travel-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
          >
            <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
              <Image
                src={guide.heroImage}
                alt={guide.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-teal-700 shadow-sm">
                  {guide.category}
                </span>
              </div>

              {/* LAW 2: Photo credit */}
              <div className="absolute bottom-2 right-3 text-[10px] text-white/80">
                Photo: {guide.photoCredit} — {guide.photoLicense}
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-xs text-travel-subtext mb-2">
                <Clock className="w-3.5 h-3.5 text-teal-500" />
                <span>{guide.readingTime}</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold text-travel-text group-hover:text-teal-600 transition-colors mb-3 leading-snug">
                <Link href={`/guides/${guide.slug}`}>
                  {guide.title}
                </Link>
              </h2>

              <p className="text-sm text-travel-subtext leading-relaxed mb-6 flex-1">
                {guide.subtitle}
              </p>

              <div className="pt-4 border-t border-travel-border flex items-center justify-between text-sm font-semibold text-teal-600 group-hover:text-teal-700">
                <span>Read complete guide</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
