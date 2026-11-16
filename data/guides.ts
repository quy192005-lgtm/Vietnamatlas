import guidesData from "./guides.json";
import { dbGetAllGuides, dbGetGuideBySlug } from "@/lib/db";

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

export async function getAllGuides(): Promise<GuideArticle[]> {
  const guides = await dbGetAllGuides();
  return guides as GuideArticle[];
}

export async function getGuideBySlug(slug: string): Promise<GuideArticle | undefined> {
  const guide = await dbGetGuideBySlug(slug);
  return (guide as GuideArticle) || undefined;
}

export function getAllGuidesSync(): GuideArticle[] {
  return GUIDES;
}
