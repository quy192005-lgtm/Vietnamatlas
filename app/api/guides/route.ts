import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const GUIDES_FILE_PATH = path.join(process.cwd(), "data", "guides.json");

function readGuides(): any[] {
  try {
    const data = fs.readFileSync(GUIDES_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read guides.json:", err);
    return [];
  }
}

function writeGuides(guides: any[]): boolean {
  try {
    fs.writeFileSync(GUIDES_FILE_PATH, JSON.stringify(guides, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Failed to write guides.json:", err);
    return false;
  }
}

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
  const guides = readGuides();
  return NextResponse.json({ guides, total: guides.length });
}

// 2. POST: Add a new guide
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const guides = readGuides();

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

    guides.unshift(newGuide);
    writeGuides(guides);

    return NextResponse.json({ success: true, guide: newGuide });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 3. PUT: Edit a guide
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const guides = readGuides();
    const index = guides.findIndex((g) => g.slug === slug);

    if (index === -1) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    const current = guides[index];
    const updated = {
      ...current,
      ...body,
      slug: current.slug,
    };

    guides[index] = updated;
    writeGuides(guides);

    return NextResponse.json({ success: true, guide: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 4. DELETE: Delete a guide
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const guides = readGuides();
    const filtered = guides.filter((g) => g.slug !== slug);

    if (filtered.length === guides.length) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    writeGuides(filtered);

    return NextResponse.json({ success: true, deletedSlug: slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
