export type ArtworkGroup =
  | "PAINTING_AND_WALL_ART"
  | "GRAPHICS_AND_PRINTS"
  | "DESIGN_AND_ADVERTISING"
  | "SUBJECTS_AND_THEMES";

export type ArtworkCategory =
  | "PAINTING"
  | "WATERCOLOR"
  | "WALL_PAINTING"
  | "RELIEF"
  | "LITHOGRAPHY"
  | "DRAWING"
  | "EASEL_GRAPHICS"
  | "UNIQUE_GRAPHICS"
  | "BRAND_IDENTITY"
  | "POSTER"
  | "PROJECT"
  | "ADVERTISING"
  | "SOUVENIR"
  | "PORTRAIT"
  | "ARCHITECTURE"
  | "SUBJECT"
  | "LANDSCAPE";

export type PublicArtwork = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  year: number | null;
  widthCm: number | null;
  heightCm: number | null;
  materials: string | null;
  priceCents: number | null;
  currency: string | null;
  artworkGroup: ArtworkGroup | null;
  category: ArtworkCategory;
  image: {
    url: string;
  } | null;
};

export const GROUP_LABELS: Record<ArtworkGroup, string> = {
  PAINTING_AND_WALL_ART: "Живопись и настенное искусство",
  GRAPHICS_AND_PRINTS: "Графика и тиражные работы",
  DESIGN_AND_ADVERTISING: "Дизайн и реклама",
  SUBJECTS_AND_THEMES: "Сюжеты и темы",
};

export const CATEGORY_LABELS: Record<ArtworkCategory, string> = {
  PAINTING: "Живопись",
  WATERCOLOR: "Акварель",
  WALL_PAINTING: "Стенная роспись",
  RELIEF: "Рельеф",

  LITHOGRAPHY: "Литография",
  DRAWING: "Рисунок",
  EASEL_GRAPHICS: "Станковая графика",
  UNIQUE_GRAPHICS: "Уникальная графика",

  BRAND_IDENTITY: "Фирменный стиль",
  POSTER: "Плакат",
  PROJECT: "Проект",
  ADVERTISING: "Реклама",
  SOUVENIR: "Сувенир",

  PORTRAIT: "Портрет",
  ARCHITECTURE: "Архитектура",
  SUBJECT: "Сюжет",
  LANDSCAPE: "Пейзаж",
};

export const GROUP_CATEGORY_MAP: Record<ArtworkGroup, ArtworkCategory[]> = {
  PAINTING_AND_WALL_ART: ["PAINTING", "WATERCOLOR", "WALL_PAINTING", "RELIEF"],
  GRAPHICS_AND_PRINTS: [
    "LITHOGRAPHY",
    "DRAWING",
    "EASEL_GRAPHICS",
    "UNIQUE_GRAPHICS",
  ],
  DESIGN_AND_ADVERTISING: [
    "BRAND_IDENTITY",
    "POSTER",
    "PROJECT",
    "ADVERTISING",
    "SOUVENIR",
  ],
  SUBJECTS_AND_THEMES: ["PORTRAIT", "ARCHITECTURE", "SUBJECT", "LANDSCAPE"],
};

export type GroupedArtworks = Record<
  ArtworkGroup,
  Record<ArtworkCategory, PublicArtwork[]>
>;

export function groupArtworksByGroupAndCategory(
  artworks: PublicArtwork[],
): GroupedArtworks {
  const result = {} as GroupedArtworks;

  for (const group of Object.keys(GROUP_CATEGORY_MAP) as ArtworkGroup[]) {
    result[group] = {} as Record<ArtworkCategory, PublicArtwork[]>;
    for (const category of GROUP_CATEGORY_MAP[group]) {
      result[group][category] = [];
    }
  }

  for (const artwork of artworks) {
    if (!artwork.artworkGroup) continue;

    const group = artwork.artworkGroup;
    const allowedCategories = GROUP_CATEGORY_MAP[group];

    if (!allowedCategories.includes(artwork.category)) continue;

    result[group][artwork.category].push(artwork);
  }

  return result;
}
