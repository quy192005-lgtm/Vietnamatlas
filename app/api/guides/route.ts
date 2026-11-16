import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  dbGetAllGuides,
  dbGetGuideBySlug,
  dbSaveGuide,
  dbDeleteGuide,
} from "@/lib/db";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// 1. GET: List all guides
export async function GET() {
  const guides = await dbGetAllGuides();
  return NextResponse.json({ guides, total: guides.length });
}

// 2. POST: Add a new guide
export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const guides = await dbGetAllGuides();

    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    let slug = body.slug ? generateSlug(body.slug) : generateSlug(body.title);
    if (guides.some((g) => g.slug === slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newGuide = {
      slug,
      title: body.title,
      subtitle: body.subtitle || "",
      readingTime: body.readingTime || "5 min read",
      category: body.category || "Field Advice",
      heroImage: body.heroImage || "",
      photoCredit: body.photoCredit || "Wikimedia Commons",
      photoLicense: body.photoLicense || "CC BY-SA 4.0",
      photoPage: body.photoPage || "",
      problemStatement: body.problemStatement || "",
      steps: body.steps || [
        {
          step: 1,
          title: "Introduction",
          description: "Step-by-step practical advice for traveling in Vietnam.",
        },
      ],
      tips: body.tips || ["Book in advance during Vietnamese holidays."],
      faq: body.faq || [],
      cta: body.cta || {
        title: "Recommended Service",
        description: "Book verified services before departure.",
        buttonText: "Learn More",
        partnerName: "Partner",
        linkKey: "booking",
        disclosure: "Affiliate disclosure note.",
      },
    };

    const result = await dbSaveGuide(newGuide);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to create guide" }, { status: 500 });
    }

    return NextResponse.json({ success: true, guide: result.guide });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 3. PUT: Edit a guide
export async function PUT(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const current = await dbGetGuideBySlug(slug);
    if (!current) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    const updated = {
      ...current,
      ...body,
      slug: current.slug,
    };

    const result = await dbSaveGuide(updated);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to update guide" }, { status: 500 });
    }

    return NextResponse.json({ success: true, guide: result.guide });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 4. DELETE: Delete a guide
export async function DELETE(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const result = await dbDeleteGuide(slug);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to delete guide" }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedSlug: slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
