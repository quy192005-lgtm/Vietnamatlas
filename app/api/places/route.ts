import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  dbGetAllPlaces,
  dbGetPlaceBySlug,
  dbSavePlace,
  dbDeletePlace,
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

// 1. GET: List places with search, filter, pagination & stats
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const region = searchParams.get("region") || "all";
  const published = searchParams.get("published") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const allPlaces = await dbGetAllPlaces();

  // Calculate overall stats
  const totalCount = allPlaces.length;
  const publishedCount = allPlaces.filter((p) => p.published).length;
  const draftCount = totalCount - publishedCount;

  // Filter
  let filtered = allPlaces;

  if (q) {
    filtered = filtered.filter(
      (p) =>
        (p.name_en && p.name_en.toLowerCase().includes(q)) ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.city && p.city.toLowerCase().includes(q)) ||
        (p.area && p.area.toLowerCase().includes(q)) ||
        (p.category_en && p.category_en.toLowerCase().includes(q))
    );
  }

  if (region !== "all") {
    filtered = filtered.filter((p) => p.region === region);
  }

  if (published === "true") {
    filtered = filtered.filter((p) => p.published === true);
  } else if (published === "false") {
    filtered = filtered.filter((p) => !p.published);
  }

  const filteredTotal = filtered.length;
  const totalPages = Math.ceil(filteredTotal / limit) || 1;
  const validPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (validPage - 1) * limit;
  const paginatedPlaces = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    places: paginatedPlaces,
    pagination: {
      page: validPage,
      limit,
      total: filteredTotal,
      totalPages,
    },
    stats: {
      total: totalCount,
      published: publishedCount,
      draft: draftCount,
    },
  });
}

// 2. POST: Add a new place
export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const allPlaces = await dbGetAllPlaces();

    if (!body.name_en && !body.name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const nameEn = body.name_en || body.name;
    let slug = body.slug ? generateSlug(body.slug) : generateSlug(nameEn);

    // Ensure unique slug
    if (allPlaces.some((p) => p.slug === slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newPlace = {
      name: body.name || nameEn,
      name_en: nameEn,
      slug,
      category: body.category || "Địa điểm",
      category_en: body.category_en || "Attractions",
      area: body.area || body.city || "Vietnam",
      city: body.city || "Hanoi",
      city_slug: generateSlug(body.city || "Hanoi"),
      region: body.region || "north",
      desc: body.desc || "",
      desc_en: body.desc_en || body.desc || "",
      photo_url: body.photo_url || "",
      photo_page: body.photo_page || "",
      photo_credit: body.photo_credit || "Owner",
      photo_license: body.photo_license || "Public domain",
      photo_status: body.photo_url ? "ok" : "missing",
      lat: body.lat ? parseFloat(body.lat) : null,
      lng: body.lng ? parseFloat(body.lng) : null,
      maps_url:
        body.maps_url ||
        (body.lat && body.lng
          ? `https://www.google.com/maps/search/?api=1&query=${body.lat},${body.lng}`
          : ""),
      published: Boolean(body.published),
      extra_photos: Array.isArray(body.extra_photos) ? body.extra_photos : [],
    };

    const result = await dbSavePlace(newPlace);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to save place" }, { status: 500 });
    }

    return NextResponse.json({ success: true, place: result.place });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 3. PUT: Edit an existing place
export async function PUT(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required to update place" },
        { status: 400 }
      );
    }

    const current = await dbGetPlaceBySlug(slug);
    if (!current) {
      return NextResponse.json(
        { error: `Place with slug "${slug}" not found` },
        { status: 404 }
      );
    }

    // Update fields
    const newLat = body.lat !== undefined ? (body.lat ? parseFloat(body.lat) : null) : current.lat;
    const newLng = body.lng !== undefined ? (body.lng ? parseFloat(body.lng) : null) : current.lng;

    const updated = {
      ...current,
      ...body,
      slug: current.slug,
      photo_status: (body.photo_url || current.photo_url) ? "ok" : "missing",
      lat: newLat,
      lng: newLng,
      maps_url:
        body.maps_url ||
        (newLat && newLng
          ? `https://www.google.com/maps/search/?api=1&query=${newLat},${newLng}`
          : current.maps_url),
      published: body.published !== undefined ? Boolean(body.published) : current.published,
    };

    const result = await dbSavePlace(updated);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to update place" }, { status: 500 });
    }

    return NextResponse.json({ success: true, place: result.place });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 4. PATCH: Quick toggle publish status
export async function PATCH(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { slug, published } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const current = await dbGetPlaceBySlug(slug);
    if (!current) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    current.published = Boolean(published);
    const result = await dbSavePlace(current);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to update status" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      slug,
      published: current.published,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 5. DELETE: Delete a place
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

    const result = await dbDeletePlace(slug);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to delete place" }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedSlug: slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
