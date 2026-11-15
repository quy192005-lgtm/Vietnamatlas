export interface RegionInfo {
  id: "north" | "central" | "south";
  name: string;
  tagline: string;
  description: string;
  climate: string;
  bestTime: string;
  heroImage: string;
  photoCredit: string;
  photoLicense: string;
  photoPage: string;
}

export const REGIONS: Record<"north" | "central" | "south", RegionInfo> = {
  north: {
    id: "north",
    name: "North Vietnam",
    tagline: "Dramatic karst landscapes, misty mountain passes, and millennial history",
    description:
      "Northern Vietnam is the historical cradle of Vietnamese civilization, characterized by dramatic limestone karsts, millennia-old temple complexes, and terraced mountain landscapes. From the ancient colonial alleys and street food heritage of Hanoi to the otherworldly emerald waters of Ha Long Bay and the serene rivers of Ninh Binh, this region offers deep cultural heritage and breathtaking topography.",
    climate: "Four distinct seasons with cool, misty winters (December to February) and warm, humid summers.",
    bestTime: "September to November (autumn) and March to April (spring) offer mild temperatures and clear skies.",
    heroImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Hoan_Kiem_Lake_-_Hanoi%2C_Vietnam_-_DSC03687.JPG/1920px-Hoan_Kiem_Lake_-_Hanoi%2C_Vietnam_-_DSC03687.JPG",
    photoCredit: "Daderot",
    photoLicense: "CC0",
    photoPage: "https://commons.wikimedia.org/wiki/File:Hoan_Kiem_Lake_-_Hanoi,_Vietnam_-_DSC03687.JPG"
  },
  central: {
    id: "central",
    name: "Central Vietnam",
    tagline: "Imperial citadels, lantern-lit ancient towns, and sweeping golden beaches",
    description:
      "Central Vietnam represents a mesmerizing tapestry of royal heritage, coastal beauty, and culinary sophistication. The historic imperial capital of Hue is crowned by the Nguyen dynasty citadel and royal tombs, while nearby Hoi An charms travelers with preserved 16th-century merchant houses and evening lantern-lit canals. Modern Da Nang bridges the coast with expansive beaches and world-class architecture, complemented by the cool pine-scented highlands of Da Lat.",
    climate: "Tropical monsoon with a pronounced wet season from September to December and sunny, hot conditions from April to August.",
    bestTime: "February to May for dry, pleasant weather ideal for both coastal exploration and cultural walking tours.",
    heroImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6a/Hoi_An_Ancient_Town_-_Vietnam_-_2022.jpg/1920px-Hoi_An_Ancient_Town_-_Vietnam_-_2022.jpg",
    photoCredit: "Steffen Schmitz",
    photoLicense: "CC BY-SA 4.0",
    photoPage: "https://commons.wikimedia.org/wiki/File:Hoi_An_Ancient_Town_-_Vietnam_-_2022.jpg"
  },
  south: {
    id: "south",
    name: "South Vietnam",
    tagline: "High-octane urban energy, fertile river deltas, and tropical island retreats",
    description:
      "Southern Vietnam is defined by dynamic economic ambition, boundless cafe culture, and tropical waterways. Ho Chi Minh City pulses with vibrant street life, historic colonial landmarks, and trendy rooftop bars. Beyond the metropolis lie the lush labyrinthine canals and floating markets of the Mekong Delta, as well as the secluded sandy bays of Phu Quoc island.",
    climate: "Consistently warm year-round tropical climate with two distinct seasons: dry (December to April) and wet (May to November).",
    bestTime: "December to April when days are sunny, rainfall is minimal, and humidity is comfortable for exploring.",
    heroImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Notre-Dame_Cathedral_Basilica_of_Saigon_in_2019.jpg/1920px-Notre-Dame_Cathedral_Basilica_of_Saigon_in_2019.jpg",
    photoCredit: "Tuấn Anh",
    photoLicense: "CC BY-SA 4.0",
    photoPage: "https://commons.wikimedia.org/wiki/File:Notre-Dame_Cathedral_Basilica_of_Saigon_in_2019.jpg"
  }
};
