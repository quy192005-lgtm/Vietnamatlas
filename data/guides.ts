import guidesData from "./guides.json";

export interface GuideStep {
  step: number;
  title: string;
  description: string;
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideArticle {
  slug: string;
  title: string;
  subtitle: string;
  readingTime: string;
  category: string;
  heroImage: string;
  photoCredit: string;
  photoLicense: string;
  photoPage: string;
  problemStatement: string;
  steps: GuideStep[];
  tips: string[];
  faq: GuideFaq[];
  cta: {
    title: string;
    description: string;
    buttonText: string;
    partnerName: string;
    linkKey: "twelveGo" | "booking" | "klook" | "airalo" | "official";
    officialUrl?: string;
    disclosure: string;
  };
}

export const GUIDES: GuideArticle[] = guidesData as GuideArticle[];

export function getAllGuides(): GuideArticle[] {
  return GUIDES;
}

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
