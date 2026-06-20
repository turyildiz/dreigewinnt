export const SPORT_CATEGORIES = [
  { label: "Fußball", value: "fussball", icon: "sports_soccer" },
  { label: "Volleyball", value: "volleyball", icon: "sports_volleyball" },
  { label: "Handball", value: "handball", icon: "sports_handball" },
  { label: "Basketball", value: "basketball", icon: "sports_basketball" },
  { label: "Tennis", value: "tennis", icon: "sports_tennis" },
  { label: "Schwimmen", value: "schwimmen", icon: "pool" },
  { label: "Wassersport", value: "wassersport", icon: "rowing" },
  { label: "Leichtathletik", value: "leichtathletik", icon: "directions_run" },
  { label: "Turnen", value: "turnen", icon: "fitness_center" },
  { label: "Kampfsport", value: "kampfsport", icon: "sports_martial_arts" },
  { label: "Radsport", value: "radsport", icon: "pedal_bike" },
  { label: "Reitsport", value: "reitsport", icon: "emoji_nature" },
  { label: "Tanzen", value: "tanzen", icon: "nightlife" },
  { label: "Schießsport", value: "schiesssport", icon: "track_changes" },
  { label: "Tischtennis", value: "tischtennis", icon: "sports_cricket" },
  { label: "Angeln", value: "angeln", icon: "phishing" },
  { label: "Mehrsport", value: "mehrsport", icon: "sports" },
  { label: "Sonstiges", value: "sonstiges_sport", icon: "emoji_events" },
];

export function getSportLabel(sportValue: string | null | undefined): string {
  if (!sportValue) return "";
  const found = SPORT_CATEGORIES.find(c => c.value === sportValue.toLowerCase());
  return found ? found.label : sportValue;
}

export function getSportIcon(sportValue: string | null | undefined): string {
  if (!sportValue) return "sports";
  const found = SPORT_CATEGORIES.find(c => c.value === sportValue.toLowerCase());
  return found ? found.icon : "sports";
}

export const BUSINESS_CATEGORIES = [
  { label: "Gastronomie", value: "gastronomie", icon: "restaurant" },
  { label: "Handwerk", value: "handwerk", icon: "build" },
  { label: "Einzelhandel", value: "einzelhandel", icon: "shopping_bag" },
  { label: "Gesundheit", value: "gesundheit", icon: "medical_services" },
  { label: "Dienstleistung", value: "dienstleistung", icon: "business_center" },
  { label: "Auto & Mobilität", value: "auto", icon: "directions_car" },
  { label: "IT & Digital", value: "digital", icon: "computer" },
  { label: "Fitness", value: "fitness", icon: "fitness_center" },
  { label: "Sport & Freizeit", value: "sport", icon: "sports_soccer" },
  { label: "Transport & Logistik", value: "transport", icon: "local_shipping" },
  { label: "Finanzen", value: "finanzen", icon: "payments" },
  { label: "Hotel & Gastgewerbe", value: "hotel", icon: "hotel" },
  { label: "Kultur", value: "kultur", icon: "theater_comedy" },
  { label: "Beauty & Wellness", value: "beauty", icon: "spa" },
  { label: "Immobilien", value: "immobilien", icon: "home" },
  { label: "Recht & Beratung", value: "recht", icon: "gavel" },
  { label: "Bildung & Soziales", value: "bildung", icon: "school" },
  { label: "Lebensmittel", value: "lebensmittel", icon: "local_grocery_store" },
  { label: "Sonstiges", value: "sonstiges", icon: "more_horiz" },
];

export function getCategoryLabel(categoryValue: string | null | undefined): string {
  if (!categoryValue) return "";
  const found = BUSINESS_CATEGORIES.find(c => c.value === categoryValue.toLowerCase());
  return found ? found.label : categoryValue;
}

export function getCategoryIcon(categoryValue: string | null | undefined): string {
  if (!categoryValue) return "storefront";
  const c = categoryValue.toLowerCase();
  
  const found = BUSINESS_CATEGORIES.find(cat => cat.value === c);
  if (found) return found.icon;

  // Fallback keyword search for legacy data
  if (c.includes("restaurant") || c.includes("essen")) return "restaurant";
  if (c.includes("bäcker") || c.includes("konditor")) return "bakery_dining";
  if (c.includes("arzt") || c.includes("praxis")) return "medical_services";
  if (c.includes("kosmetik") || c.includes("friseur")) return "spa";
  if (c.includes("anwalt") || c.includes("steuer")) return "gavel";
  if (c.includes("schule") || c.includes("kita")) return "school";
  
  return "storefront";
}
