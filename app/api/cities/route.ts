import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { dbGetCities, dbSaveCity, dbGetAllPlaces } from "@/lib/db";

// 1. GET: List all cities with place counts and available place photos
export async function GET() {
  try {
    const cities = await dbGetCities();
    const places = await dbGetAllPlaces();
    const published = places.filter((p) => p.published);

    // Group places by city_slug
    const cityPlacesMap = new Map<string, any[]>();
    published.forEach((p) => {
      if (!cityPlacesMap.has(p.city_slug)) {
        cityPlacesMap.set(p.city_slug, []);
      }
      cityPlacesMap.get(p.city_slug)!.push(p);
    });

    const enrichedCities = cities.map((c) => {
      const cityPlaces = cityPlacesMap.get(c.city_slug) || [];
      const availablePhotos = cityPlaces
        .filter((p) => p.photo_url && p.photo_url.trim().length > 0)
        .map((p) => ({
          place_name_en: p.name_en || p.name,
          place_slug: p.slug,
          photo_url: p.photo_url,
          photo_credit: p.photo_credit || "Wikimedia Commons",
        }));

      return {
        ...c,
        count: cityPlaces.length,
        available_photos: availablePhotos.slice(0, 12),
      };
    });

    // Sort by count descending
    enrichedCities.sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      total: enrichedCities.length,
      cities: enrichedCities,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. PUT: Update a city's cover photo
export async function PUT(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: "Unauthorized: Admin access required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { city_slug, photo_url, photo_credit, photo_license } = body;

    if (!city_slug) {
      return NextResponse.json(
        { error: "city_slug is required" },
        { status: 400 }
      );
    }

    const cities = await dbGetCities();
    const target = cities.find((c) => c.city_slug === city_slug);

    if (!target) {
      return NextResponse.json(
        { error: `City with slug "${city_slug}" not found` },
        { status: 404 }
      );
    }

    const updatedCity = {
      ...target,
      photo_url: photo_url !== undefined ? photo_url.trim() : target.photo_url,
      photo_credit: photo_credit !== undefined ? photo_credit.trim() : target.photo_credit,
      photo_license: photo_license !== undefined ? photo_license.trim() : target.photo_license,
    };

    const result = await dbSaveCity(updatedCity);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to update city" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Updated cover photo for ${updatedCity.city}`,
      city: result.city,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
