import placesData from "./places.json";

export interface Place {
  // 12 raw fields
  name: string;
  category: string;
  area: string;
  desc: string;
  photo_url: string;
  photo_page: string;
  photo_license: string;
  photo_credit: string;
  photo_status: "ok" | "missing" | string;
  lat: number | null;
  lng: number | null;
  maps_url: string;

  // 7 derived fields
  slug: string;
  name_en: string;
  desc_en: string;
  category_en: string;
  region: "north" | "central" | "south";
  city: string;
  city_slug: string;
  published: boolean;
}

export interface CityInfo {
  city: string;
  city_slug: string;
  region: "north" | "central" | "south";
  count: number;
  photo_url: string;
  photo_credit: string;
  photo_license: string;
  photo_page: string;
}

const allPlaces: Place[] = placesData as Place[];

export function getAllPlaces(): Place[] {
  return allPlaces;
}

export function getPublishedPlaces(): Place[] {
  return allPlaces.filter((p) => p.published);
}

export function getPlaceBySlug(slug: string): Place | undefined {
  return allPlaces.find((p) => p.slug === slug && p.published);
}

export function getPlacesByRegion(region: string): Place[] {
  return allPlaces
    .filter((p) => p.published && p.region === region)
    .sort((a, b) => {
      // Points with photo first, then alphabetical by name_en
      if (a.photo_status === "ok" && b.photo_status !== "ok") return -1;
      if (a.photo_status !== "ok" && b.photo_status === "ok") return 1;
      return a.name_en.localeCompare(b.name_en);
    });
}

export function getPlacesByCity(city_slug: string): Place[] {
  return allPlaces
    .filter((p) => p.published && p.city_slug === city_slug)
    .sort((a, b) => {
      if (a.photo_status === "ok" && b.photo_status !== "ok") return -1;
      if (a.photo_status !== "ok" && b.photo_status === "ok") return 1;
      return a.name_en.localeCompare(b.name_en);
    });
}

export function getCities(): CityInfo[] {
  const published = getPublishedPlaces();
  const map = new Map<string, { city: string; city_slug: string; region: "north" | "central" | "south"; places: Place[] }>();

  published.forEach((p) => {
    if (!map.has(p.city_slug)) {
      map.set(p.city_slug, {
        city: p.city,
        city_slug: p.city_slug,
        region: p.region,
        places: [],
      });
    }
    map.get(p.city_slug)!.places.push(p);
  });

  const list: CityInfo[] = [];
  map.forEach((val) => {
    const photoPlace = val.places.find((p) => p.photo_status === "ok" && p.photo_url) || val.places[0];
    list.push({
      city: val.city,
      city_slug: val.city_slug,
      region: val.region,
      count: val.places.length,
      photo_url: photoPlace ? photoPlace.photo_url : "",
      photo_credit: photoPlace ? photoPlace.photo_credit : "",
      photo_license: photoPlace ? photoPlace.photo_license : "",
      photo_page: photoPlace ? photoPlace.photo_page : "",
    });
  });

  // Sort descending by place count
  return list.sort((a, b) => b.count - a.count);
}

export function getNearbyPlaces(place: Place, count = 4): Place[] {
  const published = getPublishedPlaces().filter((p) => p.slug !== place.slug);
  
  // 1. Same city
  const sameCity = published.filter((p) => p.city_slug === place.city_slug);
  if (sameCity.length >= count) {
    return sameCity.slice(0, count);
  }

  // 2. Same region if not enough in same city
  const result = [...sameCity];
  const sameRegion = published.filter(
    (p) => p.region === place.region && p.city_slug !== place.city_slug
  );
  
  for (const item of sameRegion) {
    if (result.length >= count) break;
    result.push(item);
  }

  // 3. Any other published place if still short
  if (result.length < count) {
    for (const item of published) {
      if (result.length >= count) break;
      if (!result.some((r) => r.slug === item.slug)) {
        result.push(item);
      }
    }
  }

  return result.slice(0, count);
}

// Log build info as specified in NV-01 step 7
if (process.env.NODE_ENV !== "test") {
  const published = getPublishedPlaces();
  const byRegion = {
    north: published.filter((p) => p.region === "north").length,
    central: published.filter((p) => p.region === "central").length,
    south: published.filter((p) => p.region === "south").length,
  };
  console.log(`[VIETNAM ATLAS BUILD] Total places: ${allPlaces.length}`);
  console.log(`[VIETNAM ATLAS BUILD] Published places: ${published.length}`);
  console.log(`[VIETNAM ATLAS BUILD] Cities count: ${getCities().length}`);
  console.log(`[VIETNAM ATLAS BUILD] Region distribution: North=${byRegion.north}, Central=${byRegion.central}, South=${byRegion.south}`);
}
