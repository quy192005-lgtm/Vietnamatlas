import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { isSupabaseConfigured, getSupabaseAdmin, getSupabaseClient } from "./supabase";

const PLACES_FILE = path.join(process.cwd(), "data", "places.json");
const CITIES_FILE = path.join(process.cwd(), "data", "cities.json");
const GUIDES_FILE = path.join(process.cwd(), "data", "guides.json");

// ==========================================
// 1. LOCAL FILE HELPERS (SAFE FALLBACK)
// ==========================================

export function readLocalJson<T = any>(filePath: string): T[] {
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[DB] Failed to read ${path.basename(filePath)}:`, err);
    return [];
  }
}

export function writeLocalJson(filePath: string, data: any): boolean {
  try {
    // Only attempt write if writable (will gracefully fail on read-only serverless environments like Vercel)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch {
    // Expected on read-only file systems (e.g. Vercel deployment)
    console.warn(`[DB] File write skipped or failed for ${path.basename(filePath)} (normal on Vercel)`);
    return false;
  }
}

// ==========================================
// 2. REVALIDATION HELPER
// ==========================================

export function revalidateTravelCache(options?: {
  placeSlug?: string;
  citySlug?: string;
  region?: string;
  guideSlug?: string;
}) {
  try {
    revalidatePath("/");
    revalidatePath("/destinations");
    revalidatePath("/map");
    revalidatePath("/search");
    revalidatePath("/traveller-photos");
    revalidatePath("/sitemap.xml");

    if (options?.placeSlug) {
      revalidatePath(`/places/${options.placeSlug}`);
    }
    if (options?.citySlug) {
      revalidatePath(`/cities/${options.citySlug}`);
    }
    if (options?.region) {
      revalidatePath(`/regions/${options.region}`);
    }
    if (options?.guideSlug) {
      revalidatePath("/guides");
      revalidatePath(`/guides/${options.guideSlug}`);
    }
  } catch (err) {
    // revalidatePath only works in request/server action contexts
    console.warn("[DB] Cache revalidation skipped:", err);
  }
}

// ==========================================
// 3. PLACES (CRUD + QUERIES)
// ==========================================

export async function dbGetAllPlaces(): Promise<any[]> {
  if (isSupabaseConfigured()) {
    try {
      const client = getSupabaseAdmin() || getSupabaseClient();
      if (client) {
        // Fetch up to 2000 places sorted
        const { data, error } = await client
          .from("places")
          .select("*")
          .order("name_en", { ascending: true })
          .limit(2000);

        if (!error && Array.isArray(data) && data.length > 0) {
          return data;
        }
        if (error) {
          console.warn("[DB] Supabase places error, falling back to JSON:", error.message);
        }
      }
    } catch (err) {
      console.warn("[DB] Supabase query failed, using local JSON fallback:", err);
    }
  }

  return readLocalJson(PLACES_FILE);
}

export async function dbGetPublishedPlaces(): Promise<any[]> {
  if (isSupabaseConfigured()) {
    try {
      const client = getSupabaseClient() || getSupabaseAdmin();
      if (client) {
        const { data, error } = await client
          .from("places")
          .select("*")
          .eq("published", true)
          .order("name_en", { ascending: true })
          .limit(2000);

        if (!error && Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn("[DB] Supabase published places query failed, falling back to JSON:", err);
    }
  }

  const all = readLocalJson(PLACES_FILE);
  return all.filter((p) => p.published);
}

export async function dbGetPlaceBySlug(slug: string): Promise<any | null> {
  if (isSupabaseConfigured()) {
    try {
      const client = getSupabaseAdmin() || getSupabaseClient();
      if (client) {
        const { data, error } = await client
          .from("places")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (!error && data) return data;
      }
    } catch (err) {
      console.warn(`[DB] Supabase getPlaceBySlug (${slug}) failed:`, err);
    }
  }

  const all = readLocalJson(PLACES_FILE);
  return all.find((p) => p.slug === slug) || null;
}

export async function dbSavePlace(place: any): Promise<{ success: boolean; place: any; error?: string }> {
  // 1. Save to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const client = getSupabaseAdmin();
      if (client) {
        const dbRecord = {
          slug: place.slug,
          name: place.name,
          name_en: place.name_en || place.name,
          category: place.category || "Địa điểm",
          category_en: place.category_en || "Attractions",
          area: place.area || "",
          city: place.city || "",
          city_slug: place.city_slug || "",
          region: place.region || "north",
          desc: place.desc || "",
          desc_en: place.desc_en || "",
          photo_url: place.photo_url || "",
          photo_page: place.photo_page || "",
          photo_license: place.photo_license || "Public domain",
          photo_credit: place.photo_credit || "Owner",
          photo_status: place.photo_status || (place.photo_url ? "ok" : "missing"),
          lat: place.lat !== undefined ? place.lat : null,
          lng: place.lng !== undefined ? place.lng : null,
          maps_url: place.maps_url || "",
          published: Boolean(place.published),
          extra_photos: Array.isArray(place.extra_photos) ? place.extra_photos : [],
        };

        const { data, error } = await client
          .from("places")
          .upsert(dbRecord, { onConflict: "slug" })
          .select()
          .single();

        if (error) {
          console.error("[DB] Supabase upsert place error:", error);
          return { success: false, place, error: error.message };
        }

        // Sync local JSON if possible
        const all = readLocalJson(PLACES_FILE);
        const idx = all.findIndex((p) => p.slug === place.slug);
        if (idx >= 0) all[idx] = { ...all[idx], ...place };
        else all.unshift(place);
        writeLocalJson(PLACES_FILE, all);

        revalidateTravelCache({ placeSlug: place.slug, citySlug: place.city_slug, region: place.region });
        return { success: true, place: data || place };
      }
    } catch (err: any) {
      console.error("[DB] Supabase savePlace failed:", err);
      return { success: false, place, error: err.message };
    }
  }

  // 2. Fallback to local JSON
  const all = readLocalJson(PLACES_FILE);
  const idx = all.findIndex((p) => p.slug === place.slug);
  if (idx >= 0) all[idx] = { ...all[idx], ...place };
  else all.unshift(place);
  writeLocalJson(PLACES_FILE, all);

  revalidateTravelCache({ placeSlug: place.slug, citySlug: place.city_slug, region: place.region });
  return { success: true, place };
}

export async function dbDeletePlace(slug: string): Promise<{ success: boolean; error?: string }> {
  let targetPlace: any = null;

  if (isSupabaseConfigured()) {
    try {
      const client = getSupabaseAdmin();
      if (client) {
        // Fetch place info first for cache invalidation
        const { data } = await client.from("places").select("city_slug, region").eq("slug", slug).maybeSingle();
        targetPlace = data;

        const { error } = await client.from("places").delete().eq("slug", slug);
        if (error) {
          console.error("[DB] Supabase delete place error:", error);
          return { success: false, error: error.message };
        }
      }
    } catch (err: any) {
      console.error("[DB] Supabase deletePlace failed:", err);
      return { success: false, error: err.message };
    }
  }

  // Sync local JSON
  const all = readLocalJson(PLACES_FILE);
  const found = all.find((p) => p.slug === slug);
  if (found) targetPlace = targetPlace || found;
  const filtered = all.filter((p) => p.slug !== slug);
  writeLocalJson(PLACES_FILE, filtered);

  revalidateTravelCache({
    placeSlug: slug,
    citySlug: targetPlace?.city_slug,
    region: targetPlace?.region,
  });

  return { success: true };
}

// ==========================================
// 4. CITIES (CRUD + QUERIES)
// ==========================================

export async function dbGetCities(): Promise<any[]> {
  if (isSupabaseConfigured()) {
    try {
      const client = getSupabaseClient() || getSupabaseAdmin();
      if (client) {
        const { data, error } = await client
          .from("cities")
          .select("*")
          .order("city", { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn("[DB] Supabase cities query failed, using JSON:", err);
    }
  }

  return readLocalJson(CITIES_FILE);
}

export async function dbSaveCity(city: any): Promise<{ success: boolean; city: any; error?: string }> {
  if (isSupabaseConfigured()) {
    try {
      const client = getSupabaseAdmin();
      if (client) {
        const dbRecord = {
          city_slug: city.city_slug,
          city: city.city,
          region: city.region || "north",
          photo_url: city.photo_url || "",
          photo_credit: city.photo_credit || "",
          photo_license: city.photo_license || "",
          photo_page: city.photo_page || "",
        };

        const { data, error } = await client
          .from("cities")
          .upsert(dbRecord, { onConflict: "city_slug" })
          .select()
          .single();

        if (error) {
          console.error("[DB] Supabase upsert city error:", error);
          return { success: false, city, error: error.message };
        }

        // Sync local JSON
        const all = readLocalJson(CITIES_FILE);
        const idx = all.findIndex((c) => c.city_slug === city.city_slug);
        if (idx >= 0) all[idx] = { ...all[idx], ...city };
        else all.push(city);
        writeLocalJson(CITIES_FILE, all);

        revalidateTravelCache({ citySlug: city.city_slug, region: city.region });
        return { success: true, city: data || city };
      }
    } catch (err: any) {
      console.error("[DB] Supabase saveCity failed:", err);
      return { success: false, city, error: err.message };
    }
  }

  const all = readLocalJson(CITIES_FILE);
  const idx = all.findIndex((c) => c.city_slug === city.city_slug);
  if (idx >= 0) all[idx] = { ...all[idx], ...city };
  else all.push(city);
  writeLocalJson(CITIES_FILE, all);

  revalidateTravelCache({ citySlug: city.city_slug, region: city.region });
  return { success: true, city };
}

// ==========================================
// 5. GUIDES (CRUD + QUERIES)
// ==========================================

function normalizeGuideFromDb(item: any): any {
  if (!item) return null;
  return {
    slug: item.slug,
    title: item.title,
    subtitle: item.subtitle || "",
    readingTime: item.reading_time || item.readingTime || "5 min read",
    category: item.category || "Field Advice",
    heroImage: item.hero_image || item.heroImage || "",
    photoCredit: item.photo_credit || item.photoCredit || "Wikimedia Commons",
    photoLicense: item.photo_license || item.photoLicense || "CC BY-SA 4.0",
    photoPage: item.photo_page || item.photoPage || "",
    problemStatement: item.problem_statement || item.problemStatement || "",
    steps: Array.isArray(item.steps) ? item.steps : [],
    tips: Array.isArray(item.tips) ? item.tips : [],
    faq: Array.isArray(item.faq) ? item.faq : [],
    cta: item.cta || {},
  };
}

export async function dbGetAllGuides(): Promise<any[]> {
  if (isSupabaseConfigured()) {
    try {
      const client = getSupabaseClient() || getSupabaseAdmin();
      if (client) {
        const { data, error } = await client
          .from("guides")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map(normalizeGuideFromDb);
        }
      }
    } catch (err) {
      console.warn("[DB] Supabase guides query failed, using JSON:", err);
    }
  }

  return readLocalJson(GUIDES_FILE);
}

export async function dbGetGuideBySlug(slug: string): Promise<any | null> {
  if (isSupabaseConfigured()) {
    try {
      const client = getSupabaseClient() || getSupabaseAdmin();
      if (client) {
        const { data, error } = await client
          .from("guides")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (!error && data) return normalizeGuideFromDb(data);
      }
    } catch (err) {
      console.warn(`[DB] Supabase getGuideBySlug (${slug}) failed:`, err);
    }
  }

  const all = readLocalJson(GUIDES_FILE);
  return all.find((g) => g.slug === slug) || null;
}

export async function dbSaveGuide(guide: any): Promise<{ success: boolean; guide: any; error?: string }> {
  if (isSupabaseConfigured()) {
    try {
      const client = getSupabaseAdmin();
      if (client) {
        const dbRecord = {
          slug: guide.slug,
          title: guide.title,
          subtitle: guide.subtitle || "",
          reading_time: guide.readingTime || guide.reading_time || "5 min read",
          category: guide.category || "Field Advice",
          hero_image: guide.heroImage || guide.hero_image || "",
          photo_credit: guide.photoCredit || guide.photo_credit || "Wikimedia Commons",
          photo_license: guide.photoLicense || guide.photo_license || "CC BY-SA 4.0",
          photo_page: guide.photoPage || guide.photo_page || "",
          problem_statement: guide.problemStatement || guide.problem_statement || "",
          steps: Array.isArray(guide.steps) ? guide.steps : [],
          tips: Array.isArray(guide.tips) ? guide.tips : [],
          faq: Array.isArray(guide.faq) ? guide.faq : [],
          cta: guide.cta || {},
        };

        const { data, error } = await client
          .from("guides")
          .upsert(dbRecord, { onConflict: "slug" })
          .select()
          .single();

        if (error) {
          console.error("[DB] Supabase upsert guide error:", error);
          return { success: false, guide, error: error.message };
        }

        // Sync local JSON
        const all = readLocalJson(GUIDES_FILE);
        const idx = all.findIndex((g) => g.slug === guide.slug);
        if (idx >= 0) all[idx] = { ...all[idx], ...guide };
        else all.unshift(guide);
        writeLocalJson(GUIDES_FILE, all);

        revalidateTravelCache({ guideSlug: guide.slug });
        return { success: true, guide: normalizeGuideFromDb(data) || guide };
      }
    } catch (err: any) {
      console.error("[DB] Supabase saveGuide failed:", err);
      return { success: false, guide, error: err.message };
    }
  }

  const all = readLocalJson(GUIDES_FILE);
  const idx = all.findIndex((g) => g.slug === guide.slug);
  if (idx >= 0) all[idx] = { ...all[idx], ...guide };
  else all.unshift(guide);
  writeLocalJson(GUIDES_FILE, all);

  revalidateTravelCache({ guideSlug: guide.slug });
  return { success: true, guide };
}

export async function dbDeleteGuide(slug: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured()) {
    try {
      const client = getSupabaseAdmin();
      if (client) {
        const { error } = await client.from("guides").delete().eq("slug", slug);
        if (error) {
          console.error("[DB] Supabase delete guide error:", error);
          return { success: false, error: error.message };
        }
      }
    } catch (err: any) {
      console.error("[DB] Supabase deleteGuide failed:", err);
      return { success: false, error: err.message };
    }
  }

  const all = readLocalJson(GUIDES_FILE);
  const filtered = all.filter((g) => g.slug !== slug);
  writeLocalJson(GUIDES_FILE, filtered);

  revalidateTravelCache({ guideSlug: slug });
  return { success: true };
}
