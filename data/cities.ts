export interface CityDetails {
  city_slug: string;
  name: string;
  localName: string;
  region: "north" | "central" | "south";
  description: string;
  travelTips: string;
}

export const CITIES_DATA: Record<string, CityDetails> = {
  hanoi: {
    city_slug: "hanoi",
    name: "Hanoi",
    localName: "Hà Nội",
    region: "north",
    description: "Vietnam's capital city is a sensory feast of ancient tree-lined boulevards, peaceful lakes, buzzing scooter streets, and world-class street food in the historic Old Quarter.",
    travelTips: "Best explored early morning around Hoan Kiem Lake. Try traditional egg coffee and pho in the narrow alleys of the Old Quarter."
  },
  "quang-ninh": {
    city_slug: "quang-ninh",
    name: "Quang Ninh (Ha Long)",
    localName: "Quảng Ninh",
    region: "north",
    description: "Home to the world-renowned UNESCO World Heritage seascape of Ha Long Bay, featuring emerald bays punctuated by thousands of towering limestone karst islands.",
    travelTips: "Book an overnight cruise to experience sunset and sunrise among the quieter outer bays of Bai Tu Long or Lan Ha."
  },
  "ninh-binh": {
    city_slug: "ninh-binh",
    name: "Ninh Binh",
    localName: "Ninh Bình",
    region: "north",
    description: "Often celebrated as Halong Bay on Land, Ninh Binh is famous for dramatic limestone monoliths rising abruptly from tranquil emerald rice paddies and sacred river caves.",
    travelTips: "Rent a bicycle to explore the rural paths around Tam Coc and Trang An early in the morning before tourist buses arrive."
  },
  hue: {
    city_slug: "hue",
    name: "Hue",
    localName: "Huế",
    region: "central",
    description: "The seat of the Nguyen Dynasty from 1802 to 1945, Hue is Vietnam's imperial soul, filled with palaces, pavilions, monumental royal tombs, and spicy royal cuisine along the Perfume River.",
    travelTips: "Hire a private driver or take a dragon boat along the Perfume River to visit the major emperor tombs outside the city center."
  },
  "da-nang": {
    city_slug: "da-nang",
    name: "Da Nang",
    localName: "Đà Nẵng",
    region: "central",
    description: "Vietnam's most livable modern coastal metropolis, offering long sandy beaches, the Marble Mountains, dragon-shaped bridges, and convenient gateway access to Hoi An and Hue.",
    travelTips: "Watch the Dragon Bridge breathe fire and water on Saturday and Sunday evenings at 9:00 PM."
  },
  "quang-nam": {
    city_slug: "quang-nam",
    name: "Hoi An (Quang Nam)",
    localName: "Hội An / Quảng Nam",
    region: "central",
    description: "An exceptionally preserved international trading port dating from the 15th to 19th centuries, famous for lantern-lit canals, tailor shops, and Champa ruins at My Son.",
    travelTips: "The Old Town is pedestrian-only in the late afternoon and evening, perfect for strolling and enjoying cao lau noodles."
  },
  "da-lat": {
    city_slug: "da-lat",
    name: "Da Lat (Lam Dong)",
    localName: "Đà Lạt / Lâm Đồng",
    region: "central",
    description: "Nestled in the Central Highlands at 1,500 meters altitude, Da Lat is renowned for its perpetual springtime climate, pine forests, French villas, and flower farms.",
    travelTips: "Pack a warm sweater or light jacket for cool evening temperatures, and sample hot soymilk and grilled rice paper at the night market."
  },
  "ho-chi-minh-city": {
    city_slug: "ho-chi-minh-city",
    name: "Ho Chi Minh City",
    localName: "TP. Hồ Chí Minh (Sài Gòn)",
    region: "south",
    description: "The economic powerhouse and largest metropolis of Vietnam, brimming with high-octane energy, historic French colonial landmarks, rooftop skybars, and street food carts.",
    travelTips: "Download the Grab app for seamless taxi and motorbike rides. District 1 and District 3 are the most convenient areas for first-time visitors."
  }
};
