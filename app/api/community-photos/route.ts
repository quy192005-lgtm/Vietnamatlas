import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PLACES_FILE_PATH = path.join(process.cwd(), "data", "places.json");

function readPlaces(): any[] {
  try {
    const data = fs.readFileSync(PLACES_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read places.json:", err);
    return [];
  }
}

function writePlaces(places: any[]): boolean {
  try {
    fs.writeFileSync(PLACES_FILE_PATH, JSON.stringify(places, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Failed to write places.json:", err);
    return false;
  }
}

// 1. GET: List all community photos flattened with place info
export async function GET() {
  try {
    const places = readPlaces();
    const photos: any[] = [];

    places.forEach((p) => {
      if (Array.isArray(p.extra_photos)) {
        p.extra_photos.forEach((photo: any, idx: number) => {
          photos.push({
            id: `${p.slug}-${idx}`,
            place_slug: p.slug,
            place_name_en: p.name_en || p.name,
            place_name: p.name,
            city: p.city,
            region: p.region,
            src: photo.src,
            credit_name: photo.credit_name,
            index: idx,
          });
        });
      }
    });

    return NextResponse.json({
      success: true,
      total: photos.length,
      photos,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. POST: Add a new community photo to a place
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { place_slug, src, credit_name } = body;

    if (!place_slug || !src) {
      return NextResponse.json(
        { error: "place_slug and src are required" },
        { status: 400 }
      );
    }

    const places = readPlaces();
    const target = places.find((p) => p.slug === place_slug);

    if (!target) {
      return NextResponse.json(
        { error: `Place with slug "${place_slug}" not found` },
        { status: 404 }
      );
    }

    if (!Array.isArray(target.extra_photos)) {
      target.extra_photos = [];
    }

    const newPhoto = {
      src: src.trim(),
      credit_name: (credit_name || "Community Member").trim(),
    };

    target.extra_photos.push(newPhoto);
    writePlaces(places);

    return NextResponse.json({
      success: true,
      message: `Added photo to ${target.name_en}`,
      photo: newPhoto,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 3. PUT: Update an existing community photo
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { place_slug, index, src, credit_name } = body;

    if (!place_slug || index === undefined || !src) {
      return NextResponse.json(
        { error: "place_slug, index, and src are required" },
        { status: 400 }
      );
    }

    const places = readPlaces();
    const target = places.find((p) => p.slug === place_slug);

    if (!target || !Array.isArray(target.extra_photos) || !target.extra_photos[index]) {
      return NextResponse.json(
        { error: "Target photo not found" },
        { status: 404 }
      );
    }

    target.extra_photos[index] = {
      src: src.trim(),
      credit_name: (credit_name || target.extra_photos[index].credit_name || "Community Member").trim(),
    };

    writePlaces(places);

    return NextResponse.json({
      success: true,
      message: `Updated photo for ${target.name_en}`,
      photo: target.extra_photos[index],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 4. DELETE: Remove a community photo
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const place_slug = searchParams.get("place_slug");
    const indexStr = searchParams.get("index");

    if (!place_slug || indexStr === null) {
      return NextResponse.json(
        { error: "place_slug and index are required" },
        { status: 400 }
      );
    }

    const index = parseInt(indexStr, 10);
    const places = readPlaces();
    const target = places.find((p) => p.slug === place_slug);

    if (!target || !Array.isArray(target.extra_photos) || index < 0 || index >= target.extra_photos.length) {
      return NextResponse.json(
        { error: "Target photo not found" },
        { status: 404 }
      );
    }

    const removed = target.extra_photos.splice(index, 1);
    writePlaces(places);

    return NextResponse.json({
      success: true,
      message: `Removed photo from ${target.name_en}`,
      removed,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
