import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/config/site";
import { AFFILIATES } from "@/config/affiliates";
import { getAllGuides, getGuideBySlug } from "@/data/guides";
import Breadcrumb from "@/components/Breadcrumb";
import AdSlot from "@/components/AdSlot";
import {
  Clock,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

interface GuidePageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const guides = await getAllGuides();
  return guides.map((g) => ({
    slug: g.slug,
  }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const guide = await getGuideBySlug(params.slug);
  if (!guide) return { title: "Guide Not Found" };

  return {
    title: `${guide.title}`,
    description: guide.subtitle,
    openGraph: {
      title: `${guide.title} | ${SITE_NAME}`,
      description: guide.subtitle,
      type: "article",
      images: [{ url: guide.heroImage }],
    },
  };
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const [guide, allGuides] = await Promise.all([
    getGuideBySlug(params.slug),
    getAllGuides(),
  ]);
  if (!guide) {
    notFound();
  }

  const otherGuides = allGuides.filter((g) => g.slug !== guide.slug);

  // Determine CTA URL
  let ctaUrl = "#";
  if (guide.cta.linkKey === "official") {
    ctaUrl = guide.cta.officialUrl || "https://evisa.gov.vn";
  } else if (guide.cta.linkKey && AFFILIATES[guide.cta.linkKey]) {
    ctaUrl = AFFILIATES[guide.cta.linkKey];
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Guides", href: "/guides" },
          { label: guide.title },
        ]}
      />

      {/* 2. Article Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            {guide.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-travel-subtext">
            <Clock className="w-3.5 h-3.5 text-teal-500" />
            {guide.readingTime}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-travel-text tracking-tight leading-tight">
          {guide.title}
        </h1>

        <p className="text-lg sm:text-xl text-travel-subtext leading-relaxed font-normal">
          {guide.subtitle}
        </p>
      </div>

      {/* 3. Hero Image with LAW 2 Credit */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-travel-border shadow-card aspect-[16/9]">
        <Image
          src={guide.heroImage}
          alt={guide.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 896px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        <div className="absolute bottom-3 left-4 right-4 text-xs text-white/90 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
          <span>
            Photo: {guide.photoCredit} — {guide.photoLicense}, via Wikimedia Commons
          </span>
          {guide.photoPage && (
            <a
              href={guide.photoPage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-teal-300 hover:text-white underline font-medium text-[11px]"
            >
              source <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* 4. Problem Statement Callout */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 sm:p-8 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h2 className="font-serif text-lg font-bold text-amber-950 mb-1.5">
            The Reality for First-Time Travelers
          </h2>
          <p className="text-sm sm:text-base text-amber-900/90 leading-relaxed">
            {guide.problemStatement}
          </p>
        </div>
      </div>

      {/* 5. Step-by-Step Instructions */}
      <section className="space-y-6 pt-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-travel-text">
          Step-by-Step Guide
        </h2>

        <div className="space-y-6">
          {guide.steps.map((s) => (
            <div
              key={s.step}
              className="bg-white rounded-2xl border border-travel-border p-6 shadow-sm flex items-start gap-4"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500 text-white font-serif font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
                {s.step}
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg font-bold text-travel-text mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-travel-subtext leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Practical Tips */}
      <section className="bg-travel-muted rounded-3xl border border-travel-border p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-teal-700">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-travel-text">
            Pro Tips & Local Advice
          </h2>
        </div>

        <ul className="space-y-3">
          {guide.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-travel-text">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 7. Frequently Asked Questions (FAQ - 3 Q&As) */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-teal-600" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-travel-text">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {guide.faq.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-travel-border p-6 shadow-sm"
            >
              <h3 className="font-serif text-base sm:text-lg font-bold text-travel-text mb-2">
                {item.question}
              </h3>
              <p className="text-sm text-travel-subtext leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Call to Action (Affiliate or Official Portal - LAW 4) */}
      <section className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-teal-300 block mb-2">
            Recommended Next Step
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
            {guide.cta.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {guide.cta.description}
          </p>
        </div>

        <div>
          <a
            href={ctaUrl}
            target="_blank"
            rel={guide.cta.linkKey === "official" ? "noopener noreferrer" : "nofollow sponsored noopener"}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-sm sm:text-base shadow-lg transition-all min-h-[44px]"
          >
            <span>{guide.cta.buttonText}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="pt-4 border-t border-white/15 text-xs text-slate-400">
          <p>{guide.cta.disclosure}</p>
        </div>
      </section>

      {/* NV-10: AdSlot */}
      <AdSlot format="horizontal" />

      {/* 9. Read Next Guides */}
      <section className="pt-8 border-t border-travel-border">
        <h2 className="font-serif text-2xl font-bold text-travel-text mb-6">
          More Travel Guides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {otherGuides.map((og) => (
            <Link
              key={og.slug}
              href={`/guides/${og.slug}`}
              className="group bg-white rounded-2xl border border-travel-border p-5 hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-semibold uppercase text-teal-600 mb-1 block">
                  {og.category}
                </span>
                <h3 className="font-serif text-base font-bold text-travel-text group-hover:text-teal-600 transition-colors line-clamp-2 mb-2">
                  {og.title}
                </h3>
              </div>
              <div className="text-xs font-semibold text-teal-600 flex items-center gap-1 mt-4">
                <span>Read guide</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
