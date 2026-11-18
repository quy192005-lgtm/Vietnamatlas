import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// 1. Manually parse .env.local if present
const envLocalPath = path.join(rootDir, ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.substring(0, eqIdx).trim();
        const val = trimmed.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project") || supabaseKey.includes("your-")) {
  console.error("\x1b[31m[ERROR] Supabase credentials not found in .env.local!\x1b[0m");
  console.log("\nPlease add your Supabase credentials to .env.local:");
  console.log("NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co");
  console.log("SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

async function seedDatabase() {
  console.log("\x1b[36m============================================================\x1b[0m");
  console.log("\x1b[36m   VIETNAM ATLAS - SEEDING SUPABASE DATABASE\x1b[0m");
  console.log("\x1b[36m============================================================\x1b[0m\n");
  console.log(`Connecting to: \x1b[33m${supabaseUrl}\x1b[0m\n`);

  // 1. Seed Cities
  const citiesPath = path.join(rootDir, "data", "cities.json");
  if (fs.existsSync(citiesPath)) {
    const cities = JSON.parse(fs.readFileSync(citiesPath, "utf8"));
    console.log(`[1/3] Seeding ${cities.length} cities...`);
    
    const formattedCities = cities.map((c) => ({
      city_slug: c.city_slug,
      city: c.city,
      region: c.region || "north",
      photo_url: c.photo_url || "",
      photo_credit: c.photo_credit || "",
      photo_license: c.photo_license || "",
      photo_page: c.photo_page || "",
    }));

    const { error: cityErr } = await supabase
      .from("cities")
      .upsert(formattedCities, { onConflict: "city_slug" });

    if (cityErr) {
      console.error("\x1b[31mFailed to seed cities:\x1b[0m", cityErr.message);
    } else {
      console.log(`\x1b[32m✔ Successfully seeded ${cities.length} cities.\x1b[0m`);
    }
  }

  // 2. Seed Guides
  const guidesPath = path.join(rootDir, "data", "guides.json");
  if (fs.existsSync(guidesPath)) {
    const guides = JSON.parse(fs.readFileSync(guidesPath, "utf8"));
    console.log(`\n[2/3] Seeding ${guides.length} travel guides...`);

    const formattedGuides = guides.map((g) => ({
      slug: g.slug,
      title: g.title,
      subtitle: g.subtitle || "",
      reading_time: g.readingTime || "5 min read",
      category: g.category || "Field Advice",
      hero_image: g.heroImage || "",
      photo_credit: g.photoCredit || "Wikimedia Commons",
      photo_license: g.photoLicense || "CC BY-SA 4.0",
      photo_page: g.photoPage || "",
      problem_statement: g.problemStatement || "",
      steps: g.steps || [],
      tips: g.tips || [],
      faq: g.faq || [],
      cta: g.cta || {},
    }));

    const { error: guideErr } = await supabase
      .from("guides")
      .upsert(formattedGuides, { onConflict: "slug" });

    if (guideErr) {
      console.error("\x1b[31mFailed to seed guides:\x1b[0m", guideErr.message);
    } else {
      console.log(`\x1b[32m✔ Successfully seeded ${guides.length} travel guides.\x1b[0m`);
    }
  }

  // 3. Seed Places in Batches
  const placesPath = path.join(rootDir, "data", "places.json");
  if (fs.existsSync(placesPath)) {
    const places = JSON.parse(fs.readFileSync(placesPath, "utf8"));
    console.log(`\n[3/3] Seeding ${places.length} places (in batches of 100)...`);

    const formattedPlaces = places.map((p) => ({
      slug: p.slug,
      name: p.name,
      name_en: p.name_en || p.name,
      category: p.category || "Địa điểm",
      category_en: p.category_en || "Attractions",
      area: p.area || "",
      city: p.city || "",
      city_slug: p.city_slug || "",
      region: p.region || "north",
      desc: p.desc || "",
      desc_en: p.desc_en || "",
      photo_url: p.photo_url || "",
      photo_page: p.photo_page || "",
      photo_license: p.photo_license || "Public domain",
      photo_credit: p.photo_credit || "Owner",
      photo_status: p.photo_status || (p.photo_url ? "ok" : "missing"),
      lat: p.lat !== undefined ? p.lat : null,
      lng: p.lng !== undefined ? p.lng : null,
      maps_url: p.maps_url || "",
      published: Boolean(p.published),
      extra_photos: Array.isArray(p.extra_photos) ? p.extra_photos : [],
      gallery_photos: Array.isArray(p.gallery_photos) ? p.gallery_photos : [],
    }));

    const BATCH_SIZE = 100;
    let seededCount = 0;
    let hasGalleryColumn = true;

    for (let i = 0; i < formattedPlaces.length; i += BATCH_SIZE) {
      let batch = formattedPlaces.slice(i, i + BATCH_SIZE);
      if (!hasGalleryColumn) {
        batch = batch.map(({ gallery_photos, ...rest }) => rest);
      }

      let { error: placeErr } = await supabase
        .from("places")
        .upsert(batch, { onConflict: "slug" });

      if (placeErr && placeErr.message.includes("gallery_photos")) {
        hasGalleryColumn = false;
        console.warn("\x1b[33m⚠ Supabase table 'places' lacks 'gallery_photos' column. Retrying batch without gallery_photos...\x1b[0m");
        const fallbackBatch = batch.map(({ gallery_photos, ...rest }) => rest);
        const { error: retryErr } = await supabase
          .from("places")
          .upsert(fallbackBatch, { onConflict: "slug" });
        placeErr = retryErr;
      }

      if (placeErr) {
        console.error(`\x1b[31mError seeding batch ${i / BATCH_SIZE + 1}:\x1b[0m`, placeErr.message);
      } else {
        seededCount += batch.length;
        process.stdout.write(`  Seeded ${seededCount}/${formattedPlaces.length} places...\r`);
      }
    }

    console.log(`\n\x1b[32m✔ Successfully seeded ${seededCount} places to Supabase.\x1b[0m`);
    if (!hasGalleryColumn) {
      console.log("\x1b[33m💡 TIP: To enable gallery photos in Supabase, execute this in Supabase SQL Editor:\x1b[0m");
      console.log("\x1b[36mALTER TABLE public.places ADD COLUMN IF NOT EXISTS gallery_photos JSONB DEFAULT '[]'::jsonb;\x1b[0m");
      console.log("\x1b[33mThen re-run: npm run db:seed\x1b[0m");
    }
  }

  console.log("\n\x1b[36m============================================================\x1b[0m");
  console.log("\x1b[32m   🎉 DATABASE SEEDING COMPLETE! ALL SYSTEMS OPERATIONAL\x1b[0m");
  console.log("\x1b[36m============================================================\x1b[0m\n");
}

seedDatabase().catch((err) => {
  console.error("\x1b[31mFatal error during seeding:\x1b[0m", err);
  process.exit(1);
});
