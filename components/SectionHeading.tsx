import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllText?: string;
  tag?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  viewAllHref,
  viewAllText = "See all",
  tag,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
      <div>
        {tag && (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-teal-600 mb-2">
            {tag}
          </span>
        )}
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-travel-text tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm sm:text-base text-travel-subtext max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 group shrink-0 min-h-[44px] self-start sm:self-auto"
        >
          <span>{viewAllText}</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}
